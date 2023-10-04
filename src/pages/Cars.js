import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  notification,
  Space,
  Tooltip,
  Image,
  Descriptions,
  Tag,
  Popover,
  Input,
  Popconfirm,
} from "antd";

import {
  EditOutlined,
  PlusOutlined,
  TagsFilled,
  ToTopOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import moment from "moment";

import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";
import { getEmailMeetConfirm } from "../utils";
import AddOrUpdateModalCars from "../components/Models/AddOrUpdateModalCars";

const { Title } = Typography;

function Cars() {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [refetech, setrefetech] = useState(false);
  const [linkmeet, setlinkmeet] = useState("");

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("");
  const [record, setrecord] = useState({});

  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const hist = useNavigate();

  const [isload, setisload] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/car", config)
      .then((response) => {
        if (response.data) {
          setData(response.data);
          setisload(false);
        } else {
          notification.error({ message: "No Data Found" });
          setisload(false);
        }
      });
  }, [refetech]);

  const handrefetech = () => {
    setrefetech(!refetech);
  };

  const handleDelete = async (id) => {
    setisload(true);
    await axios
      .delete(`http://127.0.0.1:5000/api/car/delete/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        console.log(err);
        setisload(false);
      });
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            className="header-solid h-full"
            bordered={false}
            loading={isload}
            title={[<h6 className="font-semibold m-0"> Cars List</h6>]}
            bodyStyle={{ paddingTop: "0" }}
            extra={
              <Tooltip title="Add">
                <Button
                  type="primary"
                  shape="circle"
                  icon={
                    <PlusOutlined
                      style={{
                        position: "relative",
                        margin: "5px 0px 5px 5px",
                      }}
                    />
                  }
                  size="large"
                  onClick={() => {
                    setVisible(true);
                    setrecord({});
                    setAction("ADD");
                  }}
                />
              </Tooltip>
            }
          >
            <Row gutter={[24, 24]}>
              {data.map((p, index) => (
                <Col span={24} md={12} xl={6} key={index}>
                  <Card
                    bordered={false}
                    className="card-project"
                    cover={<Image alt="slide" src={p.image} />}
                  >
                    <h5>{p.title}</h5>
                    <p>{p.content}</p>
                    <Row
                      gutter={[6, 5]}
                      justify="center"
                      className="card-footer"
                    >
                      <Col>
                        <Button
                          type="button"
                          onClick={() => {
                            setVisible(true);
                            setrecord(p);
                            setAction("EDIT");
                          }}
                        >
                          Edit
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          danger
                          onClick={() => {
                            handleDelete(p.id);
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
              <Col span={24} md={12} xl={6}>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    setAction("ADD");
                    setVisible(true);
                  }}
                  style={{ height: "100%", width: "100%" }}
                >
                  Add New Cars
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <AddOrUpdateModalCars
        visible={visible}
        record={action === "EDIT" ? record : {}}
        refetech={handrefetech}
        type={action}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export default Cars;

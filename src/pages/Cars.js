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
import _ from "lodash";

const { Title } = Typography;

function Cars() {
  const [data, setData] = useState([]);
  const [filetered, setfiletered] = useState([]);

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
      .get("https://www.primocarthageauto.ca/api/car", config)
      .then((response) => {
        if (response.data.car) {
          setData(response.data.car);
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
      .delete(`https://www.primocarthageauto.ca/api/car/delete/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        console.log(err);
        setisload(false);
      });
  };

  const handleTop = async (id) => {
    setisload(true);
    await axios
      .put(`http://www.primocarthageauto.ca/api/car/top/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        console.log(err);
        setisload(false);
      });
  };

  const datatorender = () => {
    if (filetered.length > 0) {
      return filetered;
    } else return data;
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
              <Row>
                <Col md={18}>
                  <Input
                    placeholder="search by name"
                    onChange={(val) => {
                      setfiletered(
                        data.filter((el) =>
                          _.lowerCase(el.name).includes(
                            _.lowerCase(val.target.value)
                          )
                        )
                      );
                    }}
                  />
                </Col>
                <Col md={6}>
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
                </Col>
              </Row>
            }
          >
            <Row gutter={[24, 24]}>
              {datatorender().map((p, index) => (
                <Col span={24} md={12} xl={6} key={index}>
                  <Card
                    bordered={false}
                    className="card-project"
                    cover={<Image alt="slide" src={p.images[0]} />}
                  >
                    <div>
                      {" "}
                      {!p.top ? "" : <strong className="top"> TOP CAR</strong>}
                    </div>

                    <br />

                    <div>
                      <h5>{p.name}</h5>
                      <p>{p.Model}</p>
                    </div>

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
                            handleDelete(p._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          danger={p.top}
                          onClick={() => {
                            handleTop(p._id);
                          }}
                        >
                          {!p.top ? "Maked Top " : "Remove from Top"}
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
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

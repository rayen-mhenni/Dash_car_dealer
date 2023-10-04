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
import AddOrUpdateModalArticle from "../components/Models/AddOrUpdateModalArticle";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function Article() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

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
    axios.get("https://www.PrimoCarthage.fr/api/articles", config).then((response) => {
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
      .delete(`https://www.PrimoCarthage.fr/api/articles/delete/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        console.log(err);
        setisload(false);
      });
  };

  const deletebtn = [
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6L4 16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H12.618L11.8944 2.55279C11.725 2.214 11.3788 2 11 2H9ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V8ZM12 7C11.4477 7 11 7.44772 11 8V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V8C13 7.44772 12.5523 7 12 7Z"
        fill="#111827"
        className="fill-danger"
      ></path>
    </svg>,
  ];

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            className="header-solid h-full"
            bordered={false}
            loading={isload}
            title={[<h6 className="font-semibold m-0"> Articels List</h6>]}
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
                  Add New Article
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <AddOrUpdateModalArticle
        visible={visible}
        record={action === "EDIT" ? record : {}}
        refetech={handrefetech}
        type={action}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export default Article;

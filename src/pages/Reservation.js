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
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import moment from "moment";

import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";
import AddOrUpdateModalPartners from "../components/Models/AddOrUpdateModalPartners";
import { StringToTemplate } from "../utils";
import { isNil } from "lodash";

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

function Reservation() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [refetech, setrefetech] = useState(false);
  const [linkmeet, setlinkmeet] = useState("");

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
      .get("https://www.portalite.fr/api/reservation", config)
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
      .delete(
        `https://www.portalite.fr/api/reservation/delete/${id}`,
        config
      )
      .then(function (response) {
        setisload(false);

        handrefetech();
      })
      .catch(function (err) {
        setisload(false);

        console.log(err);
      });
  };

  const handelConfirm = async (user, meetLink) => {
    axios
      .get(`https://www.portalite.fr/api/emails/CONFMAIL`, config)
      .then((response) => {
        if (response.data) {
          let templateParams;
          templateParams = {
            email: user.email,
            html_temp: StringToTemplate(
              {
                date: `${moment(user.date).format("MMMM Do YYYY, h:mm:ss a")}`,
                meet: meetLink ? "Meet Link: " + meetLink : "",
                name: "Mr or Mm " + user.name,
              },
              response.data.htmlsource
            ),
          };

          emailjs
            .send(
              "service_tgk64kh",
              "template_emypcy4",
              templateParams,
              "BfqX6_cODcX-fbIrw"
            )
            .then(
              async (result) => {
                notification.success({ message: "Confirmed" });
                await axios
                  .put(
                    `https://www.portalite.fr/api/reservation/status/${user.id}`,
                    { status: "CONFIRMED" },
                    config
                  )
                  .then(function (response) {
                    handrefetech();
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
              },
              (error) => {
                notification.error({ message: error.text });
              }
            );
        } else {
          notification.error({ message: "Template email error" });
        }
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

  const information = [
    {
      title: "Oliver Liam",
      description: "Viking Burrito",
      address: "oliver@burrito.com",
      vat: "FRB1235476",
    },
    {
      title: "Lucas Harper",
      description: "Stone Tech Zone",
      address: "lucas@syone-tech.com",
      vat: "FRB1235476",
    },
    {
      title: "Oliver Liam",
      description: "ethan@fiber.com",
      vat: "NumberFRB1235476",
    },
  ];

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            className="header-solid h-full"
            bordered={false}
            loading={isload}
            title={[<h6 className="font-semibold m-0"> Meeting List</h6>]}
            bodyStyle={{ paddingTop: "0" }}
          >
            <Row gutter={[24, 24]}>
              {data.map((i, index) => (
                <Col span={24} key={index}>
                  <Card className="card-billing-info" bordered="false">
                    <div className="col-info">
                      <Descriptions title={"Meet for " + i.name}>
                        <Descriptions.Item label="Full Name" span={3}>
                          {i.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email Address" span={3}>
                          {i.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Number" span={3}>
                          {i.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Meeting Date" span={3}>
                          {moment(i.date).format("MMMM Do YYYY, h:mm:ss a")}
                        </Descriptions.Item>

                        <Descriptions.Item label="Meeting Type" span={3}>
                          {i.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status" span={3}>
                          <Typography.Text
                            strong
                            type={
                              i.status === "CONFIRMED" ? "success" : "warning"
                            }
                          >
                            {i.status}
                          </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date" span={3}>
                          {!isNil(i.created_at) &&
                            moment(i.created_at).format("MMMM Do YYYY")}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                    <div className="col-action">
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(i.id)}
                      >
                        {deletebtn}DELETE
                      </Button>

                      {i.type === "ONLINE" ? (
                        <Popconfirm
                          title={
                            <Row>
                              <Typography.Text>Meet Link:</Typography.Text>
                              <Input
                                value={linkmeet}
                                onChange={(val) => {
                                  setlinkmeet(val.target.value);
                                }}
                              />
                            </Row>
                          }
                          icon={null}
                          okText="Send"
                          onConfirm={() => handelConfirm(i, linkmeet)}
                          onOpenChange={() => {
                            setlinkmeet("");
                          }}
                        >
                          <Button
                            type="link"
                            className="darkbtn"
                            disabled={i.status === "CONFIRMED"}
                          >
                            CONFIRM
                          </Button>
                        </Popconfirm>
                      ) : (
                        <Button
                          type="link"
                          className="darkbtn"
                          onClick={() => handelConfirm(i, null)}
                          disabled={i.status === "CONFIRMED"}
                        >
                          CONFIRM
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Reservation;

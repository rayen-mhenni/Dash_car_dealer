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
import SendMailToContactModel from "../components/Models/SendMailToContactModel";

const { Title } = Typography;


function Contacts() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("");
  const [record, setrecord] = useState({});

  const [refetech, setrefetech] = useState(false);

  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const hist = useNavigate();

  const [isload, setisload] = useState(true);

  useEffect(() => {
    axios
      .get("https://www.primocarthageauto.ca:8433/api/financing", config)
      .then((response) => {
        if (response.data) {
          console.log('ddddd', response)
          setData(response.data.reclamations);
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
      .delete(`https://www.primocarthageauto.ca:8433/api/financing/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        setisload(false);

        console.log(err);
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
            title={[<h6 className="font-semibold m-0"> Financing List</h6>]}
            bodyStyle={{ paddingTop: "0" }}
          >

            <Row gutter={[24, 24]}>
              {data.map((i, index) => (
                <Col span={24} key={index}>
                  <Card className="card-billing-info" bordered="false">
                    <div className="col-info">
                      <Row>
                        <Col md={6}>
                          <Descriptions title={"PERSONAL INFORMATION " + i.Title}>
                            <Descriptions.Item label="Full Name" span={3}>
                              {i.Firstname} {i.Lastname}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email Address" span={3}>
                              {i.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Number" span={3}>
                              {i.Phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Date of birth" span={3}>
                              {i.Dateofbirth}
                            </Descriptions.Item>
                            <Descriptions.Item label="SIN" span={3}>
                              {i.SIN}
                            </Descriptions.Item>
           

                          </Descriptions>

                        </Col>

                        <Col md={6}>
                          <Descriptions title={"CONTACT INFORMATION"}>
                            <Descriptions.Item label="Current Address Duration" span={3}>
                              {i.CurrentAddressDuration}
                            </Descriptions.Item>
                            <Descriptions.Item label="Street" span={3}>
                              {i.Street}
                            </Descriptions.Item>
                            <Descriptions.Item label="City" span={3}>
                              {i.City}
                            </Descriptions.Item>
                            <Descriptions.Item label="Province" span={3}>
                              {i.Province}
                            </Descriptions.Item>
                            <Descriptions.Item label="Postal Code" span={3}>
                              {i.PostalCode}
                            </Descriptions.Item>
       
                          </Descriptions>

                        </Col>


                        <Col md={6}>
                          <Descriptions title={"CURRENT JOB"}>
                            <Descriptions.Item label="Company" span={3}>
                              {i.Company}
                            </Descriptions.Item>
                            <Descriptions.Item label="Position" span={3}>
                              {i.Position}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration" span={3}>
                              {i.Duration}
                            </Descriptions.Item>
                          </Descriptions>

                        </Col>

                        <Col md={6}>
                          <Descriptions title={"FINANCIAL INFORMATION"}>
                            <Descriptions.Item label="Monthly Income" span={3}>
                              {i.MonthlyIncome}
                            </Descriptions.Item>
                            <Descriptions.Item label="Residential Status" span={3}>
                              {i.ResidentialStatus}
                            </Descriptions.Item>
                            <Descriptions.Item label="Monthly Rent" span={3}>
                              {i.MonthlyRent}
                            </Descriptions.Item>

                            <Descriptions.Item label="Date" span={3}>
                              {moment(i.created_at).format("YYYY-MM-DD")}
                            </Descriptions.Item>
                          </Descriptions>

                        </Col>


                      </Row>

                    </div>
                    <div className="col-action">
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(i._id)}
                      >
                        {deletebtn} DELETE
                      </Button>

                      <Button
                        type="link"
                        className="darkbtn"
                        onClick={() => {
                          setVisible(true);
                          setrecord(i);
                          setAction("ADD");
                        }}
                      >
                        SEND EMAIL
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <SendMailToContactModel
        visible={visible}
        record={record}
        refetech={handrefetech}
        type={action}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export default Contacts;

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
} from "antd";

import { EditOutlined, PlusOutlined, ToTopOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";

import moment from "moment";
import AddOrUpdateModalDUser from "../components/Models/AddOrUpdateModalDUser";

const { Title } = Typography;

function Users() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [refetech, setrefetech] = useState(false);
  const [key, setKey] = useState("");

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("");
  const [record, setrecord] = useState({});
  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const color = "#00aaa8";

  const hist = useNavigate();
  const [isload, setisload] = useState(true);

  useEffect(() => {
    axios
      .get("https://www.portalite.fr/api/users", config)
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
        `https://www.portalite.fr/api/users/delete/${id}`,
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

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      render: (val) => <Typography.Text strong>{val}</Typography.Text>,
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "created_at",
      dataIndex: "created_at",
      render: (val) => moment(val).format("YYYY-MM-DD"),
      key: "created_at",
      ellipsis: true,
    },
    {
      title: "updated_at",
      dataIndex: "updated_at",
      render: (val) => moment(val).format("YYYY-MM-DD"),
      key: "updated_at",
      ellipsis: true,
    },

    {
      title: "Action ",

      render: (row, record) => {
        return (
          <Space size="middle" direction="horizontal">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={(e) => {
                setrecord(record);
                setVisible(true);
                setAction("EDIT");
              }}
            >
              Edit
            </Button>
            <Button danger onClick={() => handleDelete(row.id)}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Users Table"
              loading={isload}
              extra={
                <Tooltip title="Add">
                  <Button
                    type="primary"
                    shape="circle"
                    style={{
                      backgroundColor: { color },
                    }}
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
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="ant-border-space"
                  loading={isload}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <AddOrUpdateModalDUser
          visible={visible}
          record={action === "EDIT" ? record : {}}
          refetech={handrefetech}
          type={action}
          onCancel={() => setVisible(false)}
        />
      </div>
    </>
  );
}

export default Users;

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

import AddOrUpdateModalData from "../components/Models/AddOrUpdateModalData";
import moment from "moment";
import AddOrUpdateModalConfig from "../components/Models/AddOrUpdateModalConfig";

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

function Config() {
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
    axios.get("https://www.portalite.fr/api/configurations", config).then((response) => {
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
      .delete(`https://www.portalite.fr/api/configurations/delete/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);

      })
      .catch(function (err) {
        console.log(err);
        setisload(false);

      });
  };

 

  const columns = [
    {
      title: "Frais_gestion",
      dataIndex: "frais_gestion",
      render: (val) => <Typography.Text strong>{val}</Typography.Text>,
      key: "frais_gestion",
    },
    {
      title: "Ind_repas",
      dataIndex: "ind_repas",
      key: "ind_repas",
    },

    {
      title: "Taux_charge",
      key: "taux_charge",
      dataIndex: "taux_charge",
    },
  
    {
      title: "Abon_public",
      key: "abon_public",
      dataIndex: "abon_public",
    },
    // {
    //   title: "Notice",
    //   key: "notice",
    //   dataIndex: "notice",
    // },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
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
              title="Configuration Table"
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
        <AddOrUpdateModalConfig
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

export default Config;

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
} from "antd";

import { EditOutlined, PlusOutlined, ToTopOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";
import AddOrUpdateModalPartners from "../components/Models/AddOrUpdateModalPartners";
import moment from "moment";

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

function Partners() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [data, setData] = useState([]);

  const [refetech, setrefetech] = useState(false);

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
  useEffect(() => {
    axios
      .get("https://www.portalite.fr/api/parteners", config)
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

  const images = importAll(
    require.context("../assets/uploads/", false, /\.(png|jpg|jpe?g|svg|PNG)$/)
  );

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const handleDelete = async (id) => {
    setisload(true);

    await axios
      .delete(`https://www.portalite.fr/api/parteners/delete/${id}`, config)
      .then(function (response) {
        handrefetech();
        setisload(false);

      })
      .catch(function (err) {
        setisload(false);

        console.log(err);
      });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (val, record) => {
        console.log("testtt", images, val, record);
        return (
  
              <Image
                width={100}
                height={60}
                // {images[record.image]?.default}
                // src={images[record.image]?.default}
                src={record.image}
              />
        
        );
      },
      width:200
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "CreatedAt",
      key: "created_at",
      render: (val) => moment(val).format("YYYY-MM-DD"),

      dataIndex: "created_at",
    },
    {
      title: "UpdatedAt",
      key: "updated_at",
      render: (val) => moment(val).format("YYYY-MM-DD"),

      dataIndex: "updated_at",
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
              title="Parteners Table"
              loading={isload}
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
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
        <AddOrUpdateModalPartners
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

export default Partners;

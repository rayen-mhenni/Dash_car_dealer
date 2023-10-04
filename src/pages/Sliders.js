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

import {
  EditOutlined,
  PlusOutlined,
  ToTopOutlined,
  UploadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";

import AddOrUpdateModalData from "../components/Models/AddOrUpdateModalData";
import AddOrUpdateModalSliders from "../components/Models/AddOrUpdateModalSliders";

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

function Sliders() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [data, setData] = useState([]);
  const [refetech, setrefetech] = useState(false);

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("");
  const [record, setrecord] = useState({});

  const [isload, setisload] = useState(false);
  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const color = "#00aaa8";

  const hist = useNavigate();

  useEffect(() => {
    setisload(true);
    axios.get("https://www.portalite.fr/api/sliders", config).then((response) => {
      if (response.data) {
        setData(response.data);
        setisload(false);
      } else {
        setisload(false);
        notification.error({ message: "No Data Found" });
      }
    });
  }, [refetech]);

  const handrefetech = () => {
    setrefetech(!refetech);
  };

  const handleDelete = async (id) => {
    setisload(true);

    await axios
      .delete(`https://www.portalite.fr/api/sliders/delete/${id}`, config)
      .then(function (response) {
        notification.success({ message: "deleted" });
        handrefetech();
        setisload(false);
      })
      .catch(function (err) {
        setisload(false);

        console.log(err);
      });
  };

  return (
    <Card
      bordered={false}
      className="header-solid mb-24"
      title={
        <>
          <h6 className="font-semibold">Sliders</h6>
          <p>Carousel</p>
        </>
      }
      loading={isload}
    >
      <Row gutter={[24, 24]}>
        {data?.map((p, index) => (
          <Col span={24} md={12} xl={6} key={index}>
            <Card
              bordered={false}
              className="card-project"
              cover={<Image alt="slide" src={p.image} />}
            >
              {/* <div className="card-tag">{p.title}</div> */}
              <h5>{p.title}</h5>
              <p>{p.description}</p>
              <Row gutter={[6, 5]} justify="center">
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
            Upload New Slide
          </Button>
        </Col>
      </Row>
      <AddOrUpdateModalSliders
        visible={visible}
        record={action === "EDIT" ? record : {}}
        refetech={handrefetech}
        type={action}
        onCancel={() => setVisible(false)}
      />
    </Card>
  );
}

export default Sliders;

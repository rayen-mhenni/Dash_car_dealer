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

function Semulations() {
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
      .get("https://www.portalite.fr/api/simulations", config)
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

  // email, phone, file
  const handleDelete = async (id) => {
    setisload(true);

    await axios

      .delete(`https://www.portalite.fr/api/simulations/delete/${id}`, config)
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
      title: "Email",
      dataIndex: "email",
      render: (val) => (
        <a className="aRef" href={`mailto:${val}`}>
          {val}
        </a>
      ),
      key: "email",
    },
    {
      title: "Number",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "File",
      render: (val) => (
        <a className="aRef" href={val}>
          Simulation.pdf
        </a>
      ),
      dataIndex: "file",
    },
    {
      title: "CreatedAt",
      key: "created_at",
      render: (val) => moment(val).format("YYYY-MM-DD"),
      dataIndex: "created_at",
    },
    // {
    //   title: "UpdatedAt",
    //   key: "updated_at",
    //   dataIndex: "updated_at",
    //   render: (val) => moment(val).format("YYYY-MM-DD"),
    // },
  ];

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Simulation List"
          >
            <div className="table-responsive">
              <Table
                size="3"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 4, responsive: true }}
                className="ant-border-space"
              />
            </div>
          </Card>
        </Col>
      </Row>
      <AddOrUpdateModalData
        visible={visible}
        record={action === "EDIT" ? record : {}}
        refetech={handrefetech}
        type={action}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export default Semulations;

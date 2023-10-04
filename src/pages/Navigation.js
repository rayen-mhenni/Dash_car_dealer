import Tree, { DataNode } from "antd/lib/tree";
import {
  Button,
  Card,
  Col,
  notification,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJSON } from "../utils";
import axios from "axios";
import AddOrUpdateModalDNavigation from "../components/Models/AddOrUpdateModalDNavigation";

const { Title } = Typography;

function Navigation() {
  const { DirectoryTree } = Tree;

  const [data, setData] = useState([]);
  const [parent, setparent] = useState([]);
  const [user, setUser] = useState([]);
  const [refetech, setrefetech] = useState(false);
  const [treeData, settreeData] = useState("");

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
    axios.get("https://www.portalite.fr/api/nav", config).then((response) => {
      if (response.data) {
        let parent = response.data.map((nav) => ({
          navname: nav?.navname,
          navid: nav?.id,
        }));

        setparent(parent);
        let childs = [];
        response.data.forEach((nav) => {
          nav?.child.forEach((child) => {
            childs.push({
              navname: child?.navname,
              navid: child?.id,
              parentid: child?.parentid,
            });
          });
        });
        setData(parent.concat(childs));
        settreeData(
          response.data.map((nav) => ({
            title: nav.navname,
            key: nav.id,
            children: nav.child.map((child) => ({
              title: child.navname,
              key: child.id,
              isLeaf: true,
            })),
          }))
        );
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
      .delete(`https://www.portalite.fr/api/nav/delete/${id}`, config)
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
      title: "navid",
      key: "navid",
      dataIndex: "navid",
      ellipsis: true,
    },
    {
      title: "navname",
      key: "navname",
      dataIndex: "navname",
      ellipsis: true,
    },
    {
      title: "parent",
      key: "parentid",
      dataIndex: "parentid",
      render: (val) => parent.find((nav) => nav.navid === val)?.navname,
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
            <Button danger disabled={[30,31,32].includes(record.navid)} onClick={() => handleDelete(record.navid)}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const onSelect = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };
  const onExpand = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };
  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Navigation Table"
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
              <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={onSelect}
                onExpand={onExpand}
                treeData={treeData}
              />
            </Card>
          </Col>
        </Row>
        <AddOrUpdateModalDNavigation
          parent={parent}
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

export default Navigation;

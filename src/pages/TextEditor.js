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
  Modal,
  Input,
  Form
} from "antd";

import { DefaultEditor } from 'react-simple-wysiwyg';

import { EditOutlined, PlusOutlined, ToTopOutlined } from "@ant-design/icons";
import {  Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";
import { useForm } from "antd/lib/form/Form";
import AddOrUpdateModalData from "../components/Models/AddOrUpdateModalData";
import moment from "moment";
import { fromPairs } from "lodash";




function TextEditor(props) {

  const { visible, onCancel } = props;

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [refetech, setrefetech] = useState(false);
  const [key, setKey] = useState("");
  const [action, setAction] = useState("");

  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const color = "#00aaa8";
  const [form] = useForm();

  const hist = useNavigate();
  
  const [html, setHtml] = useState('my <b>HTML</b>');
  const [isload, setisload] = useState(true);

  useEffect(() => {
    axios.get("https://www.portalite.fr/api/data", config).then((response) => {
      if (response.data) {
        setData(response.data);
        setisload(false);
      } else {
        notification.error({ message: "No Data Found" });
        setisload(false);
      }
    });
  }, [refetech]);

  const handelchange =  (e) => {
    setHtml(e.target.value);
  };

 
  const handrefetech = () => {
    axios.post("https://www.portalite.fr/api/page/add",{code:html  }, config).then((response) => {
      if (response.data) {
        setData(response.data);
        setisload(false);
      } else {
        notification.error({ message: "No Data Found" });
        setisload(false);
      }
    });
    
  };


  

  return (


    <>
  
  <Form
      form={form}
      onFinish={handrefetech}
      preserve={props.type === "EDIT" ? true : false}
    >
      <div className="site-card-border-less-wrapper">
        <Modal
          title={props.type === "EDIT" ? "UPDATE" : "CREATE"}
          centered
          visible={visible}
          destroyOnClose
          onOk={() => {
            form.submit();
          }}
          onCancel={onCancel}
        >
          <Card
            centered
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Row justify="space-between" gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="data"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
                  <Input placeholder="data" type="texte" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your number!",
                    },
                  ]}
                >
                  <Input placeholder="number" type="number" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="fa_icon"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Icon!",
                    },
                  ]}
                >
                  <Input placeholder="Icon" type="texte" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
      <DefaultEditor  value={html} onChange={handelchange} />
    </Form>
     

      </>
  );
}

export default TextEditor;

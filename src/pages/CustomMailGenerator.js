import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  notification,
  Row,
  Select,
  Switch,
  Tabs,
  Typography,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { getJSON } from "../utils";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import emailjs from "@emailjs/browser";
import {
  AndroidOutlined,
  AppleOutlined,
  EyeOutlined,
  Html5Outlined,
} from "@ant-design/icons";
import { isNil } from "lodash";
const { Option } = Select;

const CustomMailGen = () => {
  const [mails, setmails] = useState([]);
  const [mail, setmail] = useState({});
  const [content, setcontent] = useState(``);
  const [refetech, setrefetech] = useState(false);
  const [isnew, setisnew] = useState(false);
  const [loading, setloading] = useState(false);
  const [emailreference, setemailreference] = useState("");


  const config = {
    headers: {
      Authorization: getJSON(localStorage.getItem("token")),
    },
  };
  useEffect(() => {
    setloading(true)
    axios
      .get("https://www.portalite.fr/api/emails/all", config)
      .then((response) => {
        if (response.data) {
          setmails(response.data);
          setloading(false)
        } else {
          notification.error({ message: "No Data Found" });
          setloading(false)
        }
      });
  }, [refetech]);
  const handleChange = (values) => {
    setemailreference("");
    if (mails) {
      setmail(mails?.find((mail) => mail.reference === values));
      setcontent(mails?.find((mail) => mail.reference === values)?.htmlsource);
    }
  };
  const handleAddORUpdate = async () => {
    console.log("toto", isnew);
    if (isnew === true && emailreference === "")
      notification.error({ message: "please insert reference" });
    else if (isnew === false && isNil(mail?.reference))
      notification.error({ message: "please select mail" });
    else if (isnew === false) {
      await axios
        .put(
          "https://www.portalite.fr/api/emails/update",
          {
            reference: mail.reference,
            htmlsource: content,
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Update Done  " });
          setrefetech(!refetech);
        })
        .catch(function (err) {
          notification.error({ message: "Something wrong " });
        });
    } else {
      await axios
        .post(
          "https://www.portalite.fr/api/emails/add",
          {
            reference: emailreference,
            htmlsource: content,
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Create Done  " });
          setrefetech(!refetech);
        })
        .catch(function (err) {
          notification.error({ message: "Something wrong " });
        });
    }
  };

  return (
    <Card
      title={<h6 className="font-semibold m-0"> Custom Mail Template</h6>}
      type="inner"
    >
      <Row gutter={64} justify="center">
        <Col span={10}>
          <Typography.Text strong>Select Template:</Typography.Text>
          <Select
            size="middle"
            placeholder="Please select template"
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "20px" }}
            value={mail?.reference}
            allowClear
            loading={loading}
          >
            {mails.map((mail, i) => (
              <Option value={mail.reference} key={i}>
                {mail?.reference}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Typography.Text strong> New? </Typography.Text>

          <Switch style={{ width: "100%" }} onChange={(val) => setisnew(val)} />
        </Col>
        {isnew && (
          <Col span={6}>
            <Typography.Text strong> Email reference: </Typography.Text>

            <Input
              style={{ height: "32px" }}
              placeholder="reference"
              onChange={(val) => setemailreference(val.target.value)}
            />
          </Col>
        )}
      </Row>
      <Tabs
        defaultActiveKey="2"
        type="card"
        tabBarExtraContent={
          <Typography.Title level={4}>
            {mail?.reference ?? emailreference ?? ""}
          </Typography.Title>
        }
        items={[Html5Outlined, EyeOutlined].map((Icon, i) => {
          return {
            label: (
              <span>
                <Icon />
                {i === 0 ? "Htmlcode" : "Preview"}
              </span>
            ),
            key: i + 1,
            children:
              i === 0 ? (
                <Editor
                  height="700px"
                  defaultLanguage="html"
                  theme="vs-dark"
                  value={content}
                  onChange={(val) => setcontent(val)}
                />
              ) : (
                <iframe
                  name="my_iframe"
                  srcDoc={content}
                  width="100%"
                  height="700px"
                  style={{ border: "1px solid #E3E3E3" }}
                ></iframe>
              ),
          };
        })}
      />
      <br />
      <Row>
        <Button
          onClick={handleAddORUpdate}
          style={{ width: "100%" }}
          type="primary"
        >
          Save
        </Button>
      </Row>
    </Card>
  );
};
export default CustomMailGen;

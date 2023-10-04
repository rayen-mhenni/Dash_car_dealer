import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import emailjs from "@emailjs/browser";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { getJSON, StringToTemplate } from "../../utils";
const { Option } = Select;

const SendMailToContactModel = (props) => {
  const { visible, onCancel } = props;

  const [form] = useForm();
  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };
  const handleonfinish = async () => {
    const subject = form.getFieldValue("subject");
    const emailcontent = form.getFieldValue("email");
    axios
      .get(`https://www.portalite.fr/api/emails/CONTACT`, config)
      .then((response) => {
        if (response.data) {
          let templateParams = {
            email: props.record.email,
            html_temp: StringToTemplate(
              {
                subject: subject,
                message: emailcontent,
                name: "Mr or Mm " + props.record.name,
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
                notification.success({ message: "Email sent with success" });
                console.log("email", result);
              },
              (error) => {
                notification.error({ message: error.text });
              }
            );
        }
      });
  };

  return (
    <Form form={form} onFinish={handleonfinish} preserve={false}>
      <div className="site-card-border-less-wrapper">
        <Modal
          title={"Send Email To " + props.record.name}
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
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: "Please input your subject!",
                    },
                  ]}
                >
                  <Input placeholder="Subject" type="texte" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email content !",
                    },
                  ]}
                >
                  <TextArea rows={7} placeholder="Content" type="texte" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default SendMailToContactModel;

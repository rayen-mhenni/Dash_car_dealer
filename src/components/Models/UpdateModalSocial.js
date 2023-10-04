import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import { getJSON } from "../../utils";

const UpdateModalSocial = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState(false);

  const [form] = useForm();

  useEffect(() => {
    console.log("testtt",props.record)
    form.setFieldsValue({
      ...props.record,
    });
  }, [form, props.record, props.visible]);

  const handleonfinish = async (val) => {
    const config = {
      headers: {
        authorization: getJSON(localStorage.getItem("token")),
      },
    };

    const values = {
      ...val,
      id: props.record.id,
    };
    await axios
      .put(
        "https://www.portalite.fr/api/socials/update/" + values.id,
        {
          facebook: values.facebook,
          twitter: values.twitter,
          instagram: values.instagram,
          pinterest: values.pinterest,
          linkedin: values.linkedin,
        },
        config
      )
      .then((response) => {
        notification.success({ message: "Update Done  " });
        props.refetech();
        onCancel();
      })
      .catch(function (err) {
        props.refetech();
        onCancel();
      });
  };

  return (
    <Form
      form={form}
      onFinish={handleonfinish}
    >
      <div className="site-card-border-less-wrapper">
        <Modal
          name={"UPDATE"}
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
              <Col span={24}>
                <Form.Item
                  name="facebook"
                  label="facebook"
                  rules={[
                    {
                      required: true,
                      message: "Please input your facebook!",
                    },
                  ]}
                >
                  <Input placeholder="facebook" type="texte" />
                </Form.Item>
              </Col>{" "}
              <Col span={24}>
                <Form.Item
                  name="twitter"
                  label="twitter"
                  rules={[
                    {
                      required: true,
                      message: "Please input your twitter!",
                    },
                  ]}
                >
                  <Input placeholder="twitter" type="texte" />
                </Form.Item>
              </Col>{" "}
              <Col span={24}>
                <Form.Item
                  name="instagram"
                  label="instagram"
                  rules={[
                    {
                      required: true,
                      message: "Please input your instagram!",
                    },
                  ]}
                >
                  <Input placeholder="instagram" type="texte" />
                </Form.Item>
              </Col>{" "}
  
              <Col span={24}>
                <Form.Item
                  name="linkedin"
                  label="linkedin"
                  rules={[
                    {
                      required: true,
                      message: "Please input your linkedin!",
                    },
                  ]}
                >
                  <Input placeholder="linkedin" type="texte" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default UpdateModalSocial;

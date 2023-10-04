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
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import getEnvValue,{ getJSON } from "../../utils";
const { Option } = Select;

const AddOrUpdateModalPartners = (props) => {
  const { visible, onCancel } = props;
  const serverURL = 'https://www.portalite.fr';

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
      });
    } else {
    }
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

    if (props.type === "EDIT") {
      await axios
        .put(
          "https://www.portalite.fr/api/parteners/update/" + values.id,
          {
            url: form.getFieldValue("url"),
            image: form.getFieldValue("image"),
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
    } else {
      console.log("from", form.getFieldValue("data"));
      await axios
        .post(
          "https://www.portalite.fr/api/parteners/add/",
          {
            url: form.getFieldValue("url"),
            image: form.getFieldValue("image"),
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Create Done  " });
          props.refetech();
          onCancel();
        })
        .catch(function (err) {
          props.refetech();
          onCancel();
        });
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleonfinish}
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
              <Col span={24}>
                <Form.Item
                  name="url"
                  rules={[
                    {
                      required: true,
                      message: "Please input your URL!",
                    },
                  ]}
                >
                  <Input placeholder="URL" type="texte" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please input your image!",
                    },
                  ]}
                >
                  <Upload
                    onChange={({ file, fileList }) => {
                      try {
                        if (file.status !== "uploading") {
                          console.log("filee", file);

                          var bodyFormData = new FormData();

                          bodyFormData.append("image", file.originFileObj);
                          form.setFieldsValue({
                            image: serverURL + "/images/" +  file.originFileObj.name,
                          });

                          axios({
                            method: "post",
                            url: serverURL + "/api/upload",
                            data: bodyFormData,
                            headers: { "Content-Type": "multipart/form-data" },
                          })
                            .then(function (respnse) {})
                            .catch(function (response) {});
                        }
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    progress={{
                      strokeColor: {
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      },
                      strokeWidth: 3,
                      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalPartners;

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
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import getEnvValue, { getJSON } from "../../utils";
const { Option } = Select;

const AddOrUpdateModalCars = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState(false);
  const serverURL = "https://www.PrimoCarthage.fr";

  console.log("dsdsqdqsd", serverURL);

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
      });
    } else {
    }
  }, [form, props.record, props.visible]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(false);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImageURL(false);
      });
    }
    try {
      if (info.file.status !== "uploading") {
        console.log("filee", info.file);

        var bodyFormData = new FormData();

        bodyFormData.append("images", info.file.originFileObj);
        form.setFieldsValue({
          image: serverURL + "/images/" + info?.file.originFileObj.name,
        });
        setImageURL(true);
        await axios({
          method: "post",
          url: serverURL + "/api/upload",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleonfinish = async (val) => {
    const config = {
      headers: {
        authorization: getJSON(localStorage.getItem("token")),
      },
    };

    let user = JSON.parse(localStorage.getItem("user"));
    const values = {
      ...val,
      id: props.record.id,
    };

    if (props.type === "EDIT") {
      console.log("oooooooo", values);
      await axios
        .put(
          "http://127.0.0.1:5000/api/car/edit/" + values.id,
          {
            author: values?.author,
            content: values.content,
            title: values.title,
            image: values.image,
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
          "https://www.PrimoCarthage.fr/api/articles/add/",
          {
            title: form.getFieldValue("title"),
            content: form.getFieldValue("content"),
            author: form.getFieldValue("author"),
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
          visible={visible}
          destroyOnClose
          onOk={() => {
            form.submit();
          }}
          width={1000}
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
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => (
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
                        name="slideimg"
                        listType="picture-card"
                        className="avatar-uploader projects-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        multiple
                      >
                        {imageURL || props?.record?.image ? (
                          <img
                            src={getFieldValue("image") ?? props?.record?.image}
                            alt="slideimg"
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <div className="ant-upload-text font-semibold text-dark">
                            {
                              <VerticalAlignTopOutlined
                                style={{ width: 20, color: "#000" }}
                              />
                            }
                            <div>Upload New Image</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input placeholder="name" type="name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Make"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Make!",
                    },
                  ]}
                >
                  <Input placeholder="Make" type="Make" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Model"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Model!",
                    },
                  ]}
                >
                  <Input placeholder="Model" type="Model" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Year"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Year!",
                    },
                  ]}
                >
                  <Input placeholder="Year" type="Year" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Mileage"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Mileage!",
                    },
                  ]}
                >
                  <Input placeholder="Mileage" type="Mileage" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Engine"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Engine!",
                    },
                  ]}
                >
                  <Input placeholder="Engine" type="Engine" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Cylinder"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Cylinder!",
                    },
                  ]}
                >
                  <Input placeholder="Cylinder" type="Cylinder" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Transmission"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Transmission!",
                    },
                  ]}
                >
                  <Input placeholder="Transmission" type="Transmission" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Bodytype"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Bodytype!",
                    },
                  ]}
                >
                  <Input placeholder="Bodytype" type="Bodytype" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="INTERIORCOLOR"
                  rules={[
                    {
                      required: true,
                      message: "Please input your INTERIORCOLOR!",
                    },
                  ]}
                >
                  <Input placeholder="INTERIORCOLOR" type="INTERIORCOLOR" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="EXTERIORCOLOR"
                  rules={[
                    {
                      required: true,
                      message: "Please input your EXTERIORCOLOR!",
                    },
                  ]}
                >
                  <Input placeholder="EXTERIORCOLOR" type="EXTERIORCOLOR" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Price"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Price!",
                    },
                  ]}
                >
                  <Input placeholder="Price" type="Price" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your description!",
                    },
                  ]}
                >
                  <TextArea rows={3} placeholder="description" type="texte" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="options"
                  rules={[
                    {
                      required: true,
                      message: "Please input options!",
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    size="middle"
                    placeholder="Please select"
                    style={{ width: "100%" }}
                    options={[]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalCars;

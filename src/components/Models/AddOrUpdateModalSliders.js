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
import { UploadOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import getEnvValue, { getJSON } from "../../utils";
const { Option } = Select;

const AddOrUpdateModalSliders = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState(false);
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

        bodyFormData.append("image", info.file.originFileObj);
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

    const values = {
      ...val,
      id: props.record.id,
    };

    if (props.type === "EDIT") {
      await axios
        .put(
          "https://www.portalite.fr/api/sliders/update/" + values.id,
          {
            title: values.title ?? form.getFieldValue("title"),
            description:
              values.description ?? form.getFieldValue("description"),
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
          "https://www.portalite.fr/api/sliders/add/",
          {
            title: values.title ?? form.getFieldValue("title"),
            description:
              values.description ?? form.getFieldValue("description"),
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
                            <div>Upload New Slide</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your title!",
                    },
                  ]}
                >
                  <Input placeholder="Title" type="texte" />
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
                  <TextArea
                    placeholder="description"
                    rows={4}
                    type="texteArea"
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

export default AddOrUpdateModalSliders;

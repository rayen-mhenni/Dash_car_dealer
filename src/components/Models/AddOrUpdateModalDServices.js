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
import TextArea from "antd/lib/input/TextArea";
import getEnvValue, { getJSON } from "../../utils";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
const { Option } = Select;

const AddOrUpdateModalDServices = (props) => {
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
          "https://www.portalite.fr/api/services/update/" + values.id,
          {
            title:val.title,
      resume:val.resume,
      fa_icon: form.getFieldValue("image"),
      link:val.link,
      description:val.description
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
          "https://www.portalite.fr/api/services/add/",
          {
            title:form.getFieldValue("title"),
            resume:form.getFieldValue("resume"),
            fa_icon:form.getFieldValue("fa_icon"),
            link:form.getFieldValue("link"),
            description:form.getFieldValue("description")
         
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
                      name="fa_icon"
                      rules={[
                        {
                          required: true,
                          message: "Please input your fa_icon!",
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
                            src={getFieldValue("fa_icon") ?? props?.record?.fa_icon}
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
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your title!",
                    },
                  ]}
                >
                  <Input placeholder="title" type="texte" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="link"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Link!",
                    },
                  ]}
                >
                  <Input placeholder="Link" type="texte" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="resume"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Resume!",
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="Resume" type="text" />
                </Form.Item>
              </Col>
            </Row>
            <Row>

            <Col span={24}>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Description!",
                    },
                  ]}
                >
                  <TextArea rows={9}  placeholder="Description" type="texte" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalDServices;

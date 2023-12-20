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
  Spin,
  Tag,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import getEnvValue, { getJSON } from "../../utils";
import { isNil } from "lodash";
const { Option } = Select;

const AddOrUpdateModalCars = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const serverURL = "http://127.0.0.1:5000";

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
        images: props.record?.images.length > 0 ? props.record?.images : [],
      });
    } else {
      form.setFieldsValue({
        images: [],
      });
    }
  }, [form, props.record, props.visible]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = async (info, listfilesuploaded) => {
    setLoading(true);
    try {
      const listOfPromise = [];
      info?.fileList?.forEach((el) => {
        if (
          !isNil(el?.originFileObj.name) &&
          !listfilesuploaded.find(
            (val) => val === serverURL + "/images/" + el?.originFileObj.name
          )
        ) {
          var bodyFormData = new FormData();

          bodyFormData.append("images", el.originFileObj);
          form.setFieldsValue({
            images: [
              ...form.getFieldValue("images"),
              serverURL + "/images/" + el?.originFileObj.name,
            ],
          });
          listOfPromise.push(
            axios({
              method: "post",
              url: serverURL + "/api/upload",
              data: bodyFormData,
              headers: { "Content-Type": "multipart/form-data" },
            })
          );
        }
      });
      await Promise.all(listOfPromise);
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
      id: props.record._id,
    };

    if (props.type === "EDIT") {
      console.log("oooooooo", values);
      await axios
        .put(
          "https://www.primocarthageauto.ca/api/car/edit/" + values.id,
          {
            name: values?.name,
            Make: values.Make,
            Model: values.Model,
            Year: values.Year,
            Mileage: values.Mileage,
            Engine: values.Engine,
            Cylinder: values.Cylinder,
            Transmission: values.Transmission,
            Bodytype: values.Bodytype,
            INTERIORCOLOR: values.INTERIORCOLOR,
            EXTERIORCOLOR: values.EXTERIORCOLOR,
            Price: values.Price,
            description: values.description,
            images: form.getFieldValue("images"),
            options: values.options,
            Vin: values.Vin,
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
          "https://www.primocarthageauto.ca/api/car",
          {
            name: values?.name,
            Make: values.Make,
            Model: values.Model,
            Year: values.Year,
            Mileage: values.Mileage,
            Engine: values.Engine,
            Cylinder: values.Cylinder,
            Transmission: values.Transmission,
            Bodytype: values.Bodytype,
            INTERIORCOLOR: values.INTERIORCOLOR,
            EXTERIORCOLOR: values.EXTERIORCOLOR,
            Price: values.Price,
            description: values.description,
            images: form.getFieldValue("images"),
            options: values.options,
            Vin: values.Vin,
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
                {Loading ? (
                  <Row justify="center">
                    <Spin />
                  </Row>
                ) : (
                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                      return (
                        <Form.Item name="image">
                          <Upload
                            name="slideimg"
                            className="avatar-uploader projects-uploader"
                            onChange={(val) =>
                              handleChange(val, getFieldValue("images"))
                            }
                            listType="picture-card"
                            fileList={
                              !isNil(getFieldValue("images"))
                                ? getFieldValue("images")?.map((el, i) => ({
                                    uid: -i,
                                    name: "image.png",
                                    status: "done",
                                    url: el,
                                  }))
                                : []
                            }
                            multiple
                          >
                            <Button
                              icon={
                                <VerticalAlignTopOutlined
                                  style={{ width: 20, color: "#000" }}
                                />
                              }
                            >
                              Upload Images
                            </Button>
                          </Upload>
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                )}
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
                  name="Vin"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Vin!",
                    },
                  ]}
                >
                  <Input placeholder="Vin" type="Vin" />
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

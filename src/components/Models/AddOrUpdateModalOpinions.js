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
import TextArea from "antd/lib/input/TextArea";
import { getJSON } from "../../utils";
const { Option } = Select;

const AddOrUpdateModalOpinions = (props) => {
  const { visible, onCancel } = props;

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
          "https://www.portalite.fr/api/opinions/update/" + values.id,
          {
            name:form.getFieldValue("name"),
            poste:form.getFieldValue("poste"),
            rate:form.getFieldValue("rate"),
            opinion:form.getFieldValue("opinion"),   
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
          "https://www.portalite.fr/api/opinions/add/",
          {
            name:form.getFieldValue("name"),
            poste:form.getFieldValue("poste"),
            rate:form.getFieldValue("rate"),
            opinion:form.getFieldValue("opinion"),     
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
                  <Input placeholder="Name" type="texte" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="poste"
                  rules={[
                    {
                      required: true,
                      message: "Please input your poste!",
                    },
                  ]}
                >
                  <Input placeholder="Poste" type="texte" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="rate"
                  rules={[
                    {
                      required: true,
                      message: "Please input your rate!",
                    },
                  ]}
                >
                  <Input placeholder="Rate" type="texte" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="opinion"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Opinion!",
                    },
                  ]}
                >
                  <TextArea rows={10} placeholder="Opinion" type="text" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
         
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalOpinions;

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

const AddOrUpdateModalDUser = (props) => {
  const { visible, onCancel } = props;

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      console.log("testttt",props)
      form.setFieldsValue({
        ...props.record,
        Name:props.record.name,
        Email:props.record.email,
        Password:"",
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
          "https://www.portalite.fr/api/users/update/" + values.id,
          {
            Email: values.Email,
            Password: values.Password,
            UserName: values.Name,
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
        .post("https://www.portalite.fr/api/users/add", {
          Email: values.Email,
          Password: values.Password,
          UserName: values.Name,
        })
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
      name="basic"
      onFinish={handleonfinish}
      form={form}
      className="row-col"
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
            <Form.Item
              name="Name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
              type="email"
            >
              <Input placeholder="email" />
            </Form.Item>

            <Form.Item
              name="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalDUser;

import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Space,
  notification,
} from "antd";

import { Link } from "react-router-dom";

import logo from "../assets/images/Logo-Portalite-Rogne-removebg-preview.png";
import axios from "axios";
import { getJSON } from "../utils";
import { useForm } from "antd/lib/form/Form";
const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignUp = () => {
  const hist = useNavigate();
  const [form] = useForm();
  const onFinish = async (values) => {
    if (values.remember === false)
      notification.error({ message: "please agree to ower term !" });
    else {
      await axios
        .post("https://www.portalite.fr/api/users/add", {
          Email: values.Email,
          Password: values.Password,
          UserName: values.Name,
        })
        .then((response) => {
          if (response.data.message) {
            notification.success({ message: response.data.message });
            hist("/sign-in");
          } else {
            notification.error({ message: response?.data.error });
          }
        });
    }
  };


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Layout className="layout-default">
        <Content className="signin">
          <Row justify="center">
            <Col className="sign-img">
              <img src={logo} alt="" />
            </Col>
          </Row>

          <Row justify="center" style={{ width: "100%" }}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              form={form}
              onFinishFailed={onFinishFailed}
              className="row-col"
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
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
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

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  SIGN UP
                </Button>
              </Form.Item>
            </Form>
          </Row>

          <Row justify="center">
            <p className="font-semibold text-muted text-center">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-bold text-dark">
                Sign In
              </Link>
            </p>
          </Row>

        </Content>
      </Layout>
    </>
  );
};

export default SignUp;

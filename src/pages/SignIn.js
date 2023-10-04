import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  notification,
} from "antd";

import axios from "axios";
import { getJSON } from "../utils";
import { useNavigate } from "react-router-dom";

import signinbg from "../assets/images/img-signin.jpg";

import {
  DribbbleOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import emailjs from "@emailjs/browser";

import logo from "../assets/images/logo_2-removebg-preview.png";
import { useForm } from "antd/lib/form/Form";
import { getEmailResetPass } from "../utils";

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const { Title } = Typography;

const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const hist = useNavigate();

  const resetpassword = async () => {
    await axios
      .put("https://www.PrimoCarthage.fr/api/users/resetpassword", { email: email })
      .then((data) => {
        let templateParams = {
          name: "Mr or Mm",
          email: email,
          html_temp: getEmailResetPass({
            email: email,
            message: `http://dashboard.PrimoCarthage.fr:81/resetpassword/${data.data.id}/Bearrer ${data.data.token}`,
          }),
        };

        emailjs
          .send(
            "service_tgk64kh",
            "template_emypcy4",
            templateParams,
            "BfqX6_cODcX-fbIrw"
          )
          .then(
            (result) => {
              notification.success({ message: "Check you Email" });
            },
            (error) => {
              notification.error({ message: error.text });
            }
          );
      })
      .catch((error) => {
        notification.error({ message: "Email Not Found " });
      });
  };

  const onFinish = async () => {
    hist("/dashboard");

    // await axios
    //   .post("https://www.PrimoCarthage.fr/api/users", {
    //     Email: email,
    //     Password: password,
    //   })
    //   .then((response) => {
    //     if (response.data.token) {
    //       notification.success({ message: response?.data?.message });
    //       localStorage.setItem(
    //         "token",
    //         JSON.stringify("Bearer " + response.data.token)
    //       );
    //       localStorage.setItem("user", JSON.stringify(response.data.user));
    //       hist("/dashboard");
    //     } else {
    //       notification.error({ message: "no account with these credential" });
    //     }
    //   })
    //   .catch((err) => {
    //     notification.error({ message: "no account with these credential" });
    //   });
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

          <Row justify="center">
            <Form onFinish={onFinish} layout="vertical">
              <Form.Item
                className="Email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  placeholder="Email"
                  name="email"
                  type="email"
                  style={{ width: "100%" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="remember"
                className="aligin-center"
                valuePropName="checked"
              >
                <Switch defaultChecked onChange={onChange} />
                Remember me
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Sign in
                </Button>
              </Form.Item>

              {/* <Button
                type="default"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                <Link to="/sign-up" className="font-bold text-dark">
                  Sign up
                </Link>
              </Button> */}
            </Form>
          </Row>
          <br />
          <Row justify="center">
            <p className="font-semibold text-muted text-center">
              Forgot your password?{" "}
              <Typography.Link
                onClick={resetpassword}
                className="font-bold text-dark"
              >
                Reset Password
              </Typography.Link>
            </p>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default SignIn;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../utils";
import { useParams } from "react-router";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
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
  Card,
} from "antd";

import { useNavigate } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";

function RestPassword() {

  let { id, token } = useParams();

  const hist = useNavigate();

  const resetpassword = async (value) => {

    const config = {
      headers: {
        authorization: token,
      },
    };
    await axios
      .put(
        "https://www.portalite.fr/api/users/updatepassword/" + id,
        { password: value.newpassword, token },
        config
      )
      .then((data) => {
        notification.success({ message: "Password Updated" });
        localStorage.clear();
        hist("/sign-in");
      })
      .catch((error) => {
        console.log(error);
        notification.error({ message: "check your data" });
      });
  };

  return (
    <Layout className="layout-default">
      <Content className="signin">
        <Row justify="center">
          <Card
            title={
              <Typography.Title level={3}>Reset Password</Typography.Title>
            }
            type="inner"
          >
            <Form layout="vertical" onFinish={resetpassword}>
              <Form.Item
                label="New Password"
                name="newpassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="NewPassword"
                  name="NewPassword"
                  type="password"
                />
              </Form.Item>
              <Row justify="center">
                <Button type="primary" htmlType="submit">
                  update
                </Button>
              </Row>
            </Form>
          </Card>
        </Row>
      </Content>
    </Layout>
  );
}

export default RestPassword;

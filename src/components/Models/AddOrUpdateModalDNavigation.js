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

const AddOrUpdateModalDNavigation = (props) => {
  const { visible, onCancel, parent } = props;

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
        parentid:props.record.parentid
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
      id: props.record?.navid,
    };
    if (props.type === "EDIT") {
      await axios
        .put(
          "https://www.portalite.fr/api/nav/update/" + values.id,
          {
            navname: val.navname,
            parentid: val.parentid,
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Update Done " });
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
          "https://www.portalite.fr/api/nav/add/",
          {
            navname: form.getFieldValue("navname"),
            parentid: form.getFieldValue("parentid"),
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
          width={300}
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
                  name="navname"
                  rules={[
                    {
                      required: true,
                      message: "Please input your navname!",
                    },
                  ]}
                >
                  <Input placeholder="navname" type="texte" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={24}>
              <Form.Item name="parentid">
                <Select placeholder="select parent" style={{ width: "100%" }}>
                  {parent.map((nav, i) => (
                    <Select.Option value={nav.navid} key={i}>
                      {nav.navname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalDNavigation;

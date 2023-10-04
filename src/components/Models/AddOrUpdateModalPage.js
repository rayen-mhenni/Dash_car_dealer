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
import { DefaultEditor } from "react-simple-wysiwyg";
import { getJSON } from "../../utils";
const { Option } = Select;

const AddOrUpdateModalPage = (props) => {
  const { visible, onCancel } = props;

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
      });
      setHtml(props.record.code)
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
          "https://www.portalite.fr/api/pages/update/" + values.id,
          {
            name: values.name,
            code: html,
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Update Done  " });
          props.refetech();
          setHtml('')
          onCancel();
        })
        .catch(function (err) {
          props.refetech();
          setHtml('')
          onCancel();
        });
    } else {
      console.log("from", form.getFieldValue("data"));
      await axios
        .post(
          "https://www.portalite.fr/api/pages/add/",
          {
            name:form.getFieldValue("name"),
            code :html
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Create Done  " });
          props.refetech();
          onCancel();
          setHtml('')
        })
        .catch(function (err) {
          props.refetech();
          setHtml('')
          onCancel();
        });
    }
  };
  const [html, setHtml] = useState('');

  const handelchange =  (e) => {
    setHtml(e.target.value);
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
          width={1000}

        
          onOk={() => {
            form.submit();
          }}
          onCancel={onCancel }
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
                      message: "Please input your title!",
                    },
                  ]}
                >
                  <Input placeholder="Name" type="texte" />
                </Form.Item>
              </Col>
            </Row>
            <DefaultEditor  value={html} onChange={handelchange} />
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalPage;

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

const AddOrUpdateModalConfig = (props) => {
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
          "https://www.portalite.fr/api/configurations/update/" + values.id,
          {
            frais_gestion: values.frais_gestion,
            ind_repas: values.ind_repas,
            taux_charge: values.taux_charge,
            email_text: "",
            abon_public: values.abon_public,
            notice: values.notice,
            status: values.status,
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
          "https://www.portalite.fr/api/configurations/add/",
          {
            frais_gestion:form.getFieldValue("frais_gestion"),
            ind_repas:form.getFieldValue("ind_repas"),
            taux_charge:form.getFieldValue("taux_charge"),
            email_text:"",
            abon_public:form.getFieldValue("abon_public"),
            notice:form.getFieldValue("notice"),
            status:form.getFieldValue("status"),
    
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

{/* frais_gestion:form.getFieldValue("frais_gestion"),
            ind_repas:form.getFieldValue("ind_repas"),
            taux_charge:form.getFieldValue("taux_charge"),
            email_text:form.getFieldValue("email_text"),
            abon_public:form.getFieldValue("abon_public"),
            notice:form.getFieldValue("notice"),
            status:form.getFieldValue("status"), */}

          <Row justify="space-between" gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="frais_gestion"
                  rules={[
                    {
                      required: true,
                      message: "Please input your frais_gestion!",
                    },
                  ]}
                >
                  <Input placeholder="frais_gestion" type="texte" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ind_repas"
                  rules={[
                    {
                      required: true,
                      message: "Please input your ind_repas!",
                    },
                  ]}
                >
                  <Input placeholder="ind_repas" type="texte" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="taux_charge"
                  rules={[
                    {
                      required: true,
                      message: "Please input your taux_charge!",
                    },
                  ]}
                >
                  <Input placeholder="taux_charge" type="texte" />
                </Form.Item>
              </Col>

         

              <Col span={12}>
                <Form.Item
                  name="notice"
                  rules={[
                    {
                      required: true,
                      message: "Please input your notice!",
                    },
                  ]}
                >
                  <Input placeholder="notice" type="texte" />
                </Form.Item>
              </Col>

              
              <Col span={12}>
                <Form.Item
                  name="abon_public"
                  rules={[
                    {
                      required: true,
                      message: "Please input your abon_public!",
                    },
                  ]}
                >
                  <Input placeholder="abon_public" type="texte" />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Please input your status!",
                    },
                  ]}
                >
                  <Radio.Group>
                  <Radio name="R1" value={"ACTIVE"} > ACTIVE </Radio>
                 <Radio name="R1" value={"DISABLE"}> DISABLE </Radio>
                  </Radio.Group>
                
                </Form.Item>
              </Col>
              
              {/* <Col span={24}>
                <Form.Item
                  name="email_text"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email_text!",
                    },
                  ]}
                >
                  <TextArea rows={10} placeholder="email_text" type="texte" />
                </Form.Item>
              </Col> */}

            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalConfig;

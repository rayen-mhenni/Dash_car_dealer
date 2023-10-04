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
import React, { useEffect, useRef, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import { DefaultEditor } from "react-simple-wysiwyg";
import { Editor } from "@tinymce/tinymce-react";
import { getJSON } from "../../utils";
const { Option } = Select;

const AddOrUpdateModalPageV2 = (props) => {
  const { visible, onCancel } = props;

  const [form] = useForm();

  const [nav, setnav] = useState([]);

  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
        parentid: props.record.navid,
      });
      setHtml(props.record.code);
    } else {
      axios
        .get("https://www.portalite.fr/api/nav", config)
        .then((response) => {
          if (response.data) {
            let parent = response.data.map((nav) => ({
              navname: nav?.navname,
              navid: nav?.id,
            }));

            let childs = [];
            response.data.forEach((nav) => {
              nav?.child.forEach((child) => {
                childs.push({
                  navname: child?.navname,
                  navid: child?.id,
                  parentid: child?.parentid,
                });
              });
            });

            setnav(parent.concat(childs));
          }
        });
    }
  }, [form, props.record, props.visible]);

  const handleonfinish = async (val) => {
    const config = {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
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
            navid: form.getFieldValue("parentid"),
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Update Done  " });
          props.refetech();
          setHtml("");
          onCancel();
        })
        .catch(function (err) {
          props.refetech();
          setHtml("");
          onCancel();
        });
    } else {
      console.log("from", form.getFieldValue("data"));
      await axios
        .post(
          "https://www.portalite.fr/api/pages/add/",
          {
            name: form.getFieldValue("name"),
            code: html,
            navid: form.getFieldValue("parentid"),
          },
          config
        )
        .then((response) => {
          notification.success({ message: "Create Done  " });
          props.refetech();
          onCancel();
          setHtml("");
        })
        .catch(function (err) {
          props.refetech();
          setHtml("");
          onCancel();
        });
    }
  };
  const [html, setHtml] = useState("");

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      setHtml(editorRef.current.getContent());
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
          width={1000}
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
                      message: "Please input your title!",
                    },
                  ]}
                >
                  <Input placeholder="Name" type="texte" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="parentid">
                  <Select
                    placeholder="select nav"
                    style={{ width: "100%" }}
                    onChange={(val) => {
                      form.setFieldsValue({ name: nav?.find((nav)=>nav.navid===val).navname });
                    }}
                  >
                    {nav
                      .filter((nav) => ![30, 31, 32].includes(nav.navid))
                      .map((nav, i) => (
                        <Select.Option value={nav.navid} key={i}>
                          {nav.navname}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <>
              <Editor
                apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                }}
                initialValue={props.record.code}
                onEditorChange={log}
                init={{
                  height: 500,
                  plugins:
                    "powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker help formatpainter permanentpen charmap linkchecker emoticons advtable export print autosave",
                  toolbar:
                    "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",
                  hieght: 700,
                  toolbar_sticky: true,
                  icons: "thin",
                  skin: "material-classic",
                  content_style: `
                body {
                    background: #fff;
                }
  
            @media (min-width: 840px) {
                html {
                    background: #eceef4;
                    min-height: 100%;
                    padding: 0 .5rem
                 }
                body {
                    background-color: #fff;
                    box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                    box-sizing: border-box;
                    margin: 1rem auto 0;
                    max-width: 820px;
                    min-height: calc(100vh - 1rem);
                    padding:4rem 6rem 6rem 6rem
                 }
             }
             `,
                }}
              />
              {/* <button onEditorChange={log}>Log editor content</button> */}
            </>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalPageV2;

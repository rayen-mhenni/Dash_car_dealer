import { Button, Card, Row, Select, Tabs, Typography } from "antd";

import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Editor as EditorToHtml } from "@tinymce/tinymce-react";

import emailjs from "@emailjs/browser";
import { EyeOutlined, Html5Outlined } from "@ant-design/icons";
import { isNil } from "lodash";
const { Option } = Select;

const HtmlEditor = () => {
  const [content, setcontent] = useState(``);
  const editorRef = useRef(null);

  const log = () => {
    if (editorRef.current) {
      setcontent(editorRef.current.getContent());
    }
  };
  return (
    <Card
      title={<h6 className="font-semibold m-0"> HTML Editor</h6>}
      type="inner"
    >
      <Tabs
        defaultActiveKey="2"
        type="card"
        items={[Html5Outlined, EyeOutlined].map((Icon, i) => {
          return {
            label: (
              <span>
                <Icon />
                {i === 0 ? "Htmlcode" : "Preview"}
              </span>
            ),
            key: i + 1,
            children:
              i === 0 ? (
                <Editor
                  height="700px"
                  defaultLanguage="html"
                  theme="vs-dark"
                  value={content}
                  onChange={(val) => setcontent(val)}
                />
              ) : (
                <EditorToHtml
                  apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
                  value={content}
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                  }}
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
              ),
          };
        })}
      />
    </Card>
  );
};
export default HtmlEditor;

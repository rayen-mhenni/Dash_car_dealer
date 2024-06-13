/* eslint-disable no-useless-concat */
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Tag,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import getEnvValue, { getJSON } from "../../utils";
import _, { isNil } from "lodash";
const { Option } = Select;

const AddOrUpdateModalCars = (props) => {
  const { visible, onCancel } = props;
  const [Loading, setLoading] = useState(false);
  const [filelist, setfilelist] = useState([]);
  const serverURL = "http://127.0.0.1:5000";

  const [form] = useForm();

  useEffect(() => {
    if (props.type === "EDIT") {
      form.setFieldsValue({
        ...props.record,
      });
      setfilelist(props.record?.images.length > 0 ? props.record?.images : []);
    } else {
      setfilelist([]);
    }
  }, [form, props.record, props.visible]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = async (info, listfilesuploaded) => {
    if (info.file.uid === _.last(info.fileList).uid) {
      setLoading(true);

      try {
        const listOfPromise = [];
        const newImageArray = [];

        info?.fileList?.forEach((el) => {
          if (el?.originFileObj) {
            var bodyFormData = new FormData();

            bodyFormData.append("images", el?.originFileObj);

            newImageArray.push(
              "https://www.primocarthageauto.ca" +
                "/images/" +
                el?.originFileObj?.name
            );

            listOfPromise.push(
              axios({
                method: "post",
                url: "https://www.primocarthageauto.ca" + "/api/upload",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
              })
            );
          }
        });

        await Promise.all(listOfPromise);
        setfilelist([...listfilesuploaded, ...newImageArray]);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  const handleonfinish = async (val) => {
    const config = {
      headers: {
        authorization: getJSON(localStorage.getItem("token")),
      },
    };

    let user = JSON.parse(localStorage.getItem("user"));
    const values = {
      ...val,
      id: props.record._id,
    };

    if (props.type === "EDIT") {
      console.log("oooooooo", values);
      await axios
        .put(
          "https://www.primocarthageauto.ca/api/car/edit/" + values.id,
          {
            name: values?.name,
            Make: values.Make,
            Model: values.Model,
            Year: values.Year,
            Mileage: values.Mileage,
            Engine: values.Engine,
            Cylinder: values.Cylinder,
            Transmission: values.Transmission,
            Bodytype: values.Bodytype,
            INTERIORCOLOR: values.INTERIORCOLOR,
            EXTERIORCOLOR: values.EXTERIORCOLOR,
            Price: values.Price,
            Energy:
              typeof values.Energy === "object"
                ? values.Energy?.value
                : values.Energy,
            CARFAX: values.CARFAX,
            description: values.description,
            images: filelist,
            options: values.options,
            Vin: values.Vin,
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
          "https://www.primocarthageauto.ca/api/car",
          {
            name: values?.name,
            Make: values.Make,
            Model: values.Model,
            Year: values.Year,
            Mileage: values.Mileage,
            Engine: values.Engine,
            Cylinder: values.Cylinder,
            Transmission: values.Transmission,
            Bodytype: values.Bodytype,
            INTERIORCOLOR: values.INTERIORCOLOR,
            EXTERIORCOLOR: values.EXTERIORCOLOR,
            Price: values.Price,
            Energy:
              typeof values.Energy === "object"
                ? values.Energy?.value
                : values.Energy,
            CARFAX: values.CARFAX,
            description: values.description,
            images: filelist,
            options: values.options,
            Vin: values.Vin,
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
          visible={visible}
          destroyOnClose
          onOk={() => {
            form.submit();
          }}
          width={1000}
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
              <Col span={24}>
                {Loading ? (
                  <Row justify="center">
                    <Spin />
                  </Row>
                ) : (
                  <Form.Item name="image">
                    <Upload
                      name="slideimg"
                      className="avatar-uploader projects-uploader"
                      onChange={(val) => handleChange(val, filelist)}
                      listType="picture-card"
                      onRemove={(file) => {
                        const index = filelist.indexOf(file.url);
                        const newFileList = filelist.slice();
                        newFileList.splice(index, 1);
                        setfilelist(newFileList);
                      }}
                      fileList={
                        !isNil(filelist)
                          ? filelist?.map((el, i) => ({
                              uid: -i,
                              name: "image.png",
                              status: "done",
                              url: el,
                            }))
                          : []
                      }
                      multiple
                    >
                      <Button
                        icon={
                          <VerticalAlignTopOutlined
                            style={{ width: 20, color: "#000" }}
                          />
                        }
                      >
                        Upload Images
                      </Button>
                    </Upload>
                  </Form.Item>
                )}
              </Col>

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
                  <Input placeholder="name" type="name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Make"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Make!",
                    },
                  ]}
                >
                  <Input placeholder="Make" type="Make" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Model"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Model!",
                    },
                  ]}
                >
                  <Input placeholder="Model" type="Model" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Vin"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Vin!",
                    },
                  ]}
                >
                  <Input placeholder="Vin" type="Vin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Year"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Year!",
                    },
                  ]}
                >
                  <Input placeholder="Year" type="Year" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Mileage"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Mileage!",
                    },
                  ]}
                >
                  <Input placeholder="Mileage" type="Mileage" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Engine"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Engine!",
                    },
                  ]}
                >
                  <Input placeholder="Engine" type="Engine" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Cylinder"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Cylinder!",
                    },
                  ]}
                >
                  <Input placeholder="Cylinder" type="Cylinder" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Transmission"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Transmission!",
                    },
                  ]}
                >
                  <Input placeholder="Transmission" type="Transmission" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Bodytype"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Bodytype!",
                    },
                  ]}
                >
                  <Input placeholder="Bodytype" type="Bodytype" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="INTERIORCOLOR"
                  rules={[
                    {
                      required: true,
                      message: "Please input your INTERIORCOLOR!",
                    },
                  ]}
                >
                  <Input placeholder="INTERIORCOLOR" type="INTERIORCOLOR" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="EXTERIORCOLOR"
                  rules={[
                    {
                      required: true,
                      message: "Please input your EXTERIORCOLOR!",
                    },
                  ]}
                >
                  <Input placeholder="EXTERIORCOLOR" type="EXTERIORCOLOR" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Price"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Price!",
                    },
                  ]}
                >
                  <Input placeholder="Price" type="Price" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Energy"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Energy!",
                    },
                  ]}
                >
                  <Select
                    style={{ height: "40px" }}
                    options={[
                      {
                        value: "Diesel",
                        label: "Diesel",
                      },
                      {
                        value: "Essence",
                        label: "Essence",
                      },
                      {
                        value: "Hybride",
                        label: "Hybride",
                      },
                      {
                        value: "Electrique",
                        label: "Electrique",
                      },
                    ]}
                    placeholder="Energy"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="CARFAX">
                  <Input placeholder="CARFAX" type="CARFAX" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your description!",
                    },
                  ]}
                >
                  <TextArea rows={3} placeholder="description" type="texte" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="options"
                  rules={[
                    {
                      required: true,
                      message: "Please input options!",
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    size="middle"
                    multiple
                    options={[
                      {
                        label: "Équipements de Confort",
                        options: [
                          {
                            label: '4 sièges "capitaine"',
                            value: '4 sièges "capitaine"',
                          },
                          {
                            label: "Commande audio aux sièges arrières",
                            value: "Commande audio aux sièges arrières",
                          },
                          { label: "Console", value: "Console" },
                          {
                            label: "Intérieur cuir (or Intérieur Similicuir)",
                            value: "Intérieur cuir (or Intérieur Similicuir)",
                          },
                          {
                            label: "Sièges chauffants",
                            value: "Sièges chauffants",
                          },
                          {
                            label: "Sièges ventilés",
                            value: "Sièges ventilés",
                          },
                          {
                            label: "Sièges électriques",
                            value: "Sièges électriques",
                          },
                          { label: "Climatisation", value: "Climatisation" },
                          {
                            label: "Commandes de la radio au volant",
                            value: "Commandes de la radio au volant",
                          },
                          {
                            label: "Siège troisième rangée (if applicable)",
                            value: "Siège troisième rangée (if applicable)",
                          },
                          { label: "Stow in Go", value: "Stow in Go" },
                          {
                            label: "Air climatisé et chauffage arrière",
                            value: "Air climatisé et chauffage arrière",
                          },
                          {
                            label: "Mémoires de sièges",
                            value: "Mémoires de sièges",
                          },
                          {
                            label: "Sièges baquets (if applicable)",
                            value: "Sièges baquets (if applicable)",
                          },
                          {
                            label: "Sièges inclinables",
                            value: "Sièges inclinables",
                          },
                          {
                            label: "Verre vie privée",
                            value: "Verre vie privée",
                          },
                          {
                            label: "Volant gainé de cuir",
                            value: "Volant gainé de cuir",
                          },
                          {
                            label: "Volant chauffant (if applicable)",
                            value: "Volant chauffant (if applicable)",
                          },
                          {
                            label: "Volant ajustable",
                            value: "Volant ajustable",
                          },
                          {
                            label: "Volant télescopique",
                            value: "Volant télescopique",
                          },
                          { label: "Lecteur DVD", value: "Lecteur DVD" },
                          {
                            label: "Pédalier réglable",
                            value: "Pédalier réglable",
                          },
                          {
                            label:
                              "Régulation de la température par zones (if applicable)",
                            value:
                              "Régulation de la température par zones (if applicable)",
                          },
                        ],
                      },
                      {
                        label: "Équipements de Sécurité",
                        options: [
                          { label: "Alarme", value: "Alarme" },
                          { label: "Antivol", value: "Antivol" },
                          {
                            label: "Contrôle de traction",
                            value: "Contrôle de traction",
                          },
                          {
                            label: "Coussins gonflables cond.",
                            value: "Coussins gonflables cond.",
                          },
                          {
                            label: "Coussins gonflables doubles",
                            value: "Coussins gonflables doubles",
                          },
                          {
                            label: "Coussins gonflables latéraux",
                            value: "Coussins gonflables latéraux",
                          },
                          {
                            label: "Détecteur de rechange",
                            value: "Détecteur de rechange",
                          },
                          { label: "Feux de jour", value: "Feux de jour" },
                          {
                            label: "Freinage antiblocage (ABS)",
                            value: "Freinage antiblocage (ABS)",
                          },
                          {
                            label: "Indicateurs analogiques",
                            value: "Indicateurs analogiques",
                          },
                          {
                            label:
                              "Pare-soleil de lunette arrière télécommandé",
                            value:
                              "Pare-soleil de lunette arrière télécommandé",
                          },
                          {
                            label: "Phares anti-brouillard",
                            value: "Phares anti-brouillard",
                          },
                          {
                            label: "Phares aux Xénon",
                            value: "Phares aux Xénon",
                          },
                          {
                            label: "Rétroviseur anti-éblouissement",
                            value: "Rétroviseur anti-éblouissement",
                          },
                          {
                            label: "Serrures à l'épreuve des enfants",
                            value: "Serrures à l'épreuve des enfants",
                          },
                          {
                            label:
                              "Système d'assistance stationnement / Capteurs de mouvement",
                            value:
                              "Système d'assistance stationnement / Capteurs de mouvement",
                          },
                          {
                            label: "Système d'évitement de collision",
                            value: "Système d'évitement de collision",
                          },
                          {
                            label: "Verrouillage sans clef",
                            value: "Verrouillage sans clef",
                          },
                          {
                            label: "Verrouillage électrique",
                            value: "Verrouillage électrique",
                          },
                        ],
                      },

                      {
                        label: "Équipements de Divertissement",
                        options: [
                          {
                            label: "Audio haut de gamme",
                            value: "Audio haut de gamme",
                          },
                          { label: "Chaine JBL", value: "Chaine JBL" },
                          {
                            label: "Changeur CD/MP3",
                            value: "Changeur CD/MP3",
                          },
                          { label: "Lecteur CD/MP3", value: "Lecteur CD/MP3" },
                          {
                            label: "Radio satellite",
                            value: "Radio satellite",
                          },
                          {
                            label: "Système audio commandé par la voix",
                            value: "Système audio commandé par la voix",
                          },
                          {
                            label: "Système de navigation",
                            value: "Système de navigation",
                          },
                          { label: "Télé couleur", value: "Télé couleur" },
                          { label: "Bluetooth", value: "Bluetooth" },
                          {
                            label: "Centre d'information du conducteur",
                            value: "Centre d'information du conducteur",
                          },
                          {
                            label: "Horloge numérique",
                            value: "Horloge numérique",
                          },
                          {
                            label: "Système Home Link",
                            value: "Système Home Link",
                          },
                        ],
                      },
                      {
                        label: "Équipements Extérieurs",
                        options: [
                          { label: "Aileron", value: "Aileron" },
                          {
                            label: "Antenne à commande électrique",
                            value: "Antenne à commande électrique",
                          },
                          {
                            label: "Benne basculante",
                            value: "Benne basculante",
                          },
                          {
                            label: "Cabine allongée (4 portes)",
                            value: "Cabine allongée (4 portes)",
                          },
                          {
                            label: "Essuie-glace de lunette arrière",
                            value: "Essuie-glace de lunette arrière",
                          },
                          {
                            label: "Fenêtre arrière coulissante",
                            value: "Fenêtre arrière coulissante",
                          },
                          {
                            label: "Hayon à ouverture mécanique",
                            value: "Hayon à ouverture mécanique",
                          },
                          {
                            label: "Jantes aluminium",
                            value: "Jantes aluminium",
                          },
                          {
                            label: "Lunette arrière coulissante",
                            value: "Lunette arrière coulissante",
                          }, // Duplicate entry removed
                          {
                            label: "Miroir côté passager",
                            value: "Miroir côté passager",
                          },
                          {
                            label: "Panneau de toit amovible",
                            value: "Panneau de toit amovible",
                          },
                          {
                            label: "Pare-broussaille",
                            value: "Pare-broussaille",
                          },
                          {
                            label: "Pare-chocs avec marchepied",
                            value: "Pare-chocs avec marchepied",
                          },
                          {
                            label: "Pneus hors-route",
                            value: "Pneus hors-route",
                          },
                          {
                            label: "Porte coulissante motorisée",
                            value: "Porte coulissante motorisée",
                          },
                          { label: "Porte-bagages", value: "Porte-bagages" },
                          { label: "Protège-caisse", value: "Protège-caisse" },
                          {
                            label: "Roue de secours montée à l'arrière",
                            value: "Roue de secours montée à l'arrière",
                          },
                          {
                            label: "Roues surdimensionnées",
                            value: "Roues surdimensionnées",
                          },
                          {
                            label: "Barre de sécurité",
                            value: "Barre de sécurité",
                          },
                          {
                            label: "Capot de caisse",
                            value: "Capot de caisse",
                          },
                          { label: "Chaine Bose", value: "Chaine Bose" }, // This might be under Audio instead of Exterior/Styling
                          {
                            label: "Enjoliveur deluxe",
                            value: "Enjoliveur deluxe",
                          },
                          {
                            label: "Enjoliveur de roues",
                            value: "Enjoliveur de roues",
                          },
                          { label: "Marche-pieds", value: "Marche-pieds" }, // Same as Running boards
                          {
                            label: "Panneaux amovibles",
                            value: "Panneaux amovibles",
                          },
                          {
                            label: "Pont élévateur hydraulique",
                            value: "Pont élévateur hydraulique",
                          },
                          { label: "Toit amovible", value: "Toit amovible" },
                          { label: "Toit en T", value: "Toit en T" },
                          {
                            label: "Toit ouvrant assisté",
                            value: "Toit ouvrant assisté",
                          },
                          {
                            label: "Toit ouvrant à vision panoramique",
                            value: "Toit ouvrant à vision panoramique",
                          },
                          {
                            label: "Verrière/Canopée",
                            value: "Verrière/Canopée",
                          },
                        ],
                      },
                      {
                        label: "Équipements de Performance",
                        options: [
                          { label: "Boite courte", value: "Boite courte" },
                          { label: "Chauffe-bloc", value: "Chauffe-bloc" },
                          {
                            label: "Ensemble de remorquage",
                            value: "Ensemble de remorquage",
                          },
                          {
                            label: "Freins à disques assistés",
                            value: "Freins à disques assistés",
                          },
                          { label: "Propulsion", value: "Propulsion" }, // This might be more specific (engine type - rear-wheel drive, all-wheel drive, etc.)
                          {
                            label: "Régulateur de vitesse et d'espacement",
                            value: "Régulateur de vitesse et d'espacement",
                          },
                          { label: "Servo-freins", value: "Servo-freins" }, // Same as Power brakes
                          {
                            label: "Transmission intégrale",
                            value: "Transmission intégrale",
                          },
                          { label: "Treuil", value: "Treuil" },
                        ],
                      },

                      {
                        label: "Équipements Divers",
                        options: [
                          {
                            label: "Odomètre journalier",
                            value: "Odomètre journalier",
                          },
                          {
                            label: "Phares halogènes",
                            value: "Phares halogènes",
                          },
                          {
                            label: "Prise auxiliaire 12 volts",
                            value: "Prise auxiliaire 12 volts",
                          },
                          {
                            label: "Servo-direction",
                            value: "Servo-direction",
                          },
                          {
                            label: "Système d'assistance",
                            value: "Système d'assistance",
                          }, // Not specific enough
                          { label: "Anti-démarreur", value: "Anti-démarreur" },
                          { label: "Compte-tours", value: "Compte-tours" },
                          {
                            label: "Contrôle d'assistance ascension",
                            value: "Contrôle d'assistance ascension",
                          },
                          {
                            label: "Contrôle de stabilité",
                            value: "Contrôle de stabilité",
                          },
                          { label: "Couvre boite", value: "Couvre boite" }, // Might be bed cover or tonneau cover
                          {
                            label: "Dégivreur arrière",
                            value: "Dégivreur arrière",
                          },
                          {
                            label: "Deux portières coulissantes",
                            value: "Deux portières coulissantes",
                          },
                          {
                            label: "Entièrement équipé",
                            value: "Entièrement équipé",
                          }, // Not specific enough
                          {
                            label: "Essuie-glace intermittent",
                            value: "Essuie-glace intermittent",
                          },
                          {
                            label: "Groupe Equip, pour chasse neige",
                            value: "Groupe Equip, pour chasse neige",
                          }, // Snow plow equipment package
                          {
                            label: "Intérieur Tissus",
                            value: "Intérieur Tissus",
                          },
                          {
                            label: "Levier intérieur d'ouverture de capot",
                            value: "Levier intérieur d'ouverture de capot",
                          },
                          {
                            label: "Ordinateur de route",
                            value: "Ordinateur de route",
                          },
                          {
                            label: "Paquet De Charrue",
                            value: "Paquet De Charrue",
                          }, // Plow package (same as Groupe Equip, pour chasse neige)
                          {
                            label: "Pare-soleil avec miroir illuminé",
                            value: "Pare-soleil avec miroir illuminé",
                          },
                          {
                            label: "Peinture deux tons",
                            value: "Peinture deux tons",
                          },
                          {
                            label: "Phares automatiques",
                            value: "Phares automatiques",
                          },
                          {
                            label: "Plate forme basculante",
                            value: "Plate forme basculante",
                          }, // Might be dump bed or tipping bed
                          {
                            label: "Point d'attache de la remorque",
                            value: "Point d'attache de la remorque",
                          },
                          {
                            label: "Vitres teintées",
                            value: "Vitres teintées",
                          },
                          {
                            label: "Vitres électriques",
                            value: "Vitres électriques",
                          },
                          {
                            label: "Vide-poches (portes)",
                            value: "Vide-poches (portes)",
                          },
                        ],
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    </Form>
  );
};

export default AddOrUpdateModalCars;

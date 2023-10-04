import { useState, useEffect } from "react";

import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  List,
  Avatar,
  Input,
  Drawer,
  Typography,
  Switch,
  Space,
  Menu,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import { NavLink, Link } from "react-router-dom";
import styled from "styled-components";
import avtar from "../../assets/images/team-2.jpg";
import axios from "axios";
import { getJSON } from "../../utils";
import moment from "moment";
import _ from "lodash";

const wifi = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 107 107"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="logo-spotify" fill="#2EBD59" fillRule="nonzero">
        <path
          d="M53.5,0 C23.9517912,0 0,23.9517912 0,53.5 C0,83.0482088 23.9517912,107 53.5,107 C83.0482088,107 107,83.0482088 107,53.5 C107,23.9554418 83.0482088,0.00365063118 53.5,0 Z M78.0358922,77.1597407 C77.0757762,78.7368134 75.0204708,79.2296486 73.4506994,78.2695326 C60.8888775,70.5922552 45.0743432,68.8582054 26.4524736,73.1111907 C24.656363,73.523712 22.8675537,72.3993176 22.458683,70.6032071 C22.0461617,68.8070966 23.1669055,67.0182873 24.9666667,66.6094166 C45.3444899,61.9548618 62.8273627,63.9590583 76.9297509,72.5745479 C78.4995223,73.5419652 78.9996588,75.5899693 78.0358922,77.1597407 L78.0358922,77.1597407 Z M84.5814739,62.5973729 C83.373115,64.5614125 80.8030706,65.1747185 78.8426817,63.9700102 C64.4664961,55.1318321 42.5408052,52.5727397 25.5325145,57.7347322 C23.3275333,58.4027977 20.9984306,57.1579324 20.3267144,54.9566018 C19.6622996,52.7516206 20.9071648,50.4261685 23.1084954,49.7544524 C42.5371546,43.858683 66.6933811,46.7134766 83.2051859,56.8622313 C85.1692255,58.0705902 85.7898328,60.636984 84.5814739,62.5973729 Z M85.1436711,47.4253497 C67.8980894,37.1853292 39.4523712,36.2434664 22.9880246,41.2375299 C20.3449676,42.0406687 17.5485841,40.5475606 16.7490959,37.9045036 C15.9496076,35.2614466 17.4390652,32.4650631 20.0857728,31.6619243 C38.9850904,25.9267827 70.3987718,27.0329239 90.2509041,38.8171614 C92.627465,40.2299556 93.4087001,43.3001365 91.9995565,45.6730467 C90.5940635,48.0532583 87.5165814,48.838144 85.1436711,47.4253497 Z"
          id="Shape"
        ></path>
      </g>
    </g>
  </svg>,
];

const credit = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fill="#1890FF"
      d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
    ></path>
    <path
      fill="#1890FF"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
    ></path>
  </svg>,
];

const clockicon = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.2652 9.10536 10.5196 9.29289 10.7071L12.1213 13.5355C12.5118 13.9261 13.145 13.9261 13.5355 13.5355C13.9261 13.145 13.9261 12.5118 13.5355 12.1213L11 9.58579V6Z"
      fill="#111827"
    ></path>
  </svg>,
];

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

function Header({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const { Title, Text } = Typography;
  const handlelogout = () => {
    localStorage.clear();
  };

  const [notif, setnotif] = useState(false);
  const [listnotif, setlistnotif] = useState([]);

  const menu = (
    <Menu>
      <Menu.Item key="3">
        <Link to="/sign-in" onClick={handlelogout}>
          logout
        </Link>
      </Menu.Item>
    </Menu>
  );
  const config = {
    headers: {
      authorization: getJSON(localStorage.getItem("token")),
    },
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      let list = [];
      await axios
        .get("https://www.PrimoCarthage.fr/api/simulations", config)
        .then((response) => {
          if (response.data) {
            let listSimul = response.data.filter((simul) =>
              moment(moment().format("YYYY-MM-DD")).isSame(
                moment(simul?.created_at).format("YYYY-MM-DD")
              )
            );
            listSimul = listSimul?.map((simul) => ({
              notifTitle: `Nouvelle Simulation`,
              notifcontent: `Simuler par ${simul?.email} le ${moment(
                simul?.created_at
              ).format("YYYY-MM-DD")}`,
              type: "SIMUL",
            }));
            list = list.concat(listSimul);
          }
        });

      await axios
        .get("https://www.PrimoCarthage.fr/api/reservation", config)
        .then((response) => {
          if (response.data) {
            let listReserv = response.data.filter((reserv) =>
              moment(moment().format("YYYY-MM-DD")).isSame(
                moment(reserv?.created_at).format("YYYY-MM-DD")
              )
            );

            listReserv = listReserv?.map((reserv) => ({
              notifTitle: `Nouvelle reunion pour ${reserv?.name}`,
              notifcontent: `email:${reserv?.email} / date: ${moment(
                reserv?.date
              ).format("MMMM Do YYYY, h:mm:ss a")}`,
              type: "RES",
            }));
            list = list.concat(listReserv);
          }
        });
      await axios
        .get("https://www.PrimoCarthage.fr/api/contact", config)
        .then((response) => {
          if (response.data) {
            let listContact = response.data.filter((conatct) =>
              moment(moment().format("YYYY-MM-DD")).isSame(
                moment(conatct?.created_at).format("YYYY-MM-DD")
              )
            );

            listContact = listContact?.map((conatct) => ({
              notifTitle: `Nouveau message par ${conatct?.name}`,
              notifcontent: `message: ${conatct?.message} / date: ${moment(
                conatct?.created_at
              ).format("MMMM Do YYYY, h:mm:ss a")}`,
              type: "CON",
            }));
            list = list.concat(listContact);
          }
        });
      setlistnotif(list);
    })();
  }, []);

  return (
    <Row gutter={[24, 0]} justify="end">
      <Col span={24} md={18} className="header-control">
        <Space size="middle" direction="horizontal">
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => onPress()}
          >
            {toggler}
          </Button>
          <Text type="secondary" strong>
            <span>{JSON.parse(localStorage.getItem("user"))?.name}</span>
          </Text>
          <Badge count={listnotif.length}>
            <Dropdown
              overlay={menu}
              trigger={["hover"]}
              style={{ cursor: "pointer" }}
            >
              <Avatar size="large" style={{ cursor: "pointer" }}>
                <UserOutlined />
              </Avatar>
            </Dropdown>
          </Badge>
        </Space>
      </Col>
      <Drawer
        title="Notification"
        placement="right"
        onClose={() => setnotif(false)}
        visible={notif}
      >
        <List
          itemLayout="horizontal"
          dataSource={listnotif}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={
                  <Link
                    to={
                      item.type === "SIMUL"
                        ? "/semulations"
                        : item.type === "RES"
                        ? "/meeting"
                        : "/contact"
                    }
                  >
                    {item.notifTitle}
                  </Link>
                }
                description={item.notifcontent}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </Row>
  );
}

export default Header;

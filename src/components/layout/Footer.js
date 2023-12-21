

import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just" justify="center">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2023
          </div>
        </Col>
 
      </Row>
    </AntFooter>
  );
}

export default Footer;

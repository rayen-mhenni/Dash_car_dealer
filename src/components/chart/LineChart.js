import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../../utils";

function LineChart() {
  const [data, setData] = useState([]);

  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  useEffect(() => {
    axios
      .get("https://www.PrimoCarthage.fr/api/stat/simul/chart", config)
      .then((response) => {
        if (response.data.months) {
          setData(response.data.months);
        } else {
        }
      });
  }, []);

  const series = [
    {
      name: "Simulations",
      data: data,
      offsetY: 0,
    },
  ];

  const { Title, Paragraph } = Typography;

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Simulations</Title>
        </div>
      </div>

      <ReactApexChart
        options={lineChart.options}
        series={series}
        type="area"
        height={300}
        width={1200}
      />
    </>
  );
}

export default LineChart;

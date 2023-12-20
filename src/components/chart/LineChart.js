import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { getJSON } from "../../utils";
import _ from 'lodash'

function LineChart() {
  const [data, setData] = useState([]);
  const [cat, setCat] = useState([]);

  const [token, setToken] = useState(getJSON(localStorage.getItem("token")));

  const config = {
    headers: {
      Authorization: token,
    },
  };

  useEffect(() => {
    axios
      .get("https://www.primocarthageauto.ca:8433/api/financing", config)
      .then((response) => {
        if (response.data.reclamations) {
          let rander = _.groupBy(response.data.reclamations, 'month')
          let cat = Object.keys(rander);
          const fin = []
          Object.values(rander).forEach((el, i) => {
            fin.push(el?.length)
          })
          setData(fin);
          setCat(cat);
        } else {
        }
      });
  }, []);




  const options = {
    chart: {
      width: "100%",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: ["#e4ca73"],
        },
      },
    },

    xaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: [
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73",
            "#e4ca73"
          ],
        },
      },
      categories: cat,
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },

    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1.5rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1.5rem",
                  },
                },
              },
            },
          },
        },
      },
    ],

  }


  const series = [
    {
      name: "Financing",
      data: data,
      offsetY: 0,
    },
  ];

  const { Title, Paragraph } = Typography;

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Financing</Title>
        </div>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height='100%'
        width='100%'
      />
    </>
  );
}

export default LineChart;

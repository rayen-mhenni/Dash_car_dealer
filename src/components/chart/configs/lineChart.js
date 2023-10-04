const lineChart = {


  options: {
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
          colors: ["#00aaa8"],
        },
      },
    },

    xaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: [
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8",
            "#00aaa8"
          ],
        },
      },
      categories: [
        "jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "oct",
        "nov",
        "dec"
      ],
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  },
};

export default lineChart;

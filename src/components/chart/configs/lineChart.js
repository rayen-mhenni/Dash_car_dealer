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

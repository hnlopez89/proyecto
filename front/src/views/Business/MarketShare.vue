<template>
  <div id="marketShare">
    <button id="up" @click="goBack()">Volver</button>

    <h1>Tu cuota de mercado</h1>
    <div id="stats">
      <table class="table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Tus reservas</th>
            <th>Reservas Totales</th>
            <th>Cuota de mercado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="month in statistic" :key="month.id">
            <td>{{month.check_in_month | month}}</td>
            <td>{{month.your_bookings}}</td>
            <td>{{month.total_bookings}}</td>
            <td>{{month.percentage | rounding}}</td>
          </tr>
        </tbody>
      </table>
      <!-- <Linechart v-if="loaded" :chart-data="values" :chart-labels="labels"></Linechart> -->
      <div class="chart-container" style="position: relative; width:1000px;">
        <canvas id="myChart" width="130px" height="60px"></canvas>
      </div>
      <!-- <pure-vue-chart
        :points="(values)"
        :show-values="true"
        :width="600"
        :height="300"
        :use-month-labels="true"
        :show-y-axis="true"
        :show-x-axis="true"
        :months="['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']"
      />-->
    </div>
    <div class="chart-container" style="position: relative; height:10vh; width:80vw;">
      <canvas id="comparative" width="130px" height="30px"></canvas>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import { getIdToken } from "../../utils";
import Chart from "chart.js";
//import Linechart from "../../components/LineChartComp";
import PureVueChart from "pure-vue-chart";

export default {
  name: "MarketShare",
  components: {
    PureVueChart,
    // Linechart,
  },
  data() {
    return {
      statistic: [],
      values: "",
      your_bookings: "",
      total_bookings: "",
    };
  },

  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    goBack() {
      window.history.back();
    },

    async marketShare() {
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/market_share"
        );
        this.statistic = response.data.yearlyShare;
        const percentage = [];
        const ownData = [];
        const totalData = [];
        const months = [];

        for (let i = 0; i < this.statistic.length; i++) {
          percentage.push(this.statistic[i].percentage);
          ownData.push(this.statistic[i].your_bookings);
          totalData.push(this.statistic[i].total_bookings);
          months.push({ month: i });
        }
        this.values = percentage;
        this.labels = months;
        this.your_bookings = ownData;
        this.total_bookings = totalData;
        this.loaded = true;

        /////////////////////////PRIMERA TABLA///////////////////////////
        let ctx = document.getElementById("myChart");
        let myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
            ],
            datasets: [
              {
                label: "% cuota de mercado",
                data: this.values,
                backgroundColor: ["rgba(254, 162, 105, 0)"],
                borderColor: ["rgba(254, 162, 105, 1)"],
                borderWidth: 3,
                showLine: true,
                line: [
                  {
                    backgroundColor: ["rgba(254, 162, 105, 0.5)"],
                  },
                ],
              },
            ],
          },
        });
        /////////////////////////SEGUNDA TABLA///////////////////////////

        let secondChart = document.getElementById("comparative");
        let stackedBar = new Chart(secondChart, {
          type: "bar",
          data: {
            labels: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
            ],
            datasets: [
              {
                label: "Reservas propias",
                data: this.your_bookings,
                backgroundColor: [
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                  "rgba(254, 162, 105, 1)",
                ],
                borderColor: ["rgba(255, 260, 260, 1)"],
                borderWidth: 0.2,
              },
              {
                label: "Reservas de tu zona y misma categoría",
                data: this.total_bookings,
                backgroundColor: [
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                  "rgba(154, 162, 105, 1)",
                ],
                borderColor: ["rgba(255, 260, 260, 1)"],
                borderWidth: 0.2,
              },
            ],
          },
          options: {
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: false,
                },
              ],
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.marketShare();
  },
};
</script>

<style scoped>
#marketShare {
  height: 100%;
  min-height: 100vh;
  max-width: 100%;
  background: linear-gradient(
      rgba(241, 253, 254, 0.9),
      rgba(241, 253, 254, 0.9)
    ),
    url(../../assets/brick.jpeg);
}

input {
  width: 12rem;
  margin: auto;
  border-radius: 5px;
  border: 0;
  display: block;
}

button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin-top: 1rem;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 15rem;
  text-align: left;
  border-collapse: collapse;
  margin: 2rem auto;
  margin-left: 4rem;
}

table td,
table th {
  border: 1px solid #aaaaaa;
  padding: 3px 2px;
}
table td,
table th {
  border: 1px solid #aaaaaa;
  padding: 3px 2px;
}
table tbody td {
  font-size: 13px;
}
table tr:nth-child(even) {
  background: #e9bb80;
}
table thead {
  background: coral;
  background: -moz-linear-gradient(top, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  background: -webkit-linear-gradient(
    top,
    #fe906a 0%,
    #fe794c 66%,
    #fe6b39 100%
  );
  background: linear-gradient(to bottom, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  border-bottom: 2px solid #444444;
}
table thead th {
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border-left: 2px solid #444444;
}
table thead th:first-child {
  border-left: none;
}

table tfoot {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background: #fe6b39;
  background: -moz-linear-gradient(top, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  background: -webkit-linear-gradient(
    top,
    #fe906a 0%,
    #fe794c 66%,
    #fe6b39 100%
  );
  background: linear-gradient(to bottom, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  border-top: 2px solid #444444;
}
table tfoot td {
  font-size: 14px;
}
table tfoot .links {
  text-align: right;
}
table tfoot .links a {
  display: inline-block;
  background: #ffffff;
  color: #fe6b39;
  padding: 2px 8px;
  border-radius: 5px;
}

#stats {
  display: flex;
  flex-direction: row;
  padding-right: 10rem;
  height: 30rem;
}
</style>
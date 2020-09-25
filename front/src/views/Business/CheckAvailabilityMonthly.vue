<template>
  <div id="checkAvailabilityMonthly">
    <button id="up" @click="goBack()">Volver</button>

    <h1>Comprueba tu disponibilidad Mensual</h1>
    <div id="selector">
      <label>Escoge el mes</label>
      <select v-model="checkInMonth">
        <option value="0">Enero</option>
        <option value="1">Febrero</option>
        <option value="2">Marzo</option>
        <option value="3">Abril</option>
        <option value="4">Mayo</option>
        <option value="5">Junio</option>
        <option value="6">Julio</option>
        <option value="7">Agosto</option>
        <option value="8">Septiembre</option>
        <option value="9">Octubre</option>
        <option value="10">Noviembre</option>
        <option value="11">Diciembre</option>
      </select>
      <button @click="getAvailability()">Ver tú disponibilidad</button>
    </div>

    <table id="summaryMonth">
      <thead>
        <tr>
          <th>Mes</th>
          <th>Reservas</th>
          <th>Capacidad</th>
          <th>% Ocupación</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{summary.month | month}}</td>
          <td>{{summary.totalBookings}}</td>
          <td>{{summary.totalAvailable}}</td>
          <td>{{summary.occ }}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Día</th>
          <th>Reservas</th>
          <th>Capacidad</th>
          <th>% Ocupación</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="slot in availability" :key="slot.id">
          <td>{{formatDate(slot.day)}}</td>
          <td>{{slot.totalBookings}}</td>
          <td>{{slot.totalAvailable}}</td>
          <td>{{slot.occ }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "CheckAvailabilityMonthly",
  components: {},
  data() {
    return {
      availability: [],
      summary: [],
      checkInMonth: "",
    };
  },

  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    goBack() {
      window.history.back();
    },

    async getAvailability() {
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/availability_monthly",
          {
            params: {
              checkInMonth: this.checkInMonth,
            },
          }
        );
        console.log(response);
        this.availability = response.data.data;
        this.summary = response.data.summary;
        console.log(this.summary);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getAvailability();
  },
};
</script>


<style scoped>
#checkAvailabilityMonthly {
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
}
#summaryMonth {
  height: 4rem;
}
#summaryMonth > tbody tr td {
  font-size: 20px;
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
  width: 70%;
  text-align: left;
  border-collapse: collapse;
  margin: 2rem auto;
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

#selector {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  width: 13rem;
  margin: auto;
}
</style>
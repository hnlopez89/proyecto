<template>
  <div id="checkAvailability">
    <button id="up" @click="goBack()">Volver</button>

    <h1>Comprueba tu disponibilidad</h1>
    <input v-model="checkInDay" type="date" />
    <button @click="getAvailability()">Ver tú disponibilidad</button>

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
        <tr>
          <td>{{formatDate(summary.day)}}</td>
          <td>{{summary.totalBookings}}</td>
          <td>{{summary.totalAvailable}}</td>
          <td>{{summary.occ | rounding }}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Día</th>
          <th>Hora</th>
          <th>Reservas</th>
          <th>Capacidad</th>
          <th>% Ocupación</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="slot in availability" :key="slot.id">
          <td>{{formatDate(slot.check_in_day)}}</td>
          <td>{{slot.check_in_time}}:{{slot.minutes | addzero}}</td>
          <td>{{slot.bookings}}</td>
          <td>{{slot.allotment}}</td>
          <td>{{slot.occ | rounding }}</td>
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
  name: "Home",
  components: {},
  data() {
    return {
      availability: [],
      summary: [],
      checkInDay: "",
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
            "/availability",
          {
            params: {
              checkInDay: this.checkInDay,
            },
          }
        );
        this.availability = response.data.data;
        this.summary = response.data.summary;
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
#checkAvailability {
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
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
</style>
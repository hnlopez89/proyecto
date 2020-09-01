<template>
  <div id="checkAvailability">
    <button @click="goBack()">Go Back</button>

    <h1>Comprueba tu disponibilidad</h1>
    <input v-model="checkInDay" type="date" />
    <button @click="getAvailability()">Ver tú disponibilidad</button>
    <table class="table">
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
          <td>{{slot.check_in_day}}</td>
          <td>{{slot.check_in_time}}</td>
          <td>{{slot.bookings}}</td>
          <td>{{slot.allotment}}</td>
          <td>{{slot.occ}}</td>
        </tr>
      </tbody>
    </table>
    <!--<ul>
      <li v-for="slot in availability" :key="slot.id">
        <p>
          <b>Día:</b>
          {{slot.check_in_day}}
        </p>
        <p>
          <b>Hora:</b>
          {{slot.check_in_time}}
        </p>
        <p>
          <b>Reservas:</b>
          {{slot.bookings}}
        </p>
        <p>
          <b>Capacidad:</b>
          {{slot.allotment}}
        </p>
        <p>
          <b>% Ocupación:</b>
          {{slot.occ}}
        </p>
      </li>
    </ul>-->
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      availability: [],
      checkInDay: "",
    };
  },

  methods: {
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
        console.log(response);
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
}
table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 90%;
  text-align: left;
  border-collapse: collapse;
  margin: 3rem 0 0 3rem;
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
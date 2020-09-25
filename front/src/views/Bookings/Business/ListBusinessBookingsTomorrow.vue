<template>
  <div id="ListBusinessBookingsTomorrow">
    <button id="up" @click="goBack()">Volver</button>
    <h1>MIS RESERVAS DE MAÑANA</h1>
    <div v-if="bookings.length === 0">
      <h3>No tienes reservas para mañana</h3>
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>ID reserva</th>
          <th>Estado reserva</th>
          <th>Nombre Cliente</th>
          <th>Apellido Usuario</th>
          <th>Dia check in</th>
          <th>Hora check in</th>
          <th>Hora check out</th>
          <th>Unidades</th>
          <th>Fecha creación</th>
          <th>Fecha actualización</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td data-label="ID reserva">
            <router-link
              :to="{name: 'BookingUser', params: { id: booking.id}, hash: '#up'}"
            >{{booking.id}}</router-link>
          </td>
          <td data-label="Estado reserva">{{booking.status}}</td>
          <td data-label="Nombre Cliente">{{booking.name}}</td>
          <td data-label="Apellido Usuario">{{booking.surname}}</td>
          <td data-label="Dia check in">{{formatDate(booking.check_in_day)}}</td>
          <td data-label="Hora check in">{{formatTime(booking.check_in_time)}}</td>
          <td data-label="Hora check out">{{formatTime(booking.check_out_time)}}</td>
          <td data-label="Unidades">{{booking.units}}</td>
          <td data-label="Fecha creación">{{formatDateTime(booking.creating_date)}}</td>
          <td data-label="Fecha actualización">{{formatDateTime(booking.update_date)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { format } from "date-fns";

import getlistbooking from "@/components/ListBusinessBookingComp.vue";
import axios from "axios";
import { getIdToken } from "../../../utils";

export default {
  name: "ListBusinessBookingsTomorrow",
  components: {
    getlistbooking,
  },
  data() {
    return {
      bookings: [],
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatTime(datetime) {
      return format(new Date(datetime), "HH:mm");
    },

    formatDateTime(datetime) {
      return format(new Date(datetime), "dd/MM/yyyy HH:mm");
    },

    async getListBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        console.log(getIdToken(token));
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking_tomorrow/"
        );
        this.bookings = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getListBooking();
  },
};
</script>

<style scoped>
#ListBusinessBookingsTomorrow {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../../assets/tempo.jpg);
  width: 100%;
  min-height: 100vh;
}

button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem 0 2rem;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 90%;
  text-align: left;
  border-collapse: collapse;
  margin: auto;
  padding-bottom: 1rem;
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

@media screen and (max-width: 1000px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>
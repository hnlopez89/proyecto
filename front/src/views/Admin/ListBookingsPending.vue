<template>
  <div class="ListBookingsPending">
    <button id="up" @click="goBack()">Volver</button>
    <h1>RESERVAS PENDIENTES DE PAGO</h1>
    <h3 v-if="bookings.length === 0">*No tienes reservas pendientes de pago*</h3>
    <div v-else>
      <h4>*Hacer seguimiento, las reservas con fecha de entrada anterior a actual, cancelarlas</h4>
      <table class="table">
        <thead>
          <tr>
            <th>ID usuario</th>
            <th>ID reserva</th>
            <th>Estado Reserva</th>
            <th>Hora de check in</th>
            <th>Hora de check out</th>
            <th>ID negocio</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td data-label="ID usuario">
              <router-link
                :to="{name: 'CheckUser', params: { id: booking.id_user}, hash: '#up'}"
              >{{booking.id_user}}</router-link>
            </td>
            <td data-label="ID reserva">
              <router-link
                :to="{name: 'BookingUser', params: { id: booking.id}, hash: '#up'}"
              >{{booking.id}}</router-link>
            </td>
            <td data-label="Estado reserva">{{booking.status}}</td>
            <td data-label="Hora check in">{{formatDateTime(booking.check_in_time)}}</td>
            <td data-label="Hora check out">{{formatDateTime(booking.check_out_time)}}</td>
            <td data-label="ID negocio">
              <router-link
                :to="{name: 'CheckBusiness', params: { id: booking.id_business}, hash: '#up'}"
              >{{booking.id_business}}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";
import { format } from "date-fns";

export default {
  name: "ListBookingsPending",

  data() {
    return {
      bookings: [],
      name: "",
      city: "",
      checkInDay: "",
      creatingDate: "",
      status: "",
      category: "",
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatDateTime(datetime) {
      return format(new Date(datetime), "dd/MM/yyyy HH:mm");
    },
    async getListBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" +
            getIdToken(token) +
            "/bookings_pending/"
        );
        this.bookings = response.data.data;
        console.log(response.data.data);
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
.ListBookingsPending {
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
}

h1 {
  margin-bottom: 5rem;
}
h3 {
  color: red;
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
  margin: 1rem;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}
table {
  width: 100%;
}
table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
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
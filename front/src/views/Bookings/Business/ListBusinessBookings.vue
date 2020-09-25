<template>
  <div id="ListBusinessBookings">
    <button id="up" @click="goBack()">Volver</button>
    <h1>Registro de reservas</h1>
    <div id="buscador">
      <input v-model="id" type="text" placeholder="Id de la reserva" />
      <input v-model="name" type="text" placeholder="Nombre del cliente" />
      <input v-model="surname" type="text" placeholder="Apellido del cliente" />
      <label for>Día de llegada</label>
      <input v-model="checkInDay" type="date" />
      <label for>Hora de llegada</label>
      <input step="360" v-model="checkInTime" type="datetime-local" />
      <label for="status">Estado de la reserva</label>
      <select id="status" v-model="status">
        <option value="CONFIRMADO">Confirmado</option>
        <option value="MODIFICADO">Modificado</option>
        <option value="CANCELADO">Cancelado</option>
        <option value="CHECK_OUT">Check Out</option>
        <option value="CHECK_IN">Check In</option>
        <option value="NO_SHOW">No show</option>
        <option value="PENDIENTE_DE_PAGO">Pendiente de pago</option>
        <option selected="selected">(todas las categorías)</option>
      </select>
      <label for>Creación de reserva</label>

      <input v-model="creatingDate" type="date" />

      <input v-model="units" type="text" placeholder="Unidades" />
      <button @click="query()">Buscar</button>
    </div>
    <div v-if="bookings.length === 0">
      <h3>No hay reservas que mostrar</h3>
    </div>
    <div v-else>
      <form id="ordered" v-if="isQuery">
        <label for>Ordenar por</label>
        <select @click="query()" id="orderBy">
          <option value="id">ID Reserva</option>
          <option value="name">Nombre</option>
          <option value="surname">Apellido</option>
          <option value="check_in_time">Hora de llegada</option>
          <option value="check_in_day">Día de llegada</option>
          <option value="status">Estado de la reserva</option>
          <option value="units">Unidades</option>
          <option value="rating">Valoración</option>
          <option value="creating_date">Creación de reserva</option>
        </select>
        <label>Sentido:</label>
        <select @click="query()" id="direction">
          <option value="ASC">ascendente</option>
          <option value="DESC">descendente</option>
        </select>
      </form>
      <table class="table">
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
            <th>Puntuación</th>
            <th>Descriptición puntuación</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="booking in showedBookings" :key="booking.id">
            <td data-label="ID reserva">
              <router-link
                :to="{name: 'BookingBusiness', params: { id: booking.id}, hash: '#up'}"
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
            <td data-label="Puntuación">{{booking.rating}}</td>
            <td data-label="Descriptición puntuación">{{booking.rating_description}}</td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{'disabled': currentPage === 0}">
            <button class="page-link" @click="previousPage">Anterior</button>
          </li>

          <li
            v-for="page in pages"
            :key="page"
            class="page-item"
            :class="{'active': currentPage === page}"
          >
            <button class="page-link" @click="goToPage(page)">{{ page + 1 }}</button>
          </li>

          <li class="page-item" :class="{'disabled': currentPage === pages.length - 1}">
            <button class="page-link" @click="nextPage">Siguiente</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";

import axios from "axios";
import { getIdToken } from "../../../utils";

export default {
  name: "ListBusinessBookings",
  data() {
    return {
      bookings: [],
      id: "",
      name: "",
      surname: "",
      checkInDay: "",
      checkInTime: "",
      status: "",
      creatingDate: "",
      units: "",
      isQuery: false,
      currentIndex: 0,
      elementsPerPage: 20,
      currentPage: 0,
    };
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatTime(datetime) {
      return format(new Date(datetime), "HH:mm");
    },

    formatDateTime(datetime) {
      return format(new Date(datetime), "dd/MM/yyyy HH:mm");
    },

    goBack() {
      window.history.back();
    },
    async getListBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking_today/"
        );
        this.bookings = response.data.data;
        console.log(this.bookings);
      } catch (error) {
        console.log(error);
      }
    },
    async query() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        if (
          document.getElementById("orderBy") &&
          document.getElementById("direction")
        ) {
          const firstSelect = document.getElementById("orderBy");
          const orderBy = firstSelect.options[firstSelect.selectedIndex].value;
          const secondSelect = document.getElementById("direction");
          const direction =
            secondSelect.options[secondSelect.selectedIndex].value;
          const response = await axios.get(
            "http://localhost:3000/business/" +
              getIdToken(token) +
              "/booking_advanced",
            {
              params: {
                idBooking: this.id,
                name: this.name,
                surname: this.surname,
                status: this.status,
                checkInDay: this.checkInDay,
                checkInTime: this.checkInTime,
                units: this.units,
                creatingDate: this.creatingDate,
                order: orderBy,
                direction: direction,
              },
            }
          );
          console.log(getIdToken);
          this.bookings = response.data.data;
          this.isQuery = true;
        } else {
          const response = await axios.get(
            "http://localhost:3000/business/" +
              getIdToken(token) +
              "/booking_advanced",
            {
              params: {
                idBooking: this.id,
                name: this.name,
                surname: this.surname,
                status: this.status,
                checkInDay: this.checkInDay,
                checkInTime: this.checkInTime,
                units: this.units,
                creatingDate: this.creatingDate,
              },
            }
          );
          this.bookings = response.data.data;
          this.isQuery = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    previousPage() {
      this.currentPage = this.currentPage - 1;
      this.currentIndex = this.currentIndex - this.elementsPerPage;
    },
    nextPage() {
      this.currentPage = this.currentPage + 1;
      this.currentIndex = this.currentIndex + this.elementsPerPage;
    },
    goToPage(page) {
      this.currentPage = page;
      this.currentIndex = page * this.elementsPerPage;
    },
  },
  computed: {
    showedBookings() {
      return this.bookings.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(
        this.bookings.length / this.elementsPerPage
      );
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      return pageArray;
    },
  },
  created() {
    this.getListBooking();
  },
};
</script>

<style scoped>
.disabled {
  display: none;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

#ListBusinessBookings {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../../assets/tempo.jpg);
  width: 100%;
  min-height: 100vh;
}

.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0;
}

li {
  list-style: none;
}

#buscador {
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 15rem;
  margin: 0 auto;
  background-color: rgba(20, 20, 20, 0.8);
  border-radius: 1rem;
  border: 0.1rem coral solid;
}

input {
  width: 12rem;
  margin-bottom: 0.3rem;
  border-radius: 5px;
  border: 0;
  margin: 0.2rem auto;
}

select {
  position: center;
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem auto;
  width: 10rem;
}

label {
  color: white;
  margin: auto;
  margin-top: 0.5rem;
}

button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid coral;
  margin: 0.5rem auto;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bolder;
  background-color: rgb(255, 255, 255);
  color: coral;
  text-align: center;
  margin-top: 1rem;
}

#ordered {
  color: coral;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
}

#ordered > select {
  border-radius: 1rem;
  border: 0;
}

#ordered > label {
  margin: 0.3rem 0;
}

table {
  border: 1px solid coral;
  background-color: #eeeeee;
  text-align: left;
  border-collapse: collapse;
  margin: auto;
  margin-top: 1rem;
}

table td,
table th {
  border: 1px solid #aaaaaa;
  padding: 3px 2px;
}
a {
  text-decoration: none;
  color: black;
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
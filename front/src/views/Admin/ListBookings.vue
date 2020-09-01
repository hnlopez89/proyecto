<template>
  <div class="ListBookings">
    <button @click="goBack()">Go Back</button>
    <h1>REGISTRO DE RESERVAS</h1>
    <button @click="isQuery = !isQuery">Búsqueda Avanzada</button>
    <fieldset v-show="isQuery">
      <h4>Busca tu reserva</h4>
      <input v-model="idBooking" type="text" placeholder="ID de la reserva" />
      <input v-model="idBusiness" type="text" placeholder="ID del establecimiento" />
      <input v-model="name" type="text" placeholder="Nombre del establecimiento" />
      <label for>Categoría del negocio</label>
      <select v-model="category">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERIA">Peluquería</option>
        <option>(todas las categorías)</option>
      </select>
      <input v-model="idUser" type="text" placeholder="ID del usuario" />
      <input v-model="surname" type="text" placeholder="Apellido del usuario" />
      <label for>Día de llegada</label>
      <input v-model="checkInDay" type="date" placeholder="día de llegada" />
      <label for>Hora de llegada</label>
      <input v-model="checkInTime" type="datetime-local" placeholder="día de llegada" />
      <input v-model="units" type="text" placeholder="Unidades" />
      <label for>Estado de la reserva</label>
      <select v-model="status">
        <option value="CONFIRMADO">Confirmado</option>
        <option value="MODIFICADO">Modificado</option>
        <option value="CANCELADO">Cancelado</option>
        <option value="CHECK_OUT">Check Out</option>
        <option value="CHECK_IN">Check In</option>
        <option value="NO_SHOW">No show</option>
        <option value="PENDIENTE_DE_PAGO">Pendiente de pago</option>
        <option selected="selected">(todas las categorías)</option>
      </select>
      <label for>Fecha de creación</label>
      <input v-model="creatingDate" type="date" placeholder="Fecha de creación" />
      <button @click="query()">Buscar</button>
    </fieldset>
    <form id="ordered">
      <legend for>Ordenar por:</legend>
      <select @click="query()" id="orderBy">
        <option value="idBooking">ID reserva</option>
        <option value="idBusiness">ID del negocio</option>
        <option value="businessName">Nombre del Negocio</option>
        <option value="category">Categoría del Negocio</option>
        <option value="idUser">ID del usuario</option>
        <option value="surname">Apellido del usuario</option>
        <option value="check_in_time">Hora de llegada</option>
        <option value="check_in_day">Día de llegada</option>
        <option value="status">Estado de la reserva</option>
        <option value="units">Unidades</option>
        <option value="rating">Puntuación</option>
        <option value="creating_date">Fecha de creación</option>
      </select>
      <legend>Dirección:</legend>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
    </form>
    <!-- <ul>
        <li v-for="booking in bookings" :key="booking.id">
          <p>
            <router-link :to="{name: 'BookingUser', params: { id: booking.id}}">{{booking.id}}</router-link>
          </p>
          <p>{{booking.id_business}}</p>
          <p>
            <router-link
              :to="{name: 'CheckBusiness', params: { id: booking.id_business}}"
            >{{booking.name}}</router-link>
          </p>
          <p>{{booking.category}}</p>
          <p>{{booking.city}}</p>
          <p>{{booking.id_user}}</p>
          <p>
            <router-link
              :to="{name: 'CheckUser', params: { id: booking.id_user}}"
            >{{booking.surname}}</router-link>
          </p>
          <p>{{booking.check_in_day}}</p>
          <p>{{booking.check_in_time}}</p>
          <p>{{booking.check_out_time}}</p>
          <p>{{booking.status}}</p>
          <p>{{booking.units}}</p>
          <p>{{booking.request}}</p>
          <p>{{booking.creating_date}}</p>
          <p>{{booking.update_date}}</p>
          <p>{{booking.rating}}</p>
          <p>{{booking.rating_description}}</p>
        </li>
    </ul>-->
    <table class="table">
      <thead>
        <tr>
          <th>ID reserva</th>
          <th>ID negocio</th>
          <th>Nombre negocio</th>
          <th>Categoría</th>
          <th>Ciudad</th>
          <th>ID usuario</th>
          <th>Apellido Usuario</th>
          <th>Dia check in</th>
          <th>Hora check in</th>
          <th>Hora check out</th>
          <th>Estado reserva</th>
          <th>Unidades</th>
          <th>Fecha creación</th>
          <th>Fecha actualización</th>
          <th>Puntuación</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="booking in showedBookings" :key="booking.id">
          <td data-label="ID reserva">
            <router-link :to="{name: 'BookingUser', params: { id: booking.id}}">{{booking.id}}</router-link>
          </td>
          <td data-label="ID negocio">{{booking.id_business}}</td>
          <td data-label="Nombre negocio">
            <router-link
              :to="{name: 'CheckBusiness', params: { id: booking.id_business}}"
            >{{booking.name}}</router-link>
          </td>
          <td data-label="Categoría">{{booking.category}}</td>
          <td data-label="Ciudad">{{booking.city}}</td>
          <td data-label="ID usuario">
            <router-link
              :to="{name: 'CheckUser', params: { id: booking.id_user}}"
            >{{booking.id_user}}</router-link>
          </td>
          <td data-label="Apellido Usuario">{{booking.surname}}</td>
          <td data-label="Dia check in">{{formatDate(booking.check_in_day)}}</td>
          <td data-label="Hora check in">{{formatDateTime(booking.check_in_time)}}</td>
          <td data-label="Hora check out">{{formatDateTime(booking.check_out_time)}}</td>
          <td
            :class="{red: booking.status === 'PENDIENTE_DE_PAGO' ||booking.status === 'CANCELADO'}"
            data-label="Estado reserva"
          >{{booking.status}}</td>
          <td data-label="Unidades">{{booking.units}}</td>
          <td data-label="Fecha creación">{{formatDateTime(booking.creating_date)}}</td>
          <td data-label="Fecha actualización">{{formatDateTime(booking.update_date)}}</td>
          <td data-label="Puntuación">{{booking.rating}}</td>
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
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "ListBookings",
  data() {
    return {
      bookings: [],
      idBooking: "",
      idBusiness: "",
      name: "",
      category: "",
      idUser: "",
      surname: "",
      checkInDay: "",
      checkInTime: "",
      units: "",
      creatingDate: "",
      status: "",
      category: "",
      isQuery: false,
      currentIndex: 0,
      elementsPerPage: 20,
      currentPage: 0,
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
    async query() {
      try {
        const firstSelect = document.getElementById("orderBy");
        const orderBy = firstSelect.options[firstSelect.selectedIndex].value;
        const secondSelect = document.getElementById("direction");
        const direction =
          secondSelect.options[secondSelect.selectedIndex].value;
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" + getIdToken(token) + "/bookings",
          {
            params: {
              idBooking: this.idBooking,
              idBusiness: this.idBusiness,
              businessName: this.name,
              category: this.category,
              idUser: this.idUser,
              surname: this.surname,
              checkInDay: this.checkInDay,
              checkInTime: this.checkInTime,
              units: this.units,
              status: this.status,
              creatingDate: this.creatingDate,
              order: orderBy,
              direction: direction,
            },
          }
        );
        this.bookings = response.data.data;
        this.isQuery = false;
      } catch (error) {
        console.log(error.response);
      }
    },
    async getListBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" + getIdToken(token) + "/bookings"
        );
        this.bookings = response.data.data;
        this.isQuery = false;
      } catch (error) {
        console.log(error);
      }
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
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
.ListBookings {
  min-height: 100vh;
  height: 100%;
}

#ordered {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 30rem;
  margin: auto;
  justify-content: space-evenly;
}
#ordered > legend {
  color: coral;
  margin: auto;
  margin-right: 0.1rem;
}

fieldset {
  padding: 1rem 3rem;
  margin: 0 auto;
  border-radius: 1rem;
  width: 12rem;
  background-color: rgba(24, 9, 4, 0.8);
  height: 26rem;
  justify-items: center;
}

select {
  position: center;
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
}

input {
  width: 12rem;
  margin-bottom: 0.3rem;
  border-radius: 5px;
  border: 0;
}

label {
  color: white;
}

h4 {
  color: white;
  margin: 0.3rem;
}

.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

li {
  list-style: none;
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
  margin-top: 0.5rem;
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

@media screen and (max-width: 1400px) {
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

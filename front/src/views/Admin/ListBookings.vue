<template>
  <div class="ListBookings">
    <button id="up" @click="goBack()">Volver</button>
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
        <option value="PELUQUERÍA">Peluquería</option>
      </select>
      <label>Provincia</label>
      <select v-model="province" id="provincia">
        <option value="Alava">Álava</option>
        <option value="Albacete">Albacete</option>
        <option value="Alicante">Alicante/Alacant</option>
        <option value="Almeria">Almería</option>
        <option value="Asturias">Asturias</option>
        <option value="Avila">Ávila</option>
        <option value="Badajoz">Badajoz</option>
        <option value="Barcelona">Barcelona</option>
        <option value="Burgos">Burgos</option>
        <option value="Caceres">Cáceres</option>
        <option value="Cadiz">Cádiz</option>
        <option value="Cantabria">Cantabria</option>
        <option value="Castellon">Castellón/Castelló</option>
        <option value="Ceuta">Ceuta</option>
        <option value="Ciudad_real">Ciudad Real</option>
        <option value="Cordoba">Córdoba</option>
        <option value="Cuenca">Cuenca</option>
        <option value="Girona">Girona</option>
        <option value="Granada">Granada</option>
        <option value="Guadalajara">Guadalajara</option>
        <option value="Guipuzcoa">Guipúzcoa</option>
        <option value="Huelva">Huelva</option>
        <option value="Huesca">Huesca</option>
        <option value="Islas_Baleares">Islas Balears</option>
        <option value="Jaen">Jaén</option>
        <option value="La_coruña">La Coruña</option>
        <option value="La_rioja">La Rioja</option>
        <option value="Las_palmas">Las Palmas</option>
        <option value="Leon">León</option>
        <option value="Lleida">Lleida</option>
        <option value="Lugo">Lugo</option>
        <option value="Madrid">Madrid</option>
        <option value="Malaga">Málaga</option>
        <option value="Melilla">Melilla</option>
        <option value="Murcia">Murcia</option>
        <option value="Navarra">Navarra</option>
        <option value="Ourense">Ourense</option>
        <option value="Palencia">Palencia</option>
        <option value="Pontevedra">Pontevedra</option>
        <option value="Salamanca">Salamanca</option>
        <option value="Segovia">Segovia</option>
        <option value="Sevilla">Sevilla</option>
        <option value="Soria">Soria</option>
        <option value="Tarragona">Tarragona</option>
        <option value="Santa_cruz_de_Tenerife">Santa Cruz de Tenerife</option>
        <option value="Teruel">Teruel</option>
        <option value="Toledo">Toledo</option>
        <option value="Valencia">Valencia</option>
        <option value="Valladolid">Valladolid</option>
        <option value="Vizcaya">Vizcaya</option>
        <option value="Zamora">Zamora</option>
        <option value="Zaragoza">Zaragoza</option>
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
    <table class="table">
      <thead>
        <tr>
          <th>ID reserva</th>
          <th>ID negocio</th>
          <th>Nombre negocio</th>
          <th>Categoría</th>
          <th>Provincia</th>
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
            <router-link
              :to="{name: 'BookingUser', params: { id: booking.id}, hash: '#up'}"
            >{{booking.id}}</router-link>
          </td>
          <td data-label="ID negocio">{{booking.id_business}}</td>
          <td data-label="Nombre negocio">
            <router-link
              :to="{name: 'CheckBusiness', params: { id: booking.id_business}, hash: '#up'}"
            >{{booking.name}}</router-link>
          </td>
          <td data-label="Categoría">{{booking.category | lowcase}}</td>
          <td data-label="Provincia">{{booking.province | underscore | underscore | underscore }}</td>
          <td data-label="ID usuario">
            <router-link
              :to="{name: 'CheckUser', params: { id: booking.id_user}, hash: '#up'}"
            >{{booking.id_user}}</router-link>
          </td>
          <td data-label="Apellido Usuario">{{booking.surname}}</td>
          <td data-label="Dia check in">{{formatDate(booking.check_in_day)}}</td>
          <td data-label="Hora check in">{{formatDateTime(booking.check_in_time)}}</td>
          <td data-label="Hora check out">{{formatDateTime(booking.check_out_time)}}</td>
          <td
            :class="{red: booking.status === 'PENDIENTE_DE_PAGO' ||booking.status === 'CANCELADO'}"
            data-label="Estado reserva"
          >{{booking.status | lowcase | underscore}}</td>
          <td data-label="Unidades">{{booking.units}}</td>
          <td data-label="Fecha creación">{{formatDateTime(booking.creating_date)}}</td>
          <td data-label="Fecha actualización">{{formatDateTime(booking.update_date)}}</td>
          <td data-label="Puntuación">{{booking.rating}}</td>
        </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': currentPage -5 <= 0}">
          <button class="page-link" @click="firstPage"><<</button>
        </li>
        <li class="page-item" :class="{'disabled': currentPage === 0}">
          <button class="page-link" @click="previousPage"><</button>
        </li>

        <li v-for="page in pages" :key="page" class="page-item">
          <button class="page-link" @click="goToPage(page)">{{ page + 1 }}</button>
        </li>

        <li class="page-item" :class="{'disabled': currentPage >= numberOfPages}">
          <button class="page-link" @click="nextPage">></button>
        </li>
        <li class="page-item" :class="{'disabled': currentPage >= numberOfPages - 4 }">
          <button class="page-link" @click="lastPage">>></button>
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
      province: "",
      units: "",
      creatingDate: "",
      status: "",
      category: "",
      isQuery: false,
      currentIndex: 0,
      elementsPerPage: 40,
      currentPage: 0,
      numberOfPages: "",
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
              province: this.province,
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
    firstPage() {
      this.currentPage = 0;
      this.currentIndex = this.currentPage * this.elementsPerPage;
    },
    lastPage() {
      let numberOfPages = Math.ceil(
        this.bookings.length / this.elementsPerPage
      );
      this.currentPage = numberOfPages - 1;
      this.currentIndex = this.currentPage * this.elementsPerPage;
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
      this.numberOfPages = numberOfPages - 1;
      let pageArray = [];

      for (let i = this.currentPage - 5; i < this.currentPage + 5; i++) {
        if (i >= 0 && i < numberOfPages) {
          pageArray.push(i);
        }
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
.ListBookings {
  min-height: 100vh;
  height: 100%;
  background: linear-gradient(
      rgba(241, 253, 254, 0.8),
      rgba(241, 253, 254, 0.8)
    ),
    url(../../assets/brick.jpeg);
}

#ordered {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 30rem;
  margin: 1rem auto;
  justify-content: space-evenly;
}
#ordered > legend {
  color: coral;
  margin: auto;
  margin-right: 0.1rem;
  font-weight: bold;
}
#ordered > select {
  background-color: white;
}

fieldset {
  padding: 1rem 3rem;
  margin: 0 auto;
  border-radius: 1rem;
  width: 12rem;
  background-color: rgba(24, 9, 4, 0.8);
  height: auto;
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
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

button {
  display: inline-block;
  padding: 0.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem 0;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 97%;
  margin: auto;
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
a {
  text-decoration: none;
  color: black;
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

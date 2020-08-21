<template>
  <div class="GetUser">
    <button @click="goBack()">Go Back</button>
    <h1>REGISTRO DE RESERVAS</h1>
    <fieldset>
      <legend>Busca tu reserva</legend>
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
      <legend for>Estado de la reserva</legend>
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

      <br />
      <legend for>Ordenar por</legend>
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
      <legend>Ordenadar de forma:</legend>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
      <button @click="query()">Buscar</button>
      <ul>
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
      </ul>
    </fieldset>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "Home",
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
    };
  },

  methods: {
    goBack() {
      window.history.back();
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

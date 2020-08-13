<template>
  <div class="GetBusiness">
    <button @click="goBack()">Go Back</button>
    <h1>MIS RESERVAS PARA HOY</h1>
    <fieldset>
      <legend>Busca tu reserva</legend>
      <input v-model="id" type="text" placeholder="Id de la reserva" />
      <input v-model="name" type="text" placeholder="Nombre del cliente" />
      <input v-model="surname" type="text" placeholder="Apellido del cliente" />
      <label for>Día de llegada</label>
      <input v-model="checkInDay" type="date" />
      <label for>Hora de llegada</label>
      <input step="360" v-model="checkInTime" type="datetime-local" />
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
      <label for>Creación de reserva</label>

      <input v-model="creatingDate" type="date" />

      <input v-model="units" type="text" placeholder="Unidades" />
      <label for>Categoría</label>
      <br />
      <legend for>Ordenar por</legend>
      <select @click="query()" id="orderBy">
        <option value="name">Nombre</option>
        <option value="surname">Apellido</option>
        <option value="check_in_time">Hora de llegada</option>
        <option value="check_in_day">Día de llegada</option>
        <option value="status">Estado de la reserva</option>
        <option value="units">Unidades</option>
        <option value="rating">Valoración</option>
        <option value="creating_date">Creación de reserva</option>
      </select>
      <legend>Ordenadar de forma:</legend>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
      <button @click="query()">Buscar</button>
    </fieldset>
    <getlistbooking :booking="booking" />
  </div>
</template>

<script>
import getlistbooking from "@/components/ListBusinessBookingComp.vue";
import axios from "axios";
import { getIdToken } from "../../../utils";

export default {
  name: "Home",
  components: {
    getlistbooking,
  },
  data() {
    return {
      booking: [],
      id: "",
      name: "",
      surname: "",
      checkInDay: "",
      checkInTime: "",
      status: "",
      creatingDate: "",
      units: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async getListBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        console.log(getIdToken(token));
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking_today/"
        );
        this.booking = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async query() {
      try {
        const firstSelect = document.getElementById("orderBy");
        const orderBy = firstSelect.options[firstSelect.selectedIndex].value;
        const secondSelect = document.getElementById("direction");
        const direction =
          secondSelect.options[secondSelect.selectedIndex].value;
        console.log(orderBy, direction);
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking_advanced",
          {
            params: {
              id: this.id,
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
        this.booking = response.data.data;
        console.log(this.booking);
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

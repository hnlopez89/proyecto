<template>
  <div class="GetUser">
    <button @click="goBack()">Go Back</button>
    <h1>TODAS MIS RESERVAS</h1>
    <fieldset>
      <legend>Busca tu reserva</legend>
      <input v-model="name" type="text" placeholder="Nombre del establecimiento" />
      <input v-model="city" type="text" placeholder="Ciudad" />
      <input v-model="checkInDay" type="date" placeholder="día" />
      <input v-model="creatingDate" type="date" placeholder="Fecha de creación" />
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

      <input type="text" />
      <label for>Categoría</label>
      <select v-model="category">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERIA">Peluquería</option>
        <option>(todas las categorías)</option>
      </select>
      <br />
      <legend for>Ordenar por</legend>
      <select @click="query()" id="orderBy">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERIA">Peluquería</option>
        <option>(todas las categorías)</option>
      </select>
      <legend>Ordenadar de forma:</legend>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
      <button @click="query()">Buscar</button>

      <getlistbooking :booking="booking" />
    </fieldset>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";
import getlistbooking from "@/components/ListUserBookingComp.vue";

export default {
  name: "Home",
  components: {
    getlistbooking,
  },
  data() {
    return {
      booking: [],
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
          "http://localhost:3000/admin/" + getIdToken(token) + "/bookings",
          {
            params: {
              name: this.name,
              category: this.category,
              city: this.city,
              checkInDay: this.checkInDay,
              status: this.status,
              creatingDate: this.creatingDate,
              order: orderBy,
              direction: direction,
            },
          }
        );
        this.booking = response.data.data;
      } catch (error) {
        console.log(error.response);
      }
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
        this.booking = response.data.data;
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

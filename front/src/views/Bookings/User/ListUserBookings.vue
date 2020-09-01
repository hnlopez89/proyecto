<template>
  <div class="ListUserBookings">
    <button @click="goBack()">Go Back</button>
    <h1>TODAS MIS RESERVAS</h1>
    <fieldset>
      <legend>Busca tu reserva</legend>
      <input v-model="name" type="text" placeholder="Nombre del establecimiento" />
      <input v-model="city" type="text" placeholder="Ciudad" />
      <label for>Día de llegada</label>
      <input v-model="checkInDay" type="date" placeholder="día" />
      <label for>Día de creación de reserva</label>

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

      <label for>Categoría</label>
      <select v-model="category">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERIA">Peluquería</option>
      </select>
      <br />
      <button @click="query()">Buscar</button>
    </fieldset>
    <form>
      <legend for>Ordenar por</legend>
      <select @click="query()" id="orderBy">
        <option value="id">ID reserva</option>
        <option value="name">Establecimiento</option>
        <option value="check_in_time">Hora de llegada</option>
        <option value="status">Estado de reserva</option>
        <option value="units">Plazas</option>
        <option value="city">Ciudad</option>
        <option value="category">Categoría establecimiento</option>
      </select>
      <legend>Dirección:</legend>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
    </form>
    <div v-if="booking.length === 0">
      <h3>Aún no tienes reservas</h3>
      <p>Haz click justo debajo para realizar una reserva</p>
      <router-link tag="button" to="/home">Inicio</router-link>
    </div>
    <getlistbooking :booking="booking" />
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../../utils";
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
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking_advanced",
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
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking_advanced"
        );
        this.booking = response.data.data;
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
.ListUserBookings {
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../../assets/tempo.jpg);
}

input {
  border-radius: 5px;
  border: 0;
  margin: 0.5rem auto;
}
fieldset {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 15rem;
  margin: 0 auto;
  background-color: coral;
  border-radius: 1rem;
}

form {
  color: coral;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
}

select {
  border-radius: 1rem;
  border: 0;
  margin: 0.15rem auto;
  width: 10rem;
}

form > label {
  margin: 0.3rem 0;
}

button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid #000000;
  margin: 0.5rem auto;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bolder;
  background-color: rgb(255, 255, 255);
  color: coral;
  text-align: center;
}
</style>
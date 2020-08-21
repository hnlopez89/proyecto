<template>
  <div>
    <div id="query">
      <h1>Bienvenido a Tempo</h1>
      <button v-show="advanced" @click="advanced =! advanced">Buscar por nombre</button>
      <button v-show="!advanced" @click="advanced =! advanced">Busqueda Avanzada</button>
      <form v-show="advanced">
        <label>Categoría:</label>
        <select v-model="category">
          <option value="TERRAZA">Terraza</option>
          <option value="BAR">Bar</option>
          <option value="RESTAURANTE">Restaurante</option>
          <option value="PELUQUERIA">Peluquería</option>
          <option>(todas las categorías)</option>
        </select>
        <label>Ciudad:</label>
        <input v-model="city" type="text" placeholder="Ciudad Escogida" />
        <label>Fecha:</label>
        <input v-model="date" type="date" placeholder="Datetime" />
        <label for>Hora</label>
        <select v-model="hours" id="units">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
        </select>
        <label for>Minutos</label>
        <select v-model="minutes" id="units">
          <option value="0">:00</option>
          <option value="30">:30</option>
        </select>
        <label for>Plazas</label>
        <select v-model="units" id="units">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </form>
      <form v-show="!advanced">
        <legend>Nombre:</legend>
        <input v-model="name" type="text" placeholder="Nombre del Establecimiento" />
      </form>
      <button @click="query()">Buscar</button>
    </div>
    <p>
      <label>Ordenar por:</label>
      <select @click="query()" id="orderBy">
        <option value="voteAverage">Puntuación</option>
        <option value="totalVotes">Número de votos</option>
        <option value="name">Nombre del establecimiento</option>
      </select>
      <label>Sentido:</label>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
    </p>
    <businesses v-on:data="booking" :businesses="business" :date="date" />
  </div>
</template>

<script>
import { getIdToken } from "../utils";

import businesses from "@/components/ListBusinessComp.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    businesses,
  },
  data() {
    return {
      business: [],
      profile_picture: "",
      name: "",
      city: "",
      category: "",
      hours: "",
      minutes: "",
      units: "",
      date: "",
      advanced: true,
      order: false,
    };
  },
  methods: {
    async booking(bookingData) {
      try {
        console.log(this.date, bookingData.creditCardNumber);
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.post(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/business/" +
            bookingData.idBusiness +
            "/booking/",
          {
            date: this.date,
            hours: this.hours,
            minutes: this.minutes,
            units: this.units,
            minutes: this.minutes,
            creditCardNumber: bookingData.creditCardNumber,
            holderName: bookingData.holderName,
            expiryMonth: bookingData.expiryMonth,
            expiryYear: bookingData.expiryYear,
            cvcCode: bookingData.cvcCode,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response);
      }
    },
    toggleQuery() {
      this.name = true;
    },
    async query() {
      try {
        const firstSelect = document.getElementById("orderBy");
        const orderBy = firstSelect.options[firstSelect.selectedIndex].value;
        const secondSelect = document.getElementById("direction");
        const direction =
          secondSelect.options[secondSelect.selectedIndex].value;
        console.log(orderBy, direction);
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            name: this.name,
            category: this.category,
            city: this.city,
            date: this.date,
            units: this.units,
            hours: this.hours,
            minutes: this.minutes,
            order: orderBy,
            direction: direction,
          },
        });
        this.business = response.data.data;
        this.order = true;
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
  async direction() {
    try {
      const firstSelect = document.getElementById("orderBy");
      const order = orderBy.options[orderBy.selectedIndex].value;
    } catch (error) {
      console.log(error.response.data);
    }
  },
  async passData() {
    let params = this.units;
    console.log(params);
    this.$emit("data", params);
  },
  async getBusiness() {
    const idBusiness = this.businesses[index].id;
    console.log(idBusiness);
    try {
      const response = await axios.get(
        "http://localhost:3000/business/" + idBusiness
      );
      console.log(response);
    } catch (error) {
      console.log(error.response.data);
    }
  },
  getProfilePicture(picture) {
    if (picture !== null) {
      return process.env.VUE_APP_STATIC + picture;
    }
  },
};
</script>

<style scoped>
#query {
  background-image: url(../assets/portada.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
h1 {
  padding: 0.5rem;
  color: white;
  text-align: center;
}
form {
  padding: 2rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 15rem;
}
form > label {
  color: white;
}
form > p {
  color: white;
}
</style>
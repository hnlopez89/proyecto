<template>
  <div class="ListUserBookings">
    <button id="up" @click="goBack()">Volver</button>
    <h1>TODAS MIS RESERVAS</h1>
    <fieldset>
      <legend>Busca tu reserva</legend>
      <input v-model="id" type="text" placeholder="ID de la reserva" />
      <input v-model="name" type="text" placeholder="Nombre del establecimiento" />
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
        <option value="PELUQUERÍA">Peluquería</option>
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
        <option value="province">Provincia</option>
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
      province: "",
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
              province: this.province,
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
      rgba(241, 253, 254, 0.8),
      rgba(241, 253, 254, 0.8)
    ),
    url(../../../assets/brick.jpeg);
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
  background-color: rgb(110, 56, 36);
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
  padding: 0.5rem;
  border: 0.1rem solid coral;
  border-radius: 0;
  box-sizing: border-box;
  font-weight: bolder;
  background-color: black;
  color: coral;
  text-align: center;
  position: relative;
  margin: 1rem auto;
}

fieldset > button {
  margin: 0 auto;
}

fieldset > button:hover {
  background-color: black;
}

select {
  background-color: white;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}
</style>
<template>
  <div class="ListUserBookingsConfirmed">
    <button id="up" @click="goBack()">Volver</button>
    <h1>MIS RESERVAS CONFIRMADAS</h1>
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
          "http://localhost:3000/user/" + getIdToken(token) + "/booking/"
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
.ListUserBookingsConfirmed {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
      rgba(241, 253, 254, 0.8),
      rgba(241, 253, 254, 0.5)
    ),
    url(../../../assets/brick.jpeg);
}
button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem 0 2rem;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}
</style>
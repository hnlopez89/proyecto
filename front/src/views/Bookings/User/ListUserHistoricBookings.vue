<template>
  <div class="ListUserHistoricBookings">
    <button @click="goBack()">Go Back</button>
    <h1>MIS RESERVAS PASADAS</h1>
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
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking/previous"
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
.ListUserHistoricBookings {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../../assets/tempo.jpg);
  min-height: 100vh;
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
</style>
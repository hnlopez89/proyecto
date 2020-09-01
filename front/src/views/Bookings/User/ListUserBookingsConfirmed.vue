<template>
  <div class="ListUserBookingsConfirmed">
    <button @click="goBack()">Go Back</button>
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
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../../assets/tempo.jpg);
}
</style>
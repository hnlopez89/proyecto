<template>
  <div class="GetBusiness">
    <button @click="goBack()">Go Back</button>
    <h1>MIS RESERVAS DE MAÑANA</h1>
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
            "/booking_tomorrow/"
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

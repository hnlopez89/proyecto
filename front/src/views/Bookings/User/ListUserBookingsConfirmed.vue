<template>
  <div class="GetUser">
    <button @click="goBack()">Go Back</button>
    <h1>MIS RESERVAS CONFIRMADAS</h1>
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

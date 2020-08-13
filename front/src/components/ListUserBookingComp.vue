<template>
  <div>
    <ul>
      <li v-for="data in booking" :key="data.id">
        <h3>
          <router-link :to="{name: 'BusinessProfile', params: {id: data.id_business}}">{{data.name}}</router-link>
        </h3>
        <p>
          <b>Categoría del establecimiento:</b>
          {{data.category}}
        </p>
        <p>
          <b>Ciudad del Establecimiento:</b>
          {{data.city}}
        </p>
        <p>
          <b>Estado de la reserva:</b>
          {{data.status}}
        </p>
        <p>
          <b>Número de reserva:</b>
          {{data.id}}
        </p>
        <p>
          <b>Hora de check-in:</b>
          {{data.check_in_time}} //
          <b>Hora de check-out:{{data.check_out_time}}</b>
        </p>
        <router-link :to="{ name: 'BookingUser', params: {id: data.id}}" tag="button">Ver tú reserva</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../utils";

export default {
  name: "GetUserBooking",
  props: {
    booking: Array,
  },
  methods: {
    async getUserBooking() {
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      const response = await axios.get(
        "http://localhost:3000/user/" + getIdToken(token) + "/booking/"
      );
    },
  },
};
</script>

<style scoped>
</style>
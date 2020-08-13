<template>
  <div>
    <ul>
      <li v-for="data in booking" :key="data.id">
        <p>
          <b>Número de reserva:</b>
          {{data.id}}
        </p>
        <p>
          <b>Nombre del cliente:</b>
          {{data.name}}
        </p>
        <p>
          <b>Apellido del cliente:</b>
          {{data.surname}}
        </p>
        <p>
          <b>Estado de la reserva:</b>
          {{data.status}}
        </p>
        <p>
          <b>Número de unidades:</b>
          {{data.units}}
        </p>
        <p>
          <b>Hora de check-in:</b>
          {{data.check_in_time}} //
          <b>Hora de check-out:</b>
          {{data.check_out_time}}
        </p>
        <router-link
          :to="{ name: 'BookingBusiness', params: {id: data.id}}"
          tag="button"
        >Ver tú reserva</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../utils";

export default {
  name: "GetBusinessBooking",
  props: {
    booking: Array,
  },
  methods: {
    async getUserBooking() {
      const response = await axios.get(
        "http://localhost:3000/business/" +
          this.$route.params.id +
          "/booking_today/"
      );
    },
  },
};
</script>

<style scoped>
</style>
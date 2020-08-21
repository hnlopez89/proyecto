<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <div>
      <ul id="bookingData">
        <h2>Datos de la reserva</h2>
        <ul>
          <li>
            <b>Puntuación:</b>
            <star-rating
              read-only
              :rating="Number(booking.rating)"
              :increment="0.5"
              :fixed-point="1.8"
              :star-size="20"
              :inline="true"
              :show-rating="true"
            ></star-rating>
          </li>
          <li>
            <b>Opinión:</b>
            {{booking.ratingDescription}}
          </li>
        </ul>
        <li>
          <b>Estado de la reserva:</b>
          {{booking.status}}
        </li>
        <li>
          <b>Numero de reserva:</b>
          {{booking.id}}
        </li>
        <li>
          <b>Unidades:</b>
          {{booking.units}}
        </li>
        <li>
          <b>Petición Especial:</b>
          {{booking.request}}
        </li>
        <li>
          <b>Día de la cita:</b>
          {{booking.check_in_day}}
        </li>
        <li>
          <b>Hora de inicio:</b>
          {{booking.check_in_time}}
        </li>
        <li>
          <b>Hora de fin:</b>
          {{booking.check_out_time}}
        </li>
        <li>
          <b>Duración de la cita:</b>
          {{booking.frequenzy_time}}
        </li>
      </ul>
      <ul id="customerData">
        <h2>Datos del cliente</h2>
        <li>
          <b>Nombre:</b>
          {{booking.name}}
        </li>
        <li>
          <b>Apellidos:</b>
          {{booking.surname}}
        </li>
        <li>
          <b>Dirección de email:</b>
          {{booking.email}}
        </li>
        <li>
          <b>Fecha de nacimiento:</b>
          {{booking.birthday}}
        </li>
        <li>
          <b>Edad:</b>
          {{booking.age}}
        </li>
        <li>
          <b>Ciudad de tu cliente:</b>
          {{booking.city}}
        </li>
      </ul>
    </div>
    <ul>
      <li>
        <button v-show="confirmed" @click="checkIn()">Check-In</button>
      </li>
      <li>
        <button v-show="checkedIn" @click="checkOut()">Check-Out</button>
      </li>
      <li>
        <button v-show="confirmed" @click="noShow()">No-Show</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../../utils";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      booking: [],
      confirmed: false,
      checkedIn: false,
    };
  },

  methods: {
    async getBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id
        );
        if (
          response.data.data[0].status === "CONFIRMADO" ||
          response.data.data[0].status === "MODIFICADO" ||
          response.data.data[0].status === "PENDIENTE_DE_PAGO"
        ) {
          this.confirmed = true;
        }
        if (response.data.data[0].status === "CHECK_IN") {
          this.confirmed = true;
        }
        this.booking = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    async checkIn() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/checkin"
        );
        this.booking = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    async checkOut() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/checkout"
        );
        this.booking = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    async noShow() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/no-show"
        );
        this.booking = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    goBack() {
      window.history.back();
    },
  },

  created() {
    this.getBooking();
  },
};
</script>

<style>
</style>
<template>
  <div class="Welcome">
    <button @click="goBack()">Go Back</button>

    <h1>Comprueba tu disponibilidad</h1>
    <input v-model="checkInDay" type="date" />
    <button @click="getAvailability()">Ver tú disponibilidad</button>
    <ul>
      <li v-for="slot in availability" :key="slot.id">
        <p>
          <b>Día:</b>
          {{slot.check_in_day}}
        </p>
        <p>
          <b>Hora:</b>
          {{slot.check_in_time}}
        </p>
        <p>
          <b>Reservas:</b>
          {{slot.bookings}}
        </p>
        <p>
          <b>Capacidad:</b>
          {{slot.allotment}}
        </p>
        <p>
          <b>% Ocupación:</b>
          {{slot.occ}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      availability: [],
      checkInDay: "",
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },

    async getAvailability() {
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" +
            getIdToken(token) +
            "/availability",
          {
            params: {
              checkInDay: this.checkInDay,
            },
          }
        );
        this.availability = response.data.data;
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getAvailability();
  },
};
</script>

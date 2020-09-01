<template>
  <div>
    <ul>
      <li v-for="data in booking" :key="data.id">
        <h3>
          <router-link :to="{name: 'BusinessProfile', params: {id: data.id_business}}">{{data.name}}</router-link>
        </h3>
        <p>
          <b>ID reserva:</b>
          {{data.id}}
        </p>
        <p>
          <b>Estado de la reserva:</b>
          <span
            :class="{red: data.status === 'PENDIENTE_DE_PAGO' ||data.status === 'CANCELADO' || data.status === 'NO_SHOW' ,
            green: data.status === 'CONFIRMADO' || data.status === 'MODIFICADO', 
            yellow: data.status === 'CHECK_IN' || data.status === 'CHECK_OUT'}"
          >{{data.status}}</span>
        </p>
        <p>
          <b>Población:</b>
          {{data.city}}
        </p>
        <p>
          <b>Categoría:</b>
          {{data.category}}
        </p>
        <p>
          <b>Día de check-in:</b>
          {{formatDate(data.check_in_day)}}
        </p>
        <p>
          <b>Hora de llegada:</b>
          {{formatDateTime(data.check_in_time)}}
        </p>
        <p>
          <b>Hora de llegada:</b>
          {{formatDateTime(data.check_out_time)}}
        </p>
        <p>
          <b>Plazas reservadas:</b>
          {{data.units}}
        </p>
        <router-link :to="{ name: 'BookingUser', params: {id: data.id}}" tag="button">Ver tu reserva</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import { getIdToken } from "../utils";

export default {
  name: "GetUserBooking",
  props: {
    booking: Array,
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatDateTime(datetime) {
      return format(new Date(datetime), "HH:mm");
    },
  },
};
</script>

<style scoped>
h3 {
  margin-top: 0.2rem;
  text-align: center;
}

.red {
  color: red;
  font-weight: bold;
}

.green {
  color: green;
  font-weight: bold;
}

.yellow {
  color: yellow;
  font-weight: bold;
}

ul {
  padding: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
}
li {
  text-align: left;
  list-style: none;
  border-radius: 1rem;
  border: 0.1rem solid coral;
  margin: 1rem 0;
  padding: 1rem;
  width: 22rem;
}
a {
  color: white;
  text-decoration: none;
}

button {
  padding: 0.3rem 1rem;
  border: 0.1rem solid #000000;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bolder;
  background-color: coral;
  color: white;
  text-align: center;
  position: relative;
  left: 30%;
  margin: auto;
}

@media (min-width: 1000px) {
  ul {
    width: 50rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }
}
</style>
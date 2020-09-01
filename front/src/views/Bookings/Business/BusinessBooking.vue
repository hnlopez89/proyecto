<template>
  <div id="businessBooking">
    <button @click="goBack()">Go Back</button>
    <div id="mask">
      <ul id="bookingData">
        <h2>Datos de la reserva</h2>
        <li>
          <b>Estado de la reserva:</b>
          <span
            :class="{red: booking.status === 'PENDIENTE_DE_PAGO' ||booking.status === 'CANCELADO' || booking.status === 'NO_SHOW' ,
            green: booking.status === 'CONFIRMADO' || booking.status === 'MODIFICADO', 
            yellow: booking.status === 'CHECK_IN' || booking.status === 'CHECK_OUT'}"
          >{{booking.status}}</span>
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
          <b>Día de la cita:</b>
          {{formatDate(booking.check_in_day)}}
        </li>
        <li>
          <b>Hora de inicio:</b>
          {{formatTime(booking.check_in_time)}}
        </li>
        <li>
          <b>Hora de fin:</b>
          {{formatTime(booking.check_out_time)}}
        </li>
        <li>
          <b>Duración de la cita:</b>
          {{booking.frequenzy_time}}
        </li>
        <li>
          <b>Fecha creación de reserva:</b>
          {{formatDateTime(booking.creating_date)}}
        </li>
        <li>
          <b>Fecha actualización de reserva:</b>
          {{formatDateTime(booking.update_date)}}
        </li>
        <li>
          <b>Petición Especial:</b>
          {{booking.request}}
        </li>
        <ul id="ratingBox">
          <h3>Puntuación:</h3>
          <li>
            <star-rating
              read-only
              :rating="Number(booking.rating)"
              :increment="0.5"
              :fixed-point="1.8"
              :star-size="28"
              :inline="true"
              :show-rating="false"
            ></star-rating>
          </li>
          <li id="opinion">
            <b>Opinión:</b>
            {{booking.ratingDescription}}
          </li>
        </ul>
      </ul>
      <div id="second">
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
            <b>Teléfono:</b>
            {{booking.telephone}}
          </li>
          <li>
            <b>Fecha de nacimiento:</b>
            {{formatDate(booking.birthday)}}
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
        <ul id="action">
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../../utils";
import { format } from "date-fns";

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
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatTime(datetime) {
      return format(new Date(datetime), "HH:mm");
    },
    formatDateTime(datetime) {
      return format(new Date(datetime), "dd/MM/yyyy HH:mm");
    },
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
          this.checkedIn = true;
        }

        this.booking = response.data.data[0];
        console.log(this.booking);
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

<style scoped>
h2 {
  margin-top: 0;
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

#businessBooking {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../../assets/tempo.jpg);
  width: 100%;
  min-height: 100vh;
  padding-top: 2rem;
  background-color: coral;
  display: flex;
  flex-direction: column;
  align-items: center;
}

ul {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  border: solid black 0.1rem;
  margin: 2rem;
}

li {
  list-style: none;
  margin: 0.3rem;
  text-align: left;
}

#action {
  background-color: inherit;
  padding: inherit;
  border-radius: inherit;
  border: inherit;
}

#ratingBox {
  border: coral;
  background-color: black;
  color: coral;
  padding: inherit;
  border-radius: 1rem;
  margin: 2rem 0 0 0;
}

#ratingBox > h3 {
  margin: 0 0 1rem 0;
}
#ratingBox > li {
  text-align: center;
  margin-top: 0.5rem;
}
#opinion {
  text-align: left;
  color: white;
}
button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin-bottom: 0.5rem;
}

#action {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
@media (min-width: 1000px) {
  #mask {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  #bookingData {
    margin: 2rem;
  }
  #second {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
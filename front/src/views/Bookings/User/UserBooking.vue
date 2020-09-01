<template>
  <div id="ÜserBooking">
    <button @click="goBack()">Go Back</button>
    <div class="page">
      <h1>Tu reserva en {{booking.name}}</h1>
      <ul class="booking">
        <h3>Numero de reserva: {{booking.id}}</h3>
        <li>
          <b>Estado:</b>
          <span
            :class="{red: booking.status === 'PENDIENTE_DE_PAGO' ||booking.status === 'CANCELADO' || booking.status === 'NO_SHOW' ,
            green: booking.status === 'CONFIRMADO' || booking.status === 'MODIFICADO', 
            yellow: booking.status === 'CHECK_IN' || booking.status === 'CHECK_OUT'}"
          >{{booking.status}}</span>
        </li>
        <li>
          <b>Unidades:</b>
          {{booking.id}}
        </li>
      </ul>
      <img
        v-if="booking.category === 'TERRAZA'"
        :class="{hide: booking.profile_picture !== null}"
        src="../../../assets/TERRAZA.jpg"
        height="200"
      />
      <img
        v-else-if="booking.category === 'BAR'"
        :class="{hide: booking.profile_picture !== null}"
        src="../../../assets/BAR.jpg"
        height="200"
      />
      <img
        v-else-if="booking.category === 'RESTAURANTE'"
        :class="{hide: booking.profile_picture !== null}"
        src="../../../assets/RESTAURANTE.jpg"
        height="200"
      />
      <img
        v-else-if="booking.category === 'PELUQUERÍA'"
        :class="{hide: booking.profile_picture !== null}"
        src="../../../assets/PELUQUERIA.jpg"
        height="200"
      />

      <img
        :class="{hide: booking.profile_picture === null }"
        :src="getProfilePicture(booking.profile_picture)"
        height="200"
      />
      <ul id="business">
        <h3>El establecimiento:</h3>
        <li>
          Categoría del establecimiento
          <b>{{booking.name}}</b>
          :{{booking.category}}
        </li>
        <li>
          <b>Horario:</b>
          de {{booking.opening_time}} a {{booking.closing_time}}
        </li>
      </ul>
      <ul id="date">
        <h3>¡Acuerdate!</h3>
        <li>
          Tu cita es el
          <b>día {{formatDate(booking.check_in_day)}}</b>
        </li>
        <li>
          Tú cita comienza a las
          <b>{{formatDateTime(booking.check_in_time)}}</b> y acaba a las
          <b>{{formatDateTime(booking.check_out_time)}}</b>
        </li>
      </ul>
      <ul id="direction">
        <h3>Ubicación:</h3>
        <li>
          <b>Dirección:</b>
          {{booking.line1}} {{booking.line2}}, {{booking.zip_code}}
        </li>
        <li>{{booking.city}}, {{booking.province}}</li>
      </ul>
      <ul id="contact">
        <h3>Datos de contacto:</h3>
        <li>Dirección de email: {{booking.email}}</li>
        <li>Número de telefóno: {{booking.telephone}}</li>
      </ul>
      <p v-if="booking.request > 0">
        <b>Tu petición especial:</b>
        {{booking.request}}
      </p>
      <h4>Gracias por reservar con Tempo</h4>
    </div>
    <div id="actions">
      <button v-show="confirmed" @click="cancelBooking()">Cancela tu reserva</button>
      <button v-show="newTC" @click="editTC = !editTC">Cambia tu tarjeta de crédito</button>
      <button v-show="confirmed" @click="edit = !edit">Cambia la fecha de tu reserva</button>
      <button v-show="checkOut" @click="voting =! voting">Valora tu reserva!</button>
    </div>
    <form v-show="editTC" id="newTC">
      <input v-model="creditCardNumber" type="text" placeholder="Inserta tu tarjeta de crédito" />
      <input v-model="holderName" type="text" placeholder="Inserta el titular de la tarjeta" />
      <select v-model="expiryMonth">
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
        <option value="07">07</option>
        <option value="08">08</option>
        <option value="09">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
      <select v-model="expiryYear">
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
        <option value="2029">2029</option>
        <option value="2030">2030</option>
      </select>
      <input v-model="cvcCode" type="text" placeholder="Inserta tu CVV" />
      <button @click="editCreditCard()">Confirma el cambio de tarjeta</button>
    </form>
    <form v-show="edit" id="NewDate">
      <form id="editDate">
        <label for>Día</label>
        <input v-model="date" type="date" />
        <label for>Hora</label>
        <select v-model="hours">
          <option value="00">00</option>
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          <option value="04">04</option>
          <option value="05">05</option>
          <option value="06">06</option>
          <option value="07">07</option>
          <option value="08">08</option>
          <option value="09">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
        </select>
        <label for>Minutos</label>
        <select v-model="minutes">
          <option value="0">:00</option>
          <option value="30">:30</option>
        </select>
        <label for>Plazas</label>
        <select v-model="units" id="units">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
        <button @click="query()">Comprobar disponibilidad</button>
      </form>
      <button v-if="isAvailable" @click="book()">Confirmar cambio de fechas</button>
    </form>
    <form v-show="voting">
      <star-rating
        v-model="rating"
        :increment="0.5"
        :fixed-point="1.8"
        :star-size="80"
        :inline="true"
        :show-rating="true"
      ></star-rating>
      <textarea
        v-model="ratingDescription"
        placeholder="Valora cómo ha ido tu reserva"
        rows="4"
        cols="40"
      ></textarea>
      <button @click="vote()">Envía tu puntuación</button>
    </form>
    <fieldset v-show="adminWay">
      <legend>Cambiar el estado de la reserva</legend>
      <label>Estado de la reserva</label>
      <select v-model="status">
        <option value="CONFIRMADO">Confirmado</option>
        <option value="CANCELADO">Cancelado</option>
        <option value="CHECK_IN">Check_in</option>
        <option value="CHECK_OUT">Check out</option>
        <option value="NO_SHOW">No Show</option>
        <option value="PENDIENTE_DE_PAGO">Pendiente de pago</option>
        <option value="MODIFICADO">Modificado</option>
      </select>
      <button @click="editStatus()">Confirmar cambio de Estado de la reserva</button>
    </fieldset>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken, checkIsAdminUser } from "../../../utils";
import { format } from "date-fns";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      booking: [],
      confirmed: false,
      newTC: false,
      checkOut: false,
      edit: false,
      voting: false,
      editTC: false,
      adminWay: false,
      isAvailable: false,
      date: "",
      time: "",
      hours: "",
      minutes: "",
      units: "",
      creditCardNumber: "",
      holderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvcCode: "",
      rating: "",
      ratingDescription: "",
      status: "",
    };
  },

  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatDateTime(datetime) {
      return format(new Date(datetime), "HH:mm");
    },
    async getBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id
        );
        if (response.data.data[0].status === "CHECK_OUT") {
          this.checkOut = true;
        }
        if (response.data.data[0].status === "PENDIENTE_DE_PAGO") {
          this.newTC = true;
        }
        if (
          response.data.data[0].status === "CONFIRMADO" ||
          response.data.data[0].status === "MODIFICADO" ||
          response.data.data[0].status === "PENDIENTE_DE_PAGO"
        ) {
          this.confirmed = true;
        }
        this.booking = response.data.data[0];
        console.log(this.booking);
      } catch (error) {
        console.log(error);
      }
    },
    adminWayFunction() {
      this.adminWay = checkIsAdminUser();
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    async cancelBooking() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/cancelate"
        );
        location.reload;
      } catch (error) {
        console.log(error);
      }
    },
    async vote() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/value",
          {
            rating: this.rating,
            ratingDescription: this.ratingDescription,
          }
        );
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async editCreditCard() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/credit_card",
          {
            creditCardNumber: this.creditCardNumber,
            holderName: this.holderName,
            expiryMonth: this.expiryMonth,
            expiryYear: this.expiryYear,
            cvcCode: this.cvcCode,
          }
        );
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async editStatus() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/admin/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id +
            "/status",
          {
            status: this.status,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    async query() {
      try {
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            id: this.$route.params.id,
            date: this.date,
            hours: this.hours,
            minutes: this.minutes,
            units: this.units,
          },
        });
        if (response.data.data.length > 0) {
          this.isAvailable = true;
        } else {
          this.isAvailable = false;
        }
      } catch (error) {}
    },
    async book() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        await axios.put(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/booking/" +
            this.$route.params.id,
          {
            date: this.date,
            hours: this.hours,
            minutes: this.minutes,
            units: this.units,
          }
        );
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.getBooking();
    this.adminWayFunction();
  },
};
</script>

<style scoped>
#UserBooking {
  min-height: 100%;
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

li {
  list-style: none;
  margin: 0.3rem;
}
h3,
h4,
b {
  color: coral;
}

h3,
h4 {
  text-decoration: underline;
  margin: 1rem;
}

ul {
  border: 0.05rem solid black;
  border-radius: 1rem;
  margin: 1rem;
  padding: 0.25rem;
  background-color: lightgray;
}
img {
  width: 15rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 3rem;
}
.hide {
  display: none;
}

fieldset {
  margin: 2rem;
}

#actions {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin: 0.5rem;
}

select {
  margin: 1rem;
  border-radius: 5px;
  border: 0;
}

#newTC {
  border-radius: 1rem;
  border: 0.01rem solid coral;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#newTC > select {
  margin: 0.3rem;
  width: 10rem;
}

#newTC > input {
  margin: 0.3rem;
  border-radius: 5px;
  border: 0;
}

form#editDate {
  border-radius: 1rem;
  border: 0.01rem solid coral;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 1000px) {
  .page {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    width: auto;
  }

  #newTC {
    flex-direction: row;
    justify-content: space-evenly;
  }

  form#editDate {
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }

  ul {
    border: solid 0.05rem coral;
    border-radius: 1rem;
    margin: 2rem;
    padding: 0.25rem;
    text-align: left;
    background-color: ivory;
  }

  #actions {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
}
</style>
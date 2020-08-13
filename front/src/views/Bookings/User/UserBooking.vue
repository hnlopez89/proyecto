<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <div>
      <h2>RESERVA EN: {{booking.name}}</h2>
      <p>{{booking.profile_picture}}</p>
      <ul id="booking">
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
          {{booking.id}}
        </li>
      </ul>
      <ul>
        <li>
          <b>Tu petición especial:</b>
          {{booking.request}}
        </li>
        <br />
        <h4>¡Acuerdate!</h4>
        <li>
          Tu cita es el
          <b>día {{booking.check_in_day}}</b>
        </li>
        <li>
          Tú cita comienza a la
          <b>hora {{booking.check_in_time}}</b> y acaba a las
          <b>{{booking.check_out_time}}</b>
        </li>
        <li></li>
      </ul>
      <ul>
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
      <ul id="direction">
        <b>Dirección:</b>
        <li>{{booking.line1}}</li>
        <li>{{booking.line2}}</li>
        <li>{{booking.city}}</li>
        <li>{{booking.province}}</li>
        <li>{{booking.zip_code}}</li>
      </ul>
      <ul>
        <b>Datos de contacto:</b>
        <li>Dirección de email: {{booking.email}}</li>
        <li>Número de telefóno: {{booking.telephone}}</li>
      </ul>
      <h4>Gracias por reservar con Tempo</h4>
    </div>
    <button v-show="confirmed" @click="editBooking()">Modifica tu reserva</button>
    <button v-show="confirmed" @click="cancelBooking()">Cancela tu reserva</button>
    <button v-show="checkOut" @click="toggleVote()">Valora tu reserva!</button>
    <button v-show="newTC" @click="toggleTC()">Cambia tu tarjeta de crédito</button>
    <form v-show="edit">
      <label for>Día</label>
      <input v-model="date" type="date" />
      <label for>Hora</label>
      <select v-model="time">
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
      <input v-model="units" type="text" placeholder="Indica las unidades" />
    </form>
    <form v-show="editTC">
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
      <button @click="editCreditCard()">Cambia tu tarjeta de crédito</button>
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
      newTC: false,
      checkOut: false,
      edit: false,
      voting: false,
      editTC: false,
      date: "",
      time: "",
      units: "",
      creditCardNumber: "",
      holderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvcCode: "",
      rating: "",
      ratingDescription: "",
    };
  },

  methods: {
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
      } catch (error) {
        console.log(error);
      }
    },
    toggleVote() {
      this.voting = true;
    },
    toggleTC() {
      this.editTC = true;
    },
    editBooking() {
      this.edit = true;
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
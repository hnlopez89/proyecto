<template>
  <div>
    <ul>
      <!-- ESCOGEMOS VALORES DEL ARRAY DEL COMPONENTE -->
      <li v-for="(business, index) in businesses" :key="business.id">
        <h1>
          <router-link :to="{name: 'BusinessProfile', params: { id: business.id}}">{{business.name}}</router-link>
        </h1>
        <p id="category">{{business.category}}, {{business.id}}</p>
        <p>{{business.city}}</p>
        <p>Abre de {{business.opening_time}}:00 a {{business.closing_time}}:00</p>
        <p>
          Puntuación:
          <star-rating
            :rating="Number(business.vote_average)"
            read-only
            :increment="0.5"
            :fixed-point="1.8"
            :star-size="20"
            :inline="true"
            :show-rating="false"
          ></star-rating>
          {{business.total_votes}} Opiniones
        </p>

        <button @click="toggleBooking">Hacer reserva</button>

        <div id="rating" v-show="showBooking" class="modal">
          <div class="modalBox">
            aqui formulario de reserva para la fecha
            <form>
              <input v-model="creditCardNumber" placeholder="Introduce el número de la tarjeta" />
              <input v-model="holderName" placeholder="Introduce el Titular de la tarjeta" />
              <select v-model="expiryMonth">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
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
                <option value="2031">2031</option>
                <option value="2032">2032</option>
              </select>
              <input v-model="cvcCode" placeholder="Introduce el código secreto" />
              <button @click="passData(index)">Que pasara</button>
            </form>
            <button @click="showBooking = !showBooking">Cancelar reserva</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ListBusinessComp",
  data() {
    return {
      cvcCode: "",
      expiryMonth: "",
      expiryYear: "",
      holderName: "",
      showBooking: "",
      creditCardNumber: "",
    };
  },
  props: {
    businesses: Array,
  },
  methods: {
    async passData(index) {
      let bookingData = {
        idBusiness: this.businesses[index].id,
        cvcCode: this.cvcCode,
        expiryMonth: this.expiryMonth,
        expiryYear: this.expiryYear,
        holderName: this.holderName,
        creditCardNumber: this.creditCardNumber,
      };
      this.$emit("data", bookingData);
    },
    toggleBooking() {
      this.showBooking = !this.showBooking;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
div.modal button {
  border-radius: 20px;
  margin: 0.5rem;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
}
.modalBox {
  background: #fefefe;
  margin: 2% auto;
  padding: 1rem;
  width: 80%;
  border: 1px solid #888;
  background: rgb(0, 0, 0.5);
}

button {
  padding: 0.25rem;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
}
</style>
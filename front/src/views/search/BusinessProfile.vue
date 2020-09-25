<template>
  <div v-if="isDetails" id="profile">
    <button id="up" @click="goBack()">Volver</button>
    <div>
      <h1>{{details.name}}</h1>
      <ul class="rating">
        <li>
          <star-rating
            read-only
            :rating="Number(details.vote_average)"
            :increment="0.5"
            :fixed-point="1.8"
            :star-size="20"
            :inline="true"
            :show-rating="false"
          ></star-rating>
        </li>
        <li>
          <b>Votos totales:</b>
          {{details.count}}
        </li>
        <li>
          <router-link
            :to="{ name: 'BookingReviews', params: {id: details.id}, hash: '#up'}"
          >Ver puntuaciones</router-link>
        </li>
      </ul>
    </div>
    <hooper
      :progress="true"
      :autoPlay="true"
      :playSpeed="2000"
      :infiniteScroll="true"
      :wheelControl="false"
    >
      <slide>
        <img
          v-if="details.category === 'TERRAZA' && !details.profile_picture"
          src="../../assets/TERRAZA.jpg"
          height="100%"
        />
        <img
          v-else-if="details.category === 'BAR' && !details.profile_picture"
          src="../../assets/BAR.jpg"
          height="100%"
        />
        <img
          v-else-if="details.category === 'RESTAURANTE' && !details.profile_picture"
          src="../../assets/RESTAURANTE.jpg"
          height="100%"
        />
        <img
          v-else-if="details.category === 'PELUQUERÍA' && !details.profile_picture&& !details.profile_picture"
          src="../../assets/PELUQUERIA.jpg"
          height="100%"
        />
        <img v-if="isPicture" :src="setImage(details.profile_picture)" alt="Foto de perfil" />
      </slide>
      <slide>
        <img
          height="100%"
          v-if="details.category === 'TERRAZA' && !pictures[0]"
          src="../../assets/TERRAZA.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'BAR'  && !pictures[0]"
          src="../../assets/BAR.jpg"
        />
        <img
          v-else-if="details.category === 'RESTAURANTE'  && !pictures[0]"
          src="../../assets/RESTAURANTE.jpg"
          height="100%"
        />
        <img
          v-else-if="details.category === 'PELUQUERÍA'  && !pictures[0]"
          src="../../assets/PELUQUERIA.jpg"
          height="100%"
        />
        <img v-else :src="setImage(pictures[0])" alt="Foto de perfil" />
      </slide>
      <slide>
        <img
          height="100%"
          v-if="details.category === 'TERRAZA' && !pictures[1]"
          src="../../assets/TERRAZA.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'BAR' && !pictures[1]"
          src="../../assets/BAR.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'RESTAURANTE' && !pictures[1]"
          src="../../assets/RESTAURANTE.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'PELUQUERÍA' && !pictures[1]"
          src="../../assets/PELUQUERIA.jpg"
        />
        <img v-else-if="isPicture2" :src="setImage(pictures[1])" alt="Foto de perfil" />
      </slide>
      <slide>
        <img
          height="100%"
          v-if="details.category === 'TERRAZA' && !pictures[2]"
          src="../../assets/TERRAZA.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'BAR' && !pictures[2]"
          src="../../assets/BAR.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'RESTAURANTE' && !pictures[2]"
          src="../../assets/RESTAURANTE.jpg"
        />
        <img
          height="100%"
          v-else-if="details.category === 'PELUQUERÍA' && !pictures[2]"
          src="../../assets/PELUQUERIA.jpg"
        />
        <img height="100%" v-else-if="isPicture3" :src="setImage(pictures[2])" alt="Foto de perfil" />
      </slide>
      <hooper-navigation slot="hooper-addons"></hooper-navigation>
    </hooper>
    <div id="data">
      <p>
        <b>Categoría:</b>
        {{details.category | lowcase}}
      </p>
      <p>
        <b>Descripción:</b>
        {{details.description}}
      </p>
      <div id="location">
        <h4>Ubicación:</h4>
        <p>
          <b>Dirección:</b>
          {{details.line1}} {{details.line2}}, {{details.zip_code}}
        </p>
        <p>{{details.city}}, {{details.province | underscore}}</p>
      </div>
      <p>
        El establecimiento abre de
        <b>{{details.opening_time}}:00</b> a
        <b>{{details.closing_time}}:00</b>
      </p>

      <p>
        <b>La duración de las citas de este establecimiento es de {{details.length_booking}} minutos</b>
      </p>
    </div>

    <ul id="hours">
      <li>
        <label for>Fecha</label>
        <input v-model="date" type="date" placeholder="Datetime" />
      </li>
      <li>
        <label for>Hora</label>
        <select v-model="hours" id="units">
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
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
        </select>
        <label>:</label>
        <select v-model="minutes" id="units">
          <option value="0">:00</option>
          <option value="30">:30</option>
        </select>
      </li>
      <li>
        <label for>Plazas</label>
        <select v-model="units" id="units">
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
        </select>
      </li>
      <button @click.prevent="query()">Comprobar disponibilidad</button>
    </ul>
    <button id="checker" v-show="availability" @click.prevent="editTC = !editTC">Reservar</button>
    <textarea
      v-show="editTC"
      v-model="request"
      cols="40"
      rows="10"
      placeholder="Indica tu petición especial"
    ></textarea>
    <p
      v-show="editTC"
      id="advice"
    >Se te cargarán 3€ en tu tarjeta de crédito para confirmar la reserva</p>
    <div v-show="editTC" id="newTC">
      <input v-model="creditCardNumber" type="text" placeholder="Inserta tu tarjeta de crédito" />
      <input v-model="holderName" type="text" placeholder="Inserta el titular de la tarjeta" />
      <label>Mes</label>
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
      <label>Año</label>
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
      <button @click.prevent="book()">Confirmar la reserva</button>
    </div>
  </div>
</template>

<script>
import { getIdToken } from "../../utils";
import axios from "axios";
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import "hooper/dist/hooper.css";
import Swal from "sweetalert2";

export default {
  name: "BusinessProfile",
  components: {
    Hooper,
    Slide,
    HooperNavigation,
  },
  data() {
    return {
      details: null,
      pictures: {},
      date: "",
      name: "",
      hours: "",
      minutes: "",
      units: "",
      availability: false,
      creditCardNumber: "",
      holderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvcCode: "",
      editTC: "",
      idBooking: "",
      request: "",
    };
  },
  computed: {
    isPicture() {
      return this.details.profile_picture !== null;
    },
    isDetails() {
      return this.details !== null;
    },
    isPicture1() {
      return this.pictures[0].picture !== null;
    },
    isPicture2() {
      return this.pictures[1].picture !== null;
    },
    isPicture3() {
      return this.pictures[2].picture !== null;
    },
  },
  methods: {
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    goBack() {
      window.history.back();
    },

    async getBusiness() {
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" + this.$route.params.id
        );
        this.details = response.data.data[0];
        this.units = this.$route.query.units;
        this.hours = this.$route.query.hours;
        this.minutes = this.$route.query.minutes;
        this.date = this.$route.query.date;
        this.pictures = [
          response.data.pictures[0].picture,
          response.data.pictures[1].picture,
          response.data.pictures[2].picture,
        ];
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
            units: this.units,
            hours: this.hours,
            minutes: this.minutes,
          },
        });
        if (response.data.data.length > 0) {
          this.availability = true;
        } else {
          this.availability = false;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
        this.availability = false;
      }
    },
    async queryByDefault() {
      try {
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            id: this.$route.params.id,
            date: this.$route.query.date,
            units: this.$route.query.units,
            hours: this.$route.query.hours,
            minutes: this.$route.query.minutes,
          },
        });
        if (response.data.data.length > 0) {
          this.availability = true;
        } else {
          this.availability = false;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async book() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.post(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/business/" +
            this.$route.params.id +
            "/booking",
          {
            date: this.date,
            hours: this.hours,
            minutes: this.minutes,
            units: this.units,
            creditCardNumber: this.creditCardNumber,
            holderName: this.holderName,
            expiryMonth: this.expiryMonth,
            expiryYear: this.expiryYear,
            cvcCode: this.cvcCode,
            request: this.request,
          }
        );
        Swal.fire({
          icon: "success",
          title: "Has reservado satisfactoriamente",
          confirmButtonText: "OK",
        });
        const idBooking = response.data.data[0].id;
        await this.$router.push(`/user/booking/${idBooking}`);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
  created() {
    this.getBusiness();
    this.queryByDefault();
  },
};
</script>

<style scoped>
.rating {
  padding: 0.5rem;
}

#advice {
  color: red;
  font-size: 1.2rem;
}

.rating > li {
  list-style: none;
  margin: 0.2rem;
  text-decoration: none;
}

.hide {
  display: none;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: coral;
  font-weight: bolder;
  font-size: 1.3rem;
}

#profile {
  background: linear-gradient(
      rgba(241, 253, 254, 0.7),
      rgba(241, 253, 254, 0.7)
    ),
    url(../../assets/brick.jpeg);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

#hours > li {
  list-style: none;
  margin: 0.5rem;
}

#data {
  background-color: white;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: 1rem;
  border: 0.1rem solid coral;
}

.hooper {
  height: 250px;
  width: 100%;
  background-color: grey;
}
img {
  max-height: 100%;
  max-width: 100%;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
}

#hours {
  background-color: coral;
  padding: 1rem;
  margin: 1rem;
  border-radius: 1rem;
}

#hours > li input,
li select {
  margin: 0.2rem;
  border-radius: 5px;
  border: 0;
}
#newTC > textarea {
  display: inline;
}

#newTC > select,
input {
  margin: 3rem;
  border-radius: 5px;
  border: 0;
  margin: auto;
}

#checker {
  display: block;
  margin: 1rem;
}

button {
  margin-top: 1rem;
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
#newTC {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 2rem;
  width: 80%;
}

@media (min-width: 420px) {
  .hooper {
    height: 350px;
  }
}

@media (min-width: 700px) {
  #hours {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
  }

  #hours > li {
    margin-right: 1rem;
  }
  .hooper {
    height: 460px;
  }
}

@media (min-width: 1000px) {
  .hooper {
    width: 90%;
  }
}

@media (min-width: 1400px) {
  .hooper {
    height: 650px;
    width: 70%;
  }
}
</style>
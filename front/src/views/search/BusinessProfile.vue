<template>
  <div id="profile">
    <button @click="goBack()">Go Back</button>
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
          <router-link :to="{ name: 'BookingReviews', params: {id: details.id}}">Ver puntuaciones</router-link>
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
          v-if="details.category === 'TERRAZA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/TERRAZA.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'BAR'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/BAR.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'RESTAURANTE'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/RESTAURANTE.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'PELUQUERÍA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/PELUQUERIA.jpg"
          height="100"
        />
        <img :src="setImage(details.profile_picture)" alt="Foto de perfil" />
      </slide>
      <slide>
        <img
          v-if="details.category === 'TERRAZA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/TERRAZA.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'BAR'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/BAR.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'RESTAURANTE'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/RESTAURANTE.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'PELUQUERÍA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/PELUQUERIA.jpg"
          height="100"
        />
        <img :src="setImage(pictures[0])" alt="Foto de perfil" />
      </slide>
      <slide>
        <img
          v-if="details.category === 'TERRAZA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/TERRAZA.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'BAR'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/BAR.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'RESTAURANTE'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/RESTAURANTE.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'PELUQUERÍA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/PELUQUERIA.jpg"
          height="100"
        />
        <img :src="setImage(pictures[1])" alt="Foto de perfil" />
      </slide>
      <slide>
        <img
          v-if="details.category === 'TERRAZA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/TERRAZA.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'BAR'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/BAR.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'RESTAURANTE'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/RESTAURANTE.jpg"
          height="100"
        />
        <img
          v-else-if="details.category === 'PELUQUERÍA'"
          :class="{hide: details.profile_picture !== null}"
          src="../../assets/PELUQUERIA.jpg"
          height="100"
        />
        <img :src="setImage(pictures[2])" alt="Foto de perfil" />
      </slide>
      <hooper-navigation slot="hooper-addons"></hooper-navigation>
    </hooper>
    <div id="data">
      <p>
        <b>Categoría:</b>
        {{details.category}}
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
        <p>{{details.city}}, {{details.province}}</p>
      </div>
      <p>
        El establecimiento abre de
        <b>{{details.opening_time}}:00</b> a
        <b>{{details.closing_time}}:00</b>
      </p>

      <p>
        <b>La duración de las citas de este establecimiento es de {{details.length_booking}} minutes</b>
      </p>
    </div>

    <form id="hours">
      <input v-model="date" type="date" placeholder="Datetime" />
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
      <label for>Minutos</label>
      <select v-model="minutes" id="units">
        <option value="0">:00</option>
        <option value="30">:30</option>
      </select>
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
      <button @click="query()">Comprobar disponibilidad</button>
    </form>
    <button id="checker" v-show="availability" @click="editTC = !editTC">Reservar</button>
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
      <button @click="book()">Confirmar la reserva</button>
    </form>
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
      details: {},
      pictures: [],
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
    };
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
        console.log(response);
        if (response.data.data.length > 0) {
          this.availability = true;
        } else {
          this.availability = false;
        }
        console.log(response.data.data.length);
      } catch (error) {
        console.log(error.response);
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
        console.log(response.data.data.length);
      } catch (error) {
        console.log(error.response);
      }
    },
    async book() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        await axios.post(
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
          }
        );
        Swal.fire({
          icon: "success",
          title: "Has reservado satisfactoriamente",
          confirmButtonText: "OK",
        });
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

.rating > li {
  list-style: none;
  margin: 0.2rem;
  text-decoration: none;
}

.hide {
  display: none;
}

a {
  text-decoration: none;
  color: white;
  font-weight: bolder;
}

#profile {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

#data {
  background-color: white;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: 1rem;
  border: 0.1rem solid coral;
}

.hooper {
  height: 300px;
}
img {
  height: 300px;
  width: 100%;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#hours {
  background-color: coral;
  padding: 2rem;
  margin: 1rem;
  border-radius: 1rem;
}

#hours > input,
select {
  margin: 1rem;
  border-radius: 5px;
  border: 0;
}

#checker {
  display: block;
  margin: 1rem;
  margin: 1rem auto 0 auto;
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

@media (min-width: 1000px) {
  .hooper {
    height: 600px;
  }
  img {
    height: 600px;
    width: 100%;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
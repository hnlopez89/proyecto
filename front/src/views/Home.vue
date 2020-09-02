<template>
  <div class="plantilla">
    <div id="cover">
      <h1>Tempo</h1>
      <h2>
        Pide tu cita y gestiona tu
        <b>Tempo</b>
      </h2>
      <form id="advance" v-if="advanced">
        <button class="toggle" @click="advanced =! advanced">Buscar por nombre</button>

        <label>Categoría:</label>
        <select class="criteria" v-model="category">
          <option value="TERRAZA">Terraza</option>
          <option value="BAR">Bar</option>
          <option value="RESTAURANTE">Restaurante</option>
          <option value="PELUQUERIA">Peluquería</option>
        </select>
        <label>Ciudad:</label>
        <input class="criteria" v-model="city" type="text" placeholder="Ciudad Escogida" />
        <label>Fecha:</label>
        <input class="criteria" v-model="date" type="date" placeholder="Datetime" />
        <div id="time">
          <label for>Hora</label>
          <select v-model="hours">
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
          <select v-model="minutes">
            <option value="0">:00</option>
            <option value="30">:30</option>
          </select>
        </div>
        <div>
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
          <button class="search" @click="query()">Buscar</button>
        </div>
      </form>
      <form id="byName" v-if="!advanced">
        <button class="toggle" @click="advanced =! advanced">Busqueda Avanzada</button>
        <legend>Nombre:</legend>
        <input v-model="name" type="text" />
        <button class="search" @click="queryByName()">Buscar</button>
      </form>
    </div>
    <div id="ordered" v-show="isQuery">
      <p>
        <label>Ordenar por:</label>
        <select @click="query()" id="orderBy">
          <option value="voteAverage">Puntuación</option>
          <option value="totalVotes">Número de votos</option>
          <option value="name">Nombre</option>
        </select>
      </p>
      <p>
        <label>Sentido:</label>
        <select @click="query()" id="direction">
          <option value="DESC">descendente</option>
          <option value="ASC">ascendente</option>
        </select>
      </p>
    </div>
    <hooper
      v-if="!isQuery"
      :progress="true"
      :autoPlay="true"
      :playSpeed="6000"
      :infiniteScroll="true"
      :wheelControl="false"
    >
      <slide>
        <div id="responsive">
          <h1>¡Empieza a reservar con nosotros!</h1>
          <h4>Conoce los mejores establecimientos</h4>
          <p>¡Swipe derecha o izquiera y verás los negocios mejor valorados y los más nuevos!</p>
          <img src="../assets/RESTAURANTE.jpg" />
        </div>
        <ul id="top">
          <li>
            <h4>El mejor valorado.</h4>
            <p>
              ¡Reserva
              <b>{{top.name}}</b>
              ,
              {{top.category}} en
              <b>{{top.city}}</b>!
            </p>
            <img v-show="!top.profile_picture && top.category ==='BAR'" src="../assets/BAR.jpg" />
            <img
              v-show="!top.profile_picture && top.category==='RESTAURANTE'"
              src="../assets/RESTAURANTE.jpg"
            />
            <img
              v-show="!top.profile_picture && top.category==='PELUQUERÍA'"
              src="../assets/PELUQUERIA.jpg"
            />
            <img
              v-show="!top.profile_picture && top.category==='TERRAZA'"
              src="../assets/TERRAZA.jpg"
            />
            <img v-show="top.profile_picture" :src="setImage(top.profile_picture)" />
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: top.id}}"
              >Conoce {{top.name}}</router-link>
            </p>
          </li>
          <li>
            <h4>El más visitado.</h4>
            <p>
              ¡Reserva
              <b>{{popular.name}}</b>
              , {{popular.category}} en
              <b>{{popular.city}}</b>
              !
            </p>
            <img
              v-show="!popular.profile_picture && popular.category ==='BAR'"
              src="../assets/BAR.jpg"
            />
            <img
              v-show="!popular.profile_picture && popular.category==='RESTAURANTE'"
              src="../assets/RESTAURANTE.jpg"
            />
            <img
              v-show="!popular.profile_picture && popular.category==='PELUQUERÍA'"
              src="../assets/PELUQUERIA.jpg"
            />
            <img
              v-show="!popular.profile_picture && popular.category==='TERRAZA'"
              src="../assets/TERRAZA.jpg"
            />
            <img v-show="popular.profile_picture" :src="setImage(popular.profile_picture)" />
            <router-link
              tag="button"
              :to="{name: 'BusinessProfile', params: { id: popular.id}}"
            >Conoce {{popular.name}}</router-link>
          </li>
          <li>
            <h4>Lo más novedoso.</h4>
            <p>
              ¡Sé el primero en reservar
              <b>{{newest.name}}</b>
              , {{newest.category}} en {{newest.city}}
            </p>
            <img
              v-show="!newest.profile_picture && newest.category ==='BAR'"
              src="../assets/BAR.jpg"
            />
            <img
              v-show="!newest.profile_picture && newest.category==='RESTAURANTE'"
              src="../assets/RESTAURANTE.jpg"
            />
            <img
              v-show="!newest.profile_picture && newest.category==='PELUQUERÍA'"
              src="../assets/PELUQUERIA.jpg"
            />
            <img
              v-show="!newest.profile_picture && newest.category==='TERRAZA'"
              src="../assets/TERRAZA.jpg"
            />
            <img v-show="newest.profile_picture" :src="setImage(newest.profile_picture)" />
            <router-link
              tag="button"
              :to="{name: 'BusinessProfile', params: { id: newest.id}}"
            >Conoce {{newest.name}}</router-link>
          </li>
        </ul>
      </slide>
      <slide>
        <section>
          <div>
            <h3>
              ¡Reserva {{top.name}} en {{top.city}}, tiene la
              <b>mejor valoración</b>!
            </h3>
            <p>
              Conoce {{top.name}},
              <span
                v-if="top.category === 'PELUQUERÍA' || top.category === 'TERRAZA'"
              >¡la</span>
              <span v-else>¡el</span>
              <b></b>
              {{top.category}} con
              <b>la puntuación más alta</b> de
              <b>Tempo</b>!
            </p>
            <p>
              Su puntuación es
              <star-rating
                read-only
                :rating="Number(top.vote_average)"
                :increment="0.5"
                :fixed-point="1.8"
                :star-size="20"
                :inline="true"
                :show-rating="true"
              ></star-rating>
            </p>
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: top.id}}"
              >Conoce {{top.name}}</router-link>
            </p>
          </div>
          <img
            class="presentation"
            v-show="!top.profile_picture && top.category ==='BAR'"
            src="../assets/BAR.jpg"
          />
          <img
            class="presentation"
            v-show="!top.profile_picture && top.category==='RESTAURANTE'"
            src="../assets/RESTAURANTE.jpg"
          />
          <img
            class="presentation"
            v-show="!top.profile_picture && top.category==='PELUQUERÍA'"
            src="../assets/PELUQUERIA.jpg"
          />
          <img
            class="presentation"
            v-show="!top.profile_picture && top.category==='TERRAZA'"
            src="../assets/TERRAZA.jpg"
          />
          <img
            class="presentation"
            v-show="top.profile_picture"
            :src="setImage(top.profile_picture)"
          />
        </section>
      </slide>
      <slide>
        <section>
          <div>
            <h3>
              ¡Reserva {{popular.name}}, en {{popular.city}}, es
              <b>lo más popular</b>!
            </h3>
            <p>
              ¿Aún no has estado en {{popular.name}}? Es
              <span
                v-if="popular.category === 'PELUQUERÍA' || popular.category === 'TERRAZA'"
              >¡la</span>
              <span v-else>el</span>
              {{popular.category}} con
              <b>más puntuaciones</b>
              <b></b> de
              <b>Tempo</b>!
            </p>
            <p>
              Su puntuación es
              <star-rating
                read-only
                :rating="Number(popular.vote_average)"
                :increment="0.5"
                :fixed-point="1.8"
                :star-size="20"
                :inline="true"
                :show-rating="true"
              ></star-rating>, con un total de
              <b>{{popular.count}} votos.</b>
            </p>
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: popular.id}}"
              >Conoce {{popular.name}}</router-link>
            </p>
          </div>
          <img
            class="presentation"
            v-show="!popular.profile_picture && popular.category ==='BAR'"
            src="../assets/BAR.jpg"
          />
          <img
            class="presentation"
            v-show="!popular.profile_picture && popular.category==='RESTAURANTE'"
            src="../assets/RESTAURANTE.jpg"
          />
          <img
            class="presentation"
            v-show="!popular.profile_picture && popular.category==='PELUQUERÍA'"
            src="../assets/PELUQUERIA.jpg"
          />
          <img
            class="presentation"
            v-show="!popular.profile_picture && popular.category==='TERRAZA'"
            src="../assets/TERRAZA.jpg"
          />
          <img
            class="presentation"
            v-show="popular.profile_picture"
            :src="setImage(popular.profile_picture)"
          />
        </section>
      </slide>
      <slide>
        <section>
          <div>
            <h3>
              ¡Reserva {{newest.name}}, en {{newest.city}}, es
              <b>lo más novedoso</b>!
            </h3>
            <p>
              Descubre {{newest.name}},
              <b
                v-if="newest.category === 'PELUQUERÍA' || newest.category === 'TERRAZA'"
              >la nueva {{newest.category}}</b>
              <b v-else>el nuevo {{newest.category}}</b>
              que se ha unido a
              <b>Tempo</b>!
            </p>
            <p>¡Sé el primero en puntuarlo!</p>
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: newest.id}}"
              >Conoce {{newest.name}}</router-link>
            </p>
          </div>
          <img
            class="presentation"
            v-show="!newest.profile_picture && newest.category ==='BAR'"
            src="../assets/BAR.jpg"
          />
          <img
            class="presentation"
            v-show="!newest.profile_picture && newest.category==='RESTAURANTE'"
            src="../assets/RESTAURANTE.jpg"
          />
          <img
            class="presentation"
            v-show="!newest.profile_picture && newest.category==='PELUQUERÍA'"
            src="../assets/PELUQUERIA.jpg"
          />
          <img
            class="presentation"
            v-show="!newest.profile_picture && newest.category==='TERRAZA'"
            src="../assets/TERRAZA.jpg"
          />
          <img
            class="presentation"
            v-show="newest.profile_picture"
            :src="setImage(newest.profile_picture)"
          />
        </section>
      </slide>
      <hooper-navigation slot="hooper-addons"></hooper-navigation>
    </hooper>
    <businesses
      v-on:data="booking"
      :businesses="business"
      :date="date"
      :selectedDate="selectedDate"
      :selectedHour="selectedHour"
      :selectedMinute="selectedMinute"
      :selectedUnit="selectedUnit"
    />
  </div>
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import "hooper/dist/hooper.css";
import { getIdToken } from "../utils";

import businesses from "@/components/ListBusinessComp.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    businesses,
    Hooper,
    Slide,
    HooperNavigation,
  },
  data() {
    return {
      business: [],
      profile_picture: "",
      name: "",
      city: "",
      category: "",
      hours: "",
      minutes: "",
      units: "",
      date: "",
      advanced: true,
      isQuery: false,
      top: "",
      popular: "",
      newest: "",
    };
  },
  computed: {
    selectedDate() {
      return this.date;
    },
    selectedHour() {
      return this.hours;
    },
    selectedMinute() {
      return this.minutes;
    },
    selectedUnit() {
      return this.units;
    },
  },
  methods: {
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    async booking(bookingData) {
      try {
        console.log(this.date, bookingData.creditCardNumber);
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.post(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "/business/" +
            bookingData.idBusiness +
            "/booking/",
          {
            date: this.date,
            hours: this.hours,
            minutes: this.minutes,
            units: this.units,
            minutes: this.minutes,
            creditCardNumber: bookingData.creditCardNumber,
            holderName: bookingData.holderName,
            expiryMonth: bookingData.expiryMonth,
            expiryYear: bookingData.expiryYear,
            cvcCode: bookingData.cvcCode,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response);
      }
    },
    toggleQuery() {
      this.name = true;
    },
    async query() {
      try {
        const firstSelect = document.getElementById("orderBy");
        const orderBy = firstSelect.options[firstSelect.selectedIndex].value;
        const secondSelect = document.getElementById("direction");
        const direction =
          secondSelect.options[secondSelect.selectedIndex].value;
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            name: this.name,
            category: this.category,
            city: this.city,
            date: this.date,
            units: this.units,
            hours: this.hours,
            minutes: this.minutes,
            order: orderBy,
            direction: direction,
          },
        });
        this.business = response.data.data;
        this.isQuery = true;
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async queryByName() {
      try {
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            name: this.name,
          },
        });
        this.business = response.data.data;
        this.isQuery = false;
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async direction() {
      try {
        const firstSelect = document.getElementById("orderBy");
        const order = orderBy.options[orderBy.selectedIndex].value;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async passData() {
      let params = this.units;
      console.log(params);
      this.$emit("data", params);
    },
    async getBusiness() {
      const idBusiness = this.businesses[index].id;
      console.log(idBusiness);
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" + idBusiness
        );
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    async getTopBusiness() {
      try {
        const response = await axios.get(
          "http://localhost:3000/viewTopBusiness"
        );
        console.log(response);
        console.log(response.data);
        this.top = response.data.top;
        this.popular = response.data.popular;
        this.newest = response.data.newest;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getTopBusiness();
  },
};
</script>

<style scoped>
.plantilla {
  min-height: 100vh;
}

#responsive > img {
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
  border-radius: 1rem;
  border: 0.1rem coral solid;
}
h2 > b {
  color: coral;
}
#responsive > h1 {
  color: black;
}

#top {
  display: none;
}

section {
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.hooper {
  height: 500px;
}

.hooper > li {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

#cover {
  background-color: coral;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1,
h2 {
  padding: 0.5rem;
  color: white;
  text-align: center;
}

b {
  color: white;
}
form {
  padding: 1rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  height: 16.5rem;
  width: 12rem;
  border-radius: 1rem;
  background-color: rgba(24, 9, 4, 0.8);
  margin: 0 1rem;
  justify-items: center;
}

.hooper {
  margin-top: 5rem;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../assets/tempo.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: inherit;
}

label {
  color: white;
}
.toggle {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid #000000;
  margin: 0 0 1.5rem 1rem;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bolder;
  background-color: rgb(255, 255, 255);
  color: coral;
  text-align: center;
}

#head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 15rem;
  border: 0;
}
#head > :first-child {
  background-color: coral;
}

.criteria {
  border-radius: 5px;
  border: 0;
  margin-bottom: 0.5rem;
  width: 10rem;
}
#time > select {
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
}
#units {
  border-radius: 1rem;
  border: 0rem;
  margin: 1.2rem 2rem 0 0.2rem;
}

.search {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
}
#byName {
  padding: 1rem;
  margin: 0 1rem;
  border-radius: 1rem;
  width: 12rem;
  background-color: rgba(24, 9, 4, 0.8);
}

#byName > button {
  margin-bottom: 2rem;
}

#byName > input {
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 0;
}

#ordered {
  color: coral;
}

#ordered > p label {
  color: coral;
}

#ordered p > select {
  border-radius: 1rem;
  border: 0;
  margin: 0;
}

img.presentation {
  margin-top: 0.5rem;
  height: 10rem;
  border-radius: 1rem;
  border: solid 0.1rem coral;
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

@media (min-width: 700px) {
  #cover {
    background-image: url(../assets/portada.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: inherit;
  }
  section {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    height: 100%;
  }

  section > div {
    width: 40%;
  }

  label {
    color: black;
  }

  img.presentation {
    margin-top: 0.5rem;
    height: 20rem;
    border-radius: 1rem;
    border: solid 0.1rem coral;
  }

  #advance {
    padding: 1rem;
    margin: 0 1rem;
    border-radius: 1rem;
    width: 12rem;
    background-color: rgba(255, 127, 80, 0.9);
    height: 16.5rem;
  }
  #byName {
    padding: 1rem;
    margin: 0 1rem;
    border-radius: 1rem;
    width: 12rem;
    background-color: rgba(255, 127, 80, 0.8);
    height: 16.5rem;
  }

  #ordered {
    color: coral;
    font-weight: bold;
    padding: 1rem;
  }
}

@media (min-width: 1000px) {
  .hooper {
    height: 550px;
  }

  #responsive {
    display: none;
  }

  #top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: auto;
    flex-wrap: wrap;
  }

  #top > li {
    width: 30%;
    list-style: none;
  }

  img.presentation {
    margin-top: 0.5rem;
    height: 20rem;
    border-radius: 1rem;
    border: solid 0.1rem coral;
  }

  #top > li img {
    width: 70%;
    height: 15rem;
    border-radius: 1rem;
    border: coral solid 0.1rem;
    background-size: stretch;
    background-position: center;
    background-repeat: no-repeat;
  }

  h2 {
    margin-bottom: 0;
    padding-bottom: 0;
  }
}
@media (min-width: 1400px) {
  img.presentation {
    height: 30rem;
  }
}
</style>
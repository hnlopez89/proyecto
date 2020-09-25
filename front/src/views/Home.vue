<template>
  <div class="plantilla">
    <div id="cover">
      <img id="logo1" src="../assets/clock2.png" width="250px" height="200px" />
      <img id="logo2" src="../assets/clock.png" width="250px" height="200px" />
      <h2>
        Pide tu cita y gestiona tu
        <b>Tempo</b>
      </h2>
      <form id="advance" v-if="advanced">
        <button class="toggle" @click.prevent="advanced =! advanced">Buscar por nombre</button>

        <label>Categoría:</label>
        <select class="criteria" v-model="category">
          <option value="TERRAZA">Terraza</option>
          <option value="BAR">Bar</option>
          <option value="RESTAURANTE">Restaurante</option>
          <option value="PELUQUERIA">Peluquería</option>
        </select>
        <label>Provincia:</label>
        <select v-model="province" id="provincia">
          <option value="Alava">Álava</option>
          <option value="Albacete">Albacete</option>
          <option value="Alicante">Alicante/Alacant</option>
          <option value="Almeria">Almería</option>
          <option value="Asturias">Asturias</option>
          <option value="Avila">Ávila</option>
          <option value="Badajoz">Badajoz</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Burgos">Burgos</option>
          <option value="Caceres">Cáceres</option>
          <option value="Cadiz">Cádiz</option>
          <option value="Cantabria">Cantabria</option>
          <option value="Castellon">Castellón/Castelló</option>
          <option value="Ceuta">Ceuta</option>
          <option value="Ciudad_real">Ciudad Real</option>
          <option value="Cordoba">Córdoba</option>
          <option value="Cuenca">Cuenca</option>
          <option value="Girona">Girona</option>
          <option value="Granada">Granada</option>
          <option value="Guadalajara">Guadalajara</option>
          <option value="Guipuzcoa">Guipúzcoa</option>
          <option value="Huelva">Huelva</option>
          <option value="Huesca">Huesca</option>
          <option value="Islas_Baleares">Islas Balears</option>
          <option value="Jaen">Jaén</option>
          <option value="La_coruña">La Coruña</option>
          <option value="La_rioja">La Rioja</option>
          <option value="Las_palmas">Las Palmas</option>
          <option value="Leon">León</option>
          <option value="Lleida">Lleida</option>
          <option value="Lugo">Lugo</option>
          <option value="Madrid">Madrid</option>
          <option value="Malaga">Málaga</option>
          <option value="Melilla">Melilla</option>
          <option value="Murcia">Murcia</option>
          <option value="Navarra">Navarra</option>
          <option value="Ourense">Ourense</option>
          <option value="Palencia">Palencia</option>
          <option value="Pontevedra">Pontevedra</option>
          <option value="Salamanca">Salamanca</option>
          <option value="Segovia">Segovia</option>
          <option value="Sevilla">Sevilla</option>
          <option value="Soria">Soria</option>
          <option value="Tarragona">Tarragona</option>
          <option value="Santa_cruz_de_Tenerife">Santa Cruz de Tenerife</option>
          <option value="Teruel">Teruel</option>
          <option value="Toledo">Toledo</option>
          <option value="Valencia">Valencia</option>
          <option value="Valladolid">Valladolid</option>
          <option value="Vizcaya">Vizcaya</option>
          <option value="Zamora">Zamora</option>
          <option value="Zaragoza">Zaragoza</option>
        </select>
        <label>Fecha:</label>
        <input class="criteria" v-model="date" type="date" placeholder="Datetime" />
        <div id="time">
          <label for>Escoge hora</label>
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

          <label>:</label>
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
          <button class="search" @click.prevent="query()">Buscar</button>
        </div>
      </form>
      <form id="byName" v-if="!advanced">
        <button class="toggle" @click.prevent="advanced =! advanced">Busqueda Avanzada</button>
        <label>Nombre:</label>
        <input v-model="name" type="text" />
        <button class="search" @click.prevent="queryByName()">Buscar</button>
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
      :playSpeed="15000"
      :infiniteScroll="true"
      :wheelControl="false"
    >
      <slide>
        <div id="responsive">
          <h1>¡Empieza a reservar con nosotros!</h1>
          <h4>Conoce los mejores establecimientos</h4>
          <p>¡Swipe derecha o izquiera y verás los negocios mejor valorados y los más nuevos!</p>
        </div>
        <ul id="top">
          <li>
            <img class="icon" src="../assets/best.png" />
            <h2>El mejor valorado.</h2>
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
            <img v-if="top.profile_picture && isTop" :src="setImage(top.profile_picture)" />
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: top.id}, hash: '#up'}"
              >Conoce {{top.name}}</router-link>
            </p>
          </li>
          <li>
            <img class="icon" src="../assets/popular.png" />
            <h2>El más visitado.</h2>
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
            <img
              v-if="popular.profile_picture && isPopular"
              :src="setImage(popular.profile_picture)"
            />
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: popular.id}, hash: '#up'}"
              >Conoce {{popular.name}}</router-link>
            </p>
          </li>
          <li>
            <img class="icon" src="../assets/new.png" />

            <h2>Lo más novedoso.</h2>
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
            <img v-if="newest.profile_picture && isNewest" :src="setImage(newest.profile_picture)" />
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: newest.id}, hash: '#up'}"
              >Conoce {{newest.name}}</router-link>
            </p>
          </li>
        </ul>
      </slide>
      <slide>
        <section>
          <div>
            <h3>
              ¡Reserva {{top.name}} en {{top.province | underscore}}, tiene la
              <b>mejor valoración</b>!
            </h3>
            <p>
              Conoce {{top.name}},
              <span
                v-if="top.category === 'PELUQUERÍA' || top.category === 'TERRAZA'"
              >¡la</span>
              <span v-else>¡el</span>
              <b></b>
              {{top.category | lowcase}} con
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
                :border-width="3"
                :show-rating="true"
              ></star-rating>
            </p>
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: top.id}, hash: '#up'}"
              >Conoce {{top.name}}</router-link>
            </p>
          </div>
          <div class="parent">
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
              v-if="top.profile_picture && isTop"
              :src="setImage(top.profile_picture)"
            />
            <img class="iconOver" src="../assets/best.png" />
          </div>
        </section>
      </slide>
      <slide>
        <section>
          <div>
            <h3>
              ¡Reserva {{popular.name}}, en {{popular.province | underscore}}, es
              <b>lo más popular</b>!
            </h3>
            <p>
              ¿Aún no has estado en {{popular.name}}? Es
              <span
                v-if="popular.category === 'PELUQUERÍA' || popular.category === 'TERRAZA'"
              >¡la</span>
              <span v-else>el</span>
              {{popular.category | lowcase}} con
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
                :border-width="3"
              ></star-rating>, con un total de
              <b>{{popular.count}} votos.</b>
            </p>
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: popular.id} , hash: '#up'}"
              >Conoce {{popular.name}}</router-link>
            </p>
          </div>
          <div class="parent">
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
              v-if="popular.profile_picture && isPopular"
              :src="setImage(popular.profile_picture)"
            />
            <img class="iconOver" src="../assets/popular.png" />
          </div>
        </section>
      </slide>
      <slide>
        <section>
          <div>
            <h3>
              ¡Reserva {{newest.name}}, en {{newest.province | underscore}}, es
              <b>lo más novedoso</b>!
            </h3>
            <p>
              Descubre {{newest.name}},
              <b
                v-if="newest.category === 'PELUQUERÍA' || newest.category === 'TERRAZA'"
              >la nueva {{newest.category | lowcase}}</b>
              <b v-else>el nuevo {{newest.category | lowcase}}</b>
              que se ha unido a
              <b>Tempo</b>!
            </p>
            <p>¡Sé el primero en puntuarlo!</p>
            <p>
              <router-link
                tag="button"
                :to="{name: 'BusinessProfile', params: { id: newest.id}, hash: '#up'}"
              >Conoce {{newest.name}}</router-link>
            </p>
          </div>
          <div class="parent">
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
              v-if="newest.profile_picture && isNewest"
              :src="setImage(newest.profile_picture)"
            />
            <img class="iconOver" src="../assets/new.png" />
          </div>
        </section>
      </slide>
      <hooper-navigation slot="hooper-addons"></hooper-navigation>
    </hooper>
    <businesses
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
import { MoonLoader } from "@saeris/vue-spinners";

export default {
  name: "Home",
  components: {
    businesses,
    Hooper,
    Slide,
    HooperNavigation,
    MoonLoader,
  },
  data() {
    return {
      business: [],
      profile_picture: "",
      name: "",
      province: "",
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
      topProfilePicture: null,
      popularProfilePicture: null,
      newestProfilePicture: null,
      loading: false,
    };
  },
  render() {
    return {
      loading: true,
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
    isTop() {
      return this.topProfilePicture !== null;
    },
    isPopular() {
      return this.popularProfilePicture !== null;
    },
    isNewest() {
      return this.newestProfilePicture !== null;
    },
  },
  methods: {
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
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
            province: this.province,
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
        this.isQuery = true;
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
      this.$emit("data", params);
    },
    async getBusiness() {
      const idBusiness = this.businesses[index].id;
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
        this.top = response.data.top;
        this.topProfilePicture = response.data.top.profile_picture;
        this.popular = response.data.popular;
        this.popularProfilePicture = response.data.popular.profile_picture;
        this.newest = response.data.newest;
        this.newestProfilePicture = response.data.newest.profile_picture;
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
  padding: 0;
  margin: 0;
}

#top {
  display: none;
}

#top > li img.icon {
  margin: 0;
  border: inherit;
  height: 100px;
  width: 100px;
}
#top > li h2 {
  position: inherit;
  margin-bottom: 1rem;
  color: coral;
}

#cover {
  background-color: coral;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#cover > h2 {
  margin-top: 6rem;
}
h2 {
  padding: 0.5rem;
  color: white;
  text-align: center;
}

#cover b {
  color: black;
}

b {
  color: coral;
}
form {
  padding: 1rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  height: 15.5rem;
  width: 12rem;
  border-radius: 1rem;
  background-color: rgba(24, 9, 4, 0.8);
  margin: 0 1rem;
  justify-items: center;
}
label {
  color: white;
}

#logo1 {
  position: absolute;
  top: 5%;
  left: 15%;
}
#logo2 {
  display: none;
}
.toggle {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid #000000;
  margin: 0.8rem auto;
  margin-top: 0;
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

select {
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
  background-color: white;
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

.hooper {
  margin-top: 5rem;
  background: linear-gradient(
      rgba(241, 253, 254, 0.8),
      rgba(241, 253, 254, 0.5)
    ),
    url(../assets/tempo.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: inherit;
  height: 650px;
  padding: 0 0.2rem;
}
section {
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.hooper > li {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
#responsive > img {
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
  border-radius: 1rem;
  border: 0.1rem coral solid;
}
#responsive > h1 {
  color: black;
}

.parent {
  position: relative;
  height: auto;
  width: 90%;
  top: 0%;
  left: 0;
  padding: 0;
}

img.presentation {
  border-radius: 1rem;
  border: solid 0.1rem coral;
  position: relative;
  margin-top: 1rem;
  left: 0%;
  width: 100%;
  height: 14rem;
}
section > div {
  padding: 0 0.4rem;
}
.iconOver {
  position: absolute;
  top: 10%;
  left: 2%;
  width: 80px;
  height: 80px;
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

button:hover {
  cursor: pointer;
}

p > button:hover {
  background-color: coral;
  color: white;
}

@media (min-width: 450px) {
  .hooper {
    height: 625px;
  }

  img.presentation {
    left: 0%;
    width: 100%;
    height: 20rem;
  }

  .iconOver {
    top: 7%;
    left: 2%;
    width: 80px;
    height: 80px;
  }
}

@media (min-width: 700px) {
  #cover {
    background: linear-gradient(
        rgba(241, 253, 254, 0.3),
        rgba(241, 253, 254, 0.3)
      ),
      url(../assets/portada.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: inherit;
    padding-top: 10rem;
  }
  #cover > h2 {
    margin-top: 1rem;
    top: 22%;
    left: 35%;
    position: absolute;
  }

  #logo2 {
    display: inherit;
    position: absolute;
    top: 5%;
    left: 40%;
  }

  #cover b {
    color: coral;
  }

  .hooper {
    height: 350px;
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
    padding: 1.5rem;
  }

  label {
    color: black;
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
  .parent {
    position: relative;
    height: auto;
    width: 60%;
    top: 0;
    left: 0;
    padding: 0;
  }

  img.presentation {
    margin-top: 0rem;
    top: 10%;
    left: -5%;
    width: 90%;
    height: 18rem;
  }
  .iconOver {
    top: 3%;
    left: 1%;
    width: 70px;
    height: 70px;
  }
  #logo1 {
    display: none;
  }
}

@media (min-width: 1000px) {
  .hooper {
    height: 550px;
  }
  section > div {
    width: 35%;
  }
  #responsive {
    display: none;
  }

  #logo2 {
    top: 5%;
    left: 50%;
  }

  #cover > h2 {
    left: 45%;
  }

  #top {
    padding: 0;
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
    margin: auto;
  }

  #top > li img {
    width: 100%;
    height: 12rem;
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
  img.presentation {
    top: 10%;
    left: -5%;
    height: 20rem;
  }
  .iconOver {
    top: 3%;
    left: 1%;
    width: 90px;
    height: 90px;
  }
}
@media (min-width: 1200px) {
  #top > li img {
    height: 15rem;
  }
  img.presentation {
    height: 25rem;
  }
  .iconOver {
    left: 3%;
    width: 110px;
    height: 110px;
  }
}
@media (min-width: 1400px) {
  #top > li img {
    height: 16rem;
  }

  img.presentation {
    height: 30rem;
  }
  .iconOver {
    width: 120px;
    height: 120px;
  }
}
</style>
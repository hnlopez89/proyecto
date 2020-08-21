<template>
  <div class="Welcome">
    <img
      :class="{hide: businesses.profile_picture !== null}"
      src="../../assets/business.png"
      height="200"
    />
    <img :class="{hide: businesses.profile_picture === null }" :src="profilePicture" height="200" />
    <p>
      <b>Establecimiento:</b>
      {{businesses.name}}
    </p>
    <p>
      <b>Categoria</b>
      {{businesses.category}}
    </p>
    <ul>
      <h2>Puntuación:</h2>
      <li>
        <star-rating
          read-only
          :rating="Number(businesses.vote_average)"
          :increment="0.5"
          :fixed-point="1.8"
          :star-size="20"
          :inline="true"
          :show-rating="true"
        ></star-rating>
      </li>
      <p>
        <b>Votos Totales:</b>
        {{businesses.count}}
      </p>
      <p>
        <router-link
          :to="{name: 'BookingReviews', params: {id: businesses.id}}"
          tag="button"
        >Ver qué opinan de tí</router-link>
      </p>
    </ul>
    <router-link :to="{name: 'CheckAvailability'}" tag="button">Consulta tu disponibilidad</router-link>

    <div id="boardData">
      <p>Datos de tu negocio</p>
      <router-link :to="{name: 'EditBusiness'}" tag="button">Editar tu negocio</router-link>
      <router-link :to="{name: 'EditPicturesBusiness'}" tag="button">Editar tus Fotos</router-link>
      <router-link :to="{name: 'EditBusinessPassword'}" tag="button">Editar tu contraseña</router-link>
    </div>

    <div id="boardBookings">
      <p>Reservas</p>
      <router-link :to="{name: 'BookingsBusiness'}" tag="button">Ver tus reservas</router-link>
      <router-link :to="{name: 'BookingBusinessToday'}" tag="button">¿Quien viene hoy?</router-link>
      <router-link :to="{name: 'BookingBusinessTomorrow'}" tag="button">¿Quien viene mañana?</router-link>
    </div>

    <button @click="toggleResign()">Darte de baja</button>
    <form v-show="explanation">
      <input v-model="reason" type="text" placeholder="¿Porqué quieres darte de baja?" />
      <button @click="resign()">Confirmar darte de baja</button>
    </form>
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
      businesses: [],
      explanation: false,
      reason: "",
      profilePicture: "",
    };
  },

  methods: {
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" + getIdToken(token)
        );
        console.log(response);
        this.businesses = response.data.data[0];
        this.profilePicture = response.data.data[0].profile_picture;
        if (this.profilePicture !== null) {
          this.profilePicture =
            process.env.VUE_APP_STATIC + this.profilePicture;
        }
        console.log(this.businesses.profile_picture);
      } catch (error) {
        console.log(error);
      }
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    async resign() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/user/" + getIdToken(token) + "/deactive",
          {
            resignReason: this.reason,
          }
        );
        axios.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("AUTH_TOKEN_KEY");
        localStorage.removeItem("ROLE");
        localStorage.removeItem("NAME");
        this.$router.push("/home");
        location.reload();
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
  created() {
    this.getBusiness();
  },
};
</script>

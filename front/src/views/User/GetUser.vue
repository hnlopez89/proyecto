<template>
  <div class="GetUser">
    <h1>MI USUARIO</h1>
    <img :src="picture" :class="{hide: user.picture === null }" />
    <img src="../../assets/default-user-avatar.jpg" :class="{hide: user.picture !== null }" />
    <p>
      <b>Nombre:</b>
      {{user.name}} {{user.surname}}
    </p>
    <div id="boardUserData">
      <p>Tus datos</p>
      <router-link :to="{ name: 'EditUser'}" tag="button">Editar tu Perfil</router-link>
      <router-link :to="{ name: 'EditUserPassword'}" tag="button">Editar tu contraseña</router-link>
    </div>
    <div v-show="adminWay">
      <h3>Tus funciones de Administrador:</h3>
      <router-link
        :to="{ name: 'ListBookingsPending'}"
        tag="button"
      >Ver las reservas pendientes de pago</router-link>
      <router-link
        :to="{ name: 'ListBusinessPending'}"
        tag="button"
      >Ver negocios pendientes de activar</router-link>
      <router-link
        :to="{ name: 'ListBusinessBadReviews'}"
        tag="button"
      >Ver negocios con malas puntuaciones</router-link>

      <router-link :to="{ name: 'ListBookings'}" tag="button">Ver todas las reservas</router-link>
      <router-link :to="{ name: 'ListUsers'}" tag="button">Ver todos los usuarios</router-link>
      <router-link :to="{ name: 'ListBusiness'}" tag="button">Ver todos los negocios</router-link>
    </div>
    <div v-show="!adminWay" id="boardUserBookings">
      <p>Tu sección de reservas</p>
      <router-link :to="{ name: 'BookingUserHistoric'}" tag="button">Ver tus reservas pasadas</router-link>
      <router-link :to="{ name: 'BookingsUser'}" tag="button">Ver todas tus reservas</router-link>
      <router-link :to="{ name: 'BookingUserConfirmed'}" tag="button">Ver tus reservas futuras</router-link>
    </div>
    <div v-show="!adminWay">
      <p>¿Te quieres dar de baja con nosotros?</p>
      <p>¿De verdad?</p>
      <button v-show="!adminWay" @click="toggleResign()">Darte de baja</button>
      <form v-show="explanation">
        <input v-model="reason" type="text" placeholder="¿Porqué quieres darte de baja?" />
        <button @click="resign()">Confirmar darte de baja</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken, checkIsAdminUser } from "../../utils";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      user: [],
      idCliente: "",
      explanation: false,
      reason: "",
      adminWay: false,
      picture: "",
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    adminWayFunction() {
      this.adminWay = checkIsAdminUser();
    },
    async getUser() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/user/" + getIdToken(token)
        );
        this.user = response.data.data[0];
        this.picture = response.data.data[0].picture;
        if (this.picture !== null) {
          this.picture = process.env.VUE_APP_STATIC + this.picture;
        }
      } catch (error) {
        console.log(error);
      }
    },
    toggleResign() {
      this.explanation = true;
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
    this.getUser();
    this.adminWayFunction();
  },
};
</script>


<template>
  <div class="GetUser">
    <h1>MI USUARIO</h1>
    <p>
      <b>Nombre:</b>
      {{user.name}} {{user.surname}}
    </p>
    <h2 v-show="admin">Hola Admin!</h2>
    <div id="boardUserData">
      <p>Tus datos</p>
      <router-link :to="{ name: 'EditUser'}" tag="button">Editar tu Perfil</router-link>
      <router-link :to="{ name: 'EditUserPassword'}" tag="button">Editar tu contraseña</router-link>
    </div>
    <div id="boardUserBookings">
      <p>Tu sección de reservas</p>
      <router-link :to="{ name: 'BookingUserHistoric'}" tag="button">Ver tus reservas pasadas</router-link>
      <router-link :to="{ name: 'BookingsUser'}" tag="button">Ver todas tus reservas</router-link>
      <router-link :to="{ name: 'BookingUserConfirmed'}" tag="button">Ver tus reservas futuras</router-link>
    </div>
    <p>¿Te quieres dar de baja con nosotros?</p>
    <p>¿De verdad?</p>
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
      user: [],
      idCliente: "",
      explanation: false,
      reason: "",
      admin: false,
    };
  },

  methods: {
    async getUser() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/user/" + getIdToken(token)
        );
        {
          this.user = response.data.data[0];
          console.log(response);
        }
        if (response.data.data[0].role === "admin") {
          this.admin = true;
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
  },
};
</script>

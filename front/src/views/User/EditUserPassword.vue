<template>
  <div class="EditUserPassword">
    <button @click="goBack()">Go Back</button>
    <h1>EDITAR TU CONTRASEÑA</h1>
    <div>
      <input type="password" v-model="oldPassword" placeholder="Tu contraseña actual" />
      <input type="password" v-model="newPassword" placeholder="Tu nueva contraseña" />
      <button @click="updatePassword()">Actualizar tu contraseña</button>
    </div>
    <router-link to="/getuser" tag="button">Volver a tu Perfil</router-link>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "EditPassword",
  data() {
    return {
      data: [],
      oldPassword: "",
      newPassword: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    updatePassword() {
      var self = this;
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      axios
        .put("http://localhost:3000/user/" + getIdToken(token) + "/password", {
          oldPassword: self.oldPassword,
          newPassword: self.newPassword,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
      location.reload;
    },
  },
};
</script>

<style scoped>
</style>

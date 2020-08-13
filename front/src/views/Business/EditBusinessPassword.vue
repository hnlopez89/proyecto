<template>
  <div class="EditUserPassword">
    <h1>EDITA LA CONTRASEÑA DE TU NEGOCIO</h1>
    <div>
      <input type="password" v-model="oldPassword" placeholder="Tu contraseña actual" />
      <input type="password" v-model="newPassword" placeholder="Tu nueva contraseña" />
      <button @click="updatePassword()">Actualizar tu contraseña</button>
    </div>
    <router-link to="/getbusiness" tag="button">Volver a tu Perfil</router-link>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken, logoutBusiness } from "../../utils";

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
    async updatePassword() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/business/" + getIdToken(token) + "/password",
          {
            oldPassword: self.oldPassword,
            newPassword: self.newPassword,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
};
</script>

<style scoped>
</style>

<template>
  <div>
    <input v-model="recoverCode" type="text" placeholder="Escribe tu código de recuperación" />
    <br />
    <input v-model="newPassword" type="password" placeholder="Escribe tu nueva contraseña" />
    <button @click="resetPassword()">Cambia tu contraseña</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResetUserPassword",
  data() {
    return {
      recoverCode: "",
      newPassword: "",
    };
  },
  methods: {
    async resetPassword() {
      try {
        const response = await axios.post(
          "http://localhost:3000/user/reset-password",
          {
            recoverCode: this.recoverCode,
            newPassword: this.newPassword,
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

<style>
</style>
<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <input v-model="recoverCode" type="text" placeholder="Escribe tu código de recuperación" />
    <br />
    <input v-model="newPassword" type="password" placeholder="Escribe tu nueva contraseña" />
    <button @click="resetPassword()">LogIn Usuario</button>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  data() {
    return {
      recoverCode: "",
      newPassword: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async resetPassword() {
      await axios.post("http://localhost:3000/business/reset-password", {
        recoverCode: this.recoverCode,
        newPassword: this.newPassword,
      });
    },
  },
};
</script>

<style>
</style>
<template>
  <div>
    <h1>Enhorabuena, tu negocio está activado</h1>
    <h5>Inicia sesión</h5>
    <p v-show="showError">{{errorMsg}}</p>
    <router-link :to="{name: 'Login'}" tag="button">Login</router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterValidationBusiness",
  data() {
    return {
      showError: "",
      errorMsg: "",
    };
  },
  methods: {
    async validationBusiness() {
      let url = window.locaiton.href;
      let registrationCode = url.split("?");

      try {
        const response = await axios.get(
          "http://localhost:3000/user/validate" + registrationCode[1]
        );
      } catch (error) {
        this.showError = true;
        this.errorMsg = error.response.data.message;
      }
    },
  },
  created() {
    this.validationBusiness();
  },
};
</script>

<style>
</style>
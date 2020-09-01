<template>
  <div id="RegisterValidation">
    <div v-show="!showError">
      <h1>Enhorabuena, tu usuario está activado</h1>
      <h5>Inicia sesión</h5>
      <router-link :to="{name: 'Login'}" tag="button">Login</router-link>
    </div>
    <div v-show="showError">
      <h3>{{errorMsg}}</h3>
      <router-link :to="{name: 'Home'}" tag="button">Inicio</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterValidation",
  data() {
    return {
      showError: "",
      errorMsg: "",
    };
  },
  methods: {
    async validationUser() {
      let url = window.location.href;
      let registrationCode = url.split("?");

      try {
        const response = await axios.get(
          "http://localhost:3000/user/validation/" + registrationCode[1]
        );
      } catch (error) {
        this.showError = true;
        this.errorMsg = error.response.data.message;
      }
    },
  },
  created() {
    this.validationUser();
  },
};
</script>

<style scoped>
div {
  margin-top: 3rem;
}
#RegisterValidation {
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
h1 {
  margin: 3rem auto;
}

input {
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 0;
  padding: 0.3rem;
  margin: auto;
  display: block;
  width: 20rem;
}

h3 {
  color: red;
}

button {
  margin-top: 3rem;
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
</style>
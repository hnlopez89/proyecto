<template>
  <div>
    <button @click="goBack()">Go Back</button>

    <router-link to="/createbusiness">Crea tu cuenta en Tempo</router-link>
    <input v-model="emailBusiness" type="email" placeholder="Dirección de email" />
    <br />
    <input v-model="passwordBusiness" type="password" placeholder="Password de business" />
    <button @click="login()">LogIn Negocio</button>
    <p>¿Te olvidaste la contraseña?</p>
    <button @click="validatingMail()">Recupera tu contraseña</button>
  </div>
</template>

<script>
import { loginBusiness } from "../../utils";
import { isLoggedInBusiness } from "../../utils";
import { getNameBusiness } from "../../utils";
import axios from "axios";

export default {
  name: "LoginBusiness",
  data() {
    return {
      emailBusiness: "",
      passwordBusiness: "",
      logged: false,
      userMood: false,
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    setBusinessname() {
      this.name = getNameBusiness();
    },
    login() {
      if (this.emailBusiness === "" || this.passwordBusiness === "") {
        alert("Te faltan datos.");
      } else {
        loginBusiness(this.emailBusiness, this.passwordBusiness);
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
      this.userMood = false;
      this.started = true;
      this.$router.push("/mybusiness");
    },
    getLoginBusiness() {
      this.logged = isLoggedInBusiness();
    },
    validatingMail() {
      console.log("holi");
      if (this.emailToRecover === "") {
        this.errorMsg = true;
        this.validation = false;
      } else {
        this.errorMsg = false;
        this.validation = true;
        console.log("holi");

        this.recover();
      }
    },
    async recover() {
      try {
        if (this.validation === true) {
          await axios.post("http://localhost:3000/user/recover-password", {
            email: this.emailToRecover,
          }),
            response;
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.setBusinessname();
    this.getLoginBusiness();
  },
};
</script>
<style>
</style>
<template>
  <div>
    <input v-model="user" type="text" placeholder="Nombre de usuario" />
    <br />
    <input v-model="password" type="text" placeholder="Password de usuario" />
    <button @click="loginUser()">LogIn</button>
  </div>
</template>

<script>
import { login } from "../api/utils";

export default {
  name: "Login",
  data() {
    return {
      user: "",
      password: "",
    };
  },

  methods: {
    loginUser() {
      if (this.user === "" || this.password === "") {
        alert("Te faltan datos.");
      } else {
        login(this.user, this.password);
      }
      setTimeout(() => {
        this.$router.push("/home");
        location.reload();
      }, 1000);
    },
  },
};
</script>

<style>
</style>
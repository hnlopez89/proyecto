<template>
  <div>
    <input v-model="email" type="email" placeholder="Email de usuario" />
    <br />
    <input v-model="password" type="password" placeholder="Password de usuario" />
    <button @click="login()">LogIn Usuario</button>
    <button @click="logoutUser()">LogOut Usuario</button>
    <p>¿Te olvidaste la contraseña?</p>
    <button @click="validatingMail()">Recupera tu contraseña</button>
    <input
      v-model="emailToRecover"
      type="email"
      placeholder="Escribe tu email para mandarte las instrucciones"
    />
  </div>
</template>

<script>
import { loginUser } from "../../utils";
import { isLoggedInUser } from "../../utils";
import { getNameUser } from "../../utils";
import axios from "axios";

export default {
  name: "LoginUser",
  data() {
    return {
      email: "",
      password: "",
      emailToRecover: "",
      loggedUser: true,
      validation: false,
      errorMsg: false,
    };
  },
  methods: {
    setUsername() {
      this.name = getNameUser();
    },
    login() {
      if (this.email === "" || this.password === "") {
        alert("Te faltan datos.");
      } else {
        loginUser(this.email, this.password);
      }
      this.$router.push("/home");
    },
    getLoginUser() {
      this.logged = isLoggedInUser();
    },
    validatingMail() {
      if (this.emailToRecover === "") {
        this.errorMsg = true;
        this.validation = false;
      } else {
        this.errorMsg = false;
        this.validation = true;

        this.recover();
      }
    },
    async recover() {
      if (this.validation === true) {
        try {
          const response = await axios.post(
            "http://localhost:3000/user/recover-password",
            {
              email: this.emailToRecover,
            }
          );
          console.log(response);
        } catch (error) {
          console.log(error.response.data);
        }
      }
    },
  },
  created() {
    this.setUsername();
    this.getLoginUser();
  },
};
</script>

<style>
</style>
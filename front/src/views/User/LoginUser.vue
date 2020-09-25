<template>
  <div id="page">
    <button id="back" @click="goBack()">Vuelve a inicio</button>
    <form>
      <input v-model="email" type="email" placeholder="Email de usuario" />
      <input v-model="password" type="password" placeholder="Password de usuario" />
      <button id="login" @click.prevent="login()">LogIn Usuario</button>
      <button @click.prevent="recover =! recover">¿Has olvidado tu contraseña?</button>
      <div v-show="recover">
        <input v-model="emailToRecover" type="email" placeholder="Escribe tu email " />
        <button @click.prevent="validatingMail()">Recupera tu contraseña</button>
      </div>
    </form>
  </div>
</template>

<script>
import { loginUser } from "../../utils";
import { isLoggedInUser } from "../../utils";
import { getNameUser } from "../../utils";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LoginUser",
  data() {
    return {
      email: "",
      password: "",
      emailToRecover: "",
      validation: false,
      errorMsg: false,
      recover: "",
      logged: "",
      name: "",
    };
  },
  methods: {
    setUsername() {
      if (isLoggedInUser() === true) {
        this.name = getNameUser();
      }
    },
    async login() {
      if (this.email === "" || this.password === "") {
        alert("Te faltan datos.");
      } else {
        await loginUser(this.email, this.password);
        this.$router.push("/home");
        this.setUsername();
        let name = this.name;
        this.$emit("login", name);
      }
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

        this.recoverPassword();
      }
    },
    async recoverPassword() {
      if (this.validation === true) {
        try {
          const response = await axios.post(
            "http://localhost:3000/user/recover-password",
            {
              email: this.emailToRecover,
            }
          );
          Swal.fire({
            icon: "success",
            title:
              "Te hemos mandado un email para que puedas resetear tu contraseña",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      }
    },
    userWayFunction() {
      if (isLoggedInUser() === true) {
        this.userWay = isLoggedInUser();
        this.logged = isLoggedInUser();
      }
    },
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.setUsername();
    this.getLoginUser();
    this.userWayFunction();
  },
};
</script>

<style scoped>
#page {
  background-image: url(../../assets/bigBen.jpeg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  min-height: 100vh;
}
#back {
  margin-top: 1rem;
  border: 0.1rem solid black;
  background-color: #ffffff;
  margin-bottom: 3.5rem;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
}

button:hover,
#back:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

input {
  border-radius: 5px;
  border: 0;
  padding: 0.2rem;
  margin: 0.2rem;
  width: 12rem;
}

#login {
  margin-bottom: 3rem;
}
</style>
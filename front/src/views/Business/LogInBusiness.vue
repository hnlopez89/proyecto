<template>
  <div id="page">
    <button id="back" @click="goBack()">Vuelve a inicio</button>
    <h1>Bienvenido a la sección de negocio</h1>
    <div id="user">
      <div id="logIn">
        <input v-model="emailBusiness" type="email" placeholder="Dirección de email" />
        <input v-model="passwordBusiness" type="password" placeholder="Contraseña" />
        <button @click="login2()">LogIn Negocio</button>
      </div>
      <button v-show="!recover" @click="recover = !recover">¿Has olvidado tu contraseña?</button>
      <div id="recover" v-show="recover">
        <button v-show="recover" @click="recover = !recover">La acabo de recordar</button>
        <div>
          <input v-model="emailToRecover" type="email" placeholder="Escribe tu email " />
          <button @click="validatingMail()">Recupera tu contraseña</button>
        </div>
      </div>
      <div id="register">
        <p>¿Aún no trabajas con nosotros?</p>
        <router-link tag="button" to="/createbusiness">Crea tu cuenta en Tempo</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { loginBusiness } from "../../utils";
import { isLoggedInBusiness } from "../../utils";
import { getNameBusiness } from "../../utils";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LoginBusiness",
  data() {
    return {
      emailBusiness: "",
      passwordBusiness: "",
      emailToRecover: "",
      logged: false,
      userMood: false,
      businessWay: false,
      recover: "",
      logged: "",
      name: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    setBusinessname() {
      if (isLoggedInBusiness) {
        this.name = getNameBusiness();
      }
    },
    async login2() {
      if (this.emailBusiness === "" || this.passwordBusiness === "") {
        alert("Te faltan datos.");
      } else {
        await loginBusiness(this.emailBusiness, this.passwordBusiness);
        this.$router.push("/mybusiness");
        this.setBusinessname();
        let name = this.name;
        this.$emit("login2", name);
      }
    },
    getLoginBusiness() {
      this.logged = isLoggedInBusiness();
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
      try {
        if (this.validation === true) {
          console.log(this.emailToRecover);
          await axios.post("http://localhost:3000/business/recover-password", {
            email: this.emailToRecover,
          });
          Swal.fire({
            icon: "success",
            title:
              "Te hemos mandado un email para que puedas resetear tu contraseña",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },

    businessWayFunction() {
      if (isLoggedInBusiness() === true) {
        this.businessWay = isLoggedInBusiness();
        this.logged = isLoggedInBusiness();
      }
    },
  },
  created() {
    this.setBusinessname();
    this.getLoginBusiness();
    this.businessWayFunction();
  },
};
</script>
<style scoped>
#page {
  background-image: url(../../assets/workWithUs.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  min-height: 100vh;
}

h1 {
  margin-top: 3rem;
}

#user {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
}
#back {
  margin-top: 1rem;
  border: 0.1rem solid black;
  background-color: #ffffff;
}

input {
  border-radius: 5px;
  border: 0;
  padding: 0.2rem;
  margin: 0.2rem;
  width: 12rem;
  display: flex;
  flex-direction: column;
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

#recover {
  margin-bottom: 6rem;
  font-size: small;
}

#recover > button {
  font-size: small;
}
div > p {
  margin: 0.5rem;
}

#register {
  background-color: rgba(247, 247, 247, 0.6);
  padding: 0.5rem;
  border-radius: 1rem;
}
</style>
<template>
  <div class="resetPassword">
    <button id="up" @click="goBack()">Volver</button>
    <h1>Establece tu contraseña</h1>
    <input v-model="recoverCode" type="text" placeholder="Escribe tu código de recuperación" />
    <br />
    <input v-model="newPassword" type="password" placeholder="Escribe tu nueva contraseña" />
    <button @click="resetPassword()">LogIn Usuario</button>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
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
      try {
        await axios.post("http://localhost:3000/business/reset-password", {
          recoverCode: this.recoverCode,
          newPassword: this.newPassword,
        });
        this.$router.push("/loginbusiness");
        Swal.fire({
          icon: "success",
          title:
            "Has creado tu usuario correctamente, ¡bienvenido! Revisa tu email para validar tu usuario y editar tu disponibilidad",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
};
</script>

<style scoped>
.resetPassword {
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

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}
</style>
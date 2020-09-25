<template>
  <div id="contact">
    <button id="up" @click="goBack()">Volver</button>
    <h1>Contacta con nosotros</h1>
    <div id="contacData">
      <input v-model="emailAddress" type="email" placeholder="Indica tu dirección de email" />
      <input v-model="subject" type="text" placeholder="Indica el asunto" />
      <textarea v-model="text" cols="150" rows="60"></textarea>
      <button @click="sendMail">Enviar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      emailAddress: "",
      subject: "",
      text: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async sendMail() {
      try {
        const response = await axios.post("http://localhost:3000/contact/", {
          emailAddress: this.emailAddress,
          subject: this.subject,
          text: this.text,
        });
        Swal.fire({
          icon: "success",
          title:
            "Nos ha llegado tu mensaje correctamente, ¡gracias! Te contactaremos de vuelta lo más rápido posible",
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
#contact {
  min-height: 100vh;
  background-image: url(../assets/logInUser.jpeg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: inherit;
}
input {
  display: block;
  margin: auto;
  margin-bottom: 3rem;
  border-radius: 5px;
  border: 0;
  padding: 0.3rem;
  width: 20rem;
}

button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 3rem;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}
h1 {
  color: white;
  background-color: black;
}

#contactData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5rem;
}

textarea {
  height: 10rem;
  width: 15rem;
}

@media (min-width: 1000px) {
  input {
    display: block;
    margin: auto;
    margin-bottom: 3rem;
    border-radius: 5px;
    border: 0;
    padding: 0.3rem;
    width: 20rem;
    position: relative;
    right: 17%;
  }

  textarea {
    height: 15rem;
    width: 45rem;
  }
}
</style>
<template>
  <div id="contact">
    <button @click="goBack()">Go Back</button>
    <h1>Contacta con nosotros</h1>
    <div id="contacData">
      <input v-model="email" type="email" placeholder="Indica tu dirección de email" />
      <input v-model="Asunto" type="text" placeholder="Indica el asunto" />
      <textarea name id cols="80" rows="20"></textarea>
      <button>Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.back();
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
<template>
  <div id="Error">
    <button id="up" @click="goBack()">Volver</button>
    <div>
      <h1>Lo sentimos, esta ruta es incorrecta</h1>
      <h2>
        Corre, ¡que el
        <b>Tempo</b> vuela!
      </h2>
      <h4>Haz click justo debajo para volver al inicio.</h4>
      <router-link tag="button" class="start" :to="{ name: 'Home'}">Volver a Inicio</router-link>
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
#Error {
  padding-top: 1rem;
  min-height: 100vh;
  background: linear-gradient(
      rgba(241, 253, 254, 0.3),
      rgba(241, 253, 254, 0.3)
    ),
    url(../assets/error.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
h1,
b {
  color: coral;
}

button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 0.1rem solid coral;
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
#Error > div {
  padding-top: 3rem;
  padding-left: 3rem;
  text-align: left;
}
</style>
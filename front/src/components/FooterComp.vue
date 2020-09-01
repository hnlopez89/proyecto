<template>
  <div>
    <footer>
      <!--    <router-link to="/help" @click.native="start()">Help</router-link> -->
      <router-link to="/contact" @click.native="start()">Contacto</router-link>
      <router-link to="/about" @click.native="start()">About</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterComp",
  data() {
    return {
      started: false,
    };
  },
  methods: {
    start() {
      this.started = true;
      this.userMood = false;
    },
  },
};
</script>

<style scoped >
footer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding-top: 2rem;
  align-items: stretch;
  height: 5rem;
  background-color: black;
  width: 100%;
}
a {
  color: coral;
  text-decoration: none;
}
</style>
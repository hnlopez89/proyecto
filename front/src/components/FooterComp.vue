<template>
  <div>
    <footer>
      <router-link to="/help" @click.native="start()">Help</router-link>
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
}
</style>
<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <h1>Esta es la página de ayuda</h1>
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

<style scope >
</style>
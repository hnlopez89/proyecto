<template>
  <div>
    <p>{{details.profile_picture}}</p>
    <h1>{{details.name}}</h1>
    <p>{{details.category | lowcase}}</p>
    <p>{{details.description}}</p>
    <p>{{details.city}}</p>
    <p>{{details.zip_code}}</p>
    <p>{{details.province | underscore}}</p>
    <p>{{details.line1}}</p>
    <p>{{details.line2}}</p>
    <p>{{details.opening_time}}</p>
    <p>{{details.closing_time}}</p>
    <p>{{openingDays}}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GetBusinessToActivate",
  props: {
    openingDays: Array,
    details: Object,
  },
};
</script>

<style scoped>
</style>
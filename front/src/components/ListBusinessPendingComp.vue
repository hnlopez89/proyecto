<template>
  <div>
    <ul>
      <!-- ESCOGEMOS VALORES DEL ARRAY DEL COMPONENTE -->
      <li v-for="business in businesses" :key="business.id">
        <h4>
          <router-link :to="{name: 'CheckBusiness', params: { id: business.id}}">{{business.name}}</router-link>
        </h4>
        <p id="category">Categoría: {{business.category}}</p>
        <p>Id:{{business.id}}</p>
        <p>Ciudad: {{business.city}}</p>
        <p>Abre de {{business.opening_time}}:00 a {{business.closing_time}}:00</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ListBusiness",
  data() {
    return {
      business: [],
    };
  },
  props: {
    businesses: Array,
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
div.modal button {
  border-radius: 20px;
  margin: 0.5rem;
}

button {
  padding: 0.25rem;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
}
</style>
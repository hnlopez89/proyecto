<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <!--<div>
      <form action id="query">
        <label>Categoría:</label>
        <select v-model="category">
          <option value="TERRAZA">Terraza</option>
          <option value="BAR">Bar</option>
          <option value="RESTAURANTE">Restaurante</option>
          <option value="PELUQUERIA">Peluquería</option>
          <option>(todas las categorías)</option>
        </select>
        <label>Ciudad:</label>
        <input v-model="city" type="text" placeholder="Ciudad Escogida" />
        <input v-model="name" type="text" placeholder="Nombre del Establecimiento" />

        <label>Ordenar por:</label>
        <select @click="query()" id="orderBy">
          <option value="voteAverage">Puntuación</option>
          <option value="totalVotes">Número de votos</option>
          <option value="name">Nombre del establecimiento</option>
        </select>
        <label>Sentido:</label>
        <select @click="query()" id="direction">
          <option value="ASC">ascendente</option>
          <option value="DESC">descendente</option>
        </select>
      </form>
    </div>-->
    <ul>
      <li v-for="unit in business" :key="unit.id">
        <router-link :to="{name: 'BusinessProfile', params: { id: unit.id_business}}">{{unit.name}}</router-link>
        <p>{{unit.vote_average}}</p>
        <p>Total de votos: {{unit.total_votes}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  data() {
    return {
      business: [],
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    /*async query() {
      try {
        const firstSelect = document.getElementById("orderBy");
        const orderBy = firstSelect.options[firstSelect.selectedIndex].value;
        const secondSelect = document.getElementById("direction");
        const direction =
          secondSelect.options[secondSelect.selectedIndex].value;
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        console.log(orderBy, direction);
        const response = await axios.get(
          "http://localhost:3000/admin/" +
            getIdToken(token) +
            "/business-to-activate/",
          {
            params: {
              order: orderBy,
              direction: direction,
            },
          }
        );
        this.business = response.data.data;
        console.log(this.business);
      } catch (error) {
        console.log(error);
      }
    },*/
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" +
            getIdToken(token) +
            "/business_bad_reviews"
        );
        this.business = response.data.data;
        console.log(this.business);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getBusiness();
  },
};
</script>
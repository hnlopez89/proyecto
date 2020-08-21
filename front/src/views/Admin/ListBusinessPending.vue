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
    <listBusiness :businesses="business" />
  </div>
</template>

<script>
import listBusiness from "@/components/ListBusinessPendingComp.vue";
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "ListBusinessPending",
  components: {
    listBusiness,
  },
  data() {
    return {
      business: [],
      profile_picture: "",
      name: "",
      city: "",
      category: "",
      hours: "",
      minutes: "",
      units: "",
      date: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async queryByDefault() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" +
            getIdToken(token) +
            "/business-to-activate/"
        );
        this.business = response.data.data;
        console.log(this.business);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.queryByDefault();
  },
};
</script>
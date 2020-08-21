<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <form action id="query">
      <input type="text" v-model="idBusiness" placeholder="Id del negocio" />
      <label>Categoría:</label>
      <select v-model="category">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERIA">Peluquería</option>
      </select>
      <label>Ciudad:</label>
      <input v-model="city" type="text" placeholder="Ciudad Escogida" />
      <label>Nombre del negocio:</label>
      <input v-model="name" type="text" placeholder="Nombre del Establecimiento" />
      <select v-model="status">
        <option value="ACTIVO">Activo</option>
        <option value="SIN_VALIDAR">Sin Validar</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="CERRADO">Cerrado</option>
        <option value="CERRADO_BY_ADMIN">Cerrado Por Admin</option>
      </select>
      <label>Ordenar por:</label>
      <select @click="query()" id="orderBy">
        <option value="idBusiness">ID</option>
        <option value="city">Ciudad</option>
        <option value="name">Nombre del establecimiento</option>
        <option value="category">Categoria del establecimiento</option>
      </select>
      <label>Sentido:</label>
      <select @click="query()" id="direction">
        <option value="ASC">ascendente</option>
        <option value="DESC">descendente</option>
      </select>
      <button @click="query()">Buscar negocios</button>
    </form>
    <div>
      <ul>
        <li v-for="unit in business" :key="unit.id">
          <p>{{unit.id}}</p>
          <img :src="unit.profilePicture" />
          <p>
            <router-link :to="{name: 'CheckBusiness', params: { id: unit.id}}">{{unit.name}}</router-link>
          </p>
          <img :src="getProfilePicture(unit.profile_picture) " alt />
          <p>{{unit.city}}</p>
          <p>{{unit.category}}</p>
          <p>{{unit.status}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "ListBusinessPending",
  data() {
    return {
      business: [],
      name: "",
      city: "",
      category: "",
      idBusiness: "",
      status: "",
    };
  },
  methods: {
    getProfilePicture(picture) {
      if (picture !== null && picture !== "") {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    goBack() {
      window.history.back();
    },
    async query() {
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
          "http://localhost:3000/admin/" + getIdToken(token) + "/business",
          {
            params: {
              idBusiness: this.idBusiness,
              name: this.name,
              city: this.city,
              category: this.category,
              status: this.status,
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
    },
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" + getIdToken(token) + "/business"
        );
        this.business = response.data.data;
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
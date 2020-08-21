<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <form action id="query">
      <input type="text" v-model="idUser" placeholder="Id del Usuario" />
      <input v-model="name" type="text" placeholder="Nombre del Usuario" />
      <input v-model="surname" type="text" placeholder="Apellido del Usuario" />
      <input v-model="city" type="text" placeholder="Ciudad Escogida" />
      <label>Estado del usuario:</label>
      <select v-model="active">
        <option value="1">Activado</option>
        <option value="0">Desactivado</option>
      </select>
      <label>Ordenar por:</label>
      <select @click="query()" id="orderBy">
        <option value="idUser">ID</option>
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

    <ul>
      <li v-for="user in users" :key="user.id">
        <h4>
          <router-link :to="{name: 'CheckUser', params: { id: user.id}}">{{user.name}}</router-link>
        </h4>
        <p>{{user.id}}</p>
        <p>{{user.surname}}</p>
        <p>{{user.city}}</p>
        <p>{{user.active}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "ListBusinessPending",
  data() {
    return {
      users: [],
      idUser: "",
      name: "",
      surname: "",
      city: "",
      status: "",
    };
  },
  methods: {
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
          "http://localhost:3000/admin/" + getIdToken(token) + "/users/",
          {
            params: {
              idUser: this.idUser,
              name: this.name,
              surname: this.surname,
              city: this.city,
              active: this.active,
              order: orderBy,
              direction: direction,
            },
          }
        );
        this.users = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getUsers() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/admin/" + getIdToken(token) + "/users"
        );
        this.users = response.data.data;
        console.log(this.users);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
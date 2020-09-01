<template>
  <div class="ListUsers">
    <h1>REGISTRO DE USUARIOS</h1>
    <button @click="goBack()">Go Back</button>
    <fieldset action id="query">
      <input type="text" v-model="idUser" placeholder="Id del Usuario" />
      <input v-model="name" type="text" placeholder="Nombre del Usuario" />
      <input v-model="surname" type="text" placeholder="Apellido del Usuario" />
      <input v-model="city" type="text" placeholder="Ciudad Escogida" />
      <label>Estado del usuario:</label>
      <select v-model="active">
        <option value="1">Activado</option>
        <option value="0">Desactivado</option>
      </select>
      <button @click="query()">Buscar negocios</button>
    </fieldset>
    <form id="ordered">
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
    </form>

    <table class="table">
      <thead>
        <tr>
          <th>ID de usuario</th>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Ciudad</th>
          <th>Estado del usuario</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in showedUsers" :key="user.id">
          <td>
            <router-link :to="{name: 'CheckUser', params: { id: user.id}}">{{user.id}}</router-link>
          </td>
          <td>{{user.name}}</td>
          <td>{{user.surname}}</td>
          <td>{{user.city}}</td>
          <td>{{user.active | yesno}}</td>
        </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': currentPage === 0}">
          <button class="page-link" @click="previousPage">Anterior</button>
        </li>

        <li
          v-for="page in pages"
          :key="page"
          class="page-item"
          :class="{'active': currentPage === page}"
        >
          <button class="page-link" @click="goToPage(page)">{{ page + 1 }}</button>
        </li>

        <li class="page-item" :class="{'disabled': currentPage === pages.length - 1}">
          <button class="page-link" @click="nextPage">Siguiente</button>
        </li>
      </ul>
    </nav>
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
      active: "",
      currentIndex: 0,
      elementsPerPage: 20,
      currentPage: 0,
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
      } catch (error) {
        console.log(error);
      }
    },
    previousPage() {
      this.currentPage = this.currentPage - 1;
      this.currentIndex = this.currentIndex - this.elementsPerPage;
    },
    nextPage() {
      this.currentPage = this.currentPage + 1;
      this.currentIndex = this.currentIndex + this.elementsPerPage;
    },
    goToPage(page) {
      this.currentPage = page;
      this.currentIndex = page * this.elementsPerPage;
    },
  },
  computed: {
    showedUsers() {
      return this.users.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(this.users.length / this.elementsPerPage);
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      return pageArray;
    },
  },
  created() {
    this.getUsers();
  },
};
</script>

<style scoped>
.ListUsers {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  min-height: 100vh;
}

#ordered {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 30rem;
  margin: auto;
  justify-content: space-evenly;
}
#ordered > label {
  color: coral;
  margin: auto;
  margin-right: 0.1rem;
}

.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0;
}

li {
  list-style: none;
}

button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 0.5rem;
}

fieldset {
  padding: 1rem;
  padding-top: 2rem;
  margin: 1rem auto;
  border-radius: 1rem;
  width: 12rem;
  background-color: rgba(24, 9, 4, 0.8);
  height: 13.5rem;
  justify-items: center;
}

select {
  position: center;
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
  width: 10rem;
}

input {
  width: 12rem;
  margin-bottom: 0.3rem;
  border-radius: 5px;
  border: 0;
}

label {
  color: white;
  display: inline-block;
  margin-top: 0.5rem;
}

table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 90%;
  text-align: left;
  border-collapse: collapse;
  margin: 1rem auto;
}

table td,
table th {
  border: 1px solid #aaaaaa;
  padding: 3px 2px;
}
table td,
table th {
  border: 1px solid #aaaaaa;
  padding: 3px 2px;
}
table tbody td {
  font-size: 13px;
}
table tr:nth-child(even) {
  background: #e9bb80;
}
table thead {
  background: coral;
  background: -moz-linear-gradient(top, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  background: -webkit-linear-gradient(
    top,
    #fe906a 0%,
    #fe794c 66%,
    #fe6b39 100%
  );
  background: linear-gradient(to bottom, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  border-bottom: 2px solid #444444;
}
table thead th {
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border-left: 2px solid #444444;
}
table thead th:first-child {
  border-left: none;
}

table tfoot {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background: #fe6b39;
  background: -moz-linear-gradient(top, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  background: -webkit-linear-gradient(
    top,
    #fe906a 0%,
    #fe794c 66%,
    #fe6b39 100%
  );
  background: linear-gradient(to bottom, #fe906a 0%, #fe794c 66%, #fe6b39 100%);
  border-top: 2px solid #444444;
}
table tfoot td {
  font-size: 14px;
}
table tfoot .links {
  text-align: right;
}
table tfoot .links a {
  display: inline-block;
  background: #ffffff;
  color: #fe6b39;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>
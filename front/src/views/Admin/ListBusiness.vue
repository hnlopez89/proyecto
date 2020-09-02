<template>
  <div class="ListBusiness">
    <h1>REGISTRO DE NEGOCIOS</h1>
    <button @click="goBack()">Go Back</button>
    <fieldset action id="query">
      <input type="text" v-model="idBusiness" placeholder="Id del negocio" />
      <input v-model="name" type="text" placeholder="Nombre del Establecimiento" />
      <input v-model="city" type="text" placeholder="Ciudad Escogida" />
      <label>Categoría:</label>
      <select v-model="category">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERIA">Peluquería</option>
      </select>
      <label>Estado:</label>
      <select v-model="status">
        <option value="ACTIVO">Activo</option>
        <option value="SIN_VALIDAR">Sin Validar</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="CERRADO">Cerrado</option>
        <option value="CERRADO_BY_ADMIN">Cerrado Por Admin</option>
      </select>
      <button @click="query()">Buscar negocios</button>
    </fieldset>
    <form id="ordered">
      <label>Ordenar por:</label>
      <select @click="query()" id="orderBy">
        <option value="idBusiness">ID</option>
        <option value="city">Ciudad</option>
        <option value="name">Nombre</option>
        <option value="category">Categoria</option>
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
          <th>ID del negocio</th>
          <th>Nombre</th>
          <th>Ciudad</th>
          <th>Categoría</th>
          <th>Estado del negocio</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="unit in showedBusiness" :key="unit.id">
          <td data-label="ID del negocio">
            <router-link :to="{name: 'CheckBusiness', params: { id: unit.id}}">{{unit.id}}</router-link>
          </td>
          <td data-label="Nombre">{{unit.name}}</td>
          <td data-label="Ciudad">{{unit.city}}</td>
          <td data-label="Categoría">{{unit.category}}</td>
          <td data-label="Estado del negocio">{{unit.status}}</td>
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
  name: "ListBusiness",
  data() {
    return {
      business: [],
      name: "",
      city: "",
      category: "",
      idBusiness: "",
      status: "",
      currentIndex: 0,
      elementsPerPage: 20,
      currentPage: 0,
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
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
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
    showedBusiness() {
      return this.business.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(
        this.business.length / this.elementsPerPage
      );
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      return pageArray;
    },
  },
  created() {
    this.getBusiness();
  },
};
</script>
<style scoped>
.ListBusiness {
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
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
  padding-bottom: 1rem;
}

li > button {
  margin: 0.5rem;
}

li {
  list-style: none;
}

h1 {
  margin-top: 0;
  padding-top: 1rem;
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
  margin-top: 1rem;
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
  width: 100%;
}
table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
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

@media screen and (max-width: 1000px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>
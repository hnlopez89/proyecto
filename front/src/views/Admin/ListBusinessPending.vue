<template>
  <div class="ListBusinessPending">
    <button @click="goBack()">Go Back</button>

    <h1>NEGOCIOS PENDIENTES DE ACTIVACIÓN</h1>

    <!--<div>
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

    </div>-->
    <form id="ordered">
      <label>Ordenar por:</label>
      <select @click="query()" id="orderBy">
        <option value="name">Nombre</option>
        <option value="id">ID</option>
        <option value="category">Categoría</option>
        <option value="city">Ciudad</option>
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
        <tr v-for="unit in business" :key="unit.id">
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
    async query() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
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
    },
  },
  created() {
    this.queryByDefault();
  },
};
</script>

<style scoped>
#ordered {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 30rem;
  margin: auto;
  justify-content: space-evenly;
  margin-bottom: 2rem;
}
#ordered > label {
  color: coral;
  margin: auto;
  margin-right: 0.1rem;
}

.ListBusinessPending {
  min-height: 100vh;
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
}

h1 {
  margin-bottom: 3rem;
}

select {
  position: center;
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
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
  margin-top: 0.5rem;
}

table {
  border: 1px solid coral;
  background-color: #eeeeee;
  width: 80%;
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
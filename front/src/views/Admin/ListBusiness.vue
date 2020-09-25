<template>
  <div class="ListBusiness">
    <button id="up" @click="goBack()">Volver</button>
    <h1>REGISTRO DE NEGOCIOS</h1>
    <fieldset action id="query">
      <input type="text" v-model="idBusiness" placeholder="Id del negocio" />
      <input v-model="name" type="text" placeholder="Nombre del Establecimiento" />
      <label>Provincia</label>
      <select v-model="province" id="provincia">
        <option value="Alava">Álava</option>
        <option value="Albacete">Albacete</option>
        <option value="Alicante">Alicante/Alacant</option>
        <option value="Almeria">Almería</option>
        <option value="Asturias">Asturias</option>
        <option value="Avila">Ávila</option>
        <option value="Badajoz">Badajoz</option>
        <option value="Barcelona">Barcelona</option>
        <option value="Burgos">Burgos</option>
        <option value="Caceres">Cáceres</option>
        <option value="Cadiz">Cádiz</option>
        <option value="Cantabria">Cantabria</option>
        <option value="Castellon">Castellón/Castelló</option>
        <option value="Ceuta">Ceuta</option>
        <option value="Ciudad_real">Ciudad Real</option>
        <option value="Cordoba">Córdoba</option>
        <option value="Cuenca">Cuenca</option>
        <option value="Girona">Girona</option>
        <option value="Granada">Granada</option>
        <option value="Guadalajara">Guadalajara</option>
        <option value="Guipuzcoa">Guipúzcoa</option>
        <option value="Huelva">Huelva</option>
        <option value="Huesca">Huesca</option>
        <option value="Islas_Baleares">Islas Balears</option>
        <option value="Jaen">Jaén</option>
        <option value="La_coruña">La Coruña</option>
        <option value="La_rioja">La Rioja</option>
        <option value="Las_palmas">Las Palmas</option>
        <option value="Leon">León</option>
        <option value="Lleida">Lleida</option>
        <option value="Lugo">Lugo</option>
        <option value="Madrid">Madrid</option>
        <option value="Malaga">Málaga</option>
        <option value="Melilla">Melilla</option>
        <option value="Murcia">Murcia</option>
        <option value="Navarra">Navarra</option>
        <option value="Ourense">Ourense</option>
        <option value="Palencia">Palencia</option>
        <option value="Pontevedra">Pontevedra</option>
        <option value="Salamanca">Salamanca</option>
        <option value="Segovia">Segovia</option>
        <option value="Sevilla">Sevilla</option>
        <option value="Soria">Soria</option>
        <option value="Tarragona">Tarragona</option>
        <option value="Santa_cruz_de_Tenerife">Santa Cruz de Tenerife</option>
        <option value="Teruel">Teruel</option>
        <option value="Toledo">Toledo</option>
        <option value="Valencia">Valencia</option>
        <option value="Valladolid">Valladolid</option>
        <option value="Vizcaya">Vizcaya</option>
        <option value="Zamora">Zamora</option>
        <option value="Zaragoza">Zaragoza</option>
      </select>
      <label>Categoría:</label>
      <select v-model="category">
        <option value="TERRAZA">Terraza</option>
        <option value="BAR">Bar</option>
        <option value="RESTAURANTE">Restaurante</option>
        <option value="PELUQUERÍA">Peluquería</option>
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
        <option value="province">Provincia</option>
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
          <th>Provincia</th>
          <th>Categoría</th>
          <th>Estado del negocio</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="unit in showedBusiness" :key="unit.id">
          <td data-label="ID del negocio">
            <router-link
              :to="{name: 'CheckBusiness', params: { id: unit.id}, hash: '#up'}"
            >{{unit.id}}</router-link>
          </td>
          <td data-label="Nombre">{{unit.name}}</td>
          <td data-label="Provincia">{{unit.province | underscore | underscore | underscore}}</td>
          <td data-label="Categoría">{{unit.category | lowcase}}</td>
          <td data-label="Estado del negocio">{{unit.status | lowcase }}</td>
        </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': currentPage -5 <= 0}">
          <button class="page-link" @click="firstPage"><<</button>
        </li>
        <li class="page-item" :class="{'disabled': currentPage === 0}">
          <button class="page-link" @click="previousPage"><</button>
        </li>

        <li v-for="page in pages" :key="page" class="page-item">
          <button class="page-link" @click="goToPage(page)">{{ page + 1 }}</button>
        </li>

        <li class="page-item" :class="{'disabled': currentPage >= numberOfPages}">
          <button class="page-link" @click="nextPage">></button>
        </li>
        <li class="page-item" :class="{'disabled': currentPage >= numberOfPages - 4 }">
          <button class="page-link" @click="lastPage">>></button>
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
      province: "",
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
        console.log(this.category);
        const response = await axios.get(
          "http://localhost:3000/admin/" + getIdToken(token) + "/business",
          {
            params: {
              idBusiness: this.idBusiness,
              name: this.name,
              province: this.province,
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
    firstPage() {
      this.currentPage = 0;
      this.currentIndex = this.currentPage * this.elementsPerPage;
    },
    lastPage() {
      let numberOfPages = Math.ceil(this.booking.length / this.elementsPerPage);
      this.currentPage = numberOfPages - 1;
      this.currentIndex = this.currentPage * this.elementsPerPage;
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
      this.numberOfPages = numberOfPages - 1;

      for (let i = this.currentPage - 5; i < this.currentPage + 5; i++) {
        if (i >= 0 && i < numberOfPages) {
          pageArray.push(i);
        }
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
.disabled {
  display: none;
}
.ListBusiness {
  min-height: 100vh;
  background: linear-gradient(
      rgba(241, 253, 254, 0.8),
      rgba(241, 253, 254, 0.8)
    ),
    url(../../assets/brick.jpeg);
}

#ordered {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 33rem;
  margin: auto;
  justify-content: space-evenly;
}
#ordered > label {
  color: coral;
  margin: auto;
  margin-right: 0.1rem;
  font-weight: bold;
}
#ordered > select {
  background-color: white;
}

.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0;
  padding-bottom: 1rem;
}

li {
  list-style: none;
}
a {
  text-decoration: none;
  color: black;
}

button {
  display: inline-block;
  padding: 0.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem 0;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

fieldset {
  padding: 1rem;
  padding-top: 2rem;
  margin: 1rem auto;
  border-radius: 1rem;
  width: 12rem;
  background-color: rgba(24, 9, 4, 0.8);
  height: 15.5rem;
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
  width: 60%;
  margin: auto;
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
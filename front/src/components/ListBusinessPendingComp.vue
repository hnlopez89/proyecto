<template>
  <div>
    <ul>
      <!-- ESCOGEMOS VALORES DEL ARRAY DEL COMPONENTE -->
      <li v-for="business in businesses" :key="business.id">
        <h4>
          <router-link
            :to="{name: 'CheckBusiness', params: { id: business.id}, hash: '#up'}"
          >{{business.name}}</router-link>
        </h4>
        <p id="category">Categoría: {{business.category | lowcase}}</p>
        <p>Id:{{business.id}}</p>
        <p>Provincia: {{business.province | underscore}}</p>
        <p>Abre de {{business.opening_time}}:00 a {{business.closing_time}}:00</p>
      </li>
    </ul>
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
import { orderBy } from "lodash";

export default {
  name: "ListBusiness",
  filters: {
    showEmpty(value) {
      if (value === "") {
        return "-";
      }
      return value;
    },
  },
  props: {
    businesses: Array,
    currentIndex: 0,
    elementsPerPage: 5,
    currentPage: 0,
    sortName: 0,
  },

  data() {
    return {
      business: [],
    };
  },
  computed: {
    showedUser() {
      let slice = this.businesses;
      if (this.sortName !== 0) {
        if (this.sortName > 0) {
          slice = orderBy(slice, ["username"], ["asc"]);
        } else {
          slice = orderBy(slice, ["username"], ["desc"]);
        }
      }

      return slice.slice(
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
  methods: {
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
    changeSort() {
      switch (this.sortName) {
        case 0:
          this.sortName = 1;
          break;
        case 1:
          this.sortName = -1;
          break;
        case -1:
          this.sortName = 0;
          break;
      }
    },
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
</style>
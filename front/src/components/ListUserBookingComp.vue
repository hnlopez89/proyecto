<template>
  <div>
    <ul>
      <li v-for="data in showedBookings" :key="data.id">
        <h3>
          <router-link
            :to="{name: 'BusinessProfile', params: {id: data.id_business}, hash: '#up'}"
          >{{data.name}}</router-link>
        </h3>
        <p>
          <b>ID reserva:</b>
          {{data.id}}
        </p>
        <p>
          <b>Estado de la reserva:</b>
          <span
            :class="{red: data.status === 'PENDIENTE_DE_PAGO' ||data.status === 'CANCELADO' || data.status === 'NO_SHOW' ,
            green: data.status === 'CONFIRMADO' || data.status === 'MODIFICADO', 
            yellow: data.status === 'CHECK_IN' || data.status === 'CHECK_OUT'}"
          >{{data.status}}</span>
        </p>
        <p>
          <b>Provincia:</b>
          {{data.province | underscore}}
        </p>
        <p>
          <b>Categoría:</b>
          {{data.category | lowcase}}
        </p>
        <p>
          <b>Día de check-in:</b>
          {{formatDate(data.check_in_day)}}
        </p>
        <p>
          <b>Hora de llegada:</b>
          {{formatDateTime(data.check_in_time)}}
        </p>
        <p>
          <b>Hora de llegada:</b>
          {{formatDateTime(data.check_out_time)}}
        </p>
        <p>
          <b>Plazas reservadas:</b>
          {{data.units}}
        </p>
        <router-link :to="{ name: 'BookingUser', params: {id: data.id}}" tag="button">Ver tu reserva</router-link>
      </li>
    </ul>
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
import { format } from "date-fns";
import axios from "axios";
import { getIdToken } from "../utils";

export default {
  name: "GetUserBooking",
  props: {
    booking: Array,
  },
  data() {
    return {
      currentIndex: 0,
      elementsPerPage: 12,
      currentPage: 0,
    };
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    formatDateTime(datetime) {
      return format(new Date(datetime), "HH:mm");
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
    showedBookings() {
      return this.booking.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(this.booking.length / this.elementsPerPage);
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
};
</script>

<style scoped>
h3 {
  margin-top: 0.2rem;
  text-align: center;
}
.disabled {
  display: none;
}

.red {
  color: red;
  font-weight: bold;
}

.green {
  color: green;
  font-weight: bold;
}

.yellow {
  color: yellow;
  font-weight: bold;
}

ul {
  padding: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
}
li {
  text-align: left;
  list-style: none;
  border-radius: 1rem;
  border: 0.1rem solid coral;
  margin: 1rem 0;
  padding: 1rem;
  width: 18rem;
}
a {
  color: coral;
  text-decoration: none;
}

button {
  padding: 0.5rem;
  border: 0.1rem solid coral;
  border-radius: 0;
  box-sizing: border-box;
  font-weight: bolder;
  background-color: black;
  color: coral;
  text-align: center;
  position: relative;
  left: 30%;
  margin: 0;
}
button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0;
  padding-bottom: 1rem;
}

.pagination > li {
  width: auto;
  padding: 0;
  border: 0;
}

@media (min-width: 1000px) {
  ul {
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }
}
</style>
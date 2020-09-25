<template>
  <div>
    <ul id="listBusiness">
      <!-- ESCOGEMOS VALORES DEL ARRAY DEL COMPONENTE -->
      <li v-for="business  in showedUser" :key="business.id">
        <img
          v-if="business.category === 'TERRAZA'"
          :class="{hide: business.profile_picture !== null}"
          src="../assets/TERRAZA.jpg"
          height="100"
        />
        <img
          v-else-if="business.category === 'BAR'"
          :class="{hide: business.profile_picture !== null}"
          src="../assets/BAR.jpg"
          height="100"
        />
        <img
          v-else-if="business.category === 'RESTAURANTE'"
          :class="{hide: business.profile_picture !== null}"
          src="../assets/RESTAURANTE.jpg"
          height="100"
        />
        <img
          v-else-if="business.category === 'PELUQUERÍA'"
          :class="{hide: business.profile_picture !== null}"
          src="../assets/PELUQUERIA.jpg"
          height="100"
        />
        <img
          :class="{hide: business.profile_picture === null }"
          :src="getProfilePicture(business.profile_picture)"
          height="200"
        />
        <article>
          <section id="description">
            <div id="title">
              <h1>
                <router-link
                  :to="{name: 'BusinessProfile', params: { id: business.id}, 
                  query:{date: selectedDate, hours: selectedHour, minutes: selectedMinute, units: selectedUnit}, hash: '#up'} "
                >{{business.name}}</router-link>
              </h1>
              <div id="rating">
                <star-rating
                  :rating="Number(business.vote_average)"
                  read-only
                  :increment="0.5"
                  :fixed-point="1.8"
                  :star-size="20"
                  :inline="true"
                  :show-rating="false"
                ></star-rating>
                <p>{{business.total_votes}} Opiniones</p>
              </div>
            </div>
            <p>
              <b>Categoría:</b>
              {{business.category | lowcase}}
            </p>
            <p>
              <b>Provincia:</b>
              {{business.province | underscore}}
            </p>
            <p>
              <b>Horario:</b>
              Abre de {{business.opening_time}}:00 a {{business.closing_time}}:00
            </p>
          </section>
          <section id="action">
            <router-link
              tag="button"
              :to="{name: 'BusinessProfile', params: { id: business.id}, 
                  query:{date: selectedDate, hours: selectedHour, minutes: selectedMinute, units: selectedUnit}, hash: '#up'} "
            >Ver establecimiento</router-link>
          </section>
        </article>
      </li>
    </ul>
    <nav v-if="businesses.length > 5">
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
import { orderBy } from "lodash";
import axios from "axios";

export default {
  name: "ListBusinessComp",
  data() {
    return {
      cvcCode: "",
      expiryMonth: "",
      expiryYear: "",
      holderName: "",
      showBooking: "",
      creditCardNumber: "",
      picture: "",
      currentIndex: 0,
      elementsPerPage: 15,
      currentPage: 0,
      sortName: 0,
      numberOfPages: "",
    };
  },
  props: {
    businesses: Array,
    selectedDate: String,
    selectedHour: String,
    selectedMinute: String,
    selectedUnit: String,
  },
  filters: {
    showEmpty(value) {
      if (value === "") {
        return "-";
      }
      return value;
    },
  },
  methods: {
    async passData(index) {
      let bookingData = {
        idBusiness: this.businesses[index].id,
        cvcCode: this.cvcCode,
        expiryMonth: this.expiryMonth,
        expiryYear: this.expiryYear,
        holderName: this.holderName,
        creditCardNumber: this.creditCardNumber,
      };
      this.$emit("data", bookingData);
    },
    toggleBooking() {
      this.showBooking = !this.showBooking;
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
      let numberOfPages = Math.ceil(
        this.businesses.length / this.elementsPerPage
      );
      this.currentPage = numberOfPages - 1;
      this.currentIndex = this.currentPage * this.elementsPerPage;
    },
  },
  computed: {
    showedUser() {
      return this.businesses.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(
        this.businesses.length / this.elementsPerPage
      );
      this.numberOfPages = numberOfPages - 1;

      let pageArray = [];
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
.disabled {
  display: none;
}
* {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
}
li {
  display: flex;
  flex-direction: row;

  padding: 0.5rem;

  border: solid 0.1rem coral;
  border-radius: 1rem;
  margin: 0.5rem 0.1rem;
  background-color: white;
}
.hide {
  display: none;
}

li > img {
  object-fit: cover;
  max-width: 35%;
  height: 8rem;
  margin-right: 1rem;
  border-radius: 1rem;
}
a {
  font-size: 1rem;
  text-decoration: none;
}

li > article p {
  padding: 0;
  font-size: 0.6rem;
  text-align: left;
}
#description {
  margin-bottom: 1rem;
}

button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid black;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: coral;
  color: white;
  text-align: center;
  margin: 1rem;
  padding: 0.65rem;
  width: 12rem;
}

ul.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: auto;
  height: 5rem;
  padding: 0;
  margin-bottom: 1rem;
}

ul.pagination > li {
  border: none;
  margin: 0;
  padding: 0;
}

ul.pagination > li button {
  display: inline-block;
  padding: 0.5rem;
  border: 0.1rem solid coral;
  border-radius: 0;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: white;
  text-align: center;
  margin: 0;
  width: auto;
}

ul.pagination > li button:hover {
  background-color: coral;
}

@media (min-width: 700px) {
  #listBusiness {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
  }
  #listBusiness > li {
    width: 40rem;
    height: 12rem;
  }
  li > img {
    object-fit: cover;
    max-width: 30%;
    height: 12rem;
    margin-right: 1rem;
  }
  li > article p {
    font-size: 0.9rem;
    text-align: left;
    margin: 0.3rem;
  }
  a {
    font-size: 1.3rem;
    text-align: left;
    color: coral;
  }
  article {
    width: 100%;
  }
  #title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0.3rem 0.3rem 0 0;
  }
}
</style>
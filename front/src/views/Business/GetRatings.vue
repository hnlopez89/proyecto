<template>
  <div class="GetRating">
    <button id="up" @click="goBack()">Volver</button>
    <h1>{{summary.name}}</h1>
    <ul id="summary">
      <li>
        <b>Puntuación Total:</b>
        <star-rating
          read-only
          :rating="Number(summary.vote_average)"
          :increment="0.5"
          :fixed-point="1.8"
          :star-size="20"
          :inline="true"
          :show-rating="false"
        ></star-rating>
      </li>
      <li>
        <b>Número de opiniones:</b>
        {{summary.count}}
      </li>
    </ul>
    <ul id="ratings">
      <li v-for="rating in showedRatings" :key="rating.id">
        <p>
          <star-rating
            read-only
            :rating="Number(rating.rating)"
            :increment="0.5"
            :fixed-point="1.8"
            :star-size="20"
            :inline="true"
            :show-rating="false"
          ></star-rating>
        </p>
        <p>
          <b>Cliente:</b>
          {{rating.name}}
        </p>
        <p>
          <b>Día de la reserva:</b>
          {{formatDateTime(rating.check_in_time)}}
        </p>
        <p>
          <b>Opinion:</b>
          {{rating.rating_description}}
        </p>
        <p v-show="rating.rating_answer">
          <b>Respuesta:</b>
          {{rating.rating_answer}}
        </p>
        <router-link
          tag="button"
          v-show="rating.id_business === business.id"
          :to="{name: 'BookingBusiness', params: { id: rating.id}, hash: '#up'}"
        >Ver Reserva</router-link>
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
import { getIdToken } from "../../utils";

export default {
  name: "GetRatings",
  components: {},
  data() {
    return {
      ratings: [],
      summary: [],
      business: [],
      currentIndex: 0,
      elementsPerPage: 10,
      currentPage: 0,
      numberOfPages: "",
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    formatDateTime(datetime) {
      return format(new Date(datetime), "dd/MM/yyyy HH:mm");
    },
    async getBusinessRatings() {
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" +
            this.$route.params.id +
            "/profile/rating"
        );
        this.summary = response.data.summary[0];
        this.ratings = response.data.data;
      } catch (error) {
        console.log(error.response);
      }
    },
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" + getIdToken(token)
        );
        this.business = response.data.data[0];
        console.log(this.business.id);
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
    firstPage() {
      this.currentPage = 0;
      this.currentIndex = this.currentPage * this.elementsPerPage;
    },
    lastPage() {
      let numberOfPages = Math.ceil(this.ratings.length / this.elementsPerPage);
      this.currentPage = numberOfPages - 1;
      this.currentIndex = this.currentPage * this.elementsPerPage;
    },
  },
  computed: {
    showedRatings() {
      return this.ratings.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(this.ratings.length / this.elementsPerPage);
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

  created() {
    this.getBusinessRatings();
    this.getBusiness();
  },
};
</script>

<style scoped>
.GetRating {
  background: linear-gradient(
      rgba(241, 253, 254, 0.8),
      rgba(241, 253, 254, 0.5)
    ),
    url(../../assets/brick.jpeg);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin: auto;
  padding: 0.5rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  font-weight: bold;
  background-color: black;
  color: coral;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.pagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.pagination li > button {
  border: 0.1rem coral solid;
}

.disabled {
  display: none;
}

h1 {
  font-size: 1.8rem;
  color: white;
}

li {
  list-style: none;
  width: auto;
}
a {
  margin: auto;
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

#summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  background-color: black;
  color: white;
  padding: 1rem;
  width: auto;
  border-radius: 1rem;
  border: solid coral;
}

#summary > li {
  margin: 0.3rem;
}

#ratings {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  border: 0;
}

#ratings > li {
  background-color: white;
  padding: 1rem;
  margin: 1.5rem;
  border-radius: 1rem;
  border: solid coral;
  text-align: left;
  width: 15rem;
  height: auto;
}
#ratings > li > button {
  text-align: center;
  margin: auto;
}

#ratings > li > :first-child {
  text-align: center;
}

span {
  margin: 0.5rem;
}

b {
  color: coral;
  margin-right: 0.3rem;
}

#ratings > li p {
  margin: 0.2rem;
}

@media (min-width: 700px) {
  #ratings > li {
    width: 35rem;
  }
  #ratings {
    justify-content: space-evenly;
  }
}
</style>
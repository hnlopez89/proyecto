<template>
  <div class="GetRating">
    <button @click="goBack()">Volver</button>
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
      <li v-for="rating in ratings" :key="rating.id">
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
          {{rating.check_in_time}}
        </p>
        <p>
          <b>Opinion:</b>
          {{rating.rating_description}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      ratings: [],
      summary: [],
    };
  },

  methods: {
    goBack() {
      window.history.back();
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
        console.log(response);
        console.log(this.ratings);
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  created() {
    this.getBusinessRatings();
  },
};
</script>

<style scoped>
.GetRating {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 1.8rem;
  color: white;
}

li {
  list-style: none;
}

#summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  background-color: black;
  color: white;
  padding: 1rem;
  width: 18rem;
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
  #ratings {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
}
</style>
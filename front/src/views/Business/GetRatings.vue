<template>
  <div class="GetUser">
    <button @click="goBack()">Go Back</button>
    <h1>LA PUNTUACIÓN DE {{summary.name}}</h1>
    <h3>
      <ul>
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
    </h3>
    <ul>
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

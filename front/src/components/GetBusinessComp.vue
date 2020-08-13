<template>
  <div>
    <p>{{details.profile_picture}}</p>
    <h1>{{details.name}}</h1>
    <ul>
      <li>
        <b>Puntuación:</b>
        <star-rating
          read-only
          :rating="Number(details.vote_average)"
          :increment="0.5"
          :fixed-point="1.8"
          :star-size="20"
          :inline="true"
          :show-rating="false"
        ></star-rating>
      </li>
      <li>
        <b>Votos totales:</b>
        {{details.count}}
      </li>
      <router-link
        :to="{ name: 'BookingReviews', params: {id: details.id}}"
        tag="button"
      >Ver todas las puntuaciones</router-link>
    </ul>

    <p>{{details.category}}</p>
    <p>{{details.description}}</p>
    <p>{{details.city}}</p>
    <p>{{details.zip_code}}</p>
    <p>{{details.province}}</p>
    <p>{{details.line1}}</p>
    <p>{{details.line2}}</p>
    <p>{{details.opening_time}}</p>
    <p>{{details.closing_time}}</p>
    <p>{{pictures}}</p>
    <p>{{details.picture2}}</p>
    <p>{{details.picture3}}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GetBusiness",
  props: {
    pictures: Array,
    details: Object,
  },
};
</script>

<style scoped>
</style>
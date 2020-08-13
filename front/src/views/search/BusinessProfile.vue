<template>
  <div>
    <button @click="goBack()">Go Back</button>

    <getbusinesscomp :details="details" :pictures="pictures" />
    <!-- <input v-model="date" type="date" placeholder="Datetime" />
    <label for>Hora</label>
    <select v-model="hours" id="units">
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
    </select>
    <label for>Minutos</label>
    <select v-model="minutes" id="units">
      <option value="0">:00</option>
      <option value="30">:30</option>
    </select>
    <label for>Plazas</label>
    <select v-model="units" id="units">
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
    </select>
    <button @click="query()">Buscar</button>
    <button @click="button()">Reservar</button>-->
  </div>
</template>

<script>
import { getIdToken } from "../../utils";
import getbusinesscomp from "@/components/GetBusinessComp.vue";
import axios from "axios";

export default {
  name: "BusinessProfile",
  components: {
    getbusinesscomp,
  },
  data() {
    return {
      details: {},
      pictures: [],
      date: "",
      name: "",
      hours: "",
      minutes: "",
      units: "",
      availability: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async getBusiness() {
      try {
        const response = await axios.get(
          "http://localhost:3000/business/" + this.$route.params.id
        );
        this.details = response.data.data[0];
        this.pictures = [
          response.data.pictures[0].picture,
          response.data.pictures[1].picture,
          response.data.pictures[2].picture,
        ];
      } catch (error) {
        console.log(error);
      }
    },
    async query() {
      try {
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            name: this.name,
            date: this.date,
            units: this.units,
            hours: this.hours,
            minutes: this.minutes,
            order: orderBy,
            direction: direction,
          },
        });
        this.availability = response.data.status;
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async queryByDefault() {
      try {
        const response = await axios.get("http://localhost:3000/business", {
          params: {
            name: this.name,
            date: this.date,
            units: this.units,
            hours: this.hours,
            minutes: this.minutes,
          },
        });
        this.availability = response.data.status;
        console.log(availability);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async book() {
      let role = localStorage.getItem("ROLE");
      try {
        const response = await axios.create;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async book() {
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      if (token.length > 0) {
        await axios.get(
          "http://localhost:3000/user/" +
            getIdToken(token) +
            "business/" +
            this.$route.params.id +
            "/summary"
        );
      }
    },
  },
  created() {
    this.getBusiness();
    //  this.queryByDefault();
  },
};
</script>

<style>
</style>
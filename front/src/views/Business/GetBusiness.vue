<template>
  <div id="page">
    <h1>{{businesses.name}}</h1>
    <div class="Welcome">
      <ul id="rating">
        <h3>Puntuación:</h3>
        <li>
          <star-rating
            read-only
            :rating="Number(businesses.vote_average)"
            :increment="0.5"
            :fixed-point="1.8"
            :star-size="20"
            :inline="true"
            :show-rating="true"
          ></star-rating>
        </li>
        <li>
          <b>Votos Totales:</b>
          {{businesses.count}}
        </li>
        <li>
          <router-link
            :to="{name: 'BookingReviews', params: {id: businesses.id}}"
            tag="button"
          >Ver qué opinan de tí</router-link>
        </li>
      </ul>
      <ul id="boardBookings">
        <h3>Reservas</h3>
        <li>
          <router-link :to="{name: 'BookingBusinessToday'}" tag="button">¿Quien viene hoy?</router-link>
        </li>
        <li>
          <router-link :to="{name: 'BookingBusinessTomorrow'}" tag="button">¿Quien viene mañana?</router-link>
        </li>
        <li>
          <router-link :to="{name: 'BookingsBusiness'}" tag="button">Ver tus reservas</router-link>
        </li>
      </ul>
      <ul id="reports">
        <h3>Listados:</h3>
        <li>
          <router-link :to="{name: 'CheckAvailability'}" tag="button">Consulta tu disponibilidad</router-link>
        </li>
      </ul>

      <ul id="boardData">
        <h3>Datos de tu negocio</h3>
        <li>
          <router-link :to="{name: 'EditBusiness'}" tag="button">Editar tu negocio</router-link>
        </li>
        <li>
          <router-link :to="{name: 'EditPicturesBusiness'}" tag="button">Editar tus Fotos</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "GetBusiness",
  components: {},
  data() {
    return {
      businesses: [],
      explanation: false,
      reason: "",
      profilePicture: "",
    };
  },

  methods: {
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" + getIdToken(token)
        );
        console.log(response);
        this.businesses = response.data.data[0];
        this.profilePicture = response.data.data[0].profile_picture;
        if (this.profilePicture !== null) {
          this.profilePicture =
            process.env.VUE_APP_STATIC + this.profilePicture;
        }
        console.log(this.businesses.profile_picture);
      } catch (error) {
        console.log(error);
      }
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    async resign() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/user/" + getIdToken(token) + "/deactive",
          {
            resignReason: this.reason,
          }
        );
        axios.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("AUTH_TOKEN_KEY");
        localStorage.removeItem("ROLE");
        localStorage.removeItem("NAME");
        this.$router.push("/home");
        location.reload();
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
  created() {
    this.getBusiness();
  },
};
</script>

<style scoped>
#page {
  background-image: url(../../assets/workWithUs2.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.Welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

ul {
  background-color: rgba(40, 40, 40, 0.9);
  color: white;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  border-radius: 1rem;
  width: 18rem;
  height: 15rem;
  padding: 0;
}

li {
  list-style: none;
  padding: 0.5rem;
}

ul > li button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: coral;
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.5rem;
}

img {
  border-radius: 50%;
  border: solid black;
  margin: 2rem;
}

@media (min-width: 700px) {
  h1 {
    display: inline-block;
    padding: 1.5rem;
    margin: 2rem;
    border-radius: 2rem;
    background-color: rgba(240, 240, 240, 0.8);
  }
  #page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .Welcome {
    flex-direction: row;
    justify-items: auto;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  ul {
    margin: 3rem;
    height: 15rem;
  }
}

@media (min-width: 1000px) {
  ul {
    margin: 1rem;
    height: 25rem;
    width: 20rem;
    padding-top: 1.5rem;
  }

  li {
    margin: auto;
  }

  h3 {
  }

  ul > li button {
    display: inline-block;
    padding: 0.8rem 2rem;
    border: 0.1rem solid #ffffff;
    border-radius: 0.12em;
    box-sizing: border-box;
    font-weight: bolder;
    background-color: coral;
    color: #ffffff;
    text-align: center;
    margin: 1rem 0;
  }
}
</style>
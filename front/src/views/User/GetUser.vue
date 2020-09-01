<template>
  <div class="GetUser">
    <h1>PANEL DE CONTROL</h1>
    <div id="boardUserData">
      <img :src="picture" :class="{hide: user.picture === null }" />
      <img src="../../assets/default-user-avatar.jpg" :class="{hide: user.picture !== null }" />
      <ul>
        <h3>Tu perfil de usuario</h3>
        <li>
          <p>{{user.name}} {{user.surname}}</p>
        </li>
        <li>
          <router-link :to="{ name: 'EditUser'}" tag="button">Editar tu Perfil</router-link>
        </li>
        <li>
          <b>Tu última visita fue:</b>
          <p>{{formatDate(user.update_date)}}</p>
        </li>
      </ul>
    </div>
    <div v-show="adminWay" id="admin">
      <ul>
        <h3>Gestionar reservas:</h3>

        <li>
          <router-link
            :to="{ name: 'ListBookingsPending'}"
            tag="button"
          >Ver las reservas pendientes de pago</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ListBookings'}" tag="button">Ver todas las reservas</router-link>
        </li>
      </ul>
      <ul>
        <h3>Gestionar negocios:</h3>
        <li>
          <router-link
            :to="{ name: 'ListBusinessPending'}"
            tag="button"
          >Ver negocios pendientes de activar</router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'ListBusinessBadReviews'}"
            tag="button"
          >Ver negocios con malas puntuaciones</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ListBusiness'}" tag="button">Ver todos los negocios</router-link>
        </li>
      </ul>
      <ul>
        <h3>Gestionar usuarios:</h3>
        <li>
          <router-link :to="{ name: 'ListUsers'}" tag="button">Ver todos los usuarios</router-link>
        </li>
      </ul>
    </div>
    <ul v-show="!adminWay" id="boardUserBookings">
      <h3>Tu sección de reservas</h3>
      <li>
        <router-link :to="{ name: 'BookingUserHistoric'}" tag="button">Ver tus reservas pasadas</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'BookingsUser'}" tag="button">Ver todas tus reservas</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'BookingUserConfirmed'}" tag="button">Ver tus reservas futuras</router-link>
      </li>
    </ul>
    <!--  <div v-show="!adminWay">
      <p>¿Te quieres dar de baja con nosotros?</p>
      <p>¿De verdad?</p>
      <button v-show="!adminWay" @click="toggleResign()">Darte de baja</button>
      <form v-show="explanation">
        <input v-model="reason" type="text" placeholder="¿Porqué quieres darte de baja?" />
        <button @click="resign()">Confirmar darte de baja</button>
      </form>
    </div>-->
  </div>
</template>

<script>
import axios from "axios";
import { getIdToken, checkIsAdminUser } from "../../utils";
import { format } from "date-fns";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      user: [],
      idCliente: "",
      explanation: false,
      reason: "",
      adminWay: false,
      picture: "",
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    adminWayFunction() {
      this.adminWay = checkIsAdminUser();
    },
    async getUser() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/user/" + getIdToken(token)
        );
        this.user = response.data.data[0];
        this.picture = response.data.data[0].picture;
        if (this.picture !== null) {
          this.picture = process.env.VUE_APP_STATIC + this.picture;
        }
      } catch (error) {
        console.log(error);
      }
    },
    toggleResign() {
      this.explanation = true;
    },
    /* async resign() {
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
    },*/
  },
  created() {
    this.getUser();
    this.adminWayFunction();
  },
};
</script>

<style scoped>
.GetUser {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  padding: 1rem;
  min-height: 100vh;
}

img {
  height: 15rem;
  border-radius: 20rem;
  border: solid white;
}

#admin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

#boardUserData {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  border-radius: 1rem;
}

#boardUserData > ul {
  background-color: rgba(240, 240, 240, 0.8);
  color: black;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  border-radius: 1rem;
}

#boardUserData > ul li button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem 0 2rem;
}

#boardUserData > ul li p {
  margin-top: 0;
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
  height: 13rem;
  margin: 1rem;
  padding: 1rem;
}
li {
  list-style: none;
}

#boardUserBookings {
  margin: auto;
}

#boardUserBookings > li button {
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: coral;
  color: #ffffff;
  text-align: center;
  margin: 1rem;
}

h3 {
  margin-top: 0rem;
}
#admin > ul li button {
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: coral;
  color: #ffffff;
  text-align: center;
  margin: 0.5rem;
}

.hide {
  display: none;
}
@media (min-width: 700px) {
  #boardUserData {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 8rem;
  }
  .GetUser {
    background-image: url(../../assets/dashboard.jpeg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  h1 {
    color: white;
    margin-top: 0;
    padding-top: 1rem;
    margin-bottom: 5rem;
  }

  #admin {
    flex-direction: row;
    justify-items: auto;
    justify-content: space-around;
    flex-wrap: wrap;
  }
}
</style>
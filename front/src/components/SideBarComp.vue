<template>
  <nav class="burger">
    <ul id="sidebar" v-if="businessWay">
      <li>
        <router-link :to="{name: 'Home', hash: '#up'}">Inicio</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'GetBusiness', hash: '#up'}">Mi negocio</router-link>
      </li>
      <li @click="isBookings =! isBookings">Reservas</li>
      <ul v-if="isBookings" id="bookings" class="secondary">
        <li>
          <router-link :to="{name: 'BookingBusinessToday', hash: '#up'}">Hoy</router-link>
        </li>
        <li>
          <router-link :to="{name: 'BookingBusinessTomorrow', hash: '#up'}">Mañana</router-link>
        </li>
        <li>
          <router-link :to="{name: 'BookingsBusiness', hash: '#up'}">Buscador</router-link>
        </li>
      </ul>
      <li @click="isEdit =! isEdit">Ajustes</li>

      <ul v-if="isEdit" id="edit" class="secondary">
        <li>
          <router-link :to="{name: 'EditBusiness', hash: '#up'}">Tus Datos</router-link>
        </li>
        <li>
          <router-link :to="{name: 'EditPicturesBusiness', hash: '#up'}">Tus Fotos</router-link>
        </li>
      </ul>
      <li @click="logoutBusiness">Cerrar Sesión</li>
    </ul>
    <ul id="sidebar" v-if="adminWay">
      <li>
        <router-link :to="{name: 'Home', hash: '#up'}">Inicio</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'GetUser', hash: '#up'}">Perfil de admin</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'ListBookings', hash: '#up'}">Reservas</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'ListBusiness', hash: '#up'}">Negocios</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'ListUsers', hash: '#up'}">Usuarios</router-link>
      </li>
      <li @click="logoutUser">Cerrar Sesión</li>
    </ul>
    <ul id="sidebar" v-if="userWay">
      <li>
        <router-link :to="{name: 'Home', hash: '#up'}">Inicio</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'GetUser', hash: '#up'}">Mi usuario</router-link>
      </li>
      <li @click="isEdit =! isEdit">Ajustes</li>
      <ul v-if="isEdit" id="edit" class="secondary">
        <li>
          <router-link :to="{name: 'EditUser', hash: '#up'}">Editar tu usuario</router-link>
        </li>
      </ul>
      <li @click="isBookings =! isBookings">Tus reservas</li>
      <ul v-if="isBookings" id="bookings" class="secondary">
        <li>
          <router-link :to="{name: 'BookingUserConfirmed', hash: '#up'}">Confirmadas</router-link>
        </li>
        <li>
          <router-link :to="{name: 'BookingUserHistoric', hash: '#up'}">Histórico</router-link>
        </li>
        <li>
          <router-link :to="{name: 'BookingsUser', hash: '#up'}">Todas tus reservas</router-link>
        </li>
      </ul>
      <li @click="logoutUser">Cerrar Sesión</li>
    </ul>
  </nav>
</template>

<script>
import {
  logout,
  getIdToken,
  isLoggedInUser,
  isLoggedInBusiness,
  checkIsAdminUser,
} from "../utils";
import axios from "axios";

export default {
  name: "SideBarComp",
  data() {
    return {
      isEdit: false,
      isBookings: false,
      userWay: false,
      businessWay: false,
      logged: false,
      adminWay: false,
    };
  },
  methods: {
    userWayFunction() {
      if (isLoggedInUser() === true) {
        this.userWay = isLoggedInUser();
        this.logged = isLoggedInUser();
      }
    },
    businessWayFunction() {
      if (isLoggedInBusiness() === true) {
        this.logged = isLoggedInBusiness();
        this.businessWay = isLoggedInBusiness();
      }
    },
    adminWayFunction() {
      if (checkIsAdminUser() === true) {
        this.adminWay = checkIsAdminUser();
        this.logged = isLoggedInUser();
        this.userWay = false;
      }
    },
    logoutUser() {
      logout();
      this.$router.push("/home");
      location.reload();
    },
    logoutBusiness() {
      logout();
      this.$router.push("/home");
      location.reload();
    },
  },
  created() {
    this.userWayFunction();
    this.adminWayFunction();
    this.businessWayFunction();
  },
};
</script>

<style scoped>
nav {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;
  border: solid 0 0.1rem white;
}

a {
  color: coral;
  display: block;
  text-decoration: none;
}
li {
  color: coral;
  display: block;
  padding: 16px;
  text-decoration: none;
  border-bottom: solid 0.05rem white;
  margin: 0 2rem;
}

.secondary > li a {
  color: white;
  text-align: right;
}
li:hover {
  background: #61676a;
}

a:hover {
  cursor: pointer;
}

#sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#edit {
  display: flex;
  flex-direction: column;
  align-items: left;
}

li {
  list-style: none;
}
#settings {
  display: flex;
  flex-direction: column;
  align-items: right;
}

@media (min-width: 1000px) {
  nav {
    width: 100%;
    height: 100vh;
    border-radius: solid white 1rem;
    position: fixed;
    left: 0.5rem;
  }
  .secondary > li {
    padding: 1rem;
    margin-left: 0;
  }

  ul#edit.secondary {
    padding-left: 0;
    margin-left: 2rem;
    margin-right: 1rem;
    text-align: left;
  }

  ul#edit.secondary li > a {
    text-align: left;
  }

  ul#bookings.secondary {
    padding-left: 0;
    margin-left: 2rem;
    margin-right: 1rem;
    text-align: left;
  }

  ul#bookings.secondary li > a {
    text-align: left;
  }

  #sidebar {
    padding: 0;
    padding-top: 0.3rem;
    margin: 0;
  }
}
</style>
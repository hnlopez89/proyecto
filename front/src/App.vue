<template>
  <div id="app">
    <div id="userType">
      <p v-show="adminWay">Soy Admin</p>
      <router-link v-show="logged" :to="{name: 'Home'}">Tempo</router-link>
      <div v-show="!logged" id="nav">
        <router-link :to="{ name: 'LogInBusiness'}">Zona de Negocio</router-link>
        <router-link :to="{ name: 'CreateUser'}">Registrate</router-link>
        <router-link :to="{ name: 'LogInUser'}">Iniciar Sesión</router-link>
      </div>
      <div v-show="userWay" id="userway">
        <h3>Hola {{name}}!</h3>
        <router-link :to="{ name: 'GetUser'}" tag="button">Mi perfil</router-link>
        <button @click="logoutUser()">LogOut</button>
      </div>
      <div v-show="businessWay" id="businessway">
        <h3>Hola {{name}}!</h3>
        <router-link :to="{ name: 'GetBusiness'}" tag="button">Mi perfil de Negocio</router-link>
        <button @click="logoutBusiness()">LogOut</button>
      </div>
    </div>
    <router-view />
    <footercomp />
  </div>
</template>

<script>
import { isLoggedInUser, isLoggedInBusiness, checkIsAdminUser } from "./utils";
import { getNameUser } from "./utils";
import { logout } from "./utils";
import footercomp from "@/components/FooterComp.vue";

export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      userWay: false,
      businessWay: false,
      logged: false,
      adminWay: false,
    };
  },
  components: {
    footercomp,
  },

  methods: {
    setUsername() {
      this.name = getNameUser();
    },
    userWayFunction() {
      this.userWay = isLoggedInUser();
      this.logged = isLoggedInUser();
    },
    businessWayFunction() {
      this.businessWay = isLoggedInBusiness();
      this.logged = isLoggedInUser();
    },
    adminWayFunction() {
      this.adminWay = checkIsAdminUser();
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
    this.setUsername();
    this.userWayFunction();
    this.businessWayFunction();
    this.adminWayFunction();
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

html {
  min-height: 100%;
  background-color: navy;
  color: cornflowerblue;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}

#nav {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
}
#nav a {
  font-weight: bold;
  color: blue;
  text-decoration: none;
}

#userway {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

#userway > h3 {
  font-size: 2rem;
  color: blue;
}

#userway > button {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  display: block;
  margin: 0.5rem;
  background-color: blue;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.hide {
  display: none;
}
</style>

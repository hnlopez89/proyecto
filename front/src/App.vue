<template>
  <div id="app">
    <sideBarComp v-if="logged" id="sidebar" />
    <div id="userType">
      <div class="greet" v-if="!logged" id="nav">
        <router-link class="start" :to="{ name: 'Home'}">
          <img class="logo2" src="./assets/clock2.png" width="180px" height="150px" />
        </router-link>
        <router-link :to="{ name: 'LogInBusiness'}">Zona de Negocio</router-link>
        <router-link :to="{ name: 'CreateUser'}">Registrate</router-link>
        <router-link :to="{ name: 'LogInUser'}">Iniciar Sesión</router-link>
      </div>
      <div v-show="userWay" class="greet">
        <router-link class="start" :to="{ name: 'Home'}">
          <img class="logo1" src="./assets/clock.png" width="180px" height="150px" />
        </router-link>
        <router-link class="start" :to="{ name: 'Home'}">
          <img class="logo2" src="./assets/clock2.png" width="180px" height="150px" />
        </router-link>

        <h2>¡Hola {{name}}!</h2>
        <div id="burgerButton">
          <img @click="showPanel" src="./assets/menu.png" width="35px" height="35px" />
        </div>
      </div>
      <div class="greet" v-show="businessWay">
        <router-link class="start" :to="{ name: 'Home'}">
          <img class="logo1" src="./assets/clock.png" width="180px" height="150px" />
        </router-link>
        <router-link class="start" :to="{ name: 'Home'}">
          <img class="logo2" src="./assets/clock2.png" width="180px" height="150px" />
        </router-link>

        <h2>¡Hola {{name}}!</h2>
        <div id="burgerButton">
          <img @click="showPanel" src="./assets/menu.png" width="35px" height="35px" />
        </div>
      </div>
    </div>
    <div id>
      <div :class="{interfacePrivate:logged === true, interfacePublic:logged === false }">
        <router-view @login="userWayFunction" @login2="businessWayFunction" />
        <footercomp />
      </div>
    </div>
    <slideout-panel></slideout-panel>
  </div>
</template>

<script>
import { isLoggedInUser, isLoggedInBusiness, checkIsAdminUser } from "./utils";
import { getNameUser, getNameBusiness } from "./utils";
import { logout } from "./utils";
import footercomp from "@/components/FooterComp.vue";
import sideBarComp from "@/components/SideBarComp.vue";

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
      isDeploy: false,
      name: "",
    };
  },
  components: {
    footercomp,
    sideBarComp,
  },
  methods: {
    showPanel() {
      const panel1Handle = this.$showPanel({
        component: sideBarComp,
        openOn: "right",
        width: 300,
        closePanel() {
          this.$emit("closePanel", {});
        },
      });

      panel1Handle.promise.then((result) => {});
    },
    hidePanel() {
      this.panelResult.hide();
    },
    setBusinessname() {
      if (isLoggedInBusiness() === true) {
        this.name = getNameBusiness();
      }
    },
    userWayFunction(name) {
      if (isLoggedInUser() === true) {
        this.name = name;
        this.userWay = isLoggedInUser();
        this.logged = isLoggedInUser();
      }
    },
    businessWayFunction(name) {
      if (isLoggedInBusiness() === true) {
        this.name = name;
        this.logged = isLoggedInBusiness();
        this.businessWay = isLoggedInBusiness();
      }
    },
    adminWayFunction() {
      if (checkIsAdminUser() === true) {
        this.adminWay = checkIsAdminUser();
        this.logged = isLoggedInUser();
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
    setUsername() {
      if (isLoggedInUser() === true) {
        this.name = getNameUser();
      }
    },
  },
  created() {
    this.businessWayFunction();
    this.userWayFunction();
    this.setUsername();
    this.setBusinessname();
    this.adminWayFunction();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=ABeeZee&family=Indie+Flower&family=Mitr:wght@600&display=swap");
* {
  margin: 0;
  padding: 0;
  --contact: "Indie Flower", cursive;
  --font: "ABeeZee", sans-serif;
  --title: "Mitr", sans-serif;
}

.slideout {
  background-color: black;
}
.logo1 {
  position: absolute;
  top: -45%;
  left: 1%;
}

.logo2 {
  display: none;
  position: absolute;
  top: -45%;
  left: 1%;
}

html {
  width: 100%;
}

html > body {
  margin: 0;
  padding: 0;
}

button:hover,
a:hover {
  cursor: pointer;
}

#app {
  text-align: center;
  background-color: white;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  /* font-family: var(--font);*/
}

#nav {
  display: flex;
  justify-content: space-between;
}
#nav a {
  font-weight: bold;
  color: coral;
  text-decoration: none;
}

#nav :first-child {
  display: none;
}

#userType {
  z-index: 10;
  width: 99%;
  position: fixed;
  top: 0;
  height: auto;
  background-color: black;
}

h2 {
  color: white;
  margin: auto;
  display: none;
}

#userway {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.greet {
  padding: 0.3rem;
  float: inline-start;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  height: 4rem;
}

.greet > div {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-content: right;
  margin: 0.5rem;
}

.hide {
  display: none;
}
#burgerButton {
  position: absolute;
  right: 1%;
  top: 18%;
}

.interfacePrivate {
  margin-top: 4rem;
  width: 100%;
}
.interfacePublic {
  width: 100%;
  margin-top: 4rem;
}

#nav {
  margin: 0 1rem;
  text-align: center;
  justify-content: space-between;
  align-items: center;
}
#sidebar {
  display: none;
}

@media (min-width: 700px) {
  #userType {
    background-color: coral;
  }

  h2 {
    display: inherit;
  }
  .start {
    display: inherit;
  }
  .logo1 {
    display: none;
  }

  .logo2 {
    display: inherit;
  }
  #nav a {
    color: white;
  }
}

@media (min-width: 1000px) {
  #burgerButton {
    display: none;
  }
  nav#sidebar {
    margin-top: 4rem;
  }

  #nav :first-child {
    display: inherit;
  }

  h1 {
    margin: auto 1rem;
  }

  #sidebar {
    display: inline-block;
    width: 13rem;
    height: 100vh;
    margin: 0;
  }
  .interfacePrivate {
    width: calc(100% - 13rem);
    display: inline-block;
    min-height: 100%;
    float: right;
  }
}
</style>

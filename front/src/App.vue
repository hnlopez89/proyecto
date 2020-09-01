<template>
  <div id="app">
    <sideBarComp v-if="logged" id="sidebar" />
    <div id="userType">
      <div class="greet" v-if="!logged" id="nav">
        <router-link :to="{ name: 'LogInBusiness'}">Zona de Negocio</router-link>
        <router-link :to="{ name: 'CreateUser'}">Registrate</router-link>
        <router-link :to="{ name: 'LogInUser'}">Iniciar Sesión</router-link>
      </div>
      <div v-show="userWay" class="greet">
        <h3>¡Hola {{name}}!</h3>
        <div id="burgerButton">
          <button @click="showPanel">Mostrar</button>
        </div>
      </div>
      <div class="greet" v-show="businessWay">
        <h3>¡Hola {{name}}!</h3>
        <div id="burgerButton">
          <button @click="showPanel">Mostrar</button>
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
        props: {
          //any data you want passed to your component
        },
        closePanel() {
          this.$emit("closePanel", {});
        },
      });

      panel1Handle.promise.then((result) => {});
    },
    hidePanel() {
      this.panelResult.hide();
    },
    setUsername() {
      if (isLoggedInUser() === true) {
        this.name = getNameUser();
      }
    },
    setBusinessname() {
      if (isLoggedInBusiness() === true) {
        this.name = getNameBusiness();
      }
    },
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
    this.setUsername();
    this.setBusinessname();
    this.userWayFunction();
    this.adminWayFunction();
    this.businessWayFunction();
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.slideout {
  background-color: black;
}

html {
  background-color: grey;
  color: cornflowerblue;
}

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: white;
  height: 100%;
  min-height: 100vh;
  width: 100%;
}

#nav {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
}
#nav a {
  font-weight: bold;
  color: coral;
  text-decoration: none;
}

#userType {
  width: 100%;
  position: fixed;
  top: 0;
  height: 3rem;
  background-color: white;
}

#userway {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

#userway > div button {
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  color: coral;
  text-align: center;
  margin-left: 0.5rem;
}
.greet {
  float: inline-start;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: right;
  padding: 0.2rem;
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
#burgerButton > button {
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  color: coral;
  text-align: center;
  margin-left: 0.5rem;
}

.interfacePrivate {
  margin-top: 2.5rem;
}

@media (min-width: 700px) {
}

@media (min-width: 1000px) {
  #burgerButton {
    display: none;
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

  .greet {
    text-align: center;
  }

  .interfacePublic {
    width: 100%;
  }
}

@media (max-width: 1000px) {
  #sidebar {
    display: none;
  }
}
</style>

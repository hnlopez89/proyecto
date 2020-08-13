<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <!--<vue-headful title=" Añade un cliente | Formulario " /> -->

    <h1>Formulario para añadir nuevo Negocio:</h1>

    <p v-show="errorMsg">*Tienes campos vacíos</p>
    <input type="text" v-model="name" placeholder="Nombre" />
    <input type="text" v-model="manager" placeholder="Encargado" />
    <input type="text" v-model="category" placeholder="Categoría" />
    <input type="text" v-model="city" placeholder="Ciudad" />
    <input type="text" v-model="email" placeholder="Dirección de email" />
    <input type="password" v-model="password" placeholder="Contraseña" />
    <button @click="validatingData()">Crear Usuario</button>
    <button @click="goBack()">Go Back</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CreateUser",
  data() {
    return {
      name: "",
      manager: "",
      category: "",
      city: "",
      email: "",
      password: "",
      createClient: false,
      errorMsg: false,
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    validatingData() {
      if (
        this.name === "" ||
        this.manager === "" ||
        this.category === "" ||
        this.city === "" ||
        this.email === "" ||
        this.password === ""
      ) {
        this.errorMsg = true;
        this.createClient = false;
      } else {
        this.errorMsg = false;
        this.createClient = true;
        this.addNewClient();
      }
    },
    async addNewClient() {
      if (this.createClient === true) {
        try {
          const response = await axios.post("http://localhost:3000/business", {
            name: this.name,
            manager: this.manager,
            category: this.category,
            city: this.city,
            email: this.email,
            password: this.password,
          });
          console.log(response);
        } catch (error) {
          console.log(error.response);
        }
        this.createClient = false;
        this.name === "";
        this.manager === "";
        this.category === "";
        this.city === "";
        this.email === "";
        this.password === "";
      } else {
        console.log("Yo no debería estar aquí");
      }
    },
  },
};
</script>

<style>
</style>
<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <!--<vue-headful title=" Añade un cliente | Formulario " /> -->
    <h1>Formulario para añadir nuevo cliente:</h1>

    <p v-show="errorMsg">*Tienes campos vacíos</p>
    <input type="text" v-model="name" placeholder="Nombre" />
    <input type="text" v-model="surname" placeholder="Apellido" />
    <input type="text" v-model="email" placeholder="Dirección de email" />
    <input type="password" v-model="password" placeholder="Contraseña" />
    <label for>Sexo</label>
    <select type="text" v-model="gender">
      <option value="VARON">Varón</option>
      <option value="MUJER">Mujer</option>
    </select>
    <input type="date" v-model="birthday" placeholder="Fecha de nacimiento" />
    <input type="text" v-model="telephone" placeholder="Número de telefóno" />
    <input type="text" v-model="city" placeholder="ciudad" />
    <br />
    <button @click="validatingData()">Crear Usuario</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CreateUser",
  data() {
    return {
      name: "",
      surname: "",
      gender: "",
      birthday: "",
      city: "",
      telephone: "",
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
        this.surname === "" ||
        this.gender === "" ||
        this.birthday === "" ||
        this.city === "" ||
        this.telephone === "" ||
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
          const response = await axios.post("http://localhost:3000/user", {
            name: this.name,
            surname: this.surname,
            gender: this.gender,
            birthday: this.birthday,
            city: this.city,
            telephone: this.telephone,
            email: this.email,
            password: this.password,
          });
          console.log(response);
        } catch (error) {
          console.log(error.response);
        }
        this.createClient = false;
        this.name === "";
        this.surname === "";
        this.gender === "";
        this.birthday === "";
        this.telephone === "";
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
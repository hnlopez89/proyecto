<template>
  <div id="page">
    <button id="back" @click="goBack()">Go Back</button>
    <!--<vue-headful title=" Añade un cliente | Formulario " /> -->
    <h1>Crea tu cuenta</h1>

    <p v-show="errorMsg">*Tienes campos vacíos</p>
    <form>
      <input type="text" v-model="name" placeholder="Nombre" />
      <input type="text" v-model="surname" placeholder="Apellido" />
      <input type="text" v-model="email" placeholder="Dirección de email" />
      <input type="password" v-model="password" placeholder="Contraseña" />
      <input type="date" v-model="birthday" placeholder="Fecha de nacimiento" />
      <input type="text" v-model="telephone" placeholder="Número de telefóno" />
      <input type="text" v-model="city" placeholder="ciudad" />
      <p>
        <label for>Sexo</label>
        <select type="text" v-model="gender">
          <option value="VARON">Varón</option>
          <option value="MUJER">Mujer</option>
        </select>
      </p>
    </form>
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

<style scoped>
#page {
  background-image: url(../../assets/bigBen.jpeg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  min-height: 100vh;
}

#back {
  margin-top: 1rem;
  border: 0.1rem solid black;
  background-color: #ffffff;
  margin-bottom: 3.5rem;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid #ffffff;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
}

input {
  border-radius: 5px;
  border: 0;
  padding: 0.2rem;
  margin: 0.2rem;
  width: 12rem;
  background-color: rgba(255, 127, 80, 0.8);
}

::placeholder {
  color: rgba(220, 220, 220, 0.8);
}

h1 {
  background-color: black;
  color: coral;
}

p {
  padding: 0.2rem 0.5rem;
  background-color: rgba(255, 127, 80, 0.8);
  border-radius: 0.25rem;
  margin: 0.2rem;
}

select {
  border-radius: 1rem;
  border: 0;
  margin: 0;
  padding: 0 2.5rem;
}

label {
  color: rgb(220, 220, 220);
  margin-right: 1rem;
  font-size: 0.9rem;
}

@media (min-width: 700px) {
  h1 {
    font-size: 2.5rem;
  }
}
</style>
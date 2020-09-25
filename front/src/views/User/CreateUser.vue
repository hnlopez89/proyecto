<template>
  <div id="page">
    <button id="up" @click="goBack()">Volver</button>
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
      <p>
        <label for>Provincia</label>

        <select v-model="province" id="provincia">
          <option value="Alava">Álava</option>
          <option value="Albacete">Albacete</option>
          <option value="Alicante">Alicante/Alacant</option>
          <option value="Almeria">Almería</option>
          <option value="Asturias">Asturias</option>
          <option value="Avila">Ávila</option>
          <option value="Badajoz">Badajoz</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Burgos">Burgos</option>
          <option value="Caceres">Cáceres</option>
          <option value="Cadiz">Cádiz</option>
          <option value="Cantabria">Cantabria</option>
          <option value="Castellon">Castellón/Castelló</option>
          <option value="Ceuta">Ceuta</option>
          <option value="Ciudad_real">Ciudad Real</option>
          <option value="Cordoba">Córdoba</option>
          <option value="Cuenca">Cuenca</option>
          <option value="Girona">Girona</option>
          <option value="Granada">Granada</option>
          <option value="Guadalajara">Guadalajara</option>
          <option value="Guipuzcoa">Guipúzcoa</option>
          <option value="Huelva">Huelva</option>
          <option value="Huesca">Huesca</option>
          <option value="Islas_Baleares">Islas Balears</option>
          <option value="Jaen">Jaén</option>
          <option value="La_coruña">La Coruña</option>
          <option value="La_rioja">La Rioja</option>
          <option value="Las_palmas">Las Palmas</option>
          <option value="Leon">León</option>
          <option value="Lleida">Lleida</option>
          <option value="Lugo">Lugo</option>
          <option value="Madrid">Madrid</option>
          <option value="Malaga">Málaga</option>
          <option value="Melilla">Melilla</option>
          <option value="Murcia">Murcia</option>
          <option value="Navarra">Navarra</option>
          <option value="Ourense">Ourense</option>
          <option value="Palencia">Palencia</option>
          <option value="Pontevedra">Pontevedra</option>
          <option value="Salamanca">Salamanca</option>
          <option value="Segovia">Segovia</option>
          <option value="Sevilla">Sevilla</option>
          <option value="Soria">Soria</option>
          <option value="Tarragona">Tarragona</option>
          <option value="Santa_cruz_de_Tenerife">Santa Cruz de Tenerife</option>
          <option value="Teruel">Teruel</option>
          <option value="Toledo">Toledo</option>
          <option value="Valencia">Valencia</option>
          <option value="Valladolid">Valladolid</option>
          <option value="Vizcaya">Vizcaya</option>
          <option value="Zamora">Zamora</option>
          <option value="Zaragoza">Zaragoza</option>
        </select>
      </p>
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
import Swal from "sweetalert2";

export default {
  name: "CreateUser",
  data() {
    return {
      name: "",
      surname: "",
      gender: "",
      birthday: "",
      province: "",
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
        this.province === "" ||
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
            province: this.province,
            telephone: this.telephone,
            email: this.email,
            password: this.password,
          });
          this.$router.push("/loginuser");
          Swal.fire({
            icon: "success",
            title:
              "Has creado tu usuario correctamente, ¡bienvenido! Revisa tu email para validar tu usuario y editar tu disponibilidad",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
        this.createClient = false;
        this.name === "";
        this.surname === "";
        this.gender === "";
        this.birthday === "";
        this.telephone === "";
        this.province === "";
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
  margin-top: 2rem;
  background-color: black;
  color: coral;
  text-align: center;
}

button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

input {
  border-radius: 5px;
  border: 0;
  padding: 0.2rem;
  margin: 0.2rem;
  width: 13.2rem;
  background-color: rgba(255, 127, 80, 0.9);
  color: white;
}

::placeholder {
  color: white;
}

h1 {
  background-color: black;
  color: coral;
}

p {
  padding: 0.2rem 0rem;
  background-color: rgba(255, 127, 80, 0.9);
  border-radius: 0.35rem;
  margin: 0.2rem;
  width: 13.5rem;
}

select {
  border-radius: 1rem;
  border: 0;
  margin: 0;
  padding: 0;
  width: 9rem;
}

label {
  color: white;
  margin-right: 0.2rem;
  font-size: 0.9rem;
}

@media (min-width: 700px) {
  h1 {
    font-size: 2.5rem;
  }
}
</style>
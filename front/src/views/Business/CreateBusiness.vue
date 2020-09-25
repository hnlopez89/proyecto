<template>
  <div id="page">
    <button id="up" @click="goBack()">Volver</button>
    <!--<vue-headful title=" Añade un cliente | Formulario " /> -->

    <h1>Introduce tus datos:</h1>
    <p v-if="errorMsg">*Tienes campos vacíos</p>
    <form>
      <p>
        <label>Categoría</label>
        <select v-model="category">
          <option value="TERRAZA">Terraza</option>
          <option value="PELUQUERÍA">Peluquería</option>
          <option value="BAR">Bar</option>
          <option value="RESTAURANTE">Restaurante</option>
        </select>
      </p>
      <input type="text" v-model="name" placeholder="Nombre del establecimiento" />
      <input type="text" v-model="manager" placeholder="Encargad@" />
      <label>Provincia</label>
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
      <input type="text" v-model="telephone" placeholder="Número de telefóno" />
      <input type="text" v-model="email" placeholder="Dirección de email" />
      <input type="password" v-model="password" placeholder="Contraseña" />
    </form>
    <p>
      <button @click="validatingData()">Crear Usuario</button>
    </p>
  </div>
</template>

<script>
import Swal from "sweetalert2";

import axios from "axios";
export default {
  name: "CreateUser",
  data() {
    return {
      name: "",
      manager: "",
      category: "",
      telephone: "",
      province: "",
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
        this.telephone === "" ||
        this.province === "" ||
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
            province: this.province,
            telephone: this.telephone,
            email: this.email,
            password: this.password,
          });
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
        this.manager === "";
        this.category === "";
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
  background-image: url(../../assets/workWithUs.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  min-height: 100vh;
  padding-top: 1rem;
}

::placeholder {
  color: rgba(230, 230, 230, 0.7);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  border-radius: 5px;
  border: 0;
  padding: 0.2rem;
  margin: 0.2rem;
  width: 12rem;
  background-color: gray;
  color: white;
}
select {
  border-radius: 1rem;
  border: 0;
  margin: 0;
  background-color: gray;
  color: white;
}

label {
  font-size: 0.9rem;
  margin-right: 0.5rem;
}
p {
  margin: 0.2rem;
}

button {
  margin-top: 0.5rem;
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
button:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}
</style>
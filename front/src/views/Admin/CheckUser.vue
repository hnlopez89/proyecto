<template>
  <div class="EditUser">
    <button id="up" @click="goBack()">Volver</button>

    <h1>EDITAR MI USUARIO</h1>
    <div class="main">
      <div id="actionPicture">
        <img v-if="!newPicture && !picture" src="../../assets/default-user-avatar.jpg" height="200" />
        <img v-else-if="!newPicture" :src="setImage(picture)" />
        <img v-else :src="newPicture" />
        <label id="profile" for="profilePicture">Actualiza tu foto de perfil</label>
        <input type="file" ref="picture" @change="uploadImage" id="profilePicture" />
      </div>
      <div id="data">
        <h2>ID:{{id}}</h2>
        <label>Nombre</label>
        <input type="text" v-model="name" placeholder="Tu nombre" />
        <label>Apellidos</label>
        <input type="text" v-model="surname" placeholder="Tu apellido" />
        <label>Dirección de email</label>
        <input type="email" v-model="email" placeholder="Tu dirección de email" />
        <label>Sexo</label>
        <select v-model="gender">
          <option value="VARON">Hombre</option>
          <option value="MUJER">Mujer</option>
        </select>
        <label>Fecha de nacimiento</label>

        <input type="date" v-model="birthday" placeholder="Tu fecha de nacimiento" />
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
        <label>Telefono</label>

        <input type="text" v-model="telephone" placeholder="Tu número de telefóno" />

        <button @click.prevent="updateData()">Actualizar tu usuario</button>
        <button
          class="deploy"
          @click.prevent="changePassword =! changePassword"
        >Cambiar tu contraseña</button>

        <div class="edition" v-show="changePassword">
          <input type="password" v-model="oldPassword" placeholder="Tu contraseña actual" />
          <input type="password" v-model="newPassword" placeholder="Tu nueva contraseña" />
          <button @click.prevent="updatePassword()">Actualizar tu contraseña</button>
        </div>
        <p class="baja" v-if="resignReason">Motivo de baja:{{resignReason}}</p>
        <button class="deploy" @click="isResign =! isResign">Activación de usuario</button>
        <div class="edition" v-show="isResign">
          <div>
            <input v-model="resignReason" type="text" placeholder="¿Porqué quieres darte de baja?" />
            <legend>Cambia el estado del usuario</legend>
            <select v-model="active">
              <option value="0">Desactivado</option>
              <option value="1">Activado</option>
            </select>
            <button @click.prevent="resign">Confirmar darte de baja</button>
          </div>
        </div>
        <button class="deploy" @click="isAdmin =! isAdmin">Cambiar rol de usuario</button>
        <div class="edition" v-show="isAdmin">
          <div>
            <select v-model="role">
              <option value="customer">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <button @click.prevent="addAdmin">Confirmar rol de usuario</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";

import { getIdToken } from "../../utils";
import { format } from "date-fns";

export default {
  name: "EditUserAsAdmin",
  data() {
    return {
      data: [],
      name: "",
      surname: "",
      email: "",
      gender: "",
      birthday: "",
      province: "",
      telephone: "",
      picture: "",
      resignReason: "",
      isResign: false,
      reason: "",
      changePassword: false,
      oldPassword: "",
      newPassword: "",
      active: "",
      newPicture: "",
      resigned: "",
      isAdmin: "",
      role: "",
      id: "",
    };
  },

  methods: {
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    goBack() {
      window.history.back();
    },
    formatDate(date) {
      return format(new Date(date), "yyyy-MM-dd");
    },
    uploadImage() {
      /*this.profilePicture = this.$refs.profilePicture.files[0];*/
      this.picture = event.target.files[0];
      this.newPicture = event.target.files[0];
      this.createImage(event.target.files[0]);
    },
    createImage(file) {
      let newPicture = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.newPicture = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async getUser() {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/" + this.$route.params.id
        );
        this.name = response.data.data[0].name;
        this.surname = response.data.data[0].surname;
        this.email = response.data.data[0].email;
        this.gender = response.data.data[0].gender;
        this.telephone = response.data.data[0].telephone;
        this.province = response.data.data[0].province;
        this.picture = response.data.data[0].picture;
        this.birthday = this.formatDate(response.data.data[0].birthday);
        this.resignReason = response.data.data[0].resign_reason;
        this.role = response.data.data[0].role;
        this.active = response.data.data[0].active;
        this.id = response.data.data[0].id;
      } catch (error) {
        console.log(error.response);
      }
    },
    showUser(dataUser) {
      this.name = dataUser.name;
      this.surname = dataUser.surname;
      this.email = dataUser.email;
      this.gender = dataUser.gender;
      this.birthday = dataUser.birthday;
      this.province = dataUser.province;
      this.picture = dataUser.picture;
      this.telephone = dataUser.telephone;
      this.role = dataUser.role;
      this.resignReason = dataUser.resignReason;
      this.active = dataUser.active;
    },
    async updateData() {
      try {
        let userNewData = new FormData();
        userNewData.append("name", this.name);
        userNewData.append("surname", this.surname);
        userNewData.append("email", this.email);
        userNewData.append("gender", this.gender);
        userNewData.append("birthday", this.birthday);
        userNewData.append("province", this.province);
        userNewData.append("telephone", this.telephone);
        userNewData.append("picture", this.picture);
        const response = await axios.put(
          "http://localhost:3000/user/" + this.$route.params.id,
          userNewData,
          {
            header: { "Content-type": "multipart/form-data" },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Cambio de activación actualizado correctamente",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async updatePassword() {
      const result = await Swal.fire({
        title: "Estas seguro de actualizar la contraseña",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
          const response = await axios.put(
            "http://localhost:3000/user/" + this.id + "/password",
            {
              oldPassword: this.oldPassword,
              newPassword: this.newPassword,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Contraseña actualizada correctamente",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.log(error.response.data.message);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Actualización cancelada",
          icon: "error",
        });
      }
    },
    async resign() {
      const result = await Swal.fire({
        title: "Estas seguro de activar/desactivar el usuario",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, lo estoy",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
          const response = await axios.put(
            "http://localhost:3000/admin/" +
              getIdToken(token) +
              "/users/" +
              this.$route.params.id +
              "/activate_admin",
            {
              active: this.active,
              resignReason: this.resignReason,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Cambio de activación actualizado correctamente",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Activación cancelada",
          icon: "error",
        });
      }
    },
    async addAdmin() {
      const result = await Swal.fire({
        title: "Estas seguro de cambiar el rol del usuario",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, lo estoy",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;

          const response = await axios.put(
            "http://localhost:3000/admin/" +
              getIdToken(token) +
              "/users/" +
              this.$route.params.id +
              "/activate_admin",
            {
              role: this.role,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Rol actualizado correctamente",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.log(error.response.data);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Activación cancelada",
          icon: "error",
        });
      }
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style scoped>
.EditUser {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  min-height: 100vh;
}
#data {
  display: flex;
  flex-direction: column;
  align-items: center;
}
[type="file"] {
  display: none;
}
.baja {
  background-color: white;
  color: red;
  padding: 0.3rem;
}

img {
  display: block;
  border-radius: 10rem;
  border: solid 0.3rem grey;
  width: 20rem;
  height: 20rem;
  margin: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 2rem;
}

#profile {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 0.1rem solid white;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  margin-bottom: 0.5rem;
}

input {
  width: 14rem;
  text-align: center;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  border: 0;
}
select {
  width: 14rem;
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
}

button {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem;
  padding: 0.65rem;
  width: 12rem;
}

button:hover,
#profile:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

.deploy {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid black;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: white;
  color: black;
  text-align: center;
  margin-bottom: 0.5rem;
  width: 12rem;
}

.edition {
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 700px) {
  .main {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
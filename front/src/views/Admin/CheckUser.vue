<template>
  <div class="EditUser">
    <button @click="goBack()">Go Back</button>

    <h1>EDITAR MI USUARIO</h1>
    <form>
      <div id="actionPicture">
        <img v-if="!newPicture && !picture" src="../../assets/default-user-avatar.jpg" height="200" />
        <img v-else-if="!newPicture" :src="setImage(picture)" />
        <img v-else :src="newPicture" />
        <label id="profile" for="profilePicture">Actualiza tu foto de perfil</label>
        <input type="file" ref="picture" @change="uploadImage" id="profilePicture" />
      </div>
      <fieldset>
        <legend>Tus datos:</legend>
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
        <label>Ciudad</label>

        <input type="text" v-model="city" placeholder="Tu ciudad" />
        <label>Telefono</label>

        <input type="text" v-model="telephone" placeholder="Tu número de telefóno" />
        <label>Foto</label>

        <button @click="updateData()">Actualizar tu usuario</button>
        <button class="deploy" @click="changePassword =! changePassword">Cambiar tu contraseña</button>

        <div class="edition" v-show="changePassword">
          <input type="password" v-model="oldPassword" placeholder="Tu contraseña actual" />
          <input type="password" v-model="newPassword" placeholder="Tu nueva contraseña" />
          <button @click="updatePassword()">Actualizar tu contraseña</button>
        </div>
        <button class="deploy" @click="isResign =! isResign">Darte de baja</button>
        <div class="edition" v-show="isResign">
          <form>
            <input v-model="resignReason" type="text" placeholder="¿Porqué quieres darte de baja?" />
            <legend>Cambia el estado del usuario</legend>
            <select v-model="status">
              <option value="false">Desactivado</option>
              <option value="true">Activado</option>
            </select>
            <button @click="resign()">Confirmar darte de baja</button>
          </form>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { getIdToken } from "../../utils";

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
      city: "",
      telephone: "",
      picture: "",
      resignReason: "",
      isResign: false,
      reason: "",
      changePassword: false,
      oldPassword: "",
      newPassword: "",
      status: "",
      newPicture: "",
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
        this.birthday = this.formatDate(response.data.data[0].birthday);
        this.telephone = response.data.data[0].telephone;
        this.city = response.data.data[0].city;
        this.picture = response.data.data[0].picture;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    showUser(dataUser) {
      this.name = dataUser.name;
      this.surname = dataUser.surname;
      this.email = dataUser.email;
      this.gender = dataUser.gender;
      this.birthday = dataUser.birthday;
      this.city = dataUser.city;
      this.picture = dataUser.picture;
      this.telephone = dataUser.telephone;
    },
    async updateData() {
      try {
        let userNewData = new FormData();
        userNewData.append("name", this.name);
        userNewData.append("surname", this.surname);
        userNewData.append("email", this.email);
        userNewData.append("gender", this.gender);
        userNewData.append("birthday", this.birthday);
        userNewData.append("city", this.city);
        userNewData.append("telephone", this.telephone);
        userNewData.append("picture", this.picture);
        const response = await axios.put(
          "http://localhost:3000/user/" + this.$route.params.id,
          userNewData,
          {
            header: { "Content-type": "multipart/form-data" },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async updatePassword() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.put(
          "http://localhost:3000/user/" + getIdToken(token) + "/password",
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async resign() {
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
            status: this.status,
            resignReason: this.resignReason,
          }
        );
      } catch (error) {
        console.log(error.response.data);
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
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
[type="file"] {
  display: none;
}

img {
  display: block;
  margin-bottom: 10px;
  border-radius: 10rem;
  border: solid 0.3rem grey;
  width: 18rem;
  margin: 0 1rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

fieldset {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1rem 4rem;
  border-radius: 1rem;
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
</style>
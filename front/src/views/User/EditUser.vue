<template>
  <div class="GetUser">
    <button @click="goBack()">Go Back</button>

    <h1>EDITAR MI USUARIO</h1>
    <div>
      <input type="text" v-model="name" placeholder="Tu nombre" />
      <br />
      <input type="text" v-model="surname" placeholder="Tu apellido" />
      <br />
      <input type="email" v-model="email" placeholder="Tu dirección de email" />
      <br />
      <input type="text" v-model="gender" placeholder="Tu género" />
      <br />
      <input type="date" v-model="birthday" placeholder="Tu fecha de nacimiento" />
      <br />
      <input type="text" v-model="city" placeholder="Tu ciudad" />
      <br />
      <input type="text" v-model="telephone" placeholder="Tu número de telefóno" />
      <br />
      <img :src="picture" />
      <input type="file" ref="picture" @change="uploadImage" />
      <br />
      <button @click="updateData()">Actualizar Cliente</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "Home",
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
    };
  },

  methods: {
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    goBack() {
      window.history.back();
    },
    uploadImage() {
      /*this.profilePicture = this.$refs.profilePicture.files[0];*/
      this.picture = event.target.files[0];
      console.log(this.picture);
    },
    async getUser() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/user/" + getIdToken(token)
        );
        this.user = response.data.data[0];
        this.name = response.data.data[0].name;
        this.surname = response.data.data[0].surname;
        this.email = response.data.data[0].email;
        this.gender = response.data.data[0].gender;
        this.birthday = response.data.data[0].birthday;
        this.telephone = response.data.data[0].telephone;
        this.city = response.data.data[0].city;
        this.picture = response.data.data[0].picture;
        console.log(this.user);
      } catch (error) {
        console.log(error);
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
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
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
          "http://localhost:3000/user/" + getIdToken(token),
          userNewData,
          {
            header: { "Content-type": "multipart/form-data" },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
      location.reload;
    },
  },
  created() {
    this.getUser();
  },
};
</script>
<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <div>
      <img :src="image" />
      <input type="file" ref="image" @change="uploadImage" />
      <br />
      <img :src="image2" />
      <input type="file" ref="image2" @change="uploadImage" />
      <br />
      <img :src="image3" />
      <input type="file" ref="image3" @change="uploadImage" />
      <br />

      <button @click="updateData()">Actualizar Cliente</button>
    </div>
  </div>
</template>

<script>
import { getIdToken } from "../../utils";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      image: "",
      image2: "",
      image3: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    uploadImage() {
      this.image = event.target.files[0];
      this.image2 = event.target.files[0];
      this.image3 = event.target.files[0];
      console.log(event.target.files);
    },
    async showUser(dataBusiness) {
      let image = response.data.data[0].picture;
      this.profilePicture = this.setImage(profilePicture);
    },
    async updateData() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        let userNewData = new FormData();
        userNewData.append("image", this.image);
        userNewData.append("image2", this.image2);
        userNewData.append("image3", this.image3);
        const response = await axios.put(
          "http://localhost:3000/business/" + getIdToken(token) + "/pictures",
          userNewData,
          {
            header: { "Content-type": "multipart/form-data" },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error.response.data.message);
      }
      location.reload;
    },
  },
};
</script>

<style>
</style>
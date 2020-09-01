<template>
  <div id="EditBusinessPictures">
    <button @click="goBack()">Go Back</button>
    <div>
      <div class="updateFile">
        <input type="file" ref="image" @change="uploadImage" id="file1" />
        <label for="file1">Escoge tu foto</label>
        <img v-show="!update1 && !image && category==='BAR'" src="../../assets/BAR.jpg" />
        <img
          v-show="!update1 && !image && category==='RESTAURANTE'"
          src="../../assets/RESTAURANTE.jpg"
        />
        <img
          v-show="!update1 && !image && category==='PELUQUERÍA'"
          src="../../assets/PELUQUERIA.jpg"
        />
        <img v-show="!update1 && !image && category==='TERRAZA'" src="../../assets/TERRAZA.jpg" />
        <img v-show="!update1 && image" :src="setImage(image)" />
        <img v-if="update1" :src="update1" />
      </div>

      <div class="updateFile">
        <input type="file" ref="image2" @change="uploadImage2" id="file2" />
        <label for="file2">Escoge tu foto</label>
        <img v-show="!update2 && !image2 && category==='BAR'" src="../../assets/BAR.jpg" />
        <img
          v-show="!update2 && !image2 && category==='RESTAURANTE'"
          src="../../assets/RESTAURANTE.jpg"
        />
        <img
          v-show="!update2 && !image2 && category==='PELUQUERÍA'"
          src="../../assets/PELUQUERIA.jpg"
        />
        <img v-show="!update2 && !image2 && category==='TERRAZA'" src="../../assets/TERRAZA.jpg" />
        <img v-show="!update2 && image2" :src="setImage(image2)" />
        <img v-if="update2" :src="update2" />
      </div>

      <div class="updateFile">
        <input type="file" ref="image3" @change="uploadImage3" id="file3" />
        <label for="file3">Escoge tu foto</label>
        <img v-show="!update3 && !image3 && category==='BAR'" src="../../assets/BAR.jpg" />
        <img
          v-show="!update3 && !image3 && category==='RESTAURANTE'"
          src="../../assets/RESTAURANTE.jpg"
        />
        <img
          v-show="!update3 && !image3 && category==='PELUQUERÍA'"
          src="../../assets/PELUQUERIA.jpg"
        />
        <img v-show="!update3 && !image3 && category==='TERRAZA'" src="../../assets/TERRAZA.jpg" />
        <img v-show="!update3 && image3" :src="setImage(image3)" />
        <img v-if="update3" :src="update3" />
      </div>
    </div>
    <button @click="updateData()">Actualizar Cliente</button>
  </div>
</template>

<script>
import { getIdToken } from "../../utils";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      category: "",
      image: "",
      image2: "",
      image3: "",
      update1: "",
      update2: "",
      update3: "",
      test: "",
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    uploadImage(event) {
      console.log(event.target.files[0]);
      this.image = event.target.files[0];
      this.update1 = event.target.files[0];
      this.createImage(event.target.files[0]);
    },
    createImage(file) {
      let update1 = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.update1 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    uploadImage2(event) {
      this.image2 = event.target.files[0];
      this.update2 = event.target.files[0];

      this.createImage2(event.target.files[0]);
    },
    createImage2(file) {
      let update2 = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.update2 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    uploadImage3(event) {
      this.image3 = event.target.files[0];
      this.update3 = event.target.files[0];
      this.createImage3(event.target.files[0]);
    },
    createImage3(file) {
      let update3 = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.update3 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    /* removeImage: function (e) {
      this.image = "";
    },
    removeImage2: function (e) {
      this.image2 = "";
    },
    removeImage3: function (e) {
      this.image3 = "";
    },
    removeImageUpdate: function (e) {
      this.imageUpdate = "";
    },
    removeImageUpdate2: function (e) {
      this.imageUpdate2 = "";
    },
    removeImageUpdate3: function (e) {
      this.imageUpdate3 = "";
    },*/
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" + getIdToken(token)
        );
        this.category = response.data.data[0].category;
        this.image = response.data.pictures[0].picture;
        this.image2 = response.data.pictures[1].picture;
        this.image3 = response.data.pictures[2].picture;
      } catch (error) {
        console.log(error);
      }
    },
    async updateData() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        let userNewData = new FormData();
        userNewData.append("image", this.image);
        userNewData.append("image2", this.image2);
        userNewData.append("image3", this.image3);
        console.log(userNewData);

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
  created() {
    this.getBusiness();
  },
};
</script>

<style scoped>
#EditBusinessPictures {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  width: 100%;
  min-height: 100vh;
}

img {
  width: 40%;
  height: 15rem;
  display: block;
  margin-bottom: 10px;
  border: solid 0.1rem black;
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.updateFile {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

[type="file"] {
  display: none;
}
label {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin-bottom: 0.5rem;
}

button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 0.1rem solid coral;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin: 1rem 0 2rem;
}
</style>
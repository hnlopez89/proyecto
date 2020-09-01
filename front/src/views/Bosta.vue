      <router-link @click="businessMood()" :to="{name:LogInBusiness}">LogIn Business</router-link>
      <router-link to="loginbusiness}">LogIn Business</router-link>
      <button to="/loginbusiness" @click="businessMood()">Iñaki</button>

      <select v-model="hour">
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
      </select>

import { loginUser } from "./utils";
import { isLoggedIn } from "./utils";
import { getNameUser } from "./utils";
import { logout } from "./utils";

export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      logged: false,
      userMood: true,
    };
  },

  methods: {
    businessMood() {
      this.userMood = false;
    },
    changeMood() {
      this.userMood = true;
    },
    setUsername() {
      this.name = getNameUser();
    },
    loginUser() {
      if (this.email === "" || this.password === "") {
        alert("Te faltan datos.");
      } else {
        loginUser(this.email, this.password);
      }
      setTimeout(() => {
        this.$router.push("/home");
        location.reload();
      }, 1000);
    },
    getLoginUser() {
      this.logged = isLoggedIn();
    },
    logoutUser() {
      logout();
      this.$router.push("/home");
      location.reload();
    },
  },
  created() {
    this.setUsername();
    this.getLoginUser();
  },
};



            name: this.name,
            category: this.category,
            manager: this.manager,
            email: this.email,
            openingTime: this.openingTime,
            closingTime: this.closingTime,
            lengthBooking: this.lengthBooking,
            description: this.description,
            bankAccount: this.bankAccount,
            pricingList: this.pricingList,
            allotment: this.allotmentAvailable,
            allotmentAvailable: this.allotmentAvailable,
            profilePicture: this.profile_picture,
            province: this.province,
            zipCode: this.zipCode,
            city: this.city,
            line1: this.line1,
            line2: this.line2,
            day1: this.day1,
            day2: this.day2,
            day3: this.day3,
            day4: this.day4,
            day5: this.day5,
            day6: this.day6,
            day7: this.day7,



            userNewData.append("name", this.name),
            userNewData.append("category", this.category),
            userNewData.append("manager", this.manager),
            userNewData.append("email", this.email),
            userNewData.append("openingTime", this.openingTime),
            userNewData.append("closingTime", this.closingTime),
            userNewData.append("lengthBooking", this.lengthBooking),
            userNewData.append("description", this.description),
            userNewData.append("bankAccount", this.bankAccount),
            userNewData.append("pricingList", this.pricingList),
            userNewData.append("allotment", this.allotmentAvailable),
            userNewData.append("allotmentAvailable", this.allotmentAvailable),
            userNewData.append("profilePicture", this.profile_picture),
            userNewData.append("province", this.province),
            userNewData.append("zipCode", this.zipCode),
            userNewData.append("city", this.city),
            userNewData.append("line1", this.line1),
            userNewData.append("line2", this.line2),
            userNewData.append("day1", this.day1),
            userNewData.append("day2", this.day2),
            userNewData.append("day3", this.day3),
            userNewData.append("day4", this.day4),
            userNewData.append("day5", this.day5),
            userNewData.append("day6", this.day6),
            userNewData.append("day7", this.day7),


<!--
            <template>
<div>
<h1>Formulario para añadir nuevo artículo:</h1>

<p v-show="errorMsg">***Tienes campos vacíos***</p>
<p>
  <input type="text" v-model="brand" placeholder="Marca" />
</p>

<p>
  <input type="text" v-model="category" placeholder="Categoría" />
</p>

<p>
  <input type="text" v-model="description" placeholder="Descripciń" />
</p>

<p>
  <input type="text" v-model="price" placeholder="Precio" />
</p>

<p>
  <input type="text" v-model="province" placeholder="Provincia" />
</p>

<input type="file" ref="imagenArticulo1" @change="catchSeeArticle1" />
<p>Nombre de la captura1: {{imagenArticulo1.name}}</p>

<input type="file" ref="imagenArticulo2" @change="catchSeeArticle2" />
<p>Nombre de la captura: {{imagenArticulo2.name}}</p>

<input type="file" ref="imagenArticulo3" @change="catchSeeArticle3" />
<p>Nombre de la captura: {{imagenArticulo3.name}}</p>

<p>
  <button @click="validateData()">Añadir artículo</button>
</p>
<p>
  <router-link to="/editArticle" tag="button">Actualizar articulo</router-link>
</p>
</div>
</template>
--> 

<script>
/*import axios from "axios";
import { getIdToken } from "../utils/utils";

    const [dataNewBooking] = await connection.query(
      `SELECT * 
      FROM business
      WHERE id = ?`, [id]
    );
    const data = dataNewBooking[0]

export default {
name: "NewArticle",
data() {
return {
brand: "",
category: "",
description: "",
price: "",
province: "",
imagenArticulo1: "",
imagenArticulo2: "",
imagenArticulo3: "",
createClient: false,
errorMsg: false,
};
},
methods: {
validateData() {
if (
this.brand === "" ||
this.category === "" ||
this.description === "" ||
this.price === "" ||
this.province === "" ||
this.imagenArticulo1 === "" ||
this.imagenArticulo2 === "" ||
this.imagenArticulo3 === ""
) {
this.errorMsg = true;
this.createArticle = false;
} else {
this.errorMsg = false;
this.createArticle = true;
this.addNewArticle();
}
},
catchSeeArticle1() {
this.imagenArticulo1 = this.$refs.imagenArticulo1.files[0];
console.log(this.imagenArticulo1);
},
catchSeeArticle2() {
this.imagenArticulo2 = this.$refs.imagenArticulo2.files[0];
console.log(this.imagenArticulo2);
},
catchSeeArticle3() {
this.imagenArticulo3 = this.$refs.imagenArticulo3.files[0];
console.log(this.imagenArticulo3);
},

async addNewArticle() {
  if (this.createArticle === true) {
    try {
      let token = localStorage.getItem("AUTH_TOKEN_KEY");
      axios.defaults.headers.common["Authorization"] = `${token}`;
      let formData = new FormData();
      formData.append("brand", this.brand);
      formData.append("category", this.category);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("province", this.province);
      formData.append("processImage1", this.imagenArticulo1);
      formData.append("processImage2", this.imagenArticulo2);
      formData.append("processImage3", this.imagenArticulo3);
      const response = await axios.post(
        "http://localhost:3000/articles",
        formData,
        { header: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      console.error(error);
    }
    this.createarticle = false;
    this.brand = "";
    this.category = "";
    this.description = "";
    this.price = "";
    this.province = "";
    this.imagenArticulo1 = "";
    this.imagenArticulo2 = "";
    this.imagenArticulo3 = "";
  } else {
    console.log("Algo va mal");
  }
},
},
};
</script>



const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  generateError,
  showDebug,
} = require("../../helpers");

async function editBusinessPictures(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [currentData] = await connection.query(
      `
            SELECT id
            FROM business
            WHERE id=?
            `,
      [id]
    );
    const current = currentData[0].id;
    if (current !== req.auth.id) {
      throw generateError("No tienes permisos para editar este negocio", 403);
    }
    const [pictures] = await connection.query(
      `SELECT id
        FROM pictures
        WHERE id_business=?`,
      [id]
    );

    if (pictures.length >= 3) {
      throw generateError(
        "No puedes subir más fotos, borra alguna primero",
        406
      );
    }

    const images = [];

    if (req.files && Object.keys(req.files).length > 0) {
      for (const [imageName, imageData] of Object.entries(req.files).slice(
        0,
        3
      )) {
        try {
          showDebug(imageName);

          const processedImage = await processAndSaveImage(imageData);

          images.push(processedImage);

          await connection.query(
            `INSERT INTO pictures (update_date, id_business, picture)
            VALUES (UTC_TIMESTAMP, ?, ?)
            `,
            [id, processedImage]
          );
        } catch (error) {
          throw generateError("No se pudo procesar la imagen", 400);
        }
      }
    }
    res.send({
      status: "oki doki",
      pictures
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
module.exports = editBusinessPictures;


<template>
  <div id="EditBusinessPictures">
    <button @click="goBack()">Go Back</button>
    <div>
      <div class="updateFile">
        <div v-show="!imageUpdate">
          <input type="file" ref="image" @change="uploadImage" id="file1" />
          <label for="file1">Escoge tu foto</label>
          <div v-show="image">
            <img :src="setImage(image)" />
            <button @click="removeImage">Borrar foto</button>
          </div>
        </div>
        <div v-show="imageUpdate">
          <img :src="imageUpdate" />
          <button @click="removeImageUpdate">Descartar cambios</button>
        </div>
      </div>
      <div class="updateFile">
        <div v-show="!imageUpdate2">
          <input type="file" ref="image2" @change="uploadImage2" id="file2" />
          <label for="file2">Escoge tu foto</label>
          <div v-show="image2">
            <img :src="setImage(image2)" />
            <button @click="removeImage2">Borrar foto</button>
          </div>
        </div>
        <div v-show="imageUpdate2">
          <img :src="imageUpdate2" />
          <button @click="removeImageUpdate2">Descartar cambios</button>
        </div>
      </div>
      <div class="updateFile">
        <div v-show="!imageUpdate3">
          <input type="file" ref="image3" @change="uploadImage3" id="file3" />
          <label for="file3">Escoge tu foto</label>
          <div v-show="image3">
            <img :src="setImage(image3)" />
            <button @click="removeImage3">Borrar foto</button>
          </div>
        </div>
        <div v-show="imageUpdate3">
          <img :src="imageUpdate3" />
          <button @click="removeImageUpdate3">Descartar cambios</button>
        </div>
      </div>
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
      imageUpdate: "",
      imageUpdate2: "",
      imageUpdate3: "",
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
      this.imageUpdate = event.target.files[0];
      this.createImage(this.imageUpdate);
    },
    createImage(file) {
      let imageUpdate = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imageUpdate = e.target.result;
      };
      reader.readAsDataURL(file);
      this.imageUpdate = event.target.files[0];
    },
    uploadImage2() {
      this.imageUpdate2 = event.target.files[0];
      this.createImage2(this.imageUpdate2);
    },
    createImage2(file) {
      let imageUpdate2 = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imageUpdate2 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    uploadImage3() {
      this.imageUpdate3 = event.target.files[0];
      this.createImage3(this.imageUpdate3);
    },
    createImage3(file) {
      let imageUpdate3 = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imageUpdate3 = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
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
    },
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" + getIdToken(token)
        );
        console.log(response);
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
        userNewData.append("image", this.imageUpdate);
        userNewData.append("image2", this.imageUpdate2);
        userNewData.append("image3", this.imageUpdate3);
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









<template>
  <div>
    <button @click="goBack()">Go Back</button>
    <div>
      <img :src="image" />
      <input type="file" ref="image" @change="uploadImage" />
      <br />
      <img :src="image2" />
      <input type="file" ref="image2" @change="uploadImage1" />
      <br />
      <img :src="image3" />
      <input type="file" ref="image3" @change="uploadImage2" />
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
      console.log(event.target.files);
    },
    uploadImage1() {
      this.image2 = event.target.files[0];
      console.log(event.target.files);
    },
    uploadImage2() {
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

<style scoped>
</style>











*/
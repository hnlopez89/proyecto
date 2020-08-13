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
*/
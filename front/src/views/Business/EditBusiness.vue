<template>
  <div class="EditBusiness">
    <button @click="goBack()">Go Back</button>
    <h1>EDITAR MI NEGOCIO</h1>
    <div>
      <input type="text" v-model="name" placeholder="Tu nombre" />
      <br />
      <input type="text" v-model="manager" placeholder="Tu gestor" />
      <br />
      <input type="email" v-model="category" placeholder="Tu categoría" />
      <br />
      <input type="email" v-model="email" placeholder="Tu dirección de email" />
      <br />
      <input type="text" v-model="openingTime" placeholder="Tu hora de apertura" />
      <br />
      <input type="text" v-model="closingTime" placeholder="Tu hora de cierre" />
      <br />
      <input type="text" v-model="lengthBooking" placeholder="La duración de tus citas" />
      <br />
      <input type="text" v-model="description" placeholder="Tu descripción" />
      <br />
      <input type="text" v-model="pricingList" placeholder="Tu lista de precios" />
      <br />
      <input type="text" v-model="bankAccount" placeholder="Tu cuenta bancaria" />
      <br />
      <input type="text" v-model="allotmentAvailable" placeholder="Tus plazas" />
      <br />
      <input hidden type="text" v-model="allotmentAvailable" placeholder="Tus plazas disponibles" />
      <br />
      <img :src="profilePicture" />
      <input type="file" ref="profilePicture" @change="uploadImage" />
      <br />
      <input type="text" v-model="city" placeholder="Tu ciudad" />
      <br />
      <input type="text" v-model="telephone" placeholder="Número de teléfono" />
      <br />
      <input type="text" v-model="zipCode" placeholder="Tu código postal" />
      <br />
      <input type="text" v-model="province" placeholder="Tu provincia" />
      <br />
      <input type="text" v-model="line1" placeholder="Tu dirección" />
      <br />
      <input type="text" v-model="line2" placeholder="Tu dirección" />
      <br />
      <p>Indica los días de apertura de tu negocio</p>
      <form action>
        <label for>Lunes</label>
        <input type="radio" v-model="day1" value="1" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day1" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
        <label for>Martes</label>
        <input type="radio" v-model="day2" value="2" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day2" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
        <label for>Miercoles</label>
        <input type="radio" v-model="day3" value="3" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day3" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
        <label for>Jueves</label>
        <input type="radio" v-model="day4" value="4" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day4" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
        <label for>Viernes</label>
        <input type="radio" v-model="day5" value="5" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day5" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
        <label for>Sábado</label>
        <input type="radio" v-model="day6" value="6" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day6" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
        <label for>Domingo</label>
        <input type="radio" v-model="day7" value="7" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <input type="radio" v-model="day7" value="0" placeholder="Escribe 1, 2, 3, 4, 5, 6 ó 7" />
        <br />
      </form>
      <button @click="updateData()">Actualizar Cliente</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getIdToken } from "../../utils";

export default {
  name: "EditBusiness",
  data() {
    return {
      data: [],
      name: "",
      manager: "",
      category: "",
      email: "",
      openingTime: "",
      closingTime: "",
      lengthBooking: "",
      description: "",
      pricingList: "",
      bankAccount: "",
      telephone: "",
      allotmentAvailable: "",
      picture: "",
      uploadedImage: "",
      profilePicture: "",
      city: "",
      zipCode: "",
      province: "",
      line1: "",
      line2: "",
      day1: "",
      day2: "",
      day3: "",
      day4: "",
      day5: "",
      day6: "",
      day7: "",
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
      this.profilePicture = event.target.files[0];
      console.log(this.profilePicture);
    },
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/business/" + getIdToken(token) + "/profile"
        );
        data: response.data.data[0];
        this.name = response.data.data[0].name;
        this.manager = response.data.data[0].manager;
        this.category = response.data.data[0].category;
        this.email = response.data.data[0].email;
        this.openingTime = response.data.data[0].opening_time;
        this.closingTime = response.data.data[0].closing_time;
        this.lengthBooking = response.data.data[0].length_booking;
        this.description = response.data.data[0].description;
        this.pricingList = response.data.data[0].pricing_list;
        this.bankAccount = response.data.data[0].bank_account;
        this.allotment = response.data.data[0].allotment;
        this.allotmentAvailable = response.data.data[0].allotment_available;
        this.profilePicture = response.data.data[0].profilePicture;
        this.city = response.data.data[0].city;
        this.telephone = response.data.data[0].telephone;
        this.zipCode = response.data.data[0].zip_code;
        this.province = response.data.data[0].province;
        this.line1 = response.data.data[0].line1;
        this.line2 = response.data.data[0].line2;
        this.day1 = response.data.openDays[0].day;
        this.day2 = response.data.openDays[1].day;
        this.day3 = response.data.openDays[2].day;
        this.day4 = response.data.openDays[3].day;
        this.day5 = response.data.openDays[4].day;
        this.day6 = response.data.openDays[5].day;
        this.day7 = response.data.openDays[6].day;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async showUser(dataBusiness) {
      this.name = dataBusiness.name;
      this.category = dataBusiness.category;
      this.manager = dataBusiness.manager;
      this.email = dataBusiness.email;
      this.openingTime = dataBusiness.openingTime;
      this.closingTime = dataBusiness.closingTime;
      this.lengthBooking = dataBusiness.lengthBooking;
      this.description = dataBusiness.description;
      this.bankAccount = dataBusiness.bankAccount;
      this.pricingList = dataBusiness.pricingList;
      this.allotment = dataBusiness.allotment;
      this.allotmentAvailable = dataBusiness.allotmentAvailable;
      let picture = response.data.data[0].profilePicture;
      this.profilePicture = this.setImage(picture);
      this.city = dataBusiness.city;
      this.zipCode = dataBusiness.zipCode;
      this.province = dataBusiness.province;
      this.telephone = dataBusiness.telephone;
      this.line1 = dataBusiness.line1;
      this.line2 = dataBusiness.line2;
      this.day1 = dataBusiness.day1;
      this.day2 = dataBusiness.day2;
      this.day3 = dataBusiness.day3;
      this.day4 = dataBusiness.day4;
      this.day5 = dataBusiness.day5;
      this.day6 = dataBusiness.day6;
      this.day7 = dataBusiness.day7;
    },
    async updateData() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        let userNewData = new FormData();
        userNewData.append("name", this.name);
        userNewData.append("category", this.category);
        userNewData.append("manager", this.manager);
        userNewData.append("email", this.email);
        userNewData.append("openingTime", this.openingTime);
        userNewData.append("closingTime", this.closingTime);
        userNewData.append("lengthBooking", this.lengthBooking);
        userNewData.append("profilePicture", this.profilePicture);
        userNewData.append("description", this.description);
        userNewData.append("bankAccount", this.bankAccount);
        userNewData.append("telephone", this.telephone);
        userNewData.append("pricingList", this.pricingList);
        userNewData.append("allotment", this.allotmentAvailable);
        userNewData.append("allotmentAvailable", this.allotmentAvailable);
        userNewData.append("province", this.province);
        userNewData.append("zipCode", this.zipCode);
        userNewData.append("city", this.city);
        userNewData.append("line1", this.line1);
        userNewData.append("line2", this.line2);
        userNewData.append("day1", this.day1);
        userNewData.append("day2", this.day2);
        userNewData.append("day3", this.day3);
        userNewData.append("day4", this.day4);
        userNewData.append("day5", this.day5);
        userNewData.append("day6", this.day6);
        userNewData.append("day7", this.day7);

        const response = await axios.put(
          "http://localhost:3000/business/" + getIdToken(token),
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
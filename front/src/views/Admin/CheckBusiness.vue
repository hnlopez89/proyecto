<template>
  <div id="checkBusiness">
    <button id="up" @click="goBack()">Volver</button>
    <div class="intro">
      <div id="head">
        <div id="picture">
          <img
            v-show="!newProfilePicture && !profilePicture && category==='BAR'"
            src="../../assets/BAR.jpg"
          />
          <img
            v-show="!newProfilePicture && !profilePicture && category==='RESTAURANTE'"
            src="../../assets/RESTAURANTE.jpg"
          />
          <img
            v-show="!newProfilePicture && !profilePicture && category==='PELUQUERÍA'"
            src="../../assets/PELUQUERIA.jpg"
          />
          <img
            v-show="!newProfilePicture && !profilePicture && category==='TERRAZA'"
            src="../../assets/TERRAZA.jpg"
          />
          <img v-show="!newProfilePicture && profilePicture" :src="profilePicture" />
          <img v-if="newProfilePicture" :src="newProfilePicture" />
          <label id="profilePicture" for="profile">Actualiza tu foto de perfil</label>
          <input type="file" ref="profilePicture" @change="uploadImage" id="profile" />
        </div>

        <form id="first">
          <label>Nombre de tu negocio</label>
          <input type="text" v-model="name" placeholder="El nombre de tu negocio" />
          <legend>Categoría</legend>
          <select v-model="category">
            <option value="TERRAZA">Terraza</option>
            <option value="BAR">Bar</option>
            <option value="RESTAURANTE">Restaurante</option>
            <option value="PELUQUERÍA">Peluquería</option>
          </select>

          <fieldset class="form">
            <legend>Datos de contacto</legend>
            <label label>Encargad@</label>
            <input type="text" v-model="manager" placeholder="Tu gestor" />
            <label>Dirección de email</label>
            <input type="email" v-model="email" placeholder="Tu dirección de email" />
            <label>Teléfono</label>
            <input type="text" v-model="telephone" placeholder="Número de teléfono" />
            <button class="deploy" @click.prevent="isPassword = !isPassword">Cambiar la contraseña</button>
            <form id="password" v-if="isPassword">
              <input type="password" v-model="oldPassword" placeholder="Tu contraseña actual" />
              <input type="password" v-model="newPassword" placeholder="Tu nueva contraseña" />
              <button @click="updatePassword()">Confirmar tu nueva contraseña</button>
            </form>
          </fieldset>
        </form>
      </div>

      <form>
        <label>Descripción</label>
        <textarea
          rows="15"
          minlength="20"
          cols="40"
          v-model="description"
          placeholder="Tu descripción"
        />
        <label>Numero de cuenta bancario</label>
        <input type="text" v-model="bankAccount" placeholder="Tu cuenta bancaria" />
      </form>

      <form>
        <fieldset>
          <legend>Localización</legend>
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
          <label>Ciudad</label>
          <input type="text" v-model="city" placeholder="Tu ciudad" />
          <label>Código Postal</label>
          <input type="text" v-model="zipCode" placeholder="Tu código postal" />
          <label>Dirección</label>
          <input type="text" v-model="line1" placeholder="Tu dirección" />
          <label>Dirección 2</label>
          <input type="text" v-model="line2" placeholder="Tu dirección" />
        </fieldset>
      </form>
      <form id="availability">
        <fieldset>
          <legend>Datos de disponibilidad</legend>
          <label for>Hora de apertura</label>
          <select v-model="openingTime">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
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
          <label for>Hora de cierre</label>
          <select v-model="closingTime">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
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
          <label>Duración de las reservas</label>
          <select v-model="lengthBooking">
            <option value="30">30 minutos</option>
            <option value="60">60 minutos</option>
          </select>
          <label>Cupo disponible</label>
          <select v-model="allotmentAvailable" id="units">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
          <input
            hidden
            type="text"
            v-model="allotmentAvailable"
            placeholder="Tus plazas disponibles"
          />
        </fieldset>
        <fieldset id="opening">
          <legend>Indica los días de apertura de tu negocio</legend>
          <ul>
            <li>
              <span>Lunes:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day1" value="1" />
              <label>Cerrado</label>
              <input type="radio" v-model="day1" value="0" />
            </li>
            <li>
              <span for>Martes:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day2" value="2" />
              <label>Cerrado</label>
              <input type="radio" v-model="day2" value="0" />
            </li>
            <li>
              <span for>Miercoles:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day3" value="3" />
              <label>Cerrado</label>
              <input type="radio" v-model="day3" value="0" />
            </li>
            <li>
              <span for>Jueves:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day4" value="4" />
              <label>Cerrado</label>
              <input type="radio" v-model="day4" value="0" />
            </li>
            <li>
              <span for>Viernes:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day5" value="5" />
              <label>Cerrado</label>
              <input type="radio" v-model="day5" value="0" />
            </li>
            <li>
              <span for>Sábado:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day6" value="6" />
              <label>Cerrado</label>
              <input type="radio" v-model="day6" value="0" />
            </li>
            <li>
              <span for>Domingo:</span>
              <label>Abierto</label>
              <input type="radio" v-model="day7" value="7" />
              <label>Cerrado</label>
              <input type="radio" v-model="day7" value="0" />
            </li>
          </ul>
        </fieldset>
      </form>
    </div>
    <button @click="updateData()">Actualizar Cliente</button>
    <div id="changeState">
      <button @click="state = !state">Cambia el estado del negocio</button>
      <select v-model="newStatus" v-show="state">
        <option value="ACTIVO">Activo</option>
        <option value="SIN_VALIDAR">Sin Validar</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="CERRADO">Cerrado</option>
        <option value="CERRADO_BY_ADMIN">Cerrado Por Admin</option>
      </select>
      <button v-show="state" @click="activateBusiness()">Confirmar el cambio de estado</button>
    </div>
  </div>
</template>

<script>
import { getIdToken } from "../../utils";
import getbusinesstoactivatecomp from "@/components/GetBusinessToActivateComp.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "BusinessProfile",
  components: {
    getbusinesstoactivatecomp,
  },
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
      //    pricingList: "",
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
      state: false,
      newProfilePicture: "",
      newStatus: "",
      isPassword: false,
      oldPassword: "",
      newPassword: "",
    };
  },
  methods: {
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    uploadImage(event) {
      this.profilePicture = event.target.files[0];
      this.newProfilePicture = event.target.files[0];
      this.createImage(event.target.files[0]);
    },
    createImage(file) {
      let newProfilePicture = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.newProfilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    toggleState() {
      this.state = true;
    },
    getProfilePicture(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC + picture;
      }
    },
    async getBusiness() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;

        const response = await axios.get(
          "http://localhost:3000/admin/" +
            getIdToken(token) +
            "/business-to-activate/" +
            this.$route.params.id +
            "/check"
        );
        data: response.data.businessData[0];
        this.name = response.data.businessData[0].name;
        this.manager = response.data.businessData[0].manager;
        this.category = response.data.businessData[0].category;
        this.email = response.data.businessData[0].email;
        this.openingTime = response.data.businessData[0].opening_time;
        this.closingTime = response.data.businessData[0].closing_time;
        this.lengthBooking = response.data.businessData[0].length_booking;
        this.description = response.data.businessData[0].description;
        //     this.pricingList = response.data.businessData[0].pricing_list;
        this.bankAccount = response.data.businessData[0].bank_account;
        this.allotment = response.data.businessData[0].allotment;
        this.allotmentAvailable =
          response.data.businessData[0].allotment_available;
        this.status = response.data.businessData[0].status;
        this.profilePicture = response.data.businessData[0].profile_picture;
        if (this.profilePicture !== null) {
          this.profilePicture =
            process.env.VUE_APP_STATIC + this.profilePicture;
        }
        this.city = response.data.businessData[0].city;
        this.telephone = response.data.businessData[0].telephone;
        this.zipCode = response.data.businessData[0].zip_code;
        this.province = response.data.businessData[0].province;
        this.line1 = response.data.businessData[0].line1;
        this.line2 = response.data.businessData[0].line2;
        this.day1 = response.data.openingDays[0].day;
        this.day2 = response.data.openingDays[1].day;
        this.day3 = response.data.openingDays[2].day;
        this.day4 = response.data.openingDays[3].day;
        this.day5 = response.data.openingDays[4].day;
        this.day6 = response.data.openingDays[5].day;
        this.day7 = response.data.openingDays[6].day;
      } catch (error) {
        console.log(error);
      }
    },

    goBack() {
      window.history.back();
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
      //     this.pricingList = dataBusiness.pricingList;
      this.allotment = dataBusiness.allotment;
      this.allotmentAvailable = dataBusiness.allotmentAvailable;
      let picture = response.data.data[0].profile_picture;
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
    async activateBusiness() {
      const result = await Swal.fire({
        title: "¿Estás seguro de cambiar el estado del negocio?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, ¡estoy seguro!",
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
              "/business-to-activate/" +
              this.$route.params.id +
              "/activate",
            {
              newStatus: this.newStatus,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Has actualizado el negocio correctamente",
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
          title: "Actualización cancelada",
          icon: "error",
        });
      }
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
        userNewData.append("picture", this.profilePicture);
        userNewData.append("description", this.description);
        userNewData.append("bankAccount", this.bankAccount);
        userNewData.append("telephone", this.telephone);
        //      userNewData.append("pricingList", this.pricingList);
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
          "http://localhost:3000/business/" + this.$route.params.id,
          userNewData,
          {
            header: { "Content-type": "multipart/form-data" },
          }
        );
        console.log(response);
        Swal.fire({
          icon: "success",
          title: "Has actualizado el negocio correctamente",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
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
#checkBusiness {
  background: linear-gradient(
      rgba(141, 153, 174, 0.8),
      rgba(141, 153, 174, 0.5)
    ),
    url(../../assets/tempo.jpg);
  min-height: 100vh;
}

button:hover,
#profilePicture:hover {
  background-color: coral;
  color: white;
  cursor: pointer;
}

#picture {
  display: flex;
  flex-direction: column;
  align-items: center;
}
[type="file"] {
  display: none;
}

.hide {
  display: none;
}
#head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  flex-wrap: wrap;
}

#picture {
  margin: 1rem;
  align-self: center;
}
img {
  display: block;
  width: 18rem;
  height: 100%;
  margin-bottom: 1rem;
}
span {
  margin: 3rem;
}
li {
  list-style: none;
  text-align: right;
  padding-right: 4rem;
}
select {
  position: center;
  border-radius: 1rem;
  border: 1rem;
  margin: 0.2rem 0.2rem;
}

form#first > fieldset button {
  margin: 1rem auto;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
fieldset {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 1rem;
}

fieldset > input {
  width: 15rem;
  margin-bottom: 0.3rem;
  border-radius: 5px;
  border: 0;
}
label {
  margin: 0.2rem;
}
form > input {
  width: 20rem;
  margin-bottom: 0.3rem;
  border-radius: 5px;
  border: 0;
}
#provincia {
  margin-left: 5rem;
  text-align: center;
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
#profilePicture {
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
[type="file"] {
  display: none;
}

#changeState {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 700px) {
  .intro {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    background: linear-gradient(
        rgba(141, 153, 174, 0.8),
        rgba(141, 153, 174, 0.5)
      ),
      url(../../assets/tempo.jpg);
  }

  #first {
    height: auto;
  }

  #first > fieldset {
    width: 18rem;
  }
  form {
    background-color: grey;
    padding: 1rem;
    border-radius: 1rem;
    border: solid 0.1rem coral;
    height: 22rem;
    width: 22rem;
  }

  #password {
    height: inherit;
    width: inherit;
    background-color: lightgray;
  }

  #password > input {
    width: 15rem;
  }

  #availability {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    width: auto;
    height: auto;
  }

  #opening > ul {
    padding: 0.5rem;
  }

  #opening > ul > li {
    padding: 0.1rem 0.5rem;
  }

  #availability > fieldset {
    margin: 0 1rem;
    background-color: coral;
    padding: 1rem;
    border-radius: 1rem;
    background-color: grey;
  }

  fieldset.form {
    margin: 0;
  }

  .intro > form,
  fieldset {
    margin: 2rem;
  }
  img {
    border-radius: 1rem;
  }
}
</style>
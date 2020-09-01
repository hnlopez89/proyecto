<template>
  <div id="About">
    <button @click="goBack()">Go Back</button>

    <h1>Acerca de mí: Hugo Nogueira López</h1>

    <div id="pictures">
      <img src="../assets/html5_logo.png" />
      <img src="../assets/css3.png" />
      <img id="js" src="../assets/js.png" />
      <img src="../assets/vuejs.png" />
      <img id="node" src="../assets/nodejs.png" />
      <img src="../assets/sql.png" />
    </div>
    <div id="main">
      <img src="../assets/me.jpg" />
      <div id="competences">
        <h2>Competencias en:</h2>
        <ul>
          <li>Programación</li>
          <li>Hoteles</li>
        </ul>
        <h3>Contacto:</h3>
        <ul id="contact">
          <li>
            <img src="../assets/gmail.png" />
          </li>
          <li>
            <img src="../assets/linkedin.png" />
          </li>
          <li>
            <img src="../assets/twitter.png" />
          </li>
          <li>
            <img src="../assets/instagram.png" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.back();
    },
  },
};
</script>

<style scoped >
button {
  margin-top: 3rem;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border: 0.1rem solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  font-weight: bold;
  background-color: black;
  color: coral;
  text-align: center;
  margin-bottom: 0.5rem;
}
#About {
  min-height: 100vh;
  background-color: grey;
}

#pictures {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
img {
  width: 15rem;
  height: 10rem;
  display: inline-block;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
li {
  list-style: none;
}

#competences {
  background-color: white;
  padding: 3rem;
  border: solid 0.1rem coral;
  border-radius: 1rem;
}

#competences > h3 {
  margin: 3rem 0 1.5rem 0;
}

#js,
#node {
  width: 11rem;
}
#main {
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
#main > img {
  height: 25rem;
  width: auto;
  border: solid 0.1rem coral;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

#contact {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

#contact > li img {
  height: 03rem;
  width: auto;
}

#contact > li {
  margin: 0.5rem;
}
</style>
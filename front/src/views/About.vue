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
            <a target="_blank" href="mailto:hnlopez89@gmail.com?Subject=Contacto%20Tempo%20">
              <img src="../assets/gmail.png" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/hugo-nogueira-l%C3%B3pez-1255839a/"
            >
              <img src="../assets/linkedin.png" />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://twitter.com/hugonoglopez?lang=es"></a>
            <img src="../assets/twitter.png" />
          </li>
          <li>
            <a target="_blank" href="https://www.instagram.com/nogueira.hugo/">
              <img src="../assets/instagram.png" />
            </a>
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
ul {
  padding: 0;
}
li {
  list-style: none;
  margin: 1rem 0;
  font-size: 1.2rem;
}

#competences {
  background-color: white;
  padding: 3rem;
  border: solid 0.1rem coral;
  border-radius: 1rem;
  margin: 1rem;
}

#competences > h3 {
  margin: 3.5rem 0 1.5rem 0;
  font-size: 1.5rem;
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
  padding-bottom: 2rem;
}
#main > img {
  margin: 1rem;
  height: 30rem;
  width: auto;
  border: solid 0.1rem coral;
  border-radius: 1rem;
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
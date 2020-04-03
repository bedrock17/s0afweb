<template>
  <div id="app">
    <router-view/>
		<p></p>
		<router-link to="/" class="btn btn-outline-info"> 시작페이지로 </router-link>
		<p></p>
		<h1>SPONSOR</h1>
		<a target="_blank" href="https://panty.run" alt="탈알고" title="탈알고"><img :src="require('./assets/talalgo.png')" /></a>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

input, input:before, input:after {
  -webkit-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
}

</style>

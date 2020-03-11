<template>
  <div id="app">
    <router-view/>
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

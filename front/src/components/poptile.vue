<template>
  <div class="poptile">
    <!-- <h1>POPTILE</h1> -->
    <h2>SCORE : {{ game.score }}</h2>

		<div v-if="game.gameOver"> 
			<h1> GAME OVER  </h1>

			<h1 class="retry" v-on:click="retryGame"> RETRY? </h1>
		</div>

		<div v-show="!game.gameOver">
    <canvas id="cvs" width="245px" height="460px"> </canvas>
		</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game } from "../poptile"

@Component
export default class Poptile extends Vue {

  game: Game = new Game()

  mounted() {
    this.game.startGame()
  }

	retryGame() {
		this.game.startGame()

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

* {
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

canvas {
  border: 1px solid black;
  /* margin-left: 10px; */
  /* margin-top: 10px; */
  /* width: 100%; */
  /* height: 500px; */
}

.retry {
	color: #fa0;
	&:hover {
		color: #0af;
	}
}

.title {
  color: #00aaff;
  font-weight: bold;
  font-size: 20pt;
  padding-left: 50px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

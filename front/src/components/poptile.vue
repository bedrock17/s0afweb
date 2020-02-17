<template>
  <div class="poptile">
    <!-- <h1>POPTILE</h1> -->
		
		<div v-show="!gameStart">
			<input type="text" v-model=name class="form-control" placeholder="Name">
			<p> </p>
			<input type="button" class="btn btn-outline-primary" value="start" v-on:click=startBtnHandle>
		</div>

		<div v-show="gameStart">
			<h2> [{{name}}] SCORE : {{ game.score }}</h2>

			<div v-if="game.gameOver"> 
				<h1> GAME OVER  </h1>
				<h1 class="retry" v-on:click="retryGame"> RETRY? </h1> <br />
			</div>

			<div v-show="!game.gameOver">
			<canvas id="cvs" width="245px" height="460px"> </canvas>
			</div>
		</div>

		<hr v-if="game.gameOver" />

		<div v-if="game.gameOver && RankList.length > 0">
			<p v-for="item in RankList" v-bind:key="item.UserName"> {{item.UserName}} : {{item.Score}} </p>
		</div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import axios from 'axios'
import { Game } from "../poptile"

@Component
export default class Poptile extends Vue {

	game: Game = new Game()
	gameStart = false
	name = ""
	RankList = []

  mounted() {
    this.game.startGame()

		this.game.gameOverCallback = this.gameOverCallback
  }

	gameOverCallback() {
		this.RankList = []
		axios.post('/api/poptilerank', {
			UserName: this.name,
			Score: this.game.score,
			TouchCount: 0,
			CheckSumSha256: ""
			}).then((res: any) => {
			this.RankList = res.data.RankList
			})
	}

	startBtnHandle() {
		if (this.name.length > 0)
			this.gameStart = true
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
	color: #0af;
	&:hover {
		color: #fa0;
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

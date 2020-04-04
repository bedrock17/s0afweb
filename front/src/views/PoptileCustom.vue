<template>
  <div class="poptileCustom">
  
		<b-form-checkbox v-model="game.dropEffect" name="check-button" switch>
      떨어짐 효과
    </b-form-checkbox>

		<b-form-checkbox v-model="game.deleteEffect" name="check-button" switch>
      지우는 효과
    </b-form-checkbox>

		<div v-show="!gameStart">
			
			<input type="number" class="form-control gameSettingInput" placeholder="width" maxlength="2" v-model=mapWidth>
			<input type="number" class="form-control gameSettingInput" placeholder="height" maxlength="2" v-model=mapHeight>

			<input type="number" class="form-control gameSettingInput" placeholder="블럭개수" maxlength="2" v-model=blockMax>
			<input type="button" class="btn btn-outline-primary" value="생성!" v-on:click=blockColorCode> <br>

			
			<input type="text" class="form-control gameSettingInput" placeholder="색상코드"	 v-for="(item, index) in colorArray" v-model="colorArray[index]" v-bind:key="index">
			
			
			<input v-if="colorArray.length > 1"  type="button" class="btn btn-outline-primary" value="START!" v-on:click=startBtnHandle>
		
		</div>

		<div v-show="gameStart">

			<input type="button" class="btn btn-outline-primary" value="RESET" v-on:click=reset>
			
			<h2> 
				SCORE: {{ game.displayScore }}
			</h2>

			<div v-if="game.gameOver"> 
				<h1> GAME OVER  </h1>
				<h1 class="retry" v-on:click="retryGame"> RETRY? </h1> <br />
			</div>

			<div v-show="!game.gameOver">
				<canvas id="cvs" :width="Number(this.mapWidth)*31 + 'px'" :height="Number(this.mapHeight)*31 + 'px'"> </canvas>
			</div>
		</div>


  </div>
</template>

<script lang="ts">
		// <div v-if="game.gameOver && RankList.length > 0">
		// 	<p v-for="item in RankList" v-bind:key="item.UserName"> {{item.UserName}} : {{item.Score}} </p>
		// </div>
		
import { Component, Vue } from "vue-property-decorator"
import { Game } from "../poptile"

const gGame = new Game() //게임은 하나만 돌아야 되니 이곳에서 한번 할당하고 다시 만들지 않는다.

function randColor(): number {
	return Math.floor(Math.random() * (255)) 
}

@Component({
  name: 'poptileCustom',
  components: {
  }
})
export default class PoptileCustom extends Vue {

	game = gGame
	gameStart = false
	RankList = []
	blockMax = "3" //입력이 텍스트라 문자열로 처리
	mapWidth = "8"
	mapHeight = "15"
	colorArray: string[] = []

  mounted() {
		this.game.gameOver = true
	}
	
  blockColorCode () {
		
		this.colorArray = []

		for (let i = 0; i < (Number(this.blockMax)+1); i++) {
			if (i == 0)
				this.colorArray.push( `(255, 255, 255)` )
			else
				this.colorArray.push( `(${randColor()}, ${randColor()}, ${randColor()})` )
		}
		return this.colorArray
  }

	startBtnHandle() {

		if (Number(this.blockMax) > 0) {
			this.game.setColors(this.colorArray)
			this.game.setMapSize(Number(this.mapWidth), Number(this.mapHeight))
			this.game.startGame()
			this.gameStart = true
		}
	}

	retryGame() {
		this.game.startGame()
	}

	reset() {
		this.gameStart = false
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
  user-select: initial;
}

input, input:before, input:after {
  -webkit-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
}


.gameSettingInput {
	width: 500px;
	margin: auto;
}

@media (max-width: 500px) {
  .gameSettingInput {
    width: 100%;
  }
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

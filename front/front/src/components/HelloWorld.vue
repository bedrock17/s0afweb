<template>
  <div class="hello">
    <h1> POPTILE </h1>
    
	<h1> SCORE : {{game.score}} </h1>

    <canvas id="cvs" width="250px" height="470px">

    </canvas>

<!-- <body>
  <div class="title">
    POPTILE
  </div>

  <div width="100%">
    <canvas id="cvs" width="250px" height="470px">

    </canvas>
  </div>

</body>
 -->

  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Game } from '../poptile'



@Component
export default class HelloWorld extends Vue {
	@Prop() private msg!: string;
	
	game: Game = new Game()
	

	mounted () {
		console.log("mount")
		this.game.startGame()
	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

canvas {
  border: 1px solid black;
  /* margin-left: 10px; */
  /* margin-top: 10px; */
  /* width: 100%; */
  /* height: 500px; */
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

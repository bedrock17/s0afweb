<template>
  <div class="poptile">
    <Help />

    <b-form-checkbox v-model="game.dropEffect" name="check-button" switch>
      떨어짐 효과
    </b-form-checkbox>

    <b-form-checkbox v-model="game.deleteEffect" name="check-button" switch>
      지우는 효과
    </b-form-checkbox>

    <div v-show="!gameStart">
      <input
        type="text"
        v-model="name"
        class="form-control username"
        placeholder="사용자이름"
        maxlength="30"
      />
      <p></p>
      <input
        type="button"
        class="btn btn-outline-primary"
        value="START!"
        v-on:click="startBtnHandle"
      />
    </div>

    <div v-show="gameStart">
      <h2>
        <span v-if="name.length > 0"> [{{ name }}] </span>
        <span v-else>
          {{ name }}
        </span>
        SCORE: {{ game.displayScore }}
      </h2>

      <div v-if="game.gameOver">
        <h1>GAME OVER</h1>
        <h1 class="retry" v-on:click="retryGame">RETRY?</h1>
        <br />
      </div>

      <div v-show="!game.gameOver">
        <canvas id="cvs" width="245px" height="460px"> </canvas>
      </div>
    </div>

    <hr v-if="game.gameOver" />

    <Rank v-bind:RankList="RankList" v-if="game.gameOver" />

    <div id="nav" v-if="!gameStart">
      <router-link to="/poptile/rank" class="btn btn-outline-info"
        >RANK</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
// <div v-if="game.gameOver && RankList.length > 0">
// 	<p v-for="item in RankList" v-bind:key="item.UserName"> {{item.UserName}} : {{item.Score}} </p>
// </div>

import Rank from "@/components/rank.vue";
import { Component, Vue } from "vue-property-decorator";
import Help from "@/components/help.vue";
import axios from "axios";
import { Game } from "../poptile";
import { SHA256 } from "../sha256";

const gGame = new Game(); //게임은 하나만 돌아야 되니 이곳에서 한번 할당하고 다시 만들지 않는다.

@Component({
  name: "poptile",
  components: {
    Help,
    Rank
  }
})
export default class Poptile extends Vue {
  game = gGame;
  gameStart = false;
  name = "";
  RankList = [];

  mounted() {
    this.game.gameOverCallback = this.gameOverCallback;
  }

  gameOverCallback() {
    this.RankList = [];
    axios
      .post("/api/poptilerank", {
        UserName: this.name,
        Score: this.game.score,
        TouchCount: this.game.touchcount,
        LineHistory: this.game.lineHistory,
        TouchHistory: this.game.touchHistory,
        Check: SHA256(
          this.name + (this.game.score + this.game.touchcount).toString()
        )
      })
      .then((res: any) => {
        this.RankList = res.data.RankList;
      });
  }

  startBtnHandle() {
    // if (this.name.length > 0) //이름이 없어도 시작할 수 있도록..
    this.game.startGame();
    this.gameStart = true;
  }

  retryGame() {
    this.game.startGame();
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

input,
input:before,
input:after {
  -webkit-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
}

.username {
  width: 500px;
  margin: auto;
}

@media (max-width: 500px) {
  .username {
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

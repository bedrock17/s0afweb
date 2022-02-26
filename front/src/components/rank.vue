<template>
  <div class="Rank">
    <div v-if="RankList && RankList.length > 0">
      <h1>RANK</h1>
      <div>
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Touch</th>
              <th>Score/Touch</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in RankList" v-bind:key="index">
              <td v-if="index == 0" class="name">
                <span class="user-hyper">{{ item.UserName }}</span>
              </td>
              <td v-else-if="item.Score > 200000" class="name">
                <span class="user-rb-first">{{
                  item.UserName.substring(0, 1)
                }}</span>
                <span class="user-rb-last">{{
                  item.UserName.substring(1)
                }}</span>
              </td>
              <td v-else-if="item.Score > 150000" class="name">
                <span class="user-red">{{ item.UserName }}</span>
              </td>
              <td v-else-if="item.Score > 100000" class="name">
                <span class="user-orange">{{ item.UserName }}</span>
              </td>
              <td v-else-if="item.Score > 80000" class="name">
                <span class="user-violet">{{ item.UserName }}</span>
              </td>
              <td v-else-if="item.Score > 60000" class="name">
                <span class="user-blue">{{ item.UserName }}</span>
              </td>
              <td v-else-if="item.Score > 40000" class="name">
                <span class="user-cyan">{{ item.UserName }}</span>
              </td>
              <td v-else-if="item.Score > 30000" class="name">
                <span class="user-green">{{ item.UserName }}</span>
              </td>
              <td v-else class="name">
                <span class="user-gray">{{ item.UserName }}</span>
              </td>

              <td>{{ item.Score }}</td>
              <td>{{ item.TouchCount }}</td>
              <td>{{ `${item.Score / item.TouchCount}`.substring(0, 5) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table .thead-dark th {
  vertical-align: middle;
}

td.name {
  font-weight: bold;
  max-width: 140px;
  word-break: break-word;
}

@media (min-width: 1280px) {
  .Rank {
    display: inline-block;
    width: 50%;
  }
}

.user-hyper {
  animation: hyper 1.5s ease-in-out infinite;
}

@keyframes hyper {
	0%    {color: #f8be00; text-shadow: 0 0 8px rgba(248,190,  0,0.1);}
	20%   {color: #ff0000; text-shadow: 0 0 8px rgba(255,  0,  0,0.1);}
	40%   {color: #ff009a; text-shadow: 0 0 8px rgba(255,  0,154,0.1);}
	60%   {color: #00aaff; text-shadow: 0 0 8px rgba(  0,  0,253,0.1);}
	80%   {color: #00e7d6; text-shadow: 0 0 8px rgba(  0,231,214,0.1);}
	100%  {color: #b0e700; text-shadow: 0 0 8px rgba(176,231,  0,0.1);}
}

.user-rb-first {
  color: black;
}

.user-rb-last {
  color: red;
}

.user-red {
  color: red;
}

.user-orange {
  color: #ff8c00;
}

.user-violet {
  color: #a0a;
}

.user-blue {
  color: blue;
}

.user-cyan {
  color: #03a89e;
}

.user-green {
  color: green;
}

.user-gray {
  color: gray;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class Rank extends Vue {
  @Prop({ default: [] }) private RankList: Array<any> = [];
}
</script>
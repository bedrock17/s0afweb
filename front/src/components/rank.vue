<template>
  <div class="Rank">
    <div v-if="RankList && RankList.length > 0">
      <h1> RANK </h1>
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
							<td class="name"> {{item.UserName}}</td>
							<td> {{item.Score}}</td>
							<td> {{item.TouchCount}}</td>
							<td> {{`${item.Score / item.TouchCount}`.substring(0, 5)}}</td>
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
		max-width: 140px;
		word-break: break-word;
	}
</style>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator"
import axios from 'axios'

@Component
export default class Rank extends Vue {
	@Prop({default: []}) private RankList: Array<any> = []
}
</script>
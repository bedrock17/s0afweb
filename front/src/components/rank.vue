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
							
							
							<td v-if="item.Score > 150000" class="name">
								<span class="user-rb-first">{{item.UserName.substring(0, 1)}}</span>
								<span class="user-rb-last">{{item.UserName.substring(1)}}</span>
							</td>
							<td v-else-if="item.Score > 100000" class="name">
								<span class="user-red">{{item.UserName}}</span>
							</td>
							<td v-else-if="item.Score > 80000" class="name">
								<span class="user-orange">{{item.UserName}}</span>
							</td>
							<td v-else-if="item.Score > 60000" class="name">
								<span class="user-violet">{{item.UserName}}</span>
							</td>
							<td v-else-if="item.Score > 40000" class="name">
								<span class="user-blue">{{item.UserName}}</span>
							</td>
							<td v-else-if="item.Score > 30000" class="name">
								<span class="user-cyan">{{item.UserName}}</span>
							</td>
							<td v-else-if="item.Score > 15000" class="name">
								<span class="user-green">{{item.UserName}}</span>
							</td>
							<td v-else class="name">
								<span class="user-gray">{{item.UserName}}</span>
							</td>


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
		font-weight: bold;
		max-width: 140px;
		word-break: break-word;
	}

	.user-rb-first {
		color: red;
	}
	.user-rb-last {
		color: black;
	}

	.user-red {
		color: red
	}

	.user-orange {
		color: #FF8C00;
	}

	.user-violet {
		color: #a0a;
	}

	.user-blue {
		color: blue;
	}

	.user-cyan {
		color:#03A89E;
	}

	.user-green {
		color: green;
	}

	.user-gray {
		color:gray;
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
<template>
	<div class="search-box">
		<i class="fa fa-search"></i>
		<input class="box" :placeholder="placeholder" v-model="query" ref="query"/>
		<i class="fa fa-close" v-show="query" @click="close"></i>
	</div>
</template>

<script>
	import {debounce} from 'common/js/util'
	export default{
		props:{
			placeholder: {
				type: String,
				default: '搜索歌曲歌手、歌手'
			}
		},
		data(){
			return {
				query: ''
			}
		},
		created(){
			this.$watch('query', debounce((newQuery) => {
				this.$emit('query', newQuery)
			},200))
		},
		methods:{
			close(){
				this.query = ''
			},
			setQuery(query){
				this.query = query
			},
			blur(){
				this.$refs.query.blur();
			}
		}
	}
</script>

<style scoped lang="less">
  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: #333;
    border-radius: 6px;
    .icon-search{
      font-size: 24px;
      color:#222;
    }
    .box{
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: #333;
      color: #ddd;
      font-size: 14px;
      border: none;
      &::placeholder{
        color: #666;
      }
    }
  }
</style>
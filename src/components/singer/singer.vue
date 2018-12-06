<template>
	<div class="singer" ref="singer">
		<listview :data="SingerList" @select="selectSinger" ref="list"></listview>
		<router-view></router-view>
	</div>
</template>

<script>
	import Listview from 'base/listview/listview'
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {playlistMixin} from 'common/js/mixin'
	//vuex语法糖
	import {mapMutations} from 'vuex'

	const HOT_NAME = '热门'
	const HOT_SINGER_LEN = 10

	export default{
		mixins: [playlistMixin],
		components:{
			Listview
		},
		data(){
			return {
				SingerList: []
			}
		},
		created(){
			this._getSingerList();
		},
		methods:{
			handlePlaylist(playlist){
		      const bottom = playlist.length > 0 ? '50px' : '';
		      this.$refs.singer.style.bottom = bottom;
		      this.$refs.list.refresh();
		    },
			//获取数据
			_getSingerList(){
				getSingerList().then((res) => {
					if(res.code === ERR_OK){
						this.SingerList = this._normalizeSinger(res.data.list)
					}
				})
			},
			//数据进行格式转换
			_normalizeSinger(list){
				//首先创建map对象
				//对象里面第一个对象是hot对象
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach((item,index) => {
					if(index < HOT_SINGER_LEN){
						map.hot.items.push({
							id: item.Fsinger_id,
							mid: item.Fsinger_mid,
							name: item.Fsinger_name,
							avatar: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
					const key = item.Findex
					if(!map[key]){
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push({
						id: item.Fsinger_id,
						mid: item.Fsinger_mid,
						name: item.Fsinger_name,
						avatar: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
					})
				})
				//现在mpa是个对象，需要转为有序列表
				let hot = []
				let ret = []
				for(let key in map){
					let val = map[key]
					//match()正则校验
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					}else if(val.title === HOT_NAME){
						hot.push(val)
					}
				}
				//ret数组排序
				ret.sort((a,b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})

				return hot.concat(ret)
			},
			selectSinger(item){
				this.$router.push({
					path: `/singer/${item.id}`
				});
				this.setSinger(item)
			},
			...mapMutations({
				setSinger: "setSinger"
			})
		}
	}
</script>

<style scoped lang="less">
	.singer{
		position: fixed;
		top: 88px;
		bottom: 0;
		width: 100%;
	}
</style>
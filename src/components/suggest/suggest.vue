<template>
	<scroll class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" ref="suggest" @scrollToEnd="searchMove" @beforeScroll="listScroll">
		<ul class="suggest-list">
			<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			<loading v-show="hasMove" :title="title"></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMove && !result.length">
			<no-result title="瞎搜索啥呢~无搜索结果"></no-result>
		</div>
	</scroll>
</template>

<script>
	import {search} from 'api/search'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import {mapMutations, mapActions} from 'vuex'
	import NoResult from 'base/no-result/no-result'

	const perpage = 20

	export default{
		components:{
			Scroll,
			Loading,
			NoResult
		},
		props:{
			query:{
				type: String,
				default: ''
			},
			showSinger:{
				type: Boolean,
				default: true
			}
		},
		data(){
			return {
				result:[],
				page: 1,
				pullup: true,
				beforeScroll: true,
				hasMove: true,
				title: ""
			}
		},
		watch:{
			query(){
				this.search();
			}
		},
		methods:{
			search(){
				this.page = 1
				this.hasMove = true
				this.$refs.suggest.scrollTo(0,0)
				search(this.query, this.page, this.showSinger,perpage).then((res) => {
					if(res.code === ERR_OK){
						this.result = this._genResult(res.data)
						this._checkMove(res.data)
					}
				})
			},
			_genResult(data){
				let ret =[]
				if(data.zhida && data.zhida.singerid){
					ret.push({...data.zhida, ...{type:'singer'}})
				}
				if(data.song){
					ret = ret.concat(this._normalizeSongs(data.song.list))
				}
				return ret
			},
			_normalizeSongs(list){
				let ret = []
				list.forEach((musicData) => {
					if(musicData.songid && musicData.albumid){
						ret.push(createSong(musicData))
					}
				})
				return ret
			},
			getIconCls(item){
				if(item.type === 'singer'){
					return 'fa fa-music'
				}else{
					return 'fa fa-music'
				}
			},
			getDisplayName(item){
				if(item.type === 'singer'){
					return item.singername
				}else{
					return `${item.name}-${item.singer}`
				}
			},
			//检查是否加载到全部
			_checkMove(data){
				const song = data.song
				if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum){
					this.hasMove = false
				}
			},
			searchMove(){
				if(!this.hasMove){
					return
				}
				this.page++
				search(this.query, this.page, this.showSinger, perpage).then((res)=>{
					if(res.code === ERR_OK){
						//concat数组拼接
						this.result = this.result.concat(this._genResult(res.data))
						this._checkMove(res.data)
					}
				})
			},
			selectItem(item){
				if(item.type === 'singer'){
					const singer = {
						id: item.singermid,
						name: item.singername,
						avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
					}
					this.$router.push({
						path: `/search/${singer.id}`
					})
					this.setSinger(singer)
				}else{
					this.inserSong(item)
				}
			},
			listScroll(){
				this.$emit('listScroll');
			},
			...mapMutations({
				setSinger: 'setSinger'
			}),
			...mapActions([
				'inserSong'
			])
		}
	}
</script>

<style scoped lang="less">
  .suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
      padding: 0 30px;
      .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .icon{
        flex: 0 0 30px;
        width: 30px;
        font-size: 14px;
        color: #999;
      }
      .name{
        flex: 1;
        font-size: 14px;
        color: #999;
        overflow: hidden;
        .text{
        }
      }
    }
    .no-result-wrapper{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
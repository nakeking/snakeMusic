<template>
	<transition name="motion">
		<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
	</transition>
</template>

<script>
	import {getSingerDetail} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {mapGetters} from 'vuex'
	import {createSong} from 'common/js/song'
	import MusicList from 'components/music-list/music-list'

	export default {
		components:{
			MusicList
		},
		data(){
			return {
				songs: []
			}
		},
		computed:{
			title(){
				return this.singer.name
			},
			bgImage(){
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			])
		},
		created(){
			this._getDetail();
		},
		methods:{
			_getDetail(){
				if(!this.singer.id){
					this.$router.push('/singer');
					return;
				}
				getSingerDetail(this.singer.mid).then((res) => {
					if(res.code === ERR_OK){
						this.songs = this._normalizeSongs(res.data.list);
					}
				})
			},
			_normalizeSongs(list){
				let ret = [];
				list.forEach((item) => {
					let {musicData} = item;
					if(musicData.songid && musicData.albummid){
						ret.push(createSong(musicData));
					}
				})
				return ret;
			}
		}
	}
</script>

<style scoped lang="less">
	.singer-detail{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: #222;
		z-index: 100;
	}

	.motion-enter-active,
	.motion-leave-active{
		transition:all 0.3s;
	}

	.motion-enter,
	.motion-leave-to{
		transform:translate3d(100%,0,0);
	}
</style>
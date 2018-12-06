<template>
	<div class="recommend" ref="recommend">
		<scroll class="recommend-content" ref="content">
      <div>
  			<!--推荐轮播图-->
  			<div v-if="recommends.length" class="slider-wrapper">
  				<slider>
  					<div v-for="item in recommends">
  						<a :href="item.linkUrl">
  							<img class="needsclick" :src="item.picUrl" />
  						</a>
  					</div>
  				</slider>
  			</div>
  			<!-- 推荐歌单列表 -->
  			<div class="recommend-list">
  				<h1 class="list-title">热门歌单推荐</h1>
  				<ul>
            <li v-for="item in discList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h3 class="name" v-html="item.creator.name"></h3>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
  				</ul>
  			</div>
  		</div>
      <loading class="loading-container" v-show="!discList.length"></loading>
    </scroll>
    <router-view></router-view>
	</div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
	import Slider from 'base/slider/slider'
	import {getRecommend,getDiscList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
	export default{
    mixins: [playlistMixin],
		components:{
			Slider,
      Scroll,
      Loading
		},
		data(){
			return {
				recommends: [],
        discList: []
			}
		},
		created(){
			this._getRecommend();
      this._getDiscList();
		},
		methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '50px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.content.refresh();
      },
			_getRecommend(){
				getRecommend().then((res) => {
					if(res.code === ERR_OK){
						this.recommends = res.data.slider;
					}
				})
			},
      _getDiscList(){
        getDiscList().then((res) => {
          if(res.code === ERR_OK){
            this.discList = res.data.list;
          }
        })
      },
      selectItem(item){
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'setDisc'
      })
		}
	}
</script>

<style scoped lang="less">
.recommend{
	position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content{
	  height: 100%;
      overflow: hidden;
      .slider-wrapper{
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list{
        .list-title{
          height: 45px;
          line-height: 45px;
          text-align: center;
          font-size: 14px;
          color: yellow;
        }
        ul{
          padding-left: 0;
          margin: 0;
        }
        .item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 10px 20px;
          .icon{
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: 12px;
            .name{
              margin-bottom: 5px;
              color: #fff;
            }
            .desc{
              color: #999;
            }
          }
        }
      }
      .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
}
</style>
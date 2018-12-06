<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back fa fa-chevron-left" @click="history"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-if="songs.length" ref="playbtn" @click="randomAll()">
          <i class="icon-back"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref='layer'></div>
    <scroll :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const TRANSFORM = prefixStyle('transform');

  export default{
    mixins: [playlistMixin],
    components:{
      SongList,
      Scroll,
      Loading
    },
    props:{
      bgImage:{
        type: String,
        default: ''
      },
      songs:{
        type: Array,
        default: []
      },
      title:{
        type: String,
        default: ''
      },
      rank:{
        type:Boolean,
        default: false
      }
    },
    data(){
      return {
        scrollY: 0,
        probeType: 3,
        listenScroll: true,
        bgImageY: 0
      }
    },
    computed:{
      bgStyle(){
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted(){
      this.bgImageY = this.$refs.bgImage.clientHeight;
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    watch:{
      scrollY(newY){
        let tranlateY = Math.min(-newY, this.bgImageY-40);
        let zIndex = 0;
        let scale = 1;

        this.$refs.layer.style[TRANSFORM]= `translate3d(0,${-tranlateY}px,0)`
        //this.$refs.layer.style['webkitTransform']= `translate3d(0,${-tranlateY}px,0)`

        const percent = Math.abs(newY / this.bgImageY);
        //设置缩放效果
        if(newY > 0){
          scale = 1 + percent;
          zIndex = 10;
        }

        if(tranlateY >= this.bgImageY-40){
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = 40+'px';
          this.$refs.playbtn.style.display = 'none';
        }else{
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playbtn.style.display = '';
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style[TRANSFORM] = `scale(${scale})`
        //this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    },
    methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '50px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      history(){
        history.go(-1);
      },
      selectItem(item, index){
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      randomAll(){
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    }
  }
</script>

<style scoped lang="less">
.music-list{
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #222;
  .back{
    position:absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back{
      display: block;
      padding: 10px;
      font-size: 16px;
      color: #ffcd32;
    }
  }
  .title{
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    margin: 0;
  }
  .bg-image{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper{
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play{
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid #ffcd32;
        color: #ffcd32;
        border-radius: 100px;
        font-size: 0;
        .icon-play{
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: 12px;
        }
        .text{
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
      }
    }
    .filter{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer{
    position: relative;
    height: 100%;
    background: #222;
  }
  .list{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #222;
    .song-list-wrapper{
      padding: 20px 30px
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
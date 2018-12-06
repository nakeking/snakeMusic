<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
					<div class="back" @click="back()">
						<i class="icon-back fa fa-chevron-left"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle">
					<div class="middle-l" v-show="currentDot === 'cd'">
						<div class="cd-wrapper">
							<div class="cd" :class="cdCss">
								<img class="image" :src="currentSong.image">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{playingLyricP}}</div>
							<div class="playing-lyric l">{{playingLyric}}</div>
							<div class="playing-lyric">{{playingLyricN}}</div>
						</div>
					</div>
					<scroll v-if="currentLyric" class="middle-r" ref="lyricList" :data="currentLyric.lines">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p class="text" v-for="(line,index) in currentLyric.lines" ref="lyricLine" :class="{current:currentLineNum == index}">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{active: currentDot === 'cd'}" @click="cdshow()"></span>
						<span class="dot" :class="{active: currentDot === 'lyric'}" @click="lyricshow()"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<input type="range" name="progress" :max="currentSong.duration" min="0" step="1" v-model="currentTime" ref="range" @change="changeTime($event)"/>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left">
							<i class="fa" :class="iconMode" @click="changeMode"></i>
						</div>
						<div class="icon i-left">
							<i class="fa fa-backward" @click="pre()"></i>
						</div>
						<div class="icon i-center">
							<i class="fa" :class="playIcon" @click="togglePlaying()"></i>
						</div>
						<div class="icon i-right">
							<i class="fa fa-forward" @click="next()"></i>
						</div>
						<div class="icon i-right">
							<i class="fa fa-heart"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open()">
				<div class="icon">
					<img :class="cdCss" width="40" height="40" :src="currentSong.image">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<i class="fa" :class="playIcon" @click.stop="togglePlaying()"></i>
				</div>
				<div class="control">
					<i class="fa" :class="iconMode" @click.stop="changeMode()"></i>
				</div>
			</div>
		</transition>
		<!--@canplay="ready" @error="error"-->
		<audio :src="currentSong.url" ref="audio" @timeupdate="updateTime($event)" @ended="ended($event)"></audio>
	</div>
</template>

<script>
	//vuex语法糖
	import {mapGetters, mapMutations} from 'vuex'
	import {playMode} from 'common/js/config'
	import {shuffle} from 'common/js/util'
	import Scroll from 'base/scroll/scroll'
	import Lyric from 'lyric-parser'
	//create-keyframe-animation插件，js实现css3动画
	//import animations from 'create-keyframe-animation'
	//环形进度条，失败
	//import ProgressCircle from 'base/progress-circle/progress-circle'
	export default{
		components: {
			//ProgressCircle
			Scroll
		},
		data(){
			return {
				songReady: false,
				currentTime: 0,
				currentLyric: null,
				currentLineNum: 0,
				currentDot: 'cd',
				playingLyric: null,
				playingLyricP: null,
				playingLyricN: null
			}
		},
		computed:{
			//根据this.play值更好css样式
			playIcon(){
				return this.playing? 'fa-pause-circle' : 'fa-play-circle'
			},
			//根据this.play值更好css样式
			cdCss(){
				return this.playing? 'play' : 'play pause';
			},
			iconMode(){
				return this.mode === playMode.sequence? 'fa-navicon' : this.mode === playMode.loop? 'fa-refresh' : 'fa-random'
			},
			//vuex语法糖获取state数据进行监听
			...mapGetters([
				'fullScreen',
				'playlist',
				'currentSong',
				'playing',
				'currentIndex',
				'mode',
				'sequenceList'
			])
		},
		watch:{
			//音乐加载完毕播放音乐
			currentSong(newSong, oldSong){
				if(newSong.id === oldSong.id){
					return
				}
				if(this.currentLyric){
					//lyric-parser Api(stop()暂停方法)
					this.currentLyric.stop();
				}
				this.$nextTick(() => {
					//console.log(this.currentSong)
					this.$refs.audio.play();
					this._getLyric();
				})
			},
			//监听playing值播放暂停音乐
			playing(){
				let audio = this.$refs.audio;
				this.playing? audio.play() : audio.pause()
			}
		},
		methods:{
			//打开播放页面
			open(){
				this.setFullScreen(true)
			},
			//关闭播放页面
			back(){
				this.setFullScreen(false)
			},
			//提交到state.playing的值
			togglePlaying(){
				this.setPlayState(!this.playing);
				if(this.currentLyric){
					//lyric-parser Api(togglePlay()切换播放/暂停状态)
					this.currentLyric.togglePlay();
				}
			},
			//上一首歌
			pre(){
				// if(!this.songReady){
				// 	return
				// }
				let index = this.currentIndex - 1;
				if(this.playlist.length === 1){
					this.loop();
				}else{
					if(index === -1){
						index = this.playlist.length - 1;
					}
					this.setCurrentIndex(index);
					if(!this.playing){
						this.setPlayState(!this.playing);
					}
				}
				//this.songReady = false
			},
			//下一首歌
			next(){
				// if(!this.songReady){
				// 	return
				// }
				let index = this.currentIndex + 1;
				if(this.playlist.length === 1){
					this.loop()
				}else{
					if(index === this.playlist.length){
						index = 0;
					}
					this.setCurrentIndex(index);
					if(!this.playing){
						this.setPlayState(!this.playing);
					}
				}
				
				//this.songReady = false
			},
			//audio自带函数，监听当前音乐播放位置
			updateTime(e){
				this.currentTime = e.target.currentTime;
				this.$refs.range.style.background= `-webkit-linear-gradient(left, #ffcd32 0%,#ffcd32 ${(this.currentTime / this.currentSong.duration) * 100}%, rgba(255,255,255,0.2) 0%)`
			},
			//事件格式转换
			format(interval){
				interval = interval  | 0;
				const minute = interval / 60 | 0
				const secound = interval % 60
				return `${minute}:${this._pad(secound)}`
			},
			//秒数补零
			_pad(num){
				let len = num.toString().length;
				while(len < 2){
					num = `0${num}`;
					len++;
				}
				return num;
			},
			//点击滚动条播放位置
			changeTime(e){
				this.$refs.audio.currentTime = e.target.value;
				if(this.currentLyric){
					this.currentLyric.seek(this.currentTime * 1000)
				}
			},
			//audio自带函数，监听音乐播放结束
			ended(e){
				if(this.mode === playMode.loop){
					this.loop();
				}else{
					this.next();
				}
			},
			loop(){
				this.$refs.audio.currentTime = 0;
				this.$refs.audio.play();
				if(this.currentLyric){
					//lyric-parser Api(seek方法回到开头)
					this.currentLyric.seek(0);
				}
			},
			//改变播放模式
			changeMode(){
				const mode = (this.mode + 1) % 3;
				this.setPlayMode(mode);

				let list = null;
				if(mode === playMode.random){
					list = shuffle(this.sequenceList);
				}else{
					list = this.sequenceList
				}
				this.resetCurrentIndex(list);
				this.setPlayList(list);
			},
			//随机播放音乐的id
			resetCurrentIndex(list){
				let index = list.findIndex((item) => {
					return item.id === this.currentSong.id
				})
				this.setCurrentIndex(index);
			},
			//获取歌词
			_getLyric(){
				this.currentSong.getLyric().then((lyric) => {
					this.currentLyric = new Lyric(lyric, this.handleLyric);
					if(this.playing){
						//lyric-parser Api(play()方法开始播放)
						this.currentLyric.play();
					}
					//console.log(this.currentLyric);
				}).catch(() => {
					this.currentLyric = null;
					this.playingLyric = '';
					this.currentLineNum = 0;
				})
			},
			handleLyric({lineNum, txt}){
				this.currentLineNum = lineNum;
				if(lineNum > 5){
					let lineEl = this.$refs.lyricLine[lineNum - 5];
					this.$refs.lyricList.scrollToElement(lineEl, 1000)
				}else{
					this.$refs.lyricList.scrollToElement(0,0, 1000)
				}
				if(!txt){
					return
				}
				if(lineNum === 0){
					this.playingLyricP = null;
				}else{
					this.playingLyricP = this.currentLyric.lines[lineNum-1].txt
				}
				this.playingLyric = txt
				this.playingLyricN = this.currentLyric.lines[lineNum+1].txt
			},
			cdshow(){
				this.currentDot = 'cd';
			},
			lyricshow(){
				this.currentDot = 'lyric'
			},
			//播放器监听canplay事件，当音乐能正常播放
			// ready(){
			// 	this.songReady = true;
			// },
			//监听播放错误
			// error(){
			//	this.songReady = true
			// },
			//vuex语法糖获取mutation操作
			...mapMutations({
				setFullScreen: 'setFullScreen',
				setPlayState: 'setPlayState',
				setCurrentIndex: 'setCurrentIndex',
				setPlayMode: 'setPlayMode',
				setPlayList: 'setPlayList'
			})
		}
	}
</script>

<style scoped lang="less">
  .player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: #222;
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top{
        position: relative;
        margin-bottom: 25px;
        .back{
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 9px;
            font-size: 16px;
            color: #ffcd32;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          color: #ccc;
        }
        .subtitle{
          line-height: 20px;
          text-align: center;
          font-size: 14px;
          color: #ccc;
      	}
      }
      .middle{
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play{
                animation: rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state: paused;
              }
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: #bbb;
              margin: 10px 0;
            }
     		.l{
     			font-weight: 100;
     			color: #ffcd32;
     		}
          }
        }
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 32px;
              color: #bbb;
              font-size: 14px;
              &.current{
                color: #ffcd32;
                font-weight: 100;
              }
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ccc;
            &.active{
              width: 20px;
              border-radius: 5px;
              background: #fff;
            }
          }
        }
        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time{
            color: #ccc;
            font-size: 12px;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{
            flex: 1;
            vertical-align: middle;
            text-align: center;
            input[name="progress"]{
            	width: 90%;
            	-webkit-appearance: none;
            	height: 3px;
            	border-radius: 1.5px;
            	vertical-align: middle;
            	background: -webkit-linear-gradient(left, #ffcd32 0%,#ffcd32 0%, rgba(255,255,255,0.2) 0%);
            }
            input[name="progress"]::-webkit-slider-thumb{
            	-webkit-appearance: none;
            	width: 14px;
            	height: 14px;
            	border-radius: 50%;
            	background: #ffcd32;
            	border: 3px solid #fff;
            }
          }
        }
        .operators{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: #ffcd32;
            &.disable{
              color: #ffcd32;
            }
            i{
              font-size: 30px;
            }
          }
          .i-left{
            text-align: right;
          }
          .i-center{
            padding: 0 20px;
            text-align: center;
            i{
              font-size: 40px;
            }
          }
          .i-right{
            text-align: left;
          }
          .icon-favorite{
            color: #fff;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0);
        }
        .bottom{
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: #333;
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0;
      }
      .icon{
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img{
          border-radius: 50%;
          &.play{
            animation: rotate 10s linear infinite
          }
          &.pause{
            animation-play-state: paused
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          font-size: 14px;
          color: #ccc;
        }
        .desc{
          font-size: 12px;
          color: #ccc;
        }
      }
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: #ffcd32;
        }
        .icon-mini{
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
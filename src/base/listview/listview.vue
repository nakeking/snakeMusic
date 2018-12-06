<template>
	<scroll class="listview" 
			:data="data" 
			:listenScroll="listenScroll" 
			:probeType="probeType"
			ref="listview"
			@scroll="scroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
						<img class="avatar" v-lazy="item.avatar"/>
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart="onShortcutTouchStart"><!--@touchmove.stop.prevent="onShortcutTouchMove"右侧列表滚动-->
			<ul>
				<li v-for="(item,index) in shorcutList" class="item" :data-index="index" :class="{current: currentIndex === index}">{{item}}</li>
			</ul>
		</div>
		<loading v-show="!data.length" class="loading-container"></loading>
	</scroll>
</template>

<script>
	import Scroll from 'base/scroll/scroll'
	import {getData} from 'common/js/dom'
	import Loading from 'base/loading/loading'
	//每个字母的高度
	const ANCHOR_HEIGHT = 18

	export default{
		components:{
			Scroll,
			Loading
		},
		props:{
			data: {
				type:Array,
				default: []
			}
		},
		data(){
			return {
				scrollY: -1,
				currentIndex: 0
			}
		},
		computed:{
			shorcutList(){
				return this.data.map((group) => {
					return group.title.substr(0,1)
				})
			}
		},
		watch:{
			data(){
				setTimeout(() => {
					this._calculateHeight()
				},20)
			},
			scrollY(newY){
				const listHeight = this.listHeight
				//滚动到顶部, newY > 0
				if(newY > 0){
					this.currentIndex = 0
					return;
				}
				//console.log(-newY)
				for(let i=0; i<listHeight.length; i++){
					let height1 = listHeight[i]
					let height2 = listHeight[i+1]
					if(!height2 || (-newY >= height1 && -newY < height2)){
						this.currentIndex = i
						return;
					}
				}
				this.currentIndex = 0
			}
		},
		created(){
			this.touch = {}
			this.listenScroll = true
			this.listHeight = []
			this.probeType = 3
		},
		methods:{
			onShortcutTouchStart(e){
				let anchorIndex = getData(e.target, 'index')
				if(anchorIndex == null){
					return
				}
				this.currentIndex = parseInt(anchorIndex)
				//获取手指位置
				let firstTouch = e.touches[0]
				this.touch.y1 = firstTouch.pageY
				this.touch.anchorIndex = anchorIndex
				//0为动画时间
				this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0)
			},
			// 右侧列表的滚动，过于复杂暂时注释掉
			// onShortcutTouchMove(e){
			// 	let firstTouch = e.touches[0]
			// 	this.touch.y2 = firstTouch.pageY
			// 	let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
			// 	let anchorIndex =parseInt(this.touch.anchorIndex) + delta
			// 	this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0)
			// },
			refresh(){
				this.$refs.listview.refresh()
			},
			scroll(pos){
				this.scrollY = pos.y
			},
			_calculateHeight(){
				this.listHeight = []
				const list = this.$refs.listGroup
				let height = 0
				this.listHeight.push(height)
				for(let i=0; i< list.length; i++){
					let item = list[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			},
			//因为listview这个组件是子组件,需要派发个事件到父组件，为select
			selectItem(item){
				this.$emit('select', item);
			}
		}
	}
</script>

<style scoped lang="less">
.listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222;
    ul{
    	padding-left: 0;
    	list-style: none;
    	margin: 0;
    }
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        background: #333;
        margin: 0;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        &.current{
          color: #ffcd32;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        background: #333;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
}
</style>
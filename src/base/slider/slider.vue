<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot>
				
			</slot>
		</div>
		<div class="dots">
			<span class="dot" v-for="(item,index) in dots" :class="{'active': currentPageIndex == index}"></span>
		</div>
	</div>
</template>


<script>
	import BScroll from 'better-scroll'
	import {addClass} from 'common/js/dom'
	export default{
		props:{
			//无缝轮播
			loop:{
				type:Boolean,
				default:true
			},
			//自动轮播
			autoPlay:{
				type: Boolean,
				default: true
			},
			//自动轮播间隔
			interval:{
				type:Number,
				default: 4000
			}
		},
		data(){
			return {
				dots: [],
				currentPageIndex:0
			}
		},
		mounted(){
			//获取子元素，设置轮播宽度方法
			this._setSliderWidth();
			//初始化slider方法
			this._initSlider();
			//初始化Dots方法
			this._initDots();
			//自动轮播
			if(this.autoPlay){
				this._play();
			}

			//监听屏幕宽高变化
			window.addEventListener('resize', () => {
				if(!this.slider){
					return;
				}
				this._setSliderWidth(true);
				//better-scroll方法,屏幕改变是从新计算
				this.slider.refresh();
			})
		},
		methods:{
			_setSliderWidth(isResize){
				this.children = this.$refs.sliderGroup.children;
				let width = 0;
				let sliderWidth = this.$refs.slider.clientWidth;
				for(let i=0; i<this.children.length; i++){
					let child = this.children[i];
					//给每一个轮播图图片的div都加一个class(slider-item)，确保样式统一
					addClass(child, 'slider-item');
					child.style.width = sliderWidth + 'px';
					width += sliderWidth;
				}

				//如果无限循环轮播为true
				//因为无缝轮播会多生成两块div出来
				if(this.loop && !isResize){
					width += 2 * sliderWidth;
				}
				//设置sliderGroup宽度为所有轮播图图片元素宽带的和
				this.$refs.sliderGroup.style.width = width + 'px';
			},
			_initSlider(){
				this.slider = new BScroll(this.$refs.slider,{
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap:{
						loop: this.loop,
						threshold: 0.3,
						speed: 400,
					},
					//会与原生click冲突
					//click: true
				});

				//better-scroll监听滚动事件'scrollEnd'
				this.slider.on('scrollEnd', () => {
					//获取当前是第几个子元素
					let pageIndex = this.slider.getCurrentPage().pageX;
					this.currentPageIndex = pageIndex;

					if(this.autoPlay){
						clearTimeout(this.time);
						this._play();
					}
				});
			},
			_initDots(){
				this.dots = new Array(this.children.length-2);
			},
			_play(){
				let pageIndex = this.currentPageIndex;
				if(this.loop){
					pageIndex += 1;
				}
				if(pageIndex >= 5){
					pageIndex = 0;
				}
				this.time = setTimeout(() => {
					//better-scroll方法，goToPage轮播到pageIndex页,0Y轴方向,400间隔
					this.slider.goToPage(pageIndex, 0, 400)
				}, this.interval);
			}
		},
		//组件销毁清理计时器
		destroyed(){
			clearTimeout(this.time);
		}
	}
</script>

<style scoped lang="less">
  .slider{
	min-height: 1px;
	.slider-group{
	  position: relative;
	  overflow: hidden;
	  white-space: nowrap;
	  .slider-item{
	    float: left;
	    box-sizing: border-box;
	    overflow: hidden;
	    text-align: center;
	    a{
	      display: block;
	      width: 100%;
	      overflow: hidden;
	      text-decoration: none;
	    }
	    img{
	      display: block;
	      width: 100%;
	    }
	  }
	}
	.dots{
	  position: absolute;
	  right: 0;
	  left: 0;
	  bottom: 12px;
	  text-align: center;
	  font-size: 0;
	  .dot{
	    display: inline-block;
	    margin: 0 4px;
	    width: 8px;
	    height: 8px;
	    border-radius: 50%;
	    background: rgba(255,255,255,0.2);
	    &.active{
	      width: 20px;
	      border-radius: 5px;
	      background: rgba(255,255,255,0.8);
	    }
	  }
	}
  }
</style>
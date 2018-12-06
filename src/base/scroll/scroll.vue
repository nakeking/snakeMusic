<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default{
		props:{
			probeType: {
				type: Number,
				default: 1
			},
			click: {
				type: Boolean,
				default: true
			},
			data: {
				type:Array,
				default: null
			},
			//监听滚动事件
			listenScroll: {
				type: Boolean,
				default: false
			},
			//上拉刷新
			pullup:{
				type: Boolean,
				default: false
			},
			beforeScroll:{
				type: Boolean,
				default: false
			}
		},
		mounted(){
			setTimeout(() => {
				this._initScroll();
			},20)
		},
		methods: {
			//初始化滚动列表
			_initScroll(){
				//
				if(!this.$refs.wrapper){
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper, {
					probeType: this.probeType,
					click: this.click
				})

				//监听滚动事件,pos为位置
				if(this.listenScroll){
					let me =this
					this.scroll.on('scroll', (pos) => {
						me.$emit('scroll', pos)
					})
				}

				//上拉刷新
				if(this.pullup){
					//scrollEnd表示scroll滚动停止
					this.scroll.on('scrollEnd', () => {
						if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
							//scrollToEnd表示滚动到底部了
							this.$emit('scrollToEnd')
						}
					})
				}

				//是否滚动
				if(this.beforeScroll){
					this.scroll.on('beforeScrollStart', () => {
						this.$emit('beforeScroll')
					})
				}
			},
			//启用better-scroll
			enable(){
				this.scroll && this.scroll.enable()
			},
			//禁用better-scroll
			disable(){
				this.scroll && this.scroll.disable()
			},
			//元素发生改变重新scroll重新计算
			refresh(){
				this.scroll && this.scroll.refresh()
			},
			scrollTo(){
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
			},
			scrollToElement(){
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
			}
		},
		watch: {
			data(){
				setTimeout(() => {
					this.refresh()					
				})
			}
		}
	}
</script>

<style scoped lang="less">
	
</style>
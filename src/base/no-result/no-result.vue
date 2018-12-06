<template>
	<div class="no-result">
		<div class="no-result-icon"></div>
		<p class="no-result-text">{{title}}</p>
	</div>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default: ''
			}
		}
	}
</script>

<style scoped lang="less">
/*背景图片*/
@bg-image: "no-result";
  .no-result{
    text-align: center;
    .no-result-icon{
      width: 86px;
      height: 90px;
      margin: 0 auto;
      background-image: url("@{bg-image}@2x.png");
      @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
      	background-image: url("@{bg-image}@3x.png");
      }
      background-size: 86px 90px;
    }
    .no-result-text{
      margin-top: 30px;
      font-size: 14px;
      color: #999;
    }
  }
</style>
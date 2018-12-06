<template>
	<div class="tab">
		<router-link to="/recommend" tag="div" class="tab-item">
			<span class="tab-link">推荐</span>
		</router-link>
		<router-link to="/singer" tag="div" class="tab-item">
			<span class="tab-link">歌手</span>
		</router-link>
		<router-link to="/rank" tag="div" class="tab-item">
			<span class="tab-link">排行</span>
		</router-link>
		<router-link to="/search" tag="div" class="tab-item">
			<span class="tab-link">搜索</span>
		</router-link>
	</div>
</template>

<script>
	export default{

	}
</script>

<style scoped lang="less">
  .tab{
  	display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    .tab-item{
      flex: 1;
      text-align: center;
      .tab-link{
        padding-bottom: 5px;
        color: #fff;
   	  }
      &.router-link-active
        .tab-link{
          color: #ffcd32;
          border-bottom: 2px solid #ffcd32;
        }
    }
  }
</style>
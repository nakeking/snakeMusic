<template>
  <div id="app">
  	<m-header></m-header>
  	<tab></tab>
    <!--<keep-alive>缓存-->
    <router-view keep-alive></router-view>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'App',
  components:{
  	MHeader,
  	Tab,
    Player
  }
}
</script>

<style scoped lang="less">
</style>

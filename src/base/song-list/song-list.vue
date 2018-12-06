<template>
  <div class="song-list">
    <ul>
      <li v-for="(item,index) in songs" class="item" @click="selectItem(item,index)">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default{
    props:{
      songs:{
        type: Array,
        default: []
      },
      rank:{
        type: Boolean,
        default: false
      }
    },
    methods:{
      selectItem(item,index){
        this.$emit("select", item, index);
      },
      getDesc(song){
        return `${song.singer} . ${song.album}`
      },
      getRankCls(index){
        if(index <=2){
          return `icon icon${index}`
        }else{
          return 'text'
        }
      },
      getRankText(index){
        if(index > 2){
          return index + 1
        }
      }
    }
  }
</script>

<style scoped lang="less">
ul{
  padding: 0;
  margin-top: 0;
}
.song-list{
  .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: 14px;
    margin-bottom: 10px;
    .rank{
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon{
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0{
          background: url('first@2x.png');
          background-size: 25px 24px;
        }
        &.icon1{
          background: url('second@2x.png');
          background-size: 25px 24px;
        }
        &.icon2{
          background: url('third@2x.png');
          background-size: 25px 24px;
        }
      }
      .text{
        color: ##ffcd32;
        font-size: 16px;
      }
    }
    .content{
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        font-size: 14px;
        color: #fff;
        font-weight: 400;
      }
      .desc{
        color: #aaa;
        font-size: 12px;
      }
    }
  }
}
</style>
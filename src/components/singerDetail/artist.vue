<template>
  <div class="artist">
    <div class="main" >
      <div class="content" v-for="item in artists" :key="item.id">
        <div class="img">
          <img v-lazy="item.img1v1Url" alt="">
        </div>
        <div class="name">
          <span>{{item.name}}</span>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
  },
  data(){
    return{
      id:Number,
      artists:Object,
    }
  },
  created() {
        this.id = this.$route.query.id;
  },
  methods: {
  },
  mounted(){
    axios.get('https://autumnfish.cn/simi/artist?id='+ this.id +'').then((res)=>{
          // this.id = res;
          this.artists = res.data.artists;
          console.log('artists:',this.artists);
    });
    }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/index';
  .artist {
    user-select: none;
    @extend %singerDetailSon;
    // height: 2000px;
    position: absolute;
    left: 0px;
    .main {
      // height: 2000px;
      // background: black;
      // background: blueviolet;
      justify-content: space-between;
      display: flex;
      flex-wrap: wrap;
      &>div {
        width: 18%;
        margin-bottom: 70px;
      }
      .content {
        
        .img {
          width: 100%;
          height: 100%;
          img {
            cursor: pointer;
            max-width: 100%;
            max-height: 100%;
            border-radius: 5px;
          }
        }
        .name {
            color: $b-first;
            cursor: pointer;
            &:hover {
              color: #000000;
            }
          }
      }
    }
  }
</style>
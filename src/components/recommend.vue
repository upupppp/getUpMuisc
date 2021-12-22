<template>
  <div class="recommend">
    <div class="recommend-header">
      <div class="banner">
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item class="other" v-for="item in banner" :key="item.index">
            <img :src="item.imageUrl" alt="" @click="onBanner(item.encodeId,item.targetType)">
            <h3 class="medium">{{item.typeTitle}}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="recommend-content">
        <div class="content1">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big" @click="re()">热门推荐</div>
          </div>
          <div class="contentMain">
            <div class="MainsList" v-for="(item,index) in personalized" :key="index">
              <div class="MainsList-img" >
                <router-link :to="{path: '/singList', query: {id:item.id}}"><img v-lazy="item.picUrl" alt=""></router-link>
                <div class="MainsList-playCount">
                <div class="small-logo"><img src="~@/assets/img/耳机.png" alt=""></div>
                <div>{{item.playCount > 100000?Math.floor(item.playCount/10000)+'万':item.playCount}}</div>
              </div>
              </div>
              <div class="MainsList-text" >
                <router-link :to="{path: '/singList', query: {id:item.id}}" >{{item.name}}</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="content2">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">独家放送</div>
          </div>
          <div class="contentMain">
            <div class="MainsList" v-for="(item,index) in privatecontent" :key="index">
              <router-link :to="{path: '/mvSon', query: {id:item.id}}">
              <div class="MainsList2-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="MainsList-text">
                <p>{{item.name}}</p>
              </div>
              </router-link>
            </div>
          
          </div>
        </div>
        <div class="content3">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">最新音乐</div>
          </div>
          <div class="contentMain">
            <div class="MainsList" v-for="(item,index) in newsong" :key="index">
              <div class="main-img">
                <img v-lazy="item.picUrl" alt="">
              </div>
              <div class="playBtn">
                <img @click="playMusic(item.id,index,item)" src="~@/assets/img/播放.png" alt="">
              </div>
              <div class="main-text">
                <div class="over">
                  <!-- <el-tooltip class="item" effect="light" :content="item.name" placement="bottom">
                    <el-tap style="background:none;position: relative;left:-24px">{{item.name}}</el-tap>
                  </el-tooltip> -->
                  {{item.name}}
                  </div>
                <div class="text-singer" v-for="(songs,songIndex) in item.song.artists" :key="songIndex">
                  <router-link :to="{path: '/singerDetail', query: {id:songs.id}}">
                  <p>{{songIndex == 0?songs.name: '/' + songs.name}}</p>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content4">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">推荐mv</div>
          </div>
          <div class="contentMain">
            <div class="MainList" v-for="(item,index) in mvList" :key="index">
              <router-link :to="{path: '/mvSon', query: {id:item.id}}">
              <div class="MainList-img">
                <img :src="item.picUrl" alt="">
              </div>
              </router-link>
              <div class="MainList-text">
                <div class="singerName">
                  <router-link :to="{path: '/mvSon', query: {id:item.id}}">
                  {{item.name}}
                  </router-link>
                </div>
                <div class="name grey" v-for="(item,index) in item.artists" :key="index">
                  <router-link :to="{path: '/singerDetail', query: {id:item.id}}">
                  {{index == 0?item.name:' / '+ item.name}}
                  </router-link>
                  <!-- {{item.artistName}} -->
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  components:{
  },
  props: {
  },
  data(){
    return{
      personalized:Array,
      privatecontent:Array,
      newsong:Array,
      mvList:Array,
      name:Array,
      banner:Object,
    }
  },
  created() {
    // removeEventListener('scroll',this.scroll,false)
    // addEventListener('click', this.click, false)
    window.scrollTop = 0;
  },
  beforeDestroy() {
    removeEventListener('click', this.re, false)
    removeEventListener('click', this.getData, false)
    // console.log('再销毁');
  },
  methods: {
    // 测试是否登录
    playMusic(id,index,item1) {
      let url = null;
      // 因为播放列表渲染的数据和这个item1的数据格式不一样,创建了个和播放列表一样的item
      let item = {
        al:{
          picUrl:item1.picUrl
        },
        name:item1.name,
        ar:
        [
          {name:item1.song.artists[0].name}
        ],
        id:item1.id,
        dt:item1.song.duration
      };
      let has = null;
      // 如果播放列表没有这首歌就添加进数组
      for(let i = 0; i < 1; i++) {
        for(let j = 0; j <= this.$store.state.songList.length - 1; j++) {
          if(this.$store.state.songList[j].id === item1.id) {
            index = j;
            console.log(j);
            has = true;
            break;
          }
        }
        if(has === null) {
          this.$store.state.songList.unshift(item);
        }
      }
      this.$store.state.songIndex = index;
      axios.get('http://localhost:3000/song/url?id='+id+'').then((res)=>{
        url = res.data.data[0].url;
        this.$store.state.url = url;
        this.$store.commit('musicPlay',
        {
          item,
          url:url,
          index,
        })
      });
    },
    onBanner() {
      // this.$store.commit('musicPlay');
    },
    getData() {
      axios.get('/personalized?limit=8').then((res)=>{
      this.personalized = res.data.result;
          // console.log(this.personalized);
      });
      axios.get('/personalized/privatecontent').then((res)=>{
        this.privatecontent = res.data.result;
            // console.log(this.privatecontent);
      });
      axios.get('/personalized/newsong?limit=12').then((res)=>{
        this.newsong = res.data.result;
        console.log('newsong:',this.newsong)
      });
      axios.get('/personalized/mv').then((res)=>{
        this.mvList = res.data.result;
        // console.log(this.mvList);
      });
      axios.get('/banner').then((res) => {
                  // console.log(res);
        this.banner = res.data.banners;
        // console.log('banner:',this.banner);
      });
    }
  },
  mounted(){
    this.getData();
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/index';
.recommend {
  .recommend-header{
    
    // width: 60%;
    width: 1200px;
    height: 350px;
    margin: 0 auto;
    .el-carousel__item h3 {
    color: #FFFFFF;
    font-size: 17px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    margin: 0;
    z-index: 999;
    height: 30px;
    padding: 0px 10px 0px 10px;
    line-height: 30px;
    border-radius: 10px;
    background: rgba(255, 69, 36, 0.74);
    }
    .banner {
      padding-top: 30px;
      width: 100%;
      img {
        cursor: pointer;
        max-width: 100%;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
  }
  }
  .recommend-content{
    padding-top: 20px;
    width: 58%;
    margin: 0 auto;
    width: 1100px;
    .content1{
      width: 100%;
      #hr{
      border-bottom: 2px solid rgba(202, 26, 26, 0.788);
      }
      .contentTitle{
        width: 95%;
        margin-left: 30px;
        img {
          width: 20px;
        }
        &>div {
          display: inline-block;
          padding: 10px 5px 10px 5px;
        }
        .big{
          font-size: 25px;
          font-weight: 300;
        }
      }
      .contentMain{
        display: flex;
        justify-content: space-around;
        flex-wrap:wrap;
        &>div {
          margin: 20px 20px 170px 20px;
          width: 20%;
          height: 100px;
          cursor: pointer;
        }
        .MainsList {
          .MainsList-img{
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
            .small-logo img{
              width: 15px;
            }
            .MainsList-playCount{
              position: relative;
              background: rgba(7,17,27,0.8);
              width: 180px;
              height: 35px;
              color: rgba(255, 255, 255, 0.829);
              opacity:0.65;
              top: -38px;
              text-align: center;
              line-height: 35px;
              cursor:default !important;
              &>div {
                display: inline-block;
                margin-right: 10px;
              }
            }           
            img {
              width: 180px;
            }
          }
          .MainsList-text{
            position: relative;
            top: 95px;
            white-space:wrap;
            width: 180px;
            &:hover {
              text-decoration: underline;
            }
          }         
        }
      }
    }
    .content2{
      width: 100%;
      #hr{
      border-bottom: 2px solid rgba(202, 26, 26, 0.788);
      }
      .contentTitle{
        width: 95%;
        margin-left: 30px;
        img {
          width: 20px;
        }
        &>div {
          display: inline-block;
          padding: 10px 5px 10px 5px;
        }
        .big{
          font-size: 25px;
          font-weight: 300;
        }
      }
      .contentMain{
        display: flex;
        justify-content: space-around;
        &>div {
          margin: 20px 20px 20px 30px;
          width:30%;
        }
        .MainsList {
          .MainsList2-img {
            img {
              width: 100%;
            }
          }
          .MainsList-text{
            position: relative;
            top: 15px;
            cursor: pointer;
            white-space: wrap;
            width: 100%;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    .content3{
      width: 100%;
      margin-top: 30px;
      #hr{
      border-bottom: 2px solid rgba(202, 26, 26, 0.788);
      }
      .contentTitle{
        width: 95%;
        margin-left: 30px;
        img {
          width: 20px;
        }
        &>div {
          display: inline-block;
          padding: 10px 5px 10px 5px;
        }
        .big{
          font-size: 25px;
          font-weight: 300;
        }
      }
      .contentMain{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        .MainsList {
          .main-img{
            width: 80px;
            cursor: pointer;
            img{
              width: 100%;
              width: 100%;
              max-height: 100%;
              max-width: 100%;
              border-radius: 5px;
            }
          }
          .playBtn{
            width: 40px;
            position: relative;
            top: -60px;
            left: 20px;
            cursor: pointer;
            img{
              max-width: 100%;
              max-height: 100%;
              width: 100%;
              height: 100%;
            }
          }
          .main-text {
            position: relative;
            top: -115px;
            left: 90px;
            font-size: 18px;
            width: 210px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            .over {
              cursor: default;
            }
            &>div {
              margin-bottom: 25px;
            }
            .text-singer{
              display: inline-block;
              color: rgba(128, 128, 128, 0.76);
              &:hover {
                color: rgba(0, 0, 0, 0.616);
                cursor: pointer;
              }
            }
          }
        }
        &>div {
          height: 80px;
          width: 29%;
          margin: 20px 5px 10px 15px;
          border-radius: 5px;
          &:hover {
            background: rgba(128, 128, 128, 0.301);
          }
        }
      }
    }
    .content4{
      width: 100%;
      margin-top: 30px;
      #hr{
      border-bottom: 2px solid rgba(202, 26, 26, 0.788);
      }
      .contentTitle{
        width: 95%;
        margin-left: 30px;
        img {
          width: 20px;
        }
        &>div {
          display: inline-block;
          padding: 10px 5px 10px 5px;
        }
        .big{
          font-size: 25px;
          font-weight: 300;
        }
      }
      .contentMain {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        &>div {
          width: 45%;
          margin: 20px 20px 40px 20px;
        }
        .MainList {
          .MainList-img{
            width: 500px;
            height: 281px;
            img {
              max-width: 100%;
              max-height: 100%;
              width: 100%;
              height: 100%;
              border-radius: 5px;
              cursor: pointer;
            }
          }
          .MainList-text {
            .name {
              // background: blanchedalmond;
              display: inline-block;
              color: $b-second;
            }
            .singerName {
              width: 500px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              color: $b-first;
            }
            &>div{
              margin-top: 15px;
              font-size: 19px;
              cursor: pointer;
              
            &:hover {
              color: #000000;
            }
          }
          }
          
        }
      }
    }
  }
}
</style>
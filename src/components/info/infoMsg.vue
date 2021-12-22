<template>
  <div class="info">
    <div class="header">
      <div class="avatar">
        <el-avatar :src="profile.avatarUrl" :size="250"></el-avatar>
      </div>
      <div class="content">
        <p class="name">{{profile.nickname}}</p>
        <div class="status">
          <span class="vip">
            vip 5
          </span>
          <span class="level">
            Lv{{info.level}}
          </span>
          <span class="iconfont icon-nan1 gender-b" v-if="profile.gender == 1">
          </span>
          <span class="iconfont icon-nv gender-g" v-if="profile.gender == 2">
          </span>
          <router-link :to="{path: '/changeInfo'}">
          <span class="changeMsg">
            编辑个人信息
          </span>
          </router-link>
        </div>
        <div class="follow">
          <div class="item1">
              <p class="text">{{profile.eventCount}}</p>
              <p>动态</p>
            </div>
            <div class="item2">
              <p class="text">{{profile.follows}}</p>
              <p>关注</p>
            </div>
            <div class="item3">
              <p class="text">{{profile.followeds}}</p>
              <p>粉丝</p>
            </div>
        </div>
        <div class="text">
          <div>所在地区: <span>广东 阳江</span></div>
          <div>社交网络:</div>
          <div>个人介绍:<span>暂无介绍</span></div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="singList">
        <div class="creator">
          <p class="title" v-if="mine" @click="createList()">我创建的歌单<span>({{creator.length}})</span></p>
          <p class="title" v-if="!mine">{{profile.nickname}}创建的歌单<span>({{creator.length}})</span></p>
          <div class="playList">
            <div v-for="(item,index) in creator" :key="index">
              <div class="img">
                <router-link :to="{path: '/singList', query: {id:item.id}}">
                <el-avatar shape="square" :size="250" :src="item.coverImgUrl"></el-avatar>
                </router-link>
              </div>
              <div class="text">
                <router-link :to="{path: '/singList', query: {id:item.id}}">
                <p v-if="mine&&index == 0">{{item.name}}</p>
                <p v-if="index > 0">{{item.name}}</p>
                <!-- <p v-if="!mine">{{item.name}}</p> -->
                </router-link>
                <p class="count">{{item.trackCount}}首</p>
              </div>
            </div>
          </div>
        </div>
        <div class="collection">
          <p class="title" v-if="mine">我收藏的歌单<span>({{collection.length}})</span></p>
          <p class="title" v-if="!mine">{{profile.nickname}}收藏的歌单<span>({{collection.length}})</span></p>
          <div class="playList">
            <div v-for="(item,index) in collection" :key="index">
              <div class="img">
                <router-link :to="{path: '/singList', query: {id:item.id}}">
                <el-avatar shape="square" :size="250" :src="item.coverImgUrl"></el-avatar>
                </router-link>
              </div>
              <div class="text">
                <router-link :to="{path: '/singList', query: {id:item.id}}">
                <p v-if="mine&&index == 0">{{item.name}}</p>
                <p v-if="index > 0">{{item.name}}</p>
                <p v-if="!mine">{{item.name}}</p>
                </router-link>
                <p class="count">{{item.trackCount}}首</p>
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
        props: {},
        data() {
            return {
              id:Number,
              profile:Object,
              cookie:String,
              info:Object,
              mine:false,
              playlist:Array,
              creator:[],
              collection:[],
            }
        },
        created() {
          this.id = this.$route.query.id;
          this.mine = this.$route.query.mine;
          this.cookie = localStorage.getItem('cookie');
        },
        methods: {
          createList() {
            this.creator.push(this.creator[4]);
            console.log(this.creator);
          },
          goSplit() {
            let _this = this;
            this.playlist.filter((n)=>n.creator.userId == _this.id).map((n)=>_this.creator.push(n));
            this.playlist.filter((n)=>n.creator.userId != _this.id).map((n)=>_this.collection.push(n));
            console.log(_this.creator);
            console.log(_this.collection)
          }
        },
        mounted() {
          let _this = this;
          axios.get('/user/detail?uid='+ this.id +'').then((res)=>{
            this.profile = res.data.profile;
            this.info = res.data;
            console.log('newsong:',res);
          });
          axios.get('/user/subcount?cookie='+ _this.cookie +'').then((res)=>{
            // this.profile = res.data.profile;
            console.log('subcount:',res);
          });
          axios.get('/user/playlist?uid=' + this.id + '').then((res)=>{
            // this.profile = res.data.profile;
            this.playlist = res.data.playlist;
            console.log('playlist:',res);
            this.goSplit();
          });
        }
    }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/index';
  .info {
    user-select: none;
    height: 1500px;
    @extend %main;
    // background: brown;
    border-left: 1px solid $bd-first;
    margin-top: 0px !important;
    .header {
      width: 90%;
      // height: 400px;
      margin: 0 auto;
      // background: blueviolet;
      margin-bottom: 80px;
      padding-top: 40px;
      display: flex;
      .content {
        width: 100%;
        margin-left: 40px;
        .name {
          font-size: 30px;
          font-weight: 700;
        }
        .status {
          // background: yellowgreen;
          width: 85%;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid $bd-second;
          // margin-right:40px;
          &>span {
            font-size: 10px;
            padding: 2px 5px 2px 5px;
            text-align: center;
            margin-right: 10px;
          }
          .vip {
            background: #000000;
            color: white;
            border-radius: 15px;
          }
          .level {
            background:rgba(128, 128, 128, 0.157);
            border-radius: 15px;
          }
          .gender-b {
            font-size: 12px;
            background: rgba(135, 207, 235, 0.459);
            color: rgb(107, 190, 223);
            border-radius: 50%;
            padding: 5px;
          }
          .gender-g {
            font-size: 12px;
            color: rgb(235, 79, 105);
            padding: 5px;
            border-radius: 50%;
            background: rgb(255, 188, 198);
          }
          .changeMsg {
            position: relative;
            left: 500px;
            font-size: 20px !important;
            color: $b-second;
            border: 1px solid $bd-second;
            padding: 5px 20px 5px 20px;
            border-radius: 40px;
            margin-bottom: 10px;
            cursor: pointer;
          }
        }
        .follow {
          display: flex;
          color: black;
          // height: 120px;
          position: relative;
          left: -20px;
          margin: 0;
          width: 250px;
          margin-bottom: 10px;
          &>div {
            width: 33%;
            margin-top: 30px;
            border-right: 1px solid $bd-first;
            text-align: center;
            p {
              font-size: 18px;
              margin-top: 5px;
              vertical-align:middle;
            }
          }
        }
        .text {
          &>div {
            margin-bottom: 15px;
          }
        }
      }
    }
    .main {
      width: 90%;
      height: 800px;
      margin: 0 auto;
      // background:yellowgreen;
      .singList {
        .creator {
          // background: chocolate;
          padding-bottom: 70px;
          .title {
            font-size: 25px;
            font-weight: 700;
            span {
              margin-left: 10px;
              font-size: 20px;
              color: $b-second;
            }
          }
          .playList {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            width: 1200px;
            &>div {
              margin-top: 20px;
              width: 23%;
              .img {
                cursor: pointer;
              }
              .text {
                p {
                  margin-top: 10px;
                  color: #000000;
                  // font-weight: 700;
                  font-size: 18px;
                  cursor: pointer;
                  white-space: wrap;
                }
                .count {
                  color: $b-third;
                  font-weight: 300 !important;
                  cursor: default !important;
                }
              }
            }
          }
        }
        .collection {
          @extend .creator;
        }
      }
    }
  }
</style>
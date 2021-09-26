<template>
  <div class="mvSon" ref="mvSon">
    <div class="main">
      <h1 class="title">
        <span class="el-icon-arrow-left"></span> <span>MV详情</span>
      </h1>
      <div class="mv" >
        <video :src="url" ref="mvMedia" controls autoplay disablePictureInPicture @click="toPlay()" v-if="url"></video>
        <span class="el-icon-video-play" @click="toplay()" v-show="!mediaFlag"></span>
      </div>
      <div class="content">
        <div class="avatar">
          <el-avatar :size="80" mode="widthFix" :src="avatar"></el-avatar>
          <span class="name" v-for="(item,index) in name" :key="index">
            {{item}}
          </span>
        </div>
        <div class="shop" ref="shop">
          <div class="title">
            <h1>{{mv.name}}</h1>
            <div class="text">
              <p class="time">发布:{{mv.publishTime}}</p>
              <p class="count">播放:{{mv.playCount}}次</p>
            </div>
          </div>
          <div class="status" v-if="info">
            <!-- 是否被点赞再info 是否被收藏item里面 -->
            <div>赞({{info.likedCount}})</div>
            <div>收藏({{mv.subCount}})</div>
            <div>分享({{info.shareCount}})</div>
            <div>下载MV</div>
          </div>
        </div>
        <div class="comment">
          <div class="infoComment">
            <div class="text">
              评论<span>({{comment.total}})</span>
            </div>
            <textarea name="" id="" v-model="text">
            </textarea>
            <span class="textCount">{{140-textSum}}</span>
            <div class="comment-btn">
              评论
            </div>
          </div>
          <div class="hotComment" v-if="comment.hotComments !== undefined&& !comment.hotComments.length > 0">
            <div class="text">
              精彩评论
            </div>
            <div class="content" v-for="(item,index) in getHotComment" :key="index">
              <div class="img">
                <el-avatar :size="60" mode="widthFix" :src="item.user.avatarUrl">

                </el-avatar>
              </div>
              <div class="comment-text">
                <div class="top">
                  <span class="nickname">{{item.user.nickname}}</span>:{{item.content}}
                </div>
                <div class="bottom">
                  <div>
                    {{getCommentTime(item.time)}}
                  </div>
                  <div class="comment-shop">
                    <div class="el-icon-toilet-paper">{{item.likedCount}}</div>
                    <div class="el-icon-position"></div>
                    <div class="el-icon-chat-line-round"></div>
                    <!-- el-icon-chat-line-round -->
                  </div>
                </div>
              </div>
              
            </div>
            <div class="tip">
              更多精彩评论<span> > </span>
            </div>
          </div>
          <div class="newComment" ref="newComment">
            <div class="text" v-loading="loading" element-loading-spinner="el-icon-loading" customClass="loadingColor">
              最新评论({{comment.total}})
            </div>
            <div class="content" v-show="!loading" v-for="(item,index) in comment.comments" :key="index">
              <div class="img">
                <el-avatar :size="60" mode="widthFix" :src="item.user.avatarUrl">

                </el-avatar>
              </div>
              <div class="comment-text">
                <div class="top">
                  <span class="nickname">{{item.user.nickname}}</span>:{{item.content}}
                </div>
                <div class="bottom">
                  <div>
                    {{getCommentTime(item.time)}}
                  </div>
                  <div class="comment-shop">
                    <div class="el-icon-toilet-paper"><span v-if="item.likedCount">{{item.likedCount}}</span></div>
                    <div class="el-icon-position"></div>
                    <div class="el-icon-chat-line-round"></div>
                    <!-- el-icon-chat-line-round -->
                  </div>
                </div>
              </div>
              
            </div>
            <div class="paging" v-if="!loading">
              <el-pagination
              background
              layout="prev, pager, next"
              :hide-on-single-page="comment.total<20"
              :pager-count="9"
              @next-click="next()"
              @prev-click="prev()"
              @current-change="currentPage"
              :total="comment.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">
        <span>相关推荐</span>
      </div>
      <div class="content" v-for="(item,index) in mvs" :key="index">
        <div class="img">
          <img :src="item.cover" alt="">
          <p class="count">
            <span class="el-icon-video-play">
            </span>
            {{item.playCount}}
          </p>
          <p class="duration">{{getTime(item.duration)}}</p>
        </div>
        <div class="text">
          <p>{{item.name}}</p>
          <p>{{item.artistName}}</p>
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
      url:String,
      item:Object,
      avatar:String,
      mv:Object,
      name:[],
      mvs:null,
      info:Object,
      id:null,
      text:"",
      textSum:0,
      comment:Object,
      offset:1,
      loading:true,
      mediaFlag:true,
      offsetChange:0,
    }
  },
  computed: {
    getHotComment() {
      if(this.comment.hotComments) {
        return this.comment.hotComments.slice(0,10);
      }
      
    }
  },
  created() {
    this.avatar = this.$route.query.avatar;
    this.item = this.$route.query.item;
    this.id = this.$route.query.id;
    console.log('item',this.item);
    window.addEventListener('scroll',this.pipStatus);
  },
  methods: {
    getName() {
      // let Name = [];
      for(let i = 0; i < this.mv.artists.length; i++) {
        
        if(i > 0) {
          this.mv.artists[i].name = '/' + this.mv.artists[i].name;
          this.name.push(this.mv.artists[i].name);
        }
      }
      this.name.unshift(this.mv.artists[0].name);
      console.log('name:',this.name);
    },
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
    getCommentTime(time) {
      let date = new Date(time);
      let month = date.getMonth() - 1;
      let day = date.getDate();
      let hours =date.getHours(); 
      let min = date.getMinutes();
      return month + '月' + day + '日' + ' ' + hours + ':' + (min >= 10?min:'0'+ min);
    },
    ms() {
      // let mv = this.$refs.mvSon;
      document.documentElement.scrollTop = this.$refs.newComment.offsetTop + 100;
      console.log(this.$refs.newComment.offsetTop);
      axios.get('https://autumnfish.cn/comment/mv?id='+ this.id +'&offset='+ this.offset +'').then((res)=>{
          console.log('comment2:',res);
          this.comment = res.data;
          // this.url = res.data.data.url;
    });
    },
    next() {
      this.offset += this.offset;
      this.ms();
    },
    prev() {
      this.offset -= this.offset;
      this.ms();
    },
    currentPage(current) {
      this.offset = current;
      this.ms();
      // console.log(current);
    },
    toplay() {
      // 负责暂停时控制图标从出现
          let mvMedia = this.$refs.mvMedia;
          this.mediaFlag = mvMedia.paused;
          if(mvMedia.paused) {
            mvMedia.play();
          }
          console.log(mvMedia.VideoTrackList)
    },
    toPlay() {
          let mvMedia = this.$refs.mvMedia;
          
          this.mediaFlag = mvMedia.paused;
          // mvMedia.onPause = ()=>console.log(11);
          console.log(mvMedia.VideoTrackList)
    },
    pipStatus() {
      // 747 是功能区class 的offsetTop,但是因为方法调用顺序的为问题,改用固定的高度
      // let shopOffset = this.$refs.shop.offsetTop;

      // console.log(document.documentElement.scrollTop);
      // console.log(this.$refs.shop.clientHeightTop);
      // let mvMedia = this.$refs.mvMedia;
      console.log(this.offsetChange);
      if(document.documentElement.scrollTop >= 747) {
        this.offsetChange = 1;
      }
      else {
        this.offsetChange = 0;
      }
    },
    
  },
  // 监听函数watch:里面方法的名字必须所监听的属性,当被监听的属性的值发生变化时,触发方法
  watch:{
    text() {
      this.textSum = this.text.length;
    },
    offsetChange() {
      let video = this.$refs.mvMedia;
        if(this.offsetChange == 1) {
          video.disablePictureInPicture = false;
          setTimeout(()=>video.requestPictureInPicture(),200);
          console.log('开启画中画')
          // console.log(video.requestPictureInPicture());
        }
        
      if(this.offsetChange == 0) {
          video.disablePictureInPicture = true;
          setTimeout(()=>document.exitPictureInPicture(),200);
          console.log('关闭画中画');
      }
    }
  },
  mounted(){
    // setInterval(()=>document.addEventListener(''))
    axios.get('https://autumnfish.cn/mv/url?id='+ this.id +'').then((res)=>{
          console.log('url:',res);
          this.url = res.data.data.url;
    });
    axios.get('https://autumnfish.cn/mv/detail?mvid='+ this.id +'').then((res)=>{
          console.log('mvDetail:',res);
          this.mv = res.data.data;
          this.getName();
    });
    axios.get('https://autumnfish.cn/simi/mv?mvid='+ this.id +'').then((res)=>{
          this.mvs = res.data.mvs;
          console.log('mvDetail1:',this.mvs);
    });
    axios.get('https://autumnfish.cn/mv/detail/info?mvid='+ this.id +'').then((res)=>{
          this.info = res.data;
          console.log('mvInfo:',res);
    });
    axios.get('https://autumnfish.cn/comment/mv?id='+ this.id +'').then((res)=>{
          console.log('comment:',res);
          this.comment = res.data;
          setTimeout(()=>this.loading = false,2000);
          // this.url = res.data.data.url;
    });
    axios.get('https://autumnfish.cn/user/detail?uid=32953014').then((res)=>{
          console.log('comment1:',res);
          // this.comment = res.data;
          // this.url = res.data.data.url;
          let mvMedia = this.$refs.mvMedia;
          this.mediaFlag = mvMedia.paused;
          this.video = this.$refs.mvMedia;
          
    });
    },
    destroyed() {
      let video = this.$refs.mvMedia;
      let mvMedia = this.$refs.mvMedia;
      if(this.offsetChange == 1) {
          document.exitPictureInPicture();
          // mvMedia.pause();
          this.video.pause();
        }
    }
}
</script>

<style lang="scss" scoped>
  @import '../assets/styles/index';
  .mvSon {
    @extend %main;
    position: relative;
    display: flex;
    justify-content: space-around;
    .main {
      width: 70%;
      // height: 5000px;
      // background: blueviolet;
      .title{
        font-size: 25px;
        .el-icon-arrow-left{
          font-weight: 700;
          color: #303133;
        }
      }
      .mv {
        video {
          width: 900px;
          height: 600px;
          cursor: pointer;
        }
        .el-icon-video-play {
          font-size: 100px;
          color: #ffffffe7;
          position: absolute;
          cursor: pointer;
          top: 300px;
          left: 30%;
          border-radius: 50%;
          &:hover {
            color: white;
          }
        }
      }
      .content {
        .avatar {
          * {
            vertical-align: middle;
            margin-right: 10px;
            cursor: pointer;
          }
          el-avatar {
            width: 50px;
          }
          .name {
            color: #606266;
            font-size: 18px;
            &:hover {
              color: #303133;
            }
          }
        }
        .shop {
          margin-bottom: 80px;
          .title {
            margin-top: 40px;
            margin-bottom: 45px;
            h1 {
              color: #303133;
              font-size: 30px;
              font-weight:700;
            }
            .text {
              display: flex;
              margin-top: 30px;
              font-size: 18px;
              color: #909399;
              width: 400px;
              p {
                flex: 1;
              }
            }
          }
          .status {
            display: flex;
            div {
              justify-content: flex-start;
              width: 150px;
              border-radius: 30px;
              height: 40px;
              text-align: center;
              line-height: 40px;
              border:1px solid rgb(224, 222, 222);
              margin: 0px 5px 0px 5px;
              color: #303133;
              cursor: pointer;
              &:hover {
                background: rgba(128, 128, 128, 0.089);
              }
            }
          }
        }
        .comment {
          .infoComment {
            margin-bottom: 50px;
            // background: chartreuse;
            .text {
              margin-bottom: 20px;
              font-size: 35px;
              font-weight: 700;
              color:$b-first;
              span {
                font-size: 16px;
                color: $b-third;
              }
            }
            textarea {
              width: 880px;
              height: 100px;
              border-radius: 5px;
              border: 1px solid $bd-first;
              font-size: 20px;
              color: $b-first;
              font-weight:500;
              
            }
            .textCount {
              color: $b-fourth;
              position: relative;
              top:-10px;
              left: -40px;
            }
            .comment-btn {
              color: $b-first;
              width: 70px;
              height: 35px;
              border-radius: 30px;
              border: 1px solid $bd-first;
              text-align: center;
              line-height: 35px;
              margin-top: 10px;
              position: relative;
              left: 815px;
              cursor: pointer;
              &:hover {
                background: rgba(128, 128, 128, 0.089);
              }
            }
          }
          .hotComment {
            width: 800px;
            // background: chocolate;
            .text {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 20px;
            }
            .content {
              // background: chocolate;
              // height: 100px;
              padding-bottom: 30px;
              display: flex;
              border-bottom: 1px solid $bd-third;
              * {
                margin-top: 7px;
              }
              div {
                width: 725px;
                flex: 1;
              }
              .comment-text {
                margin-top: 10px;
                .top {
                  .nickname {
                    color: #40a0ff;
                  }
                }
                .bottom {
                  display: flex;
                  margin-top: 20px;
                  color: $b-third;
                  div {
                    // background: chocolate;
                    // height: 30px;
                    // line-height: 30px;
                    margin: 0px;
                    padding: 0px;
                  }
                  .comment-shop {
                    position: relative;
                    left: 190px;
                    div {
                      display: inline-block;
                      width: 60px;
                      // height: 30px;
                      // background: chocolate;
                      // text-align: left;
                      text-align: center;
                      // padding: 0px 15px 0px 15px;
                      &:nth-child(2) {
                        border-left: 1px solid $bd-first;
                        border-right: 1px solid $bd-first;
                      }
                    }
                    
                  }
                }
              }
              
            }
          }
          .newComment {
            @extend .hotComment;
            padding-bottom: 50px;
            padding-top: 50px;
            .text {
              font-size: 20px;
              font-weight: 700;
              
            }
            .paging {
              position: relative;
              top: 50px;
              left: 30%;
            }
          }
        }
      }
      .tip {
        position: relative;
        left: 50%;
        margin: 35px 0 80px 0px;
        font-size: 18px;
        border: 1px solid $b-second;
        // background: black;
        width: 140px;
        padding: 10px 0 10px 0;
        border-radius: 30px;
        text-align: center;
        cursor: pointer;
        color: $b-first;
        &:hover {
          color: #000000;
        }
      }
    }
    .aside {
      width: 30%;
      height: 900px;
      // background: gray;
      .title {
       font-size: 25px;
       margin-bottom: 43px;
      }
      .content {
        display: flex;
        .img {
          // * {
          //   cursor: pointer;
          // }
          cursor: pointer;
          img {
            width: 200px;
            border-radius: 5px;
          }
          span,p {
            color: #fffffff6;
            font-weight: 400;
            font-size: 16px;
          }
          .count {
            position: relative;
            top: -105px;
            left: 120px;
          }
          .duration {
            position: relative;
            top: -45px;
            left: 150px;
          }
        }
        .text {
          margin-top: 10px;
          margin-left: 10px;
          p {
            margin-bottom: 40px;
          }
        }
      }
    }
  }
</style>
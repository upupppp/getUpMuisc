<template>
  <div class="comment">
    <div class="infoComment">
    </div>
        <div class="hotComment" v-if="comment.hotComments !== undefined&& comment.hotComments.length > 0">
          <div class="text">
            全部评论<span>({{comment.total}})</span>
          </div>
          <div class="content" v-for="(item,index) in getHotComment" :key="index">
            <div class="img">
              <el-avatar :size="60" mode="widthFix" :src="item.user.avatarUrl">

              </el-avatar>
            </div>
            <div class="comment-text">
              <div class="top">
                <span class="nickname">{{item.user.nickname}}</span>:{{item.content}}
                <div class="replied" v-if="item.beReplied.length > 0">
                  <p>@{{item.beReplied[0].user.nickname}}:<span>{{item.beReplied[0].content}}</span> </p>
                </div>
              </div>
              <div class="bottom">
                <div>
                  {{getCommentTime(item.time)}}
                </div>
                <div class="comment-shop">
                  <div class="iconfont icon-31dianzan" @click="sendCommentLiked(item.liked,item.commentId)" :class="{icon:item.liked == true}"><span style="color:#606266">{{item.likedCount}}</span></div>
                  <div class="iconfont icon-pinglun"></div>
                  <div class="iconfont icon-fenxiang"></div>
                </div>
              </div>
            </div>
            
          </div>
          <div class="tip" >
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
                <div class="replied" v-if="item.beReplied.length > 0">
                  <p>@{{item.beReplied[0].user.nickname}}:<span>{{item.beReplied[0].content}}</span> </p>
                </div>
              </div>
              <div class="bottom">
                <div>
                  {{getCommentTime(item.time)}}
                </div>
                <div class="comment-shop">
                  <div class="iconfont icon-31dianzan" @click="sendCommentLiked(item.liked,item.commentId)"><span v-if="item.likedCount">{{item.likedCount}}</span></div>
                  <div class="iconfont icon-pinglun"></div>
                  <div class="iconfont icon-fenxiang"></div>
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
            :total="comment.total/5">
            </el-pagination>
          </div>
        </div>
        <transition name="el-fade-in">
    <div class="tipMsg" v-show="show">
      {{tip}}
    </div>
    </transition>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
  },
  data(){
    return{
      id:null,
      text:"",
      textSum:0,
      comment:Object,
      offset:1,
      loading:true,
      tip:"",
      show:false,
      subed:false,
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
    console.log('musicId',this.$store.state.musicID);
    this.id = this.$store.state.musicID;
    // console.log('item',this.item);
    // console.log('id:',this.id);
    addEventListener('click', this.click, false)
  },
  beforeDestroy() {
    removeEventListener('click', this.click, false)
  },
  methods: {
    sendTip(type) {
       if(type == 5) {
        this.tip = "评论成功!";
        this.show = true;
      }
    },
    sendCommentLiked(liked,cid) {
      let time = new Date().getTime();
      let t = liked == false?1:0;
      let cookie = localStorage.getItem('cookie');
      if(cookie) {
        axios.get('/comment/like?id='+ this.id +'&cid='+ cid +'&t='+ t +'&type=1&timestamp='+ time +'&cookie='+ cookie +'').then((res)=>{
            console.log('CMliked:',res);
        });
        time,t,cookie = null;
        let timer = setInterval(()=> {
            this.getComment();
          },500)
          setTimeout(() => {
            this.show = false;
            clearInterval(timer);
          }, 1000);
      }
      else {
        this.loginTip();
      }
    },
    loginTip() {
        this.tip = '请登录!',
        this.show = true;
        setTimeout(()=>{
          this.show = false
        },1000);
    },
    sendLiked() {
      let cookie = localStorage.getItem('cookie');
      if(cookie) {
        let t = this.info.liked == false?1:0;
        let time = new Date().getTime();
        axios.get('/resource/like?id='+ this.id +'&t='+ t +'&type=1&timestamp='+ time +'&cookie='+ cookie +'').then((res)=>{
          // console.log('liked:',res);
        });
      }
      else {
        this.loginTip();
      }
    },
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
    getCommentTime(time) {
      let date1 = new Date();
      let date = new Date(time);
      let timer = date1.getTime();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours =date.getHours(); 
      let min = date.getMinutes();
      hours = hours >= 10?hours:'0'+ hours;
      min = min >= 10?min:'0'+ min;
      let goneTime = timer - time;
      if(goneTime <=60000) {
        return '刚刚';
      }
      else if(goneTime > 60000 && goneTime < 3600000) {
        return `${Math.floor(goneTime/60000)}分钟前`;
      }
      else if(goneTime <= 86400000) {
        return `${hours}:${min}`;
      }
      else if(goneTime > 86400000 && goneTime <= 172800000) {
        return `昨天${hours}:${min}`;
      }
      else if(goneTime > 172800000){
        return month + '月' + day + '日' + ' ' + hours + ':' + min;
      }
      
    },
    getComment() {
      let timer = new Date().getTime();
      let cookie = localStorage.getItem('cookie');
      axios.get('/comment/music?id='+ this.id +'&timestamp='+ timer +'&cookie='+ cookie +'').then((res)=>{
          console.log('comment:',res);
          this.comment = res.data;
          setTimeout(()=>this.loading = false,2000);
          // this.url = res.data.data.url;
    });
    },
    ms() {
      document.documentElement.scrollTop = this.$refs.newComment.offsetTop + 100;
      axios.get('/comment/music?id='+ this.id +'&offset='+ this.offset +'').then((res)=>{
          // console.log('comment2:',res);
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
    sendComment() {
      let time = new Date().getTime();
      let cookie = localStorage.getItem("cookie");
      // console.log(cookie);
      if(cookie) {
        axios.get('/comment?t=1&type=1&id='+ this.id +'&content='+ this.text +'&timestamp='+ time +'&cookie='+ cookie +'').then((res)=>{
          // console.log('sendComment:',res);
          this.sendTip(5);
        }).catch((err)=> {
        console.log('错误:',err);
        });
        this.text = "";
      }
      else {
        this.loginTip();
      }
    }
  },
  // 监听函数watch:里面方法的名字必须所监听的属性,当被监听的属性的值发生变化时,触发方法
  watch:{
    text() {
      this.textSum = this.text.length;
    },
  },
  mounted(){
    // setInterval(()=>document.addEventListener(''))
    // this.getInfo();
    this.getComment();
    axios.get('/user/detail?uid=32953014').then((res)=>{
          console.log('comment1:',res);
          // this.comment = res.data;
          // this.url = res.data.data.url;
          // let mvMedia = this.$refs.mvMedia;
          // this.mediaFlag = mvMedia.paused;
          this.video = this.$refs.mvMedia;
          setTimeout(()=> {
            // this.getName();
          },300)
          
          
    });
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/index';
.comment {
  padding-bottom: 100px;
  .infoComment {
    margin-bottom: 50px;
    // background: chartreuse;
    .text {
      font-size: 20px;
      font-weight: 700;
      color:$b-first;
      span {
        font-size: 16px;
        color: $b-third;
      }
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
      font-size: 23px;
      font-weight: 700;
      margin-bottom: 20px;
      span {
        font-size: 16px;
        color: $b-third;
      }
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
            cursor: pointer;
          }
          .replied {
            background-color: rgba(128, 128, 128, 0.089);
            padding: 5px 10px 10px 10px;
            border-radius: 5px;
            p {
              color: #40a0ff;
              cursor: pointer;
              span {
                color: $b-first;
                cursor: default;
              }
            }
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
            left: 280px;
            .icon {
              color: red;
            }
            div {
              display: inline-block;
              width: 60px;
              font-size: 16px;
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
  .newComment {
      @extend .hotComment;
      padding-bottom: 50px;
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
  .tipMsg {
      color: white;
      background: #303133;
      padding: 25px 30px;
      border-radius: 30px;
      position: fixed;
      left: 40%;
      top: 30%;
      z-index: 999;
      font-size: 22px;
  }
      }
</style>
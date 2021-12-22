<template>
  <div class="new-song-express">

    <!-- allsong -->
    <div class="languages">
      <div class="allsong">
        <div class="allsong-choose"
          @click="itemAllsong(index)"
          v-for="(item, index) in languages"
          :key="index"
          :class="{ active: isActive == index }">{{ item }}</div>
      </div>
    </div>

    <!-- newSongExpress -->
    <div class="newsonglist"
      v-for="(item, index) in top"
      :key="index"
      :class="{ even: index % 2 == 0, odd: index % 2 != 0 }">
      <div class="num">
        {{ index + 1 >= 10 ? index + 1 : "0" + (index + 1) }}
      </div>

      <div class="play-logo">
        <img @click="playMusic(item, item.id)" src="~@/assets/img/播放.png" alt=""/>
      </div>
      <img class="album-img" v-lazy="item.album.blurPicUrl" alt="" />
      <div class="song-name">{{ item.name }}</div>
      <div class="singer">
        <span v-for="(item, index) in item.artists" :key="index">
          <router-link :to="{ path: '/singerDetail', query: { id: item.id } }">
            {{ index > 1 ? " / " + item.name : item.name }}
          </router-link>
        </span>
      </div>

      <div class="album-width">
        <div class="album-name">
          <router-link :to="{ path: '/singerAlbum', query: { id: item.album.id } }">
            {{ item.name }}
          </router-link>
        </div>
      </div>
      <div class="play-time">{{ playTime(item.duration) }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {},
  data() {
    return {
      top: [],
      newsong: [],
      languages: ["全部", "华语", "欧美", "日本", "韩国"],
      type: 0,
      isActive: 0
    };
  },
  created() {},
  methods: {
    newSongData() {
      axios
        .get("/top/song?type=" + this.type)
        .then((res) => {
          // console.log('2',res);
          // console.log('11',this.type);
          this.top = res.data.data;
          console.log(this.top);
        });
    },
    playMusic(song, id) {
      console.log('song',song);
      console.log(id);
      let url = null;

      // 判断当前音乐是否可用
      axios.get("/check/music?id=" + id).then(res => {
        console.log('该音乐可用',res);

        // 播放音乐
        axios.get("/song/url?id=" + id).then(res => {
          console.log('playmusic',res);
          url = res.data.data[0].url;
          this.$store.state.url = url;
          this.$store.state.picUrl = song.album.blurPicUrl;
          this.$store.state.singer = song.artists[0].name;
          this.$store.state.singname = song.name;
          // console.log(song);
          this.$store.state.musicPlay = true;
          this.$store.state.flag = true;
        }).catch(err => {
          console.log('当前音乐播放失败',err);
        })
      }).catch(err => {
        alert('该音乐为付费音乐',err);
      })
    },
    playTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor((second / 60) % 60);
      let sec = Math.floor(second % 60);
      return (
        (min >= 10 ? min : "0" + min) + ":" + (sec >= 10 ? sec : "0" + sec)
      );
    },
    itemAllsong(index) {
      this.isActive = index;
      // 语种
      switch (index) {
        case 0:
          this.type = 0;
          this.$store.state.type = 0;
          break;
        case 1:
          this.type = 7;
          this.$store.state.type = 7;
          break;
        case 2:
          this.type = 96;
          this.$store.state.type = 96;
          break;
        case 3:
          this.type = 8;
          this.$store.state.type = 8;
          break;
        case 4:
          this.type = 16;
          this.$store.state.type = 16;
          break;
      }
    }
  },
  mounted() {
    this.newSongData();
    axios.get('/personalized/newsong?limit=1').then((res)=>{
      this.newsong = res.data.result;
      console.log('newsong:',this.newsong)
    });
  },
  watch: {
    type() {
      this.newSongData();
    },
  },
};
</script>

<style>
/* allsong */
.languages{
  margin: 10px 0 20px;
  border-bottom: 1px solid red;
}
.allsong {
  display: flex;
}
.allsong-choose {
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 10px 0 0;
  margin: 20px 0 10px;
}
.active {
  color: red;
}
/* newSongExpress */
.new-song-express {
  width: 100%;
  margin-top: 10px;
}
.newsonglist {
  height: 80px;
  padding: 20px 0;
}
.newsonglist > div {
  display: inline-block;
  text-align: left;
  flex-wrap: nowrap;
  line-height: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.newsonglist:hover {
  background: rgb(235, 235, 235);
}
.odd {
  background: white;
}
.even {
  background: rgb(243, 243, 243);
}
.album-img {
  width: 80px;
  height: 80px;
}
.num {
  width: 50px;
  margin-left: 20px;
}
.song-name {
  width: 400px;
  margin-left: 10px;
}
.album-width {
  width: 300px;
  margin-left: 30px;
}
.album-name {
  width: 200px;
  height: 80px;
  overflow: hidden;
  white-space: nowrap;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
}
.singer {
  width: 150px;
}
.play-time {
  width: 50px;
}
.play-logo {
  width: 40px;
  position: relative;
  top: 15px;
  left: 60px;
  cursor: pointer;
}
.play-logo img {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}
</style>
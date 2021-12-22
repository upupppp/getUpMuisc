<template>
  <div class="changeInfo">
    <div class="main">
      <p class="title">编辑个人信息</p>
      <form >
        <div class="nickname">
          <span>昵称:</span>
          <el-input v-model="nickname">
          </el-input>
        </div>
        <div class="introduce">
          <span>介绍:</span>
          <el-input
            type="textarea"
            :rows="5"
            :maxlength="10"
            v-model="introduce"
            >
          </el-input>
        </div>
        <div class="sex">
          <span>性别:</span>
          <el-radio-group fill="#303133" v-model="radio" >
                <el-radio :label="3">保密</el-radio>
                <el-radio :label="6">男</el-radio>
                <el-radio :label="9">女</el-radio>
          </el-radio-group>
        </div>
        <div class="birthday">
          <span>生日:</span>
          <el-select v-model="value1" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="value2"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="value2"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="area">
          <span>地区:</span>
          <el-select v-model="value1" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="value2"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </form>
    </div>
    <div class="aside">
      <div class="avarat">

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
      // options: [{
      //     value: '选项1',
      //     label: '1901'
      //   }],
        introduce: '',
        input: '',
        radio: 3,
        value1: [],
        value2: [],

        info:
          {
            nickname:String,
            introduce:String,
            sex:String,
            birthday:{
              year:Number,
              month:Number,
              day:Number
            }
          },
        nickname:'做人要哭'
    }
  },
  computed:{
    options() {
      let options =  [{
          value: '选项1',
          label: '1901'
        }];
     return options;
    }
  },
  created() {
        
  },
  methods: {
  },
  mounted(){
    let cookie = localStorage.getItem('cookie');
    axios.get('/user/account?cookie='+ cookie +'').then((res)=>{
          console.log(res);
    });
    // axios.get('/countries/code/list?cookie='+ cookie +'').then((res)=>{
    //       console.log(res);
    // });
    
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/index';
  .changeInfo{
    width: 60%;
    @extend %main;
    // background: greenyellow;
    height: 1000px;
    display: flex;
    justify-content: space-around;
    .main {
      width: 60%;
      .title {
        font-size: 35px;
        margin-bottom: 50px;
        color: $b-first;
        font-weight: 700;
      }
      form>div{
        margin-bottom: 25px;
        span {
          font-size: 18px;
          color: $b-second;
          margin-right: 15px;
        }
        .el-select {
           width: 183px;
           padding-right: 5px;
        }
        .el-input {
          border: none;
          outline: none;
          width: 600px;
          font-size: 16px;
          }
        &:nth-child(2) {
          span {
            position: relative;
            top: -95px;
          }
        }
        
        .el-textarea {
          width: 600px;
        }
        
        
      }
      
    }
    .aside {
      width: 40%;
      height: 200px;
      background: hotpink;
    }
  }
</style>
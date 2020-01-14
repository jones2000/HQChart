<template>
  <div class="tab-box">
    <div class="tablist">
      <ul> 
        <li v-show="IsMinute">
          <div class="set-gray"><span class="hq-icon hq_iconfont icon-document-add"></span></div>
        </li> 
        <li v-show="!IsMinute">
          <div :class="{liactive:CurrentTab=='信息地雷'}" @click="ClickTab(Information.Title)"><span class="hq-icon hq_iconfont icon-document-add"></span></div>
          <ul class="phoneRight information" v-show="IsInforma">
            <li v-for='(informa,informaFlag) in Information.Content' :key="informaFlag" class="noRight" :class='{active:KlineInfoFlag.indexOf(informaFlag)>=0}' @click="ChangeInformation(informa,informaFlag)">{{informa}}</li>
          </ul>
        </li>
        <li>
          <div :class="{liactive:CurrentTab=='云盘'}"><span class="hq-icon hq_iconfont icon-wendangyunpan"></span></div>
        </li>
        <li v-show="IsMinute">
          <div class="set-gray"><span class="hq-icon hq_iconfont icon-shandian"></span></div>
        </li>
        <li v-show="!IsMinute">
          <div :class="{liactive:CurrentTab=='复权'} " @click="ClickTab(RightIndex.Title)"><span class="hq-icon hq_iconfont icon-shandian"></span></div>
          <ul class="phoneRight" v-show="IsRight">
            <li v-for='(right,rightFlag) in RightIndex.Content' :key="rightFlag" @click='ChangeKlinRight(right,rightFlag)' class="noRight" :class='{active:KlineRightFlag == rightFlag}'>{{right}}</li>
          </ul>
        </li>
        <li>
          <div :class="{liactive:CurrentTab=='周期'}"  @click="ClickTab('周期')">{{PeriodList.Title}}</div>
          <ul class="tabs-period" v-show="IsPeriod">
            <li v-for='(period,inx) in PeriodList.Content' :key='inx' :class='{active : TabTextIndex == inx}' @click='ChangeChartTab(period.Name,inx)'>{{period.Name}}</li>
          </ul>
        </li>
        <li v-show="IsMinute">
          <div class="set-gray"><span class="hq-icon hq_iconfont icon-zhibiao"></span></div>
        </li>
        <li v-show="!IsMinute">
          <div :class="{liactive:CurrentTab=='指标'} " @click="ClickTab(MainIndex.Title)"><span class="hq-icon hq_iconfont icon-zhibiao"></span></div>
          <ul class="phoneRight indexWrap" v-show="IsLinetype">
            <li class="phone-tilte">主图指标</li>
            <li v-for='(indexItem,flag) in MainIndex.Content' :key="flag" @click='ChangeKlinIndex(indexItem,flag)' class="indexItem" :class='{active : KlineIndexFlag == flag }'>
              {{indexItem}}
            </li>
            <li class="phone-tilte">专家系统</li>
            <li class="indexItem" @click="GotoPlaying">玩家系统</li>
          </ul>
        </li>
        <li>
          <div :class="{liactive:CurrentTab=='截屏'}" @click="GetScreen"><span class="hq-icon hq_iconfont icon-yun"></span></div>
        </li>
      </ul>
    </div>
    
  </div>  
</template>

<script>
  import "../../../assets/hqiconfont.css"

  export default {
    name:'TabList',
    data () {
      return {
        IsMinute:true,
        Information:{Title:'信息地雷',Content:["公告","业绩预告","调研","大宗交易","龙虎榜","互动易","取消"]},
        CloudDisk:{Title:'云盘',Content:[]},
        SateLite:{Title:'截屏',Content:[]},
        PeriodList:{Title:'分时',Content:[            
          {Name:"分时",Value:1},
          {Name:"五日",Value:5},
          {Name:"日线",Value:0},
          {Name:"周线",Value:1},
          {Name:"月线",Value:2},
          {Name:"年线",Value:3},
          {Name:"1分钟",Value:4},
          {Name:"5分钟",Value:5},
          {Name:"15分钟",Value:6},
          {Name:"30分钟",Value:7},
          {Name:"60分钟",Value:8}
        ]},
        RightIndex:{Title:'复权',Content:['不复权','前复权','后复权']},
        MainIndex:{Title:'指标',Content:[ 'MA','BOLL','BBI','MIKE','PBX','ENE']},  //主图指标
        IsInforma:false,   //信息地雷
        IsPeriod: false,  //周期
        IsLinetype:false,  // K线类型
        IsRight:false,   //复权
        TabTextIndex:0,
        CurrentTab: 99,
        KlineRightFlag: 1,
        KlineIndexFlag:0,
        KlineInfoFlag: [], 
      }  
    },
    created(){
      document.title = "行情页面";
    },
    methods:{
      ClickTab(index){
        this.CurrentTab = index;
        switch(index){
          case '信息地雷':
            this.IsRight = false;
            this.IsLinetype = false;
            this.IsPeriod = false;
            this.IsInforma = !this.IsInforma;
            break;
          case 1:
            this.IsRight = false;
            this.IsLinetype = false;
            this.IsPeriod = false;
            this.IsInforma = false;
            break;
          case '周期':
            this.IsRight = false;
            this.IsLinetype = false;
            this.IsInforma = false;
            this.IsPeriod = !this.IsPeriod;
            break;
          case '复权':
            this.IsLinetype = false;
            this.IsPeriod = false;
            this.IsInforma = false;
            this.IsRight = !this.IsRight;
            break;
          case '指标':
            this.IsPeriod = false;
            this.IsRight = false;
            this.IsInforma = false;
            this.IsLinetype = !this.IsLinetype;
            break;
          case '截屏':
            this.IsRight = false;
            this.IsLinetype = false;
            this.IsPeriod = false;
            this.IsInforma = false;
            break;
        }
      },
      ChangeChartTab(name,index){
        this.PeriodList.Title = name;
        if(this.PeriodList.Title == "分时" || this.PeriodList.Title == "五日"){
          this.IsMinute = true;
        }else{
          this.IsMinute = false;
        }
        this.IsPeriod = false;
        this.TabTextIndex = index;
        this.$emit('ChangeChartTab',name,index);
      },
      ChangeKlinRight(name,index){
        // this.RightIndex.Title = name;
        this.IsRight = false;
        if(this.KlineRightFlag == index) return;
        this.KlineRightFlag = index;
        this.$emit('ChangeKlinRight',index);
      },
      ChangeKlinIndex(indexItem,flag){  //修改k线指标
        this.KlineIndexFlag = flag;
        this.IsLinetype = false;
        this.$emit('ChangeKlinIndex',indexItem,flag);
      },
      ChangeInformation(name,index){
        this.IsInforma = false;
        if(name == "取消"){
          this.KlineInfoFlag = [];
        }else{
          this.KlineInfoFlag.push(index);
        }
        this.$emit('ChangeInfomation',name);
      },
      GotoPlaying(){
        this.IsLinetype = false;
        this.$message("您没有获得使用权限，无法使用！");
      },
      GetScreen(){
        this.IsRight = false;
        this.IsLinetype = false;
        this.IsPeriod = false;
        this.IsInforma = false;
        this.$emit('screenShot');
      },  
    },
  }
</script>

<style lang="less">
  body,#app{
    height: 100%;
    width: 100%;
  }
  html,body{
    font: 62.5% "PingFang-SC-Regular", 'Microsoft Yahei';
  }
  .active{
    color: #217cd9;
  }
  .liactive{
    background-color: #ececec;
    height: 34px;
    color: #217cd9;
  }
  .tab-box{
    .tablist{
      width: 100%;
      height: 3.4rem;
      border-top: 1px solid #ececec;
      >ul{
        display: flex;
        width: 100%;
        height: 3.4rem;
        border-bottom: 1px solid #cccccc;
        >li{
          position:relative;
          flex: 1;
          height: 3.4rem;
          line-height: 3.4rem;
          font-size: 1.5rem;
          text-align: center;
          border-right: 1px solid #cccccc;
          .tabs-period{
            position: absolute;
            top: 3.5rem;
            z-index: 2;
            width: 7rem;
            background: #ffffff;
            box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.6);
            >li{
              display: block;
              line-height: 3.5rem;
              font-size: 1.4rem;
              border-bottom:1px solid #ececec;
            }
          }
          .hq-icon{
            font-size: 20px;
          }
        }
        >li:last-child{
          border-right:none;
        }
        .set-gray{
          line-height: 3.2rem;
          background-color: #f5f5f5;
          color:#999999;
        }
      }
    }
    .phoneRight { 
      position: absolute;
      top: 3.5rem;
      z-index: 2;
      margin-top: 0;
      width: 7rem;  
      height: auto;
      background: #ffffff;
      box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.6);
      li {
        line-height: 37px; 
        font-size: 1.4rem;
        text-align: center;
        border-bottom:1px solid #ececec;
      }
      li.active {
        color: #217cd9;
        background-color: #ffffff;
      }
      .phone-tilte{
        margin-top: 0!important;
        line-height: 3rem;
        background-color: #ececec;
      }
    } 
    .indexWrap{
      width: 9rem; 
      li{
        padding-left: 0.8rem;
        box-sizing: border-box;
        text-align: left;
      }
    }
  }
  
</style>
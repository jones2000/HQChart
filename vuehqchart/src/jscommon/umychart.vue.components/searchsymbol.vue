<!-- 
    股票代码搜索控件
-->

  <template>
  <div class="symbolWrap">
    <div class="inputBox" v-on:keyup.38="keyUp" v-on:keyup.40="keyDown" v-on:keyup.enter="keyEnter">
      <input
        class="myInput"
        v-model="Symbol"
        autofocus="autofocus"
        placeholder="请输入股票代码或简称"
        @keyup="SpellSock()"
        ref="inputSymbol"
      >
      <span class="iconBox" v-show="Symbol != '' ">
        <i class="el-icon-close myIcon" @click="deletSymbel()"></i>
      </span>
      <span v-show="searchKeywords" class="searchKeywords">
        搜
        <span class="keyWords">
          "
          <span class="widthSure">{{Symbol}}</span>"
        </span>
        相关股票
      </span>
      <div class="stockList" v-show="SpellListEle">
        <p
          class="item"
          v-for="(item,index) in SpellStockData"
          @click="hideSpellList(item)"
          @mousemove="mouseMove(index)"
          :key="index"
          :class="setSelect(index)"
        >
          <span class="symbol">{{item.Symbol}}</span>
          <span class="name">{{item.Name}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import JSCommonStock from "../umychart.vue/umychart.stock.vue.js";

import Vue from "vue";
import ElementUI from "element-ui";
import "../../../node_modules/element-ui/lib/theme-default/index.css";
import locale from "../../../node_modules/element-ui/lib/locale/lang/en";

Vue.use(ElementUI, { locale });

export default {
  name: "SearchSymbol",
  data() {
    return {
      Symbol: "",
      SearchStock: null,
      SpellStockData: [],
      SpellListEle: false,
      searchKeywords: false, // 控制搜索关键字行显示隐藏
      select: 0, // 搜索内容行
      oldSymbol: "",
      isQuery: true //是否查询
    };
  },

  methods: {
    // 键盘上键事件
    keyUp() {
      if (this.SpellStockData.length > 0) {
        this.select = this.select - 1;
        if (this.select < 0) {
          this.select = 0;
        }
        this.setScrollTo();
      }
    },
    // 键盘下键事件
    keyDown() {
      if (this.SpellStockData.length > 0) {
        this.select = this.select + 1;
        if (this.select >= this.SpellStockData.length) {
          this.select = this.SpellStockData.length - 1;
        }
        this.setScrollTo();
      }
    },
    keyEnter() {
      if (this.select > -1) {
        this.Symbol = this.SpellStockData[this.select].Symbol;
        this.searchKeywords = false;
        this.SpellListEle = false;
        this.isQuery = false;
        this.$emit("inputValue", this.Symbol);
      }
    },
    mouseMove(index) {
      this.select = index;
    },
    setScrollTo() {
      if (this.select >= 4) {
        let itemHeight = $(".item").height() + 4;
        $(".stockList").scrollTop(itemHeight * (this.select - 4));
      } else {
        $(".stockList").scrollTop(0);
      }
    },
    setSelect(index) {
      if (this.select === index) {
        return "select";
      }
    },

    SpellSock() {
      if (this.Symbol) {
        this.searchKeywords = true;
        this.SpellListEle = true;
      } else {
        this.searchKeywords = false;
        this.SpellListEle = false;
        return;
      }

      if (this.oldSymbol !== this.Symbol) {
        this.select = 0;
        this.oldSymbol = this.Symbol;

        if (this.isQuery) {
          this.SearchStock = JSCommonStock.JSStock.GetSearchStock(
            this.SpellCallback
          );
          var symbol = this.Symbol;
          this.SearchStock.Search(symbol, 2 | 4); //支持股票+指数
        }
        this.isQuery = true;
      }
    },

    SpellCallback(data) {
      var stocks = data.Data;
      this.SpellStockData = stocks;
      this.SpellListEle = true;
    },

    hideSpellList(stock) {
      var symbol = stock.Symbol;
      this.SpellListEle = false;
      this.searchKeywords = false;
      this.Symbol = symbol;
      this.$emit("inputValue", this.Symbol);
    //   this.$emit("inputStock", stock);
      this.isQuery = false;
    },

    deletSymbel() {
      this.Symbol = "";
      this.SpellListEle = false;
      this.searchKeywords = false;
      this.$nextTick(function() {
        //DOM 更新了
        this.$refs.inputSymbol.focus();
      });
    }
  }
};
</script>


<style lang="scss">
.symbolWrap {
  position: relative;
  .select {
    background-color: #fff3d8;
  }

  .myInput {
    width: 137px;
    height: 21px;
    line-height: 21px;
    color: #999;
    font-family: Microsoft YaHei;
    border: 1px solid #999;
  }

  .iconBox {
    display: inline-block;
    position: absolute;
    left: 122px;
    top: 0;

    .myIcon {
      color: #999;
      background: white;
      height: 19px;
      width: 14px;
    }
  }

  .searchKeywords {
    display: block;
    border: 1px solid #999;
    border-top: none;
    background: #f0f0f0;
    position: absolute;
    width: 192px;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    padding-left: 5px;
    z-index: 9999;
    top: 23px;

    .keyWords {
      color: red;
      display: inline-block;

      .widthSure {
        display: inline-block;
        max-width: 95px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
      }
    }
  }

  .searchKeywords:hover {
    background: #999;
  }

  .stockList {
    position: absolute;
    width: 197px;
    top: 45px;
    left: 0;
    max-height: 120px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #999;
    border-top: 1px solid #ccc;
    font-size: 14px;
    font-family: Microsoft YaHei;
    background-color: #fff;
    padding-right: -17px;
    z-index: 9999;

    .item {
      padding: 2px 0;
      width: 100%;
    }

    .symbol {
      padding-left: 15px;
      padding-right: 25px;
    }

    .name {
      padding-right: 10px;
    }
  }
}

.el-icon-close:before {
  font-size: 1px;
}

::-webkit-scrollbar {
  /* 滚动条整体部分 */
  width: 0px;
  margin-right: 2px;
}

::-webkit-scrollbar-thumb {
  /* 滑块 */
  border-radius: 5px;
  background-color: #999;
}

input::-webkit-input-placeholder {
  /*WebKit browsers*/
  font-size: 12px;
  font-family: Microsoft YaHei;
}

input::-moz-input-placeholder {
  /*Mozilla Firefox*/
  font-size: 12px;
  font-family: Microsoft YaHei;
}

input::-ms-input-placeholder {
  /*Internet Explorer*/
  font-family: Microsoft YaHei;
  font-size: 12px;
}
</style>
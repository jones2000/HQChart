<template>
  <div class="isshow">
    <div class="show-hide">
      <div class="exchangeInfoT">
        <table>
          <tbody>
            <tr>
                <td>成交额</td>
                <td><span class="pe">{{StockData.Amount.Text}}</span></td>
                <td class="clear"><span class="name">成交量</span><span class="marketV">{{StockData.Vol.Text}}</span></td>
                <td>委比</td>
                <td><span class="flowMarketV">{{StockData.BookRate.Text}}</span></td>
            </tr>
            <tr>
                <td>委差</td>
                <td><span class="pe">{{StockData.BookDiffer.Text}}</span></td>
                <td class="clear"><span class="name">换手率</span><span class="marketV">{{StockData.Excahngerate.Text}}</span></td>
                <td>量比</td>
                <td><span class="flowMarketV">{{StockData.Volratio.Text}}</span></td>
            </tr>
            <tr>
                <td>PE</td>
                <td><span class="pe">{{StockData.Pe.Text}}</span></td>                   
                <td class="clear"><span class="name">振幅</span><span class="amplitude">{{StockData.Amplitude.Text}}</span></td>
                <td>PB</td>
                <td><span class="pb">{{StockData.Pb.Text}}</span></td>
            </tr>
            <tr>
                <td>EPS</td>
                <td><span class="eps">{{StockData.Eps.Text}}</span></td>
                <td class="clear"><span class="name">滚动EPS</span><span class="scrollEPS">{{StockData.ScrollEPS.Text}}</span></td>
                <td>ROE</td>
                <td><span class="roe">{{StockData.Roe.Text}}</span></td>
            </tr>
            <tr>
                <td>总市值</td>
                <td class="clear">{{StockData.MarketV.Text}}</td>
                <td><span class="name">流通市值</span><span class="flowMarketV">{{StockData.FlowMarketV.Text}}</span></td>            
                <td></td>
                <td></td>
            </tr>
            <!-- <tr>
                <td>总股本</td>
                <td class="clear">{{StockData.CapitalTatol.Text}}</td>
                <td><span class="name">流通股本</span><span class="flowMarketV">{{StockData.CapitalA.Text}}</span></td>         
                <td></td>
                <td></td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div class="segment"></div>
      <div class="exchangeInfoT">
        <table>
          <tbody>
            <tr>
              <td style="width:14%;">涨停</td>
              <td class="clear" style="width:24%;" :class="StockData.MaxPrice.Color">{{StockData.MaxPrice.Text}}</td>
              <td style="width:36%;"><span class="name" style="margin-right
              10%;">跌停</span><span class="flowMarketV" :class="StockData.MinPrice.Color">{{StockData.MinPrice.Text}}</span></td>      
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> 
  </div>
</template>

<script>

    function DefaultData() {}

    DefaultData.GetStockData = function () //数据默认显示值
    {
        const data =
        {
            Name: { Text: '' },
            Price: { Text: '', Color: 'PriceNull' },
            RiseFallPrice: { Text: '', Color: 'PriceNull' },
            Increase: { Text: '', Color: 'PriceNull' },
            High: { Text: '', Color: 'PriceNull' },
            Low: { Text: '', Color: 'PriceNull' },
            Open: { Text: '', Color: 'PriceNull' },
            MaxPrice: { Text: '', Color: 'PriceNull' },
            MinPrice: { Text: '', Color: 'PriceNull' },
            YClose: { Text: '' },

            Excahngerate: { Text: '', Color: 'PriceNull' },
            Amount: { Text: '' }, Vol: { Text: '' },
            Pe: { Text: '' }, Roe: { Text: '' },
            MarketV: { Text: '' }, FlowMarketV: { Text: '' },
            Eps: { Text: '' }, ScrollEPS: { Text: '' },
            Pb: { Text: '' }, Amplitude: { Text: '' },
            BookRate: { Text: '' }, BookDiffer: { Text: '' },
            Volratio: { Text: '' },CapitalTatol: { Text: '' },
            CapitalA: { Text: '' },
            //指数才有
            Down: { Text: '' }, //上涨
            Up: { Text: '' },   //下跌
            Unchanged: { Text: '' },   //平盘
            Stop: { Text: '' },         //停牌

            HK:{Symbol: "", Name: ""},
            IsMargin:false,     //融资融券
            IsSHHK:false,       //沪港通
            IsHK:false,         //港股

            SellerFive:[],
            BuyerFive:[],
            Dealer:[]
        };

        return data;
    }

  export default {
    name:'showHide',
    props:[
      'StockDataF'
    ],
    data () {
      return {
        StockData:DefaultData.GetStockData(),
      }  
    },
    created(){
      
    },
    watch:{
      StockDataF(val){
        this.StockData = val;
      },
    },
    methods:{
      
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

  [v-cloak]{
    display: none;
  }
  .isshow{
    .show-hide{
      height: calc(100% - 10.3rem);
      width: 100%;
      position:absolute;
      top: 10.3rem;
      left: 0;
      z-index: 100;
      background: rgba(0,0,0,0.4);
      .exchangeInfoT {padding: 1rem;box-sizing:border-box;width: 100%; border-collapse: collapse; border: none;background-color: #f5f5f5;}
      .exchangeInfoT tr {height: 1.6rem; line-height: 2rem;}
      .exchangeInfoT tr>td { font-size: 1.3rem;}
      .exchangeInfoT tr>td:nth-of-type(1) { width: 12%;}
      .exchangeInfoT tr>td:nth-of-type(2) { width: 22%; padding-right: 4%; text-align: right;}
      .exchangeInfoT tr>td:nth-of-type(3) { width: 36%; padding-right: 4%; text-align: right; }
      .exchangeInfoT tr>td:nth-of-type(3)>.name {float: left;}
      .exchangeInfoT tr>td:nth-of-type(4) { width: 10%;}
      .exchangeInfoT tr>td:nth-of-type(5) { width: 12%; text-align: right;}
    }
  }
  
</style>
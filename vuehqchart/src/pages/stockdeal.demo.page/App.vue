  <template>
      <div>
          <div>
              <button type="button" @click='ChoiceCount(100)'>>=100</button>
              <button type="button" @click='ChoiceCount(500)'>>=500</button>
              <button type="button" @click='ChoiceDate(20180506)'>20180506</button>
              <button type="button" @click='ChoiceDate(20180509)'>20180509</button>
              <button type="button" @click='ReverseData(true)'>倒序</button>
          </div>
          <div id='app2' style="width:1400px;height:500px;">
              <StockDeal ref='stockdeal' :ChoiceIndex='CurrentChoiceIndex' :ChoiceDate='CurrentDate' :IsReverse='IsReverse'></StockDeal>
          </div>
      </div>
  </template>





  <script>
      import StockDeal from '../../jscommon/umychart.vue.components/stockdeal.vue'

      export default {
          name: 'StockDealDemo',
          data() {
              return {
                  CurrentChoiceIndex: '',
                  CurrentDate: '20180508',
                  IsReverse:false
              };
          },
          components: {
              StockDeal
          },

          props: [],

          //创建
          created: function () {

          },

          mounted: function () {
              this.OnSize();
          },

          methods: {
              ChoiceCount(count) {
                this.CurrentChoiceIndex = count;
              },
              ChoiceDate(date){
                  this.CurrentDate = date;
              },
              ReverseData(boo){
                this.IsReverse = boo;
              },
              OnSize() {
                  var stockdeal = this.$refs.stockdeal;
                  stockdeal.OnSize();
              }
          }
      }
  </script>

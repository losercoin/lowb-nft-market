<template>
  <div>
    <!-- boot轮播图开始 -->
    <div>
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls fade
        :label-next="this.$t('lang.labelNext')"
        :label-prev="this.$t('lang.labelPrev')"
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide
          caption="Loser Punks 666"
          :text="this.$t('lang.aHomageToCryptopunksTheFirstNonFungibleTokenonEthereum') "
          :img-src="require('../assets/loserpunk.jpg')"
        ></b-carousel-slide>
        <b-carousel-slide
          :caption="this.$t('lang.futureNFTIsPlanning') "
          :text="this.$t('lang.stayTuned') "
          :img-src="require('../assets/future.jpg')"
        ></b-carousel-slide>
      </b-carousel>

      <!-- <p class="mt-4">
        Slide #: {{ slide }}<br>
        Sliding: {{ sliding }}
      </p> -->
    </div>
    <!-- boot轮播图结束 -->
    <div class="low-list" v-if="$store.state.chainId == $store.state.CHAIN_ID">
      <h3 class="title" style="display: inline-block;">Loser Punks 666</h3>
      <div style="display: inline-block;" v-if="$root.$i18n.locale=='zh'">
        <a style="margin-left: 12px;" href="https://www.losernft.org/loser_punk_zh.jpg">竞拍规则</a>
        <a style="margin-left: 12px;" href="https://view.officeapps.live.com/op/view.aspx?src=https://losernft.org/auction_100.xlsx">竞拍数据</a>
      </div>
      <div style="display: inline-block;" v-else>
        <a style="margin-left: 12px;" href="https://www.losernft.org/loser_punk_en.jpg">auction rules</a>
        <a style="margin-left: 12px;" href="https://view.officeapps.live.com/op/view.aspx?src=https://losernft.org/auction_100.xlsx">auction data</a>
      </div>
      <br>

      <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="btnradio" id="all" autocomplete="off" :checked="$store.state.punkMode=='all'">
        <label class="btn btn-outline-primary" for="all" v-on:click="filter_punks('all')">{{ $t("lang.all") }}</label>

        <input type="radio" class="btn-check" name="btnradio" id="all_bids" autocomplete="off" :checked="$store.state.punkMode=='all_bids'">
        <label class="btn btn-outline-primary" for="all_bids" v-on:click="filter_punks('all_bids')">{{ $t("lang.allBids") }}</label>

        <input type="radio" class="btn-check" name="btnradio" id="for_sale" autocomplete="off" :checked="$store.state.punkMode=='for_sale'">
        <label class="btn btn-outline-primary" for="for_sale" v-on:click="filter_punks('for_sale')">{{ $t("lang.forSale") }}</label>

        <input type="radio" class="btn-check" name="btnradio" id="pre_sale" autocomplete="off" :checked="$store.state.punkMode=='pre_sale'">
        <label class="btn btn-outline-primary" for="pre_sale" v-on:click="filter_punks('pre_sale')">{{ $t("lang.preSale") }}</label>
      </div>
      <!-- low列表开始 -->
      <div>
        <div v-if="$store.state.loserPunkState!='idle'">
          <br>
          <p>{{$t("lang.loading")}} {{this.$store.state.loserPunkState}}/{{this.$store.state.nftInfos.length}}</p>
        </div>
        <div v-else>
          <div class="list">
            <div v-for="nft in nowData" :key="nft.id" class="item">
              <router-link :to="{path: '/detail/'+nft._id}" class="link">
                <b-card
                  :title="nft.name"
                  :img-src="$store.state.IPFS_SERVER + nft.uri"
                  img-alt="Image"
                  img-top
                  tag="article"
                  style="max-width: 20rem; color: #000"
                  class="mb-2"
                >
                  <div class="css-price-area">
                    <!-- <IconBNB /> -->
                    <!-- <icon-base width="20" height="20" icon-name="lowb"><icon-lowb /></icon-base>  -->
                    <span class="css-price">{{nft.price}}&nbsp;BNB</span>
                  </div>
                </b-card>
              </router-link>
            </div>
          </div>
          <!-- 分页组件 -->
          
          <b-pagination per-page="12" v-model="$store.state.punkPage" :total-rows="rows" @change="page" align="right"></b-pagination>
          <p align="right">
          <input type="number" style="width:50px;" v-model="goPage" @keydown="go_page">
          <button class="btn btn-outline-primary" type="button" id="button-addon2" v-on:click="go_page">Go</button>
          </p>

          <!-- 分页组件 -->
        </div>
      </div>
      <!-- low列表结束 -->

    </div>

    <div class="row" v-else>
      <p>{{ $t("lang.connectTotheBSCChaintoViewAllPublishedPunks") }}</p>
    </div>

  </div>
</template>

<script>
import IconBase from './IconBase.vue'
import IconLowb from './icons/IconLowb.vue'
import IconBNB from './icons/IconBNB.vue'

export default {
  components: {
    IconBase,
    IconLowb,
    IconBNB
  },
    data() {
      return {
        slide: 0,
        sliding: null,
        data:[],
        nowData:[],
        rows: 0,
        goPage: 1
      }
    },
    mounted (){
      // this.data = this.$store.getters.loser_punks(this.$store.state.punkMode);
      this.getMyNFTs();
    },
    watch: {
      
    },
    methods: {
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      },
      page(page){
        this.goPage = page;
        this.getMyNFTs();
      },
      filter_punks(filter){

      },
      go_page(){
        this.getMyNFTs();
      },
      getMyNFTs: async function() {
        let response = await axios.get(this.$store.state.BACKEND_SERVER + '/v1/nft/all', {
          params: {
            page: this.goPage
          }
        });

        if(response.data.code != 200) {
          console.log(response.data.message);
          return; 
        }
        console.log(response.data.data);
        this.nowData = response.data.data.data;
      }
    }
}
</script>

<style lang="scss" scoped>
.container-punk-event-large {
    margin-top: 10px;
    min-height: 260px;
    line-height: 1.3em;
}
.punk-image-container {
    position: relative;
    display: inline-block;
}
a {
    color: #ff04b4;
    text-decoration: none;
    font-weight: 700;
}
body {
    font-family: Montserrat,sans-serif;
    font-size: 18px;
    line-height: 1.47;
    color: #181818;
    background-color: #fff;
}
#carousel-1{
  filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 20px 20px);
}
.low-list{
  padding: 0 24px;
  .title{
    padding-top: 96px;
    padding-bottom: 24px;
    font-size: 24px;
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .item{
    box-shadow: 0px 10px 20px rgba(0,0,0,0.05);margin: 24px;width: 20%;max-width: 364px;min-width: 235px;border-radius: 10px; overflow: hidden;transition:all linear 0.1s;
    &:hover{
      transform: translate(0,-10px);
    }
  }
  .css-price-area {
    display: flex;
    align-items: center;
  }
}

</style>
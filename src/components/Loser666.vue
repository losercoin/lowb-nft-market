<template>
  <div>
    <!-- boot轮播图开始 -->
    <div>
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls fade
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide
          caption="第一个banner"
          text="第一个banner的描述"
          img-src="https://img2.baidu.com/it/u=3767017447,3027799514&fm=26&fmt=auto&gp=0.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="第二个banner"
          text="第二个banner的描述"
          img-src="https://img2.baidu.com/it/u=3270371325,1488241176&fm=26&fmt=auto&gp=0.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="第三个banner"
          text="第三个banner的描述"
          img-src="https://img1.baidu.com/it/u=3582888920,4096818954&fm=26&fmt=auto&gp=0.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="第四个banner"
          text="第四个banner的描述"
          img-src="https://img2.baidu.com/it/u=3767017447,3027799514&fm=26&fmt=auto&gp=0.jpg"
        ></b-carousel-slide>
      </b-carousel>

      <!-- <p class="mt-4">
        Slide #: {{ slide }}<br>
        Sliding: {{ sliding }}
      </p> -->
    </div>
    <!-- boot轮播图结束 -->
    <div v-if="$store.state.isMetaMaskInstalled" class="low-list">
      <h3 class="title">Loser Punks 666</h3>
      <!-- low列表开始 -->
      <div class="list" v-if="$store.state.chainId == $store.state.CHAIN_ID">
        <div v-for="nft in $store.state.nftInfos" :key="nft.id" class="item">
          <b-card
            :title="nft.name"
            :img-src="nft.image"
            img-alt="Image"
            img-top
            tag="article"
          >
            <b-card-text>
              {{nft.description}}
            </b-card-text>

            <!-- <b-button href="#" variant="primary">Go somewhere</b-button> -->
            <div class="m-t-10"><router-link :to="{path: '/token-details/'+nft.id}">Go: #{{nft.id}} details</router-link></div>
          </b-card>
        </div>
      </div>
      <!-- low列表结束 -->

      <!-- <div class="row" v-if="$store.state.chainId == $store.state.CHAIN_ID">
        <div v-for="nft in $store.state.nftInfos" :key="nft.id" class="col-md-2 col-sm-3 col-xs-6 container-punk-event-large">
          <div class="punk-image-container">
            <div>
              <img :src="nft.image" width="144" height="144" alt="Punk 3100" class="pixelated" style="background: #638596">
            </div>
          </div>
          <div class="m-t-10"><router-link :to="{path: '/token-details/'+nft.id}">#{{nft.id}}</router-link></div>
        </div>
      </div> -->
      <div class="row" v-else>
        <p>Connect to the BSC chain to view all published punks!</p>
      </div>
    </div>
    <div v-else>
      <p>Install MetaMask first!</p>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        slide: 0,
        sliding: null
      }
    },
    methods: {
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
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
}

</style>
<template>
  <div>
    <div v-if="$store.state.isMetaMaskInstalled">
      <h3>Loser Punks 666</h3>
      <div class="row" v-if="$store.state.chainId == $store.state.CHAIN_ID">
        <div v-for="nft in $store.state.nftInfos" :key="nft.id" class="col-md-2 col-sm-3 col-xs-6 container-punk-event-large">
          <div class="punk-image-container">
            <div>
              <img :src="nft.image" width="144" height="144" alt="Punk 3100" class="pixelated" style="background: #638596">
            </div>
          </div>
          <div class="m-t-10"><router-link :to="{path: '/token-details/'+nft.id}">#{{nft.id}}</router-link></div>
        </div>
      </div>
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

}
</script>

<style scoped>
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
</style>
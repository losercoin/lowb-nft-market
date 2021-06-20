<template>
  <div>
    <div>
      <b-card no-body class="overflow-hidden">
        <b-row no-gutters>
          <b-col md="4">
            <b-card-img :src="require('../assets/'+$store.state.nftInfos[groupId-1].image)" alt="Image" class="rounded-0"></b-card-img>
          </b-col>
          <b-col md="8">
            <b-card-body :title="$store.state.nftInfos[groupId-1].name">
              <p>{{ $t("lang.groupId") }}: #{{groupId}}  {{ $t("lang.inProgress") }}: {{$store.state.nftInfos[groupId-1].currentSupply}}/{{$store.state.nftInfos[groupId-1].circulation}}</p>
              <p>{{ $t("lang.details") }}: {{$store.state.nftInfos[$route.params.id-1].description}}</p>
              <br>
              <div v-if="$store.state.bidsAdmin[groupId].address.toLowerCase() == $store.state.account.toLowerCase()">
                <h4>{{ $t("lang.publicSale") }}</h4>
                <div class="input-group mb-3">
                  <input type="number" class="form-control" placeholder="0" @keyup="correct_sellPrice" v-model="sellPrice">
                  <span class="input-group-text">lowb</span>
                  <button v-if="!$store.state.bidsAdmin[groupId].isApproved" class="btn btn-primary" type="button" v-on:click="approve">{{ $t("lang.approve") }}</button>
                  <button v-else class="btn btn-primary active" type="button" v-on:click="startSale" :disabled="sellPrice<=0">{{ $t("lang.startSale") }}</button>
                </div>
              </div>
              <div v-if="$store.getters.my_bid(groupId) != null">
                <h4>{{ $t("lang.yourBid") }}</h4>
                <p>{{ $t("lang.youbid") }} {{$store.getters.my_bid(groupId).price}} {{ $t("lang.lowbForThisItem") }} <a href="#" @click="withdraw">[{{ $t("lang.withdraw") }}]</a></p>
              </div>
              <div v-else>
                <h4>{{ $t("lang.placeaBid") }}</h4>
                <p>{{ $t("lang.yourLowbMarketBalance") }}: {{$store.getters.lowb_market_balance}} lowb</p>
                <div class="input-group mb-3">
                  <input type="number" class="form-control" placeholder="0" @keyup="correct_toBid" v-model="toBid">
                  <span class="input-group-text">lowb</span>
                  <button class="btn btn-primary" type="button" id="button-addon2" @click="bid" :disabled="toBid<=0||$store.state.lowbMarketBalance<toBid*1e18">{{ $t("lang.bid") }}</button>
                </div>
              </div>
              <div>{{ $t("lang.marketSummary") }}</div>
              <hr class="mt-1 mb-2">
              <p>{{ $t("lang.totalBidders") }}: {{$store.state.itemBids[groupId].length}}</p>
              <p>{{ $t("lang.topBid") }}: {{$store.getters.max_bid(groupId)}} LOWB</p>
              <br>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <br>
    <div v-if="$store.state.nftInfos[groupId-1].price > 0">
      <h2>{{ $t("lang.onSale") }}</h2>
        <p>{{ $t("lang.youCanBuyThisItemWith") }} {{$store.state.nftInfos[groupId-1].price/1e18}} LOWB.
          <button class="btn btn-primary me-md-2" type="button" @click="approveBuy" :disabled="$store.state.nftInfos[groupId-1].price <= $store.state.approvedBalance">{{ $t("lang.approve") }}</button>
          <button class="btn btn-primary me-md-2" type="button" @click="buy" :disabled="$store.state.nftInfos[groupId-1].price > $store.state.approvedBalance">{{ $t("lang.buy") }}</button>
        </p>
      </div>
    <h2>{{ $t("lang.openBids") }}</h2>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{{ $t("lang.maker") }}</th>
          <th scope="col">{{ $t("lang.taker") }}</th>
          <th scope="col">{{ $t("lang.price") }}</th>
          <th scope="col">{{ $t("lang.action") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bid in $store.state.itemBids[groupId]" :key="bid.index">
          <th scope="row">{{bid.index}}</th>
          <td>{{bid.maker}}</td>
          <td>{{bid.taker}}</td>
          <td>{{bid.price}}</td>
          <td v-if="$store.state.bidsAdmin[groupId].address.toLowerCase() != $store.state.account.toLowerCase()">{{ $t("lang.none") }}</td>
          <td v-else-if="$store.state.bidsAdmin[groupId].isApproved"><a href="#" @click="accept(bid.maker)">[{{ $t("lang.accept") }}]</a></td>
          <td v-else><a href="#" @click="approve">[{{ $t("lang.approve") }}]</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        toBid: 0,
        sellPrice: 0,
        groupId: this.$route.params.id
      }
    },
    created () {
      this.$store.commit('setItemBids', {id: this.groupId, bids: []})
      this.$store.commit('setBidsAdmin', {id: this.groupId, bidAdmin: {address: "0x0", isApproved: false}})
      this.$store.dispatch('updateBids', this.groupId)
    },
    methods: {
      correct_toBid: function () {
        if (this.toBid > 0) {
          this.toBid = Math.floor(this.toBid)
        }
        else {
          this.toBid = 0
        }
      },
      correct_sellPrice: function () {
        if (this.sellPrice > 0) {
          this.sellPrice = Math.floor(this.sellPrice)
        }
        else {
          this.sellPrice = 0
        }
      },
      bid: function () {
        console.log("Bid this new token")
        const myBid = {groupId: this.groupId, amount: this.toBid}
        this.$store.dispatch('enterBid', myBid)
        this.toBid = 0
      },
      withdraw: function () {
        console.log("withdraw the bid")
        this.$store.dispatch('withdrawBid', this.groupId)
      },
      approve: function () {
        console.log("approve contract")
        this.$store.dispatch('approveGroupBid', this.groupId)
      },
      accept: function (bidder) {
        console.log("accept the bid")
        const bid = {id: this.groupId, bidder: bidder}
        this.$store.dispatch('acceptNewBid', bid)
      },
      startSale: function () {
        console.log("start sale")
        const offer = {id: this.groupId, amount: this.sellPrice}
        this.$store.dispatch('startSale', offer)
        this.sellPrice = 0
      },
      approveBuy: function () {
        console.log("approve buy")
        this.$store.dispatch('approveLowb', this.$store.state.nftInfos[this.groupId-1].price/1e18)
      },
      buy: function () {
        console.log("buy")
        const payload = {id: this.groupId, amount: this.$store.state.nftInfos[this.groupId-1].price/1e18}
        this.$store.dispatch('buyNewItem', payload)
      },
    }
  }
</script>
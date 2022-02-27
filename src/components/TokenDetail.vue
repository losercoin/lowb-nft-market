<template>
  <div>
    <notifications 
      group="tokendetail" 
      position="top right"/>
    <div>
      <b-card no-body class="overflow-hidden">
        <b-row no-gutters>
          <b-col md="4">
            <b-card-img :src="require('../assets/'+$store.state.nftInfos[groupId-1].image)" alt="Image" class="rounded-0"></b-card-img>
          </b-col>
          <b-col md="8">
            <b-card-body :title="$store.state.nftInfos[groupId-1].name">
              <p>{{ $t("lang.groupId") }}: #{{groupId}}  {{ $t("lang.circulation") }}: {{$store.state.nftInfos[groupId-1].circulation}}</p>
              <p>{{ $t("lang.details") }}: {{$store.state.nftInfos[$route.params.id-1].description}}</p>
              <br>
              <div v-if="$store.getters.my_bid(groupId) != null">
                <h4>{{ $t("lang.yourBid") }}</h4>
                <p>{{ $t("lang.youbid") }} {{$store.getters.my_bid(groupId).price}} {{ $t("lang.lowbForThisItem") }} <a href="#" @click="withdrawBid">[{{ $t("lang.withdraw") }}]</a></p>
              </div>
              <div v-else>
                <h4>{{ $t("lang.设置出价") }}:</h4>
                <p>{{ $t("lang.yourLowbMarketBalance") }}: {{$store.getters.lowb_market_balance}} lowb</p>
                <div class="input-group mb-3">
                  <input type="number" class="form-control" placeholder="0" @keyup="correct_toBid" v-model="toBid">
                  <span class="input-group-text">lowb</span>
                  <button class="btn btn-primary" type="button" id="button-addon2" @click="bid" :disabled="toBid<=0||$store.state.lowbMarketBalance<toBid*1e18">{{ $t("lang.bid") }}</button>
                </div>
              </div>
              <div>{{ $t("lang.marketSummary") }}</div>
              <hr class="mt-1 mb-2">
              <p>{{ $t("lang.lowestSalePrice") }}: {{$store.getters.min_price(groupId)}} lowb</p>
              <p>{{ $t("lang.topBid") }}: {{$store.getters.max_bid(groupId)}} lowb</p>
              <br>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <br>
    <h2>{{ $t("lang.openOffers") }}</h2>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{{ $t("lang.maker") }}</th>
          <th scope="col">{{ $t("lang.taker") }}</th>
          <th scope="col">{{ $t("lang.price") }}</th>
          <th scope="col">  </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="offer in $store.state.itemOffers[groupId]" :key="Number(offer.itemId)" >
          <th scope="row">#{{offer.itemId}}</th>
          <td>{{offer.seller}}</td>
          <td>{{ $t("lang.anyone") }}</td>
          <td>{{offer.minValue/1e18}}</td>
          <td>
            <div v-if="offer.seller.toLowerCase() == $store.state.account.toLowerCase()">
              <a href="#" @click="withdrawOffer(offer.itemId)">[{{ $t("lang.withdraw") }}]</a>
            </div>
            <div v-else>
              <a href="#" @click="approveLowb(offer.minValue/1e18)" v-if="offer.minValue > $store.state.approvedBalance">[{{ $t("lang.approveLowbtoBuy") }}]</a>
              <a href="#" @click="buy(offer.itemId, offer.minValue/1e18)" v-else>[{{ $t("lang.buy") }}]</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>


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
          <td>
            <div v-if="$store.getters.my_group_tokens(groupId).isNull">
              {{ $t("lang.none") }}
            </div>
            <div v-else>
              {{ $t("lang.approve") }}: <div><b-button pill variant="outline-success" @click="approve(token)" v-for="token in $store.getters.my_group_tokens(groupId).toApprove" :key="token">{{token}}</b-button></div>
              {{ $t("lang.accept") }}: <div><b-button pill variant="outline-success" @click="accept(token, bid.maker)" v-for="token in $store.getters.my_group_tokens(groupId).toAccept" :key="token">{{token}}</b-button></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        groupId: this.$route.params.id,
        toBid: 0,
      }
    },
    created () {
      this.$store.commit('setItemBids', {id: this.groupId, bids: []})
      this.$store.dispatch('updateBids', this.groupId)
      this.$store.dispatch('updateOffers', this.groupId)
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
      bid: function () {
        console.log("Bid this token")
        const myBid = {groupId: this.groupId, amount: this.toBid}
        this.$store.dispatch('enterBid', myBid)
        this.toBid = 0
      },
      approve: function (token) {
        console.log("approve the nft: ", token)
        this.$store.dispatch('approveItemBid', {item: token, group: this.groupId})
      },
      accept: function (token, bidder) {
        console.log("accept the bid: ", token)
        const bid = {id: token, groupId: this.groupId, bidder: bidder}
        this.$store.dispatch('acceptBid', bid)
      },
      withdrawBid: function () {
        console.log("withdraw the bid")
        this.$store.dispatch('withdrawBid', this.groupId)
      },
      withdrawOffer: function (id) {
        console.log("withdraw the offer")
        this.$store.dispatch('withdrawOffer', {item: id, group: this.groupId})
      },
      approveLowb: function (amount) {
        console.log("approve lowb")
        this.$store.dispatch('approveLowb', amount)
      },
      buy: function (id, amount) {
        console.log("buy the nft")
        this.$store.dispatch('buyItem', {id: id, groupId: this.groupId, amount: amount})
      },
    }
  }
</script>
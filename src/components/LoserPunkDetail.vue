<template>
  <div>
    <div class="container" style="margin-bottom: 24px;">
      <div class="row" style=' margin-left: 0px; margin-right: 0px;'>
        <div class="col-md-12 col-xs-12" style="background-color: #638596;">
          <img :src="$store.state.nftInfos[groupId-1].image" style='max-height: 312px; max-width: 312px; margin-top: 50px;' class="img-responsive center-block"/>
        </div>
      </div>
    </div>
    <div id="punkDetails" class='container text_block'>
      <div class='row'>
        <div class="col-md-10 col-md-offset-1 col-xs-12" style='margin-top: 20px;'>
          <h1 style="margin-top: 0px; margin-bottom: 5px;">{{$store.state.nftInfos[groupId-1].name}}</h1>
          <h4 style="margin-top: 0px;">One of <b>3840</b> <a href="#">Female</a> punks.</h4>
        </div>
      </div>
      <br>
      <div class='row detail-row'>
        <div class='col-md-10 col-md-offset-1'>
            <h3>Accessories</h3>

                <div class='row'>
                    <div class='col-md-4'>
                        <a href="#">Stringy Hair</a>
                        <br>
                        <b>463</b> punks have this.
                    </div>
                    <div class='col-md-4'>
                        <a href="#">Earring</a>
                        <br>
                        <b>2459</b> punks have this.
                    </div>
                    <div class='col-md-4'>
                        <a href="#">Cigarette</a>
                        <br>
                        <b>961</b> punks have this.
                    </div>
                </div>
        </div>
      </div>
      <br>
      <div class='row detail-row'>
        <div class='col-md-10 col-md-offset-1'>
          <h3>Owners</h3>
          <div>This punk is currently owned by address <a href="#">0xcf8401</a>.</div>
        </div>
      </div>
      <br>
      <div class='row detail-row'>
        <div class='col-md-10 col-md-offset-1'>
          <h3>Open Offers</h3>
          <table class="table table-hover" v-if="$store.state.itemOffers[groupId] && $store.state.itemOffers[groupId].length > 0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Maker</th>
                <th scope="col">Taker</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="offer in $store.state.itemOffers[groupId]" :key="Number(offer.itemId)" >
                <th scope="row">#{{offer.itemId}}</th>
                <td>{{offer.seller}}</td>
                <td>Anyone</td>
                <td>{{offer.minValue/1e18}}</td>
                <td>
                  <div v-if="offer.seller.toLowerCase() == $store.state.account.toLowerCase()">
                    <a href="#" @click="withdrawOffer(offer.itemId)">[Withdraw]</a>
                  </div>
                  <div v-else>
                    <a href="#" @click="approveLowb(offer.minValue/1e18)" v-if="offer.minValue > $store.state.approvedBalance">[Approve lowb to buy]</a>
                    <a href="#" @click="buy(offer.itemId, offer.minValue/1e18)" v-else>[Buy]</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>This punk has not been listed for sale by its owner.</div>
        </div>
      </div>
      <br>
      <div class='row detail-row'>
        <div class='col-md-10 col-md-offset-1'>
          <h3>Open Bids</h3>
          <table class="table table-hover"  v-if="$store.state.itemBids[groupId] && $store.state.itemBids[groupId].length > 0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Maker</th>
                <th scope="col">Taker</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
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
                    N/A
                  </div>
                  <div v-else>
                    Approve: <div><b-button pill variant="outline-success" @click="approve(token)" v-for="token in $store.getters.my_group_tokens(groupId).toApprove" :key="token">{{token}}</b-button></div>
                    Accept: <div><b-button pill variant="outline-success" @click="accept(token, bid.maker)" v-for="token in $store.getters.my_group_tokens(groupId).toAccept" :key="token">{{token}}</b-button></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>There are currently no bids on this punk.</div>
        </div>
      </div>
      <br>
      <div class='row detail-row'>
        <div class='col-md-10 col-md-offset-1'>
          <div v-if="$store.getters.my_bid(groupId) != null">
            <h3>Your bid</h3>
            <p>You bid {{$store.getters.my_bid(groupId).price}} lowb for this item. <a href="#" @click="withdrawBid">[Withdraw]</a></p>
          </div>
          <div v-else>
            <h3>Place a bid</h3>
            <p>Your lowb market balance: {{$store.getters.lowb_market_balance}} lowb</p>
            <div class="input-group mb-3">
              <input type="number" class="form-control" placeholder="0" @keyup="correct_toBid" v-model="toBid">
              <span class="input-group-text">lowb</span>
              <button class="btn btn-primary" type="button" id="button-addon2" @click="bid" :disabled="toBid<=0||$store.state.lowbMarketBalance<toBid*1e18">Bid</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
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

<style scoped>

h1, h2, h3, h4 {
    font-weight: 700;
    line-height: 1.2em;
    margin: 0 0 0.8em;
}
a {
    color: #ff04b4;
    text-decoration: none;
    font-weight: 700;
}
.center-block {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.container .img-responsive {
    width: 100%;
}
#punkDetails {
    font-family: Montserrat,sans-serif;
    font-size: 18px;
    line-height: 1.47;
    color: #181818;
    background-color: #fff;
}
</style>
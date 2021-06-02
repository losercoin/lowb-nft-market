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
              <p>group id: #{{groupId}}  In progress: {{$store.state.nftInfos[groupId-1].currentSupply}}/{{$store.state.nftInfos[groupId-1].circulation}}</p>
              <p>Details: {{$store.state.nftInfos[$route.params.id-1].description}}</p>
              <br>
              <div v-if="$store.getters.my_bid(groupId) != null">
                <h4>Your bid</h4>
                <p>You bid {{$store.getters.my_bid(groupId).price}} lowb for this item. <a href="#" @click="withdraw">[Withdraw]</a></p>
              </div>
              <div v-else>
                <h4>Place a bid</h4>
                <p>Your lowb market balance: {{$store.getters.lowb_market_balance}} lowb</p>
                <div class="input-group mb-3">
                  <input type="number" class="form-control" placeholder="0" @keyup="correct_toBid" v-model="toBid">
                  <span class="input-group-text">lowb</span>
                  <button class="btn btn-primary" type="button" id="button-addon2" @click="bid" :disabled="toBid<=0||$store.state.lowbMarketBalance<toBid*1e18">Bid</button>
                </div>
              </div>
              <div>Market Summary</div>
              <hr class="mt-1 mb-2">
              <p>Total Bidders: 2</p>
              <p>Top Bid: 1000 lowb</p>
              <br>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <br>

    <h2>Open Bids</h2>
    <table class="table table-hover">
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
          <td><a :href="'#'+bid.maker">Approve</a> <a :href="'#'+bid.maker">Accept</a></td>
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
        groupId: this.$route.params.id
      }
    },
    created () {
      this.$store.commit('setItemBids', {id: this.groupId, bids: []})
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
    }
  }
</script>
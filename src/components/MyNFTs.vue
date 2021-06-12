<template>
  <div>
    <div class="shadow px-5">
      <div class="row">
        <div class="col-6">
          <div class="css-cogtoi">Your BSC Wallet address</div>
          <div class="css-94onap">{{$store.state.account}}</div>
        </div>
        <div class="col">
          <div class="css-cogtoi">Lowb Balance</div>
          <div class="css-94onap">{{$store.getters.lowb_balance}} lowb</div>
        </div>
        <div class="col">
          <div class="css-cogtoi">Lowb Market Balance</div>
          <div class="css-94onap">{{$store.getters.lowb_market_balance}} lowb</div>
        </div>
      </div>
      <br>
      <div class="row">
        <h4>Deposit and Withdraw</h4>
        <div class="input-group mb-3 col">
          <input type="number" class="form-control" @keyup="correct_toDeposit" v-model="toDeposit">
          <span class="input-group-text" >lowb</span>
          <button class="btn btn-primary" type="button" v-on:click="approve">Approve</button>
          <button class="btn btn-primary active" type="button" v-on:click="deposit" :disabled="toDeposit<=0||$store.state.approvedBalance<toDeposit*1e18">Deposit</button>
        </div>
        <div class="input-group mb-3 col">
          <input type="number" class="form-control" @keyup="correct_toWithdraw" v-model="toWithdraw">
          <span class="input-group-text">lowb</span>
          <button class="btn btn-primary active" type="button" id="button-addon2" v-on:click="withdraw">Withdraw</button>
        </div>
      </div>
      <br>
      <p>go to <a href="https://testnet.binance.org/faucet-smart">Testnet Funds</a> to get more BNB</p>
      <p>You can <button @click = "claim">claim</button> 10k LOWB, then refresh the webpage after confirmed</p>
    </div>
    <br>
    <h2>NFTs Owned</h2>
    <div class="row">
      <div v-for="nft in $store.state.myNfts" :key="nft.tokenId" class="col-sm-3">
        <b-card
          :title="$store.state.nftInfos[nft.groupId-1].name"
          :img-src="$store.state.nftInfos[nft.groupId-1].image"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <h6 class="card-subtitle mb-2 text-muted">
            <div v-if="$store.state.nftInfos[nft.groupId-1].currentSupply<$store.state.nftInfos[nft.groupId-1].circulation">#{{nft.tokenId}}  [New]</div>
            <div v-else>#{{nft.tokenId}}  Circulation: {{$store.state.nftInfos[nft.groupId-1].circulation}}</div>
          </h6>
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="0" v-model="toOffer[nft.tokenId]" @keyup="correct_toOffer(nft.tokenId)">
            <span class="input-group-text">lowb</span>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button 
              class="btn btn-primary" 
              type="button" 
              v-on:click="approveNft(nft.tokenId, nft.groupId)" 
              :disabled="nft.isApproved || $store.state.nftInfos[nft.groupId-1].currentSupply<$store.state.nftInfos[nft.groupId-1].circulation">
              Approve
            </button>
            <button 
              class="btn btn-primary active" 
              type="button" 
              v-on:click="offer(nft.tokenId, nft.groupId)" 
              :disabled="toOffer[nft.tokenId] <= 0 || !nft.isApproved || $store.state.nftInfos[nft.groupId-1].currentSupply<$store.state.nftInfos[nft.groupId-1].circulation">
              Offer
            </button>
          </div>
          <div v-if="$store.state.nftInfos[nft.groupId-1].currentSupply<$store.state.nftInfos[nft.groupId-1].circulation">
            <router-link :to="{path: '/new-token-details/'+nft.groupId}">Details</router-link>
          </div>
          <div v-else>
            <router-link :to="{path: '/token-details/'+nft.groupId}">Details</router-link>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import airdropFile from '../assets/AirdropClaim.json'
import { ethers } from "ethers";

export default {
  data: function() {
    return {
      toDeposit: 0,
      toWithdraw: 0,
      toOffer: []
    };
  },
  created () {
    console.log(this.$store.state.approvedBalance, this.toDeposit)
  },
  methods: {
    correct_toDeposit: function () {
      if (this.toDeposit > Number(this.$store.getters.lowb_balance)) {
        this.toDeposit = this.$store.getters.lowb_balance
      }
      else if (this.toDeposit > 0) {
        this.toDeposit = Math.floor(this.toDeposit)
      }
      else {
        this.toDeposit = 0
      }
    },
    correct_toWithdraw: function () {
      if (this.toWithdraw > Number(this.$store.getters.lowb_market_balance)) {
        this.toWithdraw = this.$store.getters.lowb_market_balance
      }
      else if (this.toWithdraw > 0) {
        this.toWithdraw = Math.floor(this.toWithdraw)
      }
      else {
        this.toWithdraw = 0
      }
    },
    correct_toOffer: function (tokenId) {
      if (this.toOffer[tokenId] > 0) {
        this.toOffer[tokenId] = Math.floor(this.toOffer[tokenId])
      }
      else {
        this.toOffer[tokenId] = 0
      }
    },
    approve: function () {
      console.log("start approve")
      this.$store.dispatch('approveLowb', this.toDeposit)
    },
    deposit: function () {
      console.log("start deposit")
      this.$store.dispatch('depositLowb', this.toDeposit)
      this.toDeposit = 0
    },
    withdraw: function () {
      console.log("start withdraw")
      this.$store.dispatch('withdrawLowb', this.toWithdraw)
      this.toWithdraw = 0
    },
    // should remove when migrate to mainnet
    claim: async function () {
      console.log("claim 10k lowb")
      const airdropAbi = airdropFile['abi']
      const airdropAddress = '0xD80AF329e45BB88a333F0E5E2B6dF5Bde26b2736'
      const airdropContract = new ethers.Contract(airdropAddress, airdropAbi, global.provider);
      const airdropWithSigner = airdropContract.connect(global.signer);
      await airdropWithSigner.claim();
      console.log('claim 10000 lowb!');
    },
    approveNft: function (tokenId, groupId) {
      console.log("start approve nft")
      this.$store.dispatch('approveItemBid', {item: tokenId, group: groupId})
    },
    offer: function (tokenId, groupId) {
      console.log("start offer nft")
      this.$store.dispatch('offerItem', {id: tokenId, groupId: groupId, amount: this.toOffer[tokenId]})
      this.$set(this.toOffer, tokenId, 0)
    },
  }
}
</script>

<style scoped>
.css-cogtoi {
    color: rgb(104, 104, 104);
    margin: 0px 0px 5px;
    font-size: 14px;
    line-height: 22px;
}
.css-94onap {
    margin: 0px;
    font-weight: 500;
    word-break: break-word;
    font-size: 18px;
    line-height: 26px;
}
</style>
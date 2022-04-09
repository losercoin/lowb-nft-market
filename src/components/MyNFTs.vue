<template>
  <div class="container">
    <div class="shadow px-5">
      <div class="row">
        <div class="col-6">
          <div class="css-cogtoi">{{ $t("lang.yourBSCWalletAddress") }}</div>
          <div class="css-94onap">{{$store.state.account}}</div>
        </div>
        <div class="col">
          <div class="css-cogtoi">{{ $t("lang.lowbBalance") }}:</div>
          <div class="css-94onap">{{$store.getters.lowb_balance}} LOWB</div>
        </div>
        <div class="col">
          <div class="css-cogtoi">{{ $t("lang.lowbMarketBalance") }}:</div>
          <div class="css-94onap">{{$store.getters.lowb_market_balance}} LOWB</div>
        </div>
      </div>
      <br>
      <div class="row">
        <h4>{{ $t("lang.depositAndWithdraw") }}</h4>
        <div class="input-group mb-3 col">
          <input type="number" class="form-control" @keyup="correct_toDeposit" v-model="toDeposit">
          <span class="input-group-text" >lowb</span>
          <button class="btn btn-primary" type="button" v-on:click="approve">{{ $t("lang.approve") }}</button>
          <button class="btn btn-primary active" type="button" v-on:click="deposit" :disabled="toDeposit<=0||$store.state.approvedBalance<toDeposit*1e18">{{ $t("lang.deposit") }}</button>
        </div>
        <div class="input-group mb-3 col">
          <input type="number" class="form-control" @keyup="correct_toWithdraw" v-model="toWithdraw">
          <span class="input-group-text">lowb</span>
          <button class="btn btn-primary active" type="button" id="button-addon2" v-on:click="withdraw">{{ $t("lang.withdraw") }}</button>
        </div>
      </div>
      <br>
      <div v-if="$store.state.chainId == '0x61'">
        <p>{{ $t("lang.goTo") }}<a href="https://testnet.binance.org/faucet-smart">Testnet Funds</a> {{ $t("lang.toGetMoreBNB") }}</p>
        <p>{{ $t("lang.youCan") }} <button @click = "claim">{{ $t("lang.claim") }}</button> {{ $t("lang.TenKLOWBThenRefreshtheWebpageAfterConfirmed") }}</p>
      </div>
    </div>
    <br>
    <div class="d-inline-flex">
      <h2>{{ $t("lang.NFTsOwned") }}</h2>
      <button class="btn btn-primary css-add-button" type="button"><router-link to="/new" class="link">{{ $t("lang.AddMyNFT") }}</router-link></button>
    </div>
    <div class="row">
      <div v-for="nft in this.myNfts" :key="nft.tokenId" class="col-sm-3">
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
              <!-- <icon-base width="20" height="20" icon-name="bnb"><icon-bnb /></icon-base>  -->
              <!-- <IconBNB /> -->
              <span class="css-price">{{nft.price}}&nbsp;ETC</span>
              <button class="css-edit-button"><router-link :to="{path: '/edit/'+nft._id}" class="link">{{ $t("lang.edit") }}</router-link></button>
            </div>
          </b-card>
        </router-link>
      </div>
    </div>
    <div class="row" v-if="this.myNfts.length==0">
      <br><p>{{ $t("lang.noNFTs") }}</p>
    </div>
    <br><br><br>
    <h2>{{ $t("lang.myBids") }}</h2>
    <div class="row">
      <div v-for="nft in $store.getters.loser_punks('my_bids')" :key="nft.id"  class="col-sm-3">
        <b-card
          :title="nft.name"
          :img-src="nft.image"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <div class="m-t-10">
            <router-link :to="{path: '/token-details/'+nft.id}">{{ $t("lang.go") }} #{{nft.id}} {{ $t("lang.details") }}</router-link>
          </div>
        </b-card>
      </div>
    </div>
    <br>
    <div class="row" v-if="$store.getters.loser_punks('my_bids').length==0">
      <p>{{ $t("lang.noBids") }}</p>
    </div>
  </div>
</template>

<script>
import airdropFile from '../abis/AirdropClaim.json'
import { ethers } from "ethers";
import IconBase from './IconBase.vue'
import IconLowb from './icons/IconLowb.vue'
import IconBNB from './icons/IconBNB.vue'

export default {
  components: {
    IconBase,
    IconLowb,
    IconBNB,
  },
  data: function() {
    return {
      toDeposit: 0,
      toWithdraw: 0,
      toOffer: [],
      myNfts: [],
    };
  },
  created () {
    // this.$store.dispatch('filterPunks', 'my_bids')
    // this.$store.dispatch('updateMyNfts')
  },
  mounted() {
    this.getMyNFTs();
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
    wrap: function (tokenId) {
      console.log("start wrap nft")
      this.$store.dispatch('wrapItem', tokenId)
    },
    getMyNFTs: async function() {
      let response = await axios.get(this.$store.state.BACKEND_SERVER + '/v1/nft/my', {
        params: {
          address: this.$store.state.account
        }
      });

      if(response.data.code != 200) {
        console.log(response.data.message);
        return; 
      }

      let listData = response.data.data.data;
      for(var i = 0; i < listData.length; i++) {
        let cell = listData[i];
        this.myNfts.push(cell);
      }
    }
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
.css-lvpxlc {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 5px 10px 10px;
}
.css-2x3sd8 {
    flex: 1 1 0%;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: 30px;
    font-size: 14px;
    font-weight: 500;
    background-color: rgba(227, 230, 238, 0.5);
    border-radius: 4px;
    cursor: pointer;
}
.css-add-button {
  margin-left: 10px;
}
.link {
  color: white;
}
.css-price-area {
  display: flex;
  align-items: center;
}
.css-price {
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
}
.css-edit-button {
  margin-left: auto;
  cursor: pointer;
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
a {
    color: #ff04b4;
    text-decoration: none;
    font-weight: 700;
}

</style>
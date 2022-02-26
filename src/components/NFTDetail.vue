<template>
  <div class="container">
    <div>
      <div class="row">
        <div class="col-4">
          <img class="media-data nft-image" style="width: 100%" v-bind:src="media" />
          <div class="border-area">
            <h5 class="title-area">{{$t("lang.description")}}</h5>
            <span>{{description}}</span>
          </div>
        </div>
        <div class="col-sm-8" style="padding: 20px 30px">
          <h1>{{this.name}}</h1>
          <div class="row" v-if="owner==this.$store.state.account" style="margin-left: 0px">
            <router-link :to="{path: '/edit/'+this.id}" class="link col-3"><button class="btn btn-primary css-button" type="button">{{ $t("lang.edit") }}</button></router-link>
            <router-link :to="{path: '/sell/'+this.id}" class="link col-3"><button class="btn btn-primary css-button" type="button" style="margin-left: 20px">{{ $t("lang.sell") }}</button></router-link>
          </div>
          <div v-else>
            <h3 style="margin-bottom: 0px">{{ $t("lang.price") }}: {{price}} Lowb</h3>
            <div class="row" style="margin-top: 20px">
              <h3 class="col-3">{{ $t("lang.myOfferPice") }}: </h3>
              <input style="width:300px" v-model="bidPrice" type="number" />
              <button class="btn btn-primary" type="button" style="width:300px; margin-left: 20px" @click="offer">{{ $t("lang.offer") }}</button>
            </div>
          </div>
          <div class="border-area">
            <h5 class="title-area">{{$t("lang.offerlist")}}</h5>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">{{ $t("lang.maker") }}</th>
                  <th scope="col">{{ $t("lang.price") }}</th>
                  <th scope="col">{{ $t("lang.time") }}</th>
                  <th scope="col" v-if="owner==this.$store.state.account">{{ $t("lang.action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(offer, index) in offerlist" :key="Number(offer.maker)">
                  <th scope="col" style="vertical-align: middle">{{index+1}}</th>
                  <th scope="col" style="vertical-align: middle">{{offer.sender.toLowerCase()}}</th>
                  <th scope="col" style="vertical-align: middle">{{offer.price}} Lowb</th>
                  <th scope="col" style="vertical-align: middle">{{new Date(offer.date).toLocaleString('en-GB', { timeZone: 'UTC' })}}</th>
                  <th scope="col"  v-if="owner==myaccount">
                    <button class="btn btn-primary" type="button" @click="accept(offer.tokenId, offer.sender, offer.price)">Accept</button>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  data() {
    return {
      imageHover: false,
      media: null,
      name: '',
      isName: true,
      description: '',
      imageFile: null,
      id: this.$route.params.id,
      owner: '',
      offerlist: [],
      price: '',
      bidPrice: '',
      tokenId: '',
      myaccount: '',
    }
  },
  created () {

  },
  mounted() {
    this.getNFT();
    this.myaccount = this.$store.state.account;
  },
  methods: {
    getNFT: async function() {
      let response = await axios.get(this.$store.state.BACKEND_SERVER + '/v1/nft', {
        params: {
          id: this.id
        }
      });

      if(response.data.code != 200) {
        console.log(response.data.message);
        return; 
      }

      let nft = response.data.data.data;

      response = await axios.get(this.$store.state.BACKEND_SERVER + '/v1/nft/offer', {
        params: {
          tokenId: nft.tokenId
        }
      });

      if(response.data.code != 200) {
        console.log(response.data.message);
        return; 
      }

      let offerlist = response.data.data;
      const myoffer = offerlist.filter(cell => cell.sender.toLowerCase() == this.$store.state.account);

      this.media = this.$store.state.IPFS_SERVER+nft.uri;
      this.name = nft.name;
      this.description = nft.description;
      this.owner = nft.owner;
      this.price = nft.price;
      this.bidPrice = myoffer.length == 1 ? myoffer[0].price : nft.price;
      this.tokenId = nft.tokenId;
      this.offerlist = offerlist;
    },
    offer: function() {
      this.bidPrice > '0' && this.$store.dispatch('offer', {tokenId: this.tokenId, price: this.bidPrice})
    },
    accept: function(tokenId, sender, price) {
      this.$store.dispatch('accept', {tokenId, sender, price});
    }
  }
}
</script>

<style scoped>
.nft-image {
  border-radius: 10px;
  border: 1px solid rgb(229, 232, 235);
  overflow: hidden;
}
.border-area {
  width: 100%;
  margin-top: 30px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgb(229, 232, 235);
  overflow: hidden;
}
.title-area {
  border-width: 0 0 1px 0;
  border-color: rgb(229, 232, 235);
  border-style: solid;
  padding-bottom: 10px;
}
.link {
  color: white;
  text-decoration: none !important;
}
.css-button {
  width: 100%;
}
</style>
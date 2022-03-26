<template>
  <div class="container">
    <notifications 
          group="tokendetail" 
          position="top right"/>
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
            <h3 v-if="this.sell == 1" style="width: 300px; margin-bottom: 0px">{{ $t("lang.price") }}: {{price}} BNB</h3>
            <router-link :to="{path: '/edit/'+this.id}" class="link col-3"><button class="btn btn-primary css-button" type="button">{{ $t("lang.edit") }}</button></router-link>
            <router-link v-if="this.sell==0" :to="{path: '/sell/'+this.id}" class="link col-3"><button class="btn btn-primary css-button" type="button" style="margin-left: 20px">{{ $t("lang.sell") }}</button></router-link>
          </div>
          <div class="row" v-else>
            <h3 style="width: 300px; margin-bottom: 0px">{{ $t("lang.price") }}: {{price}} BNB</h3>
            <button class="btn btn-primary" type="button" style="width:300px; margin-left: auto" @click="buyNFT">{{ $t("lang.buy") }}</button>
          </div>
          <div class="border-area history-area">
            <h5 class="title-area">{{$t("lang.tradeHistory")}}</h5>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">{{ $t("lang.seller") }}</th>
                  <th scope="col">{{ $t("lang.buyer") }}</th>
                  <th scope="col">{{ $t("lang.price") }}</th>
                  <th scope="col">{{ $t("lang.time") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cell, index) in history" :key="cell._id">
                  <th scope="col">{{index+1}}</th>
                  <th scope="col">{{cell.seller.toLowerCase()}}</th>
                  <th scope="col">{{cell.buyer.toLowerCase()}}</th>
                  <th scope="col">{{cell.price}} Lowb</th>
                  <th scope="col">{{new Date(cell.date).toLocaleString('en-GB', { timeZone: 'UTC' })}}</th>
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
      history: [],
      price: '',
      bidPrice: '',
      tokenId: '',
      myaccount: '',
      sell: 0,
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

      response = await axios.get(this.$store.state.BACKEND_SERVER + '/v1/nft/history', {
        params: {
          tokenId: nft.tokenId
        }
      });

      if(response.data.code != 200) {
        console.log(response.data.message);
        return; 
      }
      
      this.history = response.data.data;
      this.media = this.$store.state.IPFS_SERVER+nft.uri;
      this.name = nft.name;
      this.description = nft.description;
      this.owner = nft.owner;
      this.price = nft.price;
      this.tokenId = nft.tokenId;
      this.sell = nft.sell;
    },
    buyNFT: function() {
      this.$store.dispatch('buyNFT', {tokenId: this.tokenId, owner: this.owner, price: this.price})
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
.history-area {
  overflow: auto;
}
th {
  white-space:nowrap;
  vertical-align: middle;
}
</style>
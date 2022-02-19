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
            <button class="btn btn-primary col-3" type="button"><router-link :to="{path: '/edit/'+this.id}" class="link">{{ $t("lang.edit") }}</router-link></button>
            <button class="btn btn-primary col-3" type="button" style="margin-left: 20px">{{ $t("lang.sell") }}</button>
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
                  <th scope="col">{{ $t("lang.action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(offer, index) in offerlist" :key="Number(offer.maker)">
                  <th style="vertical-align: middle">{{index+1}}</th>
                  <th style="vertical-align: middle">{{offer.maker}}</th>
                  <th style="vertical-align: middle">{{offer.price}}</th>
                  <th style="vertical-align: middle">{{offer.time}}</th>
                  <th>
                    <button class="btn btn-primary" type="button">Accept</button>
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
import airdropFile from '../abis/AirdropClaim.json'
import { ethers } from "ethers";
import IconBase from './IconBase.vue'
import IconLowb from './icons/IconLowb.vue'

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
      offerlist: [{maker: "0x123321321321", "price": "12345", "time": "12:12:2021"}]
    }
  },
  created () {

  },
  mounted() {
    this.getNFT();
  },
  methods: {
    getNFT: async function() {
      console.log(this.id)
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
      console.log(nft);
      this.media = this.$store.state.IPFS_SERVER+nft.uri;
      this.name = nft.name;
      this.description = nft.description;
      this.owner = nft.owner;
    },
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
</style>
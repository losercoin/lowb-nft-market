<template>
  <div class="container">
    <notifications 
      group="sellnft" 
      position="top right"/>
    <div>
      <div class="row">
        <div class="col-5">
          <h4>{{$t("lang.preview")}}</h4>
          <b-card
            :title="this.name"
            :img-src="this.media"
            img-alt="Image"
            img-top
            tag="article"
            style="color: #000"
            class="mb-2"
          >
            <div class="css-price-area">
              <!-- <icon-base width="20" height="20" icon-name="lowb"><icon-lowb /></icon-base>  -->
              <!-- <IconBNB /> -->
              <span class="css-price">{{this.price}}&nbsp;ETC</span>
            </div>
          </b-card>
        </div>
        <div class="col-sm-7" style="padding: 0px 30px">
          <h4>{{$t("lang.listforsale")}}</h4>
          <div style="margin-top: 30px">
            <h5>{{$t("lang.price")}}</h5>
            <div class="row">
              <div class="css-lowb-icon col-sm-2">
                <!-- <icon-base width="30" height="30" icon-name="lowb"><icon-lowb /></icon-base>  -->
                <!-- <IconBNB /> -->
                <span style="font-size:20px;margin-left:10px;">ETC</span>
              </div>
              <div class="col-10">
                <input class="form-control" v-model="price" type="number"/>
              </div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <h5>{{$t("lang.fee")}}</h5>
            <span>{{$t("lang.servicefee")}} 2.5%</span>
          </div>
          <div style="margin-top: 30px">
            <button class="btn btn-primary css-add-button" type="button" @click="sale">{{ $t("lang.completelist") }}</button>
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
import IconBNB from './icons/IconBNB.vue'

export default {
  components: {
    IconBase,
    IconLowb,
    IconBNB,
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
      price: 0,
      tokenId: '',
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
      this.tokenId = nft.tokenId;
      this.price = nft.price;
    },
    sale: function() {
      this.price > "0" && this.$store.dispatch('saleNFT', {tokenId: this.tokenId, price: this.price})
    }
  }
}
</script>

<style scoped>
.css-price-area {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.css-price {
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
}
.css-lowb-icon {
  display: flex;
  align-items: center;
}
</style>
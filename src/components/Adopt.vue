<template>
  <div class="container align-middle">
    <br>
    <h2 class="mb-2 light text-center">{{ $t("lang.toAdopt") +  toAdopt.id}}</h2>
    <div class="container" style="margin-bottom: 24px;">
      <div class="row" style=' margin-left: 0px; margin-right: 0px;'>
        <div class="col-md-12 col-xs-12" style="background-color: #638596;">
          <img :src="toAdopt.image" style='max-height: 312px; max-width: 312px; margin-top: 50px;' class="img-responsive center-block"/>
        </div>
      </div>
    </div>
    <br>
    <h2 class="mb-2 light text-center">{{ $t("lang.luckyNumber") }}</h2>
    <div class="row justify-content-center">
      <span v-for="luckyNumber in luckyNumbers" class="circle m-3" :style="luckyNumber.background" :key="luckyNumber.id" v-on:click="claim(luckyNumber.id, luckyNumber.toClaim)">{{luckyNumber.number}}</span>
    </div>
    <div class="d-grid gap-2 col-2 mx-auto">
      <button class="btn btn-primary" type="button" @click="getInfo()">{{ $t("lang.refresh") }}</button>
    </div>
    <br>
    <br>
    <h2 class="mb-2 light text-center">{{ $t("lang.rule") }}</h2>
    <ul class="list-group">
      <li class="list-group-item list-group-item-primary">{{ $t("lang.number1") }}</li>
      <li class="list-group-item list-group-item-secondary">{{ $t("lang.number2") }}</li>
      <li class="list-group-item list-group-item-success">{{ $t("lang.number3") }}</li>
      <li class="list-group-item list-group-item-danger">{{ $t("lang.number4") }}</li>
      <li class="list-group-item list-group-item-warning">{{ $t("lang.number5") }}</li>
      <li class="list-group-item list-group-item-info">{{ $t("lang.number6") }}</li>
      <li class="list-group-item list-group-item-light">{{ $t("lang.number7") }}</li>
      <li class="list-group-item list-group-item-dark">{{ $t("lang.number8") }}</li>
    </ul>
    <br>
  </div>
</template>

<script>
export default {
    data() {
      return {
        totalRounds: 0,
        luckyNumbers: [1, 2, 3, 4],
        oldLuckyNumbers: [],
        isWhitelist: false,
        roundInfo: {pool: 0, cheatFee: 0, block: 0},
        currentBlock: 0,
        roundIds: [],
        toAdopt: {image: 'https://www.losernft.org/ipfs/' + global.loserpunk[1]['hash'], id: 1}
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      claim: async function (id, toClaim) {
        if (toClaim) {
            const weddingWithSigner = global.weddingContract.connect(global.signer);
            await weddingWithSigner.claimPunk(id);
        }
        console.log(id, toClaim)
      },
      getInfo: async function () {
        const id = await global.weddingContract.punkId()
        this.toAdopt = {image: 'https://www.losernft.org/ipfs/' + global.loserpunk[id-1]['hash'], id: id-1}
        const info = await global.weddingContract.getInfo(this.$store.state.account)
        let luckyNumbers = []
        for (let i=0; i<8; i++) {
          if (info[i].isClaimed) {
            luckyNumbers.push({id: i, toClaim: false, number: Number(info[i].luckyNumber), background: "background: #0d6efd;"})
          }
          else if (info[i].isLucky) {
            luckyNumbers.push({id: i, toClaim: true, number: Number(info[i].luckyNumber), background: "background: #d63384;"})
          }
          else {
            luckyNumbers.push({id: i, toClaim: false, number: Number(info[i].luckyNumber), background: "background: #adb5bd;"})
          }
        }
        this.luckyNumbers = luckyNumbers
        //console.log(info)
      },
    }
}
</script>

<style lang="scss" scoped>
  .circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    font-size: 16px;
    color: white;
    line-height: 100px;
    text-align: center;
    border: 2px solid white;
  }
  .center-block {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .container .img-responsive {
    width: 100%;
  }
</style>
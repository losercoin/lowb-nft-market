<template>
  <div class="container align-middle">
    <ul class="list-group list-group-horizontal">
      <li class="list-group-item">No.{{roundInfo.id}}</li>
      <li class="list-group-item list-group-item-primary">{{ $t("lang.poolSize") }}: {{Math.round(roundInfo.pool/1e18)}}</li>
      <li class="list-group-item list-group-item-warning">{{ $t("lang.cheatFee") }}: {{roundInfo.cheatFee/1e18+1000}}</li>
      <li class="list-group-item list-group-item-info">{{ $t("lang.drawBlock") }}: {{Number(roundInfo.block)+5000}}</li>
      <li class="list-group-item list-group-item-success" v-if="currentBlock>=Number(roundInfo.block)+5000">{{ $t("lang.currentBlock") }}: {{currentBlock}}</li>
      <li class="list-group-item list-group-item-dark" v-else>{{ $t("lang.currentBlock") }}: {{currentBlock}}</li>
    </ul>
    <br>
    <h3>{{$t("lang.gotoGame")}}</h3>
    <!-- <h1 class="mb-2 light text-center">{{ $t("lang.latestLuckyNumber") }}</h1>
    <div class="row justify-content-center">
      <span v-for="luckyNumber in luckyNumbers" class="circle m-3" :style="luckyNumber.background">{{luckyNumber.number}}</span>
    </div>
    <br>
    <div class="mb-2 light text-center">
      <button class="btn btn-warning" type="button" @click="cheat()">{{ $t("lang.cheat") }} -{{roundInfo.cheatFee/1e18+1000}}lowb</button>
      <button class="btn btn-success" type="button" @click="moveToNextRound()" v-if="currentBlock>=Number(roundInfo.block)+5000">{{ $t("lang.draw") }} +1000lowb</button>
      <button class="btn btn-light" type="button" @click="getTotalRounds()">{{ $t("lang.refresh") }}</button>
    </div>
    <br>
    <div class="mb-2 light text-center" v-if="$store.state.myNfts.length==0">
      {{ $t("lang.noLoserPunk") }}
    </div>
    <div class="mb-2 light text-center" v-else-if="isWhitelist">
      {{ $t("lang.youHaveParticipated") }}
    </div>
    <div class="mb-2 light text-center" v-else>
      <button class="btn btn-primary" type="button" @click="setWhitelist()">{{ $t("lang.participateLottery") }}</button>
    </div> -->

    <br>
    <br>
    <h1 class="mb-2 light text-center">{{ $t("lang.pastLuckyNumber") }}</h1>
    <div class="d-md-block d-grid gap-2">
      <button  v-for="roundId in roundIds" @click="getLuckyNumbers(roundId, true)" type="button" class="btn btn-outline-primary">No. {{roundId}}</button>
    </div>
    <div class="row justify-content-center">
      <span v-for="luckyNumber in oldLuckyNumbers" class="circle m-3" :style="luckyNumber.background">{{luckyNumber.number}}</span>
    </div>
    <br>
  </div>
</template>

<script>

export default {
    data() {
      return {
        totalRounds: 0,
        luckyNumbers: [],
        oldLuckyNumbers: [],
        isWhitelist: false,
        roundInfo: {pool: 0, cheatFee: 0, block: 0},
        currentBlock: 0,
        roundIds: []
      }
    },
    created () {
      this.getTotalRounds()
    },
    methods: {
      cheat: async function () {
        const lotteryWithSigner = global.lotteryContract.connect(global.signer);
        await lotteryWithSigner.cheat();
        console.log("cheat it!")
      },
      setWhitelist: async function () {
        const lotteryWithSigner = global.lotteryContract.connect(global.signer);
        await lotteryWithSigner.setWhitelist();
        console.log("set Whitelist!")
      },
      moveToNextRound: async function () {
        const lotteryWithSigner = global.lotteryContract.connect(global.signer);
        await lotteryWithSigner.moveToNextRound();
        console.log("next round!")
      },
      getTotalRounds: async function () {
        const n = await global.lotteryContract.totalRounds()
        this.roundIds = []
        for (let i=0; i<n; i++) {
          this.roundIds.push(i)
        }
        this.luckyNumbers = []
        this.getLuckyNumbers(n-1)
        this.totalRounds = Number(n)
        this.isWhitelist = await global.lotteryContract.whitelist(this.$store.state.account)
        this.roundInfo = await global.lotteryContract.rounds(n-1)
        this.currentBlock = await global.provider.getBlockNumber()
        console.log(this.roundInfo)
      },
      getLuckyNumbers: async function (id, isOld=false) {
        const numbers = await global.lotteryContract.getLuckyNumbers(id)
        const address = await global.lotteryContract.getLuckyAddress(id)
        let luckyNumbers = []
        for (let i=0; i<10; i++) {
          if (address[i] == '0x0000000000000000000000000000000000000000') {
            luckyNumbers.push({number: Number(numbers[i]), background: "background: #adb5bd;"})
          }
          else if (address[i].toLowerCase() == this.$store.state.account.toLowerCase()) {
            luckyNumbers.push({number: Number(numbers[i]), background: "background: #d63384;"})
          }
          else {
            luckyNumbers.push({number: Number(numbers[i]), background: "background: #0d6efd;"})
          }
        }
        if (isOld) {
          this.oldLuckyNumbers = luckyNumbers
        }
        else {
          this.luckyNumbers = luckyNumbers
        }
      },
    }
}
</script>

<style lang="scss" scoped>
  .circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 16px;
    color: white;
    line-height: 60px;
    text-align: center;
    border: 2px solid white;
  }
</style>


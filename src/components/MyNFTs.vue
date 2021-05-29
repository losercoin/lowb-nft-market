<template>
  <div>
    <div class="shadow px-5">
      <div class="row">
        <div class="col-6">
          <div class="css-cogtoi">Your BSC Wallet address</div>
          <div class="css-94onap">0xD35a860B6fDB386Ae9d83D72209DAA704631CA15</div>
        </div>
        <div class="col">
          <div class="css-cogtoi">Lowb Balance</div>
          <div class="css-94onap">56000 lowb</div>
        </div>
        <div class="col">
          <div class="css-cogtoi">Lowb Market Balance</div>
          <div class="css-94onap">1500 lowb</div>
        </div>
      </div>
      <br>
      <div class="row">
        <h4>Deposit and Withdraw</h4>
        <div class="input-group mb-3 col">
          <input type="text" class="form-control" placeholder="Amount of Lowb to Deposit">
          <span class="input-group-text">lowb</span>
          <button class="btn btn-primary" type="button">Approve</button>
          <button class="btn btn-primary active" type="button">Deposit</button>
        </div>
        <div class="input-group mb-3 col">
          <input type="text" class="form-control" placeholder="Amount of Lowb to Withdraw">
          <span class="input-group-text">lowb</span>
          <button class="btn btn-primary active" type="button" id="button-addon2">Withdraw</button>
        </div>
      </div>
      <br>
    </div>
    <br>
    <h2>Owned</h2>
    <div class="row">
      <div v-for="card in cards" :key="card.name" class="col-sm-3">
        <b-card
          :title="card.name"
          img-src="https://picsum.photos/600/300/?image=25"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <h6 class="card-subtitle mb-2 text-muted">Circulation: 100</h6>
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Price offered for sale">
            <span class="input-group-text">lowb</span>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-primary me-md-2" type="button">Approve</button>
            <button class="btn btn-primary active" type="button">Offer</button>
          </div>
          <router-link :to="{path: '/lowb-market/token-details/'+card.name}">Details</router-link>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      cards: [],
    };
  },
  created () {
    this.cards = [
      { name: 'Runoob' },
      { name: 'Google' }
    ]
    console.log(this.cards)
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
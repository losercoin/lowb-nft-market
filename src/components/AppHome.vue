<template>
  <div>
    <h1>Series 1</h1>
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
          <b-card-text>
            Price: 100 Lowb 
          </b-card-text>
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
      { name: 'Google' },
      { name: 'Taobao' }
    ]
    console.log(this.cards)
  }
}
</script>
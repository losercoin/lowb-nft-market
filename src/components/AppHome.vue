<template>
  <div>
    <h1>Series 1</h1>
    <div class="row">
      <div v-for="nft in $store.state.nftInfos" :key="nft.id" class="col-sm-3">
        <b-card
          :title="nft.name"
          :img-src="require('../assets/'+nft.image)"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <h6 class="card-subtitle mb-2 text-muted">Circulation: {{nft.currentSupply}}/{{nft.circulation}}</h6>
          <b-card-text>
            Price: Not for sale 
          </b-card-text>
          <div v-if="nft.currentSupply<nft.circulation">
            <router-link :to="{path: '/lowb-market/new-token-details/'+nft.id}">Details</router-link>
          </div>
          <div v-else>
            <router-link :to="{path: '/lowb-market/token-details/'+nft.id}">Details</router-link>
          </div>
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
    this.increment()
  },
  methods: {
    increment() {
      this.$store.dispatch('incrementAsync')
      console.log(this.$store.state.count)
    }
  }
}
</script>
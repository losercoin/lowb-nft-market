<template>
  <div>
    <h1>{{ $t("lang.series1") }}</h1>
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
          <b-card-text>
            <h6 class="card-subtitle mb-2 text-muted">{{ $t("lang.circulation") }}{{nft.currentSupply}}/{{nft.circulation}}</h6>
            <span class="badge rounded-pill bg-primary" v-for="feature in nft.features" :key="feature">{{feature}}</span>
            <span class="badge rounded-pill bg-success" v-if="nft.currentSupply<nft.circulation">{{ $t("lang.new") }}</span>
            <span class="badge rounded-pill bg-secondary" v-if="nft.currentSupply<nft.circulation && nft.price>0">{{nft.price/1e18}} lowb</span>
          </b-card-text>
          <div v-if="nft.currentSupply<nft.circulation">
            <router-link :to="{path: '/lowb-market/new-token-details/'+nft.id}">{{ $t("lang.details") }}</router-link>
          </div>
          <div v-else>
            <router-link :to="{path: '/lowb-market/token-details/'+nft.id}">{{ $t("lang.details") }}</router-link>
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
<template>
    <header class="p-3 mb-3 border">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <router-link to="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <icon-base width="40" height="40" icon-name="lowb"><icon-lowb /></icon-base> 
          <span class="fs-4">{{ $t("lang.lowbNFTMarket") }}</span>
        </router-link>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link :to="'/about-'+$root.$i18n.locale" class="nav-link px-2 fs-4" style="color:white;">{{ $t("lang.about") }}</router-link></li>
          <li><router-link to="/lottery" class="nav-link px-2 fs-4" style="color:white;">{{ $t("lang.lottery") }}</router-link></li>
        </ul>
        

        <div v-if="!$store.state.isWalletInstalled">
          <a href="#" class="nav-link px-2 fs-4">{{ $t("lang.clickHeretoInstallMetaMask") }}</a>
        </div>
        <div v-else-if="$store.state.chainId != $store.state.CHAIN_ID">
          <a href="#" v-on:click="switch_network" class="nav-link px-2 fs-4">{{ $t("lang.connecttoBinanceSmartChain") }}</a>
        </div>
        <div v-else-if="$store.state.account == ''">
          <a href="#" v-on:click="connect_wallet" class="nav-link px-2 fs-4">{{ $t("lang.connectWallet") }}</a>
        </div>
        <div v-else>
          <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" right>
            <template #button-content>
              {{$store.getters.abbr_account}} | {{$store.getters.bnb_balance}} MATIC
            </template>
            <b-dropdown-item><router-link to="/my-nfts" class="nav-link px-2 link-dark">{{ $t("lang.viewMyNFTs") }}</router-link></b-dropdown-item>
            <b-dropdown-item><a href="#" v-on:click="$store.commit('setModal', true)" class="nav-link px-2 link-dark">{{ $t("lang.setLanguage") }}</a></b-dropdown-item>
            <b-dropdown-item><a href="#" v-on:click="sign_out" class="nav-link px-2 link-dark">{{ $t("lang.signOut") }}</a></b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </header>
</template>

<script>
import IconBase from './IconBase.vue'
import IconLowb from './icons/IconLowb.vue'

export default {
  components: {
    IconBase,
    IconLowb
  },
  methods: {
    switch_network: function () {
      console.log("switch network")
      this.$store.dispatch('switchChain')
    },
    connect_wallet: function () {
      console.log("connect wallet")
      this.$store.dispatch('updateAccounts')
    },
    sign_out: function () {
      console.log("sign out")
      this.$store.commit('setAccount', '')
    }
  }
}
</script>

<style lang="scss" scoped>
  .fs-4{
    margin-left:5px; color:#fff
  }

</style>

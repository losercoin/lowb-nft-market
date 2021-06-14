<template>
    <header class="p-3 mb-3 border-bottom">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <router-link to="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <icon-base width="40" height="40" icon-name="lowb"><icon-lowb /></icon-base> 
          <span class="fs-4">Lowb NFT Market</span>
        </router-link>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link to="/about" class="nav-link px-2 link-dark">{{ $t("lang.about") }}</router-link></li>
        </ul>

        <div v-if="!$store.state.isMetaMaskInstalled">
          <a href="https://metamask.io/download.html" class="nav-link px-2 link-dark">Click here to install MetaMask!</a>
        </div>
        <div v-else-if="$store.state.chainId != $store.state.CHAIN_ID">
          <a href="#" v-on:click="switch_network" class="nav-link px-2 link-dark">Connect to Binance Smart Chain</a>
        </div>
        <div v-else-if="$store.state.account == ''">
          <a href="#" v-on:click="connect_wallet" class="nav-link px-2 link-dark">Connect Wallet</a>
        </div>
        <div v-else>
          <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" right>
            <template #button-content>
              {{$store.getters.abbr_account}} | {{$store.getters.bnb_balance}} BNB
            </template>
            <b-dropdown-item><router-link to="/my-nfts" class="nav-link px-2 link-dark">View My NFTs</router-link></b-dropdown-item>
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
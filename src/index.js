import Vue from 'vue'
import Vuex from 'vuex'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import { ethers } from "ethers";

const App = () => import("./App.vue");
const AppHome = () => import("./components/AppHome.vue");
const MyNFTs = () => import("./components/MyNFTs.vue");
const TokenDetail = () => import("./components/TokenDetail.vue");
const NewTokenDetail = () => import("./components/NewTokenDetail.vue");


Vue.use(Vuex)

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)

Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
  { path: '/lowb-market', component: AppHome },
  { path: '/lowb-market/foo', component: Foo },
  { path: '/lowb-market/bar', component: Bar },
  { path: '/lowb-market/my-nfts', component: MyNFTs },
  { path: '/lowb-market/token-details/:id', component: TokenDetail },
  { path: '/lowb-market/new-token-details/:id', component: NewTokenDetail }
]

const router = new VueRouter({
  mode: 'history',
  routes // (缩写) 相当于 routes: routes
})

const store = new Vuex.Store({
  state: {
    count: 0,
    isMetaMaskInstalled: false,
    chainId: 0,
    account: "",
    bnbBalance: 0,
    lowbBalance: 0,
    lowbMarketBalance: 0,
    approvedBalance: 0
  },
  getters: {
    abbr_account: state => {
      if (state.account == null ||state.account == '') {
        return ''
      }
      else {
        return state.account.slice(0,4) + '...' + state.account.slice(-4)
      }
    },
    bnb_balance: state => {
      let number = state.bnbBalance / 1e18;
      return number.toFixed(3)
    },
    lowb_balance: state => {
      let number = state.lowbBalance / 1e18;
      return number.toFixed(0)
    },
    lowb_market_balance: state => {
      let number = state.lowbMarketBalance / 1e18;
      return number.toFixed(0)
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setMetaMaskInstalled (state) {
      state.isMetaMaskInstalled = true
    },
    setChainId (state, id) {
      state.chainId = id
      console.log("set chain id: ", id)
    },
    setAccount (state, account) {
      state.account = account
      console.log("set account: ", account)
    },
    setBalance (state, payload) {
      state.bnbBalance = payload.bnbBalance
      state.lowbBalance = payload.lowbBalance
      state.lowbMarketBalance = payload.lowbMarketBalance
      state.approvedBalance = payload.approvedBalance
    }
  },
  actions: {
    incrementAsync ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    updateAccounts () {
      getAccounts ()
    },
    updateChainId () {
      getNetworkAndChainId ()
    },
    switchChain () {
      switchToBinanceSmartChain ()
    },
    approveLowb ({}, amount) {
      approveLowb(amount)
    },
    depositLowb ({}, amount) {
      depositLowb(amount)
    },
    withdrawLowb ({}, amount) {
      withdrawLowb(amount)
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

function handleNewChain (chainId) {
  store.commit('setChainId', chainId)
}

function handleNewAccounts (accounts) {
  store.commit('setAccount', accounts[0])
  getBalance(accounts[0])
}

function handleMessage (message) {
  console.log(message)
}

async function getNetworkAndChainId () {
  try {
    const chainId = await ethereum.request({
      method: 'eth_chainId',
    })
    handleNewChain(chainId)

    const networkId = await ethereum.request({
      method: 'net_version',
    })
    console.log("network id", networkId)
  } catch (err) {
    console.error(err)
  }
}

async function switchToBinanceSmartChain () {
  try {
    await ethereum.request({ 
      method: 'wallet_addEthereumChain', 
      params: [{ 
        chainId: '0x61', //'0x38', 
        chainName: 'BSC Testnet', //'Binance Smart Chain', 
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, 
        rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'], //['https://bsc-dataseed.binance.org/'], 
        blockExplorerUrls: ['https://testnet.bscscan.com'] //['https://bscscan.com/'] 
      }] 
    })
  } catch (err) {
    console.error(err)
  }
}

async function getAccounts () {
  try {
    await ethereum.request({ 
      method: 'eth_requestAccounts' 
    })
    const newAccounts = await ethereum.request({
      method: 'eth_accounts',
    })
    handleNewAccounts(newAccounts)
  } catch (err) {
    console.error('Error on init when getting accounts', err)
  }
}

async function getBalance (account) {
  try {
    const bnbBalance = await global.provider.getBalance(account)
    const lowbBalance = await global.lowbContract.balanceOf(account)
    const lowbMarketBalance = await global.marketContract.pendingWithdrawals(account)
    const approvedBalance = await global.lowbContract.allowance(account, global.marketAddress)
    store.commit('setBalance', {
      bnbBalance: bnbBalance,
      lowbBalance: lowbBalance,
      lowbMarketBalance: lowbMarketBalance,
      approvedBalance: approvedBalance
    })
  } catch (err) {
    console.error(err)
  }
}

async function getContracts () {
  const lowbFile = () => import("./assets/ERC20Template.json")
  const lowbAbi = (await lowbFile())['abi']
  const lowbAddress = '0x5aa1a18432aa60bad7f3057d71d3774f56cd34b8'
  global.lowbContract = new ethers.Contract(lowbAddress, lowbAbi, global.provider)

  const marketFile = () => import("./assets/LowbMarket.json")
  const marketAbi = (await marketFile())['abi']
  global.marketAddress = '0x0c8348B9408Fb7A5085f69cFa562b2eD67D085dF'
  global.marketContract = new ethers.Contract(marketAddress, marketAbi, global.provider)
}

async function approveLowb(amount) {
  if (amount > 0) {
    const lowbWithSigner = global.lowbContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await lowbWithSigner.approve(global.marketAddress, amount_in_wei);
  }

  let filter = global.lowbContract.filters.Approval(store.state.account, null)
  // Receive an event when ANY transfer occurs
  global.lowbContract.on(filter, async (owner, spender, value, event) => {
    // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
    if (value > 0) {
      console.log(`I approved ${ value/1e18 } lowb to ${ spender}`);
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = store.state.lowbBalance
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = value
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
      } catch (err) {
          console.error(err)
      }
    }
  });
}

async function depositLowb(amount) {
  if (amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.deposit(amount_in_wei);
  }

  let filter = global.lowbContract.filters.Transfer(store.state.account, null)
  // Receive an event when ANY transfer occurs
  global.lowbContract.on(filter, async (from, to, value, event) => {
    console.log(`I sent ${ value/1e18 } lowb to ${ to}`);
    // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
    try {
      const bnbBalance = await global.provider.getBalance(store.state.account)
      const lowbBalance = Number(store.state.lowbBalance) - Number(value)
      const lowbMarketBalance = Number(store.state.lowbMarketBalance) + Number(value)
      const approvedBalance = Number(store.state.approvedBalance) - Number(value)
      store.commit('setBalance', {
        bnbBalance: bnbBalance,
        lowbBalance: lowbBalance,
        lowbMarketBalance: lowbMarketBalance,
        approvedBalance: approvedBalance
      })
      } catch (err) {
        console.error(err)
      }
  });
}

async function withdrawLowb(amount) {
  if (amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.withdraw(amount_in_wei);
  }

  let filter = global.lowbContract.filters.Transfer(null, store.state.account)
  // Receive an event when ANY transfer occurs
  global.lowbContract.on(filter, async (from, to, value, event) => {
    console.log(`I got ${ value/1e18 } lowb from ${ from}`);
    // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
    try {
      const bnbBalance = await global.provider.getBalance(store.state.account)
      const lowbBalance = Number(store.state.lowbBalance) + Number(value)
      const lowbMarketBalance = Number(store.state.lowbMarketBalance) - Number(value)
      const approvedBalance = store.state.approvedBalance
      store.commit('setBalance', {
        bnbBalance: bnbBalance,
        lowbBalance: lowbBalance,
        lowbMarketBalance: lowbMarketBalance,
        approvedBalance: approvedBalance
      })
      } catch (err) {
        console.error(err)
      }
  });
}

if (isMetaMaskInstalled()) {

  global.provider = new ethers.providers.Web3Provider(window.ethereum)
  global.signer = global.provider.getSigner()
  console.log('Access the decentralized web!')
  store.commit('setMetaMaskInstalled')

  getContracts()

  ethereum.autoRefreshOnNetworkChange = false
  store.dispatch('updateChainId')
  store.dispatch('updateAccounts')

  ethereum.on('chainChanged', handleNewChain)
  ethereum.on('accountsChanged', handleNewAccounts)
  ethereum.on('message', handleMessage)

}
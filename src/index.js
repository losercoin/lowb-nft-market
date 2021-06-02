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
    approvedBalance: 0,
    nftInfos: [],
    itemBids: {}
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
    },
    my_bid: (state) => (id) =>  {
      return state.itemBids[id].find(bid => bid.maker.toLowerCase() == store.state.account.toLowerCase())
    },
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
      console.log("set balance: ", payload)
    },
    setTotalGroup (state, nftInfos) {
      state.nftInfos = nftInfos
      console.log("set total group: ", nftInfos.length)
    },
    setItemBids (state, payload) {
      Vue.set(state.itemBids, payload.id, payload.bids)
      console.log(`set ${ payload.id }'s bids`, payload.bids)
    },
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
    },
    updateTotalGroup () {
      getGroupNumber()
    },
    updateBids ({}, groupId) {
      getItemBids(groupId)
    },
    enterBid ({}, bid) {
      enterBid(bid.groupId, bid.amount)
    },
    withdrawBid ({}, id) {
      withdrawBid(id)
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
  if(chainId == '0x61') {
    if (store.state.account != '') {
      getBalance(store.state.account)
    }
    store.dispatch('updateTotalGroup')
  }
}

function handleNewAccounts (accounts) {
  store.commit('setAccount', accounts[0])
  if(store.state.chainId == '0x61') {
    getBalance(accounts[0])
  }
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
        nativeCurrency: { name: 'BNBT', symbol: 'BNBT', decimals: 18 }, 
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
  global.marketAddress = '0x2D0D4CC1d4962d2070578811D3dA94Fb610C9C92'
  global.marketContract = new ethers.Contract(marketAddress, marketAbi, global.provider)

  const lowcFile = () => import("./assets/MyCollectible.json")
  const lowcAbi = (await lowcFile())['abi']
  const lowcAddress = '0x9715143c7a5aae7b52b930087303d1566bed9c2c'
  global.lowcContract = new ethers.Contract(lowcAddress, lowcAbi, global.provider)

  // update infomation after get contract!!!

  ethereum.autoRefreshOnNetworkChange = false
  store.dispatch('updateChainId')
  store.dispatch('updateAccounts')

  ethereum.on('chainChanged', handleNewChain)
  ethereum.on('accountsChanged', handleNewAccounts)

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

async function getGroupNumber () {
  try {
    const groupNumber = await global.lowcContract.groupIds()
    let nftInfos = []
    for (let i=0; i<groupNumber; i++) {
      let nftInfo = {}
      const testFile = () => import("./assets/test-" + (i+1) + ".json")
      nftInfo["id"] = i+1
      nftInfo["name"] = (await testFile())["name"]
      nftInfo["description"] = (await testFile())["description"]
      nftInfo["circulation"] = (await testFile())["circulation"]
      nftInfo["image"] = (await testFile())["imageName"]
      nftInfo["currentSupply"] = await global.lowcContract.groupCurrentSupply(i+1)
      nftInfos.push(nftInfo)
    }
    store.commit('setTotalGroup', nftInfos)
  } catch (err) {
    console.error(err)
  }
}

async function enterBid (id, amount) {
  if (id > 0 && amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.enterBid(id, amount_in_wei);
  }
  
  let filter = global.marketContract.filters.NewBidEntered(null, null, store.state.account)
  // Receive an event when ANY transfer occurs
  global.marketContract.on(filter, async (groupId, value, fromAddress, event) => {
    console.log(`I bid ${ value/1e18 } lowb to group ${ groupId}`);
    // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
    try {
      const bnbBalance = await global.provider.getBalance(store.state.account)
      const lowbBalance = store.state.lowbBalance
      const lowbMarketBalance = await global.marketContract.pendingWithdrawals(store.state.account)
      const approvedBalance = store.state.approvedBalance
      store.commit('setBalance', {
        bnbBalance: bnbBalance,
        lowbBalance: lowbBalance,
        lowbMarketBalance: lowbMarketBalance,
        approvedBalance: approvedBalance
      })
      getItemBids(id)
    } 
    catch (err) {
      console.error(err)
    }
  });
}

async function withdrawBid (id) {
  if (id > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    await marketWithSigner.withdrawBid(id);
  }

  let filter = global.marketContract.filters.BidWithdrawn(null, null, store.state.account)
  // Receive an event when ANY transfer occurs
  global.marketContract.on(filter, async (itemId, value, fromAddress, event) => {
    console.log(`I withdraw the bid to group ${ itemId}`);
    // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
    try {
      const bnbBalance = await global.provider.getBalance(store.state.account)
      const lowbBalance = store.state.lowbBalance
      const lowbMarketBalance = await global.marketContract.pendingWithdrawals(store.state.account)
      const approvedBalance = store.state.approvedBalance
      store.commit('setBalance', {
        bnbBalance: bnbBalance,
        lowbBalance: lowbBalance,
        lowbMarketBalance: lowbMarketBalance,
        approvedBalance: approvedBalance
      })
      getItemBids(id)
    } 
    catch (err) {
      console.error(err)
    }
  });
}

async function getItemBids (groupId) {
  if (global.marketContract == null) {
    await getContracts()
  }
  
  let bidInfo = await global.marketContract.itemBids(groupId, '0x0000000000000000000000000000000000000000')
  let bids = []
  while (bidInfo.nextBidder != '0x0000000000000000000000000000000000000000') {
    let bid = {}
    bid["maker"] = bidInfo.nextBidder
    bid["taker"] = 'anyone'
    bidInfo = await global.marketContract.itemBids(groupId, bidInfo.nextBidder)
    bid["price"] = bidInfo.value/1e18
    bid["index"] = bids.length + 1
    bids.push(bid)
  }

  store.commit('setItemBids', {id: groupId, bids: bids})
}

if (isMetaMaskInstalled()) {

  global.provider = new ethers.providers.Web3Provider(window.ethereum)
  global.signer = global.provider.getSigner()
  console.log('Access the decentralized web!')
  store.commit('setMetaMaskInstalled')

  getContracts()

}
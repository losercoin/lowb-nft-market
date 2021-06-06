import Vue from 'vue'
import Vuex from 'vuex'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import { ethers } from "ethers";

const App = () => import("./App.vue");
const About = () => import("./components/About.vue");
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

const routes = [
  { path: '/lowb-market', component: AppHome },
  { path: '/lowb-market/about', component: About },
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
    myNfts: [],
    itemBids: {},
    itemOffers: {},
    bidsAdmin: {},
    eventFilters: []
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
    max_bid: (state) => (id) =>  {
      if (state.itemBids[id].length == 0) {
        return 0
      }
      else {
        let max = state.itemBids[id][0].price
        for (let i = 1; i < state.itemBids[id].length; i++) {
          if (state.itemBids[id][i].price>max) {
            max = state.itemBids[id][i].price
          }
        }
        return max
      }
    },
    min_price: (state) => (id) =>  {
      if (state.itemOffers[id] == null || state.itemOffers[id].length == 0) {
        return 'N/A'
      }
      else {
        let min = state.itemOffers[id][0].minValue
        for (let i = 1; i < state.itemOffers[id].length; i++) {
          if (state.itemOffers[id][i].minValue < min) {
            min = state.itemOffers[id][i].minValue
          }
        }
        return min/1e18
      }
    },
    my_group_tokens: (state) => (id) =>  {
      let tokensToApprove = []
      let tokensToAccept = []
      state.myNfts.forEach(myNft => {
        if (myNft.groupId == id) {
          if (myNft.isApproved) {
            tokensToAccept.push(myNft.tokenId)
          }
          else {
            tokensToApprove.push(myNft.tokenId)
          }
        }
      })
      return {isNull: (tokensToAccept.length+tokensToApprove.length == 0), toAccept: tokensToAccept, toApprove: tokensToApprove}
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
    setNftInfos (state, payload) {
      if (payload.id <= state.nftInfos.length) {
        Vue.set(state.nftInfos, payload.id, payload.info)
        console.log("set group: ", payload.id)
      }
    },
    setMyNfts (state, payload) {
      if (payload.myNft == null) {
        state.myNfts.splice(payload.id, 1)
        console.log("delete my NFTs: ", payload.id)
      }
      else {
        Vue.set(state.myNfts, payload.id, payload.myNft)
        console.log("set my NFTs: ", payload.id)
      }
    },
    setItemOffers (state, payload) {
      Vue.set(state.itemOffers, payload.id, payload.offerInfos)
      console.log(`set ${ payload.id }'s offer: `, payload.offerInfos)
    },
    setItemBids (state, payload) {
      Vue.set(state.itemBids, payload.id, payload.bids)
      console.log(`set ${ payload.id }'s bids`)
    },
    setBidsAdmin (state, payload) {
      Vue.set(state.bidsAdmin, payload.id, payload.bidAdmin)
      console.log(`set ${ payload.id }'s bids' admin:  ${ payload.bidAdmin.address }`)
    },
    setItemSupply (state, payload) {
      let nftInfo = state.nftInfos[payload.id]
      nftInfo["currentSupply"] = payload.supply
      Vue.set(state.nftInfos, payload.id, nftInfo)
      console.log(`set ${ payload.id }'s current supply:  ${ payload.supply }`)
    },
    setNewItemPrice (state, payload) {
      let nftInfo = state.nftInfos[payload.id]
      nftInfo["price"] = payload.price
      Vue.set(state.nftInfos, payload.id, nftInfo)
      console.log(`set ${ payload.id }'s sale price:  ${ payload.price/1e18 }`)
    },
    addFilter (state, filter) {
      state.eventFilters.push(filter)
      console.log("register new event!")
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
    },
    updateTotalGroup () {
      getGroupNumber()
    },
    updateMyNfts () {
      getMyNfts()
    },
    updateBids ({}, groupId) {
      getItemBids(groupId)
    },
    updateOffers ({}, groupId) {
      getItemOffers(groupId)
    },
    approveGroupBid ({ state }, groupId) {
      const id = state.nftInfos[groupId-1].startId
      approveBid(id, groupId)
    },
    approveItemBid ({}, id) {
      approveBid(id.item, id.group)
    },
    acceptBid ({}, bid) {
      acceptBid(bid.id, bid.groupId, bid.bidder)
    },
    acceptNewBid ({}, bid) {
      acceptNewBid(bid.id, bid.bidder)
    },
    enterBid ({}, bid) {
      enterBid(bid.groupId, bid.amount)
    },
    withdrawBid ({}, id) {
      withdrawBid(id)
    },
    withdrawOffer ({}, id) {
      withdrawOffer(id.item, id.group)
    },
    startSale ({}, offer) {
      startSale(offer.id, offer.amount)
    },
    offerItem ({}, offer) {
      offerItem(offer.id, offer.groupId, offer.amount)
    },
    buyNewItem ({}, payload) {
      buyNewItem(payload.id, payload.amount)
    },
    buyItem ({}, payload) {
      buyItem(payload.id, payload.groupId, payload.amount)
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
      store.dispatch('updateMyNfts')
    }
    store.dispatch('updateTotalGroup')
  }
}

function handleNewAccounts (accounts) {
  store.commit('setAccount', accounts[0])
  if(store.state.chainId == '0x61') {
    getBalance(accounts[0])
    store.dispatch('updateMyNfts')
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

  const filter = global.lowbContract.filters.Approval(store.state.account, null)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("approve Lowb event registered")
  }
  else {
    store.commit("addFilter", filter)
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
        } 
        catch (err) {
          console.error(err)
        }
      }
    });
  }
  
}

async function depositLowb(amount) {
  if (amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.deposit(amount_in_wei);
  }

  const filter = global.lowbContract.filters.Transfer(store.state.account, null)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("deposit Lowb event registered")
  }
  else {
    store.commit("addFilter", filter)
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
}

async function withdrawLowb(amount) {
  if (amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.withdraw(amount_in_wei);
  }

  const filter = global.lowbContract.filters.Transfer(null, store.state.account)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("withdraw Lowb event registered")
  }
  else {
    store.commit("addFilter", filter)
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
  
}

async function getGroupNumber () {
  try {
    const groupNumber = await global.lowcContract.groupIds()
    for (let i=0; i<groupNumber; i++) {
      let nftInfo = {}
      const testFile = () => import("./assets/test-" + (i+1) + ".json")
      nftInfo["id"] = i+1
      nftInfo["name"] = (await testFile())["name"]
      nftInfo["description"] = (await testFile())["description"]
      nftInfo["circulation"] = (await testFile())["circulation"]
      nftInfo["image"] = (await testFile())["imageName"]
      nftInfo["startId"] = (await testFile())["startId"]
      nftInfo["features"] = (await testFile())["features"]
      nftInfo["currentSupply"] = await global.lowcContract.groupCurrentSupply(i+1)
      nftInfo["price"] = await global.marketContract.newTokenOffer(i+1)
      store.commit('setNftInfos', {id: i, info: nftInfo})
    }
  } catch (err) {
    console.error(err)
  }
}

async function getMyNfts () {
  try {
    let prev_length = store.state.myNfts.length
    for (let i=0; i<prev_length; i++) {
      store.commit('setMyNfts', {id: 0, myNft: null})
    }
    const lowcNumber = await global.lowcContract.balanceOf(store.state.account)
    for (let i=0; i<lowcNumber; i++) {
      const tokenId = (await global.lowcContract.tokenOfOwnerByIndex(store.state.account, i)).toString()
      const groupId = (await global.lowcContract.groupOf(tokenId)).toString()
      if (store.state.nftInfos[groupId-1] == null) {
        let nftInfo = {}
        const testFile = () => import("./assets/test-" + groupId + ".json")
        nftInfo["id"] = groupId
        nftInfo["name"] = (await testFile())["name"]
        nftInfo["description"] = (await testFile())["description"]
        nftInfo["circulation"] = (await testFile())["circulation"]
        nftInfo["image"] = (await testFile())["imageName"]
        nftInfo["startId"] = (await testFile())["startId"]
        nftInfo["features"] = (await testFile())["features"]
        nftInfo["currentSupply"] = await global.lowcContract.groupCurrentSupply(groupId)
        nftInfo["price"] = await global.marketContract.newTokenOffer(i+1)
        store.commit('setNftInfos', {id: groupId-1, info: nftInfo})
      }
      const getApproved = await global.lowcContract.getApproved(tokenId)
      const isApproved = (getApproved.toLowerCase() == global.marketAddress.toLowerCase())
      const myNft = {tokenId: tokenId, groupId: groupId, isApproved: isApproved}
      store.commit('setMyNfts', {id: i, myNft: myNft})
    }
  } catch (err) {
    console.error(err)
  }
}

async function buyNewItem (id, amount) {
  if (id > 0 && amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.buyNewItem(id, amount_in_wei);
  }
  console.log(Number(id))
  
  let filter = global.marketContract.filters.ItemMint(null, null, store.state.account)
  filter.buyNewItem = true
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("buy new item event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (itemId, value, toAddress, event) => {
      console.log(`${ toAddress } mint a new token #${ itemId } with ${ value } lowb`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = store.state.lowbBalance
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = Number(store.state.approvedBalance) - Number(value)
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        const supply = Number(store.state.nftInfos[id-1]["currentSupply"]) + 1
        store.commit('setItemSupply', {id: id-1, supply: supply})
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  
}

async function buyItem (id, groupId, amount) {
  if (id > 0 && amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.buyItem(id, amount_in_wei);
  }
  
  const filter = global.marketContract.filters.ItemBought(null, null, null, store.state.account)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("buy item event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (itemId, value, fromAddress, toAddress, event) => {
      console.log(`$I buy a token #${ itemId } with ${ value } lowb from ${ fromAddress }`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = Number(store.state.lowbBalance) -Number(value)
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = store.state.approvedBalance
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        getItemOffers(groupId)
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  
}

async function approveBid (tokenId, groupId) {
  if (tokenId > 0) {
    const lowcWithSigner = global.lowcContract.connect(global.signer);
    await lowcWithSigner.approve(global.marketAddress, tokenId)
  }

  const filter = global.lowcContract.filters.Approval(store.state.account)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("approve bid event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.lowcContract.on(filter, async (owner, operator, approved, event) => {
      console.log(`I approved the contract to handle my nft`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = store.state.lowbBalance
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = store.state.approvedBalance
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        if (store.state.nftInfos[groupId-1].currentSupply<store.state.nftInfos[groupId-1].circulation) {
          let bidAdmin = {address: store.state.account, isApproved: true}
          store.commit('setBidsAdmin', {id: groupId, bidAdmin: bidAdmin})
        }
        else {
          for (let i=0; i<store.state.myNfts.length; i++) {
            if (store.state.myNfts[i].tokenId == tokenId) {
              store.commit('setMyNfts', {id: i, myNft: {tokenId: tokenId, groupId: groupId, isApproved: true}})
            }
          }
        }
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  
}

async function startSale (id, amount) {
  if (id > 0 && amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.offerItemsForPublicSale(id, amount_in_wei);
  }
  console.log(Number(id))
  
  const filter = global.marketContract.filters.NewItemsOffered(Number(id))
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("start sale event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (groupId, minValue, event) => {
      console.log(`I offer group ${ groupId} with ${ minValue/1e18 } lowb for public sale`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = store.state.lowbBalance
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = store.state.approvedBalance
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        store.commit('setNewItemPrice', {id: groupId-1, price: minValue})
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  
}

async function offerItem (id, groupId, amount) {
  if (id > 0 && amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.offerItemForSale(id, amount_in_wei);
  }
  
  const filter = global.marketContract.filters.ItemOffered(Number(id))
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("offer item event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (itemId, minValue, toAddress, event) => {
      console.log(`I offer item ${ itemId} with ${ minValue/1e18 } lowb for sale`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = store.state.lowbBalance
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = store.state.approvedBalance
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        getItemOffers(groupId)
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  
}

async function acceptNewBid (id, bidder) {
  if (id > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    await marketWithSigner.approveBid(id, bidder);
  }

  let filter = global.marketContract.filters.ItemMint(null, null, bidder)
  filter.acceptNewBid = true
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("accept new bid event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (itemId, value, toAddress, event) => {
      console.log(`${ toAddress } mint a new token #${ itemId } with ${ value/1e18 } lowb`);
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
        console.log(store.state.nftInfos[id-1])
        const supply = Number(store.state.nftInfos[id-1]["currentSupply"]) + 1
        store.commit('setItemSupply', {id: id-1, supply: supply})
        getItemBids(id)
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  

}

async function acceptBid (id, groupId, bidder) {
  if (id > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    await marketWithSigner.acceptBid(id, bidder);
  }

  const filter = global.marketContract.filters.ItemBought(null, null, store.state.account)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("accept bid event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (itemId, value, fromAddress, toAddress, event) => {
      console.log(`${ toAddress } bought a token #${ itemId } with ${ value/1e18 } lowb from ${ fromAddress }`);
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
        for (let i=0; i<store.state.myNfts.length; i++) {
          if (store.state.myNfts[i].tokenId == itemId) {
            store.commit('setMyNfts', {id: i, myNft: null})
          }
        }
        getItemBids(id)
        getItemOffers(groupId)
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  

}

async function enterBid (id, amount) {
  if (id > 0 && amount > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await marketWithSigner.enterBid(id, amount_in_wei);
  }
  
  const filter = global.marketContract.filters.NewBidEntered(null, null, store.state.account)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("enter bid event registered")
  }
  else {
    store.commit("addFilter", filter)
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
  
}

async function withdrawBid (id) {
  if (id > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    await marketWithSigner.withdrawBid(id);
  }

  const filter = global.marketContract.filters.BidWithdrawn(null, null, store.state.account)
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("withdraw bid event registered")
  }
  else {
    store.commit("addFilter", filter)
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
  
}

async function withdrawOffer (id, groupId) {
  if (id > 0) {
    const marketWithSigner = global.marketContract.connect(global.signer);
    await marketWithSigner.itemNoLongerForSale(id);
  }

  const filter = global.marketContract.filters.ItemNoLongerForSale(Number(id))
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("withdraw offer event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.marketContract.on(filter, async (itemId, event) => {
      console.log(`I withdraw the offer of item ${ itemId }`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
      try {
        const bnbBalance = await global.provider.getBalance(store.state.account)
        const lowbBalance = store.state.lowbBalance
        const lowbMarketBalance = store.state.lowbMarketBalance
        const approvedBalance = store.state.approvedBalance
        store.commit('setBalance', {
          bnbBalance: bnbBalance,
          lowbBalance: lowbBalance,
          lowbMarketBalance: lowbMarketBalance,
          approvedBalance: approvedBalance
        })
        getItemOffers(groupId)
      } 
      catch (err) {
        console.error(err)
      }
    });
  }
  
}

async function getItemBids (groupId) {
  if (global.marketContract == null) {
    await getContracts()
  }

  let bidAdmin = {}
  //console.log(store.state.nftInfos[groupId].currentSupply, store.state.nftInfos[groupId].circulation)
  if (store.state.nftInfos[groupId-1].currentSupply < store.state.nftInfos[groupId-1].circulation) {
    bidAdmin["address"] = await global.lowcContract.ownerOf(store.state.nftInfos[groupId-1].startId)
    const getApproved = await global.lowcContract.getApproved(store.state.nftInfos[groupId-1].startId)
    bidAdmin["isApproved"] = (getApproved.toLowerCase() == global.marketAddress.toLowerCase())
  }
  store.commit('setBidsAdmin', {id: groupId, bidAdmin: bidAdmin})
  
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

async function getItemOffers (groupId) {
  if (global.marketContract == null) {
    await getContracts()
  }

  let offerInfos = []
  for (let i=store.state.nftInfos[groupId-1].startId; i<store.state.nftInfos[groupId-1].startId+Number(store.state.nftInfos[groupId-1].currentSupply); i++) {
    let offerInfo = await global.marketContract.itemsOfferedForSale(i)
    if (offerInfo.isForSale) {
      offerInfos.push(offerInfo)
    }
  }

  store.commit('setItemOffers', {id: groupId, offerInfos: offerInfos})
  
}

if (isMetaMaskInstalled()) {

  global.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  global.signer = global.provider.getSigner()
  console.log('Access the decentralized web!')
  store.commit('setMetaMaskInstalled')

  getContracts()

}
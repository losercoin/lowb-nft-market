import Vue from 'vue'
import Vuex from 'vuex'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import { ethers } from "ethers";
import VueI18n from 'vue-i18n';

import { chainInfo, LOWB_TOKEN_ADDRESS, MARKET_CONTRACT_ADDRESS, HELPER_CONTRACT_ADDRESS, LOWC_TOKEN_ADDRESS, ADMIN_ADDRESS } from "./const/index.js"
import peopleInfo from './const/people.json'

const App = () => import("./App.vue");
const About_zh = () => import("./components/About_zh.vue");
const About_en = () => import("./components/About_en.vue");
const AppHome = () => import("./components/Loser666.vue");
const MyNFTs = () => import("./components/MyNFTs.vue");
const TokenDetail = () => import("./components/LoserPunkDetail.vue");
const NewTokenDetail = () => import("./components/NewTokenDetail.vue");

Vue.use(Vuex)
Vue.use(VueI18n)

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)

Vue.use(VueRouter)

const routes = [
  { path: '/', component: AppHome },
  { path: '/about-zh', component: About_zh },
  { path: '/about-en', component: About_en },
  { path: '/my-nfts', component: MyNFTs },
  { path: '/token-details/:id', component: TokenDetail },
  { path: '/new-token-details/:id', component: NewTokenDetail }
]

const router = new VueRouter({
  mode: 'history',
  routes // (缩写) 相当于 routes: routes
})

const i18n = new VueI18n({
  // 设置默认语言
  locale: localStorage.getItem('locale') || 'en', //语言标识
  messages: {
    'zh': require('./assets/zh.js'),
    'en': require('./assets/en.js')
  },
  fallbackLocale: 'en', //如果在message中找不到相应的键值将回退到原本的语言
  formatFallbackMessages: true //如果在message中找不到相应的键值将回退到原本的语言
})

const store = new Vuex.Store({
  state: {
    isWalletInstalled: false,
    chainId: 0,
    account: "",
    bnbBalance: 0,
    lowbBalance: 0,
    lowbMarketBalance: 0,
    approvedBalance: 0,
    punkPage: 1,
    loserPunkState: 'idle',
    nftInfos: [],
    myNfts: [],
    itemsOwner: {},
    itemBids: {},
    itemOffers: {},
    itemTransactions: {},
    lastBlock: 0,
    bidsAdmin: {},
    eventFilters: [],
    modalShow: false,
    CHAIN_ID: chainInfo.chainId
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
    owner: (state) => (id) =>  {
      const owner = state.itemsOwner[id]
      let ownerInfo = {address: "", name: ""}
      if (owner == null)
        return ownerInfo
      ownerInfo.address = owner
      if (owner.toLowerCase() == ADMIN_ADDRESS.toLowerCase()) {
        if (i18n.locale=='zh')
          ownerInfo.name = "(官方仓库)"
        else
          ownerInfo.name = "(Offical Store)"
      }
      else {
        const vip = peopleInfo.find(people => people.address.toLowerCase() == owner.toLowerCase())
        if (vip)
          ownerInfo.name = '(' + vip.name + ')'
      }
      return ownerInfo
    },
    my_bid: (state) => (id) =>  {
      return state.itemBids[id].find(bid => bid.maker.toLowerCase() == store.state.account.toLowerCase())
    },
    loser_punks: (state) => (filter) => {
      if (filter == 'my_bids') {
        return state.nftInfos.filter(info => info.hasMyBid)
      }
      else if (filter == 'all_bids') {
        return state.nftInfos.filter(info => info.bids > 0)
      }
      else if (filter == 'for_sale') {
        return state.nftInfos.filter(info => info.price > 0)
      }
      else if (filter == 'pre_sale') {
        return state.nftInfos.filter(info => info.startId > 100 && info.startId <= 200)
      }
      else {
        return state.nftInfos
      }
    },
    bid_winner: (state) => (id) =>  {
      if ( state.itemBids[id] == null || state.itemBids[id].length == 0) {
        return '0x0'
      }
      else {
        let max = state.itemBids[id][0].price
        let winner = state.itemBids[id][0].maker
        for (let i = 1; i < state.itemBids[id].length; i++) {
          if (state.itemBids[id][i].price>=max) {
            max = state.itemBids[id][i].price
            winner = state.itemBids[id][i].maker
          }
        }
        return winner
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
    setModal(state, show) {
      state.modalShow = show
    },
    setWalletInstalled (state) {
      state.isWalletInstalled = true
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
        console.log("set group: ", payload.id, payload.info.bids)
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
    setItemsOwner (state, payload) {
      state.itemsOwner[payload.id] = payload.owner
      console.log(`set ${ payload.id }'s owner: `, payload.owner)
    },
    setItemOffers (state, payload) {
      Vue.set(state.itemOffers, payload.id, payload.offerInfos)
      console.log(`set ${ payload.id }'s offer: `, payload.offerInfos)
    },
    setItemBids (state, payload) {
      Vue.set(state.itemBids, payload.id, payload.bids)
      console.log(`set ${ payload.id }'s bids`)
    },
    setItemTransactions (state, payload) {
      Vue.set(state.itemTransactions, payload.id, payload.transactions)
      state.lastBlock = payload.lastBlock
      console.log(`set ${ payload.id }'s transactions (block ${ payload.lastBlock })`)
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
    },
    setPunkPage (state, page) {
      state.punkPage = page
      //console.log("set punk page: ", page)
    },
    setLoserPunkState (state, punkState) {
      state.loserPunkState = punkState
      console.log("set loser punks state: ", punkState)
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
    updateItemInfos ({}, groupId) {
      updateItemInfos(groupId)
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
    },
    filterPunks ({}, filter) {
      filterPunks(filter)
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})


const isWalletInstalled = () => {
  const { ethereum } = window
  //console.log('MetaMask', ethereum.isMetaMask)
  return Boolean(ethereum)
}

function handleNewChain (chainId) {
  store.commit('setChainId', chainId)
  if(chainId == chainInfo.chainId) {
    if (store.state.account != '') {
      getBalance(store.state.account)
      store.dispatch('updateMyNfts')
    }
    store.dispatch('updateTotalGroup')
    addLowbToken ()
  }
}

function handleNewAccounts (accounts) {
  store.commit('setAccount', accounts[0])
  if(store.state.chainId == chainInfo.chainId) {
    getBalance(accounts[0])
    store.dispatch('updateMyNfts')
    addLowbToken ()
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
        chainId: chainInfo.chainId, //'0x38', 
        chainName: 'BSC Testnet', //'Binance Smart Chain', 
        nativeCurrency: { name: 'BNBT', symbol: 'BNBT', decimals: 18 }, 
        rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'], //['https://bsc-dataseed.binance.org/'], 
        blockExplorerUrls: ['https://testnet.bscscan.com'] //['https://bscscan.com/'] 
      }] 
    })
    window.location.reload()
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
    const approvedBalance = await global.lowbContract.allowance(account, MARKET_CONTRACT_ADDRESS)
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

async function getContracts (firstTime = true) {
  const lowbFile = () => import("./assets/ERC20Template.json")
  const lowbAbi = (await lowbFile())['abi']
  global.lowbContract = new ethers.Contract(LOWB_TOKEN_ADDRESS, lowbAbi, global.provider)

  const marketFile = () => import("./assets/LowbMarket.json")
  const marketAbi = (await marketFile())['abi']
  global.marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, marketAbi, global.provider)

  const helperFile = () => import("./assets/LowbMarketHelper.json")
  const helperAbi = (await helperFile())['abi']
  global.helperContract = new ethers.Contract(HELPER_CONTRACT_ADDRESS, helperAbi, global.provider)

  const lowcFile = () => import("./assets/MyCollectible.json")
  const lowcAbi = (await lowcFile())['abi']
  global.lowcContract = new ethers.Contract(LOWC_TOKEN_ADDRESS, lowcAbi, global.provider)

  const testFile = () => import("./assets/loserpunk.json")
  global.loserpunk = (await testFile())

  if (firstTime && store.state.isWalletInstalled) {
    // update infomation after get contract!!!

    ethereum.autoRefreshOnNetworkChange = false
    store.dispatch('updateChainId')
    store.dispatch('updateAccounts')

    ethereum.on('chainChanged', handleNewChain)
    ethereum.on('accountsChanged', handleNewAccounts)
  }
  else {
    handleNewChain(chainInfo.chainId)
  }

}

async function approveLowb(amount) {
  if (amount > 0) {
    const lowbWithSigner = global.lowbContract.connect(global.signer);
    const amount_in_wei = ethers.utils.parseUnits(amount.toString(), 18);
    await lowbWithSigner.approve(MARKET_CONTRACT_ADDRESS, amount_in_wei);
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

async function getNftInfo (groupId, update=true) {
  if (store.state.nftInfos[groupId-1] == null || update) {
    let nftInfo = {}
    nftInfo["id"] = groupId
    nftInfo["name"] = global.loserpunk[groupId-1]["name"]
    nftInfo["description"] = "This is our first nft. Make loser Great again!!!"
    nftInfo["circulation"] = global.loserpunk[groupId-1]["circulation"]
    nftInfo["image"] = "https://www.losernft.org/ipfs/" + global.loserpunk[groupId-1]["hash"]
    nftInfo["startId"] = global.loserpunk[groupId-1]["startId"]
    nftInfo["features"] = ["cool", "dark"]
    nftInfo["currentSupply"] = 1 //await global.lowcContract.groupCurrentSupply(groupId)
    nftInfo["price"] = 0 //await global.marketContract.newTokenOffer(groupId)
    store.commit('setNftInfos', {id: groupId-1, info: nftInfo})
  }
}

async function getGroupNumber () {
  try {
    const groupNumber = await global.lowcContract.serialCurrentGroup(1)
    for (let i=0; i<groupNumber; i++) {
      await getNftInfo(i+1)
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
      const groupId = tokenId//(await global.lowcContract.groupOf(tokenId)).toString()
      await getNftInfo(groupId, false)
      const getApproved = await global.lowcContract.getApproved(tokenId)
      const isApproved = (getApproved.toLowerCase() == MARKET_CONTRACT_ADDRESS.toLowerCase())
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
    await lowcWithSigner.approve(MARKET_CONTRACT_ADDRESS, tokenId)
  }

  const filter = global.lowcContract.filters.Approval(null, null, Number(tokenId))
  if (store.state.eventFilters.find(element => JSON.stringify(element) == JSON.stringify(filter))) {
    console.log("approve bid event registered")
  }
  else {
    store.commit("addFilter", filter)
    // Receive an event when ANY transfer occurs
    global.lowcContract.on(filter, async (owner, operator, id, event) => {
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

  let bidAdmin = {}
  //console.log(store.state.nftInfos[groupId].currentSupply, store.state.nftInfos[groupId].circulation)
  if (store.state.nftInfos[groupId-1].currentSupply < store.state.nftInfos[groupId-1].circulation) {
    bidAdmin["address"] = await global.lowcContract.ownerOf(store.state.nftInfos[groupId-1].startId)
    const getApproved = await global.lowcContract.getApproved(store.state.nftInfos[groupId-1].startId)
    bidAdmin["isApproved"] = (getApproved.toLowerCase() == MARKET_CONTRACT_ADDRESS.toLowerCase())
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
  let offerInfos = []
  for (let i=store.state.nftInfos[groupId-1].startId; i<store.state.nftInfos[groupId-1].startId+Number(store.state.nftInfos[groupId-1].currentSupply); i++) {
    let offerInfo = await global.marketContract.itemsOfferedForSale(i)
    if (offerInfo.isForSale) {
      offerInfos.push(offerInfo)
    }
    let owner = await global.lowcContract.ownerOf(i)
    store.commit('setItemsOwner', {id: i, owner: owner})
  }

  store.commit('setItemOffers', {id: groupId, offerInfos: offerInfos})
  
}

async function getItemHistory (groupId) {

  const id = store.state.nftInfos[groupId-1].startId
  let infos = []

  const transferFile = () => import("./assets/LowcEventTest.json")
  const transferEvent = (await transferFile())['Transfer']
  let transaction = transferEvent.filter(item => item.returnValues.tokenId == id)

  const info = transaction[0].args
  infos.push({
    from: info.from, 
    to: info.to, 
    value: 0, 
    block: transaction[0].blockNumber, 
    hash: transaction[0].transactionHash
  })

  const itemBoughtFile = () => import("./assets/MarketEventTest.json")
  const itemBoughtEvent = (await itemBoughtFile())['ItemBought']
  const blockNumner = (await itemBoughtFile())['blockNumber']
  transaction = itemBoughtEvent.filter(item => item.itemId == id)
  //console.log(itemBoughtEvent)
  console.log(transaction)
  infos.push.apply(infos, transaction)
  
  store.commit('setItemTransactions', {id: groupId, transactions: infos, lastBlock: blockNumner})

}

async function updateItemInfos (groupId) {
  if (global.marketContract == null || global.lowcContract == null) {
    await getContracts(false)
  }
  await getNftInfo(groupId, false)

  //clearTimeout(this.timer);  //清除延迟执行
 
  const timer = setTimeout(()=>{   //设置延迟执行
    //console.log('1:', store.state.nftInfos[groupId-1])
    getItemBids(groupId)
    getItemOffers(groupId)
    getItemHistory(groupId)
  },300);
}

async function filterPunks(filter) {
  store.commit('setLoserPunkState', '?')
  if (filter == 'my_bids') {
    const bids = await global.helperContract.getBidsOf(store.state.account, 1, store.state.nftInfos.length)
    for (let i=0; i<store.state.nftInfos.length; i++) {
      let nftInfo = store.state.nftInfos[i]
      nftInfo.hasMyBid = (bids[i].value > 0)
      store.commit('setNftInfos', {id: i, info: nftInfo})
    }
  }
  else if (filter == 'all_bids') {
    const bids = await global.helperContract.getHighestBids(1, store.state.nftInfos.length)
    for (let i=0; i<store.state.nftInfos.length; i++) {
      let nftInfo = store.state.nftInfos[i]
      nftInfo.bids = bids[i].value
      store.commit('setNftInfos', {id: i, info: nftInfo})
    }
  }
  else if (filter == 'for_sale') {
    const offers = await global.helperContract.getOffers(1, store.state.nftInfos.length)
    for (let i=0; i<store.state.nftInfos.length; i++) {
      let nftInfo = store.state.nftInfos[i]
      nftInfo.price = offers[i].minValue
      store.commit('setNftInfos', {id: i, info: nftInfo})
    }
  }
  /*else if (filter == 'pre_sale') {
    for (let i=0; i<store.state.nftInfos.length; i++) {
      store.commit('setLoserPunkState', i+1)
      const owner = await global.lowcContract.ownerOf(store.state.nftInfos[i].startId)
      let nftInfo = store.state.nftInfos[i]
      nftInfo.owner = owner
      store.commit('setNftInfos', {id: i, info: nftInfo})
    }
  }*/
  const timer = setTimeout(()=>{   //设置延迟执行
    store.commit('setLoserPunkState', 'idle')
  },100);
  
}

async function addLowbToken () {
  if (localStorage.getItem('setLowb') == "true") {
    return
  }

  const tokenAddress = LOWB_TOKEN_ADDRESS
  const tokenSymbol = 'LOWB'
  const tokenDecimals = 18
  const tokenImage = 'https://bscscan.com/token/images/losercoin_32.png'

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
      localStorage.setItem("setLowb", "true")
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
  
}


if (isWalletInstalled()) {

  global.provider = new ethers.providers.Web3Provider(window.ethereum)
  global.signer = global.provider.getSigner()
  console.log('Access the decentralized web!')
  store.commit('setWalletInstalled')
  
}
else {
  global.provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrls[0]);
  //const block = await provider.getBlockNumber()
  console.log('block', provider.getBlockNumber())
}

getContracts()

if (localStorage.getItem('locale') == null) {
  store.commit("setModal", true)
}
else {
  console.log(localStorage.getItem('locale'))
}
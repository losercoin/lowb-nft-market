<template>
  <div class="container">
    <h1>Q&amp;A Page</h1>
    <br>
    <h2>Loser NFT</h2>
    <p>NFT全称为Non-Fungible Token，非同质化代币，是用于表示数字资产的唯一加密货币令牌，具有不可分割、不可代替、独一无二等特点。</p>
    <p>Loser NFT是一款依附于币安智能链上发布的token，符合ERC721的标准。您可以在<a :href="baseUrl+lowcAddress">bscScan</a>上查询该币的发行总量，交易记录等相关信息。</p>
    <p>此外，我们的Loser NFT还基于ERC1967标准开发，我们可以于必要时候在不改变合约地址的前提下对合约进行升级。请放心，升级合约并不会改变链上的储存内容，升级后您依旧持有原来的代币，交易历史也不会发生改变。当前NFT所使用的是第一版合约，您同样可以在<a :href="baseUrl+lowcContractAddress">bscScan</a>查看合同的相关内容。</p>
    <p>除了ERC721标准所对应的接口外，我们当前的NFT采用群组化的模式，每个NFT都有对应的群组，其ID由群组负责分配。当你获取某个NFT的URI时，合约将查询并提供该NFT所对应群组的URI，用户可以根据该URI识别该代币指向的内容。</p>
    <h2>发行流程</h2>
    <p>代币的发行流程分为两个阶段。</p>
    <p>第一阶段：合约的管理者调用当前智能合约的发行接口，设置其所属系列、发行方、最大发行量、版费以及群组URI等信息。其后，智能合约将发送该群组的第一个NFT至发行方地址。</p>
    <p>第二阶段：如果该群组的最大发行量大于1，则进入发行阶段。发行方可以通过与<a :href="baseUrl+marketAddress">LowbMarket智能合约</a>交互的方式以两种形式发行Loser NFT。</p>
    <p>(1) 竞价模式：所有人都可以对发行阶段的NFT进行报价，发行方可以选择合适的标的成交。</p>
    <p>(2) 公开销售：发行方可以设置一个金额公开发售该组NFT，任何人都可以以不低于该金额的Lowb获得一个该群组的NFT。在发行阶段，发行方可随时更改公开发售的最低金额。</p>
    <p>成交后NFT合约将直接发送一个当前群组的NFT至买家地址中，而买家所支付的Lowb中的扣除2.5%交易手续费后，剩余部分将以保证金的形式转入发行方钱包地址，作为对创作者的激励。</p>
    <p>操作提示：发行方首先要授权NFT给合约地址才能进行发行操作，同样地，买家也需要先授权合约地址足够的Lowb才能执行直接购买NFT的操作。</p>
    <h2>自由流通阶段</h2>
    <p>当某个群组的流通数量到达最大发行量时，市场将进入自由交易阶段。发行阶段的报价单将继续保留，在自由流通阶段买家可以继续对某个群组的NFT进行报价。同时，持有该群组NFT的卖家也可以进行报价。买卖双方可以自由选择合适的报价单成交。</p>
    <p>成交后NFT将从卖家地址转入买家地址，而买家所支付的Lowb会进行如下分配：交易平台将收取2.5%的交易佣金；发行方收取一定的版费（例如对于Loser Punk系列，其版费为2.5%）；最后剩余的Lowb以保证金的形式存入卖家的钱包地址。</p>
    <p>操作提示：卖家要先授权NFT给合约地址才能对其进行直接卖出以及报价操作。</p>
    <h2>关于市场保证金余额</h2>
    <p>用户可自行往“我的资产”页面充提Lowb。买家进行报价时将使用存于交易平台中的保证金而不是自己钱包中的Lowb。报价时LowbMarket合约将锁定对应的保证金金额，并在报价单撤销时予以返还。</p>
    <h2>参与NFT Market测试</h2>
    <p>你可以进入我们的 <a href="https://test.losernft.org">测试网页</a> 帮助我们测试新功能。点击右上角的按钮，然后下拉选择“我的资产”。如果你没有测试网的BNB，可以点击“<a href="https://testnet.binance.org/faucet-smart">Testnet Funds</a>”链接获取一些BNB进行测试，然后点击下方的“申请”按钮就可以领取一些Lowb进行测试了。</p>
    <p>大家有任何问题或建议欢迎前往<a href="http://losercointalk.org/thread?topicId=170">论坛</a>进行反馈。</p>
  </div>
</template>

<script>
import { MARKET_CONTRACT_ADDRESS, LOWC_TOKEN_ADDRESS, LOWC_CONTRACT_ADDRESS } from "../const/index.js"

export default {
    data() {
      return {
        baseUrl: "",
        marketAddress: MARKET_CONTRACT_ADDRESS,
        lowcAddress: LOWC_TOKEN_ADDRESS,
        lowcContractAddress: LOWC_CONTRACT_ADDRESS
      }
    },
    created () {
      if (this.$store.state.chainId == '0x61') {
        this.baseUrl = "https://testnet.bscscan.com/address/"
      }
      else {
        this.baseUrl = "https://bscscan.com/address/"
      }
    },
}
</script>

<style lang="scss" scoped>
  h1{
    color: #5e9ca0;
    font-size: 3em;
    line-height: 1.3em;
    text-align: center;
  }
  h2{
    color: #2e6c80;
    font-size: 2em;
  }
  p{
    margin: 1em 0;
    line-height: 1.15;
  }
</style>
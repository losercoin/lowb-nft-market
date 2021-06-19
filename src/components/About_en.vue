<template>
  <div class="container">
    <h1>Q&amp;A Page</h1>
    <br>
    <h2>Loser NFT</h2>
    <p>NFT, known as Non-Fungible Token, is a unique cryptocurrency token used to represent digital assets, with characteristics such as indivisible, irreplaceable and unique.</p>
    <p>Loser NFT is a token on the Binance Smart Chain which consistent with the ERC721 standard. You can check the total supply amount, transaction records and other related information on <a href="https://testnet.bscscan.com/token/0x9715143c7a5aae7b52b930087303d1566bed9c2c" rel="nofollow">bscScan</a>.</p>
    <p>In addition, our Loser NFT is also developed based on ERC1967 standard, we can upgrade the contract without changing the contract address when necessary. Upgrading the contract does not change the storage content on the chain, you will still own the original tokens after the upgrade, and the transaction history will not change. The current NFT is using the first version of the contract, you can also view the contents of the contract on <a href="https://testnet.bscscan.com/address/0x8483135ae2b7778146c7edacb9551656c6f043b8" rel="nofollow">bscScan</a>.</p>
    <p>In addition to the ERC721 standard interface, our current NFT uses a grouping model, i.e., each NFT has a corresponding group, and its ID is automatically assigned by the group. When you obtain the URI of an NFT, the contract will query and provide the URI of the group corresponding to that NFT, and the user can identify the token' content based on that URI.</p>
    <h2>Issuance Process</h2>
    <p>The token issuance process is divided into two phases.</p>
    <p>Phase 1: The contract manager calls the issuance interface of the current smart contract and sets the information such as its series, the issuer, the maximum issuance amount, the royalty and the group URI. After that, the smart contract will send the first NFT of the group to the issuer's address.</p>
    <p>Phase 2: If the maximum distribution of the group is greater than 1, then the distribution phase will begin. The issuer can issue Loser NFTs in two ways by interacting with the <a href="https://testnet.bscscan.com/address/0x2d0d4cc1d4962d2070578811d3da94fb610c9c92">LowbMarket smart contract</a>.</p>
    <p>(1) Bidding mode: Everyone can bid for the NFT in the distribution phase, and the issuer can choose to accept appropriate bids.</p>
    <p>(2) Public sale: The issuer can set a price to publicly offer a group of NFTs, and anyone can get a NFT of the group with not less than that amount of Lowb. The issuer can change the minimum amount for public sale at any time during the distribution phase.</p>
    <p>The NFT contract will send one NFT token of the current group directly to the buyer's address after the transaction is completed, and the remainder of the Lowb paid by the buyer, after deducting the 2.5% transaction fee, will be deposited in the issuer's wallet in the marketplace as an incentive for the creator.</p>
    <p>Tips: The issuer must first authorize the NFT tokens to the contract address in order to perform the issuance operation, and similarly, the buyer must first authorize enough Lowb to the contract address in order to purchase the NFT directly.</p>
    <h2>Free Trading Phase</h2>
    <p>The market will turn into the free trading phase when the circulation of a group reaches its the maximum issued amount. Bids from the issuance phase will remain and new buyers can continue bidding the NFT token in this phase. At the same time, sellers who holding NFTs of that group can also make offers. Buyers and sellers are free to accept bids or take offers.</p>
    <p>After the transaction, the NFT token will be transferred from the seller's address to the buyer's address, and the Lowb paid by the buyer will be distributed as follows: a fixed 2.5% transaction fee is deposited into the marketplace's wallet; after that 0%-10% of the royalty is deposited into the issuer's market wallet balance; and finally the remaining Lowb is deposited into the seller's market wallet balance.</p>
    <p>Tips: sellers have to authorize NFT to the contract address before they make offers or sell the NFT tokens directly.</p>
    <h2>About the market wallet balance</h2>
    <p>You can depodit and withdraw Lowb to the marketplace wallet by yourselve. Buyers will use the marketplace wallet balance instead of their own wallet balance when making bids. The bid amount will be locked in the LowbMarket contract which will be refunded when the bid is withdrawed.</p>
    <h2>Try the new version and test</h2>
    <p>Click on the button in the upper right corner, then scroll down and select "View My NFTs". If you do not have a test network of BNB, you can click the link in "go to <a href="https://testnet.binance.org/faucet-smart">Testnet Funds</a> to get more BNB" to get some BNB for testing, and then click the Claim button below to get some Lowb for testing.</p>
  </div>
</template>

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
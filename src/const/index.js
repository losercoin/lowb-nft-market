const BSC_MAINNET_ID = '0x38';
const BSC_TESTNET_ID = '0x61';

const LOWB_TOKEN_ADDRESS_MAIN = "0x843d4a358471547f51534e3e51fae91cb4dc3f28";
const LOWB_TOKEN_ADDRESS_TEST = "0x5aa1a18432aa60bad7f3057d71d3774f56cd34b8";

const MARKET_CONTRACT_ADDRESS_MAIN = "0xE6E2c0aDf025D8137314C1878c30324Df92d07E0";
const MARKET_CONTRACT_ADDRESS_TEST = "0xbB82bb854A0Ad088796ed39eB67F0F49781dc9A2";

const LOWC_TOKEN_ADDRESS_MAIN = "0xe0b78dc64d4385b208016050ecfed986a5e0de0e";
const LOWC_TOKEN_ADDRESS_TEST = "0xe031188b0895afd3f3c32b2bf27fbd1ab9e8c9ea";

const testChainInfo = {
  chainId: '0x61',
  chainName: 'BSC Testnet',
  nativeCurrency: { name: 'BNBT', symbol: 'BNBT', decimals: 18 }, 
  rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/']
};

const mainChainInfo = {
  chainId: '0x38',
  chainName: 'Binance Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, 
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/']
};


export const chainInfo = testChainInfo;
export const LOWB_TOKEN_ADDRESS = LOWB_TOKEN_ADDRESS_TEST;
export const MARKET_CONTRACT_ADDRESS = MARKET_CONTRACT_ADDRESS_TEST;
export const LOWC_TOKEN_ADDRESS = LOWC_TOKEN_ADDRESS_TEST;

/*
export const chainInfo = mainChainInfo;
export const LOWB_TOKEN_ADDRESS = LOWB_TOKEN_ADDRESS_MAIN;
export const MARKET_CONTRACT_ADDRESS = MARKET_CONTRACT_ADDRESS_MAIN;
export const LOWC_TOKEN_ADDRESS = LOWC_TOKEN_ADDRESS_MAIN;
*/

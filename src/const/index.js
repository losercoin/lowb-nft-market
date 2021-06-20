const BSC_MAINNET_ID = '0x38';
const BSC_TESTNET_ID = '0x61';

const LOWB_TOKEN_ADDRESS_MAIN = "0x843d4a358471547f51534e3e51fae91cb4dc3f28";
const LOWB_TOKEN_ADDRESS_TEST = "0x5aa1a18432aa60bad7f3057d71d3774f56cd34b8";

const MARKET_CONTRACT_ADDRESS_MAIN = "0x3DA004FFC68C0C8974A4A91E7fB52875bb7Ad938";
const MARKET_CONTRACT_ADDRESS_TEST = "0xbB82bb854A0Ad088796ed39eB67F0F49781dc9A2";

const LOWC_TOKEN_ADDRESS_MAIN = "0xe0b78dc64d4385b208016050ecfed986a5e0de0e";
const LOWC_TOKEN_ADDRESS_TEST = "0xe031188b0895afd3f3c32b2bf27fbd1ab9e8c9ea";

const ADMIN_ADDRESS_MAIN = "0x953b71563bB68A1297801C873297cb4a0cB17960";
const ADMIN_ADDRESS_TEST = "0xD35a860B6fDB386Ae9d83D72209DAA704631CA15";

const LOWC_CONTRACT_ADDRESS_MAIN = "0x1D23fd056a70634D8eD944377C7625f4773FEA03";
const LOWC_CONTRACT_ADDRESS_TEST = "0x81B91b31C707236e48c18127a72DaE43b910fd9b";

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
export const ADMIN_ADDRESS = ADMIN_ADDRESS_TEST;
export const LOWC_CONTRACT_ADDRESS = LOWC_CONTRACT_ADDRESS_TEST;

/*
export const chainInfo = mainChainInfo;
export const LOWB_TOKEN_ADDRESS = LOWB_TOKEN_ADDRESS_MAIN;
export const MARKET_CONTRACT_ADDRESS = MARKET_CONTRACT_ADDRESS_MAIN;
export const LOWC_TOKEN_ADDRESS = LOWC_TOKEN_ADDRESS_MAIN;
export const ADMIN_ADDRESS = ADMIN_ADDRESS_MAIN;
export const LOWC_CONTRACT_ADDRESS = LOWC_CONTRACT_ADDRESS_MAIN;

*/
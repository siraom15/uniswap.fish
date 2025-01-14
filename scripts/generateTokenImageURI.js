const fs = require("fs");
const axios = require("axios");

const URLS = [
  "https://tokens.uniswap.org",
  "https://extendedtokens.uniswap.org",
  "https://unsupportedtokens.uniswap.org",
  "https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json",
  "https://api.coinmarketcap.com/data-api/v3/uniswap/all.json",
  "https://tokens.coingecko.com/uniswap/all.json",
  "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json",
  "https://www.gemini.com/uniswap/manifest.json",
  "https://app.tryroll.com/tokens.json",
  "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  "https://static.optimism.io/optimism.tokenlist.json",
  "https://bridge.arbitrum.io/token-list-42161.json",
  "https://celo-org.github.io/celo-token-list/celo.tokenlist.json",
];

Promise.all(URLS.map((url) => axios.get(url)))
  .then((lists) => {
    return lists.map((list) => list.data.tokens).flat();
  })
  .then((tokens) => {
    return tokens
      .filter((t) => t !== undefined && t.logoURI)
      .reduce((result, curr) => {
        let logoURI = curr.logoURI;
        if (logoURI.indexOf("ipfs://") !== -1) {
          logoURI = logoURI.replace(`ipfs://`, `https://ipfs.io/ipfs/`);
        }
        result[curr.address.toLowerCase()] = logoURI;
        return result;
      }, {});
  })
  .then((data) => {
    const filepath = "./src/utils/uniswapv3/tokenImageURI.json";

    fs.writeFileSync(filepath, JSON.stringify(data, 2, 2));
    console.log(`[DONE] Generated token image URI mapping file to ${filepath}`);
  });

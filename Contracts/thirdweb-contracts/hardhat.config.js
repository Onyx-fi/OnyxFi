/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai", 
      accounts: "a40805709622b9ce3e8ce9a99fa3f780eebf2b3a6fe42b8aec009c1aca5be294",
    },
  },

};

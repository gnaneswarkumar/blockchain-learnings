const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');
const {your_own_phrase, your_own_endpoint } = require("./config");

const provider = new HDWalletProvider(
  your_own_phrase,
  // remember to change this to your own phrase!
  your_own_endpoint
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", gasPrice: '5000000000', from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();

//run 'node compile.js' in terminal to compile changes 
//run 'node deploy.js' in terminal to deploy 
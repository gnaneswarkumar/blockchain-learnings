// deploy code will go here
const HDWalletProvider = require("truffle-hdwallet-provider");

const Web3 = require("web3");

const {interface, bytecode } = require("./compile");
const constants = require("./constants");

const provider = new HDWalletProvider(
    'wool situate voice lazy treat power near approve maximum term loud alpha',
    'https://rinkeby.infura.io/v3/442c04d8ad06479e81218bb9c101d412'
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    const account_deploy = accounts[0];

    console.log("Attemping to deploy from account ", account_deploy);

   const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [constants.INITIAL_MESSAGE]})
    .send({gas: '1000000', from : account_deploy});

    console.log("Contract deployed to ", result.options.address); //result.options.address
}

deploy();
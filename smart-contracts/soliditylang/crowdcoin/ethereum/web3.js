import Web3 from "web3";
const { your_own_endpoint } = require("./config");

let web3;
//check to see if in browser and check to see if metamask has already injected 
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    //in the browser and metamask is running

    //use provider provided by metamask in window
    web3 = new Web3(window.web3.currentProvider);
}else{
    //We are on the server (not on the browser) or user is not running metamask
    //We setup our own provider that connects to the rinkeby test network through infura
    const provider = new Web3.providers.HttpProvider(
        your_own_endpoint
    );

    web3 = new Web3(provider);
}
export default web3;
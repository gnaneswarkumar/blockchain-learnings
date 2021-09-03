import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const { deployed_address} = require("./config");

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    deployed_address
);

export default instance;
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

//Delete entire build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

//read Campain.sol from contracts folder
const campainPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campainPath, 'utf8');

//Compile contracts with solidity compiler
const output = solc.compile(source, 1).contracts;

//recreate build folder
fs.ensureDirSync(buildPath); //ensureDirSync checks to see if the directory exists. if not exists, it will create

//Write output to the build directory
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(/:/g,'') + '.json'), //remove colon, problem with windows
        output[contract]
    );
}

/**
 * run compiler
 *  cd ethereum
 *  node compile.js
 */
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const {interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy( {data: bytecode})
    .send({ from : accounts[0], gas: '1000000'});
});


describe('Lottery Contract', ()=>{
    it('deploys a lottery contract', ()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter as a player', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows accounts to enter as a player', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires minimum amount of ether to enter', async ()=>{
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200
            });
            assert(false);
        }catch(error){
            assert(error);
        }
    });

    it('should allow only manager to pick winner', async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from : accounts[1]
            });
            assert(false);
        }catch(error){
            assert(error);
        }
    });

    it('sends money to the winner and resets players', async ()=>{
        //account entering as a player by sending 2 ether
        await lottery.methods.enter().send({
            from : accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        //pick winner should allot the money to winner, 
        //meaning accounts[0] will receive money back in this scenario
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        //roughly considering the gas utilized for above transaction
       assert(difference > web3.utils.toWei('1.8', 'ether'));

       const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
       assert.equal(0, players.length);

       //contract balance becomes '0' once transferred to winner
       const balance = await lottery.methods.getBalance().call();
        assert.equal(0, balance);
    });
});
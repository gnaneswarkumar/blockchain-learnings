import "./App.css";
import React from "react";

import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = { manager: "", players: [], balance: "", value: "" };

  async componentDidMount() {
    //Don't need to specify the 'from' field when working with and using metamask provider. Will take first account from metamask logged in the browser in this case
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();

    this.setState({message: "Wait while we let you in..! A nice fancy loader will come in real project ba...!"});

    //Writing data to the contract
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({message: "You entered the lottery ba..! Wait for the results and checkout your luck leh..!"});

    //Reading data from contract
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ players, balance });
  }

  pickWinner = async() => {
    const accounts = await web3.eth.getAccounts();

    console.log("accounts==>", accounts);

    this.setState({message: "Picking the winner..! A nice fancy loader will come in real project ba...!"});
    
    await lottery.methods.pickWinner().send({gas: '3000000', from: accounts[0]});
    this.setState({message: "Winner picked and money credited to winner..! Go check account balance..!"});

    //Reading data from contract to update players and balance
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ players, balance });
  }

  render() {

    //Just keeping below console.log comments for reference
    //console.log("web3.version", web3.version);
    //web3.eth.getAccounts().then(console.log);

    return (
      <div className="App App-header">
       
          <h2>Lottery Contract</h2>
          <p>
            This contract is managed by {this.state.manager}.<br />
            There  are  currently {this.state.players.length} players<br />
            Price money accumulated: {web3.utils.fromWei(this.state.balance, "ether")} ether!
          </p>
       <hr />
       <form onSubmit={this.onSubmit}>
         <h4>Lottery Contract Form: </h4>
         <div>
           <label>Amount (in ether) to enter: </label>
           <input 
            value={this.state.value}
            onChange={event=>this.setState({value: event.target.value})} 
          />
         </div><br />
         <button>Enter</button>
       </form>

       <hr />
      <h4>Pick a winner: </h4>
       <button onClick={this.pickWinner}>Pick a winner</button>
       <hr />
      <h1>{this.state.message} </h1>


      </div>
    );
  }
}
export default App;

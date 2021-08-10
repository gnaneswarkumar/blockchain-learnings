pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    /**
    takes some amount of time to process actual transaction. the amount of time it takes to pick, can solve a block or close that block is referred to as block difficulty. this is represented as an integer and is a large number
     */
    function random() private view returns (uint) {
        // keccak256 - instance of sha3 algorithmx
        return uint(keccak256(block.difficulty, now, players));
    }

    function getBalance() public view returns (uint) {
        return this.balance;
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0); //recreates brand new dynamic array of type address
    }
    /**
        Function modifiers are used as a means of reducing the amount of code. i.e. handle code duplication
     */
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}   
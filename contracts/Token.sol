//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

//ERC-20 Standard
//https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

contract Token {
    //this is a state variable, belongs to entire smart contract
    //adding public will create a getter
    string public name;
    string public symbol;
    uint256 public decimals = 18; //same as eth, 18x 0s after decimal

    //NOTE: million tokens, use math instead of storing the lowest amount of gwei
    //NOTE: Solidy does not use decimals at all
    uint256 public totalSupply; //1,000,000. * 10^18

    //track balances - hashtable data structure key/value
    mapping(address => uint256) public balanceOf;

    //track allowances
    //adds a key of the owner address and returns a mapping of the spenders token amounts
    mapping(address => mapping(address => uint256)) public allowance;

    //required by the ERC 20 standard, must emit and event in the transfer function
    //indexed means it will be easier to filter events
    event Transfer(
        address indexed from, 
        address indexed to, 
        uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    //NOTE: unit256 will default to memory so no need to declare the storage location but is required for string
    //byte32 may be better to use that string to save on gas
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);

        //store on the blockchain in the hashtable which is sort of like a database on the blockchain
        //msg.sender is an address, msg is a global variable, this is the address of the person calling
        //the function or in this case the user deploying will be the msg.sender in the constructor

        //NOTE: By default hardhat will use the 1st test account as the deployment account
        balanceOf[msg.sender] = totalSupply;
    }

    /**
        Transfer from the callers wallet to an address
     */
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        //send must have available funds
        require(balanceOf[msg.sender] >= _value, "Insufficient Funds");

        //must be valid address
        //TODO: I think there are move validations since I was able to pass less 0s and test passed
        require(_to != address(0));

        //Deduct tokens from spender
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;

        //Credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        //emit event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    //same signature as the ERC-20
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        
        require(_spender != address(0));

        //this is how to set a nested mapping
        //msg.sender is the owner
        allowance[msg.sender][_spender] = _value;

        //emit event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }
}

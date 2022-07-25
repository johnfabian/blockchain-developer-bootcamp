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
    }
}

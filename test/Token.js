const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {

    it("Has a name", async () => {
       
        //get contract
        const Token = await ethers.getContractFactory("Token");

        //deploy
        let token = await Token.deploy();

        //read the token from block chain
        const name = await token.name();        

        //check that name is correct
        expect(name).to.equal("My Token");

    });
});
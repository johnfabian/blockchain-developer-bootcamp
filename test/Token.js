const { expect } = require("chai");
const { ethers } = require("hardhat");

const getEtherAmountInWei = (ethAmount) => {
    //use https://eth-converter.com/ to get the value in wei of 1,000,000 tokens
    //or use ethers.js    
    return ethers.utils.parseUnits(ethAmount.toString(), 'ether');
}


describe("Token", () => {

    let token;
    const name = "Dapp University";
    const symbol = "DAPP";
    const totalSupply = 1000000;
    const decimals = "18"

    //setup test, runs before each test below
    beforeEach(async () => {
        //get contract
        const Token = await ethers.getContractFactory("Token");

        //deploy, NOTE :This will run the constructor
        token = await Token.deploy(name, symbol, totalSupply.toString());

    });


    describe("Deployment", () => {

        //name
        it("Has correct name", async () => {
            //check that name is correct
            expect(await token.name()).to.equal(name);

        });

        // symbol
        it("Has correct symbol", async () => {
            //check that name is correct
            expect(await token.symbol()).to.equal(symbol);
        });

        //decimals
        it("Has correct decimals", async () => {
            //check that name is correct
            expect(await token.decimals()).to.equal(decimals);
        });

        //total supply
        it("Has correct totalSupply", async () => {

            //check that name is correct
            expect(await token.totalSupply()).to.equal(getEtherAmountInWei(totalSupply.toString()));
        });


    })







});
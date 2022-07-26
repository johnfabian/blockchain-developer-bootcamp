const { expect } = require("chai");
const { ethers } = require("hardhat");

const getEtherAmountInWei = (ethAmount) => {
    //use https://eth-converter.com/ to get the value in wei of 1,000,000 tokens
    //or use ethers.js    
    return ethers.utils.parseUnits(ethAmount.toString(), 'ether');
}


describe("Token", () => {

    let token, accounts, deployer;

    //setup test, runs before each test below
    beforeEach(async () => {
        //get contract
        const Token = await ethers.getContractFactory("Token");

        //deploy, NOTE :This will run the constructor
        token = await Token.deploy('Dapp University', 'DAPP', '1000000');

        accounts = await ethers.getSigners();
        deployer = accounts[0];

    });


    describe("Deployment", () => {
        const name = "Dapp University";
        const symbol = "DAPP";
        const totalSupply = getEtherAmountInWei("1000000");
        const decimals = "18"

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
            expect(await token.totalSupply()).to.equal(totalSupply);
        });


        it("Assigns total supply to deploy", async () => {

            //by default, hardhat will set the deployer will be the first test account 
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
        });


    })







});
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { result } = require("lodash");

const tokens = (ethAmount) => {
    //use https://eth-converter.com/ to get the value in wei of 1,000,000 tokens
    //or use ethers.js    
    return ethers.utils.parseUnits(ethAmount.toString(), 'ether');
}


describe("Token", () => {

    let token, accounts, deployer, receiver, exchange;

    //setup test, runs before each test below
    beforeEach(async () => {
        //get contract
        const Token = await ethers.getContractFactory("Token");

        //deploy, NOTE :This will run the constructor
        token = await Token.deploy('Dapp University', 'DAPP', '1000000');

        accounts = await ethers.getSigners();
        deployer = accounts[0]; //deployer account is the first test account by default
        receiver = accounts[1]; //receiver account
        exchange = accounts[2]; //exchange account

    });


    describe("Deployment", () => {
        const name = "Dapp University";
        const symbol = "DAPP";
        const totalSupply = tokens("1000000");
        const decimals = "18"

        //name
        it("has correct name", async () => {
            //check that name is correct
            expect(await token.name()).to.equal(name);

        });

        // symbol
        it("has correct symbol", async () => {
            //check that name is correct
            expect(await token.symbol()).to.equal(symbol);
        });

        //decimals
        it("has correct decimals", async () => {
            //check that name is correct
            expect(await token.decimals()).to.equal(decimals);
        });

        //total supply
        it("has correct totalSupply", async () => {

            //check that name is correct
            expect(await token.totalSupply()).to.equal(totalSupply);
        });


        it("assigns total supply to deploy", async () => {

            //by default, hardhat will set the deployer will be the first test account 
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
        });

    })


    describe("Sending Tokens", () => {

        describe("Success", () => {

            let amount, transaction, result;

            beforeEach(async () => {               

                amount = tokens(100);
                transaction = await token.connect(deployer).transfer(receiver.address, amount);
                
                //wait till transaction completes
                result = await transaction.wait();
            });

            it("transfers token balances", async () => {
                //ensure tokens were transferred
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
                expect(await token.balanceOf(receiver.address)).to.equal(amount);
            });

            it("emits an transfer event", async () => {

                const event = result.events[0];
                expect(event.event).to.equal("Transfer");

                const args = event.args;
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value).to.equal(amount);
            });

        });


        describe("Failure", () => {

            let amount, transaction

            it("rejects insufficent balances", async () => {

                //transfer more tokens than deployers has
                const invalidAmount = tokens(1000000000);
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted

            });

            it("rejects invalid recipient", async () => {

                //transfer more tokens than deployers has
                const amount = tokens(100);
                await expect(token.connect(deployer).transfer("0x0000000000000000000000000000000000000000", amount)).to.be.reverted

            });



        });


    });


    describe("Approving Tokens", () => {

        let amount, transaction, result;

        beforeEach(async () => {
            amount = tokens(100);
            transaction = await token.connect(deployer).approve(exchange.address, amount);           
            result = await transaction.wait();
        });

        describe("Success", () => {

            it("allocates an allowance for delegated token spending", async () => {               
                expect(await token.allowance(deployer.address,exchange.address)).to.equal(amount);                
            });

            it("emits an Approval event", async () => {

                const event = result.events[0];
                expect(event.event).to.equal("Approval");

                const args = event.args;
                console.log(args);
                expect(args.owner).to.equal(deployer.address);
                expect(args.spender).to.equal(exchange.address);
                expect(args.value).to.equal(amount);
            });


        });

        describe("Failure", () => {
            it("rejects invalid spenders", async()=>{
                await expect(token.connect(deployer).approve("0x0000000000000000000000000000000000000000", amount)).to.be.reverted;
            });

        });

    });

    describe("Delegated Token Transfers", () => {

        let amount, transaction, result;

        beforeEach(async () => {
            amount = tokens(100);

            //Step 1: approve first, the deployer approves the exhange in said amount
            transaction = await token.connect(deployer).approve(exchange.address, amount);           
            result = await transaction.wait();
        });

        describe("success", ()=>{

            beforeEach(async () => {
                   
                //the exchange transfers from the deployer to the reciever
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount);           
                result = await transaction.wait();
            });

            it('should allow the exchange to transfer from deployer to receiver', async()=> {

                expect(await token.balanceOf(deployer.address)).to.be.equal(tokens(999900));
                expect(await token.balanceOf(receiver.address)).to.be.equal(amount);

            });

            it('resets the allowance',async()=>  {
                expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0);

            });

            it("emits an transfer event", async () => {

                const event = result.events[0];
                expect(event.event).to.equal("Transfer");

                const args = event.args;
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value).to.equal(amount);
            });

        })

        describe("failure", ()=>{

            it('Rejects insufficient amounts', async () => {
                const invalidAmount = tokens(100000000)
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
            });

        })

    });




});
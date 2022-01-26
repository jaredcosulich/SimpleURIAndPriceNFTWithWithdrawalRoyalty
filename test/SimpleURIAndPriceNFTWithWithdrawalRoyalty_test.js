const { expect } = require('chai');
const { ethers } = require("hardhat");
const { constants } = ethers;

const SimpleURIAndPriceNFTWithWithdrawalRoyalty = artifacts.require('SimpleURIAndPriceNFTWithWithdrawalRoyalty');

contract('SimpleURIAndPriceNFTWithWithdrawalRoyalty', function ([ owner, other, other2 ]) {
  const price = constants.WeiPerEther.div(5) // 0.2 ETH
  const baseURI = "https://arweave.net"
  const tokenHash1 = "ar_weave_hash_1"
  const tokenHash2 = "ar_weave_hash_2"

  let contract;
  let response;
  let response2;

  beforeEach(async function () {
    contract = await SimpleURIAndPriceNFTWithWithdrawalRoyalty.new(
      "SimpleURIAndPriceNFTWithWithdrawalRoyalty",
      "SIM",
      "https://arweave.net",
      price, 
      { from: owner }
    );
    response = await contract.mint(tokenHash1, { from: other, value: price.toString() })
    response2 = await contract.mint(tokenHash2, { from: other2, value: price.toString() })
  });

  it('should work', () => {
    expect(response.tx).not.to.be.undefined;
    expect(response2.tx).not.to.be.undefined;
  })

  it("should increment the token", () => {
    const tokenId = response.logs[0].args.tokenId;
    const tokenId2 = response2.logs[0].args.tokenId;

    expect(tokenId.toString()).to.equal("1")
    expect(tokenId2.toString()).to.equal("2")
  })

  it("should assign the token to the minter", async () => {
    const tokenId = response.logs[0].args.tokenId;
    const tokenId2 = response2.logs[0].args.tokenId;

    const ownerOfToken = await contract.ownerOf(tokenId)
    expect(ownerOfToken).to.equal(other);

    const ownerOfToken2 = await contract.ownerOf(tokenId2)
    expect(ownerOfToken2).to.equal(other2);
  })

  it('should generate the correct tokenURI on minting', async () => {
    const tokenURI1 = await contract.tokenURI(1)
    expect(tokenURI1).to.equal(`${baseURI}${tokenHash1}`)
    
    const tokenURI2 = await contract.tokenURI(2)
    expect(tokenURI2).to.equal(`${baseURI}${tokenHash2}`)
  })

  it('should collect the revenue from both mintings', async () => {
    const balance = await contract.balanceReceived({ from: owner })
    expect(balance.toString()).to.equal(price.mul(2).toString())
  })
})
const { expect } = require('chai');
const { expectEvent } = require('@openzeppelin/test-helpers');

const URIMintMock = artifacts.require('URIMintMock');

contract('AbstractURIMint', ([ owner, other, other2 ]) => {
  let contract, response1, response2;

  beforeEach(async () => {
    contract = await URIMintMock.new(
      "MyContract",
      "MCC",
      "https://arweave.net/", 
      { from: owner }
    );
    response1 = await contract.mint("arweave_hash_value1", { from: other })
    response2 = await contract.mint("arweave_hash_value2", { from: other2 })
  })
  
  it("properly constructs the full token uri on minting", async () => {
    const nonIndexURI = "https://arweave.net/arweave_hash_value"
    const tokenURI1 = await contract.tokenURI(1)
    expect(tokenURI1).to.equal(`${nonIndexURI}1`)

    const tokenURI2 = await contract.tokenURI(2)
    expect(tokenURI2).to.equal(`${nonIndexURI}2`)
  })

  it("emits a minted event", async () => {
    expectEvent(response1, 'Minted', {
      tokenId: "1",
      to: other,
      uri: "https://arweave.net/arweave_hash_value1"
    })

    expectEvent(response2, 'Minted', {
      tokenId: "2",
      to: other2,
      uri: "https://arweave.net/arweave_hash_value2"
    })
  })

})
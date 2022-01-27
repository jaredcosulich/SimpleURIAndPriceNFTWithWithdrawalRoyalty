const { expect } = require('chai');
const { ethers } = require("hardhat");
const { constants } = ethers;
const { expectRevert, balance } = require('@openzeppelin/test-helpers');

const PriceMock = artifacts.require('PriceMock');

contract('AbstractPrice', ([owner, other, other2]) => {
  const price = constants.WeiPerEther.div(10) // 0.1 ETH

  let contract;

  beforeEach(async () => {
    contract = await PriceMock.new(
      price,
      { from: owner }
    );
  });

  describe('with an invalid amount', () => {
    it('should fail', async () => {
      const belowMinPrice = constants.WeiPerEther.div(100); // 0.01 ETH
      await expectRevert(
        contract.mint({
          from: other,
          value: belowMinPrice.toString()
        }),
        "Insufficient funds",
      );
    })
  })

  describe('with a valid amount', () => {
    let balanceTracker;

    beforeEach(async function () {
      balanceTracker = await balance.tracker(other, 'wei');
      await contract.mint({
        from: other,
        value: price.toString()
      });
    });

    it('should deduct the mint price from the minting wallet', async () => {
      const { delta, fees } = await balanceTracker.deltaWithFees();
      const priceBN = price.mul(-1);
      const deltaNoFees = delta.add(fees);
      expect(deltaNoFees).to.bignumber.equal(priceBN.toString());
    })

    describe("with multiple minters", () => {
      beforeEach(async () => {
        await contract.mint({
          from: other2,
          value: price.toString()
        });
      })

      it('should properly tally all incoming revenue', async () => {
        const balanceReceived = await contract.balanceReceived({ from: owner });
        expect(balanceReceived).to.bignumber.equal(price.mul(2).toString());
      })

      it('should not allow anyone but the owner to query the balanceReceived', async () => {
        await expectRevert(
          contract.balanceReceived({ from: other }),
          "Ownable: caller is not the owner",
        );
      })

      it('should allow owner to set mint price', async () => {
        const newMintPrice = 5000;
        await contract.setMintPrice(newMintPrice);

        const price = await contract.mintPrice().then(bn => bn.toNumber());
        expect(price).equal(newMintPrice);
      });

      it('should not allow anyone but the owner to set the mint price', async () => {
        await expectRevert(
          contract.setMintPrice(1000, { from: other }),
          "Ownable: caller is not the owner",
        );
      })
    })
  })
})
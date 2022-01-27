const { expect } = require('chai');
const { ethers } = require("hardhat");
const { constants } = ethers;
const { balance, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const NodPriceAndWithdrawalMock = artifacts.require('NodPriceAndWithdrawalMock');

contract('AbstractNodPriceAndWithdrawal', ([ owner, nod, other, other2 ]) => {
  const price = constants.WeiPerEther.div(10) // 0.1 ETH
  const royaltyPercentage = 3;
    
  let contract, royalty, takeHome;
  beforeEach(async () => {
    contract = await NodPriceAndWithdrawalMock.new(
      price, 
      nod,
      { from: owner }
    );
    contract.mint({ from: other, value: price.toString() });
    contract.mint({ from: other2, value: price.toString() });

    totalRevenue = price.mul(2)
    royalty = totalRevenue.mul(royaltyPercentage).div(100);
    takeHome = totalRevenue.sub(royalty);
  });

  it('sends the royalty percentage to the NodLabs account on withdrawal', async () => {
    const nodBalanceTracker = await balance.tracker(nod, 'wei');
    const ownerBalanceTracker = await balance.tracker(owner, 'wei');

    await contract.withdraw({ from: owner });

    const ownerChange = await ownerBalanceTracker.deltaWithFees();
    const ownerDeltaNoFees = ownerChange.delta.add(ownerChange.fees);
    expect(ownerDeltaNoFees).to.bignumber.equal(takeHome.toString());

    const royaltyChange = await nodBalanceTracker.deltaWithFees();
    expect(royaltyChange.delta).to.bignumber.equal(royalty.toString());  
    expect(royaltyChange.fees).to.bignumber.equal("0");
  })

  it("doesn't allow a withdrawal if there are no funds left", async () => {
    await contract.withdraw({ from: owner });
    await expectRevert(
      contract.withdraw({ from: owner }),
      "No funds to withdraw",
    ); 
  })

  it("emits events recording the withdrawal and royalty payment", async () => {
    const receipt = await contract.withdraw({ from: owner });
    expectEvent(receipt, "Withdrawal", { 
      recipient: owner,
      value: takeHome.toString()
    })
    expectEvent(receipt, "Withdrawal", { 
      recipient: nod,
      value: royalty.toString()
    })
  })

  it('only allows the owner to withdraw', async () => {
    await expectRevert(
      contract.withdraw({ from: other }),
      "Ownable: caller is not the owner",
    );      
  })

  it('should not allow an address that is not the nod address to update the nod payout address', async () => {
    await expectRevert(
      contract.updateNodPayoutAddress(other, { from: owner }),
      "Access denied to update nod payout address",
    );
  })

  it('should allow the Nod address to update the nod payout address', async () => {
    contract.updateNodPayoutAddress(other, { from: nod });
    
    const payoutAddress = await contract.nodPayoutAddress();

    expect(payoutAddress).equal(other);
  })
})
const { expect } = require('chai');
const { ethers } = require("hardhat");
const { constants } = ethers;
const { balance, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const NodPriceAndWithdrawalMock = artifacts.require('NodPriceAndWithdrawalMock');

contract('AbstractNodPriceAndWithdrawal', ([ owner, other, other2 ]) => {
  const price = constants.WeiPerEther.div(10) // 0.1 ETH
  const royaltyPercentage = 3;
  const nodAddress = "0xEFE523bB4b55cc316A3fe528ab0E8987Eaa3D97e";
    
  let contract, royalty, takeHome;
  beforeEach(async () => {
    contract = await NodPriceAndWithdrawalMock.new(
      price, 
      { from: owner }
    );
    contract.mint({ from: other, value: price.toString() });
    contract.mint({ from: other2, value: price.toString() });

    totalRevenue = price.mul(2)
    royalty = totalRevenue.mul(royaltyPercentage).div(100);
    takeHome = totalRevenue.sub(royalty);
  });

  it('sends the royalty percentage to the NodLabs account on withdrawal', async () => {
    const nodBalanceTracker = await balance.tracker(nodAddress, 'wei');
    const ownerBalanceTracker = await balance.tracker(owner, 'wei');

    await contract.withdraw({ from: owner });

    const ownerChange = await ownerBalanceTracker.deltaWithFees();
    const ownerDeltaNoFees = ownerChange.delta.add(ownerChange.fees);
    expect(ownerDeltaNoFees).to.bignumber.equal(takeHome.toString());

    const royaltyChange = await nodBalanceTracker.deltaWithFees();
    expect(royaltyChange.delta).to.bignumber.equal(royalty.toString());  
    expect(royaltyChange.fees).to.bignumber.equal("0");
  })

  it("emits events recording the withdrawal and royalty payment", async () => {
    const receipt = await contract.withdraw({ from: owner });
    expectEvent(receipt, "Withdrawal", { 
      recipient: owner,
      value: takeHome.toString()
    })
    expectEvent(receipt, "Withdrawal", { 
      recipient: nodAddress,
      value: royalty.toString()
    })
  })

  it('only allows the owner to withdraw', async () => {
    await expectRevert(
      contract.withdraw({ from: other }),
      "Ownable: caller is not the owner",
    );      
  })
})
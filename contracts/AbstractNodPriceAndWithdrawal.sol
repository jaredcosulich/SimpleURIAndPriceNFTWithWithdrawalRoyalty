// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./AbstractPrice.sol";

abstract contract AbstractNodPriceAndWithdrawal is AbstractPrice {
    event Withdrawal(address recipient, uint value);
   
    address payable constant NOD_ADDRESS = payable(0xEFE523bB4b55cc316A3fe528ab0E8987Eaa3D97e);
    uint constant FULL_AMOUNT = 10000;
    uint constant ROYALTY_PERCENTAGE = 300;

    constructor(uint _price) AbstractPrice(_price) {}

    function withdraw() public onlyOwner {
        require(balanceReceived() > 0, "No funds to withdraw");

        uint royalty = balanceReceived() * ROYALTY_PERCENTAGE / FULL_AMOUNT;
        uint takeHome = balanceReceived() - royalty;

        (bool royaltySuccess, ) = NOD_ADDRESS.call{value: royalty}("");
        (bool withdrawSuccess, ) = _msgSender().call{value: takeHome}("");
        require(royaltySuccess && withdrawSuccess, "Withdrawal failed");
        
        emit Withdrawal(_msgSender(), takeHome);
        emit Withdrawal(NOD_ADDRESS, royalty);
    }
}

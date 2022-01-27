// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./AbstractPrice.sol";

abstract contract AbstractNodPriceAndWithdrawal is AbstractPrice {
    event Withdrawal(address recipient, uint256 value);

    address payable public nodPayoutAddress =
        payable(0xEFE523bB4b55cc316A3fe528ab0E8987Eaa3D97e);
    uint256 constant FULL_AMOUNT = 10000;
    uint256 constant ROYALTY_PERCENTAGE = 300;

    constructor(uint256 _price) AbstractPrice(_price) {}

    function updateNodPayoutAddress(address newAddress) public {
        require(
            _msgSender() == nodPayoutAddress,
            "Access denied to update nod payout address"
        );
        nodPayoutAddress = payable(newAddress);
    }

    function withdraw() public onlyOwner {
        require(balanceReceived() > 0, "No funds to withdraw");

        uint256 royalty = (balanceReceived() * ROYALTY_PERCENTAGE) /
            FULL_AMOUNT;
        uint256 takeHome = balanceReceived() - royalty;

        (bool royaltySuccess, ) = nodPayoutAddress.call{value: royalty}("");
        (bool withdrawSuccess, ) = _msgSender().call{value: takeHome}("");
        require(royaltySuccess && withdrawSuccess, "Withdrawal failed");

        emit Withdrawal(_msgSender(), takeHome);
        emit Withdrawal(nodPayoutAddress, royalty);
    }
}

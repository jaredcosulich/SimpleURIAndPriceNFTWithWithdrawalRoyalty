// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract AbstractPrice is Ownable {
    uint256 public mintPrice;

    constructor(uint256 priceInWei) {
        mintPrice = priceInWei;
    }

    function balanceReceived() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function _receivePrice() internal {
        require(msg.value >= mintPrice, "Insufficient funds");
    }
}
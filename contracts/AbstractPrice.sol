// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract AbstractPrice is Ownable {
    uint256 public mintPrice;
    uint256 internal _balanceReceived;

    constructor(uint256 priceInWei) {
        mintPrice = priceInWei;
    }

    function balanceReceived() public view onlyOwner returns (uint256) {
        return _balanceReceived;
    }

    function _receivePrice() internal {
        require(msg.value >= mintPrice, "Insufficient funds");

        _balanceReceived += msg.value;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../AbstractPrice.sol";

contract PriceMock is AbstractPrice {
    constructor(uint256 _price) AbstractPrice(_price) {}

    function mint() requirePrice public payable {}
}

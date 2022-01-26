// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../AbstractNodPriceAndWithdrawal.sol";

contract NodPriceAndWithdrawalMock is AbstractNodPriceAndWithdrawal {
    constructor(uint256 _price) AbstractNodPriceAndWithdrawal(_price) {}

    function mint() public payable {
      _receivePrice();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../AbstractNodPriceAndWithdrawal.sol";

contract NodPriceAndWithdrawalMock is AbstractNodPriceAndWithdrawal {
    constructor(uint256 _price, address nod)
        AbstractNodPriceAndWithdrawal(_price)
    {
        nodPayoutAddress = payable(nod);
    }

    function mint() requirePrice public payable {}
}

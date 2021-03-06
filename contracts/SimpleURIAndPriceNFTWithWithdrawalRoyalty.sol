// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./AbstractURIMint.sol";
import "./AbstractNodPriceAndWithdrawal.sol";

contract SimpleURIAndPriceNFTWithWithdrawalRoyalty is AbstractURIMint, AbstractNodPriceAndWithdrawal {
    constructor(string memory name, string memory symbol, string memory baseURI, uint256 priceInWei)
        AbstractURIMint(name, symbol, baseURI)
        AbstractNodPriceAndWithdrawal(priceInWei)
    {}

    function mint(string memory tokenURI) requirePrice public payable returns (uint256) {
        return _mintNextToken(tokenURI);
    }
}

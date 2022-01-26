// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../AbstractURIMint.sol";

contract URIMintMock is AbstractURIMint {
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) AbstractURIMint(name, symbol, baseURI) {}

    function mint(string memory tokenURI) public payable returns (uint256) {
        return _mintNextToken(tokenURI);
    }
}

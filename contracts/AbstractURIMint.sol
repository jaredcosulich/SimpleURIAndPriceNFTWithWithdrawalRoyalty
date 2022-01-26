// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract AbstractURIMint is ERC721URIStorage {
    event Minted(address indexed to, uint256 indexed tokenId, string uri);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    string private _baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function _mintNextToken(string memory tokenURIPath)
        internal
        returns (uint256)
    {
        _tokenIdTracker.increment();
        uint256 tokenId = _tokenIdTracker.current();
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, tokenURIPath);
        emit Minted(_msgSender(), tokenId, tokenURI(tokenId));
        return tokenId;
    }
}

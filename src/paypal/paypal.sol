// SPDX-License-Identifier: Unlicensed

pragma solidity >=0.7.0;

contract paypal {
    event transactions(address indexed from, address to, uint amount, string symbol);
    event recipeints(address indexed reecipientOf, address recipient, string recipientName);

    function _transfer(address payable _to, string memory symbol) public payable {
        _to.transfer(msg.value);
        emit transactions(msg.sender, _to, msg.value, symbol);
    }

    function saveTx(address from, address to, uint amount, string memory symbol) public {
        emit transactions(from, to, amount, symbol);
    }

    function addRecipient(address recipient, string memory name) public {
        emit recipeints(msg.sender, recipient, name);
    } 
}

// 0x9Ad232e2D3812d5E915B864119f8212D51BFB9F5 - polygon
// 0xa02b2CCE714f874AD7593f50012c5d3756BF2773 - Ropsten
// 0x6170b96101557cc11F076AA3907f7FF87Db54EE7 - Rinkeby

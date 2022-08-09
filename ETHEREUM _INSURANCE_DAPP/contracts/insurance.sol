// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract insurance is ERC1155
{
     using Counters for Counters.Counter;
    Counters.Counter public _itemsSold;

    using SafeMath for uint256;
    string public constant name = "NFTINSURANCE";
    string public constant symbol = "NFT";
    bool   public revealed = false;
    string public baseURI = "ipfs://THISISTHECID/";

    uint256 public totalSupply = 0;
    uint256 public constant PriceInEth = 1 ether;

    uint256[] minted = [0, 0, 0];
    uint256 public remaingtoken;
    uint256 public saleClose;

    struct Person 
    {
        uint256 tkid;
        uint256 amt;
        address user;
        bool exists;
    }
    Person[] persons;
    address admin;
    address[] public req_address;
    address[] public bulk_address;
    string [] public bulk_ipfs;


    mapping(address => Person) mappedperson;
    mapping(address => bool) public userAddress;
    mapping(address => string)public ipfsusers;

    modifier ownerOnly()
    {
        require(msg.sender == admin);
        _;
    }

    event approveclaimevent(address indexed owner, address indexed spender, uint256 value);


    constructor (string memory uri) payable ERC1155(uri)
    {
        admin = msg.sender;
    }

    function mint(uint256 tkid,uint256 amt,address user)payable public
    {
        require(msg.value == PriceInEth.mul(amt), "Not have enough ether");
        user=msg.sender;

        mappedperson[user]=Person(tkid,amt,user,true);
        Person memory person = Person(tkid,amt,user,true);

        uint256 index = tkid -1;
        _mint(msg.sender,tkid,amt,"");
        minted[index] += amt;
        
        persons.push(person);
        
        _itemsSold.increment();

    }

    function decode(bytes calldata data)public returns(uint256 tkid,uint256 amt,address user,bool isminted)
    {
        (tkid,amt,user,isminted) = abi.decode(data,(uint256,uint256,address,bool));
        bulk_address.push(user);
        userAddress[user]= true;
    }

    function claim(string memory uploadFile)public
    {
        if(userAddress[msg.sender] =true)
        {
        ipfsusers[msg.sender] = uploadFile;
        bulk_ipfs.push(uploadFile);
        req_address.push(msg.sender);
        }

    }
    
    function amtto_user(address payable userads, uint256 cash) public   returns (bool)
    {
      userads.transfer(cash);
      emit approveclaimevent(msg.sender, userads, cash);
      return true;
    }

    function getReqClaims()public view returns (address[] memory, string[] memory)
    {
      address[] memory mAddress = new address[](req_address.length);
      string[] memory mipfs = new string[](req_address.length);
        for (uint256 i = 0; i < req_address.length; i++) {
            mAddress[i] = req_address[i];
            mipfs[i] = ipfsusers[req_address[i]];
        }
        return (mAddress, mipfs);
    }

    function _baseURI() internal view returns (string memory)
    {
        return baseURI;
    }

    function changeBaseURI(string memory baseURI_) public
    {
        baseURI = baseURI_;
    }

    function changeRevealed(bool _revealed) public
    {
        revealed = _revealed;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory)
    {
        string memory baseURI_ = _baseURI();

        if (revealed) {
            return
                bytes(baseURI_).length > 0
                    ? string(
                        abi.encodePacked(
                            baseURI_,
                            Strings.toString(tokenId),
                            ".json"
                        )
                    )
                    : "";
        } else {
            return string(abi.encodePacked(baseURI_, "hidden.json"));
        }
    }

    function getUnsolded() external view returns (uint256)
    {
        return remaingtoken;
    }

    function getBalance() public view returns (uint256)
    {
        return address(this).balance;
    }

    function withdrawMoney() public
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "not have enough balance");
        address payable to = payable(msg.sender);
        to.transfer(balance);
    }

}


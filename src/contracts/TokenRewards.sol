// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./UserProfile.sol";
import "./LessonManager.sol";

/**
 * @title TokenRewards
 * @dev ERC20 token for rewarding users' learning progress
 */
contract TokenRewards is ERC20, Ownable, ReentrancyGuard {
    UserProfile public userProfileContract;
    LessonManager public lessonManagerContract;
    
    uint256 public constant POINTS_TO_TOKEN_RATE = 100; // 100 points = 1 token
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    
    mapping(address => uint256) public lastClaimTimestamp;
    uint256 public constant CLAIM_COOLDOWN = 1 days;
    
    event TokensClaimed(address indexed user, uint256 amount);
    event ContractsUpdated(address userProfile, address lessonManager);

    constructor(
        address _userProfileContract,
        address _lessonManagerContract
    ) ERC20("Language Learning Token", "LLT") Ownable(msg.sender) {
        userProfileContract = UserProfile(_userProfileContract);
        lessonManagerContract = LessonManager(_lessonManagerContract);
    }

    function claimTokens() external nonReentrant {
        require(
            block.timestamp >= lastClaimTimestamp[msg.sender] + CLAIM_COOLDOWN,
            "Please wait for cooldown period"
        );
        
        // Get user's profile and calculate tokens
        (,, uint256 totalPoints,,) = userProfileContract.getProfile(msg.sender);
        uint256 tokensToMint = (totalPoints / POINTS_TO_TOKEN_RATE) * 10**18;
        
        require(tokensToMint > 0, "No tokens to claim");
        require(totalSupply() + tokensToMint <= MAX_SUPPLY, "Would exceed max supply");
        
        lastClaimTimestamp[msg.sender] = block.timestamp;
        _mint(msg.sender, tokensToMint);
        
        emit TokensClaimed(msg.sender, tokensToMint);
    }

    function updateContracts(
        address _userProfileContract,
        address _lessonManagerContract
    ) external onlyOwner {
        require(_userProfileContract != address(0), "Invalid user profile address");
        require(_lessonManagerContract != address(0), "Invalid lesson manager address");
        
        userProfileContract = UserProfile(_userProfileContract);
        lessonManagerContract = LessonManager(_lessonManagerContract);
        
        emit ContractsUpdated(_userProfileContract, _lessonManagerContract);
    }

    function getClaimCooldown(address _user) external view returns (uint256) {
        if (lastClaimTimestamp[_user] == 0) return 0;
        uint256 timeElapsed = block.timestamp - lastClaimTimestamp[_user];
        if (timeElapsed >= CLAIM_COOLDOWN) return 0;
        return CLAIM_COOLDOWN - timeElapsed;
    }
} 
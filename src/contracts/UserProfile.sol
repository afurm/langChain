// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title UserProfile
 * @dev Manages user profiles and progress in the language learning platform
 */
contract UserProfile is Ownable, ReentrancyGuard {
    struct Profile {
        string username;
        uint256 totalLessonsCompleted;
        uint256 totalPoints;
        uint256 lastActivityTimestamp;
        bool isActive;
    }

    mapping(address => Profile) public profiles;
    mapping(address => mapping(uint256 => bool)) public completedLessons;
    
    event ProfileCreated(address indexed user, string username);
    event LessonCompleted(address indexed user, uint256 lessonId, uint256 points);
    event PointsAwarded(address indexed user, uint256 points);

    constructor() Ownable(msg.sender) {}

    function createProfile(string memory _username) external {
        require(!profiles[msg.sender].isActive, "Profile already exists");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        profiles[msg.sender] = Profile({
            username: _username,
            totalLessonsCompleted: 0,
            totalPoints: 0,
            lastActivityTimestamp: block.timestamp,
            isActive: true
        });

        emit ProfileCreated(msg.sender, _username);
    }

    function completeLesson(uint256 _lessonId, uint256 _points) external nonReentrant {
        require(profiles[msg.sender].isActive, "Profile does not exist");
        require(!completedLessons[msg.sender][_lessonId], "Lesson already completed");

        completedLessons[msg.sender][_lessonId] = true;
        profiles[msg.sender].totalLessonsCompleted++;
        profiles[msg.sender].totalPoints += _points;
        profiles[msg.sender].lastActivityTimestamp = block.timestamp;

        emit LessonCompleted(msg.sender, _lessonId, _points);
        emit PointsAwarded(msg.sender, _points);
    }

    function getProfile(address _user) external view returns (Profile memory) {
        require(profiles[_user].isActive, "Profile does not exist");
        return profiles[_user];
    }

    function hasCompletedLesson(address _user, uint256 _lessonId) external view returns (bool) {
        return completedLessons[_user][_lessonId];
    }

    function updateUsername(string memory _newUsername) external {
        require(profiles[msg.sender].isActive, "Profile does not exist");
        require(bytes(_newUsername).length > 0, "Username cannot be empty");
        
        profiles[msg.sender].username = _newUsername;
    }
} 
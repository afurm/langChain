// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./UserProfile.sol";

/**
 * @title LessonManager
 * @dev Manages lesson content, progress tracking, and completion verification
 */
contract LessonManager is Ownable, ReentrancyGuard {
    struct Lesson {
        string contentHash;      // IPFS hash of lesson content
        uint256 difficulty;     // 1: Beginner, 2: Intermediate, 3: Advanced
        uint256 basePoints;     // Base points awarded for completion
        bool isActive;          // Whether the lesson is available
        uint256 createdAt;      // Timestamp when lesson was created
    }

    UserProfile public userProfileContract;
    mapping(uint256 => Lesson) public lessons;
    uint256 public totalLessons;
    
    event LessonCreated(uint256 indexed lessonId, string contentHash, uint256 difficulty);
    event LessonUpdated(uint256 indexed lessonId, string newContentHash);
    event LessonCompleted(address indexed user, uint256 indexed lessonId, uint256 points);

    constructor(address _userProfileContract) Ownable(msg.sender) {
        userProfileContract = UserProfile(_userProfileContract);
    }

    function createLesson(
        string memory _contentHash,
        uint256 _difficulty,
        uint256 _basePoints
    ) external onlyOwner {
        require(_difficulty >= 1 && _difficulty <= 3, "Invalid difficulty level");
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty");
        
        uint256 lessonId = totalLessons++;
        lessons[lessonId] = Lesson({
            contentHash: _contentHash,
            difficulty: _difficulty,
            basePoints: _basePoints,
            isActive: true,
            createdAt: block.timestamp
        });

        emit LessonCreated(lessonId, _contentHash, _difficulty);
    }

    function updateLesson(
        uint256 _lessonId,
        string memory _newContentHash
    ) external onlyOwner {
        require(lessons[_lessonId].isActive, "Lesson does not exist");
        require(bytes(_newContentHash).length > 0, "Content hash cannot be empty");

        lessons[_lessonId].contentHash = _newContentHash;
        emit LessonUpdated(_lessonId, _newContentHash);
    }

    function completeLesson(uint256 _lessonId) external nonReentrant {
        Lesson storage lesson = lessons[_lessonId];
        require(lesson.isActive, "Lesson does not exist or is inactive");
        
        // Calculate points based on difficulty
        uint256 points = lesson.basePoints * lesson.difficulty;
        
        // Record completion in UserProfile contract
        userProfileContract.completeLesson(_lessonId, points);
        
        emit LessonCompleted(msg.sender, _lessonId, points);
    }

    function getLessonDetails(uint256 _lessonId) external view returns (
        string memory contentHash,
        uint256 difficulty,
        uint256 basePoints,
        bool isActive,
        uint256 createdAt
    ) {
        Lesson storage lesson = lessons[_lessonId];
        require(lesson.isActive, "Lesson does not exist");
        
        return (
            lesson.contentHash,
            lesson.difficulty,
            lesson.basePoints,
            lesson.isActive,
            lesson.createdAt
        );
    }

    function deactivateLesson(uint256 _lessonId) external onlyOwner {
        require(lessons[_lessonId].isActive, "Lesson does not exist or is already inactive");
        lessons[_lessonId].isActive = false;
    }
} 
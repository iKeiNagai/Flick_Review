-- updated schema
DROP DATABASE IF EXISTS flickreview;
CREATE DATABASE flickreview;

USE flickreview;

CREATE TABLE users (
    username VARCHAR(45) PRIMARY KEY,
    firebase_uid VARCHAR(255),
    firstName VARCHAR(45),
    lastName VARCHAR(45),
    dob DATE,
    role VARCHAR(20),
    lastLogin TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(45),
    movieID INT NOT NULL,  -- TMDb Movie ID (Not a foreign key)
    text TEXT,
    rating INT,
    dateCreated TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP,
    dateModified TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) 
        ON DELETE CASCADE
);

CREATE TABLE likes (
    likeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    reviewId INT NOT NULL,
    dateLiked DATETIME NOT NULL 
        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) 
        ON DELETE CASCADE,
    FOREIGN KEY (reviewId) REFERENCES reviews(reviewId) 
        ON DELETE CASCADE,
    UNIQUE (username, reviewId)  -- Prevents duplicate likes from the same user on the same review
);

CREATE TABLE admin_actions (
    actionId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    adminUsername VARCHAR(45) NOT NULL,
    targetUsername VARCHAR(45),
    targetReviewId INT,
    actionType VARCHAR(50) NOT NULL,   
    actionTimestamp DATETIME NOT NULL 
        DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (adminUsername) REFERENCES users(username) 
        ON DELETE CASCADE,
    FOREIGN KEY (targetUsername) REFERENCES users(username) 
        ON DELETE SET NULL,
    FOREIGN KEY (targetReviewId) REFERENCES reviews(reviewId) 
        ON DELETE SET NULL
);

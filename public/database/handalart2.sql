CREATE DATABASE handalart;

USE handalart;

CREATE TABLE member(

	member_AuthId VARCHAR(50) NOT NULL,
    
    member_Password VARCHAR(50) NOT NULL,
    
    member_Email VARCHAR(50) NULL,
    
    member_DisplayName VARCHAR (50) NOT NULL,
    
    PRIMARY KEY(member_AuthId)
    
    # member_Birth DATE NULL
)ENGINE=InnoDB;

CREATE TABLE bucketlist(

	member_AuthId VARCHAR(50) NOT NULL,
    FOREIGN KEY (member_AuthId) REFERENCES member(member_AuthId)
    ON UPDATE CASCADE
    ON DELETE CASCADE, 
    
    bucketlist_Id INT UNSIGNED NOT NULL,
    INDEX(bucketlist_Id),
    
    bucketlist_Goal VARCHAR(100) NOT NULL,
    
    bucketlist_Limit DATE NOT NULL,
    
    bucketlist_Is_achieved ENUM('YET', 'ACHIEVED') NOT NULL,
    
    PRIMARY KEY(member_AuthId, bucketlist_Id),
    INDEX(bucketlist_Is_achieved)
    
)ENGINE=InnoDB;

CREATE TABLE mandal(

	member_AuthId VARCHAR(50) NOT NULL,
    FOREIGN KEY (member_AuthId) REFERENCES member(member_AuthId)
    ON UPDATE CASCADE
    ON DELETE CASCADE, 
    
    mandal_Id INT UNSIGNED NOT NULL,
    INDEX(mandal_Id),
    
    mandal_content VARCHAR(100) NOT NULL,
    
    bucketlist_Id INT UNSIGNED NULL,
	FOREIGN KEY(bucketlist_Id) REFERENCES bucketlist(bucketlist_Id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    
    PRIMARY KEY(member_AuthId, mandal_Id)

)ENGINE=InnoDB;

CREATE TABLE mandalSub(

	member_AuthId VARCHAR(50) NOT NULL,
    FOREIGN KEY (member_AuthId) REFERENCES member(member_AuthId)
	ON UPDATE CASCADE
    ON DELETE CASCADE, 
    
    mandal_Id INT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    
    mandalSub_Id INT UNSIGNED NOT NULL,
    INDEX(mandalSub_Id),
    
    mandalSub_Content VARCHAR(100) NULL,
    
    PRIMARY KEY(member_AuthId, mandal_Id, mandalSub_Id)
    
)ENGINE=InnoDB;

CREATE TABLE mandalDetail(

	member_AuthId VARCHAR(50) NOT NULL,
    FOREIGN KEY (member_AuthId) REFERENCES member(member_AuthId)
	ON UPDATE CASCADE
    ON DELETE CASCADE, 
    
    mandal_Id INT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    
    mandalSub_Id INT UNSIGNED NOT NULL,
    FOREIGN KEY(mandalSub_Id) REFERENCES mandalSub(mandalSub_Id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    
	mandalDetail_Content1 VARCHAR(50) NULL,
    
    mandalDetail_Content2 VARCHAR(50) NULL,
    
    mandalDetail_Content3 VARCHAR(50) NULL,
    
    mandalDetail_Content4 VARCHAR(50) NULL,
    
    mandalDetail_Content5 VARCHAR(50) NULL,
    
    mandalDetail_Content6 VARCHAR(50) NULL,
    
    mandalDetail_Content7 VARCHAR(50) NULL,
    
    mandalDetail_Content8 VARCHAR(50) NULL,
    
    PRIMARY KEY(member_AuthId, mandal_Id, mandalSub_Id)
    
)ENGINE=InnoDB;

CREATE TABLE calendar(

	member_AuthId VARCHAR(50) NOT NULL,
    FOREIGN KEY (member_AuthId) REFERENCES member(member_AuthId)
	ON UPDATE CASCADE
    ON DELETE CASCADE, 
    
    calendar_Id INT UNSIGNED NOT NULL,
    
    calendar_Start VARCHAR(100) NOT NULL,
    
    calendar_End  VARCHAR(100) NOT NULL,
    
    calendar_Title VARCHAR(100) NOT NULL,
    
    calendar_AllDay VARCHAR(100) NOT NULL,
    
    PRIMARY KEY(member_AuthId, calendar_Id)
    
)ENGINE=InnoDB;
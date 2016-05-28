# Create database and its tables that come from project Mandalart.

# Column naming rule : table_name_Column_name

# Table List (PRIMARY KEY) / INDEX (except for FOREIGN KEYs)
#	member_group	(member_group_Id)
#	member			(member_Id) / member_group_Id  # exception : it is indexed in table member
#	calendar		(member_Id, calendar_Year, calendar_Month, calendar_Date, calendar_Start_time, calendar_End_time) / calendar_Year, calendar_Month, calendar_Date, calendar_Start_time, calendar_End_time
#	bucketlist		(member_Id, bucketlist_Id, bucketlist_Is_achieved) / bucketlist_Id, bucketlist_Is_achieved, bucketlist_When
#	mandal			(member_Id, mandal_Id) / mandal_Id
#	mandal_sub		(member_Id, mandal_Id, mandal_sub_Id) / mandal_sub_Id
# 	mandal_detail	(member_Id, mandal_Id, mandal_sub_Id, mandal_detail_Id) / mandal_detail_Id

# NULL option gived columns (except for FOREIGN KEYs)
#	member_group_Count
#	member_Birth
#	mandal_detail_content


CREATE DATABASE handalart;
USE handalart;

CREATE TABLE member_group
(
	member_group_Id		TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(member_group_Id),
    member_group_Name	VARCHAR(10) NOT NULL,
    member_group_Count	INT UNSIGNED NULL
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE member
(
	member_Id			VARCHAR(20) NOT NULL,
    PRIMARY KEY(member_Id),
    member_Password		VARCHAR(20) NOT NULL,
    member_Name			VARCHAR(20) NOT NULL,
    member_Email		VARCHAR(262) NOT NULL,
    member_Birth		DATE NULL,
    member_group_Id		TINYINT UNSIGNED NULL,
	FOREIGN KEY(member_group_Id) REFERENCES member_group(member_group_Id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    INDEX(member_group_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE calendar # NOT ENOUGH : 30분 단위
(
	member_Id			VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	calendar_Year		SMALLINT UNSIGNED NOT NULL,
    INDEX(calendar_Year),
    calendar_Month		TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_Month),
    calendar_Date		TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_Date),
    calendar_Start_time	FLOAT(2,1) UNSIGNED NOT NULL, # Data rule : hour(24h).0 or 5(0 means O'clock, 5 means half an hour) => 19.5 means 7:30 
    INDEX(calendar_Start_time),
    calendar_End_time	TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_End_time),
    calendar_Schedule	VARCHAR(300) NOT NULL,
    PRIMARY KEY(member_Id, calendar_Year, calendar_Month, calendar_Date, calendar_Start_time, calendar_End_time)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE bucketlist
(
	member_Id					VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    bucketlist_Id				VARCHAR(20) NOT NULL, # ID rule : bucket_id(bucket_1, bucket_2, ...)
    INDEX(bucketlist_Id),
    bucketlist_Is_achieved		ENUM('YET', 'ACHIEVED') NOT NULL,
    INDEX(bucketlist_Is_achieved),
    bucketlist_Ultimate_goal	VARCHAR(200) NOT NULL,
    bucketlist_When				SMALLINT UNSIGNED NOT NULL,
    INDEX(bucketlist_When),
    PRIMARY KEY(member_Id, bucketlist_Id, bucketlist_Is_achieved)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal
(
	member_Id				VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_Id				TINYINT UNSIGNED NOT NULL,
    INDEX(mandal_Id),
    PRIMARY KEY(member_Id, mandal_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal_sub
(
	member_Id				VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES mandal(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    INDEX(mandal_sub_Id),
    PRIMARY KEY(member_Id, mandal_Id, mandal_sub_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal_detail
(
	member_Id				VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES mandal_sub(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal_sub(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_sub_Id) REFERENCES mandal_sub(mandal_sub_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_detail_Id		TINYINT UNSIGNED NOT NULL,
    INDEX(mandal_detail_Id),
	bucketlist_Id			VARCHAR(20) NOT NULL,
    FOREIGN KEY(bucketlist_Id) REFERENCES bucketlist(bucketlist_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    bucketlist_Is_achieved	ENUM('YET', 'ACHIEVED') NOT NULL,
    FOREIGN KEY(bucketlist_Is_achieved) REFERENCES bucketlist(bucketlist_Is_achieved)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, mandal_Id, mandal_sub_Id, mandal_detail_Id),
    mandal_detail_content	VARCHAR(100) NULL
)ENGINE=InnoDB CHARSET=utf8;
# Create tables of project Mandalart.
# Table List (PRIMARY KEY) / INDEX
#	member_group	(member_group_Id)
#	member			(member_Id)
#	calendar		(member_Id, calendar_Date, calendar_Start_time, calendar_End_time) / calendar_Date, calendar_Start_time, calendar_End_time
#	bucketlist		(member_Id, bucketlist_Id, bucketlist_Is_achieved) / bucketlist_Is_achieved, bucketlist_When
#	mandal			(mandal_Id)
#	mandal_sub		(mandal_sub_Id, mandal_Id)
# 	mandal_detail	(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id) / mandal_Id
#   Sync			(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id) / bucketlist_Id, bucketlist_Is_achieved, mandal_Id

# CREATE DATABASE handalart;
# USE handalart;

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
    member_Name			VARCHAR(10) NOT NULL,
    member_Email		VARCHAR(262) NOT NULL,
    member_Birth		DATE NULL,
    # member_group_Id		TINYINT UNSIGNED NULL AUTO_INCREMENT,
    member_group_Id		TINYINT UNSIGNED NULL,
	FOREIGN KEY(member_group_Id) REFERENCES member_group(member_group_Id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    INDEX(member_group_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE calendar
(
	calendar_Date		DATE NOT NULL,
    INDEX(calendar_Date),
    calendar_Start_time	TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_Start_time),
    calendar_End_time	TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_End_time),
    calendar_Schedule	VARCHAR(300) NOT NULL,
    member_Id			VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, calendar_Date, calendar_Start_time, calendar_End_time)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE bucketlist
(
    bucketlist_Id		SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    bucketlist_Is_achieved		TINYINT(1) NOT NULL,
    INDEX(bucketlist_Is_achieved),
    bucketlist_Ultimate_goal	VARCHAR(300) NOT NULL,
    bucketlist_When		SMALLINT UNSIGNED NOT NULL,
    INDEX(bucketlist_When),
    member_Id			VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, bucketlist_Id, bucketlist_Is_achieved)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal
(
	mandal_Id				TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY(mandal_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal_sub
(
	mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(mandal_sub_Id, mandal_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal_detail
(
	mandal_detail_Id		TINYINT UNSIGNED NOT NULL,
    mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_sub_Id) REFERENCES mandal_sub(mandal_sub_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    INDEX(mandal_Id),
    member_Id				VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id),
    content					VARCHAR(300) NOT NULL
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE Sync
(
	bucketlist_Id			SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    FOREIGN KEY(bucketlist_Id) REFERENCES bucketlist(bucketlist_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    INDEX(bucketlist_Id),
    bucketlist_Is_achieved	TINYINT(1) NOT NULL,
    FOREIGN KEY(bucketlist_Is_achieved) REFERENCES bucketlist(bucket_Is_achieved)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    INDEX(bucketlist_Is_achieved),
    mandal_detail_Id		TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_detail_Id) REFERENCES mandal_detail(mandal_detail_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_sub_Id) REFERENCES mandal_sub(mandal_sub_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	INDEX(mandal_Id),
	member_Id				VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id)
)ENGINE=InnoDB CHARSET=utf8;
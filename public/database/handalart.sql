# Create database and its tables that come from project Mandalart.

# Naming rule : table_name_Column_name

# Table List (PRIMARY KEY) / INDEX
#	member_group	(member_group_Id)
#	member			(member_Id)
#	calendar		(member_Id, calendar_Year, calendar_Month, calendar_Date, calendar_Start_time, calendar_End_time) / calendar_Date, calendar_Start_time, calendar_End_time
#	bucketlist		(member_Id, bucketlist_Id, bucketlist_Is_achieved) / bucketlist_Is_achieved, bucketlist_When
#	mandal			(mandal_Id)
#	mandal_sub		(mandal_sub_Id, mandal_Id)
# 	mandal_detail	(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id) / mandal_Id
#   Sync			(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id) / bucketlist_Id, bucketlist_Is_achieved, mandal_Id

# NULL option gived columns (except for FOREIGN KEYs)
#	member_group_Count
#	member_Birth
#	mandal_detail_content


CREATE DATABASE handalart;
USE handalart;

CREATE TABLE member_group # COMPLETE
(
	member_group_Id		TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(member_group_Id),
    member_group_Name	VARCHAR(10) NOT NULL,
    member_group_Count	INT UNSIGNED NULL
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE member # COMPLETE
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

CREATE TABLE calendar # NOT ENOUGH 2 / canlendar_Start_time, calendar_End_time
(
	calendar_Year		SMALLINT UNSIGNED NOT NULL,
    INDEX(calendar_Year),
    calendar_Month		TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_Month),
    calendar_Date		TINYINT UNSIGNED NOT NULL,
    INDEX(calendar_Date),
    calendar_Start_time	TINYINT UNSIGNED NOT NULL,	# 시간 단위, 시? 분?
    INDEX(calendar_Start_time),	# 인덱싱이 필요한가?
    calendar_End_time	TINYINT UNSIGNED NOT NULL,	# 시간 단위
    INDEX(calendar_End_time), # 인덱싱이 필요한가?
    calendar_Schedule	VARCHAR(300) NOT NULL,
    member_Id			VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, calendar_Year, calendar_Month, calendar_Date, calendar_Start_time, calendar_End_time)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE bucketlist # COMPLETE
(
    bucketlist_Id				SMALLINT UNSIGNED NOT NULL,
    bucketlist_Is_achieved		TINYINT(1) NOT NULL,
    INDEX(bucketlist_Is_achieved),
    bucketlist_Ultimate_goal	VARCHAR(300) NOT NULL,
    bucketlist_When				SMALLINT UNSIGNED NOT NULL,
    INDEX(bucketlist_When),
    member_Id					VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, bucketlist_Id, bucketlist_Is_achieved)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal # COMPLETE
(
	mandal_Id				TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY(mandal_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal_sub # COMPLETE
(
	mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(mandal_sub_Id, mandal_Id)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE mandal_detail # COMPLETE
(
	bucketlist_Id			SMALLINT UNSIGNED NOT NULL,
    FOREIGN KEY(bucketlist_Id) REFERENCES bucketlist(bucketlist_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_detail_Id		TINYINT UNSIGNED NOT NULL,
    mandal_sub_Id			TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_sub_Id) REFERENCES mandal_sub(mandal_sub_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
	mandal_Id				TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(mandal_Id) REFERENCES mandal_sub(mandal_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    INDEX(mandal_Id),
    member_Id				VARCHAR(20) NOT NULL,
    FOREIGN KEY(member_Id) REFERENCES member(member_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY(member_Id, mandal_detail_Id, mandal_sub_Id, mandal_Id),
    mandal_detail_content	VARCHAR(100) NULL
)ENGINE=InnoDB CHARSET=utf8;
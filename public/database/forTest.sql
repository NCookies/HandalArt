use handalart;

show tables;

drop database handalart;

insert into member values ("local:jung", "qkqh", "jungjung@gmail.com", "태균");
insert into member values ("local:swstar21c", "good", "swstar21c@gmail.com", "승우");


SELECT EXISTS ( SELECT * FROM member WHERE member_DisplayName = "승우");

SELECT EXISTS ( SELECT * FROM member WHERE member_AuthId = 'facebook:1736493206592283');

show tables;

desc member;

desc bucketlist;
desc mandal;
desc mandalsub;
desc mandaldetail;
desc calendar;

ALTER TABLE calendar MODIFY calendar_AllDay boolean;

SET SQL_SAFE_UPDATES =0;

delete from member;
delete from mandal;
delete from bucketlist;
delete from calendar;

select max(mandal_Id) from mandal where member_AuthId = "local:jung";
SELECT EXISTS (SELECT * FROM member where member_AuthId = "local:jung");

insert into mandal values ("local:jung", 1, "dsf", null);
INSERT INTO bucketlist VALUES ('local:jung' , 0, "START", "0000-00-00", "ACHIEVED");

insert into mandal values ('local:jung', 0, "START", null);

SELECT MAX(mandal_Id) FROM mandal WHERE member_AuthId = "facebook:1736493206592283";


delete from mandal where member_AuthId = "local:jung";
DELETE FROM calendar WHERE member_AuthId = "google:106952517117419350743" AND calendar_Id = "_fc1";

SELECT EXISTS (SELECT * FROM member where member_AuthId = "local:aa");

select * from member;

select * from mandal;
select * from mandalsub;
select * from mandaldetail;
select * from bucketlist;
select * from calendar;

select calendar_Id, calendar_Start, calendar_End, calendar_Title, calendar_AllDay from calendar;

SELECT * FROM mandal where member_AuthId = "facebook:1736493206592283" and mandal_Id = 1;

SELECT distinct * FROM mandal where member_AuthId = "facebook:1736493206592283" order by mandal_Id ASC;
SELECT DISTINCT * FROM mandalSub where member_AuthId = "facebook:1736493206592283" order by mandal_Id ASC;

delete from member where member_DisplayName = "유승우";
delete from bucketlist where bucketlist_Id = 0;
delete from mandal where mandal_Id = 1;

ALTER TABLE mandalsub CHANGE colname "mandalSub_Conent" "mandalSub_Content";
alter table mandalsub change "mandalSub_Conent" "mandalSub_Content" varchar(100);

update mandal set mandal_content = "뷍ㄹ" where mandal_Id = 4 and member_AuthId = "facebook:1736493206592283";

UPDATE mandalDetail SET mandalDetail_Content3 = "제발", mandalDetail_Content2 = "날 좀 살려줘" where mandal_Id = 6 and member_AuthId = "facebook:1736493206592283" and mandalsub_Id = 1;


SELECT MAX(mandal_Id) FROM mandal WHERE member_AuthId = "local:yy";

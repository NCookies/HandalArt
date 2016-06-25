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

SET SQL_SAFE_UPDATES =0;

delete from mandal;
delete from bucketlist;

select max(mandal_Id) from mandal where member_AuthId = "local:jung";

insert into mandal values ("local:jung", 1, "dsf", null);
INSERT INTO bucketlist VALUES ('local:jung' , 0, "START", "0000-00-00", "ACHIEVED");

insert into mandal values ('local:jung', 0, "START", null);

SELECT MAX(mandal_Id) FROM mandal WHERE member_AuthId = "facebook:1736493206592283";


delete from mandal where member_AuthId = "local:jung";

select * from member;
select * from mandal;
select * from mandalsub;
select * from mandaldetail;
select * from bucketlist;

delete from member where member_DisplayName = "유승우";
delete from bucketlist where bucketlist_Id = 0;
delete from mandal where mandal_Id = 0;


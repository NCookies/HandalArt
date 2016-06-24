use handalart;

show tables;

drop database handalart;

select * from member;

insert into member values ("local:jung", "qkqh", "jungjung@gmail.com", "태균");
insert into member values ("local:swstar21c", "good", "swstar21c@gmail.com", "승우");

delete from member where member_DisplayName = "유승우";

SELECT EXISTS ( SELECT * FROM member WHERE member_DisplayName = "승우");

SELECT EXISTS ( SELECT * FROM member WHERE member_AuthId = 'facebook:1736493206592283');

show tables;

desc member;
desc mandal;
desc mandalsub;
desc mandaldetail;

SET SQL_SAFE_UPDATES =0;


select * from mandal;
select max(mandal_Id) from mandal where member_AuthId = "local:jung";

insert into mandal values ("local:jung", 1, "dsf", null);

delete from mandal where member_AuthId = "local:jung";


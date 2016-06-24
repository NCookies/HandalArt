use handalart;

show tables;

drop database handalart;

select * from member;

insert into member values ("local:jung", "qkqh", "jungjung@gmail.com", "태균");
insert into member values ("local:swstar21c", "good", "swstar21c@gmail.com", "승우");

delete from member where member_DisplayName = "유승우";

SELECT EXISTS ( SELECT * FROM member WHERE member_DisplayName = "승우");

SELECT EXISTS ( SELECT * FROM member WHERE member_AuthId = 'facebook:1736493206592283');


desc member;

SET SQL_SAFE_UPDATES =0;
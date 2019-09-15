# 설치방법

## 원도우

1. [Mysql](https://dev.mysql.com/downloads/mysql/) 깐다.
2. mysql -uroot -p 실행 (우분투는 mysql --user=root -p인데...)
3. 

## 우분투 18.04

1. MySQL apt를 연동해준다.
2. MySQL apt management tool로 버전을 8.x로 맟춰준다.
3. `apt install mysql-server`
4. 깔때 비번 방식 물어보는데 무조건 레거시.
5. mysql_secure 어쩌고를 켜준다.
6. 비번을 잘 외운다.
7. 플러그인 뭐시기 물어보면 무조건 N
8. `mysqld`
9. `mysql --user=root -p`
10. `create schema seoa;`
11. `use seoa`
12. `source seoa.sql`
13. `npm install` (or `yarn`)
14. `node seoa`

## 주의

8버전 아니면 뭐라함
비번 방식 틀리면 뭐라함

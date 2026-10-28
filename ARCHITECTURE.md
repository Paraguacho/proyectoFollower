This project will have a basic client - server architecture, and we will work with the classic DAO pattern.

Technologies: Java springboot for backend services, web technologies (html, css, javascript) for frontend, PostgreSQL for database.

Practices: Keep stuff simple and understandable to an undergraduate.

PRODUCT BACKLOG:
https://docs.google.com/spreadsheets/d/1CQeqhKPCk-8u-yTygcvcZVhhrVj4w_tL/edit?usp=sharing&ouid=104448756194047373461&rtpof=true&sd=true

GUI Prototype: 
https://www.figma.com/design/dczkSKdy39BpiyKJZfSAL9/Follower?node-id=63-177&t=sfWlvfrOi8WiKFMO-1

ER:
https://drive.google.com/file/d/1zTi_0EMHPaH1PsW54_dzj6g6y1jV4Q1I/view?usp=drive_link

LOCAL EXECUTION:
Create the PostgreSQL database `follower` if it does not exist, then set the
`DATABASE_PASSWORD` environment variable to the password for `DATABASE_USERNAME`
(defaults to `postgres`) in the same PowerShell window where the service will run,
for example `$env:DATABASE_PASSWORD = "<contraseña-local>"`.
Optionally set `DATABASE_URL` to use another PostgreSQL host or port. From
`backend\services`, run `mvn spring-boot:run` and open
`http://localhost:8080`; Spring initializes the tables from
`backend\database\schema.sql` and serves the frontend on the same origin.

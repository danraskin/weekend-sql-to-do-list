CREATE SCHEMA IF NOT EXISTS "tasklist"

DROP TABLE IF EXISTS "tasklist"."taskList"

CREATE TABLE "tasklist"."taskList" (
	"id" SERIAL PRIMARY KEY,
	"rank" VARCHAR,
    "idrel" VARCHAR,
    "idrelchild" VARCHAR DEFAULT '0',
	"task" VARCHAR(30) NOT NULL,
	"taskLength" VARCHAR(20),
	"taskStatus" BOOLEAN DEFAULT FALSE,
	"notes" VARCHAR(280)
);
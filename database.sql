CREATE TABLE "taskList" (
	"id" SERIAL PRIMARY KEY,
    "idrel" VARCHAR,
    "idrelchild" VARCHAR DEFAULT '0',
	"task" VARCHAR(30) NOT NULL,
	"taskLength" VARCHAR(20),
	"taskStatus" BOOLEAN DEFAULT FALSE,
	"notes" VARCHAR(280)
);
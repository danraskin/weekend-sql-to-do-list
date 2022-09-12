const express = require('express');
const taskListRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');

//GET

taskListRouter.get ('/', (req, res) => {
    console.log('in GET /tasks');

    //change order to "idrel" if i add detailed sub-task menu
    let queryText = 'SELECT * FROM "taskList" ORDER BY "taskStatus", "idrel";'
    pool.query(queryText).then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('error GET /tasks', error);
        res.sendStatus(500);
    });
})

taskListRouter.get ('/counterset', (req, res) => {
    let queryText = 'SELECT MAX("idrel") FROM "taskList";'
    pool.query(queryText).then(result => {
        console.log(result);
        res.send(result.rows);
    })
    .catch(error => {
        console.log('error GET /tasks/counterset', error);
        res.sendStatus(500);
    })
})

//POST

taskListRouter.post ('/', (req, res) => {
    let newTask = req.body;


    console.log('in POST /tasks: ', newTask);

    let queryText = `INSERT INTO "taskList" ("rank", "idrel", "task", "taskLength", "notes")
                   VALUES ($1, $2, $3, $4, $5);`;

    pool.query(queryText, [newTask.rank, newTask.idrel, newTask.task, newTask.taskLength, newTask.notes])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log('Error POST /tasks new task', error);
            res.sendStatus(500);
        });
})

//PUT

taskListRouter.put ('/:id', (req, res) => {
    console.log(`Changing task status: id ${req.params.id}`);
    let updateId = req.params.id;

    // Flip ready_to_transfer value to its opposite (true / false)
    const queryText = `
        UPDATE "taskList"
            SET "taskStatus" = NOT "taskStatus"
            WHERE "id" = $1;
    `
    pool.query(queryText, [updateId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('Error PUT /tasks', error);
            res.sendStatus(500);
        });
})

taskListRouter.put ('/idrelchild/:id', (req, res) => {
    console.log(`Changing idrel: id ${req.params.id}`);
    console.log(req.body);
    let updateId = req.params.id;
    // let updateIdRel = req.body.idrel;
    let updateIdRelChild = req.body.idrelchild;

    //updates idrelchild
    const queryText = `
        UPDATE "taskList"
            SET "idrelchild" = $1
            WHERE "id" = $2;
    `
    pool.query(queryText, [updateIdRelChild, updateId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('Error PUT /tasks/IDrelchild', error);
            res.sendStatus(500);
        });
})


//DELETE

taskListRouter.delete ('/:id', (req, res) => {
    console.log(`Deleting task, id ${req.params.id}`);
    let deleteId = req.params.id;
  
    const queryText = `
        DELETE from "taskList"
            WHERE "id" = $1;
    `
    pool.query(queryText, [deleteId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(`Error DELETE /tasks`, error);
            res.sendStatus(500);
        });
});

// export
module.exports = taskListRouter;
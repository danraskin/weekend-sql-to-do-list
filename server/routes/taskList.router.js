const express = require('express');
const taskListRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');

//GET

pool.get ('/', (req, res) => {

    //change order to "idrel" if i add detailed sub-task menu
    let queryText = 'SELECT * FROM "taskList" ORDER BY "id";'
    pool.query(queryText).then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('error GET /tasks', error);
        res.sendStatus(500);
    });

})

//POST

pool.post ('/', (req, res) => {
    let newTask = req.body;

    //set status ternary logic from koalaHolla project
    //let transfer = (req.body.ready_to_transfer === 'Y') ? true : false;

    console.log('Adding new task: ', newTask);

    let queryText = `INSERT INTO "taskList" ("task", "taskLength", "notes")
                   VALUES ($1, $2, $3);`;

    pool.query(queryText, [newTask.task, newTask.taskLength, newTask.notes])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log('Error POST /tasks new task', error);
            res.sendStatus(500);
        });
})

//PUT

pool.put ('/:id', (req, res) => {
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

//DELETE

pool.delete ('/:id', (req, res) => {
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
# Project Name

[Project Instructions](./INSTRUCTIONS.md), this line may be removed once you have updated the README.md

## Description

Your project description goes here. What problem did you solve? How did you solve it?

Additional README details can be found [here](https://github.com/PrimeAcademy/readme-template/blob/master/README.md).

This to-do-list app has the following primary functions:
1. relays user input to a SQL database
2. renders database status on page load and new submission
3. allows users to mark tasks as complete. Task status is updated in database and reflected in DOM
4. allows user to remove task from database and DOM.

* These four functions demonstrate familiarity with the use of GET, POST, PUT and DELETE reqeusts.

* The unique feature of this to-do list is the ability to make a tree of nested tasks.

    If the main item on my list is "prepare dinner", the user can add tasks that comprise 'prepare dinner:

    # "prepare dinner"
      - "select menu"
        - "make list of main course ideas"
        - "make list of dessert ideas"
      - "buy groceries"
      - "clean kitchen"
        - "run dishwasher"
        - "clean cast irons"
          - "they look pretty fucked, guess we should probably clean them with electrolysis"
          - "re-season them"
      - "cook meal"
    # "Do laundary"

  ETC.

* This is accomplished through two 'relative ID' values (idrel and idrelchild) associated with each task, where
    - 'idrelchild' is the number of dependent, or 'child' tasks associated with a main task.
    - 'idrel' is the 'path' of the object, used for sorting. it is a string concatenation of the parent task's 'idrel' and the current 'child count' of the parent object.

    For example:

    "prepare dinner" idrel is 1. "do laundary" idrel is 2.
    "make list of main course ideas" idrel is 1.1; "dessert ideas is 1.2

  Tasks are also given ranks. ranks are used to set indention by class in CSS.

* I chose this solution intuitively, and have not considered alternatives. However, the choice presented itself as an interesting challenge.

* How to set these two 'relative ID' values in relation to a dynamic task list? My solutions to this problem are as follows:

## TWO INPUT BUTTONS:

The primary input button, which is displayed on the DOM, creates first-tier tasks. 'idrel' of first-tier tasks is set with a global variable 'taskCounter'.

setTaskCounter() is called on DOM load, and queries server at GET: /tasks/setcounter for the highest idrel value in the database.

saveTaskObject() creates newTask object from user input. user input is filtered using checkTaskInput(). newTask object is sent to 'postTask', which queries server at POST: /tasks.

on successful server response, postTask() calls getTaskList(), which queries server at GET: /tasks, and passes req.body to renderTaskList(), which renders updated database to DOM.

Users can interact with tasks in DOM in three ways: Complete? button, Delete button, and '+' button.

Complete? button changes task status through PUT: /tasks/id. delete removes task from database through DELETE: /tasks/id, where id = id value of task, which is stored as data object in html section element.

'+' is the secondary, tertiary, etc task button. When it is pressed, a new input menu appears below the task. Tasks inputted through this second input button travel through function pathway in order to keep track of relative ID values.

'+' FIRST calls updateIdRel(). updateIdRel *increases the idrelchild value by 1* of the current 'parent' task associated with the '+' clicked. server is queried at PUT: tasks/idrelchild/id. Before a task has any dependent tasks, its idrelchild = 0. the first click of '+' changes idrelchild to 1; the second click changes it to '2'. this makes sure that idrelchild value reflects the current number of dependent tasks.

on successful server response from PUT: tasks/idrelchild/id, clone function getTaskListRoute2() is called. jquery selecter $(this) is passed to getTaskListRoute2, and all following functions. This is necessary, because New task object must be assembled *after* DOM is reloaded to reflect current idrelchild value. $(this) must therefore pass through the following clone functions: getTaskListRoute2() --> renderTaskListRoute2() --> saveSubTaskObject().

renderTaskListRoute2() does not NOT clear use input, unlike renderTaskList().

saveSubTaskObject() is similar to saveTaskObject(), but sets idrel of new dependent task as a concatenation of *parent* idrel and *parent* idrelchild. after new task object is created, postTask() is called and follows the main path. user input is cleared. 






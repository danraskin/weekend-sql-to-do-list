console.log('js');

$(document).ready( () => {
    console.log('JQ');
    setClickListeners();
    getTaskList();
});

//set up click listeners
function setClickListeners() { //click listeners
    //submit tasks
    $( '#btn_submitNewTask' ).on('click', saveTaskObject);
    $( '#taskListItems' ).on('click', '.btn_status', changeTaskStatus);
    $( '#taskListItems' ).on('click', '.btn_delete', deleteTask);
    $( '#btn_newTask' ).on('click', inputDisplay);
}

function getTaskList() { // route GET: /tasks. calls renderTasks on successful response
    $.ajax({
        method: 'GET',
        url: '/tasks'
    })
    .then((response) => {
        console.log('GET /tasks success');
        renderTasks(response);
    })
    .catch((error) => {
        console.log('error in GET /tasks: ',error);
    });
}

function renderTasks(taskList) { //renders tasks in display field. accepts req.body called by getTaskList().
    $('#taskListItems').empty();
    let taskStatusView;
    for (let task of taskList) { //update this for proper formatting of rows/etc
        if (task.taskStatus === false) { //basic display setting. change this later.
            taskStatusView = "⏳💀⏳💀⏳"
        } else {
            taskStatusView = "🌻🌷🌻🌷🌻"
        }
        $('#taskListItems').append(`
        <section data-id="${task.id}" data-status="${task.status}">
          <span>${taskStatusView}</span>
          <span>${task.task}</span>
          <span>${task.taskLength}</span>
          <span><button class="btn_delete">DELETE</button></span>
          <span><button class="btn_status status-${task.taskStatus}">Task Complete?</button></span>
        </section>
      `);
    }
    $('input').val('');
}


function postTask(newTask) { //route POST: /tasks. inputs new task; calls getTaskList();
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask
      })
        .then((response) => {
          console.log('POST /tasks successful', response);
          getTaskList();
        })
        .catch((error) => {
          console.log('error in POST /tasks',error)
        })
    $('.input-field').css('display','none');
}

function saveTaskObject() { // if checkTaskInput() returns TRUE, creates new task object. calls postTask().
    if (!checkTaskInput()) {
        return false;
      } else {
        let newTask = {
          task: $('#inputTask').val(),
          taskLength: $('#inputLength').val(),
          notes: $('#inputNotes').val(),
        }
        postTask( newTask );
      }
}

function checkTaskInput() { // user alert if 'task' input is blank on task submit. returns true/false
    if ( $('#inputTask').val() === '' ) {
        alert('What are you trying to get done?');
        return false;
    }
    return true;
}

function changeTaskStatus() { // route PUT: /tasks/id. changes task status. calls getTaskList() on success.
    $.ajax({
        method: 'PUT',
        url: `/tasks/${$(this).closest('section').data('id')}`
      })
        .then((response) => {
          console.log('PUT /tasks success',response);
          getTaskList();
        })
        .catch((error) => {
          console.log('error in PUT /tasks',error);
        });
}

function deleteTask() { //route DELETE: /tasks/id. deletes task. calls getTaskList().
    $.ajax({
        method: 'DELETE',
        url: `/tasks/${$(this).closest('section').data('id')}`
    })
        .then((response) => {
            console.log('DELETE /tasks success',response);
            getTaskList();
        })
        .catch((error) => {
            console.log('error in DELETE /tasks',error);
        });
}

function inputDisplay() { //changes display setting on inputs
    console.log($('.input-field').css('display') )
    $('.input-field').css('display', 'block');
    console.log($('.input-field').css('display') )


}
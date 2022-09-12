console.log('js');

$(document).ready( () => {
    console.log('JQ');
    setClickListeners();
    getTaskList();
    setTaskCounter();
});

let taskCounter; //first-tier tasks area assigned using taskCounter

function setTaskCounter() { //sets taskCounter variable on page-load.
    $.ajax({
        method: 'GET',
        url: '/tasks/counterset'
    })
    .then((response) => {
        console.log('GET /tasks/counterset success', response.rows[0].max);
        taskCounter = Number(response.rows[0].max);
    })
    .catch((error) => {
        console.log('error in GET /taskscounterset: ',error);
    });

} 

function setClickListeners() { //click listeners
    //submit tasks
    $( '#btn_submitNewTask' ).on('click', saveTaskObject);
    $( '#taskListItems' ).on('click', '.btn_status', changeTaskStatus);
    $( '#taskListItems' ).on('click', '.btn_delete', deleteTask);
    $( '#taskListItems' ).on('click', '.btn_newSubTask', updateIdRel);
    $( '#btn_newTask' ).on('click', inputDisplay);
    $( '#taskListItems' ).on('click','.btn_newSubInput',subInputDisplay);
}

function getTaskList() { // route GET: /tasks. calls renderTasks on successful response
    console.log('in getTaskList');
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
    console.log('in renderTasks');
    $('#taskListItems').empty();
    let taskStatusView;
    for (let task of taskList) { //update this for proper formatting of rows/etc
        if (task.taskStatus === false) { //basic display setting. change this later.
            taskStatusView = "⏳💀⏳💀⏳"
        } else {

            taskStatusView = "🌻🌷🌻🌷🌻"
        }
        $('#taskListItems').append(`
        <section data-id="${task.id}" data-idrel="${task.idrel}" data-idrelchild="${task.idrelchild}" data-status="${task.status}">
          <span>IDREL: ${task.idrel}   </span>
          <span>${taskStatusView}</span>
          <span>${task.task}</span>
          <span>${task.taskLength}</span>
          <span><button class="btn_delete">DELETE</button></span>
          <span><button class="btn_status status-${task.taskStatus}">Task Complete?</button></span>
          <span><button class="btn_newSubInput status-${task.taskStatus}" data-idrel="">➕</button></span>
        </section>
        <div class="dropdown">
            <div class="input-field-hidden" data-id="${task.id}" data-idrel="${task.idrel}" data-idrelchild="${task.idrelchild}">
                <input class="inputSubTask" type="text" placeholder="New Task">
                <input class="inputSubLength" type="text" placeholder="Task length">
                <input class="inputSubNotes" type="text" placeholder="Task Notes?">
                <button type="button" class="btn_newSubTask">💥S💥U💥B💥M💥I💥T💥</button>
            </div>
        </div>
      `);
    }
    $('input').val('');
}

function saveTaskObject() { // if checkTaskInput() returns TRUE, creates new task object. calls postTask().
    taskCounter ++ ;
    if (!checkTaskInput($(this))) {
        return false;
      } else {
        let newTask = {
          idrel: taskCounter,
          task: $('#inputTask').val(),
          taskLength: $('#inputLength').val(),
          notes: $('#inputNotes').val(),
        }
        postTask( newTask );
      }
}

function checkTaskInput(click) { // user alert if 'task' input is blank on task submit. returns true/false
    if ( $(click).prev('#inputTask').val() === '' ) {
        alert('What are you trying to get done?');
        return false;
    }
    return true;
}

function postTask(newTask) { //route POST: /tasks. inputs new task; calls getTaskList();
    console.log('inPostTask');
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
    $('.input-field').css('display', 'block');
}

function subInputDisplay() { //changes display settings on sub-input
    $(this).parent().parent().next('.dropdown').children().removeClass('input-field-hidden').addClass('input-field-display');
}


function updateIdRel(){ //puts new idrelchild
    console.log('in updateIdRel');
    let newIdRelChild = Number($(this).parent().data('idrelchild')) + 1;
    console.log('newIdRelChild is ', newIdRelChild);

    $.ajax({
        method: 'PUT',
        url: `/tasks/idrelchild/${$(this).closest('div').data('id')}`,
        data: {
            idrelchild: newIdRelChild
        }
      })
        .then((response) => {
          console.log('PUT /tasks/IDrelchild success ',response);
          getTaskListRoute2($(this));
        })
        .catch((error) => {
          console.log('error in PUT /tasks/IDrelchild ',error);
        });
}


function getTaskListRoute2(clicktransfer) { // route GET: /tasks. calls renderTasks on successful response
    console.log('in getTaskListRoute2');
    $.ajax({
        method: 'GET',
        url: '/tasks'
    })
    .then((response) => {
        console.log('GET /tasks success');
        renderTasksRoute2(response,clicktransfer);
    })
    .catch((error) => {
        console.log('error in GET /tasks: ',error);
    });
}

function renderTasksRoute2(taskList,clicktransfer) { //renders tasks in display field. accepts req.body called by getTaskList().
    console.log('in renderTasksRoute2');
    $('#taskListItems').empty();
    let taskStatusView;
    for (let task of taskList) { //update this for proper formatting of rows/etc
        if (task.taskStatus === false) { //basic display setting. change this later.
            taskStatusView = "⏳💀⏳💀⏳"
        } else {

            taskStatusView = "🌻🌷🌻🌷🌻"
        }
        $('#taskListItems').append(`
        <section data-id="${task.id}" data-idrel="${task.idrel}" data-idrelchild="${task.idrelchild}" data-status="${task.status}">
          <span>IDREL: ${task.idrel}   </span>
          <span>${taskStatusView}</span>
          <span>${task.task}</span>
          <span>${task.taskLength}</span>
          <span><button class="btn_delete">DELETE</button></span>
          <span><button class="btn_status status-${task.taskStatus}">Task Complete?</button></span>
          <span><button class="btn_newSubInput" data-idrel="">➕</button></span>
        </section>
        <div class="dropdown">
            <div class="input-field-hidden" data-id="${task.id}" data-idrel="${task.idrel}" data-idrelchild="${task.idrelchild}">
                <input class="inputSubTask" type="text" placeholder="New Task">
                <input class="inputSubLength" type="text" placeholder="Task length">
                <input class="inputSubNotes" type="text" placeholder="Task Notes?">
                <button type="button" class="btn_newSubTask">💥S💥U💥B💥M💥I💥T💥</button>
            </div>
        </div>
      `);
    }
    console.log('end of renderTaskRoute2. what is "this"', $(clicktransfer).closest('section').data('id'));
    saveSubTaskObject(clicktransfer);
}

function saveSubTaskObject(click) {
    console.log('in saveSubTaskObject()');
    console.log('parentobject id is: ', $(click).parent().data('id'));
    if (!checkTaskInput(click)) {
        return false;
      } else {
        let parentIdRel = $(click).parent().data('idrel');
        let parentIdRelChild = $(click).parent().data('idrelchild')
        let IdRel = parentIdRel + '.' + parentIdRelChild;
        let newTask = {
            idrel: IdRel,
            task: $(click).parent().children('.inputSubTask').val(), //will have to change these inputs if i introduce a new field
            taskLength: $(click).parent().children('.inputSubLength').val(),
            notes: $(click).parent().children('.inputSubNotes').val()
        }
        postTask( newTask );
      }
    $('input').val('');

  }
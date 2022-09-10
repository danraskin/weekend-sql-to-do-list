console.log('js');

$(document).ready( () => {
    console.log('JQ');
    setClickListeners();
    getTaskList();
});

//set up click listeners
function setClickListeners() {
    //submit tasks
    $( '#btn_submitNewTask').on('click', saveTaskObject);
    $( '#taskListItems').on('click', '.btn_status', changeTaskStatus);

}

function getTaskList() {
//ajax request to server
console.log( 'in getTaskList' );
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/tasks'
  })
  .then((response) => {
    console.log('success');
    renderTasks(response);
  })
  .catch((error) => {
    console.log('error',error);
  });
}

//renders tasks in display field
function renderTasks(taskList) {
    $('#taskListItems').empty();
    for (let task of taskList) { //update this for proper formatting of rows/etc
      $('#taskListItems').append(`
        <section data-id="${task.id}" data-status="${task.status}">
          <span>${task.task}</span>
          <span>${task.taskLength}</span>
          <span>${task.taskStatus}</span>
          <span><button class="btn_delete">DELETE</button></span>
          <span><button class="btn_status">Task Complete?</button></span>
        </section>
      `);
    }
    $('input').val('');
}

function postTask(newTask) {
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
}

function saveTaskObject() {
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

function checkTaskInput() {
    return true;
}

function changeTaskStatus() {
    console.log('change status', $(this).closest('section').data('id'));
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
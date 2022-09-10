console.log('js');

$(document).ready( () => {
    console.log('JQ');
    setClickListeners();
    getTaskList();
});

//set up click listeners
function setClickListeners() {

    //submit tasks
    $( '#btn_submitNewTask').on('click',inputTask);

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

function inputTask() {

}

function createTaskObject() {

}
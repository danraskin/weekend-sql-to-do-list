console.log('js');

$(document).ready( () => {
    console.log('JQ');
    setClickListeners();
    getTaskList();
})

//set up click listeners
function setClickListeners() {

    //submit tasks
    $( '#btn_submitNewTask').on('click',inputTask);

}

function getTaskList() {
//ajax request to server
console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas'
  })
  .then((response) => {
    console.log('success');
    renderTasks(response);
  })
  .catch((error) => {
    console.log('error',error);
  });
}

//renders tasks in field
function renderTasks() {

}

function inputTask() {

}

function createTaskObject() {

}
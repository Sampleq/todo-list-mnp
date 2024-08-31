let todos;
let users;

const todoList = document.getElementById('todo-list');

const form = document.getElementById('todoForm');
// // можем обращаться к элементам формы через form и name аттрибут
// const selectUsers = document.getElementById('user-todo');
// const submitBtn = document.getElementById('submit-todo');
// const newTodoInput = document.getElementById('new-todo');

const urlTodosJsPlh = `https://jsonplaceholder.typicode.com/todos/`
const urlUsersJsPlh = `https://jsonplaceholder.typicode.com/users/`



// // Imports - fetch
// import { getAllTodos, getAllUsers } from './asyncLogic.js';
// import { addTodo, createTodo, createUserOption, deleteTodo, printTodo } from './basicLogic.js';
// import { changeTodoStatus } from './editLogic.js';

// Imports - async/await
import { getAllTodos, getAllUsers } from './asyncLogic-async.js';
import { addTodo, createTodo, createUserOption, deleteTodo, printTodo } from './basicLogic-async.js';
import { changeTodoStatus } from './editLogic-async.js';


document.addEventListener('DOMContentLoaded', () => initApp(urlTodosJsPlh, urlUsersJsPlh));

// initApp async/await
async function initApp(urlTodos, urlUsers) {
    console.log('start');

    try {
        const datas = await Promise.all([getAllTodos(urlTodos), getAllUsers(urlUsers)]);
        console.log(datas);

        ;[todos, users] = datas;
        console.log(todos, users);

        todos.forEach(todo => printTodo(todoList, users, todo));
        users.forEach(user => createUserOption(form.newTodoUser, user));

    } catch (error) {
        console.log(error);
    }

}

// // initApp promise
// function initApp(urlTodos, urlUsers) {
//     console.log('start');

//     Promise.all([
//         getAllTodos(urlTodos),
//         getAllUsers(urlUsers)
//     ]).then(datas => {
//         console.log(datas);
//         // todos = datas[0]
//         ;[todos, users] = datas;

//         console.log(todos, users);

//         todos.forEach(todo => printTodo(todoList, users, todo));
//         users.forEach(user => createUserOption(form.newTodoUser, user))
//     })
//         .catch(err => console.log(err));
// }


form.submit.addEventListener('click', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    if (!form.newTodoText.value || form.newTodoUser.value === 'select user') {
        alert('Type new ToDo text and select User!');
        return;
    }

    const newTodo = createTodo(form);
    console.log(newTodo);

    // addTodo
    addTodo(todos, urlTodosJsPlh, newTodo, todoList, users);

}


todoList.addEventListener('click', handleClick);

function handleClick(event) {
    if (event.target.matches('li>input')) {
        // console.log('li>input');
        changeTodoStatus(todos, urlTodosJsPlh, event.target);
    }

    if (event.target.matches('li .close')) {
        // console.log('li .close');
        deleteTodo(todos, urlTodosJsPlh, event.target.parentElement);

    }
}







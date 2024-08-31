let todos;
let users;

const todoList = document.getElementById('todo-list');
const selectUser = document.getElementById('user-todo');
const submitBtn = document.getElementById('submit-todo');
const newTodoInput = document.getElementById('new-todo');

const urlTodosJsPlh = `http://jsonplaceholder.typicode.com/todos/`
const urlUsersJsPlh = `http://jsonplaceholder.typicode.com/users/`



// Imports



document.addEventListener('DOMContentLoaded', () => initApp(urlTodosJsPlh, urlUsersJsPlh));

function initApp(urlTodos, urlUsers) {
    console.log('start');

    Promise.all([
        getAllTodos(urlTodos),
        getAllUsers(urlUsers)
    ]).then(datas => {
        console.log(datas);
        // todos = datas[0]
        ;[todos, users] = datas;

        console.log(todos, users);

        todos.forEach(todo => printTodo(todo));
        users.forEach(user => createUserOption(user))


    })

        .catch(err => console.log(err));
}

// function initApp(urlTodos, urlUsers) {
//     Promise.all([
//         fetch(urlTodos),
//         fetch(urlUsers)
//     ]).then(responses => {
//         console.log(responses);
//         // console.log(responses.map(response => response.json()))

//         return responses.map(response => response.json());
//     })
//         .then(datas => {
//             console.log(datas);

//             datas.forEach(data => data.then(data => console.log(data)))

//         })
//         .catch(err => console.log(err));
// }


function getAllTodos(url) {
    return fetch(url)
        .then(response => response.json())
}

function getAllUsers(url) {
    return fetch(url)
        .then(response => response.json())
}



function printTodo(todo) {

    todoList.insertAdjacentHTML('afterbegin',
        `<li data-id=${todo.id}>
            <input type="checkbox">
            <span>${todo.title} <i>by</i>
            <b>${users
            .find(user => user.id === todo.userId) // attention to data type (string/number)
            .name}</b></span>
            <span class="close">×</span>
         </li>   `);

    todoList.querySelector('input').checked = todo.completed;
}

function createUserOption(user) {
    selectUser.insertAdjacentHTML('beforeend',
        `<option value=${user.id}>${user.name}</option>`
    )

}




submitBtn.addEventListener('click', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    if (!newTodoInput.value || selectUser.value === 'select user') {
        alert('Type new ToDo text and select User!');
        return;
    }

    // createTodo
    const newTodo = {
        completed: false,
        title: `${newTodoInput.value}`,
        userId: Number(`${selectUser.value}`),
    }
    console.log(newTodo);


    // addTodo
    fetch(urlTodosJsPlh, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {  // без headers  не работает (на jsonplaceholder - точно)
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => response.json())
        .then(todoRemote => {
            todos.push(todoRemote);
            printTodo(todoRemote);
        });

}


todoList.addEventListener('click', handleClick);

function handleClick(event) {
    if (event.target.matches('li>input')) {
        // console.log('li>input');
        changeTodoStatus(event.target);
    }

    if (event.target.matches('li .close')) {
        // console.log('li .close');
        deleteTodo(event.target.parentElement);
    }

}


function changeTodoStatus(checkbox) {
    event.preventDefault();

    const todo = todos.find(todo => todo.id == checkbox.parentElement.dataset.id);
    console.log(todo);

    todo.completed = !todo.completed

    fetch(urlTodosJsPlh + todo.id, {
        method: 'PATCH',
        body: JSON.stringify(todo),
        headers: {  // без headers  не работает (на jsonplaceholder - точно)
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => response.json())
        .then(todoRemote => {
            console.log(todoRemote);
            checkbox.checked = todoRemote.completed;
        }).catch(err => {
            todo.completed = !todo.completed; // меняем статус обратно в локальной todo
            alert('Remote server did not respond.\n\nTry again.')
            console.log(err.message);
        }
        );

}


function deleteTodo(todoElement) {
    const todoDel = todos.find(todo => todo.id == todoElement.dataset.id);
    console.log(todoDel);

    fetch(urlTodosJsPlh + todoDel.id, {
        method: 'DELETE',
        body: JSON.stringify(todoDel),
        headers: {  // без headers  не работает (на jsonplaceholder - точно)
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => response.json()
        .then(data => {
            // console.log(data);

            // // // WRONG !! Если вынести эту функцию в модуль, то используя .filter(), который не мутирует исходный масив, а возвращает новый -  мы переприсвоим новое значение именно параметру функции - а нам надо именно мутировать массив - нужно использовать .splice() и .indexOf() или .findIndex() - тогда даже в модуле мы будем изменять - мутировать - именно исходный массив
            todos = todos.filter(todo => todo !== todoDel);
            console.log(todos);

            todoElement.remove();
        }))
        .catch(err => {
            console.log(err.message);
            alert('Remote server did not respond.\n\nTry again.');
        })

}

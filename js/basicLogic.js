
function printTodo(todoList, users, todo) {

    todoList.insertAdjacentHTML('afterbegin',
        `<li data-id=${todo.id}>
            <input type="checkbox">
            <span>${todo.title} <i>by</i>
            <b>${users
            .find(user => user.id === todo.userId) // attention to data type (string/number) or use == instead ===
            .name}</b></span>
            <span class="close">×</span>
         </li>   `);

    todoList.querySelector('input').checked = todo.completed;
}

function createUserOption(selectUsersElem, user) {
    selectUsersElem.insertAdjacentHTML('beforeend',
        `<option value=${user.id}>${user.name}</option>`
    );
}


function createTodo(form) {
    return {
        completed: false,
        title: `${form.newTodoText.value}`,
        userId: Number(`${form.newTodoUser.value}`),
    }
}

function addTodo(todos, urlTodos, newTodo, todoList, users) {
    fetch(urlTodos, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {  // без headers  не работает (на jsonplaceholder - точно)
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => response.json())
        .then(todoRemote => {
            todos.push(todoRemote);
            printTodo(todoList, users, todoRemote);
        });
}



function deleteTodo(todosArr, urlTodos, todoElement) {
    // сразу скрываем удаляемое todo чтобы нельзя было многократно кликнуть - иначе баг - из массива удалится а со страницы - нет
    todoElement.style.display = 'none';

    console.log('todosArr - start of deleteTodo()', todosArr);

    const todoDel = todosArr.find(todo => todo.id == todoElement.dataset.id);
    console.log(todoDel);

    fetch(urlTodos + todoDel.id, {
        method: 'DELETE',
        body: JSON.stringify(todoDel),
        headers: {  // без headers  не работает (на jsonplaceholder - точно)
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => response.json()
        .then(data => {
            console.log(data);

            // // // WRONG !! используя .filter(), который не мутирует исходный масив, а возвращает новый -  мы переприсвоим новое значение именно параметру функции - а нам надо именно мутировать массив - нужно использовать .splice() и .indexOf() или .findIndex()
            // // WRONG !! todos = todos.filter(todo => todo.id != todoDel.id);

            // // OK
            // todosArr.splice(todosArr.findIndex(todo => todo === todoDel), 1);

            // OK
            todosArr.splice(todosArr.indexOf(todoDel), 1);
            console.log('todosArr - in then()', todosArr);

            todoElement.remove();

        }))
        .catch(err => {
            // обратно показываем todo, если сервер не ответит
            todoElement.style.display = '';

            console.log(err.message);
            alert('Remote server did not respond.\n\nTry again.');
        });

}

export { printTodo, createUserOption, createTodo, addTodo, deleteTodo }


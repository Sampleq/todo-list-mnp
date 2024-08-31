
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

async function addTodo(todos, urlTodos, newTodo, todoList, users) {
    try {
        const response = await fetch(urlTodos, {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: {  // без headers  не работает (на jsonplaceholder - точно)
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const todoRemote = await response.json();

        todos.push(todoRemote);
        printTodo(todoList, users, todoRemote);
    } catch (error) {
        console.log(error.message);
        alert('Remote server did not respond.\n\nTry again.');
    }
}


async function deleteTodo(todosArr, urlTodos, todoElement) {
    // сразу скрываем удаляемое todo чтобы нельзя было многократно кликнуть - иначе баг - из массива удалится а со страницы - нет
    todoElement.style.display = 'none';
    // console.log('todosArr - start of deleteTodo()', todosArr);

    const todoDel = todosArr.find(todo => todo.id == todoElement.dataset.id);
    console.log(todoDel);


    try {
        const response = await fetch(urlTodos + todoDel.id, {
            method: 'DELETE',
            body: JSON.stringify(todoDel),
            headers: {  // без headers  не работает (на jsonplaceholder - точно)
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const data = await response.json();
        console.log(data);

        // // // !! используя .filter(), который не мутирует исходный масив, а возвращает новый -  мы переприсвоим новое значение именно параметру функции - а нам надо именно мутировать массив - нужно использовать .splice() и .indexOf() или .findIndex()
        todosArr.splice(todosArr.indexOf(todoDel), 1);
        console.log('todosArr - in then()', todosArr);

        todoElement.remove();

    } catch (error) {
        // обратно показываем todo, если сервер не ответит
        todoElement.style.display = '';

        console.log(error.message);
        alert('Remote server did not respond.\n\nTry again.');
    }

}

export { printTodo, createUserOption, createTodo, addTodo, deleteTodo }


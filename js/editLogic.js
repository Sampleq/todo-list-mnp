

function changeTodoStatus(todos, urlTodos, checkbox) {

    const todo = todos.find(todo => todo.id == checkbox.parentElement.dataset.id);
    console.log(todo);

    todo.completed = !todo.completed

    fetch(urlTodos + todo.id, {
        method: 'PATCH',
        body: JSON.stringify(todo),
        headers: {  // без headers  не работает (на jsonplaceholder - точно)
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(response => response.json())
        .then(todoRemote => {
            console.log(todoRemote);
            checkbox.checked = todoRemote.completed; // can be ommited, but mensures from bug
        }).catch(err => {
            todo.completed = !todo.completed; // меняем статус обратно в локальной todo
            checkbox.checked = !checkbox.checked; // отменяем изменения в чекбоксе

            alert('Remote server did not respond.\n\nTry again.')
            console.log(err.message);
        }
        );
}


export { changeTodoStatus }
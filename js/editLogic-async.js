async function changeTodoStatus(todos, urlTodos, checkbox) {

    const todo = todos.find(todo => todo.id == checkbox.parentElement.dataset.id);
    console.log(todo);

    todo.completed = !todo.completed;

    try {
        const response = await fetch(urlTodos + todo.id, {
            method: 'PATCH',
            body: JSON.stringify(todo),
            headers: {  // без headers  не работает (на jsonplaceholder - точно)
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const todoRemote = await response.json();
        console.log(todoRemote);
        checkbox.checked = todoRemote.completed;

    } catch (error) {
        todo.completed = !todo.completed; // меняем статус обратно в локальной todo
        checkbox.checked = !checkbox.checked; // отменяем изменения в чекбоксе

        alert('Remote server did not respond.\n\nTry again.')
        console.log(error.message);
    }

}


export { changeTodoStatus }
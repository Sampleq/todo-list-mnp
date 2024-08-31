// asyncLogic

async function getAllTodos(url) {
    try {
        const response = await fetch(url);
        // console.log(response);
        const todos = await response.json();
        // console.log(todos);

        return todos;
    } catch (error) {
        alert('Remote server did not respond.\n\nTry again.')
        console.log(error.message);
    }
}

async function getAllUsers(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        alert('Remote server did not respond.\n\nTry again.')
        console.log(error.message);
    }
}


export { getAllTodos, getAllUsers }

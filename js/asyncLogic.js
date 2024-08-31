// asyncLogic

function getAllTodos(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(e => console.log(e));
}

function getAllUsers(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(e => console.log(e));
}


export { getAllTodos, getAllUsers }

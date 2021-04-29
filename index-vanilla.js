store.subscribe(() => {
  const { todos, goals } = store.getState();

  document.querySelector($TODOS).innerHTML = '';
  document.querySelector($GOALS).innerHTML = '';

  todos.forEach((el) => addTodoToDOM(el)); // todos.forEach(addTodoToDOM);
  goals.forEach((el) => addGoalToDOM(el)); // goals.forEach(addGoalToDOM);
});

document.querySelector($TODO_BTN).addEventListener('click', addTodo);

document.querySelector($GOAL_BTN).addEventListener('click', addGoal);

// UI
function createRemoveBtn(cb) {
  const node = document.createElement('button');
  const text = document.createTextNode('X');
  node.type = 'button';
  node.appendChild(text);

  node.addEventListener('click', cb);

  return node;
}

// todo
function addTodo() {
  const todo = document.querySelector($TODO_FIELD);
  const name = todo.value;
  todo.value = '';

  store.dispatch(
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    }),
  );
}

function addTodoToDOM(todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.name);
  const removeBtn = createRemoveBtn(() =>
    store.dispatch(removeTodoAction(todo.id)),
  );

  node.appendChild(text);
  node.appendChild(removeBtn);
  node.style.textDecoration = todo.complete ? 'line-through' : 'none';

  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id));
  });

  document.querySelector($TODOS).appendChild(node);
}

// goal
function addGoal() {
  const goal = document.querySelector($GOAL_FIELD);
  const name = goal.value;
  goal.value = '';

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name,
    }),
  );
}

function addGoalToDOM(goal) {
  const node = document.createElement('li');
  const text = document.createTextNode(goal.name);
  const removeBtn = createRemoveBtn(() =>
    store.dispatch(removeGoalAction(goal.id)),
  );

  node.appendChild(text);
  node.appendChild(removeBtn);

  document.querySelector($GOALS).appendChild(node);
}

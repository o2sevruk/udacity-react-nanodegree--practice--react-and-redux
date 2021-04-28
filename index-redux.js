// Actions
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

const $TODO_FIELD = '#todo';
const $TODO_BTN = '#todoBtn';
const $TODOS = '#todos';

const $GOAL_FIELD = '#goal';
const $GOAL_BTN = '#goalBtn';
const $GOALS = '#goals';

// ID Generator
function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// MIDDLEWARE
const checker = (store) => (next) => (action) => {
  if (
    (action.type === ADD_TODO &&
      action.todo.name.toLowerCase().includes('bitcoin')) ||
    (action.type === ADD_GOAL &&
      action.goal.name.toLowerCase().includes('bitcoin'))
  ) {
    return alert("Nope. That's bad idea!");
  }

  return next(action);
};
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('The action: ', action);
  const result = next(action);
  console.log('The current store: ', store.getState());
  console.groupEnd();

  return result;
};
const addNewTodo = (store) => (next) => (action) => {
  if (action.type === ADD_TODO) {
    alert(`Don't forget to ${action.todo.name}!`);
  }

  return next(action);
};
const addNewGoal = (store) => (next) => (action) => {
  if (action.type === ADD_GOAL) {
    alert("That's a great goal!");
  }

  return next(action);
};

// Action Creators
// todo
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

// goal
function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

// REDUCERS
// todo
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.todo];
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete }),
      );
    default:
      return state;
  }
}

// goal
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return [...state, action.goal];
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

// APP
const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
  }),
  Redux.applyMiddleware(checker, logger, addNewTodo, addNewGoal),
);

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

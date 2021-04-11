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

// Action Creators
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

// STORE
function createStore(reducer) {
  // The store should have four parts
  // 1. The state
  // 2. Get the state.
  // 3. Listen to changes on the state.
  // 4. Update the state

  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);

    listeners.forEach((l) => l());
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

// REDUCERS
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) => (todo.id !== action.id
        ? todo.id
        : ({ ...todo, complete: !todo.complete })));
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}

// APP
const store = createStore(app);

store.subscribe(() => {
  const { todos, goals } = store.getState();

  document.querySelector($TODOS).innerHTML = '';
  document.querySelector($GOALS).innerHTML = '';

  todos.forEach((el) => {
    addTodoToDOM(el);
  }); // todos.forEach(addTodoToDOM);
  goals.forEach((el) => {
    addGoalToDOM(el);
  }); // goals.forEach(addGoalToDOM);
});

document.querySelector($TODO_BTN).addEventListener('click', addTodo);

document.querySelector($GOAL_BTN).addEventListener('click', addGoal);

// UI
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
  node.appendChild(text);

  document.querySelector($TODOS).appendChild(node);
}

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
  node.appendChild(text);

  document.querySelector($GOALS).appendChild(node);
}

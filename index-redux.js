// Actions
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

const RECEIVE_DATA = 'RECEIVE_DATA';

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

// shared
function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
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
    case RECEIVE_DATA:
      return action.todos;
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
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

// loading
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

// APP
const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading,
  }),
  Redux.applyMiddleware(checker, logger, addNewTodo, addNewGoal),
);

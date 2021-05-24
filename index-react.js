const Context = React.createContext();

function List(props) {
  return (
    <ul>
      {props.items.map((el) => (
        <li key={el.id}>
          <span
            onClick={() => props.toggle && props.toggle(el.id)}
            style={{
              textDecoration: el.complete ? 'line-through' : 'none',
            }}
          >
            {el.name}
          </span>
          <button type="button" onClick={() => props.remove(el)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    this.props.dispatch(
      addTodoHandler(this.input.value, () => {
        this.input.value = '';
      }),
    );
  };

  removeItem = (todo) => {
    this.props.dispatch(deleteTodoHandler(todo));
  };

  toggleItem = (id) => {
    this.props.dispatch(toggleTodoHandler(id));
  };

  render() {
    return (
      <div className="section">
        <h2>ToDos</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Add ToDo"
            ref={(el) => (this.input = el)}
          />
          <button type="button" onClick={this.addItem}>
            Add ToDo
          </button>
        </div>

        <List
          items={this.props.todos}
          remove={this.removeItem}
          toggle={this.toggleItem}
        />
      </div>
    );
  }
}

const ConnectedTodos = ReactRedux.connect((state) => ({
  todos: state.todos,
}))(Todos);

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    this.props.dispatch(
      addGoalHandler(this.input.value, () => {
        this.input.value = '';
      }),
    );
  };

  removeItem = (goal) => {
    this.props.dispatch(deleteGoalHandler(goal));
  };

  render() {
    return (
      <div className="section">
        <h2>Goals</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Add Goal"
            ref={(el) => (this.input = el)}
          />
          <button type="button" onClick={this.addItem}>
            Add Goal
          </button>
        </div>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    );
  }
}

const ConnectedGoals = ReactRedux.connect((state) => ({
  goals: state.goals,
}))(Goals);

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(handleInitialData());
  }

  render() {
    if (this.props.loading === true) {
      return <h3>Loading...</h3>;
    }

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    );
  }
}

const ConnectedApp = ReactRedux.connect((state) => ({
  loading: state.loading,
}))(App);

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <ConnectedApp />
  </ReactRedux.Provider>,
  document.getElementById('app'),
);

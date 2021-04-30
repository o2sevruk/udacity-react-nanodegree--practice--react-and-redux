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

class Provider extends React.Component {
  render() {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    );
  }
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

class ConnectedTodos extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { todos } = store.getState();

          return <Todos todos={todos} dispatch={store.dispatch} />;
        }}
      </Context.Consumer>
    );
  }
}

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

class ConnectedGoals extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { goals } = store.getState();

          return <Goals goals={goals} dispatch={store.dispatch} />;
        }}
      </Context.Consumer>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    console.log(API);

    const { store } = this.props;

    store.dispatch(handleInitialData());

    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const { store } = this.props;
    const { loading } = store.getState();

    if (loading) {
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

class ConnectedApp extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          return <App store={store} />;
        }}
      </Context.Consumer>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app'),
);

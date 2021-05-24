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

function connect(mapStateToProps) {
  return (Component) => {
    class Receiver extends React.Component {
      componentDidMount() {
        const { subscribe } = this.props.store;
        this.unsubscribe = subscribe(() => {
          this.forceUpdate();
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        const { dispatch, getState } = this.props.store;
        const state = getState();
        // stateNeeded is an object where each property is a prop of the Component
        // eg for App it will be { loading: true/false }
        const stateNeeded = mapStateToProps(state);
        return <Component {...stateNeeded} dispatch={dispatch} />;
      }
    }

    class ConnectedComponent extends React.Component {
      render() {
        return (
          <Context.Consumer>
            {(store) => <Receiver store={store} />}
          </Context.Consumer>
        );
      }
    }

    return ConnectedComponent;
  };
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

const ConnectedTodos = connect((state) => ({
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

const ConnectedGoals = connect((state) => ({
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

const ConnectedApp = connect((state) => ({
  loading: state.loading,
}))(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app'),
);

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

function Loader() {
  return <div>Loading...</div>;
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    const name = this.input.value;
    this.input.value = '';

    this.props.store.dispatch(
      addTodoAction({
        id: generateId(),
        name,
        complete: false,
      }),
    );
  };

  removeItem = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id));
  };

  toggleItem = (id) => {
    this.props.store.dispatch(toggleTodoAction(id));
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

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    const name = this.input.value;
    this.input.value = '';

    this.props.store.dispatch(
      addGoalAction({
        id: generateId(),
        name,
      }),
    );
  };

  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));
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

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;

    Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
      store.dispatch(receiveDataAction(todos, goals));
    });

    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();

    if (loading) {
      return <h3>Loading...</h3>;
    }

    return (
      <div>
        <Todos todos={todos} store={this.props.store} />
        <Goals goals={goals} store={this.props.store} />
      </div>
    );
  }
}

ReactDOM.render(<App store={store} />, document.getElementById('app'));

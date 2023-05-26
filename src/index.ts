// 조회
interface Item {
  seq: string;
  checked: boolean;
  content: string;
}

class Todo implements Item {
  public seq: string;
  constructor(public checked: boolean, public content: string, seq?: string) {
    if (!seq) {
      this.seq = this.getSeq();
    } else {
      this.seq = seq;
    }
  }
  private getSeq(): string {
    return `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`;
  }
}

class TodoList {
  private _todos: Todo[]; // private 변수는 관례로 '_'언더바를 붙인다.
  constructor(public todoList: Todo[]) {
    this._todos = todoList;
  }

  // 조회
  get todos() {
    // todos라는 프로퍼티를 getter로 만들어 사용 할 수 있다.
    // private _todos 프로퍼티는 외부에서 직접 접근이 안되므로 우회 접근 방법으로 getter를 만들어 준다.
    return [...this._todos];
  }

  // 등록
  addTodo(content: string) {
    const newTodo = new Todo(false, content);
    this._todos.push(newTodo);
    const jsonTodo = JSON.stringify(this._todos);
    localStorage.setItem("Todos", jsonTodo);
    console.log(this._todos);
  }

  // 수정
  updateTodo(todoList: TodoList, changedTodo: Todo) {
    console.log(1);

    // 초기화
    let newTodo = changedTodo;
    let newTodoList = new TodoList([])._todos;
    for (let i = 0; i < todoList.getLength(); i++) {
      if (todoList._todos[i].seq === changedTodo.seq) {
        newTodoList.push(changedTodo);
      } else {
        newTodoList.push(todoList._todos[i]);
      }
      const jsonTodo = JSON.stringify(newTodoList);
      localStorage.setItem("Todos", jsonTodo);
    }
  }
  // 길이
  getLength() {
    // getter, setter 대신 메소드로도 사용 가능
    return this._todos.length;
  }
}

const ul = document.querySelector("ul");
const drawLi = (todo: Todo, i: number) => {
  let div1 = document.createElement("div");
  div1.classList.add("checkbox");
  div1.id = `checked-${todo.seq}`;
  div1.textContent = todo.checked ? "✔" : "";
  div1.onclick = () => {
    check(todo);
  };

  let div2 = document.createElement("div");
  div2.classList.add("todo");
  div2.id = `content-${todo.seq}`;
  div2.textContent = todo.content;

  let inputHidden = document.createElement("input");
  inputHidden.type = "hidden";
  inputHidden.id = `seq`;
  inputHidden.value = todo.seq;

  let button = document.createElement("button");
  button.classList.add("delBtn");
  button.id = `deleted-${todo.seq}`;
  button.textContent = "x";

  let li = document.createElement("li");
  li.classList.add("todo-item");
  todo.checked ? li.classList.add("checked") : li.classList.remove("checked");
  li.id = `todo-item-${todo.seq}`;

  li.append(div1);
  li.append(div2);
  li.append(inputHidden);
  li.append(button);
  ul?.appendChild(li);
};
const drawInit = (todoList: TodoList) => {
  for (let i = 0; i < todoList.getLength(); i++) {
    let todo = todoList.todos[i];
    drawLi(todo, i);
  }
};
// 입력란 초기화
const clear = () => {
  let input: HTMLInputElement | null = document.querySelector("#todo-input");
  if (input !== null) {
    input.value = "";
  }
};

// 저장이벤트
const save = (event: KeyboardEvent, value: string) => {
  if (event.key === "Enter") {
    console.log(typeof value);
    todoList.addTodo(value);
    // TODO 로컬스토리지 등록
    drawLi(new Todo(false, value), todoList.getLength());
    clear();
  }
};

const check = (todo: Todo) => {
  const checkedLi = document.querySelector(`#todo-item-${todo.seq}`);
  if (checkedLi?.classList.contains("checked")) {
    checkedLi?.classList.remove("checked");
  } else {
    checkedLi?.classList.add("checked");
  }
  const todosStr = localStorage.getItem("Todos");
  if (todosStr !== null) {
    const todosArr = JSON.parse(todosStr);
    todoList = new TodoList(todosArr);

    let changedTodo = new Todo(!todo.checked, todo.content, todo.seq);
    todoList.updateTodo(todoList, changedTodo);
  }
};

// 화면 초기화
let todoList: TodoList;
const todosStr = localStorage.getItem("Todos");
console.log(todosStr);

if (todosStr !== null) {
  const todosArr = JSON.parse(todosStr);
  todoList = new TodoList(todosArr);
  drawInit(todoList);
} else {
  todoList = new TodoList([]);
}
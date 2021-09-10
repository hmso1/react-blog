## 請列出 React 內建的所有 hook，並大概講解功能是什麼

## 請列出 class component 的所有 lifecycle 的 method，並大概解釋觸發的時機點

圖中例出 Class component 的 lifecycle 中的 method 的時間點
<img src="https://i.imgur.com/Cu3zWqu.png" style="width: 1000px">

### 常用使用的 method

1. render()：
   會根據 this.props 和 this.state 的內容回傳以下的物件：

- React Element：JSX, 可以是基本的 tag 或是一個 Class component
- Arrays and Fragments：可以 render 多個 React element。因為 component return 時一定要以一個 tag 包住內容，使用 Fragment 回傳時只會回傳內容，[官網介紹](https://zh-hant.reactjs.org/docs/fragments.html)
- Portals：用於 parent component 有 overflow: hidden 或者 z-index 的樣式時，卻仍需要 child 在視覺上「跳出」其容器的狀況。將 children 放在 sibling 上，但 children bubble 時會傳遞到 parent 上[官網介紹](https://zh-hant.reactjs.org/docs/portals.html)，
- 文字，數字
- booleans, null：多數情況會是 `return {isTure && <Component />} `

建議應該保持 render() 是 pure, 不應該可以改變 state 或是和瀏覽器有所互動

2. constructor()
   用途：1. 初始化 this.state 2. 為 event handler 方法綁定 instance
   要在 constructor() 任何宣告之前呼叫 `super(props)` ，否則，this.props 在 constructor 中的值會出現 undefined 的 bug。

不要在用 state 儲存 props 的值

```js
constructor(props) {
 super(props);
 // 請不要這樣做！
 this.state = { color: props.color };
}
```

這樣做基本上就算 props 改變了 state.color 的值都不會更新的，如果是想當作儲存 defaultColor 以便之後 reset 使用，應該將 prop 重新命名為 defaultColor。

3. componentDidMount()
   根據 lifecycle，componentDidMount() 發生的時間點會是 DOM Tree 產生後，可以控制 DOM node，適合做 network request, subscription。
   如果在 componentDidMount() 內 setState 會重新執行 render()，但這會在瀏覽器更新螢幕之前發生，所以使用者不會看見這兩次 render 中過渡時期的 state。

4. componentDidUpdate()
   會在更新後和 shouldComponentUpdate() 回傳的值 = true（如果有的話） 的時候被呼叫，不會在初次 render 時被呼叫。和 componentDidMount() 一樣，發生的時間點會是 DOM Tree 產生後，可以控制 DOM node，適合做 network request。但最好對較 this.props 和 prevProps 才決定是否進行 network request。
   可以在 componentDidMount() 內 setState 但一定要在一個條件語句內，否則你會進入一個無限迴圈。會在瀏覽器更新螢幕之前發生，所以使用者不會看見這兩次 render 中過渡時期的 state。

如果你的 component 裡面有 getSnapshotBeforeUpdate() ，其回傳的值將會被當作第三個「snapshot」參數傳給 componentDidUpdate()。否則這個參數會是 undefined。

5. componentWillUnmount()
   在 component unmount 或 destory 後被呼叫，可以進行任何清理，像是取消計時器和網路請求或是移除任何在 componentDidMount() 內建立的 subscription。
   不應該在 componentWillUnmount() 內呼叫 setState()，因為這個 component 永遠不會再重新 render。當一個 component instance 被 unmount 後，它就永遠不會再被 mount。

### 不常使用的 method

## 請問 class component 與 function component 的差別是什麼？

class component 與 function component 的差別：
Class Component：

- controlled component 改變時，class component 只會重新執行 render() function 的部份
- this 是 matable, 會根據當下的 instance 決定 this.prop, this.state 的值是什麼

Function component：

- controlled component 改變時，會重新執行整個 function。
- 沒有 this，所以每次 render 後的 prop, state 都是獨立，不會影響大家

以下是 Dan Abromov [文章](https://overreacted.io/how-are-function-components-different-from-classes/) 的例子，指出因為 Class component 因為 this 而產生的奇怪現象：

```js
class ProfilePage extends React.Component {
  showMessage = () => {
    alert("Followed " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

假設原生 state.user 的值是 aaa

1. 點擊了 button
2. 第 1 秒：，this.props.user === aaa，我們改變 state.user 做 bbb
3. 第 2 秒：畫面會重新 render，執行 render() function
4. 第 3 秒：this.props.user 的值會變成 bbb
   所以最後 alert 出來的是 bbb。為了解決 this 是 mutable 的特性，我們需要用 closure 去捕獲它，

```js
class ProfilePage extends React.Component {
  render() {
    // Capture the props!
    const props = this.props;

    // Note: we are *inside render*.
    // These aren't class methods.
    const showMessage = () => {
      alert("Followed " + props.user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Follow</button>;
  }
}
```

在 render() function 入面將 this.props 以 `props` 捕獲起來，假設 this.state.user 的值是 aaa

1. props(#1) 將 this.props 捕獲起來 === aaa
2. 點擊 button 觸發 setTimeout function
3. 第一秒：改變 this.state.user 做 bbb
4. 第二秒：畫面重新 render，執行 render() function, props(#2) 將新的 this.props 捕獲起來 === bbb
5. 第三秒：執行 showMessage function, alert 出 props(#1).user === aaa
   因為將 this.props 捕獲, 就算 this.state.user 改變都不會影響到已捕獲的值，所以最後會 alert 出 aaa

這樣寫 class component 其實好奇怪因為將所有功能都寫成 function 而不是用 method， 再加上這個寫法和 function component 都十分似

Function component 寫法：

```js
function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
```

因為每一次 state.user 改變時都會重新 render 一個獨立的 function 和 props, 所以不會要 alert aaa 但 alert 了 bbb 的情況出現。
同樣地，在 function component 中，state 每次 render 都是獨立的。但 useState 的初始化應該只會在第一次 render function component 才發生

```js
function MessageThread() {
  const [message, setMessage] = useState("");

  const showMessage = () => {
    alert("You said: " + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

如果想在三秒後 alert 出即時的 input value 而不是在按 alert 時當下的 input value 就要使用到 useRef

```js
function MessageThread() {
  const [message, setMessage] = useState("");
  const latestMessage = useRef("");

  const showMessage = () => {
    alert("You said: " + latestMessage.current);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    latestMessage.current = e.target.value;
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

在按下 button 後改 input 的值會改到 latestMessage reference 的值所以在三秒後 alert 出的會是當下的值。
使用 useEffect 實作：

```js
function MessageThread() {
  const [message, setMessage] = useState('');

  // Keep track of the latest value.
  const latestMessage = useRef('');
  useEffect(() => {
    latestMessage.current = message;
  });

  const showMessage = () => {
    alert('You said: ' + latestMessage.current);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
```

每一次 render 都會觸發 useEffect 的 function, latestMessage 就會等於 message 的值。

## uncontrolled 跟 controlled component 差在哪邊？要用的時候通常都是如何使用？

### uncontrolled 跟 controlled component 差在哪邊

controlled compoent 會伴隨一個 function 去改變 controlled component 的值，當值改變後就會重新 render 頁面，確保資料和畫面永遠都是同步的。
uncontrolled component 改奱後，並不會觸發畫面重新 render。可以用 useRef / createRef 去管理。

Controlled Component 例子：

```js
// Function component
function Form() {
  const [value, setValue] = useStatus("");
  const handleOnChange = (e) => setValue(e.target.value);
  return <input type="text" value={value} onChange={handleOnChange} />;
}

// Class component
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleOnChange = (e) => this.setState({ value: e.target.value });

  render() {
    return (
      <input
        type="text"
        value={this.state.value}
        onChange={this.handleOnChange}
      />
    );
  }
}
```

每一次去改 input 的內容是會觸發 handleOnChange 的 function 去改變 value 的值，因為值改變了又會重新 render 畫面並且在 input 顯示最新的 value 值。

Uncontrolled Component 的例子

```js
// Function Component
function Form() {
  const value = useRef(null);
  const handleOnClick = () => alert(value.current.value);
  return (
    <div>
      <input type="text" ref={value} />
      <button onClick={handleOnClick}>ALERT!!</button>
    </div>
  );
}

// Class Component
class Form extends Component {
  constructor(props) {
    super(props);
    this.value = createRef(null);
  }

  handleOnClick = () => alert(this.value.current.value);
  render() {
    return (
      <div>
        <input type="text" ref={this.value} />
        <button onClick={this.handleOnClick}>ALERT!!</button>
      </div>
    );
  }
}
```

使用 value / this.value 去記錄 `<input>` DOM 資料, 當 input 改變時並不會任何事情。
按下 button 時會執行 handleOnClick 並且 alert 出 value / this.value 的數值。

### 要用的時候通常都是如何使用

官網建議在大多時候都應該要 controlled component 但 uncontrolled component 的好處是它不會重新 render 畫面，效能會更好。
在官網提供的一篇[文章](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)也指出在應該要以自己的需求去選擇 uncontrolled componet 或是 uncontrolled componet，文章中以表單為例子去表示有 controlled component 和 uncontrolled component 功能上的分別：

| 功能                                                | uncontrolled | controlled |
| --------------------------------------------------- | ------------ | ---------- |
| 1 次性取得變數資料                                  | V            | V          |
| 在表單送出可以檢查變數是否有效                      | V            | V          |
| 即時檢查變數是否有效                                | X            | V          |
| 未完成填寫表單會 disable 送出 button                | X            | V          |
| 控制 input 的格式                                   | X            | V          |
| several inputs for one piece of data (我都不太明白) | X            | V          |
| dynamic inputs(我都不太明白)                        | X            | V          |

個人感覺是如果是要根據 component 做一些其他的畫面控制就使用 controlled component 因為一定要知道最新的值。但如果沒有要求，uncontrolled component 會更為直接，效能更好，因為不會重新 render 頁面。

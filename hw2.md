## 請列出 React 內建的所有 hook，並大概講解功能是什麼

### 基礎的 Hook

1. useState()

   `const [state, setState] = useState(initialState);`
   useState 會回傳 state 的變數和更新 state 的 function。

   初始化 state 有二種方法：

   1. useState(initalState)：state 的數值等於 initalState

   2. ````js
              //state 的數值等於 someExpensiveComputation 的回傳值
              useState(() => {
                  const initialState = someExpensiveComputation(props);
                  return initialState;
              });
          ```
      在後續的重新 render，useState 回傳的第一個值必定會是最後更新的 state。**所以每次 render 時，useState 都會再次執行，只不過回傳的不是初始值**
      ````

   setState 是用來更新 state 並令到 component 重新 render，有二種更新方法：

   1. setState(newState)

   2. 使用上一個 state 去計算新 state 的值：setState(prevState => prevState + 1) 回傳的是新的 state 數值

React 會確保 setState 是穏定而且在重新 render 時不會改變，所以可以在 useEffect 或 useCallback 的的依賴列表省略它。

如果 setState 回傳與目前的 state 相同的值，React 將會跳過 component 的 render 及 effect 的執行。 React 可能仍需要在跳過 render 之前 render 該 component。這不應該是個問題，因為 React 不會不必要地「深入」到 component tree 中。如果你在 render 當中執行了昂貴的計算，你可以使用 useMemo 來最佳化。

2. useEffect()

   在 function componet 中，在 render 階段是不允許有 mutation、subscription、timer、日誌記錄、以及其他 side effect 的進行因為這可能會導致容易混淆的 bug 和不一致的 UI。useEffect 會在 render 和瀏覽器顯示畫面之後觸發，所以適合進行 side effect，例如設定 subscription 和 event handler，因為絕大部份的工作都不應該阻礙瀏覽器更新晝面。但如果 side effect 會影響到 UI 畫面，就會引致視覺不一致，這種情況會建議使用 useLayoutEffect()。雖然 useEffect 會被延遲直到瀏覽器繪制完成，但會保證在任何新 render 前執行。React 會在開始新一個更新前刷新（完成?!）上一輪 render 的 effect。

   useEffect() 可以傳入 2 個參數：

   1. 要執行的 function
   2. 所依賴的值 array

   ```js
   useEffect(() => {
     const subscription = props.source.subscribe();
     return () => {
       subscription.unsubscribe();
     };
   }, [props.source]);
   ```

   以上的例子有三個重點：

   1. 每一次執行 useEffect() 前都先執行 return function 也就是 `subscription.unsubscribe()`，而 return function 內的變數值都是未改變的數值
   2. 執行 props.source.subscribe()，使用最新的變數值
   3. userEffect() 執行的時間點是當 props.source 改變時

   如果沒有傳入依賴的值 array，useEffect 就會在每次 render 都發生，如果是傳入`[]`，代表 useEffect 只會在 function component 初始化時發生，而 return function 會在 component unmount 時發生。array 要包含了所有在該 component 中會隨時間而變的值（例如 props 和 state）以及在該 effect 所使用到的值，否則 useEffec() 會使用舊的變數以致結果不如預期。

3. useContext()

Context 是用來解法 props 傳遞到底層 children 的問題，假設在父層設定 `const [counter], setCounter] = useState("")` 而 state 是給子層的子層的子層使用，props 要經過多個不需要用到該 props 的子層才到目標的子層，這樣的傳遞十分麻煩。用上 Context 後，父層會被 `<Context.Provider value={counter}>` 包住，而所有被 Context.Provide 包住的 component 都可以使用 useContext() 拿取 Context 內 value 的值。

1. 首先要用 createContext() 去建立 context： `const ThemeContext = React.createContext(初始值)`
2. 用 context 去包住 component

   ```js
   // value 是會傳下去的值
   function App() {
     return (
       <ThemeContext.Provider value={themes.dark}>
         <Toolbar />
       </ThemeContext.Provider>
     );
   }
   ```

3. 在子層使用 useContext() 拿取 context 的 value

```js
function ThemedButton() {
  // 如果 component 被多個 ThemeContext 包住，會取得最近的 ThemeContext value 的值
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

假設 Context 的 value 是一個 state，當 state 被更新時，useContext() 會觸發 component 的 rerender，rerender 會將最新傳遞到 MyContext 的 context value 傳送到 MyContext provider。就算用了 useContext() 的 component 用了 `memo` 或者 `shouldComponentUpdate`，rerender 都會發生。如果重新 render component 的操作很昂貴，你可以透過 [memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693) 來最佳化。

### 額外的 Hook

1. useReducer()
   useState 的替代方案，適合當你需要複雜的 state 邏輯涉及多個子數值或下一個 state 依賴之前的 state。觸發深層的 component 更新會有更好的效能因為傳遞的 dispatch 而不是 callback。

`const [state, dispatch] = useReducer(reducer, initialArg, init);`，reducer 會是一個 function 儲存於在 dispatch 中，每一次觸發 dispatch 後會以 reducer() 去決定下一個 state 是什麼。useReducer 有二種方法去初始法 state：

1. ```js
   // state 的初始值是 { count: initialCount }
   const [state, dispatch] = useReducer(reducer, { count: initialCount });
   ```

1. ```js
   // state 的初始值是 init(initialCount)
   const [state, dispatch] = useReducer(reducer, initialCount, init);
   function init(initialCount) {
     return { count: initialCount };
   }
   ```

   使用 useReducer 例子：

   ```js
   // 方便了將來處理重置 state 的 action
   function init(initialCount) {
     return { count: initialCount };
   }

   function reducer(state, action) {
     switch (action.type) {
       case "increment":
         return { count: state.count + 1 };
       case "decrement":
         return { count: state.count - 1 };
       case "reset":
         return init(action.payload);
       default:
         throw new Error();
     }
   }

   function Counter({ initialCount }) {
     const [state, dispatch] = useReducer(reducer, initialCount, init);
     return (
       <>
         Count: {state.count}
         <button
           onClick={() => dispatch({ type: "reset", payload: initialCount })}
         >
           Reset
         </button>
         <button onClick={() => dispatch({ type: "decrement" })}>-</button>
         <button onClick={() => dispatch({ type: "increment" })}>+</button>
       </>
     );
   }
   ```

   與 useState() 相似，React 確保 dispatch function 本身是穩定的，而且不會在重新 render 時改變。所以不需以放到 useEffect 或 useCallback 的依賴 array 中。如果 dispatch 回傳與目前的 state 相同的值，React 將會跳過 component 的 render 及 effect 的執行。 React 可能仍需要在跳過 render 之前 render 該 component。這不應該是個問題，因為 React 不會不必要地「深入」到 component tree 中。如果你在 render 當中執行了昂貴的計算，你可以使用 useMemo 來最佳化。

   React 不使用 state = initialState 這個由 Redux 推廣開來的參數慣例。初始值有時需要依賴於 prop，因此需要在呼叫 Hook 時指定。如果你較偏愛上述的慣例，你可以呼叫 useReducer(reducer, undefined, reducer) 來摸擬 Redux 的行為，但這是不鼓勵的。

1. useCallback()

1. useMemo()

1. useRef()

1. useImperativeHandle

1. useLayoutEffect

1. useDebugValue()

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

4. componentDidUpdate(prevProps, prevState, snapshot)

   會在更新後和 shouldComponentUpdate() 回傳的值 = true（如果有的話） 的時候被呼叫，不會在初次 render 時被呼叫。和 componentDidMount() 一樣，發生的時間點會是 DOM Tree 產生後，可以控制 DOM node，適合做 network request。但最好對較 this.props 和 prevProps 才決定是否進行 network request。

   可以在 componentDidMount() 內 setState 但一定要在一個條件語句內，否則你會進入一個無限迴圈。會在瀏覽器更新螢幕之前發生，所以使用者不會看見這兩次 render 中過渡時期的 state。

   如果你的 component 裡面有 getSnapshotBeforeUpdate() ，其回傳的值將會被當作第三個「snapshot」參數傳給 componentDidUpdate()。否則這個參數會是 undefined。

5. componentWillUnmount()

   在 component unmount 或 destory 後被呼叫，可以進行任何清理，像是取消計時器和網路請求或是移除任何在 componentDidMount() 內建立的 subscription。

   不應該在 componentWillUnmount() 內呼叫 setState()，因為這個 component 永遠不會再重新 render。當一個 component instance 被 unmount 後，它就永遠不會再被 mount。

### 不常使用的 method

1. shouldComponentUpdate(nextProps, nextState)
   shouldComponentUpdate() 是為了優化效能，回傳 false 的時候 UNSAFE_componentWillUpdate()、render() 和 componentDidUpdate() 不會執行。會在 props 或 state 被接收之後並在 component 被 render 之前被呼叫，不會在初次 render 或使用 forceUpdate() 時呼叫。

   應該用 PureComponent 代替，因為 PureComponent 會為 prop 和 state 做一個淺層比較（shallow comparison）並減低你錯過必要更新的機會。

   如果要使用 shouldComponentUpdate() 要將 this.props 與 nextProps 以及 this.state 和 nextState 做比較，確保 component 在 props 或 state 改變後是會更新，回傳 false 並不會避免 child component 在它們的 state 改變時重新 render。

   不應該在 shouldComponentUpdate() 中做深度比較或使用 JSON.stringify()。它們效率不佳且會造成效能問題。

2. static getDerviedStateFromProps(props, state)

   （睇一百遍都不太明做什麼，但好似官網也不推薦使用!!!!!）

   會在 component 被 render 前被呼叫，不管是在首次 mount 時或後續的更新時，在 shouldComponentUpdate() 前發生，所以每一次 render 都會被呼叫。會回傳 object 去更新 state 或是回傳 null 代表不用更新 state。

   使用時機：有時 state 會依賴 prop 在一段時間過後所產生的改變。例如，也許建立一個 `<Transition>` component 是很方便的，我們可以用它來比較其之前與之後的 children，並決定我們要 animate in and out 哪一個 child。使用 getDerviedStateFromProps() 會導致冗長的程式碼並使你的 component 很難理解，如遇到以下情況應使用較為簡單的替代方案：

   - 在某個 prop 改變時產生相對應的 side effect（例如，資料提取或使用動畫），請使用 componentDidUpdate。
   - 在某個 prop 改變時重新計算某些資料，請使用 memoization helper。
   - 如果你想要 在某個 prop 改變時「重置」某個 state，請考慮建立一個完全被控制 的 component 或帶有 key 的完全不可被控制 component。
     [You Probably Don't Need Derived State](https://zh-hant.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)

3. getSnapshotBeforeUpdate(prevProps, prevState)

   在 DOM Tree 改變前抓取未變的 DOM 的資料，將回傳值會傳遞到 componentDidUpdate() 的第三個參數以做一些畫面的調整，可以用於對話串這類需要以某種特殊方始處理滾動軸位置的 UI 中出現。

#### [錯誤邊界](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)

是用於截取 child component tree 中 JavaScript 錯誤、記錄錯誤、並顯示一個 fallback UI 而非 crashed component tree。錯誤邊界會在 render 期間、生命週期方法、以及其下整個 tree 群組所有的 constructor 內截取錯誤。

Class Component 會變成錯誤邊界當使用了 static getDerivedStateFromError() 或 componentDidCatch() （可同時使用）。會這二個 method 中更新 state 會截取在其下的 tree 內未被處理的 JavaScript 錯誤，並顯示一個 fallback UI。

**錯誤邊界只會截取在 tree 中、自身以下的 component 中的錯誤。錯誤邊界無法截取自身內的錯誤。**
我想不能截取自身內的錯誤是指 render() 以外的 method 或 function 如果發生錯誤是截取不到 ?!

4. static getDerivedStateFromError(error)
   當 render 期間被呼叫，所以 side effect 是不被允許的。

   當 descendant component 出現時就會呼叫 getDerivedStateFromError(error)，它會接收該錯誤為其參數並回傳一個值以更新 state。

   descendant component 應該是指回傳了不是 render() 應該回傳的物件?!

5. componentDidCatch(error, info)

   同樣地在 descendant component 出現時就會呼叫 getDerivedStateFromError(error, info)，有二個參數：

   1. error - 被拋出的錯誤。
   2. info - 一個有 componentStack key 的 object，這個 key 包含有那一個 component 拋出錯誤的資訊。

   是在 commit 期間發生，可以進行 side effect，應該被用來做類似記錄錯誤這類的事情。在 `development` 時，錯誤會 bubbling 到 `window` 上，任何的 window.onerror 或 window.addEventListener('error', callback) 將攔截透過 componentDidCatch 所捕捉到的錯誤。但在 `production` 時不會 bubbling, 所以錯誤會被 componentDidCatch() 截取。

   **應該用 getDerivedStateFromError() 來處理 fallback render，而不是在發生錯誤時呼叫 setState 來 render 一個含有 componentDidCatch() 的 fallback UI**

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

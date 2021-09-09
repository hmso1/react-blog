## 請列出 React 內建的所有 hook，並大概講解功能是什麼

## 請列出 class component 的所有 lifecycle 的 method，並大概解釋觸發的時機點

## 請問 class component 與 function component 的差別是什麼？

class component 與 function component 的差別是當 controlled component 改變時，class component 只會重新執行 render() function 的部份，而 function component 會執行整個 function。

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

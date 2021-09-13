5. useCallback()
   useCallback() 是配合 memo() 用，memo() 是用於 function component，只會在傳入 function component 的 props 更變後先會重新 rerender（useContext 可以 override）。

   ```js
   import { useState, useRef, memo } from "react";

   const Input = ({ value }) => {
     console.log("Input render");
     return <p>{value}</p>;
   };

   const App = () => {
     console.log("App render");
     const value = 0;
     const [state, setState] = useState("");
     return (
       <div>
         <Input value={value} />
         <input value={state} onChange={(e) => setState(e.target.value)} />
       </div>
     );
   };
   export default App;
   ```

   每一次 input 改變時會重新 render App 和 Input，但傳遞到 Input 的變數是一個固定數值，其實不需要 rerender，所以使用到 meme()

   ```js
   const Input = memo(({ value }) => {
     console.log("Input render");
     return <p>{value}</p>;
   });
   ```

   每一次 input 改變，只會 render App component。如果在 App value 的值並不是一個 primitive，而是 object，會發生什麼事呢？每一次 App 的更新會重新 relocate 一個新的記憶體位置給 value，所以 Input component 每次都接收一個新的記憶體位置並重新 render。但其實傳入 Input 的 object 內容是沒有變的，重新新 render 是不需要的，這個時候應該使用 useCallback()。

   ```js
   const memoizedCallback = useCallback(() => {
     doSomething(a, b);
   }, [a, b]);
   ```

   第一個參數是 function，回傳值是 memoizedCallback 的數值。
   第二個參數是依賴 array，代表只在 a 或 b 有變時先會觸發第一個參數的 function

   `useCallback(fn, deps) 相等於 useMemo(() => fn, deps)`

6. useMemo()
   當在 component render 時要做到複雜的計算就可以用 useMemo() 做效能優化。會在 render 期間執行，不要做一些通常不會在 render 期間做的事情，例如：side effect 應該在 useEffect 執行而不是 useMemo()
   `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);` 當 a, b 改變就會執行 computeExpensiveValue(a, b)
   同 useCallback 不同的是 useCallback 是針對 props，而 useMemo 是針對 component 內的 function。就算使用 useMemo()，React 都可能會選擇「忘記」某些之前已 memorize 的值並在下一次 render 時重新計算，例如，為已離開螢幕的 component 釋放記憶體。所以應該先寫一個沒有 useMemo() 都可以執行的 function 之後再處理優化效能。

7. useRef()
   `const refContainer = useRef(initialValue);` useRef 會建立一個普通的 JavaScript object。會將 refContainer.current 初始化成 initialValue 的值。refContainer 會是一個 mutable 變數。自建一個 {current: ...} object 的唯一不同是，useRef 在每次 render 時都會給你同一個的 ref object，不會有記憶體 relocate。

   一個常見的使用情境就是命令式的訪問 child component：

   ```js
   function TextInputWithFocusButton() {
     const inputEl = useRef(null);
     const onButtonClick = () => {
       // `current` points to the mounted text input element
       inputEl.current.focus();
     };
     return (
       <>
         <input ref={inputEl} type="text" />
         <button onClick={onButtonClick}>Focus the input</button>
       </>
     );
   }
   ```

   將 input 的 node 記錄在 inputEl 上，當 button 被點擊，可以經 inputEl 對 input node 做控制。useRef 在其內容有變化時並不會通知你，變更 .current 屬性也不會觸發重新 render。如果你想要在 React 綁定或解綁 DOM 節點的 ref 時執行程式碼，你可能需要使用 [callback ref](https://codesandbox.io/s/l7m0v5x4v9) 來實現。

8. useImperativeHandle()
   讓父 component 能控制子 component 的 ref。一如既往，在大多數的情況下應避免使用 ref 的命令式代碼。useImperativeHandle 應與 forwardRef 一同使用：

   ```js
   const MyInput = forwardRef((props, ref) => {
     const [val, setVal] = useState("");
     const inputRef = useRef();

     useImperativeHandle(ref, () => ({
       blur: () => {
         document.title = val;
         console.log(document.title);
         inputRef.current.blur();
       },
     }));

     return (
       <input
         ref={inputRef}
         val={val}
         onChange={(e) => setVal(e.target.value)}
         {...props}
       />
     );
   });

   const App = () => {
     const ref = useRef(null);
     const onBlur = () => {
       console.log(ref.current); // Only contains one property!
       ref.current.blur();
     };

     return <MyInput ref={ref} onBlur={onBlur} />;
   };
   ```

   在這個範例中，當 MyInput 是 onBlur 時會執行 onBlur()

   ```js
   console.log(ref.current);
   // 會 print 出
   /*
   { 
      "blur": function blur() {
          document.title = val;
          console.log(document.title);
          inputRef.current.blur();
      }
    }
    */
   ref.current.blur();
   // 會 console.log val 的值 同 blur input node
   ```

9. useLayoutEffect()
   使用方法和 useEffect 相同但觸發的時機是在 DOM Tree 更新之後和瀏覽器執行繪製之前，所以可以控制 DOM element。
   **盡可能使用 useEffect 來避免阻礙視覺上的更新。**

如果是 server side render，useLayoutEffect 或 useEffect 都不會執行到，直到 JS 完成載入。這是為什麼在伺服器 render 的 component 包含 useLayoutEffect 時 React 會發出警告。要解決這問題，把該邏輯搬到 useEffect 裡（如果首次 render 不需要該邏輯），或把 component 延遲到客戶端完成 render 後才出現（如果直到 useLayoutEffect 執行前 HTML 都會錯亂的情況下）。要在伺服器 render 的 HTML 排除需要 layout effect 的 component，可以利用 showChild && `<Child />` 進行條件 render，並使用 `useEffect(() => { setShowChild(true); }, [])` 來延遲顯示。這樣，UI 就不會在完成 render 之前顯示錯亂了。

10. useDebugValue()
    useDebugValue 可以用來在 React DevTools 中顯示自訂義 hook 的標籤。不建議在每個自定義 Hook 都加上 debug 值。它在自定義 Hook 的共享函式庫中才是最有價值的。

（不明白在說什麼?!）
useDebugValue 接受一個格式化 function 作為可選的第二個參數。只會在 hook 被檢查時才會被呼叫，以避免不必要地呼叫格式化 function。
`useDebugValue(date, date => date.toDateString());`

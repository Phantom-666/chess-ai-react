import "./App.css"
import Board from "./components/Board/Board"
import { Provider } from "react-redux"
import store from "./reducer"
import Control from "./components/Control/Control"
import TakeBack from "./components/Control/TakeBack"

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Board />
        <Control>
          <TakeBack />
        </Control>
      </Provider>
    </div>
  )
}

export default App

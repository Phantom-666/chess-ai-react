import { useDispatch, useSelector } from "react-redux"
import "./GameEnds.css"
import { setupNewGame } from "../../../reducer/chess/chessActions"

const GameEnds = () => {
  const status = useSelector((state) => state.chess.status)

  const dispatch = useDispatch()

  const newGame = () => {
    dispatch(setupNewGame())
  }

  return (
    <div className="game-over">
      <h1>Game is over : {status}</h1>

      <button onClick={newGame}>New game</button>
    </div>
  )
}

export default GameEnds

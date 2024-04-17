import { useSelector } from "react-redux"
import "./Board.css"
import Pieces from "./Pieces/Pieces"
import Files from "./bits/Files"
import Ranks from "./bits/Ranks"
import Popup from "../Popup/Popup"
import arbiter from "../../arbiter/arbiter"
import { getKingPosition } from "../../arbiter/getMoves"

const Board = () => {
  const appState = useSelector((state) => state.chess)
  const position = appState.position[appState.position.length - 1]

  const ranks = Array(8)
    .fill()
    .map((x, i) => 8 - i)
  const files = Array(8)
    .fill()
    .map((x, i) => i + 1)

  const isChecked = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position,
      player: appState.turn,
    })

    if (isInCheck) return getKingPosition(position, appState.turn)

    return null
  })()

  const getClassName = (i, j) => {
    let c = "tile"
    c += (i + j) % 2 === 0 ? " tile-dark" : " tile-light"

    if (appState.candidateMoves.find((m) => m[0] === i && m[1] === j)) {
      if (position[i][j]) c += " attacking"
      else c += " highlight"
    }

    if (isChecked && isChecked[0] === i && isChecked[1] === j)
      return (c += " checked")

    return c
  }

  const TurnTable = () => {
    const turn = useSelector((state) => state.chess.turn)

    return (
      <div className={"turn-table " + `turn-table-${turn}`}>
        <h1>Turn : {turn === "w" ? "WHITE" : "BLACK"}</h1>
      </div>
    )
  }

  return (
    <div className="board">
      <TurnTable />
      <Ranks ranks={ranks} />
      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div
              key={file + "-" + rank}
              className={getClassName(7 - i, j)}
            ></div>
          ))
        )}
      </div>

      <Pieces />
      <Popup />

      <Files files={files} />
    </div>
  )
}

export default Board

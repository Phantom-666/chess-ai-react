import { useDispatch, useSelector } from "react-redux"
import "./PromotionBox.css"
import { copyPosition } from "../../../utils"
import {
  clearCandidates,
  makeNewMove,
} from "../../../reducer/chess/chessActions"

const PromotionBox = ({ onClosePopup }) => {
  const options = ["q", "r", "b", "n"]

  const appState = useSelector((state) => state.chess)
  const { promotionSquare } = appState

  const dispatch = useDispatch()

  if (!promotionSquare) {
    return
  }

  const color = promotionSquare.x === 7 ? "w" : "b"

  const onClick = (option) => {
    onClosePopup()

    const newPosition = copyPosition(
      appState.position[appState.position.length - 1]
    )

    newPosition[promotionSquare.rank][promotionSquare.file] = ""
    newPosition[promotionSquare.x][promotionSquare.y] = color + option

    dispatch(clearCandidates())
    dispatch(makeNewMove({ newPosition }))
  }

  return (
    <>
      <div className="popup-inner promotions-choices">
        {options.map((option, i) => (
          <div
            key={i}
            className={`piece ${color}${option}`}
            onClick={() => onClick(option)}
          ></div>
        ))}
      </div>
    </>
  )
}
export default PromotionBox

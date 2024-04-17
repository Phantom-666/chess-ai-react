import { useDispatch, useSelector } from "react-redux"
import "./Popup.css"

import { gameStatus } from "../../reducer/chess/chessReducer"
import { closePopup } from "../../reducer/chess/chessActions"
import GameEnds from "./GameEnds/GameEnds"
import PromotionBox from "./PromotionBox/PromotionBox"

const Popup = () => {
  const appState = useSelector((state) => state.chess)
  const dispatch = useDispatch()

  if (appState.status === gameStatus.onGoing) return

  const onClosePopup = () => {
    dispatch(closePopup())
  }

  if (appState.status === gameStatus.promoting) {
    return null
    // return (
    //   <div className="popup">
    //     <PromotionBox onClosePopup={onClosePopup} />
    //   </div>
    // )
  }

  return (
    <div className="popup">
      <GameEnds />
    </div>
  )
}

export default Popup

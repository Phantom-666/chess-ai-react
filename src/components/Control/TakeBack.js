import { useDispatch } from "react-redux"

import { takeBack } from "../../reducer/chess/chessActions"

const TakeBack = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(takeBack())}>Take Back</button>
    </div>
  )
}

export default TakeBack

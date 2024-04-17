import "./Pieces.css"
import Piece from "./Piece"
import { useEffect, useRef, useState } from "react"
import { copyPosition } from "../../../utils"
import { useDispatch, useSelector } from "react-redux"
import {
  clearCandidates,
  detectCheckmate,
  detectInsufficientMaterial,
  detectStalemate,
  makeNewMove,
  openPromotion,
  setupNewGame,
  updateCastling,
} from "../../../reducer/chess/chessActions"
import arbiter from "../../../arbiter/arbiter"
import { getCastlingDirections } from "../../../arbiter/getMoves"
import axios from "axios"

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

const Pieces = () => {
  const ref = useRef()

  const appState = useSelector((state) => state.chess)
  const dispatch = useDispatch()

  const [session_name, setSession_name] = useState(generateRandomString(10))

  const currentPosition = appState.position[appState.position.length - 1]

  const calcCoord = (e) => {
    const { width, left, top } = ref.current.getBoundingClientRect()
    const size = width / 8
    const y = Math.floor((e.clientX - left) / size)
    const x = 7 - Math.floor((e.clientY - top) / size)

    return { x, y }
  }

  const openPromotionBox = ({ rank, file, x, y }) => {
    dispatch(openPromotion({ rank: Number(rank), file: Number(file), x, y }))
  }

  const updateCastlingState = ({ piece, rank, file }) => {
    const direction = getCastlingDirections({
      castleDirection: appState.castleDirection,
      piece,
      rank,
      file,
    })

    if (direction) {
      dispatch(updateCastling(direction))
    }
  }

  const move = (e) => {
    const { x, y } = calcCoord(e)

    const [piece, rank, file] = e.dataTransfer.getData("text").split(",")

    if (appState.candidateMoves?.find((m) => m[0] === x && m[1] === y)) {
      const opponent = piece.startsWith("b") ? "w" : "b"
      const castleDirection = appState.castleDirection[`${opponent}`]

      if ((piece === "wp" && x === 7) || (piece === "bp" && x === 0)) {
        openPromotionBox({ rank, file, x, y })

        return
      }

      if (piece.endsWith("r") || piece.endsWith("k")) {
        updateCastlingState({ piece, rank, file })
      }

      const newPosition = arbiter.performMove({
        position: currentPosition,
        piece,
        rank,
        file,
        x,
        y,
      })
      dispatch(makeNewMove({ newPosition }))

      if (arbiter.insufficientMaterial(newPosition)) {
        dispatch(detectInsufficientMaterial())
      } else if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
        dispatch(detectStalemate())
      } else if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
        dispatch(detectCheckmate(piece[0]))
      }
    }
    dispatch(clearCandidates())
  }

  const onDrop = (e) => {
    e.preventDefault()

    move(e)
  }
  const onDragOver = (e) => e.preventDefault()

  const [serverStatus, setServerStatus] = useState(null)

  const fetchToServer = async (appState) => {
    const position = appState.position
    const turn = appState.turn

    const board = []

    for (let i = 0; i < position[position.length - 1].length; ++i) {
      const newArray = []

      for (let j = 0; j < position[position.length - 1][i].length; ++j) {
        newArray.push(position[position.length - 1][i][j])
      }

      board.push(newArray)
    }

    const currentPosition = appState.position[appState.position.length - 1]

    currentPosition.map((r, rank) =>
      r.map((f, file) => {
        board[rank][file] = { piece: currentPosition[rank][file] }

        if (currentPosition[rank][file])
          if (currentPosition[rank][file].startsWith(turn)) {
            const piece = currentPosition[rank][file]

            const candidateMoves = arbiter.getValidMoves({
              position: position[position.length - 1],
              prevPosition: position[position.length - 2],
              castleDirection: appState.castleDirection[turn],
              piece,
              rank,
              file,
            })

            board[rank][file] = { piece, candidateMoves }
          }
      })
    )

    const res = await axios.post("http://localhost:5000/calc_move", {
      board,
      turn,
      session_name,
    })
    const final_object = res.data.final_object

    if (!final_object?.piece) {
      await axios.post("http://localhost:5000/checkmate", {
        session_name: session_name,
        turn: turn === "b" ? "w" : "b",
      })

      setSession_name(generateRandomString(10))
      dispatch(setupNewGame())

      return console.log("CHECKMATE")
    }

    const piece = final_object.piece.piece

    // x, y -> конечные точки

    const x = final_object.moveTo.first
    const y = final_object.moveTo.second

    const rank = final_object.piece.col
    const file = final_object.piece.row

    // console.log("x", x)
    // console.log("y", y)

    // console.log("rank", rank)
    // console.log("file", file)

    // const [piece, rank, file] = e.dataTransfer.getData("text").split(",")

    const opponent = piece.startsWith("b") ? "w" : "b"
    const castleDirection = appState.castleDirection[`${opponent}`]

    if ((piece === "wp" && x === 7) || (piece === "bp" && x === 0)) {
      openPromotionBox({ rank, file, x, y })

      console.log("promotion detected")

      const { promotionSquare } = appState

      const option = "q"

      const newPosition = copyPosition(
        appState.position[appState.position.length - 1]
      )
      const color = promotionSquare.x === 7 ? "w" : "b"

      newPosition[promotionSquare.rank][promotionSquare.file] = ""
      newPosition[promotionSquare.x][promotionSquare.y] = color + option

      dispatch(clearCandidates())
      dispatch(makeNewMove({ newPosition }))

      res()

      return
    }

    if (piece.endsWith("r") || piece.endsWith("k")) {
      updateCastlingState({ piece, rank, file })
    }

    const newPosition = arbiter.performMove({
      position: appState.position[appState.position.length - 1],
      piece,
      rank,
      file,
      x,
      y,
    })
    dispatch(makeNewMove({ newPosition }))

    //TODO: add isCheckMate
    // if (arbiter.insufficientMaterial(newPosition)) {
    //   dispatch(detectInsufficientMaterial())
    // }
    // if (
    //   arbiter.isStalemate(newPosition, opponent, castleDirection)
    // ) {
    //   dispatch(detectStalemate())
    // } else
    if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
      dispatch(detectCheckmate(piece[0]))
    }
  }

  const wait = (ms) => new Promise((res) => setTimeout(res, ms * 1000))

  const threshold = 300

  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        if (moves > threshold) {
          setSession_name(generateRandomString(10))
          setMoves(0)
          dispatch(setupNewGame())
          return clearInterval(id)
        }
        setMoves((prev) => prev + 1)

        console.log("moves", moves)

        await fetchToServer(appState)
      } catch (error) {
        console.log("error", error)
      }
    }, 500)

    return () => clearInterval(id)
  }, [appState, moves, session_name])

  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="upon-pieces"
        ref={ref}
      >
        <div className="pieces">
          {currentPosition.map((r, rank) =>
            r.map((f, file) =>
              currentPosition[rank][file] ? (
                <Piece
                  key={rank + "-" + file}
                  rank={rank}
                  file={file}
                  piece={currentPosition[rank][file]}
                />
              ) : null
            )
          )}
        </div>
      </div>
      <div style={{ position: "absolute", top: "0" }}>
        <button onClick={fetchToServer}>Fetch</button>

        <span>Status : {serverStatus}</span>
      </div>
    </>
  )
}

export default Pieces

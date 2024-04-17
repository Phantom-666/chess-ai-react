import {
  CAN_CASTLE,
  CHECKMATE,
  CLEAR_CANDIDATE_MOVES,
  CLOSE_POPUP,
  GENERATE_CANDIDATE_MOVES,
  INSUFFICIENT_MATERIAL,
  MAKE_NEW_MOVE,
  NEW_GAME,
  OPEN_PROMOTION,
  STALEMATE,
  TAKE_BACK,
} from "./types"

export const makeNewMove = (payload) => {
  return {
    type: MAKE_NEW_MOVE,
    payload,
  }
}

export const generateCandidateMoves = (payload) => {
  return { type: GENERATE_CANDIDATE_MOVES, payload }
}

export const clearCandidates = () => {
  return { type: CLEAR_CANDIDATE_MOVES }
}

export const openPromotion = (payload) => {
  return { type: OPEN_PROMOTION, payload }
}

export const closePopup = () => {
  return { type: CLOSE_POPUP }
}

export const updateCastling = (payload) => {
  return { type: CAN_CASTLE, payload }
}

export const detectStalemate = () => {
  return { type: STALEMATE }
}

export const detectInsufficientMaterial = () => {
  return { type: INSUFFICIENT_MATERIAL }
}

export const setupNewGame = () => {
  return {
    type: NEW_GAME,
  }
}

export const detectCheckmate = (payload) => {
  return { type: CHECKMATE, payload }
}

export const takeBack = () => {
  return {
    type: TAKE_BACK,
  }
}

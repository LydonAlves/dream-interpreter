// Cuenta un sueño
// ¿Qué son los simbolos principales para ti?
// Emoción: ¿Qué sentiste?
// ¿Qué está pasando en tu vida en este momento?
// Ponle un titulo a tu sueño como si fuera una pelicula

export type DreamInfoState = {
  dreamText: string;
  symbols: string;
  emotion: string;
  currentLife: string;
  dreamTitle: string;
}

export type DreamInfoAction =
  | {type: 'SET_DREAM_TEXT'; payload: string}
  | {type: 'SET_SYMBOLS'; payload: string}
  | {type: 'SET_EMOTION'; payload: string}
  | {type: 'SET_CURRENT_LIFE'; payload: string}
  | {type: 'SET_DREAM_TITLE'; payload: string}


export const initialState: DreamInfoState = {
  dreamText: '',
  symbols: '',
  emotion: '',
  currentLife: '',
  dreamTitle: '',
}

export const dreamInfoReducer = (state: DreamInfoState, action: DreamInfoAction) => {
  switch (action.type) {
    case "SET_DREAM_TEXT":
    case "SET_SYMBOLS":
    case "SET_EMOTION":
    case "SET_CURRENT_LIFE":
    case "SET_DREAM_TITLE":
      return { ...state, [action.type.replace("SET_", "").toLowerCase()]: action.payload };
      default:
        return state;
  };
}

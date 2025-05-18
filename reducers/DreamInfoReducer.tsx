// Cuenta un sueño
// ¿Qué son los simbolos principales para ti?
// Emoción: ¿Qué sentiste?
// ¿Qué está pasando en tu vida en este momento?
// Ponle un titulo a tu sueño como si fuera una pelicula
 
export type DreamInfoState = {
  inputs: {
    dream_text: string; 
    emotion: string;
    current_life: string;
    dream_title: string;
  };
  //! this could be simplified by directly putting: symbols_interpreted 
  symbols: {
    symbols_interpreted: { symbol: string; meaning: string; isEditing: boolean }[];
  };
  metadata: {
    dream_id: string;
    form_step: string;
  };
}

export type InputAction =
  | {type: 'SET_DREAM_TEXT'; payload: string}
  | {type: 'SET_EMOTION'; payload: string}
  | {type: 'SET_CURRENT_LIFE'; payload: string}
  | {type: 'SET_DREAM_TITLE'; payload: string}

export type MetadataAction =
  | {type: 'SET_DREAM_ID'; payload: string}
  | {type: 'SET_FORM_STEP'; payload: string}

export type SymbolAction =
  | {type: 'SET_SYMBOLS_INTERPRETED'; payload: {symbol:string, meaning: string, isEditing: boolean}[]};

export type DreamInfoAction = InputAction | MetadataAction | SymbolAction;


export const dreamInfoReducer = (
  state: DreamInfoState, 
  action: DreamInfoAction
): DreamInfoState => {
  switch (action.type) {
    //! I need to updated the nested inputs
    case 'SET_DREAM_TEXT':
      return { ...state, inputs: { ...state.inputs, dream_text: action.payload } };
    case 'SET_EMOTION':
      return { ...state, inputs: { ...state.inputs, emotion: action.payload } };
    case 'SET_CURRENT_LIFE':
      return { ...state, inputs: { ...state.inputs, current_life: action.payload } };
    case 'SET_DREAM_TITLE':
      return { ...state, inputs: { ...state.inputs, dream_title: action.payload } };

  //? metadata    
    case 'SET_DREAM_ID':
      return { ...state, metadata: { ...state.metadata, dream_id: action.payload } };
    case 'SET_FORM_STEP':
      return { ...state, metadata: { ...state.metadata, form_step: action.payload } };
    
  //? symbols  
    case 'SET_SYMBOLS_INTERPRETED':
      return { 
        ...state, 
        symbols: { 
          ...state.symbols, 
          symbols_interpreted: action.payload,
        }
       };
    default:
      return state;
  }
};

export const initialState: DreamInfoState = {
  inputs: {
    dream_text: '',
    emotion: '',
    current_life: '',
    dream_title: '',
  },
  symbols: {
    symbols_interpreted: [],
  },
  metadata: {
    dream_id: '',
    form_step: 'intro',
  }
}
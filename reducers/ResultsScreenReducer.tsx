export type ResultsState = {
  resonate: string;
  disagree: string;
  improve: string;
}

export type ResultsAction = 
| {type: 'SET_RESONATE'; payload: string}
| {type: 'SET_DISAGREE'; payload: string}
| {type: 'SET_IMPROVE'; payload: string}

export const resultsInitialState: ResultsState = {
  resonate: '',
  disagree: '',
  improve: '',
}

export const resultsReducer = (state: ResultsState, action: ResultsAction) =>{
  switch (action.type) {
    case "SET_RESONATE":
    case "SET_DISAGREE":
    case "SET_IMPROVE":
      return { ...state, [action.type.replace("SET_", "").toLowerCase()]: action.payload };
      default:
        return state;
  }
}
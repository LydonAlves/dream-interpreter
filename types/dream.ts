export type SymbolItem = {
  symbol: string;
  meaning: string;
}

export type Dream = {
  user_id: string
  dream_id: string
  title: string
  dream_text: string
  symbols: SymbolItem[]; 
  emotion: string
  context: string
  date: number;   
  finalInterpretation: string
} 
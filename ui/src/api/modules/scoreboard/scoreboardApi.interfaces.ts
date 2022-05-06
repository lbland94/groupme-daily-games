export interface BaseScore {
  game:
    | 'Wordle'
    | 'nerdlegame'
    | 'mini nerdlegame'
    | 'instant nerdle'
    | 'globle'
    | 'semantle';
  info: Record<string, string | number | boolean>;
  source: string;
  user: string;
  timestamp: number;
}

export interface WordleScore extends BaseScore {
  game: 'Wordle';
  info: {
    number: number;
    score: number;
    emoji: string;
  };
}

export interface NerdleScore extends BaseScore {
  game: 'nerdlegame';
  info: {
    number: number;
    score: number;
    emoji: string;
  };
}

export interface MiniNerdleScore extends BaseScore {
  game: 'mini nerdlegame';
  info: {
    number: number;
    score: number;
    emoji: string;
  };
}

export interface InstantNerdleScore extends BaseScore {
  game: 'instant nerdle';
  info: {
    number: number;
    time: number;
  };
}

export interface GlobleScore extends BaseScore {
  game: 'globle';
  info: {
    date: string;
    streak: number;
    average: number;
    emoji: string;
    score: number;
  };
}

export interface SemantleScore extends BaseScore {
  game: 'semantle';
  info: {
    number: number;
    score: number;
    hints?: number;
  };
}

export type Score =
  | WordleScore
  | NerdleScore
  | MiniNerdleScore
  | InstantNerdleScore
  | GlobleScore
  | SemantleScore;

export interface Score {
  source: string;
  game: string;
  info: Record<string, string | number | boolean>;
  user: string;
  timestamp: number;
}

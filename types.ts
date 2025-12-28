
export interface WrappedInsight {
  title: string;
  content: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export interface UserData {
  username: string;
  profileUrl: string;
  generatedRank: string;
  insights: WrappedInsight[];
}

export enum AppState {
  LANDING = 'LANDING',
  LOADING = 'LOADING',
  EXPERIENCE = 'EXPERIENCE',
  ERROR = 'ERROR'
}

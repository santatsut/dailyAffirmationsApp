export type Category =
  | "selfLove"
  | "motivation"
  | "relationships"
  | "heartbreak";

export type AffirmationItem = {
  id: string;
  hanzi?: string;
  pinyin?: string;
  meaning?: string;
  text?: string;
};

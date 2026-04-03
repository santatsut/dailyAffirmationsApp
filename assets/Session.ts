import AsyncStorage from "@react-native-async-storage/async-storage";
import { IdiomItem } from "../data/dataTypes";

const SESSION_KEY = "dailySession";

export type Session = {
  date: string;
  count: number;
  index: number;
  queue: IdiomItem[];
};

const getToday = () => new Date().toISOString().split("T")[0];

export const loadSession = async (allIdioms: IdiomItem[]): Promise<Session> => {
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  const today = getToday();

  if (stored) {
    const parsed: Session = JSON.parse(stored);

    if (parsed.date === today) {
      return parsed; // ✅ continue session
    }
  }

  // 🆕 new day → create new session
  const shuffled = [...allIdioms].sort(() => Math.random() - 0.5);

  const newSession: Session = {
    date: today,
    count: 0,
    index: 0,
    queue: shuffled,
  };

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));

  return newSession;
};

export const saveSession = async (session: Session) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

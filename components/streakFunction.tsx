import AsyncStorage from "@react-native-async-storage/async-storage";

export const UpdateStreak = async () => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    const lastDateStr = await AsyncStorage.getItem("lastStreakDate");
    const streakCountStr = await AsyncStorage.getItem("currentStreak");

    let streakCount = streakCountStr ? parseInt(streakCountStr, 10) : 0;

    if (!lastDateStr) {
      // First time
      streakCount = 1;
    } else {
      const lastDate = new Date(lastDateStr);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // consecutive day
        streakCount += 1;
      } else if (diffDays > 1) {
        // missed a day, reset streak
        streakCount = 1;
      }
      // if diffDays === 0, already updated today, do nothing
    }

    await AsyncStorage.setItem("lastStreakDate", todayStr);
    await AsyncStorage.setItem("currentStreak", streakCount.toString());
    console.log("Updated streak:", streakCount);

    return streakCount;
  } catch (error) {
    console.error("Error updating streak:", error);
    return 0;
  }
};

export default UpdateStreak;

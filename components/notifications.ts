import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 👇 Foreground behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 👇 Ask permission (Android 13+ requires this)
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// 👇 Create Android channel (REQUIRED)
export async function setupNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("dailyIdiom", {
      name: "Daily Idiom",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }
}

// 👇 Schedule daily notification
export async function scheduleDailyNotification(
  hour: number,
  minute: number
) {
  // Cancel previous scheduled ones (prevents duplicates)
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🀄 Daily Idiom",
      body: "Check out today's Chinese idiom!",
      sound: true,
    },
    trigger: {
      channelId: "dailyIdiom", // must match channel above
      hour,
      minute,
      repeats: true,
    } as Notifications.CalendarTriggerInput,
  });
}
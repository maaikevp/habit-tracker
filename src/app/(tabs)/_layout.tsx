import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar.circle" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="streaks">
        <NativeTabs.Trigger.Icon sf="chart.bar" md="settings" />
        <NativeTabs.Trigger.Label>Streaks</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add-habit">
        <NativeTabs.Trigger.Icon sf="plus.bubble" md="settings" />
        <NativeTabs.Trigger.Label>Add habit</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="help">
        <NativeTabs.Trigger.Icon sf="questionmark.circle" md="help" />
        <NativeTabs.Trigger.Label>Help</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

// plus.app
// plus.square.fill

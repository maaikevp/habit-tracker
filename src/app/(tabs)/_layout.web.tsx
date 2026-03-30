import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#d57515d7" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's habits",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="calendar-today"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: "Add habit",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "help",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="question-mark" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

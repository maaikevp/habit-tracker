import { animePalette } from "@/theme/animeTheme";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Habit {
  id: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // TODO: Fetch habits from storage or API
    const mockHabits: Habit[] = [
      {
        id: "1",
        name: "Morning Exercise",
        currentStreak: 12,
        longestStreak: 25,
        lastCompletedDate: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Reading",
        currentStreak: 8,
        longestStreak: 30,
        lastCompletedDate: new Date().toISOString(),
      },
    ];
    setHabits(mockHabits);
  }, []);

  const renderHabit = ({ item }: { item: Habit }) => (
    <View style={styles.habitCard}>
      <Text style={styles.habitName}>{item.name}</Text>
      <View style={styles.streakContainer}>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Current</Text>
          <Text style={styles.streakNumber}>{item.currentStreak}</Text>
        </View>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Longest</Text>
          <Text style={styles.streakNumber}>{item.longestStreak}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bgRibbon} />
      <Text style={styles.title}>Power Level: Streaks</Text>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: animePalette.sky,
    padding: 16,
  },
  bgRibbon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "#d9f0ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: animePalette.ink,
    letterSpacing: 0.4,
  },
  list: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: animePalette.cloud,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#d8e9f8",
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: animePalette.ink,
  },
  streakContainer: {
    flexDirection: "row",
    gap: 16,
  },
  streakItem: {
    flex: 1,
    alignItems: "center",
  },
  streakLabel: {
    fontSize: 12,
    color: animePalette.inkSoft,
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: animePalette.sakuraDeep,
  },
});

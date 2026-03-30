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
      <Text style={styles.title}>Your Streaks</Text>
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
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
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
    color: "#666",
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#c4b030",
  },
});

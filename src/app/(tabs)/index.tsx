import { useAuth } from "@/context/AuthContext";
import { animePalette } from "@/theme/animeTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";
import { supabase } from "../../../lib/supabase/client";

type Habit = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  frequency: string;
  streak_count: number;
  last_completed: string | null;
  created_at: string;
};

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("habits")
        .select(
          "id, user_id, title, description, frequency, streak_count, last_completed, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHabits((data as Habit[]) ?? []);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleDeleteHabit = async (id: string) => {
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const calcNewStreak = (habit: Habit): number | null => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    if (!habit.last_completed) return 1;

    const last = new Date(habit.last_completed);
    const lastStart = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate(),
    ).getTime();

    // Window in ms within which the streak continues (based on frequency)
    const windowMs =
      habit.frequency === "weekly"
        ? 7 * 24 * 60 * 60 * 1000
        : habit.frequency === "monthly"
          ? 31 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000; // daily

    // Already completed in the current window — nothing to do
    if (todayStart - lastStart < windowMs) return null;

    // Completed in the previous window — continue streak
    if (todayStart - lastStart < windowMs * 2) return habit.streak_count + 1;

    // Gap too large — streak broken, restart at 1
    return 1;
  };

  const handleCompleteHabit = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const newStreak = calcNewStreak(habit);
    if (newStreak === null) return; // already completed in this window

    const currentDate = new Date().toISOString();

    try {
      const { error } = await supabase
        .from("habits")
        .update({
          streak_count: newStreak,
          last_completed: currentDate,
        })
        .eq("id", id);

      if (error) throw error;

      setHabits((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, streak_count: newStreak, last_completed: currentDate }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const renderRightActions = () => (
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
      />
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your daily habits</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Swipe right to complete, left to delete
          </Text>
        </View>
        <Button mode="text" onPress={signOut} icon="logout">
          Sign out
        </Button>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={animePalette.sakuraDeep} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="bodyMedium" style={styles.emptyStateText}>
                No habits found. Add a habit to get started.
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <Swipeable
                ref={(ref) => {
                  swipeableRefs.current[habit.id] = ref;
                }}
                key={habit.id}
                overshootLeft={false}
                overshootRight={false}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableOpen={(direction) => {
                  if (direction === "left") {
                    handleDeleteHabit(habit.id);
                  } else if (direction === "right") {
                    handleCompleteHabit(habit.id);
                  }
                  swipeableRefs.current[habit.id]?.close();
                }}
              >
                <Surface style={styles.card} elevation={2}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{habit.title}</Text>
                    <Text style={styles.cardDescription}>
                      {habit.description || "No description"}
                    </Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.streakBadge}>
                        <MaterialCommunityIcons
                          name="fire"
                          size={20}
                          color="#ff9800"
                        />
                        <Text style={styles.streakText}>
                          {habit.streak_count} day streak
                        </Text>
                      </View>
                      <View style={styles.frequencyBadge}>
                        <Text style={styles.frequencyText}>
                          {habit.frequency.charAt(0).toUpperCase() +
                            habit.frequency.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Surface>
              </Swipeable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: animePalette.sky,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: animePalette.ink,
    letterSpacing: 0.4,
  },
  subtitle: {
    color: animePalette.inkSoft,
    marginTop: 2,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 14,
    borderRadius: 18,
    backgroundColor: animePalette.cloud,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#d9ebf9",
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: animePalette.ink,
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: animePalette.inkSoft,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: animePalette.peach,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#b25e23",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: animePalette.mint,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#167c78",
    fontWeight: "bold",
    fontSize: 14,
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: animePalette.danger,
    borderRadius: 18,
    marginBottom: 14,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: animePalette.success,
    borderRadius: 18,
    marginBottom: 14,
    marginTop: 2,
    paddingRight: 16,
  },
  emptyState: {
    paddingTop: 48,
    alignItems: "center",
  },
  emptyStateText: {
    color: animePalette.inkSoft,
  },
});

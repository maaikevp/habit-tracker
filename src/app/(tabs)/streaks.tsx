import { useAuth } from "@/context/AuthContext";
import { animePalette } from "@/theme/animeTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase/client";

interface Habit {
  id: string;
  title: string;
  streak_count: number;
  last_completed: string | null;
  frequency: string;
}

const MEDALS = ["🥇", "🥈", "🥉"] as const;
const MEDAL_STYLES: Record<
  number,
  { bg: string; text: string; label: string }
> = {
  0: { bg: "#fff8e1", text: "#b8860b", label: "Gold" },
  1: { bg: "#f0f0f0", text: "#606060", label: "Silver" },
  2: { bg: "#fbe9e7", text: "#a04000", label: "Bronze" },
};

export default function StreaksScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        .select("id, title, streak_count, last_completed, frequency")
        .eq("user_id", user.id)
        .order("streak_count", { ascending: false });

      if (error) throw error;
      setHabits((data as Habit[]) ?? []);
    } catch (error) {
      console.error("Error fetching streaks:", error);
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const dayStart = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const isStreakBroken = (habit: Habit): boolean => {
    if (!habit.last_completed || habit.streak_count === 0) return false;
    const windowMs =
      habit.frequency === "weekly"
        ? 7 * 24 * 60 * 60 * 1000
        : habit.frequency === "monthly"
          ? 31 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;
    const diff =
      dayStart(new Date()) - dayStart(new Date(habit.last_completed));
    return diff >= windowMs * 2;
  };

  const formatLastCompleted = (iso: string | null) => {
    if (!iso) return "Never";
    const diffDays = Math.floor(
      (dayStart(new Date()) - dayStart(new Date(iso))) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const renderHabit = ({ item, index }: { item: Habit; index: number }) => {
    const broken = isStreakBroken(item);
    return (
      <View style={[styles.habitCard, broken && styles.habitCardBroken]}>
        {!broken && index < 3 && item.streak_count > 0 && (
          <View
            style={[
              styles.medalBadge,
              { backgroundColor: MEDAL_STYLES[index].bg },
            ]}
          >
            <Text
              style={[styles.medalText, { color: MEDAL_STYLES[index].text }]}
            >
              {MEDALS[index]} {MEDAL_STYLES[index].label}
            </Text>
          </View>
        )}
        <View style={styles.habitHeader}>
          <Text style={styles.habitName}>{item.title}</Text>
          <Text style={styles.frequencyTag}>
            {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
          </Text>
        </View>
        <View style={styles.streakContainer}>
          <View style={styles.streakMain}>
            <MaterialCommunityIcons
              name="fire"
              size={28}
              color={broken ? "#bbb" : animePalette.sakuraDeep}
            />
            <Text
              style={[styles.streakNumber, broken && styles.streakNumberBroken]}
            >
              {item.streak_count}
            </Text>
            <Text style={styles.streakUnit}>
              {item.streak_count === 1 ? "day" : "days"}
            </Text>
          </View>
          <View style={styles.lastCompletedBox}>
            <Text style={styles.streakLabel}>Last done</Text>
            <Text style={styles.lastCompletedText}>
              {formatLastCompleted(item.last_completed)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power Level: Streaks</Text>
      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={animePalette.sakuraDeep} />
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No habits yet. Add one to start your streak!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: animePalette.sky,
    padding: 16,
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
    paddingBottom: 16,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  habitCardBroken: {
    borderColor: "#f0c0c0",
    backgroundColor: "#fdf6f6",
  },
  streakNumberBroken: {
    color: "#bbb",
  },
  medalBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  medalText: {
    fontSize: 12,
    fontWeight: "700",
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: animePalette.ink,
    flexShrink: 1,
  },
  frequencyTag: {
    fontSize: 12,
    color: "#167c78",
    fontWeight: "600",
    backgroundColor: animePalette.mint,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  streakContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: animePalette.sakuraDeep,
  },
  streakUnit: {
    fontSize: 13,
    color: animePalette.inkSoft,
    fontWeight: "500",
    marginTop: 4,
  },
  lastCompletedBox: {
    alignItems: "flex-end",
  },
  streakLabel: {
    fontSize: 11,
    color: animePalette.inkSoft,
    marginBottom: 2,
  },
  lastCompletedText: {
    fontSize: 14,
    fontWeight: "600",
    color: animePalette.ink,
  },
  emptyState: {
    paddingTop: 48,
    alignItems: "center",
  },
  emptyStateText: {
    color: animePalette.inkSoft,
  },
});

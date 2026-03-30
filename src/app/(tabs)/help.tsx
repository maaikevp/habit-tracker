import { animePalette } from "@/theme/animeTheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How Habit Tracker Works</Text>
      <Text style={styles.subtitle}>
        A quick guide to getting the most from your streak journey.
      </Text>

      <Surface style={styles.card} elevation={1}>
        <Text style={styles.cardTitle}>1. Sign in</Text>
        <Text style={styles.cardText}>
          Create an account or log in. Your habits are linked to your profile so
          your progress is saved for your account.
        </Text>
      </Surface>

      <Surface style={styles.card} elevation={1}>
        <Text style={styles.cardTitle}>2. Add habits</Text>
        <Text style={styles.cardText}>
          Add a title, optional description, and choose a frequency: daily,
          weekly, or monthly.
        </Text>
      </Surface>

      <Surface style={styles.card} elevation={1}>
        <Text style={styles.cardTitle}>3. Track with swipes</Text>
        <Text style={styles.cardText}>
          On the Home tab, swipe right to complete a habit and swipe left to
          delete it.
        </Text>
      </Surface>

      <Surface style={styles.card} elevation={1}>
        <Text style={styles.cardTitle}>4. See your streak ranking</Text>
        <Text style={styles.cardText}>
          The Streaks tab ranks habits by current streak and shows medals for
          the top 3 spots.
        </Text>
      </Surface>

      <Surface style={styles.card} elevation={1}>
        <Text style={styles.cardTitle}>Streak rules</Text>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.cardText}>
            Only one completion per habit per streak window is counted.
          </Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.cardText}>
            Completing on time increases your streak.
          </Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.cardText}>
            Missing too long resets that habit streak to 1 on next completion.
          </Text>
        </View>
      </Surface>

      <Surface style={styles.card} elevation={1}>
        <Text style={styles.cardTitle}>FAQ</Text>
        <Text style={styles.question}>Can I edit habits?</Text>
        <Text style={styles.cardText}>
          Current version supports add, complete, and delete.
        </Text>
        <Text style={styles.question}>Do medals stay forever?</Text>
        <Text style={styles.cardText}>
          No. Medals update automatically based on current streak ranking.
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: animePalette.sky,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: animePalette.ink,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: animePalette.inkSoft,
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: animePalette.cloud,
    borderWidth: 1,
    borderColor: "#d8e9f8",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: animePalette.ink,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: animePalette.inkSoft,
    lineHeight: 20,
    flex: 1,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    color: animePalette.ink,
    marginTop: 1,
  },
  question: {
    marginTop: 8,
    marginBottom: 2,
    fontSize: 14,
    fontWeight: "700",
    color: animePalette.ink,
  },
});

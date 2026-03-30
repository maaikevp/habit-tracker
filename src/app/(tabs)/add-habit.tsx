import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase/client";

export default function AddHabitScreen() {
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleAddHabit = async () => {
    if (!habitName.trim()) return;
    if (!user) {
      showMessage("Error", "You must be signed in to add a habit.");
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase.from("habits").insert({
        user_id: user.id,
        title: habitName.trim(),
        description: description.trim(),
        frequency,
        streak_count: 0,
        last_completed: now,
        created_at: now,
      });

      if (error) throw error;

      console.log("Habit successfully added to database:", {
        user_id: user.id,
        title: habitName.trim(),
        description: description.trim(),
        frequency,
      });

      setHabitName("");
      setDescription("");
      setFrequency("daily");
      showMessage("Success", "Habit successfully added to database.");
    } catch (error) {
      console.error("Error adding habit:", error);
      showMessage("Error", "Failed to add habit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add new habit</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Habit name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter habit name"
          value={habitName}
          onChangeText={setHabitName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter habit description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyContainer}>
          {["daily", "weekly", "monthly"].map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                frequency === freq && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text style={styles.frequencyText}>{freq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddHabit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add Habit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: "top",
  },
  frequencyContainer: {
    flexDirection: "row",
    gap: 6,
    alignSelf: "flex-start",
  },
  frequencyButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#999",
    borderRadius: 20,
    alignItems: "center",
  },
  frequencyButtonActive: {
    backgroundColor: "#1d1d1d",
    borderColor: "#999",
  },
  frequencyText: {
    textTransform: "capitalize",
    color: "#f7f9fb",
  },
  addButton: {
    backgroundColor: "#666",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

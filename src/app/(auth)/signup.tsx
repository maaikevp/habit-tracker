import { useAuth } from "@/context/AuthContext";
import { animePalette } from "@/theme/animeTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 3) {
      Alert.alert("Error", "Password must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      router.push("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Start Your Journey</Text>
        <Text style={styles.subtitle}>Create an account and level up</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Email..."
            placeholderTextColor={"#999"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password..."
            placeholderTextColor={"#999"}
            autoComplete="password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            {isLoading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.linkButtonText}>
              Already have an account?{" "}
              <Text style={styles.linkButtonTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: animePalette.sky,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: animePalette.ink,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: animePalette.inkSoft,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: animePalette.cloud,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d4e7f5",
    color: animePalette.ink,
  },
  button: {
    backgroundColor: animePalette.sakuraDeep,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkButtonText: {
    color: animePalette.inkSoft,
    fontSize: 14,
  },
  linkButtonTextBold: {
    fontWeight: "600",
    color: animePalette.sakuraDeep,
  },
});

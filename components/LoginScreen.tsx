import { CURRENT_SERVER_URL } from "@/utilities";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAuth } from "@/app/context/authContext";

export default function LoginScreen(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${CURRENT_SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta del server");
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Accesso riuscito!");
        login();
      } else {
        Alert.alert("Errore", data.message || "Accesso fallito");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Errore di connessione al server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accedi</Text>
      <TextInput
        placeholder="Nome utente"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Pressable onPress={handleLogin} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Accedi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    marginTop: 50,
  },
  title: {
    marginTop: 50,
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { CURRENT_SERVER_URL } from "@/utilities";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/app/context/authContext";

export default function LoginScreen(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Stato per il caricamento
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true); // Inizia il caricamento
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
    } finally {
      setLoading(false); // Termina il caricamento
    }
  };

  return (
    <View>
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
      <Pressable
        onPress={handleLogin}
        style={styles.buttonContainer}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Accedi</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonContainer: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { CURRENT_SERVER_URL } from "@/utilities";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

export default function LoginScreen(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${CURRENT_SERVER_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        mode: "no-cors", // Debug temporaneo
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Accesso riuscito!");
      } else {
        Alert.alert("Errore", data.message || "Accesso fallito");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Errore di connessione al server");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Nome utente:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Button title="Accedi" onPress={handleLogin} />
    </View>
  );
}

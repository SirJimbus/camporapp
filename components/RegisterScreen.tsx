import { CURRENT_SERVER_URL } from "@/utilities";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "@/app/context/authContext";
export default function RegisterScreen(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth(); // Funzione per impostare lo stato come loggato

  const handleRegister = async () => {
    try {
      const response = await fetch(`${CURRENT_SERVER_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        mode: "no-cors",
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Registrazione completata!");
        login(); // Imposta l'utente come loggato
      } else {
        Alert.alert("Errore", data.message || "Registrazione fallita");
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
      <Button title="Registrati" onPress={handleRegister} />
    </View>
  );
}
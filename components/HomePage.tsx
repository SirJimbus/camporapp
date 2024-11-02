import React from "react";
import { Text, View, Button } from "react-native";
import { useAuth } from "@/app/context/authContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      <Text>Esplora luoghi Magici</Text>
      <Text>Aggiungi luogo</Text>

      {isAuthenticated ? (
        // Bottone di logout quando l'utente è loggato
        <Button title="Logout" onPress={logout} />
      ) : (
        // Form di login quando l'utente non è loggato
        <View>
          <LoginScreen />
          <RegisterScreen />
        </View>
      )}
    </View>
  );
}

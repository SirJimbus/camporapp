import React from "react";
import { Text, View, Button, Alert } from "react-native";
import * as Updates from "expo-updates";
import { useAuth } from "@/app/context/authContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();

  // Funzione per forzare il controllo degli aggiornamenti
  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Aggiornamento disponibile",
          "Riavvio per applicare l'aggiornamento."
        );
        await Updates.reloadAsync();
      } else {
        Alert.alert(
          "Nessun aggiornamento disponibile",
          "L'app è già aggiornata."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Impossibile controllare gli aggiornamenti.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Esplora luoghi Magici</Text>
      <Text>Aggiungi luogo</Text>

      {isAuthenticated ? (
        // Bottone di logout e bottone per controllare aggiornamenti quando l'utente è loggato
        <>
          <Button title="Logout" onPress={logout} />
          <Button title="Controlla Aggiornamenti" onPress={checkForUpdates} />
        </>
      ) : (
        // Form di login quando l'utente non è loggato

        <LoginScreen />
      )}
    </View>
  );
}

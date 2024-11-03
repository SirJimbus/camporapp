import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import * as Updates from "expo-updates";
import { useAuth } from "@/app/context/authContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Stato per alternare tra Login e Register

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
    <View style={styles.container}>
      <Text>Esplora luoghi Magici</Text>
      <Text>Aggiungi luogo</Text>

      {isAuthenticated ? (
        <>
          <Button title="Logout" onPress={logout} />
          <Button title="Controlla Aggiornamenti" onPress={checkForUpdates} />
        </>
      ) : (
        <>
          <Button
            title="Accedi o Registrati"
            onPress={() => setModalVisible(true)}
          />

          {/* Modal per Login/Register */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  {isLogin ? "Accedi" : "Registrati"}
                </Text>

                {/* Condizionale per mostrare Login o Register */}
                {isLogin ? <LoginScreen /> : <RegisterScreen />}

                <Pressable
                  style={styles.switchButton}
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text style={styles.switchButtonText}>
                    {isLogin
                      ? "Non hai un account? Registrati"
                      : "Hai già un account? Accedi"}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Chiudi</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

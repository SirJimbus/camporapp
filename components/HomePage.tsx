import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Updates from "expo-updates";
import { useAuth } from "@/app/context/authContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { CURRENT_SERVER_URL } from "@/utilities";

interface Place {
  streetName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [streetName, setStreetName] = useState("");
  const [places, setPlaces] = useState<Place[]>([]); // Stato per i luoghi

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

  // Funzione per ottenere i luoghi dal backend
  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${CURRENT_SERVER_URL}/places`);
      const data = await response.json();
      if (data.success) {
        setPlaces(data.places); // Memorizza i luoghi nello stato
      } else {
        Alert.alert("Errore", data.message || "Impossibile ottenere i luoghi");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Errore di connessione al server");
    }
  };

  // Esegui fetch dei luoghi al caricamento della pagina
  useEffect(() => {
    fetchPlaces();
  }, []);

  // Funzione per salvare il luogo inserito
  const handleAddPlace = async () => {
    try {
      const response = await fetch(`${CURRENT_SERVER_URL}/add-place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streetName: streetName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Luogo aggiunto", `Hai aggiunto: ${streetName}`);
        fetchPlaces(); // Ricarica i luoghi per aggiornare la mappa
      } else {
        Alert.alert(
          "Errore",
          data.message || "Impossibile aggiungere il luogo"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Errore di connessione al server");
    } finally {
      setStreetName("");
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Esplora luoghi Magici</Text>

      <MapView
        style={styles.map}
        // initialRegion={{
        //   latitude: 41.8719, // Centro approssimativo dell'Italia
        //   longitude: 12.5674,
        //   latitudeDelta: 5, // Zoom che copre l'Italia
        //   longitudeDelta: 5,
        // }}
      >
        {places.map((place, index) => {
          // Log delle coordinate di ciascun marker
          console.log(`Marker ${index}:`, place.coordinates);

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: place.coordinates.lat,
                longitude: place.coordinates.lng,
              }}
              // title={place.streetName}
            />
          );
        })}
      </MapView>

      {isAuthenticated ? (
        <>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.addPlaceText}>Aggiungi luogo</Text>
          </Pressable>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            {/* add place */}
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Aggiungi Luogo</Text>

                <TextInput
                  placeholder="Inserisci il nome della strada"
                  value={streetName}
                  onChangeText={setStreetName}
                  style={styles.input}
                />

                <Pressable
                  style={styles.confirmButton}
                  onPress={handleAddPlace}
                >
                  <Text style={styles.confirmButtonText}>Conferma</Text>
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

          <Button title="Logout" onPress={logout} />
          <Button title="Controlla Aggiornamenti" onPress={checkForUpdates} />
        </>
      ) : (
        <>
          <Button
            title="Accedi o Registrati"
            onPress={() => setModalVisible(true)}
          />

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
    // flex: 1,
    padding: 20,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  addPlaceText: {
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#fff",
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
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
});

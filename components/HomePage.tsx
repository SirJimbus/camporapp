import { Text, View, Pressable } from "react-native";
import UserAccess from "@/components/UserAccess";

export default function HomePage() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Esplora luoghi Magici</Text>
      <Text>Aggiungi luogo</Text>
      <UserAccess />
    </View>
  );
}

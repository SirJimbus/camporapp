import { View } from "react-native";
import HomePage from "@/components/HomePage";
import { AuthProvider } from "./context/authContext";

export default function Index() {
  return (
    <View style={{ padding: 20 }}>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </View>
  );
}

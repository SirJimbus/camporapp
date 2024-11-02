import { Pressable, Text, View } from "react-native";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { useState } from "react";

export default function Index() {
  const [showButtons, setShowButtons] = useState(false);
  return (
    <View style={{ padding: 20 }}>
      <Pressable
        onPress={() => setShowButtons(!showButtons)}
        style={{
          padding: 10,
          backgroundColor: "#2196F3",
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Show Buttons</Text>
      </Pressable>

      {showButtons && (
        <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
          <Register />
          <Login />
        </View>
      )}
    </View>
  );
}

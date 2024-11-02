import { Text, View } from "react-native";
import Login from "@/components/Login";
import Register from "@/components/Register";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>Edit app/index.tsx to edit this screen.</Text> */}
      <Register />
      <Login />
    </View>
  );
}

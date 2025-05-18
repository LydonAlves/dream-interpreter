import BottomLoginSheet from "@/components/BottomLoginSheet";
import DisclaimerScreen from "@/components/Disclaimer";
import { useRouter } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AuthIndex() {
  const router = useRouter() 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <DisclaimerScreen/>


        <Image
          source={require("@/assets/images/logo-white.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome to Dream Journal</Text>
        <Text style={styles.subtitle}>Begin your dream journey</Text>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push("/(auth)/login?type=login")}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push("/(auth)/login?type=signup")}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e", 
    justifyContent: "center",
  },
  inner: {
    paddingHorizontal: 30,
    alignItems: "center",
    position: 'relative',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#f0f0f5",
  },
  signupButton: {
    backgroundColor: "#f0f0f5",
  },
  loginText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  signupText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});

import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { signIn } from "../utils/auth";

import typewriterImg from "../assets/placeholder-typewriter.png";
import googleImg from "../assets/google.png";
import appleImg from "../assets/apple.png";

// Placeholder SVG illustration (replace with your own asset if needed)
const Illustration = () => (
  <View style={styles.illustrationContainer}>
    <Image
      source={typewriterImg}
      style={{ width: 220, height: 180, resizeMode: "contain" }}
    />
  </View>
);

export default function AuthScreen() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
      router.replace("/"); // Navigate to home on success
    } catch {
      // Handle error (optional)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EveryNote</Text>
      <Text style={styles.subtitle}>
        Capture your thoughts, your way.{"\n"}Text, voice, or media—<Text style={styles.brand}>EveryNote</Text> makes it effortless to record your day and reflect with AI-powered clarity.
      </Text>
      <Illustration />
      <View style={{ marginTop: 32, width: "100%" }}>
        <Pressable style={styles.googleBtn} onPress={handleGoogleLogin}>
          <Image source={googleImg} style={styles.icon} />
          <Text style={styles.btnText}>Log In with Google</Text>
        </Pressable>
        <Pressable style={styles.appleBtn}>
          <Image source={appleImg} style={styles.icon} />
          <Text style={styles.btnText}>Log In with Apple</Text>
        </Pressable>
      </View>
      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111112",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    marginTop: 24,
  },
  subtitle: {
    color: "#d1d1d1",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
    fontFamily: "System",
  },
  brand: {
    fontStyle: "italic",
    color: "#fff",
  },
  illustrationContainer: {
    marginVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: 280,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: 280,
    alignSelf: "center",
    marginBottom: 8,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  terms: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
  },
}); 
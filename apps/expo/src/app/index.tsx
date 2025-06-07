import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Image, TextInput } from "react-native";
// @ts-ignore: 10tap-editor may not have types
import { Editor } from "10tap-editor";
// If you have react-native-reusables installed, you can import Button, etc. from it
// import { Button } from "react-native-reusables";
import { useAuthStore } from "../utils/auth-store";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { initDB, fetchNotes, insertNote, updateNote, Note } from "../utils/notes-db";
import uuid from "react-native-uuid";

// Placeholder icons (replace with your own assets if needed)
import searchIcon from "../assets/search.png";
import calendarIcon from "../assets/calendar.png";
import profileIcon from "../assets/profile.png";

const categories = ["General", "Meeting", "To-Do"];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("To-Do");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const logout = useAuthStore((s) => s.logout);
  const navigation = useNavigation();

  // Initialize DB and fetch notes on mount
  useEffect(() => {
    (async () => {
      await initDB();
      const allNotes = await fetchNotes();
      setNotes(allNotes);
    })();
  }, []);

  // Handler for logout with confirmation dialog
  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            // @ts-ignore
            navigation.navigate("Auth");
          },
        },
      ]
    );
  };

  // Handler to save a new note or update existing
  const handleSaveNote = async () => {
    if (note.trim().length === 0) return;
    const now = new Date().toISOString();
    if (editingNoteId) {
      // Update existing note
      const updated: Note = {
        id: editingNoteId,
        title: note.slice(0, 20) || "Untitled",
        content: note,
        category: selectedCategory,
        createdAt: notes.find(n => n.id === editingNoteId)?.createdAt || now,
        updatedAt: now,
      };
      await updateNote(updated);
      setEditingNoteId(null);
    } else {
      // Insert new note
      const newNote: Note = {
        id: uuid.v4() as string,
        title: note.slice(0, 20) || "Untitled",
        content: note,
        category: selectedCategory,
        createdAt: now,
        updatedAt: now,
      };
      await insertNote(newNote);
    }
    setNote("");
    // Refresh notes list
    const allNotes = await fetchNotes();
    setNotes(allNotes);
  };

  // Handler to edit a note
  const handleEditNote = (n: Note) => {
    setNote(n.content);
    setEditingNoteId(n.id);
    setSelectedCategory(n.category);
  };

  return (
    <View style={styles.container}>
      {/* Header with logout button */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>EveryNote</Text>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Top bar with search, calendar, and profile icons */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Image source={searchIcon} style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your note"
            placeholderTextColor="#888"
            editable={false}
          />
        </View>
        <Image source={calendarIcon} style={styles.icon} />
        <Image source={profileIcon} style={[styles.icon, styles.profileIcon]} />
      </View>

      {/* Horizontal scroll of categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.createCategoryBtn}>
          <Text style={styles.createCategoryText}>+ Create Category</Text>
        </Pressable>
      </ScrollView>

      {/* Date */}
      <Text style={styles.dateText}>25 Apr, 2025</Text>

      {/* Note editor (10tap-editor) */}
      <View style={styles.editorContainer}>
        {/* @ts-ignore: 10tap-editor may not have types */}
        <Editor
          value={note}
          onChange={setNote}
          placeholder="What's on your mind today?"
          style={styles.editor}
        />
        <Pressable style={{marginTop: 12, alignSelf: 'flex-end', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8}} onPress={handleSaveNote}>
          <Text style={{color: '#111', fontWeight: 'bold'}}>{editingNoteId ? 'Update Note' : 'Save Note'}</Text>
        </Pressable>
      </View>
      {/* Notes list */}
      <ScrollView style={{flex: 1, marginTop: 16, paddingHorizontal: 16}}>
        {notes.map((n) => (
          <Pressable key={n.id} style={{backgroundColor: '#232325', borderRadius: 12, padding: 14, marginBottom: 12}} onPress={() => handleEditNote(n)}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>{n.title}</Text>
            <Text style={{color: '#aaa', marginTop: 4, fontSize: 13}} numberOfLines={2}>{n.content}</Text>
            <Text style={{color: '#888', marginTop: 4, fontSize: 11}}>{n.category} • {new Date(n.updatedAt).toLocaleString()}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111112",
    paddingTop: 48,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#232325",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232325",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
  profileIcon: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#fff",
    marginLeft: 8,
  },
  categoryScroll: {
    paddingLeft: 24,
    marginBottom: 12,
  },
  categoryBtn: {
    backgroundColor: "#232325",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryBtnActive: {
    backgroundColor: "#fff",
  },
  categoryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#111112",
    fontWeight: "700",
  },
  createCategoryBtn: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  createCategoryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
    opacity: 0.7,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    marginLeft: 28,
    marginBottom: 8,
  },
  editorContainer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: "transparent",
    borderRadius: 16,
    overflow: "hidden",
  },
  editor: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    backgroundColor: "transparent",
  },
});

import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Typography from "../common/Typography";
import Input from "../common/Input";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../helpers/store";
import { useSelector } from "react-redux";
import { addTodo, deleteTodo, getTodo } from "../helpers/todoSlice";
import { openDatabase } from "expo-sqlite";
import TodoItem from "../components/TodoItem";
import { ScrollView } from "react-native-gesture-handler";
const LottieView = require("lottie-react-native");

const db = openDatabase("MainDB");

const Todo = () => {
  const todoList = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState<string>("");

  const createTable = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS " +
              "Todos" +
              "(ID INTEGER PRIMARY KEY AUTOINCREMENT, TodoId NUMBER, Todo TEXT)"
          );
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  const loadTodo = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT TodoId as id, Todo as todo FROM Todos",
          [],
          (tx, results) => {
            let len = results.rows.length;
            if (len > 0) {
              dispatch(getTodo(results.rows._array));
              return results.rows._array;
            } else {
              console.log("No data");
            }
          }
        );
      });
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    createTable();
    loadTodo();
  }, []);

  const createTodo = () => {
    if (value === "") return alert("Please what you want to do");
    dispatch(addTodo({ id: Date.now(), todo: value }));
    setValue("");
  };

  const todoDelete = useCallback((id: number) => {
    dispatch(deleteTodo(id));
  }, []);

  const onChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const scrollRef = useRef(null);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Typography
        text="Todo App"
        size={25}
        style={{ marginTop: 50, marginLeft: 20 }}
      />
      <View style={styles.input}>
        <Input
          value={value}
          placeholder="Enter Todo..."
          onChangeText={onChangeText}
          onEndEditing={createTodo}
        />
        <Pressable onPress={createTodo} style={styles.add}>
          <Typography text="Add" size={16} color="#fff" />
        </Pressable>
      </View>
      {todoList?.todo.length === 0 ? (
        <>
          <LottieView
            autoPlay
            source={require("../../assets/todo.json")}
            style={{
              width: 300,
              height: 300,
              alignSelf: "center"
            }}
          />

          <Typography
            text="You have no task for now..."
            size={20}
            style={{
              textAlign: "center"
            }}
          />
        </>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {todoList?.todo.map((item) => (
            <TodoItem
              key={item.id}
              task={item}
              deleteTodo={todoDelete}
              simultaneousHandlers={scrollRef}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Todo;
const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: "space-between"
  },
  add: {
    backgroundColor: "green",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  }
});

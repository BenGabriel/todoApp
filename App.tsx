import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/helpers/store";
import Todo from "./src/screen/Todo";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Todo />
      </GestureHandlerRootView>
    </Provider>
  );
}

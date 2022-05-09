import { Dimensions, StyleSheet } from "react-native";
import React, { FC } from "react";
import { TodoITem } from "../helpers/todoSlice";
import Typography from "../common/Typography";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";

interface Props extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  task: TodoITem;
  deleteTodo?: (id: number) => void;
}

const { width } = Dimensions.get("window");
const THRESHOLD = -width * 0.4;

const TodoItem: FC<Props> = ({ task, deleteTodo, simultaneousHandlers }) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(70);
  const marginVertical = useSharedValue(8);
  const opacity = useSharedValue(1);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      console.log();

      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    },
    onEnd: () => {
      const shouldBeDimissed = translateX.value < THRESHOLD;
      if (shouldBeDimissed) {
        translateX.value = withTiming(-width);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && deleteTodo) {
            runOnJS(deleteTodo)(task.id);
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    }
  });

  const translateView = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value
      }
    ]
  }));

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < THRESHOLD ? 1 : 0);
    return { opacity };
  });

  const rTodoContainer = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value
    };
  });

  return (
    <Animated.View style={[styles.todoContainer, rTodoContainer]}>
      <Animated.View style={[styles.iconContainer, rIconContainerStyle]}>
        <FontAwesome5 name="trash-alt" size={20} color="red" />
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={panGesture}
        simultaneousHandlers={simultaneousHandlers}
      >
        <Animated.View style={[styles.todo, translateView]}>
          <Typography text={task.todo} size={16} />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  todoContainer: {
    width: "100%",
    alignItems: "center"
  },
  todo: {
    width: "90%",
    height: 60,
    backgroundColor: "white",
    justifyContent: "center",
    paddingLeft: 20,
    borderRadius: 10,
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowRadius: 10,
    elevation: 5
  },
  iconContainer: {
    height: 70,
    width: 70,
    position: "absolute",
    right: "10%",
    alignItems: "center",
    justifyContent: "center"
  }
});

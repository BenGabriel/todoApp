import { StyleSheet, TextInput } from "react-native";
import React, { FC } from "react";

interface Props {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  style?: any;
  onEndEditing?: () => void;
}

const Input: FC<Props> = ({
  placeholder,
  onChangeText,
  style,
  onEndEditing,
  value
}) => {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      style={[styles.input, style]}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 0.5,
    borderColor: "#aaa",
    marginVertical: 6,
    width: "80%",
    borderRadius: 10,
    paddingLeft: 20,
    height: 46
  }
});

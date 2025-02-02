import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedTextInput(props: TextInputProps) {
  const {
    style,
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor({}, 'background');
  const color = useThemeColor({}, 'text');
  // borderColorをtabIconDefaultに変更（または他の適切な既存の色に）
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor,
          color,
          borderColor,
        },
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

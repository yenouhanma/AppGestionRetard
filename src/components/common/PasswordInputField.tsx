// src/components/common/PasswordInputField.tsx
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Controller, Control, FieldValues, Path} from 'react-hook-form';
import {TextInput, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../config/theme';

type PasswordInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rules?: object;
  icon?: string;
};

export function PasswordInputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = '••••••••',
  rules = {},
  icon = 'lock',
}: PasswordInputProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            mode="outlined"
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            secureTextEntry={!visible}
            left={<TextInput.Icon icon={icon} />}
            right={
              <TextInput.Icon
                icon={visible ? 'eye-off' : 'eye'}
                onPress={() => setVisible(!visible)}
              />
            }
            error={!!error}
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                error: theme.colors.error,
              },
              roundness: theme.radius.medium,
            }}
          />
          {error && (
            <Text style={styles.errorText}>
              <Icon name="alert-circle" size={14} /> {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    marginBottom: theme.spacing.small,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: theme.spacing.small / 2,
  },
});

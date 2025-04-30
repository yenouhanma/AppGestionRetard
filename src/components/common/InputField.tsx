import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Controller, FieldValues, Path, Control} from 'react-hook-form';
import {TextInput, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../config/theme';

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  icon?: string;
  rules?: object;
};

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
  rules = {},
}: InputFieldProps<T>) {
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
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            left={icon ? <TextInput.Icon icon={icon} /> : undefined}
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

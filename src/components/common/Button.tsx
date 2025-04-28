import React from 'react';
import {TouchableRipple, Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {theme} from '../../config/theme';

interface ButtonProps {
  onPress: () => void;
  label: string;
  mode?: 'contained' | 'outlined' | 'text';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  onPress,
  label,
  mode = 'contained',
  icon,
  loading,
  disabled,
}: ButtonProps) => {
  return (
    <TouchableRipple
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        mode === 'contained' && styles.contained,
        mode === 'outlined' && styles.outlined,
        disabled && styles.disabled,
      ]}>
      <>
        {icon && !loading && (
          <Icon name={icon} size={20} color={getIconColor(mode, disabled)} />
        )}
        {loading && <ActivityIndicator color={getIconColor(mode, disabled)} />}
        <Text
          style={[
            styles.text,
            mode === 'contained' && styles.textContained,
            mode === 'outlined' && styles.textOutlined,
          ]}>
          {label}
        </Text>
      </>
    </TouchableRipple>
  );
};

const getIconColor = (mode: string, disabled?: boolean) => {
  if (disabled) return colors.textSecondary;
  return mode === 'contained' ? colors.background : colors.primary;
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.roundness,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  contained: {
    backgroundColor: theme.colors.primary,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    marginLeft: 8,
    fontWeight: '500',
  },
  textContained: {
    color: theme.colors.background,
  },
  textOutlined: {
    color: theme.colors.primary,
  },
});

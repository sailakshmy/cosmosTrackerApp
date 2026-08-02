import Ionicons from "@expo/vector-icons/Ionicons";
import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type DialogProps = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  actionsStyle?: StyleProp<ViewStyle>;
};

export function Dialog({
  visible,
  title,
  subtitle,
  children,
  actions,
  onClose,
  closeLabel = "Close dialog",
  containerStyle,
  bodyStyle,
  actionsStyle,
}: DialogProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.background === Colors.dark.background;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          {
            paddingTop: insets.top + Spacing.three,
            paddingBottom: insets.bottom + Spacing.three,
            backgroundColor: isDark
              ? "rgba(2, 6, 23, 0.76)"
              : "rgba(15, 23, 42, 0.36)",
          },
        ]}
      >
        <Pressable
          accessibilityLabel={closeLabel}
          accessibilityRole="button"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <ThemedView
          type="backgroundElement"
          style={[
            styles.dialog,
            {
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.96)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: theme.border,
              shadowColor: theme.text,
            },
            containerStyle,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              {subtitle ? (
                <ThemedText
                  type="subtitle"
                  themeColor="accent"
                  style={styles.subtitle}
                >
                  {subtitle}
                </ThemedText>
              ) : null}
              <ThemedText style={styles.title}>{title}</ThemedText>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              accessibilityLabel={closeLabel}
              accessibilityRole="button"
              hitSlop={Spacing.two}
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.backgroundSelected,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.body, bodyStyle]}>{children}</View>

          {actions ? (
            <View
              style={[
                styles.actions,
                { borderTopColor: theme.border },
                actionsStyle,
              ]}
            >
              {actions}
            </View>
          ) : null}
        </ThemedView>
      </View>
    </Modal>
  );
}

export default Dialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
  },
  dialog: {
    width: "100%",
    maxWidth: MaxContentWidth,
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.four,
    paddingBottom: Spacing.three,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  subtitle: {
    textAlign: "left",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
  },
  closeButton: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 18,
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
    borderTopWidth: 1,
    padding: Spacing.three,
  },
});

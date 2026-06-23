import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

export type CardProps = {
  title: string;
  subtitle: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({ title, subtitle, description, style }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          shadowColor: theme.text,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.subtitle} themeColor="accent">
          {subtitle}
        </ThemedText>

        <ThemedText style={styles.title}>{title}</ThemedText>

        {description ? (
          <ThemedText style={styles.description} themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: 0,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.four,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "center",
  },
  title: {
    maxWidth: "100%",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    textAlign: "center",
  },
  description: {
    maxWidth: "100%",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 28,
    textAlign: "center",
  },
});

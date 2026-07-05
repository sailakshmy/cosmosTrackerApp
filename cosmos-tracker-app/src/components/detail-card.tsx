import type { ReactNode } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

export interface DetailCardItem {
  key: string;
  value: ReactNode;
}

export type DetailCardProps = {
  title: string;
  items: DetailCardItem[];
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
};

export function DetailCard({
  title,
  items,
  style,
  itemStyle,
}: DetailCardProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const itemWidth =
    width >= 760
      ? styles.threeColumnItem
      : width >= 520
        ? styles.twoColumnItem
        : styles.oneColumnItem;

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
        <ThemedText style={styles.title}>{title}</ThemedText>

        <View style={styles.detailsGrid}>
          {items.map((item) => (
            <View
              key={item.key}
              style={[
                styles.detailItem,
                itemWidth,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
                itemStyle,
              ]}
            >
              <ThemedText style={styles.detailKey} themeColor="accent">
                {item.key}
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {item.value ?? "Not available"}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default DetailCard;

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
    minWidth: 0,
    gap: Spacing.three,
  },
  title: {
    maxWidth: "100%",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  detailsGrid: {
    minWidth: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  detailItem: {
    minWidth: 0,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  oneColumnItem: {
    flexBasis: "100%",
  },
  twoColumnItem: {
    flexBasis: "48%",
  },
  threeColumnItem: {
    flexBasis: "31.5%",
  },
  detailKey: {
    maxWidth: "100%",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    textTransform: "uppercase",
  },
  detailValue: {
    maxWidth: "100%",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
});

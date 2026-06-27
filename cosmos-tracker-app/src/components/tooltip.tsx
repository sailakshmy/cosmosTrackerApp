import { useEffect, useId, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

type TooltipProps = {
  message: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Tooltip({
  message,
  accessibilityLabel = "More information",
  style,
}: TooltipProps) {
  const tooltipId = useId();
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isInitiallyVisible, setIsInitiallyVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsInitiallyVisible(false);
      setIsVisible(false);
    }, 10_000);

    return () => clearTimeout(timeoutId);
  }, []);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => {
    if (!isInitiallyVisible) {
      setIsVisible(false);
    }
  };
  const toggleTooltip = () => {
    setIsInitiallyVisible(false);
    setIsVisible((currentValue) => !currentValue);
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityHint={message}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: isVisible }}
        nativeID={tooltipId}
        onBlur={hideTooltip}
        onFocus={showTooltip}
        onHoverIn={showTooltip}
        onHoverOut={hideTooltip}
        onPress={toggleTooltip}
        style={styles.button}
      >
        <FontAwesome name="info-circle" size={18} color={theme.accent} />
      </Pressable>

      {isVisible ? (
        <View
          accessibilityRole="text"
          aria-labelledby={tooltipId}
          pointerEvents="none"
          style={[
            styles.bubble,
            {
              backgroundColor: theme.text,
              shadowColor: theme.text,
            },
          ]}
        >
          <ThemedText
            style={[styles.message, { color: theme.backgroundElement }]}
          >
            {message}
          </ThemedText>
          <View
            style={[
              styles.arrow,
              {
                borderTopColor: theme.text,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    zIndex: 10,
  },
  button: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  bubble: {
    position: "absolute",
    bottom: 36,
    right: 0,
    width: 220,
    maxWidth: 260,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  arrow: {
    position: "absolute",
    top: "100%",
    right: 13,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

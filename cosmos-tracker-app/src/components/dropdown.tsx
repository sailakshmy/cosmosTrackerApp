import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

interface Option {
  label: string;
  value: number;
}

interface DropdownProps {
  options?: Option[];
  optionsList?: Option[];
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
  defaultOption?: string;
}

export default function Dropdown({
  options,
  optionsList,
  setSelectedOption,
  defaultOption,
}: DropdownProps) {
  const dropdownOptions = options ?? optionsList ?? [];
  const theme = useTheme();
  const triggerRef = useRef<View>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [selectedLabel, setSelectedLabel] = useState(
    defaultOption ?? dropdownOptions[0]?.label ?? "",
  );
  const [expanded, setExpanded] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0,
    width: 96,
  });

  const onChangeOption = (option: Option) => {
    setSelectedLabel(option.label);
    setSelectedOption(option.value);
    setExpanded(false);
  };

  const openDropdown = () => {
    if (!triggerRef.current) {
      setExpanded(true);
      return;
    }

    triggerRef.current.measureInWindow((x, y, width, height) => {
      const menuWidth = Math.max(width, 96);
      const estimatedMenuHeight = dropdownOptions.length * 36 + 8;
      const maxLeft = Math.max(8, windowWidth - menuWidth - 8);
      const left = Math.min(Math.max(8, x), maxLeft);
      const topBelow = y + height + 4;
      const topAbove = Math.max(8, y - estimatedMenuHeight - 4);
      const top =
        topBelow + estimatedMenuHeight > windowHeight - 8
          ? topAbove
          : topBelow;

      setMenuPosition({ left, top, width: menuWidth });
      setExpanded(true);
    });
  };

  return (
    <View ref={triggerRef} collapsable={false}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Rows per page"
        activeOpacity={0.78}
        onPress={openDropdown}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <ThemedText type="smallBold" themeColor="textSecondary">
          {selectedLabel}
        </ThemedText>
        <MaterialIcons name="arrow-drop-down" size={20} color={theme.accent} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={expanded}
        animationType="fade"
        onRequestClose={() => setExpanded(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setExpanded(false)}
          />
          <View
            style={[
              styles.menu,
              {
                left: menuPosition.left,
                top: menuPosition.top,
                width: menuPosition.width,
              },
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                shadowColor: theme.text,
              },
            ]}
          >
            {dropdownOptions.map((option) => {
              const isSelected = option.label === selectedLabel;

              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.78}
                  key={option.value}
                  onPress={() => onChangeOption(option)}
                  style={[
                    styles.option,
                    isSelected && {
                      backgroundColor: theme.backgroundSelected,
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    themeColor={isSelected ? "accent" : "textSecondary"}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minWidth: 72,
    height: 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  modalRoot: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    minWidth: 96,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingVertical: 4,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  option: {
    minHeight: 36,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
});

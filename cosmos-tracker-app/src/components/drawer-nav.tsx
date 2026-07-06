import { Drawer } from "expo-router/drawer";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import ThemeSwitcher from "./theme-switcher";

export default function DrawerNav() {
  const theme = useTheme();

  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.background,
          borderRightColor: theme.border,
          borderRightWidth: StyleSheet.hairlineWidth,
          width: 304,
        },
        drawerContentStyle: styles.drawerContent,
        drawerItemStyle: styles.drawerItem,
        drawerLabelStyle: styles.drawerLabel,
        drawerActiveBackgroundColor: theme.backgroundSelected,
        drawerActiveTintColor: theme.accent,
        drawerInactiveTintColor: theme.textSecondary,
        drawerType: "front",
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
          shadowColor: "transparent",
        },
        headerTintColor: theme.text,
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerRight: () => (
          <ThemeSwitcher />
          //   <Pressable style={{ marginRight: 15 }}>
          //     <Ionicons name="moon" size={24} color="black" />
          //   </Pressable>
        ),
        sceneStyle: {
          backgroundColor: theme.background,
        },
        overlayColor: "rgba(2, 6, 23, 0.62)",
      }}
    >
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "CosmoScope",
          drawerIcon: ({ color, size }) => (
            <SymbolView name="sparkles" tintColor={color} size={size - 2} />
          ),
        }}
      />
      <Drawer.Screen
        name="neo" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Near Earth Objects",
          title: "CosmoScope",
          drawerIcon: ({ color, size }) => (
            <SymbolView name="scope" tintColor={color} size={size - 2} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.two,
  },
  drawerItem: {
    borderRadius: Spacing.three,
    marginHorizontal: Spacing.one,
    marginVertical: Spacing.one,
  },
  drawerLabel: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 20,
    marginLeft: -Spacing.two,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 800,
  },
});

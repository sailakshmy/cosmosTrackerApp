import { SpaceBackground } from "@/components/space-background";
import { useTheme } from "../hooks/use-theme";
import { View, StyleSheet } from "react-native";
import EarthGlobal from "@/components/earth-global";

const SatelliteTrackerScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SpaceBackground />
      <EarthGlobal />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
});

export default SatelliteTrackerScreen;

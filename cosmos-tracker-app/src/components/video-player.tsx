import { useVideoPlayer, VideoView } from "expo-video";
import { Platform, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface VideoScreenProps {
  videoSource: string;
}

export default function VideoScreen({ videoSource }: VideoScreenProps) {
  const theme = useTheme();
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View
      style={[
        styles.contentContainer,
        {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.border,
          shadowColor: theme.text,
        },
        Platform.OS === "ios" && styles.iosDepth,
        Platform.OS === "android" && styles.androidDepth,
      ]}
    >
      <VideoView
        style={styles.video}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    alignItems: "stretch",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: Spacing.three,
    backgroundColor: "#020617",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  iosDepth: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  androidDepth: {
    elevation: 3,
  },
});

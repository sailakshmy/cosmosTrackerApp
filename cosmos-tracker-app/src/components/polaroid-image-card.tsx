import { Image } from "expo-image";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { StyleSheet } from "react-native";
import { Spacing } from "@/constants/theme";

const PoloaroidImageCard = () => {
  return (
    <ThemedView style={styles.polaroidCardContainer} type="backgroundElement">
      <Image
        style={styles.polaroidImage}
        // source={imageSource}
        // placeholder={{ blurhash }}
        contentFit="contain"
        // onLoad={() => setImageLoading(false)}
        // onError={(error) => {
        //   setImageLoading(false);
        //   console.log("Image load error", error);
        // }}
      />
      <ThemedText type="subtitle">{}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  polaroidCardContainer: {
    borderRadius: Spacing.three,
    backgroundColor: "#020617",
    padding: 10,
    paddingBottom: 28,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 210,
    elevation: 6,
    transform: [{ rotate: "-1.5deg" }],
  },
  polaroidImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 2,
  },
});

export default PoloaroidImageCard;

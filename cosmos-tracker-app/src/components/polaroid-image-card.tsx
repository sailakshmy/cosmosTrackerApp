import { Image } from "expo-image";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { StyleSheet } from "react-native";
import { Spacing } from "@/constants/theme";
import { ImageResponse } from "@/utilities/types";

type PolaroidImageCardProps = {
  imageDetails: ImageResponse;
};

const PolaroidImageCard = ({ imageDetails }: PolaroidImageCardProps) => {
  const imageSourceDetails = imageDetails?.links?.filter(
    (link) => link?.href?.includes("thumb") || link?.href?.includes("small"),
  )?.[0];
  return (
    <ThemedView style={styles.polaroidCardContainer} type="backgroundElement">
      <Image
        style={styles.polaroidImage}
        source={imageSourceDetails?.href}
        // placeholder={{ blurhash }}
        contentFit="contain"
        // onLoad={() => setImageLoading(false)}
        // onError={(error) => {
        //   setImageLoading(false);
        //   console.log("Image load error", error);
        // }}
      />
      <ThemedText type="subtitle">{imageDetails?.data?.[0]?.title}</ThemedText>
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
  },
  polaroidImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 2,
  },
});

export default PolaroidImageCard;

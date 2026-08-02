import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { Image } from "expo-image";
import { ImageSkeleton } from "./image-skeleton";
import VideoScreen from "./video-player";
import { Spacing } from "@/constants/theme";
import { Dispatch, SetStateAction } from "react";

type ImageCardProps = {
  title: string;
  description: string;
  mediaType: string;
  showImageSkeleton: boolean;
  imageSource: string | undefined;
  blurhash: string;
  setImageLoading: Dispatch<SetStateAction<boolean>>;
  videoSource?: string;
};

const ImageCard = ({
  title,
  description,
  mediaType,
  showImageSkeleton,
  imageSource,
  blurhash,
  setImageLoading,
  videoSource,
}: ImageCardProps) => {
  return (
    <>
      <ThemedText type="title">{title}</ThemedText>
      {mediaType === "image" && (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={imageSource}
            placeholder={{ blurhash }}
            contentFit="contain"
            onLoad={() => setImageLoading(false)}
            onError={(error) => {
              setImageLoading(false);
              console.log("Image load error", error);
            }}
          />
          {showImageSkeleton && <ImageSkeleton style={styles.imageSkeleton} />}
        </View>
      )}
      {mediaType === "video" && videoSource && (
        <VideoScreen videoSource={videoSource} />
      )}
      <View style={styles.descriptionStack}>
        <ThemedText style={styles.description} themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: Spacing.three,
    backgroundColor: "#020617",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFill,
  },
  description: {
    textAlign: "center",
  },
  descriptionStack: {
    gap: Spacing.three,
  },
});

export default ImageCard;

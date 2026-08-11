import { Image } from "expo-image";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Spacing } from "@/constants/theme";
import { ImageResponse } from "@/utilities/types";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import Dialog from "./dialog";
import ImageCard from "./image-card";
import { useRouter } from "expo-router";

type PolaroidImageCardProps = {
  imageDetails: ImageResponse;
  cardStyle?: StyleProp<ViewStyle>;
};

const PolaroidImageCard = ({
  imageDetails,
  cardStyle,
}: PolaroidImageCardProps) => {
  const imageSourceDetails = imageDetails?.links?.filter(
    (link) => link?.href?.includes("thumb") || link?.href?.includes("small"),
  )?.[0];
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          router.setParams({
            pageTitle: imageDetails?.data?.[0]?.title,
          });
          router.navigate("/imageGallery/nasaImageDetails", { imageDetails });
        }}
      >
        <ThemedView
          style={[
            styles.polaroidCardContainer,
            cardStyle,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
              shadowColor: theme.text,
            },
          ]}
          type="backgroundElement"
        >
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
          <ThemedText type="subtitle">
            {imageDetails?.data?.[0]?.title}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      {/* {openModal && (
        <Dialog visible={openModal} onClose={() => setOpenModal(false)}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageCard
              title={imageDetails?.data?.[0]?.title}
              description={imageDetails?.data?.[0]?.description}
              mediaType="image"
              imageSource={imageSourceDetails?.href}
              showImageSkeleton={false}
              blurhash=""
              setImageLoading={() => {}}
            />
          </ScrollView>
        </Dialog>
      )} */}
    </>
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
    borderRadius: Spacing.two,
  },
});

export default PolaroidImageCard;

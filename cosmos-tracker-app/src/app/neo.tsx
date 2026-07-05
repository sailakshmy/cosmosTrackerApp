import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  Colors,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import { SpaceBackground } from "@/components/space-background";
import InlineDateRangePicker from "@/components/date-range-picker";
import useNeoFeed from "@/hooks/useNeoFeed";
import Card from "@/components/card";
import CardSkeleton from "@/components/card-skeleton";
import { convertEpochDateToMonthDateYearFormat } from "@/utilities/helper";
import TableComponent from "@/components/table";
import useNeoLookupHook from "@/hooks/useNeoLookupHook";
import DetailCardSkeleton from "@/components/detail-card-skeleton";
import DetailCard from "@/components/detail-card";

export default function NeoScreen() {
  const {
    theme,
    startDate,
    endDate,
    onDateRangeChange,
    neoFeedData,
    isFetching,
    isLoading,
    sortedObjectList,
    rangeEndDate,
  } = useNeoFeed();
  const { setSelectedNeoId, isFetchingNeo, isLoadingNeo, selectedNeo } =
    useNeoLookupHook();

  console.log("selectedNeo", selectedNeo);
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SpaceBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <ThemedView
              type="backgroundElement"
              style={[
                styles.heroSection,
                {
                  borderColor: theme.border,
                  backgroundColor:
                    theme.background === Colors.dark.background
                      ? "rgba(17, 24, 39, 0.9)"
                      : "rgba(255, 255, 255, 0.92)",
                  shadowColor: theme.text,
                },
              ]}
            >
              <View style={styles.contentStack}>
                <View style={styles.contentStack}>
                  <View style={styles.headingStack}>
                    <ThemedText type="subtitle" themeColor="accent">
                      Objects Near Our Big Blue
                    </ThemedText>
                    <View>
                      <InlineDateRangePicker
                        selectedStartDate={startDate}
                        selectedEndDate={endDate}
                        onChangeDate={onDateRangeChange}
                        rangeEndDate={rangeEndDate}
                      />
                    </View>

                    {isFetching || isLoading ? (
                      [1, 2, 3, 4].map((item) => <CardSkeleton key={item} />)
                    ) : (
                      <>
                        <Card
                          title={`${neoFeedData?.totalNeo}`}
                          subtitle="A total of"
                          description="Objects came close to Earth during this period"
                        />
                        {neoFeedData?.hazardousNeo > 0 ? (
                          <Card
                            title={`${neoFeedData?.hazardousNeo}`}
                            subtitle={`Out of ${neoFeedData?.totalNeo}`}
                            description={`${neoFeedData?.hazardousNeo > 1 ? "were" : "was"} potentially hazardous to us`}
                          />
                        ) : (
                          <Card
                            title={`Thankfully, none of them were hazardous`}
                            subtitle={`Phew!`}
                          />
                        )}
                        {neoFeedData?.objClosestToEarth && (
                          <Card
                            title={`${neoFeedData?.objClosestToEarth?.name}  on ${convertEpochDateToMonthDateYearFormat(neoFeedData?.objClosestToEarth?.epoch_date_close_approach)}`}
                            subtitle="The object that was closest to us during this period was the"
                            description={`at a distance of ${neoFeedData?.objClosestToEarth?.miss_distance?.kilometers} km (${neoFeedData?.objClosestToEarth?.miss_distance?.miles} miles)`}
                          />
                        )}
                        {neoFeedData?.highestVelocityObj && (
                          <Card
                            title={`${neoFeedData?.highestVelocityObj?.name}`}
                            subtitle="The object with the highest velocity during this period"
                            description={`at a velocity of ${neoFeedData?.highestVelocityObj?.relative_velocity?.kilometers_per_hour} kmph (${neoFeedData?.highestVelocityObj?.relative_velocity?.miles_per_hour} mph)`}
                          />
                        )}

                        <TableComponent
                          tableData={sortedObjectList}
                          title="Close Approach Details"
                          setSelectedNeoId={setSelectedNeoId}
                        />
                        {isFetchingNeo || isLoadingNeo ? (
                          <DetailCardSkeleton />
                        ) : selectedNeo?.detailList?.length ? (
                          <DetailCard
                            title={selectedNeo?.name}
                            items={selectedNeo?.detailList}
                          />
                        ) : null}
                      </>
                    )}
                  </View>
                </View>
              </View>
            </ThemedView>
          </SafeAreaView>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  contentStack: {
    gap: Spacing.four,
  },
  headingStack: {
    gap: Spacing.three,
  },
});

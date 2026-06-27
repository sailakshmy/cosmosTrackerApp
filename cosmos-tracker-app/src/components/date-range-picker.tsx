import { Pressable, StyleSheet, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import { ThemedText } from "./themed-text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Spacing } from "@/constants/theme";
import Tooltip from "./tooltip";
import useDateRangePicker from "@/hooks/useDateRangePicker";

export interface InlineDateRangePickerProps {
  selectedStartDate: Date;
  selectedEndDate: Date;
  onChangeDate: (selectedStartDate: Date, selectedEndDate: Date) => void;
}

const InlineDateRangePicker = ({
  selectedEndDate,
  selectedStartDate,
  onChangeDate,
}: InlineDateRangePickerProps) => {
  const {
    onPressCalendarIcon,
    onChangeDateRange,
    theme,
    datePickerStyles,
    displayedStartDate,
    displayedEndDate,
    rangeLongerThan7Days,
    showDatePicker,
    localDisplayedStartDate,
    localDisplayedEndDate,
    localStartDate,
    localEndDate,
  } = useDateRangePicker({
    selectedEndDate,
    selectedStartDate,
    onChangeDate,
  });
  return (
    <View>
      <View style={styles.dateButtonRow}>
        <Pressable
          onPress={onPressCalendarIcon}
          style={[
            styles.dateButton,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText type="smallBold" style={styles.date}>
            {displayedStartDate}
            <ThemedText type="small" themeColor="textSecondary">
              {"  to  "}
            </ThemedText>
            {displayedEndDate}
          </ThemedText>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.backgroundSelected },
            ]}
          >
            <FontAwesome name="calendar-o" size={16} color={theme.accent} />
          </View>
        </Pressable>
        {rangeLongerThan7Days ? (
          <Tooltip message="Please select a date range that is within 7 days" />
        ) : null}
      </View>
      {showDatePicker && (
        <View
          style={[
            styles.calendarContainer,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.rangeSummary,
              {
                backgroundColor: theme.backgroundSelected,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.rangeSummaryItem}>
              <ThemedText type="small" themeColor="textSecondary">
                From
              </ThemedText>
              <ThemedText type="smallBold">
                {localDisplayedStartDate}
              </ThemedText>
            </View>
            <View
              style={[styles.rangeDivider, { borderColor: theme.border }]}
            />
            <View style={styles.rangeSummaryItem}>
              <ThemedText type="small" themeColor="textSecondary">
                To
              </ThemedText>
              <ThemedText type="smallBold">{localDisplayedEndDate}</ThemedText>
            </View>
          </View>
          <DateTimePicker
            styles={datePickerStyles}
            startDate={localStartDate}
            endDate={localEndDate}
            onChange={({ startDate, endDate }) =>
              onChangeDateRange(startDate, endDate)
            }
            maxDate={new Date()}
            mode="range"
            allowRangeReset
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    paddingVertical: Spacing.two,
    justifyContent: "space-between",
  },
  date: {
    flexShrink: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarContainer: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.three,
    overflow: "hidden",
  },
  rangeSummary: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  rangeSummaryItem: {
    flex: 1,
    gap: Spacing.half,
  },
  rangeDivider: {
    height: 36,
    borderLeftWidth: 1,
    marginHorizontal: Spacing.three,
  },
});

export default InlineDateRangePicker;

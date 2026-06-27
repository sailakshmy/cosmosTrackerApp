import { Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { ThemedText } from "./themed-text";
import { useMemo, useState } from "react";
import { fetchISOStringDate } from "@/utilities/helper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/hooks/use-theme";
import { Spacing } from "@/constants/theme";

const toDate = (date: DateType) => {
  if (!date) {
    return undefined;
  }

  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string" || typeof date === "number") {
    return new Date(date);
  }

  return date.toDate();
};

const formatDateType = (date: DateType, fallback: string) => {
  const nativeDate = toDate(date);

  return nativeDate ? fetchISOStringDate(nativeDate) : fallback;
};

interface InlineDateRangePickerProps {
  selectedStartDate: Date;
  selectedEndDate: Date;
  onChangeDate: (selectedStartDate: Date, selectedEndDate: Date) => void;
}

const InlineDateRangePicker = ({
  selectedEndDate,
  selectedStartDate,
  onChangeDate,
}: InlineDateRangePickerProps) => {
  const defaultStyles = useDefaultStyles();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localStartDate, setLocalStartDate] =
    useState<DateType>(selectedStartDate);
  const [localEndDate, setLocalEndDate] = useState<DateType>(selectedEndDate);
  const theme = useTheme();

  const datePickerStyles = useMemo(
    () => ({
      ...defaultStyles,
      day: {
        ...defaultStyles.day,
        borderRadius: Spacing.two,
      },
      day_label: {
        ...defaultStyles.day_label,
        color: theme.text,
        fontWeight: "500" as const,
      },
      today: {
        ...defaultStyles.today,
        backgroundColor: theme.backgroundSelected,
        borderColor: theme.accent,
        borderWidth: 1,
      },
      today_label: {
        ...defaultStyles.today_label,
        color: theme.accent,
        fontWeight: "700" as const,
      },
      selected: {
        ...defaultStyles.selected,
        backgroundColor: theme.accent,
      },
      selected_label: {
        ...defaultStyles.selected_label,
        color: theme.backgroundElement,
        fontWeight: "700" as const,
      },
      range_fill: {
        ...defaultStyles.range_fill,
        backgroundColor: theme.backgroundSelected,
      },
      range_fill_weekstart: {
        ...defaultStyles.range_fill_weekstart,
        borderTopLeftRadius: Spacing.two,
        borderBottomLeftRadius: Spacing.two,
      },
      range_fill_weekend: {
        ...defaultStyles.range_fill_weekend,
        borderTopRightRadius: Spacing.two,
        borderBottomRightRadius: Spacing.two,
      },
      range_middle: {
        ...defaultStyles.range_middle,
        backgroundColor: "transparent",
      },
      range_middle_label: {
        ...defaultStyles.range_middle_label,
        color: theme.text,
        fontWeight: "700" as const,
      },
      range_start: {
        ...defaultStyles.range_start,
        backgroundColor: theme.accent,
      },
      range_start_label: {
        ...defaultStyles.range_start_label,
        color: theme.backgroundElement,
        fontWeight: "700" as const,
      },
      range_end: {
        ...defaultStyles.range_end,
        backgroundColor: theme.accent,
      },
      range_end_label: {
        ...defaultStyles.range_end_label,
        color: theme.backgroundElement,
        fontWeight: "700" as const,
      },
      outside_label: {
        ...defaultStyles.outside_label,
        color: theme.textSecondary,
      },
      disabled_label: {
        ...defaultStyles.disabled_label,
        color: theme.textSecondary,
        opacity: 0.35,
      },
      header: {
        ...defaultStyles.header,
        marginBottom: Spacing.two,
      },
      month_selector_label: {
        ...defaultStyles.month_selector_label,
        color: theme.text,
        fontSize: 16,
        fontWeight: "700" as const,
      },
      year_selector_label: {
        ...defaultStyles.year_selector_label,
        color: theme.text,
        fontSize: 16,
        fontWeight: "700" as const,
      },
      weekday_label: {
        ...defaultStyles.weekday_label,
        color: theme.textSecondary,
        fontSize: 12,
        fontWeight: "700" as const,
      },
      month: {
        ...defaultStyles.month,
        borderColor: theme.border,
        borderRadius: Spacing.two,
      },
      month_label: {
        ...defaultStyles.month_label,
        color: theme.text,
      },
      year: {
        ...defaultStyles.year,
        borderColor: theme.border,
        borderRadius: Spacing.two,
      },
      year_label: {
        ...defaultStyles.year_label,
        color: theme.text,
      },
      selected_month: {
        ...defaultStyles.selected_month,
        backgroundColor: theme.accent,
        borderColor: theme.accent,
      },
      selected_month_label: {
        ...defaultStyles.selected_month_label,
        color: theme.backgroundElement,
        fontWeight: "700" as const,
      },
      selected_year: {
        ...defaultStyles.selected_year,
        backgroundColor: theme.accent,
        borderColor: theme.accent,
      },
      selected_year_label: {
        ...defaultStyles.selected_year_label,
        color: theme.backgroundElement,
        fontWeight: "700" as const,
      },
      active_year: {
        ...defaultStyles.active_year,
        backgroundColor: theme.backgroundSelected,
        borderColor: theme.accent,
      },
      active_year_label: {
        ...defaultStyles.active_year_label,
        color: theme.accent,
        fontWeight: "700" as const,
      },
    }),
    [defaultStyles, theme],
  );

  const onChangeDateRange = (
    updatedStartDate: DateType,
    updatedEndDate: DateType,
  ) => {
    if (updatedStartDate && !updatedEndDate) {
      setLocalStartDate(updatedStartDate);
      setLocalEndDate(undefined);
    } else if (updatedStartDate && updatedEndDate) {
      setLocalStartDate(updatedStartDate);
      setLocalEndDate(updatedEndDate);
      setShowDatePicker(false);
      const startDate = toDate(updatedStartDate);
      const endDate = toDate(updatedEndDate);

      if (startDate && endDate) {
        onChangeDate(startDate, endDate);
      }
    }
  };
  const onPressCalendarIcon = () => {
    if (!showDatePicker) {
      setLocalStartDate(selectedStartDate);
      setLocalEndDate(selectedEndDate);
    }
    setShowDatePicker((prev) => !prev);
  };

  const displayedStartDate = fetchISOStringDate(selectedStartDate);
  const displayedEndDate = fetchISOStringDate(selectedEndDate);
  const localDisplayedStartDate = formatDateType(localStartDate, "Start");
  const localDisplayedEndDate = formatDateType(localEndDate, "End");

  return (
    <View>
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
  dateButton: {
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

import { Platform, Pressable, StyleSheet, View } from "react-native";
// import DateTimePicker, {
//   type DateTimePickerChangeEvent,
// } from "@react-native-community/datetimepicker";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { ThemedText } from "./themed-text";
import { useState } from "react";
import { fetchISOStringDate } from "@/utilities/helper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/hooks/use-theme";

interface InlineDateRangePickerProps {
  selectedStartDate: Date;
  selectedEndDate: Date;
  onChangeDate: () => void;
}

const InlineDateRangePicker = ({
  selectedEndDate,
  selectedStartDate,
  onChangeDate,
}: InlineDateRangePickerProps) => {
  const defaultStyles = useDefaultStyles();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(undefined);
  const [localEndDate, setLocalEndDate] = useState(undefined);
  const theme = useTheme();
  // console.log("props", userSelectedDate);
  const onChangeDateRange = (
    updatedStartDate: DateType,
    updatedEndDate: DateType,
  ) => {
    console.log("Updated Start Date", updatedStartDate);
    console.log("Updated End Date", updatedEndDate);
    if (updatedStartDate && !updatedEndDate) {
      // First tap — start date chosen, waiting for end
      setLocalStartDate(updatedStartDate);
      setLocalEndDate(undefined);
    } else if (updatedStartDate && updatedEndDate) {
      // Second tap — full range confirmed
      setLocalStartDate(updatedStartDate);
      setLocalEndDate(updatedEndDate);
      setShowDatePicker(false);
      onChangeDate(new Date(updatedStartDate), new Date(updatedEndDate));
    }
  };
  const onPressCalendarIcon = () => {
    console.log("Clicked the calendar icon");
    if (!showDatePicker) {
      setLocalStartDate(undefined); // 👈 start fresh, don't pre-fill
      setLocalEndDate(undefined);
    }
    setShowDatePicker((prev) => !prev);
  };
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
        <ThemedText>
          {fetchISOStringDate(selectedEndDate)} to
          {fetchISOStringDate(selectedEndDate)}
        </ThemedText>
        <FontAwesome name="calendar-o" size={18} color={theme.text} />
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          styles={{
            ...defaultStyles,
            today: { borderColor: "blue", borderWidth: 1 }, // Add a border to today's date
            selected: { backgroundColor: "blue" }, // Highlight the selected day
            selected_label: { color: "white" }, // Highlight the selected day label
          }}
          startDate={localStartDate}
          endDate={localEndDate}
          onChange={({ startDate, endDate }) =>
            onChangeDateRange(startDate, endDate)
          }
          maxDate={new Date()}
          // display={Platform.OS === "android" ? "calendar" : "inline"}
          mode="range"
          // allowRangeReset
          // weekdaysFormat="full"
          // hideHeader={false}
          // hideWeekdays={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
});

export default InlineDateRangePicker;

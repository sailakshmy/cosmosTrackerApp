import { Platform, Pressable, StyleSheet, View } from "react-native";
// import DateTimePicker, {
//   type DateTimePickerChangeEvent,
// } from "@react-native-community/datetimepicker";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import { ThemedText } from "./themed-text";
import { useState } from "react";
import { fetchISOStringDate } from "@/utilities/helper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/hooks/use-theme";

interface InlineDatePickerProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const InlineDatePicker = ({
  date: userSelectedDate,
  setDate,
}: InlineDatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const theme = useTheme();
  // console.log("props", userSelectedDate);
  const onChangeDate = (selectedDate: DateType) => {
    console.log("Selected", selectedDate);
    setShowDatePicker(false);
    setDate(new Date(selectedDate));
  };
  const onPressCalendarIcon = () => {
    console.log("Clicked the calendar icon");
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
        <ThemedText>{fetchISOStringDate(userSelectedDate)}</ThemedText>
        <FontAwesome name="calendar-o" size={18} color={theme.text} />
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          date={userSelectedDate}
          onChange={({ date }) => onChangeDate(date)}
          maxDate={new Date()}
          // display={Platform.OS === "android" ? "calendar" : "inline"}
          mode="single"
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

export default InlineDatePicker;

import { Pressable, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { ThemedText } from "./themed-text";
import { useState } from "react";
import { fetchISOStringDate } from "@/utilities/helper";

const InlineDatePicker = ({ date, setDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  console.log("props", date);
  const onChangeDate = (_e: DateTimePickerChangeEvent, selectedDate: any) => {
    setShowDatePicker(false);
    // showDatePickerRef.current = false;
    console.log("Selected", selectedDate);
    setDate(selectedDate);
  };
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          console.log("Clicked the date");
          setShowDatePicker(true);
          // showDatePickerRef.current = true;
        }}
      >
        <ThemedText>
          Click here to change the date: {fetchISOStringDate(date)}
        </ThemedText>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          onValueChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default InlineDatePicker;

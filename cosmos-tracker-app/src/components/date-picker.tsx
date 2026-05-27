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
    console.log("Selected", selectedDate);
    setDate(selectedDate);
  };
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setShowDatePicker(true)}
      >
        <ThemedText>
          Click here to change the date:{fetchISOStringDate(date)}
        </ThemedText>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          onValueChange={onChangeDate}
          maximumDate={date}
        />
      )}
    </View>
  );
};

export default InlineDatePicker;

import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Table, Row } from "react-native-reanimated-table";
const TableComponent = () => {
  const tableHead = [
    "Date",
    "Id",
    "Name",
    "Miss Distance (km)",
    "Relative Velocity (kmph)",
  ];
  const widthArr = [100, 100, 200, 100, 100];
  const tableData = [];
  for (let i = 0; i < 30; i += 1) {
    const rowData = [];
    for (let j = 0; j < 9; j += 1) {
      rowData.push(`${i}${j}`);
    }
    tableData.push(rowData);
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              {tableData.map((rowData, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => console.log("Selected row", rowData)}
                >
                  <Row
                    data={rowData}
                    widthArr={widthArr}
                    style={[styles.row]}
                    textStyle={styles.text}
                  />
                </TouchableOpacity>
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
});

export default TableComponent;

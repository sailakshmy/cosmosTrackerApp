import { fetchRowsFromTableData } from "@/utilities/helper";
import type { NeoTableData } from "@/utilities/types";
import { useMemo, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Table, Row } from "react-native-reanimated-table";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

type TableComponentProps = {
  tableData?: NeoTableData;
  title?: string;
};

const tableHead = [
  "Date",
  "Id",
  "Name",
  "Hazardous",
  "Miss Distance (km)",
  "Relative Velocity (kmph)",
];

const widthArr = [112, 96, 196, 100, 176, 184];

const TableComponent = ({ tableData, title }: TableComponentProps) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const startIndex = currentPage * itemsPerPage;

  const tableRows = useMemo(
    () => fetchRowsFromTableData(tableData ?? []),
    [tableData],
  );
  const paginatedRows = tableRows?.slice(startIndex, startIndex + itemsPerPage);
  console.log("paginatedRows", paginatedRows?.length);
  console.log("tableR", tableRows?.length);
  const totalPages = Math.ceil(tableRows?.length / itemsPerPage);

  const [selected, setSelected] = useState(tableRows?.[0]?.[1]);
  console.log("selected", selected);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };
  const borderStyle = useMemo(
    () => ({
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    }),
    [theme.border],
  );
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          shadowColor: theme.text,
        },
      ]}
    >
      {title ? (
        <View style={styles.titleWrapper}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>
      ) : null}

      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        <View style={[styles.tableFrame, { borderColor: theme.border }]}>
          <Table borderStyle={borderStyle}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={[
                styles.header,
                { backgroundColor: theme.backgroundSelected },
              ]}
              textStyle={[styles.headerText, { color: theme.accent }]}
            />
          </Table>
          {paginatedRows.length ? (
            <ScrollView style={styles.dataWrapper} nestedScrollEnabled>
              <Table borderStyle={borderStyle}>
                {paginatedRows.map((rowData, index) => (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    key={`${rowData[1] ?? "neo"}-${index}`}
                    onPress={() => {
                      console.log("Selected row", rowData?.[1]);
                      setSelected(rowData?.[1]);
                    }}
                  >
                    <Row
                      data={rowData}
                      widthArr={widthArr}
                      style={[
                        styles.row,
                        {
                          backgroundColor:
                            selected === rowData?.[1]
                              ? theme.background
                              : theme.backgroundElement,
                        },
                      ]}
                      textStyle={[styles.text, { color: theme.textSecondary }]}
                    />
                  </TouchableOpacity>
                ))}
              </Table>
            </ScrollView>
          ) : (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: theme.background,
                  borderTopColor: theme.border,
                },
              ]}
            >
              <ThemedText type="small" themeColor="textSecondary">
                No close approach data found for this date range.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <Button
          title="Previous"
          onPress={handlePrevPage}
          disabled={currentPage === 0}
        />
        <ThemedText>
          Page {currentPage + 1} of {totalPages}
        </ThemedText>
        <Button
          title="Next"
          onPress={handleNextPage}
          disabled={currentPage === totalPages - 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minWidth: 0,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.three,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  titleWrapper: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    textAlign: "center",
  },
  horizontalScrollContent: {
    flexGrow: 1,
  },
  tableFrame: {
    width: "100%",
    minWidth: 764,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    minHeight: 52,
  },
  headerText: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    textTransform: "uppercase",
  },
  dataWrapper: {
    maxHeight: 360,
    marginTop: -StyleSheet.hairlineWidth,
  },
  row: {
    minHeight: 48,
  },
  text: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  emptyState: {
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
  },
});

export default TableComponent;

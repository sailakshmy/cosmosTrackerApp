import { fetchRowsFromTableData } from "@/utilities/helper";
import type { NeoTableData } from "@/utilities/types";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
const rowsPerPageOptions = [5, 10, 25];

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
  const totalRows = tableRows.length;
  const totalPages = Math.ceil(totalRows / itemsPerPage);
  const rangeStart = totalRows === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + itemsPerPage, totalRows);
  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = totalPages === 0 || currentPage >= totalPages - 1;

  const [selected, setSelected] = useState(tableRows?.[0]?.[1]);
  console.log("selected", selected);

  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage, totalRows]);

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
        style={[
          styles.pagination,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.rowsPerPage}>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.paginationLabel}
          >
            Rows per page:
          </ThemedText>
          <View style={styles.rowsPerPageOptions}>
            {rowsPerPageOptions.map((option) => {
              const isSelected = option === itemsPerPage;

              return (
                <TouchableOpacity
                  activeOpacity={0.78}
                  key={option}
                  onPress={() => setItemsPerPage(option)}
                  style={[
                    styles.rowsPerPageOption,
                    {
                      backgroundColor: isSelected
                        ? theme.backgroundSelected
                        : "transparent",
                      borderColor: isSelected ? theme.accent : theme.border,
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    themeColor={isSelected ? "accent" : "textSecondary"}
                    style={styles.rowsPerPageOptionText}
                  >
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.paginationActions}>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.displayedRows}
          >
            {rangeStart}-{rangeEnd} of {totalRows}
          </ThemedText>
          <View style={styles.paginationButtons}>
            <TouchableOpacity
              accessibilityLabel="Previous page"
              activeOpacity={0.78}
              onPress={handlePrevPage}
              disabled={isPrevDisabled}
              style={[
                styles.paginationButton,
                {
                  borderColor: theme.border,
                },
                isPrevDisabled && styles.paginationButtonDisabled,
              ]}
            >
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={isPrevDisabled ? theme.textSecondary : theme.accent}
              />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Next page"
              activeOpacity={0.78}
              onPress={handleNextPage}
              disabled={isNextDisabled}
              style={[
                styles.paginationButton,
                {
                  borderColor: theme.border,
                },
                isNextDisabled && styles.paginationButtonDisabled,
              ]}
            >
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={isNextDisabled ? theme.textSecondary : theme.accent}
              />
            </TouchableOpacity>
          </View>
        </View>
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
  pagination: {
    minHeight: 56,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  rowsPerPage: {
    minWidth: 0,
    flexShrink: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowsPerPageOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  rowsPerPageOption: {
    minWidth: 36,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
  },
  rowsPerPageOptionText: {
    textAlign: "center",
  },
  paginationActions: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.three,
  },
  displayedRows: {
    minWidth: 72,
    textAlign: "right",
  },
  paginationButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  paginationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationLabel: {
    flexShrink: 0,
  },
});

export default TableComponent;

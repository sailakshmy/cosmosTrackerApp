import { useEffect, useMemo, useState } from "react";
import { useTheme } from "./use-theme";
import { fetchRowsFromTableData } from "@/utilities/helper";
import { StyleSheet } from "react-native";

const useTableHook = ({ tableData }) => {
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
  const tableHead = [
    "Date",
    "Id",
    "Name",
    "Hazardous",
    "Miss Distance (km)",
    "Relative Velocity (kmph)",
  ];

  const widthArr = [112, 96, 196, 100, 176, 184];
  const rowsPerPageOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "15", value: 15 },
  ];

  return {
    borderStyle,
    handleNextPage,
    handlePrevPage,
    rangeStart,
    rangeEnd,
    isPrevDisabled,
    isNextDisabled,
    paginatedRows,
    theme,
    setSelected,
    selected,
    itemsPerPage,
    setItemsPerPage,
    totalRows,
    tableHead,
    widthArr,
    rowsPerPageOptions,
  };
};

export default useTableHook;

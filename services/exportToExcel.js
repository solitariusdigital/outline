import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // Generate the Excel file and trigger the download
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

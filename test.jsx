const downloadLessThanHunderedExcel = async () => {
  if (!filteredItemsHundered || filteredItemsHundered.length === 0) {
    toast({
      title: "No Data",
      description: "No data available to export",
      variant: "destructive",
    });
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Stock < 100 Report");
  worksheet.addRow(["Stock Report"]).font = { bold: true };
  worksheet.addRow([
    `From: ${moment(formData.from_date).format("DD-MM-YYYY")} To: ${moment(
      formData.to_date
    ).format("DD-MM-YYYY")}`,
  ]);
  worksheet.addRow([]);
  const headers = ["Item Name", "Category", "Avaiable"];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "F3F4F6" },
    };
    cell.alignment = { horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
    };
  });
  filteredItemsHundered.forEach((transaction) => {
    const opening = transaction.item_name;
    const purchase = transaction.item_category;

    const dispatch = item.openpurch - item.closesale + (item.purch - item.sale);

    worksheet.addRow([opening, purchase, dispatch, closing]);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Stock_Report_<100_${moment().format("YYYY-MM-DD")}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

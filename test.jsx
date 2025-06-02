const handleSendWhatsApp = (
  dispatch,
  dispatchSub,
  buyer,
  singlebranch,
  doublebranch
) => {
    const { dispatch_ref, dispatch_date, dispatch_vehicle_no } = dispatch;
    const { buyer_name, buyer_city } = buyer;

  const dispatchNo = dispatch_ref?.split("-").pop();

  const NAME_WIDTH = 20;
  const BOX_WIDTH = 8;
  const itemLine = dispatchSub.map((item) => {
    const name = item.item_name.padEnd(NAME_WIDTH, " ");
    const box = `(${String(item.dispatch_sub_box || 0)})`.padEnd(
      BOX_WIDTH,
      " "
    );

    const piece = String(item.dispatch_sub_piece || 0);
    return `${name}  ${box}   ${piece}`;
  });

  const itemLines = dispatchSub.map((item) => {
    const name = item.item_name.padEnd(NAME_WIDTH, " ");
    const box = `(${String(item.dispatch_sub_box || 0)})`;
    return `${name}  ${box}`;
  });

  const totalQty = dispatchSub.reduce(
    (sum, item) => sum + (parseInt(item.dispatch_sub_piece, 10) || 0),
    0
  );
  const totalQtyBox = dispatchSub.reduce(
    (sum, item) => sum + (parseInt(item.dispatch_sub_box, 10) || 0),
    0
  );

  const isBothYes = singlebranch == "Yes" && doublebranch == "Yes";

  const productHeader = isBothYes
    ? `Product               (QTY)   (Piece)`
    : `Product               (QTY)`;

  const productBody = isBothYes ? itemLine.join("\n") : itemLines.join("\n");

  const totalLine = isBothYes
    ? `*Total QTY: ${totalQtyBox}   ${totalQty}*`
    : `*Total QTY: ${totalQtyBox}*`;

  const message = `\`\`\`
=== DispatchList ===
No.        : ${dispatchNo}
Date       : ${moment(dispatch_date).format("DD-MM-YYYY")}
Party      : ${buyer_name}
City       : ${buyer_city}
VEHICLE NO : ${dispatch_vehicle_no}
======================
${productHeader}
======================
${productBody}
======================
${totalLine}
======================
\`\`\``;

  const phoneNumber = "919360485526";
  // const phoneNumber = `${whatsapp}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

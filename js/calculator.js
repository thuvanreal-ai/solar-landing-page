window.SolarCalculator = (() => {
  const billBands=[{max:1500000,range:'Khoảng 2–4 kWp'},{max:3000000,range:'Khoảng 3–6 kWp'},{max:6000000,range:'Khoảng 5–10 kWp'},{max:10000000,range:'Khoảng 8–15 kWp'},{max:20000000,range:'Khoảng 12–30 kWp'},{max:Infinity,range:'Cần phân tích tải để xác định công suất'}];
  function evaluate({monthlyBill,propertyType,usageTime}) {
    const band=billBands.find(x=>monthlyBill<=x.max); let fit='Có tiềm năng để phân tích tiếp'; let note='Cần hóa đơn và khảo sát để xác định cấu hình phù hợp.';
    if(usageTime==='Ban ngày') note='Tải ban ngày là tín hiệu thuận lợi cho phương án ưu tiên tự dùng. Cần kiểm tra mái và biểu đồ tải.';
    if(usageTime==='Ban đêm') note='Nếu phần lớn điện dùng ban đêm, cần xem kỹ bài toán lưu trữ và hiệu quả đầu tư trước khi đề xuất.';
    if(usageTime==='Cả ngày') note='Có thể cân nhắc On-grid hoặc Hybrid tùy tỷ lệ tải ngày/đêm và nhu cầu backup.';
    if(monthlyBill<1000000) fit='Nên kiểm tra kỹ hiệu quả trước khi đầu tư';
    return {fit,range:band.range,note,propertyType};
  } return {evaluate};
})();
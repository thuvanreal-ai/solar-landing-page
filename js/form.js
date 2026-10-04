window.SolarLeadForm=(()=> {
  const form=document.getElementById('solarCheckForm');
  if(!form)return{};
  const steps=[...form.querySelectorAll('.form-step')];
  const dots=[...document.querySelectorAll('.progress span')];
  const status=document.getElementById('formStatus');
  let step=1;

  function showStep(n){
    step=n;
    steps.forEach(el=>el.classList.toggle('active',Number(el.dataset.step)===n));
    dots.forEach((d,i)=>d.classList.toggle('active',i<n));
    form.closest('.lead-card')?.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function money(v){return new Intl.NumberFormat('vi-VN').format(v)+' đ/tháng'}
  function validStep1(){
    const input=form.elements.monthlyBill,value=Number(input.value);
    if(!value||value<500000){
      input.focus();
      input.setCustomValidity('Vui lòng nhập tiền điện từ 500.000đ/tháng.');
      input.reportValidity();
      return false;
    }
    input.setCustomValidity('');
    return true;
  }
  function validStep2(){
    if(!form.elements.propertyType.value||!form.elements.usageTime.value){
      status.textContent='Vui lòng chọn loại công trình và thời gian sử dụng điện.';
      status.className='form-status error';
      return false;
    }
    status.textContent='';
    status.className='form-status';
    return true;
  }
  function renderLeadGate(){
    const data={
      monthlyBill:Number(form.elements.monthlyBill.value),
      propertyType:form.elements.propertyType.value,
      usageTime:form.elements.usageTime.value
    };
    const r=window.SolarCalculator.evaluate(data);
    document.getElementById('preResult').innerHTML=`
      <span class="result-label">ĐÃ ĐỦ DỮ LIỆU SƠ BỘ</span>
      <h3>${r.fit}</h3>
      <div class="result-row"><span>Tiền điện</span><b>${money(data.monthlyBill)}</b></div>
      <div class="result-row"><span>Mục đích sử dụng</span><b>${data.propertyType}</b></div>
      <div class="result-row"><span>Dùng điện nhiều nhất</span><b>${data.usageTime}</b></div>
      <p>Nhập tên và số điện thoại để xem <strong>khoảng công suất Solar dự kiến</strong> từ dữ liệu vừa cung cấp.</p>
      <small>Kết quả là ước tính sơ bộ, chưa phải thiết kế kỹ thuật hay báo giá.</small>`;
  }
  function resultUrl(result,data){
    const q=new URLSearchParams({
      range:result.range,
      fit:result.fit,
      note:result.note,
      bill:String(data.monthlyBill),
      property:data.propertyType,
      usage:data.usageTime
    });
    return 'thank-you.html?'+q.toString();
  }
  function sendLead(endpoint,payload){
    const params=new URLSearchParams();
    for(const [key,value] of payload.entries())params.append(key,String(value));
    if(navigator.sendBeacon){
      try{
        const blob=new Blob([params.toString()],{type:'application/x-www-form-urlencoded;charset=UTF-8'});
        if(navigator.sendBeacon(endpoint,blob))return;
      }catch(_){}
    }
    fetch(endpoint,{
      method:'POST',
      body:params,
      mode:'no-cors',
      keepalive:true,
      headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
    }).catch(err=>console.error('[SolarLead]',err));
  }

  form.querySelectorAll('.next-step').forEach(btn=>btn.addEventListener('click',()=>{
    if(step===1&&validStep1()){
      showStep(2);
      window.SolarTracking?.event('solar_check_step_1');
    }else if(step===2&&validStep2()){
      renderLeadGate();
      showStep(3);
      window.SolarTracking?.event('solar_check_contact_gate');
    }
  }));
  form.querySelectorAll('.prev-step').forEach(btn=>btn.addEventListener('click',()=>showStep(Math.max(1,step-1))));
  form.querySelectorAll('[data-bill]').forEach(btn=>btn.addEventListener('click',()=>{form.elements.monthlyBill.value=btn.dataset.bill}));

  function validatePhone(phone){return /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(phone.replace(/[\s.-]/g,''))}

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.elements.name.value.trim();
    const phone=form.elements.phone.value.trim();
    if(!name){
      status.textContent='Vui lòng nhập tên để xem công suất dự kiến.';
      status.className='form-status error';
      form.elements.name.focus();
      return;
    }
    if(!validatePhone(phone)){
      status.textContent='Số điện thoại chưa đúng định dạng Việt Nam.';
      status.className='form-status error';
      form.elements.phone.focus();
      return;
    }
    const endpoint=window.SOLAR_CONFIG?.leadEndpoint;
    if(!endpoint){
      status.innerHTML='Form đang ở chế độ xem thử: <strong>chưa kết nối nơi nhận lead</strong>.';
      status.className='form-status warning';
      window.SolarTracking?.event('lead_attempt_no_endpoint');
      return;
    }

    const data={
      monthlyBill:Number(form.elements.monthlyBill.value),
      propertyType:form.elements.propertyType.value,
      usageTime:form.elements.usageTime.value
    };
    const result=window.SolarCalculator.evaluate(data);
    const payload=new FormData(form);
    payload.set('name',name);
    payload.set('phone',phone);
    payload.set('monthlyBill',String(data.monthlyBill));
    payload.set('source','Solar Check V2');

    const submit=document.getElementById('submitLead');
    submit.disabled=true;
    submit.textContent='Đang mở kết quả...';

    sendLead(endpoint,payload);
    try{window.SolarTracking?.leadSuccess()}catch(_){}
    window.location.replace(resultUrl(result,data));
  });
  return{showStep};
})();
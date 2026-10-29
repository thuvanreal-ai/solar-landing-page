// Isolated integration test: runs the actual js/form.js in a mocked browser.
// No network, no Google Sheet and no production Apps Script.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const events={};
const store=new Map();
const inputs={monthlyBill:{value:'5.000.000',addEventListener(){},setCustomValidity(){},selectionStart:9,setSelectionRange(){}},propertyType:{value:'Kinh doanh'},usageTime:{value:'Cả ngày và đêm'},name:{value:'TEST UTM ERA'},phone:{value:'0912345678'}};
const form={elements:inputs,querySelectorAll(){return[]},closest(){return{scrollIntoView(){}}},addEventListener(type,cb){events[type]=cb}};
const status={textContent:'',className:''};
const nodes={solarCheckForm:form,formStatus:status,submitLead:{disabled:false,textContent:''},preResult:{innerHTML:''}};
const calls=[];
const sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const context={URLSearchParams,FormData:class {constructor(){this.p=new URLSearchParams('name=TEST+UTM+ERA&phone=0912345678&monthlyBill=5000000&propertyType=Kinh+doanh&usageTime=C%E1%BA%A3+ng%C3%A0y+v%C3%A0+%C4%91%C3%AAm')}set(k,v){this.p.set(k,v)}entries(){return this.p.entries()}},Blob,console,sessionStorage,window:{location:{search:'?utm_source=google&utm_medium=cpc&utm_campaign=era_solar_search&utm_term=thi_cong_dien_mat_troi&utm_content=ad_test_01&gclid=TEST_GCLID_001',replace:u=>calls.push({redirect:u})},SOLAR_CONFIG:{leadEndpoint:'https://example.invalid/test'},SolarCalculator:{evaluate:()=>({range:'5-10 kWp',fit:'Phù hợp',note:'Test'})},SolarTracking:{leadAttempt(){calls.push({attempt:true})},event(){}}},document:{getElementById:id=>nodes[id],querySelectorAll(){return[]}},navigator:{sendBeacon:(url,blob)=>{calls.push({url,blob});return true}},fetch(){throw Error('Unexpected network call')}};
context.window.window=context.window;
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/form.js','utf8'),context,{filename:'js/form.js'});
assert.equal(typeof events.submit,'function','Form submit handler missing');
events.submit({preventDefault(){}});
assert.equal(calls.length,3,'Expected beacon, attempt event and redirect');
events.submit({preventDefault(){}});
assert.equal(calls.length,3,'Repeated submit must not send a second lead');
assert.equal(calls[0].url,'https://example.invalid/test');
assert.equal(calls[1].attempt,true);
assert.equal(calls[2].redirect.startsWith('thank-you.html?'),true);
(async()=>{
 const params=new URLSearchParams(await calls[0].blob.text());
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'])assert.ok(params.get(key),'Missing '+key);
 assert.equal(params.get('phone'),'0912345678');
 assert.equal(params.get('monthlyBill'),'5000000');
 assert.equal(params.get('gclid'),'TEST_GCLID_001');
 console.log('PASS: actual form.js captured 6 attribution fields, preserved lead data, and used isolated endpoint.');
})().catch(e=>{console.error(e);process.exitCode=1});

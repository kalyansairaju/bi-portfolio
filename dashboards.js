// Synthetic demonstration data only. No client records or live connections.
const months=['Jan','Feb','Mar','Apr','May','Jun'];
const demos={
 claims:{title:'Healthcare claims overview',desc:'Explore claim volume, paid amounts and denial rates.',chart:'Monthly claim volume',breakdown:'Claim status',columns:['Claims','Paid','Denied','Paid amount ($)'],rows:[[1200,920,150,184000],[1380,1080,160,221400],[1450,1160,145,243600],[1520,1250,130,262500],[1690,1410,135,303150],[1840,1560,128,343200]],model:'FactClaims → DimDate, DimMember, DimStatus. Measures evaluate within the selected reporting period. Denial rate = denied claims ÷ total claims.',measure:'Denial Rate = DIVIDE([Denied Claims], [Total Claims], 0)',metrics:t=>[['Total claims',fmt(t[0]),'Sum of claim volume'],['Paid amount','$'+fmt(t[3]),'Synthetic USD amounts'],['Denial rate',pct(t[2]/t[0]),'Denied / total claims'],['Paid claims',fmt(t[1]),'Completed claim payments']],split:t=>[['Paid',t[1]],['Denied',t[2]],['Pending',t[0]-t[1]-t[2]]]},
 channels:{title:'Channel operations monitor',desc:'Inspect processing volume, delivery outcomes and exceptions.',chart:'Monthly processed records',breakdown:'Processing outcomes',columns:['Processed','Inserted','Updated','Errors'],rows:[[42000,31500,9200,1300],[46000,34500,10300,1200],[49500,37000,11400,1100],[52000,39500,11500,1000],[57000,43200,12900,900],[61000,46700,13500,800]],model:'FactChannelRuns → DimDate, DimChannel, DimOutcome. Inserted + updated + errors reconcile to processed records. Error rate uses the aggregate totals, not an average of monthly rates.',measure:'Error Rate = DIVIDE([Error Records], [Processed Records], 0)',metrics:t=>[['Processed',fmt(t[0]),'Records in selected period'],['Inserted',fmt(t[1]),'New target records'],['Updated',fmt(t[2]),'Existing target records'],['Error rate',pct(t[3]/t[0]),'Errors / processed']],split:t=>[['Inserted',t[1]],['Updated',t[2]],['Errors',t[3]]]},
 subscriptions:{title:'Subscription revenue explorer',desc:'Explore recurring revenue, new subscriptions and cancellations.',chart:'Monthly revenue ($)',breakdown:'Revenue composition',columns:['Revenue ($)','New subscriptions','Cancellations','Renewal revenue ($)'],rows:[[84000,210,48,65000],[91000,235,51,71000],[98500,252,49,77000],[105000,270,46,82000],[114000,298,44,89000],[123000,320,42,96000]],model:'FactSubscriptionActivity → DimDate, DimCustomer, DimPlan. Revenue is additive; net subscription additions = new subscriptions − cancellations. This demo does not infer subscriber counts or churn rate.',measure:'Net Additions = [New Subscriptions] - [Cancellations]',metrics:t=>[['Revenue','$'+fmt(t[0]),'Synthetic USD amounts'],['New subscriptions',fmt(t[1]),'Gross additions'],['Cancellations',fmt(t[2]),'Recorded cancellations'],['Net additions',fmt(t[1]-t[2]),'New minus cancellations']],split:t=>[['Renewals',t[3]],['Other subscription revenue',t[0]-t[3]]]}
};
const fmt=n=>new Intl.NumberFormat('en-US').format(n),pct=n=>(100*n).toFixed(1)+'%';
let selected='claims';
function renderDashboard(){
 const d=demos[selected],period=document.getElementById('period').value,indices=period==='q1'?[0,1,2]:period==='q2'?[3,4,5]:[0,1,2,3,4,5];
 const totals=[0,0,0,0];indices.forEach(i=>d.rows[i].forEach((v,k)=>totals[k]+=v));
 document.getElementById('dashboard-title').textContent=d.title;document.getElementById('dashboard-desc').textContent=d.desc;
 document.getElementById('chart-title').textContent=d.chart;document.getElementById('breakdown-title').textContent=d.breakdown;
 document.getElementById('kpis').innerHTML=d.metrics(totals).map(([label,value,note])=>`<div class="kpi"><small>${label}</small><strong>${value}</strong><span>${note}</span></div>`).join('');
 const max=Math.max(...indices.map(i=>d.rows[i][0]));
 document.getElementById('bars').innerHTML=indices.map(i=>`<div class="bar-column"><b>${fmt(d.rows[i][0])}</b><div class="bar" style="height:${d.rows[i][0]/max*145}px" aria-hidden="true"></div><small>${months[i]}</small></div>`).join('');
 const split=d.split(totals),sum=split.reduce((a,x)=>a+x[1],0);
 document.getElementById('breakdown').innerHTML=split.map(([label,value])=>`<div class="split"><div class="split-label"><span>${label}</span><span>${fmt(value)} · ${pct(value/sum)}</span></div><div class="split-track" aria-hidden="true"><div class="split-fill" style="width:${value/sum*100}%"></div></div></div>`).join('');
 document.getElementById('model-note').textContent=d.model;document.getElementById('measure').textContent=d.measure;
 document.getElementById('data-head').innerHTML='<tr><th scope="col">Month</th>'+d.columns.map(x=>`<th scope="col">${x}</th>`).join('')+'</tr>';
 document.getElementById('data-body').innerHTML=indices.map(i=>`<tr><th scope="row">${months[i]} 2026</th>${d.rows[i].map(v=>`<td>${fmt(v)}</td>`).join('')}</tr>`).join('');
 document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demo===selected)));
}
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.demo;renderDashboard()}));
document.getElementById('period').addEventListener('change',renderDashboard);renderDashboard();

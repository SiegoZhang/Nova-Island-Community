/* NovaToken public snapshots, styled for the Nova Island prototype. */
const rankingTools={total:'总榜','claude-code':'Claude Code',codex:'Codex',workbuddy:'WorkBuddy',claude:'Claude',hermes:'Hermes',cursor:'Cursor',gemini:'Gemini',qwen:'Qwen',kimi:'Kimi',opencode:'OpenCode',zcode:'ZCode'};
const rankingMetrics={total:'含缓存',fresh:'不含缓存',cost:'预估费用'};
let rankingNickname='';
let rankingLocatedName='';
const rankingFollows=(()=>{try{return new Set(JSON.parse(localStorage.getItem('nova-ranking-follows')||'[]'))}catch{return new Set()}})();
function rankingSelections(value){return Array.isArray(value)?value:String(value||'').split(',').filter(Boolean);}
function rankingState(){const p=route().params;return {board:rankingSelections(p.get('board')).filter(x=>x!=='total'&&Object.hasOwn(rankingTools,x)),metric:Object.hasOwn(rankingMetrics,p.get('metric'))?p.get('metric'):'total',model:rankingSelections(p.get('model')).filter(x=>['gpt-5.5','claude-opus-5'].includes(x)),city:Object.hasOwn(novaRankingData.cities,p.get('city'))?p.get('city'):''};}

function rankingSnapshotEntries(state){
 const groups=novaRankingData.models[state.model]||{},people=new Map(),field={total:'totalTokens',fresh:'freshTokens',cost:'costUsd'}[state.metric];
 for(const [tool,entries] of Object.entries(groups)){
  if(state.board!=='total'&&state.board!==tool)continue;
  for(const e of entries){
   if(state.city&&!novaRankingData.cities[state.city].includes(e.handle))continue;
   const score=Number(e[field])||0;if(score<=0)continue;
   if(!people.has(e.handle))people.set(e.handle,{handle:e.handle,score:0,byTool:{}});
   const person=people.get(e.handle);person.score+=score;person.byTool[tool]=score;
  }
 }
 return [...people.values()].sort((a,b)=>b.score-a.score||a.handle.localeCompare(b.handle)).map((e,i)=>({...e,rank:i+1}));
}
function rankingNumber(n,metric='total'){return metric==='cost'?'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):n>=1e8?(n/1e8).toFixed(2)+' 亿':n>=1e4?(n/1e4).toFixed(1)+' 万':Math.round(n).toLocaleString('zh-CN');}
function rankingLink(key,value){const state=rankingState();state[key]=value;const p=new URLSearchParams(Object.entries(state).filter(([,v])=>v));if(route().params.get('connection')==='connected')p.set('connection','connected');return '#ranking?'+p.toString();}
function rankingPersonLink(name){return novaRankingData.source+'/u/'+encodeURIComponent(name);}
function rankingDistribution(e,state){
 return `<div class="ranking-distribution" role="group" aria-label="${escapeHtml(e.handle)}的${state.metric==='cost'?'费用':'用量'}分布">${e.byModel.map(({model,tool,score})=>{
 const percent=score/e.score*100,value=state.metric==='cost'?'$'+score.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):Math.round(score).toLocaleString('zh-CN')+' Token';
 return `<button type="button" class="ranking-distribution-segment ranking-tool-${tool}" style="flex-grow:${score}" data-distribution-model="${escapeHtml(model)}" data-distribution-tool="${escapeHtml(rankingTools[tool])}" data-distribution-value="${escapeHtml(value)}" data-distribution-share="${percent.toFixed(1)}%" aria-label="${escapeHtml(model)}，${escapeHtml(rankingTools[tool])}，${escapeHtml(value)}，占比 ${percent.toFixed(1)}%"></button>`;
 }).join('')}</div>`;
}
// Balanced rectangle subdivision preserves area and keeps Agent groups contiguous.
function rankingTreeLayout(items,x=0,y=0,width=100,height=90){
 if(!items.length)return [];
 if(items.length===1)return [{...items[0],x,y,width,height}];
 const total=items.reduce((sum,item)=>sum+item.score,0);
 let split=1,first=items[0].score;
 while(split<items.length-1&&Math.abs(first+items[split].score-total/2)<Math.abs(first-total/2)){first+=items[split].score;split++;}
 const ratio=first/total;
 return width>=height
 ?[...rankingTreeLayout(items.slice(0,split),x,y,width*ratio,height),...rankingTreeLayout(items.slice(split),x+width*ratio,y,width*(1-ratio),height)]
 :[...rankingTreeLayout(items.slice(0,split),x,y,width,height*ratio),...rankingTreeLayout(items.slice(split),x,y+height*ratio,width,height*(1-ratio))];
}
function rankingTreemap(e,state){
 const grouped=new Map();
 e.byModel.filter(item=>item.score>0).forEach(item=>{
  if(!grouped.has(item.tool))grouped.set(item.tool,{tool:item.tool,score:0,models:[]});
  const group=grouped.get(item.tool);group.score+=item.score;group.models.push(item);
 });
 const groups=[...grouped.values()].sort((a,b)=>b.score-a.score),total=groups.reduce((sum,item)=>sum+item.score,0);
 if(!total)return '<p>当前筛选下暂无用量</p>';
 const tiles=rankingTreeLayout(groups).flatMap(group=>rankingTreeLayout(group.models.sort((a,b)=>b.score-a.score),group.x,group.y,group.width,group.height));
 return `<div class="ranking-model-treemap" role="group" aria-label="按 Agent 分组、按模型划分的${state.metric==='cost'?'费用':'用量'}分布">${tiles.map(tile=>{
  const {tool,model,score}=tile,share=(score/total*100).toFixed(1)+'%',value=state.metric==='cost'?'$'+score.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):Math.round(score).toLocaleString('zh-CN')+' Token';
  return `<button type="button" class="ranking-model-tile ranking-agent-${tool}" style="left:${tile.x}%;top:${tile.y/90*100}%;width:${tile.width}%;height:${tile.height/90*100}%" data-distribution-model="${escapeHtml(model)}" data-distribution-tool="${escapeHtml(rankingTools[tool])}" data-distribution-value="${escapeHtml(value)}" data-distribution-share="${share}" aria-label="${escapeHtml(rankingTools[tool])}，${escapeHtml(model)}，${escapeHtml(value)}，${share}"><span class="ranking-tile-agent">${escapeHtml(rankingTools[tool])}</span><strong>${escapeHtml(model)}</strong><span class="ranking-tile-share">${share}</span></button>`;
 }).join('')}</div><div class="ranking-treemap-legend">${groups.map(group=>`<span class="ranking-agent-${group.tool}"><i aria-hidden="true"></i>${escapeHtml(rankingTools[group.tool])}<b>${(group.score/total*100).toFixed(1)}%</b></span>`).join('')}</div>`;
}
function rankingRows(entries,state){
 return entries.map(e=>{
  const tools=Object.entries(e.byTool).sort((a,b)=>b[1]-a[1]),primary=tools[0]?.[0];
  const badges=[...(e.rank===1?['卷王']:[]),...(state.metric!=='cost'&&e.score>=5e7?['Token 巨鲸']:[]),...(tools[0]?.[1]/e.score>=.7?[rankingTools[primary]+' 信徒']:[])];
  const matched=e.handle===rankingLocatedName;
  return `<tr data-ranking-name="${escapeHtml(e.handle)}" class="${matched?'ranking-match':''}"><td class="ranking-position">${e.rank<=3?`<span class="home-leaderboard-rank" aria-label="第 ${e.rank} 名">${homeRankTrophy(e.rank)}</span>`:String(e.rank).padStart(2,'0')}</td><td><div class="ranking-creator"><span class="ranking-avatar" aria-hidden="true">${escapeHtml(e.handle.slice(0,1).toUpperCase())}</span><div class="ranking-person"><div class="ranking-person-top"><button class="ranking-name-button" data-ranking-detail="${escapeHtml(e.handle)}">${escapeHtml(e.handle)}</button></div></div></div></td><td class="ranking-tags"><div class="ranking-badges">${badges.map(b=>`<span data-badge-tone="${b==='卷王'?'yellow':b==='Token 巨鲸'?'blue':primary==='claude-code'||primary==='claude'?'red':primary==='codex'?'purple':'green'}">${escapeHtml(b)}</span>`).join('')}</div></td><td class="ranking-usage">${rankingDistribution(e,state)}</td><td class="ranking-score">${rankingNumber(e.score,state.metric)}</td></tr>`;
 }).join('');
}
let rankingDemoMonth='2026-09';
let rankingTrendExpanded=false;
function rankingDemoSeries(personal=false){
 const month=Number(rankingDemoMonth.slice(5)),days=new Date(2026,month,0).getDate(),count=month===9?21:days;
 return {days,values:Array.from({length:count},(_,i)=>Math.round((personal?900000:42000000)*(0.8+i/count*2+Math.sin(i*1.7+month)*.35+Math.cos(i*.7)*.25)*(month===9?1:month===8?.84:.72)))};
}
function rankingTrendChart(personal=false,detail=false){
 const {days,values}=rankingFilteredSeries(personal),w=detail?1000:personal?360:rankingTrendExpanded?1000:360,h=detail?260:personal?90:rankingTrendExpanded?260:210,left=personal&&!detail?4:44,right=12,top=12,bottom=personal&&!detail?8:34;
 const max=Math.max(...values)*1.15||1;
 const x=i=>left+i/(days-1)*(w-left-right),y=v=>top+(1-v/max)*(h-top-bottom);
 const points=values.map((v,i)=>`${x(i)},${y(v)}`).join(' '),id=personal?'personal':'community';
 const ticks=[1,10,20,days].filter((v,i,a)=>v<=days&&a.indexOf(v)===i);
 return `<svg class="ranking-trend ${personal&&!detail?'ranking-spark':''}" viewBox="0 0 ${w} ${h}" tabindex="0" role="img" aria-label="${personal?'我的':'社区'} ${rankingDemoMonth} 每日 Token 用量演示折线图"><defs><linearGradient id="ranking-fill-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="currentColor" stop-opacity=".18"/><stop offset="100%" stop-color="currentColor" stop-opacity=".01"/></linearGradient></defs>${personal&&!detail?'':[0,1,2,3].map(i=>{const v=max*i/3;return `<line x1="${left}" y1="${y(v)}" x2="${w-right}" y2="${y(v)}" class="ranking-gridline"/><text x="${left-10}" y="${y(v)+4}" text-anchor="end">${i?rankingNumber(v,rankingState().metric):'0'}</text>`}).join('')}<polygon points="${left},${h-bottom} ${points} ${x(values.length-1)},${h-bottom}" fill="url(#ranking-fill-${id})"/><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="${personal?2:2.5}" stroke-linecap="round" stroke-linejoin="round"/>${values.map((v,i)=>`<circle data-trend-date="${rankingDemoMonth}-${String(i+1).padStart(2,'0')}" data-trend-value="${rankingState().metric==='cost'?'$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):Math.round(v).toLocaleString('zh-CN')+' Token'}" cx="${x(i)}" cy="${y(v)}" r="${personal?2:3}" fill="currentColor"/>`).join('')}${personal&&!detail?'':ticks.map(d=>`<text x="${x(d-1)}" y="${h-8}" text-anchor="middle">${d}日</text>`).join('')}</svg>`;
}
function rankingEntries(state){
 const base=rankingSnapshotEntries({board:'total',metric:'total',model:'',city:''});
 const names=[...base.map(e=>e.handle),'Sage'];
 const community=rankingDemoSeries().values.reduce((a,b)=>a+b,0),mine=rankingDemoSeries(true).values.reduce((a,b)=>a+b,0);
 const sum=base.reduce((a,e)=>a+e.score,0);
 return names.map((handle,i)=>{
  const total=handle==='Sage'?mine:Math.round(base[i].score/sum*(community-mine));
  const byTool={},byModel=[];
  for(const [tool,share,model,price] of [['codex',.58,'gpt-5.5',.000002],['claude-code',.42,'claude-opus-5',.000003]]){
   if(state.board.length&&!state.board.includes(tool)||state.model.length&&!state.model.includes(model))continue;
   if(state.city&&!novaRankingData.cities[state.city]?.includes(handle))continue;
   const value=total*share;byTool[tool]=state.metric==='cost'?value*price:state.metric==='fresh'?value*.62:value;
   byModel.push({model,tool,score:byTool[tool]});
  }
  return {handle,byTool,byModel,score:Object.values(byTool).reduce((a,b)=>a+b,0)};
 }).filter(e=>e.score>0).sort((a,b)=>b.score-a.score).map((e,i)=>({...e,rank:i+1}));
}
function rankingSidebar(state){
 const connected=route().params.get('connection')==='connected';
 const connect=connected?'':`<button type="button" class="ds-button section-empty-action ranking-connect-button" data-ranking-connect>接入排行</button>`;
 if(!connected)return `<aside class="ranking-rank-sidebar ranking-disconnected" aria-label="我的排行"><header><h2>我的排行</h2></header><div class="ranking-connect-empty"><div class="ranking-connect-symbol" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v4m8-4v4M6 7h12v3a6 6 0 0 1-12 0V7Zm6 9v5"/></svg></div><h3>连接工具，开启你的排名</h3><p>接入 AI 工具用量后，在这里查看你的 Token 使用、社区排名和工具分布。</p>${connect}</div></aside>`;
 const me=rankingEntries(state).find(e=>e.handle==='Sage');
 return `<aside class="ranking-rank-sidebar" aria-label="我的排行"><header><h2>我的排行</h2><a class="ranking-demo-detail" href="${rankingUsageHref()}">查看详情</a></header><div class="ranking-rank-summary"><span class="ranking-connected-status"><span class="ranking-connection-dot" aria-hidden="true"></span>已连接</span><div class="ranking-rank-value"><strong class="ranking-side-rank">${me?'#'+me.rank:'—'}</strong><button type="button" class="ranking-locate ranking-locate-icon" data-ranking-locate aria-label="定位我的排名" title="定位我的排名"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg></button></div></div><dl><div><dt>${rankingMetrics[state.metric]}${state.metric==='cost'?' USD':' Token'}</dt><dd>${me?rankingNumber(me.score,state.metric):'暂无记录'}</dd></div></dl><section class="ranking-person-tool-map"><div class="ranking-distribution-heading"><h3>${state.metric==='cost'?'模型费用分布':'模型用量分布'}</h3>${me?`<span>${me.byModel.length} 个模型</span>`:''}</div>${me?`${rankingTreemap(me,state)}`:'<p>当前筛选下暂无用量</p>'}</section></aside>`;
}
document.addEventListener('change',e=>{if(!e.target.matches('[data-ranking-month]'))return;rankingDemoMonth=e.target.value;document.querySelector('#ranking-month-picker')?.hidePopover();const params=new URLSearchParams(route().params);params.set('month',rankingDemoMonth);location.hash='#ranking?'+params.toString();});

function rankingSelectSingle(e){
 const input=e.target.closest('[data-ranking-single]');if(!input)return;
 const key=input.dataset.rankingSingle;
 if(!['metric','city'].includes(key))return;
 document.querySelector('#ranking-filter-'+key)?.hidePopover();
 const params=new URLSearchParams(route().params);
 if(input.value)params.set(key,input.value);else params.delete(key);
 location.hash='#ranking?'+params.toString();
}
document.addEventListener('click',rankingSelectSingle);
document.addEventListener('change',rankingSelectSingle);

function rankingFilterControl(key,label,options){
 const state=rankingState(),selected=state[key],id='ranking-filter-'+key,multiple=key==='board'||key==='model';
 if(key==='metric'||key==='city')return `<div class="ranking-filter-control"><div class="feed-filter-group" role="group" aria-label="${label}筛选"><button class="feed-filter-trigger" type="button" popovertarget="${id}" aria-label="筛选${label}" aria-haspopup="dialog" aria-expanded="false">${escapeHtml(options.find(option=>option[0]===selected)?.[1]||label)}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div><div id="${id}" class="feed-filter-popover" popover="auto" role="dialog" aria-label="${label}" data-preserve-order><div class="feed-filter-options">${options.map(([value,name])=>`<label class="feed-filter-option"><input type="radio" name="${id}" data-ranking-single="${key}" value="${escapeHtml(value)}" ${selected===value?'checked':''}><span>${escapeHtml(name)}</span></label>`).join('')}</div></div></div>`;
 const values=multiple?selected:(selected&&selected!==options[0][0]?[selected]:[]);
 const trigger=`<div class="feed-filter-group" role="group" aria-label="${label}筛选"><button class="feed-filter-trigger" type="button" popovertarget="${id}" aria-label="筛选${label}" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>${label}</button>${values.map(value=>`<button class="feed-filter-chip" type="button" data-ranking-remove="${escapeHtml(value)}" data-ranking-remove-key="${key}" aria-label="移除${label}：${escapeHtml(options.find(o=>o[0]===value)?.[1]||value)}">${escapeHtml(options.find(o=>o[0]===value)?.[1]||value)}<span aria-hidden="true">×</span></button>`).join('')}</div>`;
 return `<div class="ranking-filter-control">${trigger}<div id="${id}" class="feed-filter-popover" popover="auto" role="dialog" aria-label="筛选${label}" data-ranking-key="${key}"><div class="feed-filter-search"><input type="search" aria-label="搜索${label}" placeholder="搜索${label}" autocomplete="off"></div><div class="feed-filter-options">${(multiple?options.slice(1):options).map(([value,name])=>`<label class="feed-filter-option"><input type="${multiple?'checkbox':'radio'}" name="${id}" value="${escapeHtml(value)}" ${(multiple?(selected.length?selected.includes(value):value===options[0][0]):selected===value)?'checked':''}><span>${escapeHtml(name)}</span></label>`).join('')}<p class="feed-filter-empty" hidden>没有匹配的选项</p></div><footer><button data-ranking-reset-filter>${multiple?'清空':'重置'}</button><button class="ds-button" data-ranking-apply-filter>应用筛选</button></footer></div></div>`;
}
document.addEventListener('click',e=>{
 const remove=e.target.closest('[data-ranking-remove]');if(remove){const key=remove.dataset.rankingRemoveKey;location.hash=rankingLink(key,(['board','model'].includes(key)?rankingState()[key].filter(value=>value!==remove.dataset.rankingRemove):key==='metric'?'total':''));return;}
 const panel=e.target.closest('[data-ranking-key]');if(!panel)return;
 if(e.target.closest('[data-ranking-reset-filter]'))panel.querySelectorAll('.feed-filter-option input').forEach((input,i)=>input.checked=input.type==='radio'&&i===0);
 if(e.target.closest('[data-ranking-apply-filter]')){const multi=['board','model'].includes(panel.dataset.rankingKey);const checked=[...panel.querySelectorAll('.feed-filter-option input:checked')].map(input=>input.value);const value=multi?checked.filter(v=>v&&v!=='total'):checked[0]??'';panel.hidePopover();location.hash=rankingLink(panel.dataset.rankingKey,value);}
});
function rankingFilteredSeries(personal=false){
 const series=rankingDemoSeries(personal),entries=rankingEntries(rankingState());
 const total=personal?(entries.find(e=>e.handle==='Sage')?.score||0):entries.reduce((sum,e)=>sum+e.score,0);
 const base=series.values.reduce((sum,v)=>sum+v,0);
 return {...series,values:series.values.map(v=>v/base*total)};
}
function rankingUsageHref(){
 const params=new URLSearchParams(route().params);params.set('view','usage');params.set('month',rankingDemoMonth);
 return '#ranking?'+params.toString();
}
function rankingUsagePage(){
 const state=rankingState(),params=new URLSearchParams(route().params);params.delete('view');
 const back='#ranking'+(params.size?'?'+params.toString():''),{values}=rankingFilteredSeries(true);
 const total=values.reduce((sum,v)=>sum+v,0),unit=state.metric==='cost'?'USD':'Token';
 const exact=v=>state.metric==='cost'?'$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):Math.round(v).toLocaleString('zh-CN');
 return `<section class="ranking-page ranking-usage-page"><a class="reader-back" href="${escapeHtml(back)}">← 返回 Token 榜</a><header class="ranking-usage-header"><h1>我的使用详情</h1><p>${rankingDemoMonth.replace('-',' 年 ')} 月 · ${rankingMetrics[state.metric]}</p></header><dl class="ranking-usage-summary"><div><dt>${state.metric==='cost'?'预估费用':'累计用量'} ${unit}</dt><dd>${rankingNumber(total,state.metric)}</dd></div><div><dt>日均${state.metric==='cost'?'费用':'用量'}</dt><dd>${rankingNumber(values.length?total/values.length:0,state.metric)}</dd></div><div><dt>有用量的天数</dt><dd>${values.filter(v=>v>0).length}<small> 天</small></dd></div></dl><section class="ranking-usage-chart"><h2>每日${state.metric==='cost'?'费用':'用量'}趋势</h2>${rankingTrendChart(true,true)}</section><section class="ranking-usage-days"><h2>每日明细</h2><table><thead><tr><th scope="col">日期</th><th scope="col">${state.metric==='cost'?'预估费用（USD）':'用量（Token）'}</th></tr></thead><tbody>${values.map((value,i)=>`<tr><td>${rankingDemoMonth}-${String(i+1).padStart(2,'0')}</td><td>${exact(value)}</td></tr>`).join('')}</tbody></table></section></section>`;
}
function novaRankingPage(){
 const month=route().params.get('month');
 if(['2026-09','2026-08','2026-07'].includes(month))rankingDemoMonth=month;
 if(route().params.get('view')==='usage')return rankingUsagePage();
 if(route().params.get("view")==="connect")return rankingConnectPage();
 const state=rankingState(),entries=rankingEntries(state),total=entries.reduce((s,e)=>s+e.score,0),activeTools=new Set(entries.flatMap(e=>Object.keys(e.byTool))).size;
 const toolTotals=new Map();
 for(const entry of entries)for(const [tool,score] of Object.entries(entry.byTool))toolTotals.set(tool,(toolTotals.get(tool)||0)+score);
 const summaryLabel=state.board==='total'&&!state.model&&!state.city?'全站合计':'当前筛选合计';
 const external=(path,label,cls='')=>`<a class="${cls}" href="${novaRankingData.source+path}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true">↗</span></a>`;
 const select=(key,label,options)=>`<label class="ranking-select"><span>${label}</span><select aria-label="${label}" data-ranking-filter="${key}"><option value="">全部${label}</option>${options.map(value=>`<option value="${escapeHtml(value)}"${state[key]===value?' selected':''}>${escapeHtml(value)}</option>`).join('')}</select></label>`;
 return `<section class="ranking-page" aria-label="新岛 AI Token 榜">
 <div class="ranking-topline"><header class="home-heading"><div class="ranking-title-row"><h1>Token 榜</h1></div><p>记录每一次 AI 实践</p></header></div>
 <div class="ranking-unified-filters"><div class="ranking-sticky-filters"><div class="ranking-month-filter feed-filter-group"><button type="button" class="feed-filter-trigger" popovertarget="ranking-month-picker" aria-haspopup="dialog" aria-expanded="false" aria-label="选择统计月份">${rankingDemoMonth.slice(0,4)} 年 ${Number(rankingDemoMonth.slice(5))} 月<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div id="ranking-month-picker" class="feed-filter-popover" popover="auto" role="dialog" aria-label="统计月份" data-preserve-order><div class="feed-filter-options">${['2026-09','2026-08','2026-07'].map(m=>`<label class="feed-filter-option"><input type="radio" name="ranking-month" data-ranking-month value="${m}" ${rankingDemoMonth===m?'checked':''}><span>${m.slice(0,4)} 年 ${Number(m.slice(5))} 月</span></label>`).join('')}</div></div></div><div class="ranking-filter-left">${rankingFilterControl('board','AI Agent',Object.entries(rankingTools).map(([key,name])=>[key,key==='total'?'全部工具':name]))}${rankingFilterControl('model','模型',[['','全部模型'],['gpt-5.5','gpt-5.5'],['claude-opus-5','claude-opus-5']])}${rankingFilterControl('metric','统计口径',Object.entries(rankingMetrics))}${rankingFilterControl('city','城市',[['','全部城市'],...novaRankingData.meta.cities.map(x=>[x.city,x.city])])}</div></div><a class="ranking-rules-link" href="${novaRankingData.source}/rules" target="_blank" rel="noopener noreferrer" aria-label="榜单规则（在新标签页打开）"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r=".8" fill="currentColor" stroke="none"/></svg>榜单规则</a></div>
 <div class="ranking-main-layout${rankingTrendExpanded?' ranking-trend-expanded':''}">
 <section class="ranking-results-card" aria-label="成员排行榜"><div class="ranking-results-heading"><h2>成员排行榜</h2><label class="ranking-find"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input aria-label="搜索成员" placeholder="搜索成员昵称" value="${escapeHtml(rankingNickname)}" data-ranking-nickname></label></div>

 <p class="ranking-my-rank" data-ranking-result role="status" hidden></p>
 <div class="ranking-empty" data-ranking-list-empty hidden><h3>没有匹配的成员</h3><p>试试其他昵称，或清除搜索条件。</p><button class="ds-button secondary" data-ranking-clear>清除列表筛选</button></div>
 <div class="ranking-table-wrap" tabindex="0" role="region" aria-label="${state.metric==='cost'?'预估费用':'Token 用量'}排名"><table class="ranking-table"><thead><tr><th scope="col">排名</th><th scope="col">成员</th><th scope="col" class="ranking-tags">标签</th><th scope="col" class="ranking-usage">${state.metric==='cost'?'费用':'用量'}分布</th><th scope="col" class="ranking-score">${state.metric==='cost'?'预估费用（USD）':'Token 用量'}</th></tr></thead><tbody>${rankingRows(entries,state)}</tbody></table>${entries.length?'':`<div class="ranking-empty"><span aria-hidden="true">—</span><h3>当前筛选下暂无排名</h3><p>试试其他工具、模型或城市，看看岛民们的 AI 实践。</p><a href="#ranking" class="ds-button secondary">查看总榜</a></div>`}</div>
 </section><div class="ranking-support-column"><section class="ranking-community-card" aria-labelledby="ranking-community-title"><header class="ranking-community-header"><h2 id="ranking-community-title">用量趋势</h2><button class="ranking-expand-trend" data-ranking-expand-trend aria-expanded="${rankingTrendExpanded}" aria-label="${rankingTrendExpanded?'收起用量趋势':'放大用量趋势'}" title="${rankingTrendExpanded?'收起':'放大'}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${rankingTrendExpanded?'M4 9h5V4M20 15h-5v5M9 9 3 3m12 12 6 6':'M9 3H3v6m12 12h6v-6M3 3l6 6m6 6 6 6'}"/></svg></button></header><dl class="ranking-community-stats"><div><dt>${state.metric==='cost'?'预估费用':'总 Token'}</dt><dd>${rankingNumber(total,state.metric)}</dd></div><div><dt>参与人数</dt><dd>${entries.length} <small>人</small></dd></div><div><dt>活跃工具</dt><dd>${activeTools} <small>个</small></dd></div></dl>${rankingTrendChart()}</section>${rankingSidebar(state)}</div></div>

 </section>`;
}
function rankingMatchMessage(entries){const name=rankingNickname.trim();if(!name)return '';const e=entries.find(x=>x.handle.toLowerCase()===name.toLowerCase());return e?`${escapeHtml(e.handle)} 当前排名 <strong>#${e.rank}</strong>，${rankingMetrics[rankingState().metric]} ${rankingNumber(e.score,rankingState().metric)}`:'当前榜单中没有找到这个昵称。';}
document.addEventListener('change',e=>{const key=e.target.dataset.rankingFilter;if(key)location.hash=rankingLink(key,e.target.value);});
function rankingFilterList(){
 const query=rankingNickname.trim().toLowerCase();let count=0;
 document.querySelectorAll('[data-ranking-name]').forEach(row=>{const name=row.dataset.rankingName;row.hidden=!(name.toLowerCase().includes(query));if(!row.hidden)count++;});
 const empty=document.querySelector('[data-ranking-list-empty]');
 if(empty)empty.hidden=count>0||!query;
}
document.addEventListener('input',e=>{if(!e.target.matches('[data-ranking-nickname]'))return;rankingNickname=e.target.value;rankingFilterList();});
new MutationObserver(()=>{if(document.querySelector('[data-ranking-nickname]'))rankingFilterList();}).observe(document.querySelector('#content'),{childList:true});
document.addEventListener('click',async e=>{
 const detail=e.target.closest('[data-ranking-detail]');
 if(detail){const details=detail.closest('tr').querySelector('details');details.open=!details.open;return;}
 const clear=e.target.closest('[data-ranking-clear]');
 if(clear){rankingNickname='';document.querySelector('[data-ranking-nickname]').value='';rankingFilterList();return;}
 const locate=e.target.closest('[data-ranking-locate]');
 if(locate){
  const name=document.querySelector('#account-trigger strong')?.textContent.trim()||'Sage';
  const entry=rankingEntries(rankingState()).find(person=>person.handle===name);
  const result=document.querySelector('[data-ranking-result]');result.hidden=true;result.textContent='';
  if(!entry){result.textContent=`当前筛选下没有${name?' '+name+' 的':''}排名记录，请切回总榜或清除模型、城市筛选。`;result.hidden=false;return;}
  rankingLocatedName=name;rankingNickname='';document.querySelector('[data-ranking-nickname]').value='';rankingFilterList();
  document.querySelectorAll('[data-ranking-name]').forEach(row=>{row.classList.toggle('ranking-match',row.dataset.rankingName===name);if(row.dataset.rankingName===name)row.scrollIntoView({block:'center',behavior:'instant'});});return;
 }
 const follow=e.target.closest('[data-ranking-follow]');
 if(follow){const name=follow.dataset.rankingFollow,next=new Set(rankingFollows);next.has(name)?next.delete(name):next.add(name);try{localStorage.setItem('nova-ranking-follows',JSON.stringify([...next]));}catch{notify('关注保存失败，请稍后重试');return;}rankingFollows.clear();next.forEach(x=>rankingFollows.add(x));follow.textContent=next.has(name)?'已关注':'关注';follow.setAttribute('aria-pressed',String(next.has(name)));follow.setAttribute('aria-label',(next.has(name)?'取消关注':'关注')+' '+name);rankingFilterList();return;}
 const share=e.target.closest('[data-ranking-share]');
 if(share){const url=rankingPersonLink(share.dataset.rankingShare);try{await navigator.clipboard.writeText(url);notify('个人榜单链接已复制');}catch{window.prompt('复制个人榜单链接',url);}}
});

document.addEventListener('click',e=>{if(!e.target.closest('[data-ranking-expand-trend]'))return;rankingTrendExpanded=!rankingTrendExpanded;document.querySelector('#content').innerHTML=novaRankingPage();document.querySelector('[data-ranking-expand-trend]')?.focus({preventScroll:true});});

// Prototype connection flow: show demo usage without connecting an external account.
document.addEventListener('click',e=>{
 if(!e.target.closest('[data-ranking-connect]'))return;
 location.hash=rankingConnectHref();
});

let rankingConnectName='',rankingConnectOS='mac',rankingConnectStage='idle';
function rankingInstallCommand(){const name=rankingConnectName.trim();if(!name)return '';if(rankingConnectOS==='windows')return "$env:NOVATOKEN_HANDLE='"+name.replace(/'/g,"''")+"'; $env:NOVATOKEN_YES='1'; $env:NOVATOKEN_INSTALL_SERVICE='1'; irm https://novatoken.novaislandai.workers.dev/install.ps1 | iex";return name?"curl -fsSL https://novatoken.novaislandai.workers.dev/install.sh | sh -s -- '"+name.replace(/'/g,"'\"'\"'")+"'":'';}

function rankingConnectHref(){const p=new URLSearchParams(route().params);p.set('view','connect');return '#ranking?'+p.toString();}
function rankingConnectReturn(connected=false){const p=new URLSearchParams(route().params);p.delete('view');if(connected)p.set('connection','connected');return '#ranking'+(p.size?'?'+p.toString():'');}
function rankingConnectPage(){
 const done=rankingConnectStage==='done'||route().params.get('connection')==='connected';
 const command=rankingInstallCommand();
 return `<section class="ranking-connect-page"><a class="reader-back ranking-connect-back" href="${rankingConnectReturn()}">← 返回 Token 榜</a><header><h1>接入排行</h1><p>设置公开名称，在本机终端运行接入命令，同步你的 AI 工具用量。</p></header>
 <div class="ranking-connect-layout"><div class="ranking-connect-flow">${done?'':`<section class="ranking-connect-step"><span class="ranking-step-number" aria-hidden="true">1</span><h2>自定义排行名称</h2><div class="ranking-connect-panel"><label for="ranking-connect-name">公开名称</label><input id="ranking-connect-name" class="ds-input" data-connect-name value="${escapeHtml(rankingConnectName)}" placeholder="输入你想在排行榜显示的名称" maxlength="60" autocomplete="nickname"><p>这个名称会显示在排行榜中。多台设备接入时，请使用相同名称。</p></div></section>
 <section class="ranking-connect-step"><span class="ranking-step-number" aria-hidden="true">2</span><h2>复制命令，在终端运行</h2><div class="ranking-connect-panel"><div class="ranking-connect-tabs ranking-os-tabs" role="tablist" aria-label="操作系统">${[['mac','macOS / Linux'],['windows','Windows']].map(([os,label])=>`<button type="button" role="tab" id="connect-os-${os}" data-connect-os="${os}" aria-selected="${rankingConnectOS===os}" aria-controls="connect-os-panel" tabindex="${rankingConnectOS===os?0:-1}">${label}</button>`).join('')}</div><div id="connect-os-panel" role="tabpanel" aria-labelledby="connect-os-${rankingConnectOS}"><p>${rankingConnectOS==='mac'?'打开 Terminal（终端），粘贴以下命令并运行。':'打开 Windows PowerShell，粘贴以下命令并运行。'}</p><pre data-connect-command>${escapeHtml(command||'请先填写上方的公开名称，生成你的接入命令。')}</pre><button class="ds-button section-empty-action" data-connect-copy ${command?'':'disabled'}>复制接入命令</button><small>首次扫描历史日志可能需要几分钟，运行过程中请勿重复启动。</small><details class="ranking-connect-help"><summary>想让 AI 帮你运行？</summary><p>将生成的命令发送给 Claude Code、Codex 或 WorkBuddy，请它协助执行并检查首次同步结果。</p></details></div></div></section>`}
 <section class="ranking-connect-step"><span class="ranking-step-number" aria-hidden="true">3</span><h2>检查同步，查看排行</h2><div class="ranking-connect-panel ranking-connect-status" role="status"><span class="ranking-connect-status-dot ${done?'is-done':''}"></span><h2>${done?'接入成功':rankingConnectStage==='copied'?'等待首次同步':'尚未接入'}</h2><p>${done?'你的用量已同步，可以查看本月使用数据和社区排行。':'在本机完成接入后，回到这里检查同步结果。'}</p>${done?`<a class="ds-button section-empty-action" href="${rankingConnectReturn(true)}">查看我的排行</a>`:`<button class="ds-button section-empty-action" data-connect-check>模拟检查接入状态</button>`}<small>原型演示：此处模拟同步结果，不会安装客户端或连接真实账号。</small></div></section>
 </div><aside class="ranking-connect-aside" aria-label="上榜规则与常见问题"><section class="ranking-connect-panel"><h2>上榜规则</h2><ul><li>按日期汇总 Token 用量，仅上传统计数字，不上传对话、代码、文件内容或密钥。</li><li>多台设备使用同一公开名称时合并展示，最多计入用量最高的 3 台。</li><li>请勿上传不实数据刷榜，排行用于交流，不作为正式财务账单。</li></ul><a href="${novaRankingData.source}/rules" target="_blank" rel="noopener noreferrer">查看完整规则 ↗</a></section><section class="ranking-connect-panel"><h2>常见问题</h2><details class="ranking-connect-help" open><summary>多久同步一次？</summary><p>安装后每 30 分钟自动同步。首次扫描历史日志可能需要几分钟，请等待完成，不要重复启动。</p></details><details class="ranking-connect-help"><summary>没有同步到数据怎么办？</summary><p>确认安装过程已完成、公开名称一致，并检查本机是否有工具用量日志。完成后再检查接入状态。</p></details><details class="ranking-connect-help"><summary>多台电脑怎么接入？</summary><p>在每台电脑上使用相同公开名称生成命令，分别安装客户端。</p></details><details class="ranking-connect-help"><summary>某个工具未被统计怎么办？</summary><p>可先让 AI 助手只读检查本地用量日志，整理仅含用量字段的脱敏样例，再通过接入帮助反馈。</p><a href="${novaRankingData.source}/connect" target="_blank" rel="noopener noreferrer">查看接入帮助 ↗</a></details></section></aside></div></section>`;
}
document.addEventListener('click',async e=>{
 if(e.target.closest('[data-connect-check]')){if(!rankingConnectName.trim()){notify('请先填写公开名称');return;}rankingConnectStage='done';document.querySelector('#content').innerHTML=novaRankingPage();return;}
 const copy=e.target.closest('[data-connect-copy]');if(copy){const text=rankingInstallCommand();if(!text)return;try{await navigator.clipboard.writeText(text);rankingConnectStage='copied';rankingSyncSteps();const status=document.querySelector('.ranking-connect-status h2');if(status)status.textContent='等待首次同步';notify('已复制，请在本机完成接入');}catch{notify('复制失败，请手动选择指引复制');}}
});
document.addEventListener('click',e=>{
 const tab=e.target.closest('[data-connect-os]');if(!tab)return;
 rankingConnectOS=tab.dataset.connectOs;
 document.querySelector('#content').innerHTML=novaRankingPage();
 document.querySelector(`[data-connect-os="${rankingConnectOS}"]`)?.focus({preventScroll:true});
});
document.addEventListener('keydown',e=>{
 const tab=e.target.closest('[data-connect-os]');
 if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();
 const tabs=[...tab.parentElement.querySelectorAll('[role="tab"]')],i=tabs.indexOf(tab);
 const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 tabs[next].click();
});

document.addEventListener('input',e=>{if(!e.target.matches('[data-connect-name]'))return;rankingConnectName=e.target.value;rankingConnectStage='idle';const command=rankingInstallCommand(),pre=document.querySelector('[data-connect-command]'),button=document.querySelector('[data-connect-copy]');if(pre)pre.textContent=command||'请先填写上方的公开名称，生成你的接入命令。';if(button)button.disabled=!command;});

function rankingSyncSteps(){
 const steps=[...document.querySelectorAll('.ranking-connect-step')];
 const done=rankingConnectStage==='done'||route().params.get('connection')==='connected';
 const active=done?4:rankingConnectStage==='copied'?3:rankingConnectName.trim()&&document.activeElement?.matches('[data-connect-name]')!==true?2:1;
 steps.forEach(step=>{
  const badge=step.querySelector('.ranking-step-number');
  const number=Number(badge.dataset.step||badge.textContent);badge.dataset.step=number;
  step.classList.toggle('step-complete',number<active);step.classList.toggle('step-current',number===active);step.classList.toggle('step-link-flowing',number===active-1&&active<4);
  if(number===active)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');
  badge.textContent=number<active?'✓':String(number);
 });
}
new MutationObserver(rankingSyncSteps).observe(document.querySelector('#content'),{childList:true});
document.addEventListener('focusout',e=>{if(e.target.matches('[data-connect-name]'))requestAnimationFrame(rankingSyncSteps);});
document.addEventListener('input',e=>{if(e.target.matches('[data-connect-name]'))rankingSyncSteps();});

// One tooltip follows the closest daily point, including scaled and expanded charts.
(() => {
 let tip,active;
 function hide(){
  active?.classList.remove('is-active');active=null;
  if(tip?.matches(':popover-open'))tip.hidePopover();
 }
 function show(point){
  if(!tip){
   tip=document.createElement('div');tip.className='ranking-point-tooltip';
   tip.id='ranking-point-tooltip';tip.setAttribute('popover','manual');tip.setAttribute('role','tooltip');
   tip.innerHTML='<small></small><strong></strong>';
   document.querySelector('.nova-ds').append(tip);
  }
  active?.classList.remove('is-active');active=point;point.classList.add('is-active');
  tip.querySelector('small').textContent=point.dataset.trendDate;
  tip.querySelector('strong').textContent=point.dataset.trendValue;
  const svg=point.ownerSVGElement;
  svg.setAttribute('aria-describedby',tip.id);
  tip.showPopover();
  const at=new DOMPoint(point.cx.baseVal.value,point.cy.baseVal.value).matrixTransform(svg.getScreenCTM());
  const width=tip.offsetWidth,height=tip.offsetHeight;
  const left=Math.max(8,Math.min(at.x-width/2,innerWidth-width-8));
  const below=at.y-height-14<8;
  tip.classList.toggle('below',below);
  tip.style.left=left+'px';tip.style.top=(below?at.y+14:at.y-height-14)+'px';
  tip.style.setProperty('--arrow-x',Math.max(16,Math.min(width-16,at.x-left))+'px');
 }
 document.addEventListener('pointermove',e=>{
  const svg=e.target.closest?.('.ranking-trend');
  if(!svg){hide();return;}
  const matrix=svg.getScreenCTM();if(!matrix)return;
  const cursor=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
  const points=[...svg.querySelectorAll('[data-trend-date]')];
  const point=points.reduce((best,p)=>!best||Math.abs(p.cx.baseVal.value-cursor.x)<Math.abs(best.cx.baseVal.value-cursor.x)?p:best,null);
  if(point)show(point);
 });
 document.addEventListener('pointerout',e=>{const svg=e.target.closest?.('.ranking-trend');if(svg&&!svg.contains(e.relatedTarget))hide()});
 document.addEventListener('focusin',e=>{if(e.target.matches('.ranking-trend')){const point=e.target.querySelector('[data-trend-date]');if(point)show(point)}});
 document.addEventListener('focusout',e=>{if(e.target.matches('.ranking-trend'))hide()});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){hide();return;}
  if(!e.target.matches('.ranking-trend')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();const points=[...e.target.querySelectorAll('[data-trend-date]')];
  const index=e.key==='Home'?0:e.key==='End'?points.length-1:Math.max(0,Math.min(points.length-1,points.indexOf(active)+(e.key==='ArrowRight'?1:-1)));
  if(points[index])show(points[index]);
 });
 document.addEventListener('scroll',hide,true);
 window.addEventListener('resize',hide);window.addEventListener('hashchange',hide);
 document.addEventListener('change',e=>{if(e.target.closest('.ranking-page,.feed-filter-popover'))hide()});
 document.addEventListener('click',e=>{if(e.target.closest('[data-ranking-expand-trend]'))hide()});
})();

// Compact model distribution: details appear on hover, keyboard focus or tap.
(() => {
 let tip,active;
 function hide(){
  active?.removeAttribute('aria-describedby');active=null;
  if(tip?.matches(':popover-open'))tip.hidePopover();
 }
 function show(segment){
  if(!tip){
   tip=document.createElement('div');tip.id='ranking-distribution-tooltip';
   tip.className='ranking-point-tooltip ranking-distribution-tooltip';
   tip.setAttribute('popover','manual');tip.setAttribute('role','tooltip');
   tip.innerHTML='<small></small><strong></strong><span></span>';
   document.querySelector('.nova-ds').append(tip);
  }
  active?.removeAttribute('aria-describedby');active=segment;
  segment.setAttribute('aria-describedby',tip.id);
  tip.querySelector('small').textContent=segment.dataset.distributionTool;
  tip.querySelector('strong').textContent=segment.dataset.distributionModel;
  tip.querySelector('span').textContent=segment.dataset.distributionValue+' · '+segment.dataset.distributionShare;
  if(!tip.matches(':popover-open'))tip.showPopover();
  const rect=segment.getBoundingClientRect(),width=tip.offsetWidth,height=tip.offsetHeight,x=rect.left+rect.width/2;
  const left=Math.max(8,Math.min(x-width/2,innerWidth-width-8)),below=rect.top-height-12<8;
  tip.classList.toggle('below',below);tip.style.left=left+'px';
  tip.style.top=(below?rect.bottom+12:rect.top-height-12)+'px';
  tip.style.setProperty('--arrow-x',Math.max(16,Math.min(width-16,x-left))+'px');
 }
 const selector='[data-distribution-model]';
 document.addEventListener('pointerover',e=>{const segment=e.target.closest?.(selector);if(segment)show(segment)});
 document.addEventListener('pointerout',e=>{if(e.target.closest?.(selector)&&!e.target.contains(e.relatedTarget))hide()});
 document.addEventListener('focusin',e=>{if(e.target.matches(selector))show(e.target)});
 document.addEventListener('focusout',e=>{if(e.target.matches(selector))hide()});
 document.addEventListener('click',e=>{const segment=e.target.closest?.(selector);if(segment)show(segment);else hide()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
 document.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);window.addEventListener('hashchange',hide);
 document.addEventListener('change',hide);
})();

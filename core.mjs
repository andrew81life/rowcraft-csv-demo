export function parseCSV(text, delimiter=',') {
  if (![',',';','\t'].includes(delimiter)) throw Error('Unsupported delimiter');
  text=String(text).replace(/^\uFEFF/,'');
  if(!text.length)return [];
  const rows=[];let row=[],field='',quoted=false,afterQuote=false,started=false;
  const pushField=()=>{row.push(field);field='';afterQuote=false;started=false;};
  const pushRow=()=>{pushField();rows.push(row);row=[];if(rows.length>20001)throw Error('Maximum 20,000 data rows');};
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;afterQuote=true;}}else field+=c;continue;}
    if(c===delimiter){pushField();continue;}
    if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;pushRow();continue;}
    if(afterQuote)throw Error('Unexpected character after a closing quote');
    if(c==='"'){if(started||field.length)throw Error('Quote inside unquoted field');quoted=true;started=true;continue;}
    field+=c;started=true;
  }
  if(quoted)throw Error('Unclosed quoted field');
  if(row.length||field.length||started||afterQuote)pushRow();
  return rows;
}
export function cleanRows(rows,{trim=true,dedupe=true}={}){
  if(!rows.length)throw Error('CSV is empty');
  const header=rows[0].map(v=>trim?v.trim():v),width=header.length;
  if(header.every(v=>v===''))throw Error('Header row is empty');
  const output=[header],seen=new Set();let duplicates=0,empty=0,changed=0;
  rows.slice(1).forEach((r,idx)=>{
    if(r.every(v=>!v.trim())){empty++;return;}
    if(r.length!==width)throw Error(`Row ${idx+2}: expected ${width} columns, found ${r.length}`);
    const n=r.map(v=>trim?v.trim():v);if(n.some((v,i)=>v!==r[i]))changed++;
    const key=JSON.stringify(n);if(dedupe&&seen.has(key)){duplicates++;return;}seen.add(key);output.push(n);
  });
  return {rows:output,report:{input:rows.length-1,kept:output.length-1,duplicates,empty,changed}};
}
export function toCSV(rows,{delimiter=',',protect=true}={}){
  let protectedCells=0;
  const text='\uFEFF'+rows.map(row=>row.map(v=>{
    v=String(v);if(protect&&/^[\s]*[=+\-@\t\r]/.test(v)){v="'"+v;protectedCells++;}
    return /["\r\n]/.test(v)||v.includes(delimiter)?'"'+v.replaceAll('"','""')+'"':v;
  }).join(delimiter)).join('\r\n')+'\r\n';
  return {text,protectedCells};
}

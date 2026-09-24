import fs from 'node:fs';
import satori from 'satori';
const records=JSON.parse(fs.readFileSync(new URL('../helpers/editorial-inserts.json',import.meta.url)));
const fonts=[{name:'Cormorant',data:fs.readFileSync('fonts/CormorantGaramond-SemiBold.ttf'),weight:600},{name:'Inter',data:fs.readFileSync('fonts/Inter-Regular.ttf'),weight:400}];
for(const item of records){
 const children=item.blocks.map((block,i)=>({type:'div',props:{style:{display:'flex',fontFamily:block.type.startsWith('h')?'Cormorant':'Inter',fontSize:i===0?44:block.type.startsWith('h')?29:22,lineHeight:1.5,marginTop:i===0?0:20,paddingTop:block.type==='li'?16:0,borderTop:block.type==='li'?'1px solid #d4d3c5':'0px solid transparent'},children:block.type==='li'?'•  '+block.text:block.text}}));
 const svg=await satori({type:'div',props:{style:{display:'flex',flexDirection:'column',width:800,padding:48,background:item.kind==='guide'?'#f8f5ed':'#edf0e7',color:'#23443e'},children}},{width:800,fonts});
 fs.writeFileSync('assets/inserts/'+item.name+'.svg',svg);
}

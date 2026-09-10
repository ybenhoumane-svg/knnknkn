import type {MemoryItem} from '../engine/types';import{rnd,shuffle}from'./common';
const symbols=['1','2','3','4','5','6','7','8','9','◆','●','▲'];
export function generateMemory(seed:number,d:number):MemoryItem{
 const r=rnd(seed),n=Math.min(12,4+d),seq=Array.from({length:n},()=>symbols[Math.floor(r()*symbols.length)]);
 let target:string,instruction:string,variant:string;
 const pick=(fn:(x:string,i:number)=>boolean)=>seq.filter(fn);
 switch((d+Math.floor(r()*12))%12){
  case 0:target=seq.join('');instruction='Mémorise puis restitue la séquence dans l’ordre.';variant='direct';break;
  case 1:target=pick((_,i)=>i%2===0).reverse().join('');instruction='Garde une valeur sur deux, puis restitue-les à l’envers.';variant='filter-reverse';break;
  case 2:target=pick((_,i)=>i%2===1).join('');instruction='Garde uniquement les positions paires et restitue-les dans l’ordre.';variant='even-filter';break;
  case 3:target=pick((x)=>!['◆','●','▲'].includes(x)).reverse().join('');instruction='Ignore les symboles. Garde seulement les chiffres, puis inverse leur ordre.';variant='category-reverse';break;
  case 4:target=pick((_,i)=>i%3===0).map(x=>['1','2','3','4','5','6','7','8','9'].includes(x)?String((Number(x)+1)%10):x).reverse().join('');instruction='Garde chaque troisième valeur, augmente les chiffres de 1, puis inverse.';variant='sparse-transform';break;
  case 5:target=pick((_,i)=>i%2===0).map(x=>['1','2','3','4','5','6','7','8','9'].includes(x)?String((Number(x)+2)%10):x).join('');instruction='Garde une valeur sur deux et augmente les chiffres de 2.';variant='filter-transform';break;
  case 6:target=seq.slice(1,-1).join('');instruction='Mémorise la séquence, mais restitue uniquement ce qui était entre le premier et le dernier élément.';variant='middle-only';break;
  case 7:target=seq.map((x,i)=>i%2===0?x:'').filter(Boolean).reverse().join('');instruction='Garde les positions impaires, puis restitue-les à l’envers.';variant='odd-reverse';break;
  case 8:target=[...seq].reverse().join('');instruction='Mémorise toute la séquence, puis restitue-la à l’envers.';variant='full-reverse';break;
  case 9:target=pick((_,i)=>i%3===1).join('');instruction='Garde chaque troisième valeur en commençant par la deuxième.';variant='third-offset';break;
  case 10:target=pick(x=>['◆','●','▲'].includes(x)).join('');instruction='Ignore les chiffres. Restitue uniquement les symboles dans l’ordre.';variant='symbols-only';break;
  default:target=seq.filter((_,i)=>i!==Math.floor(seq.length/2)).join('');instruction='Mémorise la séquence sauf l’élément central.';variant='remove-middle';
 }
 const candidates=new Set<string>([target,seq.join(''),seq.slice(1).join(''),seq.slice(0,-1).reverse().join(''),seq.filter((_,i)=>i%2===1).reverse().join('')]);
 const choices=shuffle([...candidates],r).slice(0,4);while(choices.length<4){const candidate=Array.from({length:Math.max(1,target.length)},()=>symbols[Math.floor(r()*symbols.length)]).join('');if(!choices.includes(candidate))choices.push(candidate)}
 return{id:`M-${seed}-${d}`,family:'MEMORY',difficulty:d,variant:`memory-${variant}`,tags:['working-memory','manipulation','recall',variant],prompt:`${instruction}`,expectedMs:2300+d*340,capabilities:{WM:.64,SEQ:.20,ATT:.11,RFD:.05},sequence:seq,choices,correct:choices.indexOf(target),instruction,encodeMs:Math.max(1900,3100-d*115),hideMs:620,target};
}

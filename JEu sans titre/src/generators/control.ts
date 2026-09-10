import type {ControlItem} from '../engine/types';import{rnd}from'./common';
export function generateControl(seed:number,d:number):ControlItem{
 const r=rnd(seed),mode=(d+Math.floor(r()*4))%4,n=18+Math.min(10,d),switchAt=Math.floor(n/2),secondSwitch=Math.floor(n*.75);
 const trials=Array.from({length:n},(_,i)=>{
  const target:'circle'|'triangle'=r()<.5?'circle':'triangle';
  let go:boolean;
  let switchNow=false;
  if(mode===0)go=target==='circle';
  else if(mode===1)go=target==='triangle';
  else if(mode===2){switchNow=i===switchAt;go=(i<switchAt?target==='circle':target==='triangle')}
  else{switchNow=i===switchAt||i===secondSwitch;go=(i<switchAt?target==='circle':i<secondSwitch?target==='triangle':target==='circle')}
  return{target,go,switchAt:switchNow,cue:(mode===1?'reverse':'normal') as 'normal'|'reverse'};
 });
 return{id:`C-${seed}-${d}`,family:'CONTROL',difficulty:d,variant:`control-${['go-circle','go-triangle','switch-once','switch-twice'][mode]}`,tags:['inhibition','attention','switching','reaction-time'],prompt:'Réagis à la bonne cible. La règle peut changer.',expectedMs:620+d*85,capabilities:{ATT:.30,INH:.30,FLEX:.28,SPD:.12},trials,controlMode:['go-nogo','reverse','switch','double-switch'][mode] as ControlItem['controlMode']};
}

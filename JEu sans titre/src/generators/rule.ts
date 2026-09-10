import type {RuleItem,RuleParams} from '../engine/types';
import {rnd,shuffle} from './common';
const SHAPES=['●','■','▲','◆','★','⬢'];
const shape=(base:number,i:number)=>SHAPES[(base+i+SHAPES.length*20)%SHAPES.length];

export function generateRule(seed:number,d:number):RuleItem{
 const r=rnd(seed),base=Math.floor(r()*6),kind=(d+Math.floor(r()*10))%10;
 let sequence:string[]=[];let next='';let label='';let params:RuleParams={kind:'',a:base};
 switch(kind){
  case 0:{sequence=[shape(base,0),shape(base,1),shape(base,0),shape(base,1),shape(base,0)];next=shape(base,1);label='alternance';params={kind:'alternance',a:base,b:1};break}
  case 1:{const step=1+Math.floor(r()*2);sequence=Array.from({length:6},(_,i)=>shape(base,i*step));next=shape(base,6*step);label='progression';params={kind:'progression',a:base,b:step};break}
  case 2:{sequence=[0,1,2,0,1,2].map(i=>shape(base,i));next=shape(base,0);label='cycle de trois';params={kind:'cycle3',a:base};break}
  case 3:{sequence=[0,1,2,3,0,1,2].map(i=>shape(base,i));next=shape(base,3);label='cycle de quatre';params={kind:'cycle4',a:base};break}
  case 4:{sequence=[0,1,2,1,2,1,2].map(i=>shape(base,i));next=shape(base,1);label='alternance composée';params={kind:'composed',a:base,b:1,c:2};break}
  case 5:{sequence=[0,1,2,3,2,3,2,3].map(i=>shape(base,i));next=shape(base,2);label='double règle';params={kind:'double',a:base,b:2,c:3};break}
  case 6:{sequence=[0,1,2,0,3,2,0,1,2].map(i=>shape(base,i));next=shape(base,0);label='règle conditionnelle';params={kind:'conditional',a:base,b:1,c:3};break}
  case 7:{sequence=[0,1,2,3,2,1,0,1].map(i=>shape(base,i));next=shape(base,2);label='miroir';params={kind:'mirror',a:base};break}
  case 8:{sequence=[0,2,4,1,3,5].map(i=>shape(base,i));next=shape(base,0);label='saut régulier';params={kind:'jump',a:base,b:2};break}
  default:{sequence=[0,1,3,4,0,1,3,4].map(i=>shape(base,i));next=shape(base,0);label='double cycle';params={kind:'doubleCycle',a:base,b:1,c:3};break}
 }
 const pool=shuffle([next,...shuffle(SHAPES.filter(x=>x!==next),r).slice(0,3)],r);
 return{id:`R-${seed}-${d}`,family:'RULE',difficulty:d,variant:`rule-${params.kind}`,tags:['sequence','induction',params.kind],prompt:`${['Observe la suite.','Repère le mouvement.','Trouve le rythme.','Regarde les répétitions.','Détecte la règle.','Anticipe la prochaine forme.','Quel motif se cache ici ?','Quel est le reflet logique ?','Quel saut se répète ?','Quel cycle se reconstruit ?'][kind]} Quelle réponse complète le défi ?`,expectedMs:2400+d*360,capabilities:{IND:.62,RFD:.22,WM:.10,ATT:.06},sequence,choices:pool,correct:pool.indexOf(next),ruleLabel:label,ruleParams:params};
}

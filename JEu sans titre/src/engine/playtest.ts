import type{Family,Item}from'./types';
import{generateAudited}from'./generator';
import{auditItem}from'./audit';

const families:Family[]=['RULE','SPATIAL','MEMORY','CONTROL','AUDIO','SOCIAL','NATURALISTIC','META','MATH','VERBAL'];
export type PlaytestReport={family:Family;items:number;variants:number;uniquePrompts:number;answerPositionSpread:number;auditFailures:number;contentFailures:number;repetitionRisk:number;variantNames:string[]};
function contentCheck(item:Item):boolean{
 if(item.prompt.length<18||item.prompt.length>260)return false;
 if(item.family==='CONTROL')return item.trials.length>=18&&item.trials.every(t=>typeof t.go==='boolean'&&!!t.target);
 if(item.family==='SPATIAL')return item.choices.length===4&&item.choices.every(c=>c.length===item.pieces.length);
 const choices=(item as any).choices as string[];return Array.isArray(choices)&&choices.length===4&&new Set(choices).size===4&&Number.isInteger((item as any).correct)&&((item as any).correct>=0)&&((item as any).correct<4);
}
export function runPlaytestSuite(itemsPerFamily=1000):PlaytestReport[]{
 return families.map((family,fi)=>{const variants=new Set<string>(),prompts=new Set<string>(),positions=[0,0,0,0];let auditFailures=0,contentFailures=0;
  for(let i=0;i<itemsPerFamily;i++){const item=generateAudited(family,(fi+1)*10000000+i*104729,1+(i%7));const a=auditItem(item);variants.add(item.variant);prompts.add(item.prompt);if(item.family==='CONTROL')positions[0]++;else positions[item.correct]++;if(!a.ok)auditFailures++;if(!contentCheck(item))contentFailures++;}
  const spread=Math.min(...positions)/Math.max(1,Math.max(...positions));const repetitionRisk=1-(0.55*(prompts.size/Math.max(1,itemsPerFamily))+0.45*(variants.size/Math.max(1,itemsPerFamily)));
  return{family,items:itemsPerFamily,variants:variants.size,uniquePrompts:prompts.size,answerPositionSpread:spread,auditFailures,contentFailures,repetitionRisk,variantNames:[...variants].sort()};});
}
export function playtestSeeded(family:Family,seed:number){return auditItem(generateAudited(family,seed,1+Math.abs(seed)%7))}

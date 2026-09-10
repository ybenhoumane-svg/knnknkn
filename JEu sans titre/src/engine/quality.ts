import type {Family, Item, Trial} from './types';
import {generateAudited} from './generator';
import {auditItem} from './audit';
import {defaultProfile, updateProfile} from './profile';
import {makeTrial} from './scoring';
import {nextDifficulty} from './adaptive';
import {selectFamily} from './selection';
import {runPlaytestSuite} from './playtest';
import {bankSpecs,bankCounts} from '../data/questionBank';

const families:Family[]=['RULE','SPATIAL','MEMORY','CONTROL','AUDIO','SOCIAL','NATURALISTIC','META','MATH','VERBAL'];
const assert=(v:boolean,m:string)=>{if(!v)throw new Error(m)};
function auditEditorialBank(){
 assert(bankCounts.total>=200,`editorial bank below 200: ${bankCounts.total}`);
 const ids=new Set<string>(),prompts=new Set<string>();
 for(const x of bankSpecs){
  assert(!ids.has(x.id),`duplicate bank id ${x.id}`); ids.add(x.id);
  assert(!prompts.has(x.prompt),`duplicate bank prompt ${x.id}`); prompts.add(x.prompt);
  assert(x.choices.length===4&&new Set(x.choices).size===4,`bad bank choices ${x.id}`);
  assert(x.choices.includes(x.answer),`bank answer absent ${x.id}`);
  assert(x.explanation.length>=8,`bank explanation too short ${x.id}`);
  assert(!/item retiré|removed|à vérifier|Noon|Non\./i.test(x.prompt+' '+x.explanation),`quarantine text in bank ${x.id}`);
 }
 return {total:bankSpecs.length,rule:bankCounts.rule,math:bankCounts.math,verbal:bankCounts.verbal,uniqueIds:ids.size,uniquePrompts:prompts.size};
}

export function runQualitySuite(rounds=500){
 const bankAudit=auditEditorialBank();
 let generated=0, audits=0, failures=0, duplicateIds=new Set<string>(), profile=defaultProfile();
 for(let d=1;d<=7;d++)for(let fi=0;fi<families.length;fi++){const f=families[fi];for(let i=0;i<rounds;i++){
  const item=generateAudited(f,((fi+1)*1000000+d*10000+i*7919)|0,d); const a=auditItem(item);
  assert(a.ok,`${f} d${d} audit failed`); assert(!duplicateIds.has(item.id),`duplicate ${item.id}`); duplicateIds.add(item.id);
  const tr=makeTrial(item,i%3!==0,item.expectedMs*(i%5===0?1.3:.92),.9); profile=updateProfile(profile,tr,item.capabilities); const nd=nextDifficulty(d,tr.correct,tr.rt,item.expectedMs,tr.reliability,7); assert(nd>=1&&nd<=7,`bad difficulty ${nd}`);
  generated++;audits++;
 }}
 const counts:Record<Family,number>={RULE:0,SPATIAL:0,MEMORY:0,CONTROL:0,AUDIO:0,SOCIAL:0,NATURALISTIC:0,META:0,MATH:0,VERBAL:0};let last:Family|null=null;
 const selectionHistory:Family[]=[]; for(let i=0;i<120;i++){const f=selectFamily(profile,last,selectionHistory,120-i);counts[f]++;selectionHistory.push(f);last=f}
 assert(Object.values(counts).every(n=>n>=8),'selection starved a family');
 const playtest=runPlaytestSuite(Math.max(500,Math.min(1000,rounds*2)));
 assert(playtest.every(x=>x.auditFailures===0&&x.contentFailures===0),'playtest content/audit failure');
 assert(playtest.every(x=>x.variants>=4),'variant coverage too low');
 assert(playtest.every(x=>x.answerPositionSpread>=.55||x.family==='CONTROL'),'answer positions are too biased');
 // Measurement-hygiene checks: unknown domains must stay unknown, estimates stay bounded,
 // and reliability must never create NaN/Infinity or negative confidence.
 for(const a of Object.values(profile.abilities))assert(Number.isFinite(a.level)&&a.level>=0&&a.level<=100,'ability out of bounds');
 for(const d of Object.values(profile.domains))assert(Number.isFinite(d.level)&&d.level>=0&&d.level<=100&&d.confidence>=0&&d.confidence<=100,'domain out of bounds');
 assert(profile.domains.musical.evidence>0&&profile.domains.interpersonal.evidence>0&&profile.domains.intrapersonal.evidence>0&&profile.domains.naturalistic.evidence>0,'extended domain coverage missing');
 assert(profile.domains.bodily.evidence>0&&profile.domains.spatial.evidence>0&&profile.domains.logical.evidence>0,'core domain coverage missing');
 return{generated,audits,failures,uniqueItems:duplicateIds.size,selectionCounts:counts,playtest,bankAudit};
}

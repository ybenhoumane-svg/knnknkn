import type {Family, Profile, Trial, Item} from './types';
import {defaultProfile, updateProfile} from './profile';
import {makeTrial} from './scoring';
import {nextDifficulty} from './adaptive';
import {selectFamily} from './selection';
import {generateAudited} from './generator';
import {responseReliability, controlReliability, sessionReliability} from './reliability';

export type Archetype = 'balanced'|'reasoning'|'spatial'|'memory'|'control'|'fast'|'careful'|'random'|'fatigue'|'progression';
export type SimulationResult={archetype:Archetype;sessions:number;trials:number;familyCounts:Record<Family,number>;meanReliability:number;meanLevel:number;maxDifficulty:Record<Family,number>;selectionSwitchRate:number;failures:number};

const caps:Record<Archetype,Partial<Record<Family,number>>>= {
 balanced:{RULE:.72,SPATIAL:.72,MEMORY:.72,CONTROL:.72,AUDIO:.70,SOCIAL:.70,NATURALISTIC:.70,META:.70,MATH:.72,VERBAL:.70}, reasoning:{RULE:.90,SPATIAL:.60,MEMORY:.62,CONTROL:.58,AUDIO:.58,SOCIAL:.65,NATURALISTIC:.65,META:.70,MATH:.92,VERBAL:.78}, spatial:{RULE:.58,SPATIAL:.92,MEMORY:.66,CONTROL:.60,AUDIO:.60,SOCIAL:.62,NATURALISTIC:.82,META:.60,MATH:.62,VERBAL:.60}, memory:{RULE:.64,SPATIAL:.62,MEMORY:.92,CONTROL:.65,AUDIO:.84,SOCIAL:.66,NATURALISTIC:.66,META:.80,MATH:.62,VERBAL:.66}, control:{RULE:.62,SPATIAL:.60,MEMORY:.66,CONTROL:.92,AUDIO:.72,SOCIAL:.72,NATURALISTIC:.68,META:.65,MATH:.62,VERBAL:.68}, fast:{RULE:.67,SPATIAL:.68,MEMORY:.68,CONTROL:.62,AUDIO:.65,SOCIAL:.66,NATURALISTIC:.66,META:.65,MATH:.67,VERBAL:.66}, careful:{RULE:.74,SPATIAL:.76,MEMORY:.78,CONTROL:.82,AUDIO:.76,SOCIAL:.78,NATURALISTIC:.78,META:.82,MATH:.76,VERBAL:.78}, random:{RULE:.25,SPATIAL:.25,MEMORY:.25,CONTROL:.25,AUDIO:.25,SOCIAL:.25,NATURALISTIC:.25,META:.25,MATH:.25,VERBAL:.25}, fatigue:{RULE:.72,SPATIAL:.70,MEMORY:.65,CONTROL:.55,AUDIO:.65,SOCIAL:.66,NATURALISTIC:.66,META:.62,MATH:.65,VERBAL:.66}, progression:{RULE:.55,SPATIAL:.55,MEMORY:.55,CONTROL:.55,AUDIO:.55,SOCIAL:.55,NATURALISTIC:.55,META:.55,MATH:.55,VERBAL:.55}
};
function chance(seed:number){let x=seed|0;return()=>{x=Math.imul(1664525,x)+1013904223|0;return(x>>>0)/4294967296}}
function simulateTrial(item:Item, archetype:Archetype, difficulty:number, seed:number):{correct:boolean;rt:number;reliability:number;metrics?:Trial['metrics']} {
 const r=chance(seed)(); const base=caps[archetype][item.family]??.6;
 let p=base + (archetype==='progression'?Math.min(.2,difficulty*.025):0) - (archetype==='fatigue'?Math.max(0,difficulty-3)*.055:0);
 if(archetype==='random')p=.25;
 const correct=r<p;
 const speed=archetype==='fast'?.68:archetype==='careful'?1.28:archetype==='fatigue'?1.15:.95;
 const rt=Math.max(220,item.expectedMs*speed*(.82+r*.45));
 const reliability=responseReliability(rt,archetype==='random'&&r>.55,false,false);
 return{correct,rt,reliability};
}
export function simulate(archetype:Archetype,sessions=5,encounters=30):SimulationResult{
 let profile=defaultProfile(),history:Family[]=[];let trials=0,failures=0,totalRel=0,meanLevel=50,switches=0,last:Family|null=null;const counts={RULE:0,SPATIAL:0,MEMORY:0,CONTROL:0,AUDIO:0,SOCIAL:0,NATURALISTIC:0,META:0,MATH:0,VERBAL:0};const max={RULE:0,SPATIAL:0,MEMORY:0,CONTROL:0,AUDIO:0,SOCIAL:0,NATURALISTIC:0,META:0,MATH:0,VERBAL:0};
 for(let s=0;s<sessions;s++){
  let difficulty=2;
  for(let i=0;i<encounters;i++){
   const f=selectFamily(profile,last,history,encounters-i);history.push(f);counts[f]++;if(last&&last!==f)switches++;
   const item=generateAudited(f,(s+1)*100000+i*7919+difficulty*37,difficulty);max[f]=Math.max(max[f],difficulty);
   const sim=simulateTrial(item,archetype,difficulty,s*10000+i*101+f.length);
   const tr=makeTrial(item,sim.correct,sim.rt,sim.reliability);
   profile=updateProfile(profile,tr,item.capabilities);difficulty=nextDifficulty(difficulty,sim.correct,sim.rt,item.expectedMs,sim.reliability,7);last=f;trials++;totalRel+=sim.reliability;if(!sim.correct)failures++;
  }
  const sr=sessionReliability(profile.trials.slice(-encounters));
  meanLevel=profile.abilities.IND.level*.25+profile.abilities.WM.level*.25+profile.abilities.VIS.level*.25+profile.abilities.ATT.level*.25;
  if(!Number.isFinite(sr))throw new Error('session reliability invalid');
 }
 return{archetype,sessions,trials,familyCounts:counts,meanReliability:totalRel/trials,meanLevel,maxDifficulty:max,selectionSwitchRate:switches/Math.max(1,trials-1),failures};
}

import type {Family,Profile,Ability} from './types';
const map:Record<Family,Ability[]>={RULE:['IND','RFD','WM','ATT'],SPATIAL:['VIS','NAV','WM'],MEMORY:['WM','SEQ','ATT','RFD'],CONTROL:['ATT','INH','FLEX','SPD'],AUDIO:['SEQ','ATT','WM'],SOCIAL:['RFD','ATT','FLEX','WM'],NATURALISTIC:['IND','VIS','ATT'],META:['RFD','ATT','FLEX','WM'],MATH:['QNT','RFD','IND'],VERBAL:['IND','RFD','WM','ATT']};
const families=Object.keys(map) as Family[];
export function selectFamily(profile:Profile,last:Family|null,history:Family[],remaining:number):Family{
 const counts=Object.fromEntries(families.map(f=>[f,history.filter(x=>x===f).length])) as Record<Family,number>;
 const minCount=Math.min(...families.map(f=>counts[f]));
 if(history.length<families.length*2){const candidates=families.filter(f=>counts[f]===minCount&&f!==last);if(candidates.length)return candidates[(remaining+history.length)%candidates.length]}
 const maxAllowed=Math.max(minCount+3,Math.ceil(history.length*.24));
 let candidates=families.filter(f=>counts[f]<=maxAllowed&&f!==last);if(!candidates.length)candidates=families.filter(f=>f!==last);if(!candidates.length)candidates=families;
 let best=candidates[0],bestScore=-Infinity;
 for(const f of candidates){const xs=map[f].map(a=>profile.abilities[a]);const need=xs.reduce((s,x)=>s+(100-x.confidence),0)/xs.length;const under=xs.reduce((s,x)=>s+Math.max(-1,Math.min(1,(50-x.level)/50)),0)/xs.length;const count=counts[f];const recent=history.slice(-6).includes(f);const lastPenalty=f===last?-80:0;const recentPenalty=recent?-28:0;const coverageBonus=(minCount===count?34:0);const freshness=count===0?24:0;const balancePenalty=Math.max(0,count-minCount)*11;const confirmation=(remaining<10&&xs.some(x=>x.confidence>=45&&x.confidence<78))?12:0;const score=need*.52+under*8+coverageBonus+freshness+confirmation-balancePenalty-recentPenalty-lastPenalty;if(score>bestScore){bestScore=score;best=f}}
 return best;
}
export const familyCapabilities=map;

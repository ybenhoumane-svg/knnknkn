import type {Profile,Ability,Trial,Domain,DomainEstimate} from './types';
import {observedLevel} from './scoring';
export const abilities:Array<Ability>=['IND','RFD','WM','ATT','INH','FLEX','SPD','VIS','NAV','SEQ','QNT'];
export const domains:Array<Domain>=['linguistic','logical','spatial','musical','bodily','interpersonal','intrapersonal','naturalistic','existential'];
const domainMap:Record<Domain,Partial<Record<Ability,number>>>= {
 linguistic:{IND:.28,RFD:.18,WM:.16}, logical:{IND:.38,RFD:.38,WM:.14,ATT:.10}, spatial:{VIS:.45,NAV:.40,WM:.15}, musical:{SEQ:.55,ATT:.25,WM:.20}, bodily:{SPD:.28,ATT:.22,FLEX:.20,VIS:.15,NAV:.15}, interpersonal:{RFD:.32,ATT:.25,FLEX:.23,WM:.20}, intrapersonal:{ATT:.20,FLEX:.20,RFD:.20,WM:.20,IND:.20}, naturalistic:{IND:.45,VIS:.30,ATT:.25}, existential:{RFD:.45,IND:.35,WM:.20}
};
export const domainLabels:Record<Domain,string>={linguistic:'Linguistique',logical:'Logico-mathématique',spatial:'Spatiale',musical:'Musicale',bodily:'Corporelle-kinesthésique',interpersonal:'Interpersonnelle',intrapersonal:'Intrapersonnelle',naturalistic:'Naturaliste',existential:'Existentiale'};
function status(c:number,e:number):DomainEstimate['status']{if(e===0)return'unknown';if(c<25)return'exploratory';if(c<50)return'emerging';if(c<75)return'moderate';return'strong'}
export function defaultProfile():Profile{return{schemaVersion:5,sessions:0,abilities:Object.fromEntries(abilities.map(a=>[a,{level:50,confidence:0,evidence:0,trend:0,recent:50}])) as Profile['abilities'],domains:Object.fromEntries(domains.map(d=>[d,{level:50,confidence:0,evidence:0,trend:0,status:'unknown'}])) as Profile['domains'],trials:[]}}
const familyDomain:Record<string,Domain[]>={RULE:['logical'],SPATIAL:['spatial'],MEMORY:['logical'],CONTROL:['bodily'],AUDIO:['musical'],SOCIAL:['interpersonal'],NATURALISTIC:['naturalistic'],META:['intrapersonal'],MATH:['logical'],VERBAL:['linguistic']};
export function updateDomains(p:Profile):Profile{
 const next:Profile={...p,domains:{...p.domains}};
 const covered=new Map<Domain,number>();
 for(const t of p.trials){for(const d of (familyDomain[t.family]||[]))covered.set(d,(covered.get(d)||0)+1)}
 for(const d of domains){const weights=domainMap[d];let sum=0,w=0,conf=0,e=0;
  for(const [a,weight] of Object.entries(weights)){const x=p.abilities[a as Ability];if(x?.evidence){sum+=x.level*weight!;w+=weight!;conf+=x.confidence*weight!;e+=x.evidence}}
  const old=p.domains[d];const direct=covered.get(d)||0;let level=direct&&w?sum/w:50;let confidence=direct&&w?Math.min(96,(conf/w)*(Math.min(1,direct/4))):0;if(d==='existential')confidence=Math.min(confidence,35);
  // Do not manufacture evidence for domains that the current V1 families do not measure directly.
  if(!direct){level=50;confidence=0;e=0}
  next.domains[d]={level,confidence,evidence:direct,trend:direct?level-old.level:0,status:status(confidence,direct)};
 }
 return next;
}
export function updateProfile(profile:Profile,trial:Trial,caps:Record<string,number>):Profile{
 const p:Profile={...profile,abilities:{...profile.abilities},domains:{...profile.domains},trials:[...profile.trials,trial]};
 const observed=observedLevel(trial);
 for(const [a,w0] of Object.entries(caps)){const old=p.abilities[a as Ability];if(!old)continue;const w=Math.max(.05,w0);const learning=Math.min(.24,.045+trial.reliability*.10+Math.min(trial.difficulty/30,.07))*Math.min(1,w*1.4);
  const level=old.level*(1-learning)+observed*learning;const recent=old.recent*.70+observed*.30;
  const confGain=3.5*trial.reliability*Math.max(.45,w)*(trial.metrics?.validResponses?Math.min(1,trial.metrics.validResponses/12):1);
  const conf=Math.min(96,old.confidence+confGain);
  p.abilities[a as Ability]={level,confidence:conf,evidence:old.evidence+1,trend:level-old.level,recent};
 }
 return updateDomains(p);
}
export function saveProfile(p:Profile){try{localStorage.setItem('lvi-profile-v5',JSON.stringify(p))}catch{}}
export function loadProfile():Profile{try{const raw=JSON.parse(localStorage.getItem('lvi-profile-v5')||'null');if(raw?.abilities&&raw?.domains&&Array.isArray(raw.trials))return {...raw,schemaVersion:5} as Profile;return defaultProfile()}catch{return defaultProfile()}}

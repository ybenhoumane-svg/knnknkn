import type {AgeBand, Family, Mode, Phase, Profile, Item} from './types';
export type SessionSnapshot={version:5;mode:Mode;age:AgeBand;total:number;index:number;difficulty:number;family:Family;item:Item|null;phase:Phase;startedAt:number;history:Family[];completed:boolean;profileSessionsAtStart:number;sessionTrialStart?:number};
const KEY='lvi-session-v5';
export function saveSession(s:SessionSnapshot){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
export function loadSession():SessionSnapshot|null{try{const raw=localStorage.getItem(KEY);if(!raw)return null;const s=JSON.parse(raw);return s?.version===5&&s?.item?s:null}catch{return null}}
export function clearSession(){try{localStorage.removeItem(KEY)}catch{}}
export function sessionIsFresh(s:SessionSnapshot){return !!s&&!s.completed&&(Date.now()-s.startedAt<1000*60*90)}
export function shouldEndSession(profile:Profile,mode:Mode,index:number,total:number){const minimum=mode==='quick'?18:48;if(index+1<minimum)return false;const measured=Object.values(profile.abilities).filter(x=>x.evidence>0);if(measured.length<4)return false;const meanConfidence=measured.reduce((s,x)=>s+x.confidence,0)/measured.length;const stable=measured.filter(x=>x.confidence>=62).length>=Math.min(6,measured.length);return(meanConfidence>=68&&stable)||index+1>=total}

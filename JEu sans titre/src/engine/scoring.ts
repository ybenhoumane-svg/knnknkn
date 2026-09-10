import type {Item,Trial} from './types';
const POS=[.35,.45,.60,.78,.95,1.15,1.35],NEG=[.35,.40,.45,.50,.55,.60,.65];
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export function score(correct:boolean,difficulty:number,rt:number,expected:number,reliability:number){
 const i=clamp(Math.round(difficulty)-1,0,6);const base=correct?POS[i]:-NEG[i];
 const timeLog=clamp(Math.log(expected/Math.max(180,rt)),-.35,.35);
 const timeModifier=1+timeLog*.30;
 return base*timeModifier*clamp(reliability,.20,1);
}
export type TrialAnswerMeta={selectedIndex?:number;selectedLabel?:string;correctIndex?:number;correctLabel?:string;explanation?:string};
export function makeTrial(item:Item,correct:boolean,rt:number,reliability:number,metrics?:Trial['metrics'],answerMeta?:TrialAnswerMeta):Trial{
 return{id:item.id,family:item.family,difficulty:item.difficulty,correct,rt,expectedMs:item.expectedMs,reliability,evidence:score(correct,item.difficulty,rt,item.expectedMs,reliability),timestamp:Date.now(),quality:reliability,metrics,...answerMeta,prompt:item.prompt};
}
export function observedLevel(trial:Trial):number{
 const max=POS[Math.max(0,Math.min(6,trial.difficulty-1))];
 const ratio=trial.evidence/Math.max(.01,max);
 return clamp(50+ratio*42,8,92);
}

export type SessionSummary={
 score:number;
 accuracy:number;
 reliability:number;
 challenge:number;
 speed:number;
 streak:number;
 maxDifficulty:number;
 answered:number;
 correct:number;
};

export function summarizeSession(trials:Trial[]):SessionSummary{
 const xs=trials.filter(Boolean);
 if(!xs.length)return{score:0,accuracy:0,reliability:0,challenge:0,speed:0,streak:0,maxDifficulty:0,answered:0,correct:0};
 let weightSum=0,accuracySum=0,reliabilitySum=0,speedSum=0,challengeSum=0,streak=0,maxStreak=0,correct=0,maxDifficulty=0;
 for(const t of xs){
  const w=(.75+.25*clamp(t.difficulty/7,0,1))*clamp(t.reliability,.2,1);
  weightSum+=w;
  accuracySum+=(t.correct?1:0)*w;
  reliabilitySum+=clamp(t.reliability,.2,1);
  const expected=t.expectedMs??(4200+t.difficulty*450);
  const speed=clamp(Math.log(expected/Math.max(180,t.rt)),-.45,.45);
  speedSum+=.5+speed/.9*.5;
  challengeSum+=clamp(t.difficulty/7,0,1);
  maxDifficulty=Math.max(maxDifficulty,t.difficulty);
  if(t.correct){correct++;streak++;maxStreak=Math.max(maxStreak,streak)}else streak=0;
 }
 const accuracy=accuracySum/Math.max(.001,weightSum);
 const reliability=reliabilitySum/xs.length;
 const challenge=challengeSum/xs.length;
 const speed=speedSum/xs.length;
 // The score rewards solving difficult, reliable challenges, while keeping speed secondary.
 const raw=accuracy*.60+challenge*.18+reliability*.14+speed*.08;
 return{score:Math.round(clamp(raw*100,0,100)),accuracy,reliability,challenge,speed,streak:maxStreak,maxDifficulty,answered:xs.length,correct};
}

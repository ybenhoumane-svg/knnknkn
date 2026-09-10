export type ReliabilitySignal={rt:number;rapidRepeat?:boolean;abandoned?:boolean;repeatedChoice?:boolean;invalidInteraction?:boolean;focusLoss?:boolean};
export function responseReliability(rt:number,rapidRepeat=false,abandoned=false,invalidInteraction=false):number{
 let r=1;
 if(rt<180)r*=.62; else if(rt<280)r*=.82;
 if(rt>25000)r*=.70;
 if(rapidRepeat)r*=.65;
 if(abandoned)r*=.25;
 if(invalidInteraction)r*=.65;
 return Math.max(.20,Math.min(1,r));
}
export function controlReliability(valid:number,total:number,falseAlarms:number,omissions:number,wrongTargets=0):number{
 if(!total)return .20;
 const fa=falseAlarms/total,om=omissions/total,wt=wrongTargets/total,validRate=valid/total;
 const r=.72+.28*validRate-.38*fa-.30*om-.22*wt;
 return Math.max(.20,Math.min(1,r));
}
export function sessionReliability(trials:{reliability:number;correct:boolean;rt:number}[]):number{
 if(!trials.length)return 0;
 const values=trials.map(t=>t.reliability);
 const mean=values.reduce((a,b)=>a+b,0)/values.length;
 const abnormal=trials.filter(t=>t.rt<180||t.rt>25000).length/trials.length;
 const variability=Math.min(1,Math.abs((trials.filter(t=>t.correct).length/trials.length)-.5)*1.0);
 return Math.max(.15,Math.min(1,mean*(1-abnormal*.35)*(1-variability*.08)));
}

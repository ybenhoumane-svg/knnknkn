export function nextDifficulty(current:number,correct:boolean,rt:number,expected:number,quality:number,ageCap=7,recentCorrect=0){
 const ratio=rt/Math.max(180,expected);
 const efficient=ratio<=1.10;
 const fast=ratio<=.82;
 const strong=correct&&efficient&&quality>=.82;
 const excellent=correct&&fast&&quality>=.90;
 const good=correct&&quality>=.62;
 if(excellent&&recentCorrect>=2)return Math.min(ageCap,current+1);
 if(strong)return Math.min(ageCap,current+1);
 if(good&&recentCorrect>=3)return Math.min(ageCap,current+1);
 if(!correct&&quality>=.50)return Math.max(1,current-1);
 return current;
}

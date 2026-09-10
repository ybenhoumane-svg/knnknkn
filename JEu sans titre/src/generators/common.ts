export function rnd(seed:number){let x=seed|0;return()=>{x=Math.imul(1664525,x)+1013904223|0;return(x>>>0)/4294967296}}
export function shuffle<T>(arr:T[],r:()=>number){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

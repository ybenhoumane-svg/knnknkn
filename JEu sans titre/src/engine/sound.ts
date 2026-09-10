let ctx:AudioContext|null=null;
let puzzleTick:number|undefined;
const getContext=()=>{try{if(typeof window==='undefined')return null;const C=window.AudioContext||(window as any).webkitAudioContext;if(!C)return null;if(!ctx)ctx=new C();if(ctx.state==='suspended')void ctx.resume().catch(()=>{});return ctx}catch{return null}};
function tone(freq:number,duration:number,gain:number,offset=0,type:OscillatorType='sine'){
 try{const c=getContext();if(!c||!Number.isFinite(freq)||!Number.isFinite(duration)||duration<=0)return;const now=c.currentTime+Math.max(0,offset);const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(0.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(0.0002,gain),now+0.012);g.gain.exponentialRampToValueAtTime(0.0001,now+duration);o.connect(g).connect(c.destination);o.start(now);o.stop(now+duration+0.025)}catch{/* audio is non-critical: never break gameplay */}}
export function unlockSound(){try{const c=getContext();if(c?.state==='suspended')void c.resume().catch(()=>{})}catch{}}
/** Tic-tac volontairement réservé aux défis à réflexion/énigme. */
export function startPuzzleClock(){try{unlockSound();stopPuzzleClock();puzzleTick=window.setInterval(()=>{tone(740,.045,.010);tone(660,.045,.007,.065)},1150)}catch{stopPuzzleClock()}}
export function stopPuzzleClock(){if(puzzleTick!==undefined){window.clearInterval(puzzleTick);puzzleTick=undefined}}
export function playFinish(correct:boolean){try{unlockSound();if(correct){tone(523.25,.09,.05);tone(659.25,.11,.045,.075);tone(783.99,.16,.038,.16)}else{tone(260,.07,.028);tone(180,.14,.024,.07);tone(130,.16,.018,.16)}}catch{/* feedback sound must never crash a challenge */}}

export function playRhythm(rhythm:number[],tempoMs:number){try{const c=getContext();if(!c||!Array.isArray(rhythm)||!Number.isFinite(tempoMs)||tempoMs<=0)return;const now=c.currentTime+0.03;rhythm.forEach((hit,i)=>{if(!hit)return;const at=now+i*tempoMs/1000;const o=c.createOscillator(),g=c.createGain();o.type=i%4===0?'sine':'triangle';o.frequency.setValueAtTime(i%4===0?660:520,at);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(.11,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+.11);o.connect(g).connect(c.destination);o.start(at);o.stop(at+.14)})}catch{/* optional audio */}}

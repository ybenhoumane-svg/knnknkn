import type {SpatialItem,SpatialPiece} from '../engine/types';import{rnd,shuffle}from'./common';
export function transformSpatial(base:SpatialPiece[],rot:number,mirror:boolean):SpatialPiece[]{return base.map(p=>{let x=p.x,y=p.y;if(mirror)x=2-x;for(let i=0;i<rot/90;i++){const nx=2-y;y=x;x=nx}return{...p,x,y,rotation:(p.rotation+(mirror?-1:1)*rot+360)%360}})}
export function spatialKey(ps:SpatialPiece[]){return ps.map(p=>`${p.x},${p.y},${p.size},${p.rotation},${p.kind}`).sort().join('|')}
export function generateSpatial(seed:number,d:number):SpatialItem{
 const r=rnd(seed),count=d<3?2:d<5?3:4,kinds:['square','diamond','circle']=['square','diamond','circle'];
 const positions=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]];
 const base:SpatialPiece[]=shuffle(positions,r).slice(0,count).map(([x,y],i)=>({x,y,size:1+(i%3),rotation:(i%4)*90,kind:kinds[(i+Math.floor(r()*3))%3]}));
 const mode=(d+Math.floor(r()*4))%4;let rot=[90,180,270][Math.floor(r()*3)],mirror=d>=5&&r()<.45,rotation2=0,mirror2=false;
 let correct:SpatialPiece[],prompt:string,spatialMode:SpatialItem['spatialMode'];
 if(mode===0){spatialMode='transform';prompt='Imagine la rotation. Quel objet correspond exactement au résultat ?';correct=transformSpatial(base,rot,mirror)}
 else if(mode===1){spatialMode='double-transform';rotation2=[90,180,270][Math.floor(r()*3)];mirror2=r()<.5;prompt='Applique mentalement les deux transformations. Quel résultat obtiens-tu ?';correct=transformSpatial(transformSpatial(base,rot,mirror),rotation2,mirror2)}
 else if(mode===2){spatialMode='opposite-turn';rotation2=rot;mirror2=false;prompt='On te donne le sens opposé de la rotation. Quel résultat correspond ?';correct=transformSpatial(base,(360-rot)%360,false)}
 else{spatialMode='mirror-or-rotate';prompt='Une même forme peut être retournée ou tournée. Quel choix suit précisément la transformation annoncée ?';correct=transformSpatial(base,rot,mirror)}
 const candidates:[[number,boolean],[number,boolean],[number,boolean],[number,boolean]]=[[rot,mirror],[(rot+90)%360,!mirror],[(rot+180)%360,mirror],[(rot+270)%360,!mirror]];
 const unique:SpatialPiece[][]=[];const seen=new Set<string>();
 const add=(c:SpatialPiece[])=>{const k=spatialKey(c);if(!seen.has(k)){seen.add(k);unique.push(c)}};
 add(correct);
 for(const [rr,mm] of candidates)if(unique.length<4)add(transformSpatial(base,rr,mm));
 for(const rr of [0,90,180,270])for(const mm of [false,true])if(unique.length<4)add(transformSpatial(base,rr,mm));
 const choices=shuffle(unique.slice(0,4),r);
 return{id:`S-${seed}-${d}`,family:'SPATIAL',difficulty:d,variant:`spatial-${spatialMode}-r${rot}-m${mirror?1:0}-r2${rotation2}-m2${mirror2?1:0}`,tags:['spatial','mental-transformation',spatialMode],prompt,expectedMs:3000+d*430,capabilities:{VIS:.46,NAV:.38,WM:.16},pieces:base,choices,correct:choices.findIndex(x=>spatialKey(x)===spatialKey(correct)),transform:{rotation:rot,mirror,rotation2,mirror2},spatialMode};
}

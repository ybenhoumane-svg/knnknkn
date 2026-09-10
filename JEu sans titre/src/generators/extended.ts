import type{AudioItem,SocialItem,NaturalisticItem,MetaItem,MathItem,VerbalItem}from'../engine/types';
import{rnd,shuffle}from'./common';
function unique4(values:string[],r:()=>number){const out=shuffle([...new Set(values)],r);while(out.length<4){const candidate=String(1+Math.floor(r()*99));if(!out.includes(candidate))out.push(candidate)}return out.slice(0,4)}

export function generateAudio(seed:number,d:number):AudioItem{
 const r=rnd(seed),length=d>=5?12:d>=3?10:8,tempoMs=Math.max(290,540-d*24);
 const baseTemplates:number[][]=[
  [1,0,1,0,1,0,1,0,1,0,1,0],[1,0,0,1,0,1,0,0,1,0,1,0],[1,1,0,1,0,0,1,0,1,0,0,1],
  [1,0,1,1,0,0,1,0,0,1,1,0],[1,0,0,1,1,0,1,0,1,1,0,1],[1,1,0,0,1,0,1,1,0,1,0,0],
  [1,0,0,1,0,0,1,1,0,1,1,0],[1,1,0,1,1,0,0,1,0,0,1,0],[1,0,1,0,0,1,1,0,1,1,0,1],
  [1,0,0,0,1,1,0,1,0,0,1,1],[1,1,0,0,1,1,0,0,1,0,1,0],[1,0,1,1,0,1,0,0,1,0,0,1],
  [1,0,0,1,1,0,0,1,1,0,1,0],[1,1,1,0,0,1,0,1,0,0,1,0],[1,0,1,0,1,1,0,0,1,1,0,0],
  [1,0,0,1,0,1,1,0,0,1,0,1],[1,1,0,1,0,0,1,1,0,0,1,1],[1,0,1,0,0,1,0,1,1,0,1,0]
 ];
 const templateIndex=Math.floor(r()*baseTemplates.length),rhythm=baseTemplates[templateIndex].slice(0,length);
 const variants=[
  rhythm,
  rhythm.map((v,i)=>i%2===0?v:0),
  rhythm.map((v,i)=>i===Math.floor(length/2)?1-v:v),
  rhythm.map((v,i)=>i%3===0?1-v:v),
  rhythm.map((v,i)=>i%4===1?1-v:v),
  rhythm.map((v,i)=>i%5===0?1-v:v)
 ];
 const unique:{x:number[];id:string}[]=[];
 for(const x of variants){const id=x.join('');if(!unique.some(v=>v.id===id))unique.push({x,id})}
 let salt=0;while(unique.length<4){const candidate=Array.from({length},(_,i)=>((i*3+templateIndex+d+salt)%7<3?1:0));const id=candidate.join('');if(!unique.some(v=>v.id===id))unique.push({x:candidate,id});salt++}
 const shuffled=shuffle(unique.slice(0,4),r),correct=shuffled.findIndex(v=>v.id===rhythm.join(''));
 return{id:`A-${seed}-${d}`,family:'AUDIO',difficulty:d,variant:`rhythm-reproduction-${templateIndex+1}`,tags:['auditory','rhythm','sequence','timing'],prompt:'Écoute le rythme, puis reproduis-le en tapant sur le bouton au même rythme.',expectedMs:Math.max(6500,length*tempoMs+2200),capabilities:{SEQ:.60,ATT:.25,WM:.15},rhythm,choices:shuffled.map((_,i)=>`Rythme ${String.fromCharCode(65+i)}`),choiceRhythms:shuffled.map(v=>v.x),tempoMs,audioMode:'rhythm',correct};
}
export function generateSocial(seed:number,d:number):SocialItem{
 const r=rnd(seed);const scenes=[
  {belief:'Lina quitte la pièce. Pendant son absence, quelqu’un déplace la clé de la boîte rouge vers la boîte bleue. Lina ne voit pas ce déplacement.',reality:'Lina revient sans avoir reçu d’information sur le changement.',question:'Où Lina cherchera-t-elle probablement la clé en premier ?',answer:'Dans la boîte rouge.',choices:['Dans la boîte rouge.','Dans la boîte bleue.','Elle saura immédiatement que la clé a été déplacée.','Elle ne cherchera nulle part.'],signal:'fausse croyance',cue:'tenir compte de ce que Lina sait réellement'},
  {belief:'Sam envoie un message à Léa. Léa le lit, mais Sam n’a aucun moyen de le savoir.',reality:'Sam n’a reçu ni réponse ni notification de lecture.',question:'Quelle conclusion est la plus cohérente avec les informations dont Sam dispose ?',answer:'Il peut penser que le message n’a pas encore été lu.',choices:['Il peut penser que le message n’a pas encore été lu.','Il sait que Léa a lu le message.','Il sait pourquoi Léa ne répond pas.','Il sait que Léa est fâchée.'],signal:'information disponible',cue:'raisonner à partir des informations accessibles à Sam'},
  {belief:'Nora cache un cadeau derrière un rideau. Son ami arrive ensuite et ne regarde pas derrière le rideau.',reality:'L’ami n’a donc aucune information lui permettant de savoir qu’un cadeau est caché là.',question:'Que sait probablement l’ami au sujet du cadeau caché ?',answer:'Il ne sait pas qu’un cadeau est caché derrière le rideau.',choices:['Il ne sait pas qu’un cadeau est caché derrière le rideau.','Il sait exactement quel est le cadeau.','Il sait que Nora a caché quelque chose derrière le rideau.','Il a vu le cadeau avant d’entrer.'],signal:'perspective',cue:'séparer ce que Nora sait de ce que son ami a perçu'},
  {belief:'Adam voit son collègue rester silencieux pendant une réunion.',reality:'Adam apprend ensuite que son collègue préparait une annonce surprise.',question:'Quelle conclusion serait trop certaine avec les seules informations de départ ?',answer:'Son collègue est forcément fâché contre Adam.',choices:['Son collègue est forcément fâché contre Adam.','Son collègue peut avoir une autre raison d’être silencieux.','Le silence ne suffit pas à connaître son intention.','Il faut davantage d’informations pour conclure.'],signal:'incertitude sociale',cue:'ne pas transformer une hypothèse en certitude'},
  {belief:'Maya voit son amie quitter rapidement la pièce après avoir regardé l’horloge.',reality:'Maya ignore que son amie doit prendre un train dans dix minutes.',question:'Quelle information aiderait le plus Maya à comprendre ce départ ?',answer:'Le train que son amie doit prendre.',choices:['Le train que son amie doit prendre.','La couleur de ses chaussures.','Le nombre de chaises dans la pièce.','La météo de la semaine dernière.'],signal:'contexte caché',cue:'chercher l’objectif qui explique le comportement'},
  {belief:'Noé reçoit un cadeau emballé et sourit avant de l’ouvrir.',reality:'Son sourire vient du fait qu’il apprécie l’attention reçue, pas du contenu du paquet.',question:'Que peut-on déduire avec le plus de prudence ?',answer:'Il est heureux de recevoir l’attention, sans connaître encore le contenu.',choices:['Il est heureux de recevoir l’attention, sans connaître encore le contenu.','Il sait exactement ce que contient le paquet.','Il n’aime pas recevoir de cadeaux.','Il a déjà ouvert le paquet.'],signal:'émotion versus connaissance',cue:'distinguer une émotion observée d’une connaissance non établie'}
 ];
 const s=scenes[Math.floor(r()*scenes.length)];const choices=shuffle(s.choices,r);
 return{id:`SOC-${seed}-${d}`,family:'SOCIAL',difficulty:d,variant:`social-${scenes.indexOf(s)}`,tags:['social-cognition','perspective','mental-state'],prompt:s.question,expectedMs:5200+d*420,capabilities:{RFD:.35,ATT:.20,FLEX:.25,WM:.20},choices,correct:choices.indexOf(s.answer),signal:s.signal,scene:{belief:s.belief,reality:s.reality,question:s.question,answer:s.answer,cue:s.cue}};
}

export function generateNaturalistic(seed:number,d:number):NaturalisticItem{
 const r=rnd(seed);
 const cases:[string,string[],string,string[],NaturalisticItem['natureMode'],number[]][]=[
  ['cycle',['graine','pousse','plant','fleur','fruit'],'graine',['feuille','racine','graine'],'growth',[0,1,2,3,4,0]],
  ['metamorphose',['œuf','chenille','chrysalide','papillon','œuf'],'chenille',['larve','chenille','papillon'],'growth',[0,1,2,3,4,0]],
  ['chaine',['algue','petit poisson','grand poisson','prédateur','décomposeur'],'algue',['plante','algue','prédateur'],'ecosystem',[0,1,2,3,4,0]],
  ['camouflage',['vert clair','vert foncé','vert clair','vert foncé','vert clair'],'vert foncé',['vert clair','vert foncé','brun'],'camouflage',[0,1,0,1,0,1]],
  ['ramification',['1 branche','2 branches','4 branches','8 branches','16 branches'],'32 branches',['24 branches','30 branches','32 branches'],'branching',[0,1,2,3,4,5]],
  ['classification',['animal','mammifère','félin','chat','chat domestique'],'félin',['félidé','félin','canidé'],'classification',[0,1,2,3,4,2]],
  ['symetrie',['spirale droite','spirale gauche','spirale droite','spirale gauche','spirale droite'],'spirale gauche',['spirale droite','spirale gauche','cercle'],'symmetry',[0,1,0,1,0,1]],
  ['niche',['forêt','arbre','branche','feuille','chenille'],'feuille',['racine','branche','feuille'],'ecosystem',[0,1,2,3,4,3]],
  ['saison',['graine','pousse','fleur','fruit','graine'],'pousse',['racine','pousse','fruit'],'growth',[0,1,2,3,4,1]],
  ['adaptation',['neige','fourrure blanche','neige','fourrure blanche','neige'],'fourrure blanche',['fourrure brune','fourrure blanche','plumes'],'camouflage',[0,1,0,1,0,1]]
 ];
 const c=cases[(d+Math.floor(r()*cases.length))%cases.length];
 const promptMap:Record<string,string>={cycle:'Le cycle du vivant continue. Quel élément vient logiquement après le dernier ?',metamorphose:'Observe les étapes de transformation. Quel élément reprend le cycle ?',chaine:'Observe les relations de dépendance entre les organismes. Quel élément appartient au même rôle dans la série ?',camouflage:'Observe l’alternance de couleurs liée à l’environnement. Quelle valeur poursuit la règle ?',ramification:'Chaque étape double le nombre de branches. Quel nombre vient ensuite ?',classification:'On descend progressivement dans une classification. Quelle catégorie correspond à la relation montrée ?',symetrie:'La figure alterne deux orientations. Quelle orientation vient ensuite ?',niche:'Les éléments vont du milieu vers un élément de plus en plus précis. Quel terme complète la progression ?',saison:'Observe la succession des étapes d’un végétal. Quelle étape correspond au retour indiqué ?',adaptation:'Le motif alterne environnement et trait d’adaptation. Quel trait vient ensuite ?'};
 const seq=c[1].slice(0,Math.min(c[1].length,5+Math.min(1,d%2)));
 const pool=[...c[3],'habitat','racine','pollen','prédateur','feuille','espèce'].filter(x=>x!==c[2]);
 const choices=shuffle([c[2],...pool],r).slice(0,4);
 return{id:`N-${seed}-${d}`,family:'NATURALISTIC',difficulty:d,variant:`natural-${c[0]}-${d}-${Math.floor(r()*1000)}`,tags:['naturalistic','relation','classification',c[0]],prompt:promptMap[c[0]],expectedMs:4200+d*360,capabilities:{IND:.45,VIS:.30,ATT:.25},sequence:seq,choices,correct:choices.indexOf(c[2]),category:'relations du vivant',rule:c[5],natureMode:c[4]};
}

export function generateMeta(seed:number,d:number):MetaItem{
 const r=rnd(seed),kind=(d+Math.floor(r()*5))%5;let a=0,b=0,correct=false,prompt='';
 if(kind===0){a=20+Math.floor(r()*60);b=10+Math.floor(r()*70);correct=a>b;prompt=`Avant de répondre : lequel te paraît le plus grand ? A = ${a} · B = ${b}`}
 else if(kind===1){a=4+Math.floor(r()*7);b=2+Math.floor(r()*7);correct=a>b;prompt=`Sans calculer trop longtemps : quelle boîte te semble contenir le plus d’objets ? A = ${a} · B = ${b}`}
 else if(kind===2){a=30+Math.floor(r()*50);b=20+Math.floor(r()*50);correct=a>b;prompt=`Quel segment te semble le plus long ? A = ${a} · B = ${b}`}
 else if(kind===3){a=2+Math.floor(r()*8);b=2+Math.floor(r()*8);if(a===b)b=Math.max(2,b-1);correct=(a/b)>(b/a);prompt=`Quelle quantité te semble proportionnellement la plus grande ? A = ${a}/${b} · B = ${b}/${a}`}
 else{a=10+Math.floor(r()*50);b=10+Math.floor(r()*50);correct=a>b;prompt=`Après une courte observation : quel nombre te semble le plus élevé ? A = ${a} · B = ${b}`}
 const answer=correct?'A est plus grand':'B est plus grand';const choices=shuffle([answer,'A est plus grand'===answer?'B est plus grand':'A est plus grand','Ils sont égaux','Impossible à savoir'],r);
 return{id:`ME-${seed}-${d}`,family:'META',difficulty:d,variant:`meta-${['number','count','comparison','ratio','estimate'][kind]}`,tags:['metacognition','calibration'],prompt,expectedMs:2800+d*300,capabilities:{RFD:.30,ATT:.22,FLEX:.18,WM:.30},choices,correct:choices.indexOf(answer),confidencePrompt:'À quel point étais-tu sûr de ta réponse ?',confidenceOptions:['Pas sûr','Plutôt sûr','Très sûr'],confidenceCorrect:correct?2:0,metaSpec:{a,b,correct,kind:['number','count','comparison','ratio','memory'][kind] as MetaItem['metaSpec']['kind']}};
}

export function generateMath(seed:number,d:number):MathItem{
 const r=rnd(seed),variant=(d+Math.floor(r()*6))%6;let prompt='',spec:{kind:'sequence'|'boxes'|'cumulative'|'constraint'|'difference'|'average';a:number;b:number;c:number;answer:number};
 if(variant===0){const start=3+Math.floor(r()*8),step=2+Math.floor(r()*5);spec={kind:'sequence',a:start,b:step,c:4,answer:start+4*step};prompt=`Une suite commence ainsi : ${start}, ${start+step}, ${start+2*step}, ${start+3*step}, … Quel nombre vient ensuite ?`}
 else if(variant===1){const each=3+Math.floor(r()*8),third=2+Math.floor(r()*7),total=each*2+third;spec={kind:'boxes',a:each,b:third,c:total,answer:each};prompt=`Deux boîtes identiques contiennent chacune le même nombre d’objets. Une troisième contient ${third} objets. Ensemble, il y en a ${total}. Combien contient chaque boîte identique ?`}
 else if(variant===2){const start=5+Math.floor(r()*7),add=2+Math.floor(r()*5),turns=3+Math.floor(r()*3);spec={kind:'cumulative',a:start,b:add,c:turns,answer:add*turns};prompt=`Une boîte contient ${start} objets. On ajoute ${add} objets à chaque tour. Après ${turns} tours, combien d’objets ont été ajoutés au total ?`}
 else if(variant===3){const second=2+Math.floor(r()*6),delta=1+Math.floor(r()*5),first=second+delta,total=first+second;spec={kind:'constraint',a:first,b:second,c:delta,answer:first};prompt=`Deux nombres positifs ont une somme de ${total}. Le premier est ${delta} de plus que le second. Quel est le premier nombre ?`}
 else if(variant===4){const low=4+Math.floor(r()*7),diff=2+Math.floor(r()*5),high=low+diff;spec={kind:'difference',a:low,b:high,c:diff,answer:high};prompt=`Un nombre vaut ${diff} de plus qu’un autre. Le plus petit vaut ${low}. Quel est le plus grand ?`}
 else{const a=4+Math.floor(r()*8),b=4+Math.floor(r()*8),targetAvg=8+Math.floor(r()*8),c=targetAvg*3-a-b;spec={kind:'average',a,b,c,answer:targetAvg};prompt=`Trois groupes comptent ${a}, ${b} et ${c} éléments. Quel est leur nombre moyen ?`}
 const a=spec.answer;const raw=[a,a+1,a-1,a+2].map(String);const choices=unique4(raw,r);return{id:`X-${seed}-${d}`,family:'MATH',difficulty:d,variant:`math-${spec.kind}`,tags:['reasoning','quantitative','constraint'],prompt,expectedMs:5000+d*520,capabilities:{QNT:.65,RFD:.25,IND:.10},choices,correct:choices.indexOf(String(a)),mathSpec:spec};
}

export function generateVerbal(seed:number,d:number):VerbalItem{
 const r=rnd(seed);
 const sets:[string,string,string,string,VerbalItem['relation']['kind']][]=[
  ['boussole','direction','thermomètre','température','function'],['racine','arbre','fondation','maison','part-whole'],['question','réponse','problème','solution','cause-effect'],
  ['graine','plante','œuf','oiseau','category'],['chaud','froid','rapide','lent','opposite'],['cuivre','métal','verre','silice','material'],
  ['clé','serrure','mot de passe','compte','function'],['auteur','livre','réalisateur','film','part-whole'],['fumée','feu','flaque','pluie','cause-effect'],
  ['rose','fleur','saumon','poisson','category'],['opaque','transparent','lourd','léger','opposite'],['bois','matière','laine','textile','material'],
  ['médecin','patient','enseignant','élève','function'],['page','livre','épisode','série','part-whole'],['nuage','pluie','graine','plante','cause-effect'],
  ['chien','animal','pomme','fruit','category'],['ancien','récent','rare','fréquent','opposite'],['or','métal','verre','matière','material']
 ];
 const s=sets[Math.floor(r()*sets.length)],relation={left1:s[0],right1:s[1],left2:s[2],right2:s[3],kind:s[4]},answer=s[3];
 const distractorPool=sets.filter(x=>x!==s&&x[4]===s[4]).map(x=>x[3]);
 const fallback=['école','outil','objet','animal','couleur','action','matière'];
 const choices=shuffle([answer,...[...distractorPool,...fallback].filter(x=>x!==answer).slice(0,3)],r).slice(0,4);
 return{id:`V-${seed}-${d}`,family:'VERBAL',difficulty:d,variant:`verbal-${s[4]}-${sets.indexOf(s)}`,tags:['verbal','analogy','semantic-relation',s[4]],prompt:`Quel lien complète le mieux cette analogie : ${s[0]} → ${s[1]} ; ${s[2]} → ?`,expectedMs:4400+d*360,capabilities:{IND:.35,RFD:.35,WM:.15,ATT:.15},choices,correct:choices.indexOf(answer),relation};
}
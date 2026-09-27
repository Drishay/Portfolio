/* =========================================================
   Projects Hero Mini-Game
   Seven-level retro road-crossing game.
   No external dependencies.
   ========================================================= */

document.addEventListener("DOMContentLoaded",()=>{
  const hero=document.querySelector(".projects-game-hero");
  const canvas=document.querySelector("#projectsGameCanvas");
  if(!hero||!canvas)return;
  const ctx=canvas.getContext("2d");
  if(!ctx)return;

  const startButton=document.querySelector("#projectsGameStart");
  const characterSelect=document.querySelector("#projectsGameCharacterSelect");
  const characterButtons=document.querySelectorAll(".projects-game-character");
  const resultOverlay=document.querySelector("#projectsGameResult");
  const resultTitle=document.querySelector("#projectsGameResultTitle");
  const resultText=document.querySelector("#projectsGameResultText");
  const restartButton=document.querySelector("#projectsGameRestart");
  const pausedOverlay=document.querySelector("#projectsGamePaused");
  const pauseText=document.querySelector("#projectsGamePauseText");
  const scoreEl=document.querySelector("#projectsGameScore");
  const levelEl=document.querySelector("#projectsGameLevel");
  const stateEl=document.querySelector("#projectsGameState");
  const controls=document.querySelector("#projectsGameControls");

  const state={
    mode:"idle", level:1, score:0, character:"chick", lastTime:0, animationId:0,
    width:900,height:500,dpr:1,laneHeight:40,roadStart:110,roadCount:6,
    player:{x:0,y:0,size:22,targetX:0,targetY:0,moving:false,moveT:0,moveDuration:.14},
    lanes:[],stops:[],particles:[],roadsCrossed:0
  };

  const characterData={
    chick:{body:"#f4d35e",accent:"#d9821b",eye:"#17232d"},
    frog:{body:"#6fbf73",accent:"#2e7d32",eye:"#17232d"},
    ladybug:{body:"#d94c45",accent:"#17232d",eye:"#17232d"}
  };
  const carColors=["#d9821b","#3f7fb5","#d94c45","#6e9c55","#8d63b5","#d2a33d","#4f9a9a"];
  const keys=new Set();

  const isNight=()=>document.documentElement.dataset.theme==="night";

  function configForLevel(){
    const expanded=state.level>=5;
    return {
      roads:expanded?10:6,
      speed:48+(state.level-1)*11,
      playerDuration:Math.max(.075,.16-(state.level-1)*.012),
      carsPerLane:state.level>=6?3:2,
      stopCount:expanded?2:0
    };
  }

  function getBoard(){
    const expanded=state.level>=5;
    const roads=expanded?8:6;
    const rows=expanded?10:8;
    return {expanded,roads,rows,topFoot:0,startRoadRow:expanded?6:6,restRow:expanded?5:-1};
  }

  function resizeCanvas(){
    const r=canvas.getBoundingClientRect();
    state.width=Math.max(320,r.width);
    state.height=Math.max(300,r.height);
    state.dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(state.width*state.dpr);
    canvas.height=Math.floor(state.height*state.dpr);
    ctx.setTransform(state.dpr,0,0,state.dpr,0,0);
    const board=getBoard();
    state.roadCount=board.roads;
    state.laneHeight=Math.max(25,Math.min(42,state.height/(board.rows+2)));
    state.roadStart=state.laneHeight;
    buildLevel();
    draw();
  }
  function resetPlayer(){
    const board=getBoard();
    const bottomFoot=state.height-state.laneHeight*.5;
    state.player.size=Math.max(17,Math.min(25,state.width*.024));
    state.player.x=state.width/2;
    state.player.y=bottomFoot;
    state.player.targetX=state.player.x;
    state.player.targetY=state.player.y;
    state.player.moving=false;
    state.player.moveT=0;
    state.player.moveDuration=configForLevel().playerDuration;
  }
  function buildLevel(){
    const cfg=configForLevel();
    const board=getBoard();
    state.roadCount=board.roads;
    state.lanes=[];
    state.stops=[];
    state.laneHeight=Math.max(25,Math.min(42,state.height/(board.rows+2)));
    state.roadStart=state.laneHeight;

    // Board is rendered top-to-bottom as:
    // finish footpath → roads → [rest footpath] → roads → start footpath.
    let row=1;
    for(let i=0;i<board.roads;i++){
      if(board.expanded && i===4){
        state.stops.push({row,label:"REST"});
        row+=1;
      }

      const y=state.roadStart+row*state.laneHeight;
      const direction=i%2===0?1:-1;
      const baseSpeed=cfg.speed+(i%3)*7;
      const cars=[];

      for(let j=0;j<cfg.carsPerLane;j++){
        const gap=state.width/cfg.carsPerLane;
        cars.push({
          x:(j*gap+(i*71))%state.width,
          y:y+state.laneHeight*.19,
          width:42+(i%3)*8,
          height:state.laneHeight*.58,
          speed:baseSpeed*direction*(.88+(j%2)*.12),
          color:carColors[(i+j+state.level)%carColors.length]
        });
      }

      state.lanes.push({y,direction,cars,row});
      row+=1;
    }

    resetPlayer();
  }
  function resetGame(){
    state.level=1;
    state.score=0;
    state.roadsCrossed=0;
    state.particles=[];
    buildLevel();
    updateHud();
  }

  function updateHud(){
    scoreEl.textContent=String(state.score).padStart(2,"0");
    levelEl.textContent=String(state.level);
    stateEl.textContent=state.mode==="playing"?"Playing":state.mode==="paused"?"Paused":state.mode==="won"?"Complete":state.mode==="gameover"?"Game Over":"Ready";
  }

  function hideOverlays(){
    characterSelect.hidden=true;
    resultOverlay.hidden=true;
    pausedOverlay.hidden=true;
  }

  function setMode(mode){
    state.mode=mode;
    hero.classList.toggle("is-playing",mode==="playing");
    hero.classList.toggle("is-paused",mode==="paused");
    if(mode!=="paused")pausedOverlay.hidden=true;
    updateHud();
  }

  function openCharacterSelect(){
    characterSelect.hidden=false;
    resultOverlay.hidden=true;
    pausedOverlay.hidden=true;
    characterButtons.forEach(b=>b.classList.toggle("is-selected",b.dataset.character===state.character));
  }

  function startGame(){
    resetGame();
    hideOverlays();
    openCharacterSelect();
    setMode("selecting");
  }

  function beginSelectedGame(){
    characterSelect.hidden=true;
    setMode("playing");
    state.lastTime=performance.now();
    cancelAnimationFrame(state.animationId);
    state.animationId=requestAnimationFrame(loop);
  }

  function pauseGame(){
    if(state.mode!=="playing")return;
    pausedOverlay.hidden=false;
    pauseText.textContent="Click the game area to continue.";
    setMode("paused");
  }

  function resumeGame(){
    if(state.mode!=="paused")return;
    pausedOverlay.hidden=true;
    setMode("playing");
    state.lastTime=performance.now();
    state.animationId=requestAnimationFrame(loop);
  }

  function movePlayer(dx,dy){
    if(state.mode!=="playing"||state.player.moving)return;
    const cfg=configForLevel();
    const stepX=Math.max(24,state.width*.052);
    const stepY=state.laneHeight;
    const topFoot=state.roadStart;
    const bottomFoot=state.height-state.laneHeight*.55;

    const targetX=Math.max(state.player.size,Math.min(state.width-state.player.size,state.player.x+dx*stepX));
    const targetY=Math.max(topFoot,Math.min(bottomFoot,state.player.y-dy*stepY));

    if(targetY===state.player.y&&targetX===state.player.x)return;

    state.player.targetX=targetX;
    state.player.targetY=targetY;
    state.player.moveT=0;
    state.player.moveDuration=cfg.playerDuration;
    state.player.moving=true;

    if(dy>0){
      state.roadsCrossed+=1;
      state.score+=1;
    }
  }

  function finishLevel(){
    cancelAnimationFrame(state.animationId);
    if(state.level>=7){
      spawnParticles();
      setMode("won");
      resultTitle.textContent="You cleared all 7 levels!";
      resultText.textContent="Perfect run. You reached the final build.";
      resultOverlay.hidden=false;
      restartButton.textContent="Play Again";
      return;
    }
    setMode("levelcomplete");
    resultTitle.textContent=`Level ${state.level} complete!`;
    resultText.textContent=`Roads cleared: ${state.roadsCrossed}. Ready for level ${state.level+1}?`;
    restartButton.textContent="Next Level";
    resultOverlay.hidden=false;
  }

  function nextLevel(){
    if(state.level>=7){startGame();return;}
    state.level+=1;
    buildLevel();
    resultOverlay.hidden=true;
    setMode("playing");
    state.lastTime=performance.now();
    state.animationId=requestAnimationFrame(loop);
  }

  function restartCurrentLevel(){
    state.score=Math.max(0,state.score-state.roadsCrossed);
    state.roadsCrossed=0;
    state.particles=[];
    buildLevel();
    resultOverlay.hidden=true;
    setMode("playing");
    state.lastTime=performance.now();
    state.animationId=requestAnimationFrame(loop);
  }

  function gameOver(){
    cancelAnimationFrame(state.animationId);
    setMode("gameover");
    resultTitle.textContent="Watch the traffic!";
    resultText.textContent=`Level ${state.level} · Score ${state.score}. Try the crossing again.`;
    restartButton.textContent="Restart Level";
    resultOverlay.hidden=false;
  }

  function checkCollision(){
    const p={left:state.player.x-state.player.size*.42,right:state.player.x+state.player.size*.42,top:state.player.y-state.player.size*.42,bottom:state.player.y+state.player.size*.42};
    for(const lane of state.lanes)for(const car of lane.cars){
      const c={left:car.x-car.width/2,right:car.x+car.width/2,top:car.y,bottom:car.y+car.height};
      if(p.left<c.right&&p.right>c.left&&p.top<c.bottom&&p.bottom>c.top)return true;
    }
    return false;
  }

  function update(dt){
    const p=state.player;
    if(p.moving){
      p.moveT+=dt;
      const t=Math.min(1,p.moveT/p.moveDuration);
      const ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      p.x=p.x+(p.targetX-p.x)*ease;
      p.y=p.y+(p.targetY-p.y)*ease;
      if(t>=1){p.x=p.targetX;p.y=p.targetY;p.moving=false;}
    }

    for(const lane of state.lanes)for(const car of lane.cars){
      car.x+=car.speed*dt;
      if(lane.direction>0&&car.x-car.width>state.width)car.x=-car.width;
      if(lane.direction<0&&car.x+car.width<0)car.x=state.width+car.width;
    }

    for(const particle of state.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.life-=dt}
    state.particles=state.particles.filter(particle=>particle.life>0);

    if(checkCollision()){gameOver();return}

    const topFoot=state.roadStart;
    if(!p.moving&&p.y<=topFoot+state.laneHeight*.45)finishLevel();
  }

  function drawBackground(){
    const night=isNight();
    const board=getBoard();

    ctx.fillStyle=night?"#071019":"#d8e5d0";
    ctx.fillRect(0,0,state.width,state.height);

    // Buildings / skyline behind the finish footpath.
    const footHeight=state.laneHeight;
    ctx.fillStyle=night?"#102536":"#b8d3ad";
    ctx.fillRect(0,0,state.width,footHeight);

    for(let x=0;x<state.width;x+=58){
      const h=18+((x*17)%28);
      ctx.fillStyle=night?"#17344a":"#6f9270";
      ctx.fillRect(x,footHeight-h,30,h);
      ctx.fillStyle=night?"#7da4c5":"#e9c16f";
      ctx.fillRect(x+7,footHeight-h+8,4,4);
      ctx.fillRect(x+18,footHeight-h+17,4,4);
    }

    // Top finish footpath.
    ctx.fillStyle=night?"#18394d":"#d5dfbd";
    ctx.fillRect(0,0,state.width,footHeight);
    ctx.fillStyle=night?"#4d78a3":"#d9821b";
    ctx.fillRect(0,footHeight-3,state.width,3);

    // Roads and the optional central resting footpath.
    for(let row=1;row<=board.rows-1;row++){
      const y=row*state.laneHeight;
      const stop=state.stops.find(item=>item.row===row);

      if(stop){
        ctx.fillStyle=night?"#18394d":"#d5dfbd";
        ctx.fillRect(0,y,state.width,state.laneHeight);
        ctx.fillStyle=night?"rgba(125,164,197,.4)":"rgba(255,255,255,.55)";
        for(let x=18;x<state.width;x+=48)ctx.fillRect(x,y+8,24,3);
        ctx.fillStyle=night?"rgba(233,242,248,.42)":"rgba(23,35,45,.38)";
        ctx.font="700 9px Manrope, sans-serif";
        ctx.fillText("REST",10,y+state.laneHeight*.7);
        continue;
      }

      const laneIndex=state.lanes.findIndex(lane=>lane.row===row);
      if(laneIndex<0)continue;
      ctx.fillStyle=night?(laneIndex%2?"#162a39":"#142433"):(laneIndex%2?"#69736f":"#747d78");
      ctx.fillRect(0,y,state.width,state.laneHeight);
      ctx.strokeStyle=night?"rgba(171,205,226,.15)":"rgba(255,255,255,.25)";
      ctx.setLineDash([12,14]);
      ctx.beginPath();
      ctx.moveTo(0,y+state.laneHeight-4);
      ctx.lineTo(state.width,y+state.laneHeight-4);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Bottom starting footpath.
    const bottomY=state.height-footHeight;
    ctx.fillStyle=night?"#18394d":"#d5dfbd";
    ctx.fillRect(0,bottomY,state.width,footHeight);
    ctx.fillStyle=night?"rgba(125,164,197,.4)":"rgba(23,35,45,.22)";
    ctx.font="700 9px Manrope, sans-serif";
    ctx.fillText("START",10,bottomY+footHeight*.68);
  }
  function drawCars(){
    state.lanes.forEach((lane,laneIndex)=>lane.cars.forEach((car,carIndex)=>{
      ctx.fillStyle=car.color;
      ctx.fillRect(car.x-car.width/2,car.y+4,car.width,car.height-7);
      ctx.fillStyle=isNight()?"#dbeaf4":"#f4ead8";
      ctx.fillRect(car.x-car.width*.24,car.y+8,car.width*.48,car.height*.3);
      ctx.fillStyle="#18232b";
      ctx.fillRect(car.x-car.width*.34,car.y+car.height-5,8,5);
      ctx.fillRect(car.x+car.width*.19,car.y+car.height-5,8,5);
    }));
  }

  function drawPlayer(){
    const s=state.player.size,x=state.player.x,y=state.player.y,c=characterData[state.character];
    ctx.fillStyle="rgba(0,0,0,.2)";
    ctx.fillRect(x-s*.55,y+s*.45,s*1.1,4);
    ctx.fillStyle=c.body;

    if(state.character==="ladybug"){
      ctx.beginPath();ctx.arc(x,y,s*.48,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=c.accent;ctx.fillRect(x-1.5,y-s*.45,3,s*.9);
      ctx.fillStyle=c.eye;[[x-s*.23,y-s*.15],[x+s*.15,y-s*.15],[x-s*.23,y+s*.2],[x+s*.15,y+s*.2]].forEach(([px,py])=>ctx.fillRect(px,py,4,4));
    }else if(state.character==="frog"){
      ctx.fillRect(x-s*.43,y-s*.35,s*.86,s*.72);
      ctx.fillRect(x-s*.52,y-s*.62,s*.28,s*.28);ctx.fillRect(x+s*.24,y-s*.62,s*.28,s*.28);
      ctx.fillStyle=c.eye;ctx.fillRect(x-s*.23,y-s*.1,4,4);ctx.fillRect(x+s*.08,y-s*.1,4,4);
    }else{
      ctx.fillRect(x-s*.43,y-s*.43,s*.86,s*.86);
      ctx.fillStyle=c.accent;ctx.fillRect(x+s*.34,y-s*.1,s*.28,5);
      ctx.fillStyle=c.eye;ctx.fillRect(x-s*.25,y-s*.12,4,4);ctx.fillRect(x+s*.08,y-s*.12,4,4);
      ctx.fillStyle=c.accent;ctx.fillRect(x-s*.22,y-s*.68,s*.44,s*.2);
    }
  }

  function drawParticles(){
    state.particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=isNight()?"#7da4c5":"#f0b24e";ctx.fillRect(p.x,p.y,4,4)});
    ctx.globalAlpha=1;
  }

  function draw(){drawBackground();drawCars();drawPlayer();drawParticles()}

  function loop(time){
    if(state.mode!=="playing")return;
    const dt=Math.min((time-state.lastTime)/1000,.05);
    state.lastTime=time;
    update(dt);
    draw();
    if(state.mode==="playing")state.animationId=requestAnimationFrame(loop);
  }

  function spawnParticles(){
    for(let i=0;i<32;i++)state.particles.push({x:state.player.x,y:state.player.y,vx:(Math.random()-.5)*160,vy:(Math.random()-.5)*160,life:1});
    draw();
  }

  function handleDirection(direction){
    if(direction==="up")movePlayer(0,1);
    if(direction==="down")movePlayer(0,-1);
    if(direction==="left")movePlayer(-1,0);
    if(direction==="right")movePlayer(1,0);
  }

  function handleKeydown(event){
    const key=event.key.toLowerCase();
    const map={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};
    const direction=map[key];
    if(!direction)return;
    event.preventDefault();
    if(keys.has(key))return;
    keys.add(key);
    handleDirection(direction);
  }

  function handleKeyup(event){keys.delete(event.key.toLowerCase())}

  startButton?.addEventListener("click",e=>{e.stopPropagation();startGame()});

  characterButtons.forEach(button=>button.addEventListener("click",e=>{
    e.stopPropagation();
    state.character=button.dataset.character;
    characterButtons.forEach(b=>b.classList.toggle("is-selected",b===button));
    beginSelectedGame();
  }));

  restartButton?.addEventListener("click",e=>{
    e.stopPropagation();
    if(state.mode==="levelcomplete"){nextLevel();return}
    if(state.mode==="gameover"){restartCurrentLevel();return}
    startGame();
  });

  controls?.querySelectorAll("button").forEach(button=>button.addEventListener("pointerdown",e=>{
    e.stopPropagation();e.preventDefault();handleDirection(button.dataset.direction);
  }));

  hero.addEventListener("click",event=>{
    if(state.mode==="paused"&&!event.target.closest("button"))resumeGame();
  });

  document.addEventListener("pointerdown",event=>{
    if(state.mode==="playing"&&!hero.contains(event.target))pauseGame();
  });

  document.addEventListener("keydown",handleKeydown);
  document.addEventListener("keyup",handleKeyup);
  document.addEventListener("themechange",draw);
  window.addEventListener("resize",resizeCanvas);

  resetGame();
  resizeCanvas();
  setMode("idle");
});
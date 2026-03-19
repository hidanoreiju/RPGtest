/**
 * RESONANCE - システム・エンジン (main.js)
 */

const fixStyle = document.createElement('style');
fixStyle.innerHTML = `
    #dialogue-message-box { min-height: 160px; height: auto !important; }
    #flash-overlay, #noise-overlay, #fog-overlay { pointer-events: none !important; }
`;
document.head.appendChild(fixStyle);

let isEventActive = false, isEmotionSightActive = false, isMenuOpen = false; 
let currentChoices = [], isBridgeVisible = false, ashInterval = null;
let currentSlashes = [], slashInterval = null;

function checkFlagsIntegrity() {
    if (!PLAYER.flags) PLAYER.flags = {}; if (!PLAYER.inventory) PLAYER.inventory = {};
    if (!PLAYER.items) PLAYER.items = { fragments: [] }; if (!PLAYER.items.fragments) PLAYER.items.fragments = [];
    if (!PLAYER.equipment) PLAYER.equipment = { weapon: "古びた片手剣", armor: "ボロボロの服" };
    if (!PLAYER.storage) PLAYER.storage = {}; 
    
    const defaults = { shadowsTalked: [false, false, false], lucasPhase: 0, lucasDefeated: false, gatekeeperDefeated: false, timeStopped: false, bossDoorOpened: false, b1StairsRevealed: false, gearSequence: [], valveOpened: false, mazeSequence: [], zeppHealCount: 0, zeppDoorUnlocked: false, fountainOpened: false, waterDrained1_3: false, leverAppeared: false, plankPlaced1_3: false, curseSteps: -1, scaleSacrifice: "", reached1_4: false };
    for (let key in defaults) { if (PLAYER.flags[key] === undefined) PLAYER.flags[key] = defaults[key]; }
    const invDefaults = { key1_4: 0, ore: 0, pendant: 0, castleKey2F: 0, unknownFragment: 0, gearRed: 0, gearGreen: 0, gearBlue: 0, rustyValve: 0, throneKey: 0, bloodOre: 0, regenRing: 0, pureAsh: 0, goddessTear: 0, sorrowWeight: 0 };
    for (let key in invDefaults) { if (PLAYER.inventory[key] === undefined) PLAYER.inventory[key] = invDefaults[key]; }
    if (PLAYER.items.silverSword === undefined) PLAYER.items.silverSword = 0;
    if (PLAYER.items.armor === undefined) PLAYER.items.armor = 0;
    if (PLAYER.items.rustyGreatsword === undefined) PLAYER.items.rustyGreatsword = 0;

    if (!PLAYER.flags.mazeCorrectSequence) {
        const mazeDirs = ["north", "south", "west"];
        PLAYER.flags.mazeCorrectSequence = [mazeDirs[Math.floor(Math.random()*3)], mazeDirs[Math.floor(Math.random()*3)], mazeDirs[Math.floor(Math.random()*3)], mazeDirs[Math.floor(Math.random()*3)]];
    }

    if (PLAYER.flags.plankPlaced1_3 && MAPS["1-3-B2"]) MAPS["1-3-B2"][8][9] = 1; 
    if (PLAYER.flags.waterDrained1_3 && MAPS["1-3-B3"]) { for(let r=0; r<20; r++) for(let c=0; c<20; c++) if(MAPS["1-3-B3"][r][c] === 645) MAPS["1-3-B3"][r][c] = 1; }
    if (PLAYER.flags.leverAppeared && MAPS["1-3-B2"]) MAPS["1-3-B2"][6][15] = 317; 
    if (PLAYER.flags.valveOpened && MAPS["1-6-B1"]) { for(let r=0; r<20; r++) for(let c=0; c<20; c++) if(MAPS["1-6-B1"][r][c] === 645) MAPS["1-6-B1"][r][c] = 1; }
    if (PLAYER.flags.bossDoorOpened && MAPS["1-6-F3"]) { MAPS["1-6-F3"][3][9] = 1; MAPS["1-6-F3"][3][10] = 1; }
    if (PLAYER.flags.b1StairsRevealed && MAPS["1-6-F1"]) MAPS["1-6-F1"][2][2] = 602; 
    if (PLAYER.flags.gearSequence && PLAYER.flags.gearSequence.length === 3 && MAPS["1-4-Depths"]) MAPS["1-4-Depths"][7][9] = 1;
    if (PLAYER.flags.curseSteps !== -1 && MAPS["1-4-Entrance"]) { MAPS["1-4-Entrance"][0][9] = 1; MAPS["1-4-Entrance"][0][10] = 1; }
}

function showNext(action) { showChoices("", [{ text: "▼ 次へ (Enter)", action: action || endEvent }]); }
function logMessage(msg) { isEventActive = true; const ui = document.getElementById("dialogue-ui"); ui.style.display = "flex"; document.getElementById("dialogue-text").style.display = "none"; document.getElementById("dialogue-name").innerText = ""; document.getElementById("dialogue-name").style.borderBottom = "none"; const box = document.getElementById("game-message"); box.style.display = "block"; const div = document.createElement("div"); div.innerHTML = msg; box.appendChild(div); box.scrollTop = box.scrollHeight; }
function talk(charId, text, nextAction) { isEventActive = true; const ch = CHARACTERS[charId] || CHARACTERS.system; const nameEl = document.getElementById("dialogue-name"); nameEl.innerText = ch.name; nameEl.className = ch.color; nameEl.style.borderBottom = "1px solid #444"; document.getElementById("game-message").style.display = "none"; document.getElementById("game-message").innerHTML = ""; const textEl = document.getElementById("dialogue-text"); textEl.innerHTML = text; textEl.style.display = "block"; const imgEl = document.getElementById("dialogue-portrait"); if (ch.img) { imgEl.src = ch.img; imgEl.style.display = "block"; } else { imgEl.style.display = "none"; } document.getElementById("dialogue-ui").style.display = "flex"; showNext(nextAction || endEvent); }
function hideTalk() { document.getElementById("dialogue-ui").style.display = "none"; }

window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (PLAYER.hp <= 0 && document.getElementById("title-screen").style.display === "none") return;
    if (document.getElementById("title-screen").style.display !== "none") { if (key === "enter") startGame(); if (key === "l") openSaveMenu(); return; }
    if (key === "m" || key === "ｍ" || e.code === "KeyM" || (isMenuOpen && key === "escape")) { toggleMenu(); return; }
    if (isMenuOpen) return; 
    if (isEventActive) {
        if (!isNaN(key) && key !== "0") { const idx = parseInt(key) - 1; if (currentChoices[idx]) currentChoices[idx].action(); } 
        else if (key === "enter" || key === " ") { if (currentChoices.length > 0) currentChoices[0].action(); }
        return;
    }
    switch(key) {
        case "w": case "arrowup": move(0, -1); break; case "s": case "arrowdown": move(0, 1); break;
        case "a": case "arrowleft": move(-1, 0); break; case "d": case "arrowright": move(1, 0); break;
        case "e": usePotion(); break; case "c": openCrafting(); break;
        case "l": openSaveMenu(); break; case "r": useEmotionSight(); break; 
    }
});

function showChoices(msg, choices) { isEventActive = true; currentChoices = choices; const ui = document.getElementById("dialogue-ui"); ui.style.display = "flex"; const area = document.getElementById("action-area"); let html = ""; if (msg) html += `<div style="color:#f66; margin-bottom:10px; font-weight:bold;">${msg}</div>`; area.innerHTML = html; choices.forEach((c, idx) => { const div = document.createElement("div"); div.className = "action-btn"; div.innerText = c.text; div.onclick = () => { if (isEventActive && currentChoices[idx]) currentChoices[idx].action(); }; area.appendChild(div); }); }

function useEmotionSight() {
    if (isEventActive || isEmotionSightActive) return;
    isEmotionSightActive = true;
    document.getElementById("flash-overlay").classList.add("flash-invert-anim");
    setTimeout(() => { document.getElementById("flash-overlay").classList.remove("flash-invert-anim"); }, 1000);
    logMessage("<span style='color:#a0f; font-weight:bold;'>レオンは周囲の「残響」に意識を研ぎ澄ませた……！</span><br><span style='color:#aaa; font-size:0.9rem;'>（一時的に隠された道や痕跡、危険が浮かび上がっている）</span>");
    updateDarkness(false); renderMap(); 
    showNext(() => { endEvent(); setTimeout(() => { isEmotionSightActive = false; updateDarkness(true); renderMap(); }, 15000); });
}

function startGame() {
    checkFlagsIntegrity(); document.getElementById("title-screen").style.display = "none"; document.getElementById("game-container").style.display = "flex"; 
    const guide = document.getElementById("mini-guide"); if (guide) { guide.innerHTML = `[WASD] 移動<br><span style="cursor:pointer; color:#add8e6; text-decoration:underline;" onclick="toggleMenu()">[M] メニュー (クリック可)</span><br>[R] 残響視<br>[E] 回復薬 / [C] 調律`; guide.style.pointerEvents = "auto"; }
    renderMap(); startAsh(); startMetaEffects();
    logMessage("灰の降る森。虚無の底から、誰かの声が響いている……"); showNext(); 
}

function updateCurseUI() {
    const curseUI = document.getElementById("curse-ui");
    if (!curseUI) return;
    if (PLAYER.flags.curseSteps > 0) {
        curseUI.style.display = "block";
        document.getElementById("curse-steps").innerText = PLAYER.flags.curseSteps;
        if (PLAYER.flags.curseSteps <= 10) curseUI.style.animation = "blink-flower 0.5s infinite alternate";
        else curseUI.style.animation = "none";
    } else {
        curseUI.style.display = "none";
    }
}

function move(dx, dy) {
    const nx = PLAYER.x + dx, ny = PLAYER.y + dy;
    if (nx < 0 || nx >= 20 || ny < 0 || ny >= 20) { handleMapTransition(nx, ny); return; }
    const cell = MAPS[PLAYER.currentScene][ny][nx];
    
    if (cell === 9) { handleHoleInteraction(nx, ny); return; }
    if (cell === 999 && !isBridgeVisible) { logMessage("奈落が道を塞いでいる。"); showNext(); return; }
    if (cell === 645) { logMessage("深い水路に水が満ちていて進めない。どこかで水を引かせる必要がある……。"); showNext(); return; }
    
    if (cell === 998 || (cell === 116 && !isEmotionSightActive) || (cell === 915 && !isEmotionSightActive)) { handlePitFall(); return; }
    if ((cell === 111 || cell === 807 || cell === 809 || cell === 911) && !isEmotionSightActive) return;

    if (cell !== 0) {
        PLAYER.x = nx; PLAYER.y = ny; 
        
        if (cell === 916) {
            PLAYER.hp -= 10; renderMap(); updateDarkness();
            if (PLAYER.hp <= 0) { 
                logMessage("<span style='color:#f44; font-weight:bold;'>見えない血の茨に全身を貫かれた……（耐久-10）</span>"); 
                setTimeout(() => triggerBadEnd("thorn"), 1000); 
            } else { 
                logMessage("<span style='color:#f44;'>見えない血の茨を踏み抜いた！（耐久-10）</span>"); 
                showNext(endEvent); 
            }
            return;
        }
        
        if (PLAYER.flags.curseSteps > 0) {
            PLAYER.flags.curseSteps--; updateCurseUI();
            if (PLAYER.flags.curseSteps <= 0) {
                PLAYER.hp -= 30; PLAYER.flags.curseSteps = 30; updateCurseUI(); renderMap();
                logMessage("<span style='color:#f44; font-weight:bold;'>呪いが器を激しく蝕んだ！ (HP -30)</span>");
                if (PLAYER.hp <= 0) { setTimeout(() => triggerBadEnd("steps"), 1000); return; } else { showNext(endEvent); return; } 
            }
        }

        if (cell === 912) { handleSlashHit(); return; }
        renderMap(); updateDarkness();
        
        if (PLAYER.inventory.regenRing > 0 && PLAYER.hp < PLAYER.maxHp && Math.random() < 0.15) { PLAYER.hp = Math.min(PLAYER.maxHp, PLAYER.hp + 1); }
        if (PLAYER.equipment.weapon === "呪われた錆びた大剣" && Math.random() < 0.1) {
            PLAYER.hp -= 2; logMessage("<span style='color:#f44;'>錆びた大剣の呪いが体を蝕む…… (HP-2)</span>");
            if (PLAYER.hp <= 0) { setTimeout(() => triggerBadEnd("curse"), 500); } else { showNext(endEvent); } return;
        }

        if ((PLAYER.currentScene.startsWith("1-1") || PLAYER.currentScene.startsWith("1-2") || PLAYER.currentScene === "1-3-Entrance") && cell === 1 && Math.random() < 0.10) {
            triggerRandomBattle();
        } else if (cell > 1 && cell !== 111 && cell !== 911 && cell !== 912 && cell !== 915 && cell !== 116 && cell !== 916) {
            triggerEvent(cell, nx, ny);
        }
    }
}

function handleMapTransition(nx, ny) {
    let nextMap = null; let spawnX = PLAYER.x; let spawnY = PLAYER.y; let dir = ""; let transitionMsg = null;
    if (ny < 0) { dir = "north"; spawnY = 19; } else if (ny >= 20) { dir = "south"; spawnY = 0; }
    else if (nx < 0) { dir = "west"; spawnX = 19; } else if (nx >= 20) { dir = "east"; spawnX = 0; }

    if (PLAYER.currentScene === "1-3-F1" && nx < 0 && dir === "west") { nextMap = "1-4-Entrance"; spawnX = 18; spawnY = 18; }
    else if (PLAYER.currentScene === "1-1-Maze") {
        if (dir === "east") { PLAYER.flags.mazeSequence = []; nextMap = "1-1-West"; spawnX = 0; }
        else {
            PLAYER.flags.mazeSequence.push(dir);
            let seq = PLAYER.flags.mazeSequence, correctSeq = PLAYER.flags.mazeCorrectSequence, isCorrectSoFar = true;
            for (let i = 0; i < seq.length; i++) { if (seq[i] !== correctSeq[i]) isCorrectSoFar = false; }
            if (!isCorrectSoFar) { PLAYER.flags.mazeSequence = []; nextMap = "1-1-Maze-Punish"; spawnX = 9; spawnY = 9; transitionMsg = "<span style='color:#f44; font-weight:bold;'>……空間が歪み、不気味な広場に落とされた！</span>"; }
            else if (seq.length === correctSeq.length) { PLAYER.flags.mazeSequence = []; nextMap = "1-1-Maze-Secret"; spawnX = 9; spawnY = 11; transitionMsg = "<span style='color:#add8e6;'>……迷いの森を抜け、静寂な場所にたどり着いた。</span>"; }
            else { nextMap = "1-1-Maze"; spawnX = (dir === "west") ? 19 : (dir === "east" ? 0 : 9); spawnY = (dir === "north") ? 19 : (dir === "south" ? 0 : 9); }
        }
    } else {
        if (dir === "north" && MAP_LINKS[PLAYER.currentScene]?.north) nextMap = MAP_LINKS[PLAYER.currentScene].north;
        else if (dir === "south" && MAP_LINKS[PLAYER.currentScene]?.south) nextMap = MAP_LINKS[PLAYER.currentScene].south;
        else if (dir === "west" && MAP_LINKS[PLAYER.currentScene]?.west) nextMap = MAP_LINKS[PLAYER.currentScene].west;
        else if (dir === "east" && MAP_LINKS[PLAYER.currentScene]?.east) nextMap = MAP_LINKS[PLAYER.currentScene].east;
    }

    if (nextMap) {
        isEventActive = true; 
        if (PLAYER.currentScene === "1-4-Corridor") clearSlashTimer();
        PLAYER.currentScene = nextMap; PLAYER.x = spawnX; PLAYER.y = spawnY;
        document.getElementById("map-wrapper").style.opacity = "0.2";
        if (PLAYER.currentScene === "1-2-Mirror") document.getElementById("map-wrapper").style.filter = "hue-rotate(180deg) invert(0.8)";
        else document.getElementById("map-wrapper").style.filter = "none";
        updateDarkness(nextMap.startsWith("1-4"));
        setTimeout(() => { renderMap(); document.getElementById("map-wrapper").style.opacity = "1"; if (transitionMsg) { logMessage(transitionMsg); showNext(endEvent); } else { isEventActive = false; } }, 300);
    } else { logMessage("この先は進めないようだ。"); showNext(endEvent); }
}

function updateDarkness(enabled) {
    const fog = document.getElementById("fog-overlay"); if (!fog) return;
    if (enabled && !isEmotionSightActive) { fog.style.display = "block"; } else if (enabled === false || isEmotionSightActive) { fog.style.display = "none"; } else if (PLAYER.currentScene.startsWith("1-4") && !isEmotionSightActive) { fog.style.display = "block"; } else { fog.style.display = "none"; }
}

function handlePitFall() {
    isEventActive = true; logMessage("<span style='color:#f44; font-weight:bold;'>レオンは暗闇の奈落へ真っ逆さまに落ちていった！</span>");
    document.getElementById("noise-overlay").classList.add("noise-anim");
    setTimeout(() => { 
        PLAYER.hp -= 20; 
        if (PLAYER.hp <= 0) { 
            logMessage(`落下ダメージを受けた！（耐久-20）`); 
            setTimeout(() => triggerBadEnd("pit"), 1000); 
        } else { 
            PLAYER.currentScene = "1-4-Chamber"; PLAYER.x = 9; PLAYER.y = 19; 
            document.getElementById("noise-overlay").classList.remove("noise-anim"); 
            updateDarkness(); renderMap(); 
            logMessage(`落下ダメージを受けた！（耐久-20）`); 
            showNext(endEvent); 
        } 
    }, 1500);
}

function handleSlashHit() {
    isEventActive = true; PLAYER.hp -= 30; document.getElementById("flash-overlay").classList.add("flash-red-anim");
    setTimeout(() => document.getElementById("flash-overlay").classList.remove("flash-red-anim"), 500);
    if (PLAYER.hp <= 0) { logMessage("<span style='color:#f00; font-weight:bold;'>グアッ！ 残響の斬撃に身体を切り裂かれた！（耐久-30）</span>"); setTimeout(() => triggerBadEnd("dead"), 1000); }
    else { renderMap(); logMessage("<span style='color:#f00; font-weight:bold;'>グアッ！ 残響の斬撃に身体を切り裂かれた！（耐久-30）</span>"); showNext(endEvent); }
}

function startSlashTimer() {
    if (slashInterval) clearInterval(slashInterval); generateSlashes(); 
    slashInterval = setInterval(() => { if (!isMenuOpen && !isEventActive && PLAYER.currentScene === "1-4-Corridor") { clearSlashingTiles(); activateSlashes(); setTimeout(generateSlashes, 1500); } }, 4000); 
}
function clearSlashTimer() { if (slashInterval) clearInterval(slashInterval); currentSlashes = []; clearSlashingTiles(); }
function generateSlashes() {
    if (PLAYER.currentScene !== "1-4-Corridor") return; currentSlashes = []; const num = PLAYER.res >= 50 ? 3 : 2; const rows = [4, 6, 8, 10, 12, 14, 16]; 
    for (let i = 0; i < num; i++) { const y = rows[Math.floor(Math.random() * rows.length)], dir = Math.random() < 0.5 ? "right" : "left"; currentSlashes.push({ y, dir }); const map = MAPS["1-4-Corridor"]; for (let x = 1; x < 19; x++) { if (map[y][x] === 1) map[y][x] = 911; } } renderMap();
}
function activateSlashes() {
    if (PLAYER.currentScene !== "1-4-Corridor") return; const map = MAPS["1-4-Corridor"], area = document.getElementById("visual-area"); 
    currentSlashes.forEach(s => { for (let x = 1; x < 19; x++) { if (map[s.y][x] === 911) map[s.y][x] = 912; } const effect = document.createElement("div"); effect.className = "slash-effect"; effect.style.top = `calc(100% / 20 * ${s.y})`; effect.style.animationName = s.dir === "right" ? "slash-right" : "slash-left"; area.appendChild(effect); setTimeout(() => effect.remove(), 1000); });
    if (map[PLAYER.y][PLAYER.x] === 912) { handleSlashHit(); } renderMap();
}
function clearSlashingTiles() { if (PLAYER.currentScene !== "1-4-Corridor") return; const map = MAPS["1-4-Corridor"]; for (let y = 0; y < 20; y++) { for (let x = 0; x < 20; x++) { if (map[y][x] === 911 || map[y][x] === 912) map[y][x] = 1; } } renderMap(); }

function triggerRandomBattle() { 
    isEventActive = true; talk("echo", "グルル……", () => { showChoices("どうする？", [ { text: "1: 戦う", action: () => { const dmg = Math.floor(Math.random()*5)+5; PLAYER.hp -= dmg; if (PLAYER.hp <= 0) { logMessage(`激しい攻撃を受けた！ 耐久-${dmg}`); setTimeout(() => triggerBadEnd("dead"), 1000); } else { PLAYER.inventory.ash++; logMessage(`激しい攻撃を受けた！ 耐久-${dmg}<br><span style='color:#add8e6;'>残響を打ち払い、「灰」を1つ手に入れた。</span>`); showNext(endEvent); } }}, { text: "2: 逃げる", action: () => { logMessage("レオンは走って逃げ出した。"); showNext(endEvent); }} ]); }); 
}

function toggleMenu() { if (isEventActive && !isMenuOpen) return; isMenuOpen = !isMenuOpen; const overlay = document.getElementById("menu-overlay"); if (!overlay) return; if (isMenuOpen) { try { updateMenuUI(); overlay.style.display = "flex"; } catch (e) { console.error(e); alert("エラーが発生しました。"); isMenuOpen = false; } } else { overlay.style.display = "none"; } }

function updateMenuUI() { 
    checkFlagsIntegrity(); updateCurseUI(); const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; }; 
    setText("menu-hp", `${Math.max(0, PLAYER.hp)} / ${PLAYER.maxHp}`); setText("menu-res", `${PLAYER.res}%`); setText("menu-res-text", PLAYER.res >= 50 ? "器が満たされ始めている" : "人間性を保っている"); setText("menu-equip-weapon", PLAYER.equipment ? PLAYER.equipment.weapon : "なし"); setText("menu-equip-armor", PLAYER.equipment ? PLAYER.equipment.armor : "なし"); 
    let invHtml = `灰: ${PLAYER.inventory.ash || 0} / 草: ${PLAYER.inventory.herb || 0} / 火: ${PLAYER.inventory.ember || 0} / 鉱石: ${PLAYER.inventory.ore || 0}<br>回復薬: ${PLAYER.items.potion || 0} / 共鳴灯: ${PLAYER.items.lamp || 0}<br>`; 
    if (PLAYER.inventory.gearRed > 0) invHtml += `<span style="color:#f66;">赤の記憶の歯車 x${PLAYER.inventory.gearRed}</span><br>`; if (PLAYER.inventory.gearGreen > 0) invHtml += `<span style="color:#8f8;">緑の記憶の歯車 x${PLAYER.inventory.gearGreen}</span><br>`; if (PLAYER.inventory.gearBlue > 0) invHtml += `<span style="color:#add8e6;">青の記憶の歯車 x${PLAYER.inventory.gearBlue}</span><br>`; if (PLAYER.inventory.rustyValve > 0) invHtml += `<span style="color:#ccc;">錆びたバルブ x${PLAYER.inventory.rustyValve}</span><br>`; if (PLAYER.inventory.throneKey > 0) invHtml += `<span style="color:#f44; font-weight:bold;">王座の間への鍵</span><br>`; if (PLAYER.inventory.pendant > 0) invHtml += `<span style="color:#add8e6;">王妃のペンダント</span><br>`; if (PLAYER.inventory.castleKey2F > 0) invHtml += `<span style="color:#a0f;">地下牢の鍵</span><br>`; if (PLAYER.inventory.unknownFragment > 0) invHtml += `<span style="color:#add8e6; font-weight:bold;">？？？の記憶のかけら</span><br>`; if (PLAYER.inventory.bloodOre > 0) invHtml += `<span style="color:#f44; font-weight:bold;">血濡れた記憶の鉱石 x${PLAYER.inventory.bloodOre}</span><br>`; if (PLAYER.inventory.pureAsh > 0) invHtml += `<span style="color:#fff; font-weight:bold;">純白の灰 x${PLAYER.inventory.pureAsh}</span><br>`; if (PLAYER.inventory.goddessTear > 0) invHtml += `<span style="color:#add8e6; font-weight:bold;">女神の涙 x${PLAYER.inventory.goddessTear}</span><br>`; if (PLAYER.inventory.sorrowWeight > 0) invHtml += `<span style="color:#a0f; font-weight:bold;">悲哀の重り x${PLAYER.inventory.sorrowWeight}</span><br>`; if (PLAYER.inventory.plank > 0) invHtml += `<span style="color:#dca;">木材の板 x${PLAYER.inventory.plank}</span><br>`; if (PLAYER.inventory.regenRing > 0) invHtml += `<span style="color:#8f8; font-weight:bold; border-bottom:1px solid #8f8;">◎ 再生の指輪 (HP自動回復)</span><br>`; 
    const fragCount = (PLAYER.items.fragments || []).length; if (fragCount > 0) invHtml += `<span style="color:#f66;">記憶の欠片: ${fragCount} / 4</span><br>`; 
    const invEl = document.getElementById("menu-inventory"); if (invEl) invEl.innerHTML = invHtml; 
}

function openEquipMenu(type) { 
    let choices = []; 
    if (type === "weapon") { 
        choices.push({ text: "古びた片手剣", action: () => setEquip("weapon", "古びた片手剣") }); 
        if (PLAYER.items.silverSword >= 1) choices.push({ text: "白銀騎士の古剣", action: () => setEquip("weapon", "白銀騎士の古剣") }); 
        if (PLAYER.items.silverSword >= 2) choices.push({ text: "強化された白銀騎士の古剣", action: () => setEquip("weapon", "強化された白銀騎士の古剣") }); 
        if (PLAYER.items.rustyGreatsword >= 1) choices.push({ text: "呪われた錆びた大剣", action: () => setEquip("weapon", "呪われた錆びた大剣") });
    } else if (type === "armor") { 
        choices.push({ text: "ボロボロの服", action: () => setEquip("armor", "ボロボロの服") }); 
        if (PLAYER.items.armor >= 1) choices.push({ text: "残響の防具", action: () => setEquip("armor", "残響の防具") }); 
        if (PLAYER.items.armor >= 2) choices.push({ text: "血染めの騎士鎧", action: () => setEquip("armor", "血染めの騎士鎧") }); 
        if (PLAYER.items.armor >= 3) choices.push({ text: "亡者の怨骸", action: () => setEquip("armor", "亡者の怨骸") });
    } 
    const invDiv = document.getElementById("menu-inventory"); if (!invDiv) return; 
    invDiv.innerHTML = `<div style="color:#f66; margin-bottom:10px; font-weight:bold;">装備する${type==="weapon"?"武器":"防具"}を選んでください</div>`; 
    choices.forEach(c => { const btn = document.createElement("button"); btn.className = "action-btn"; btn.style.width = "100%"; btn.style.marginBottom = "5px"; btn.innerText = c.text; btn.onclick = c.action; invDiv.appendChild(btn); }); 
}

function setEquip(type, name) { if(PLAYER.equipment) PLAYER.equipment[type] = name; updateMenuUI(); }

function openCrafting() { 
    if (isEventActive) return; checkFlagsIntegrity(); logMessage("【調律（錬成）】"); 
    let choices = [ { text: "1: 忘却ポーション(灰1/草1)", action: () => { if(PLAYER.inventory.ash>=1 && PLAYER.inventory.herb>=1){ PLAYER.inventory.ash--; PLAYER.inventory.herb--; PLAYER.items.potion++; logMessage("調律完了。"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }}, { text: "2: 共鳴灯(灰2/火1)", action: () => { if(PLAYER.inventory.ash>=2 && PLAYER.inventory.ember>=1){ PLAYER.inventory.ash-=2; PLAYER.inventory.ember--; PLAYER.items.lamp++; logMessage("調律完了。"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }} ]; 
    if (PLAYER.flags.lucasDefeated) { 
        choices.push({ text: "3: 回復薬[小](灰1)", action: () => { if(PLAYER.inventory.ash>=1){ PLAYER.inventory.ash--; PLAYER.items.potion++; logMessage("拡張調律完了。"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }}); 
        choices.push({ text: "4: 剣の強化(鉱石1/灰3)", action: () => { if(PLAYER.inventory.ore>=1 && PLAYER.inventory.ash>=3){ PLAYER.inventory.ore--; PLAYER.inventory.ash-=3; PLAYER.items.silverSword++; logMessage("剣が強化された！"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }}); 
        choices.push({ text: "5: 残響の防具(鉱石1/火1)", action: () => { if(PLAYER.inventory.ore>=1 && PLAYER.inventory.ember>=1){ PLAYER.inventory.ore--; PLAYER.inventory.ember--; PLAYER.items.armor++; logMessage("防具を作成した。"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }}); 
    } 
    if (PLAYER.inventory.bloodOre > 0 || PLAYER.items.armor === 2) { choices.push({ text: "6: 血染めの騎士鎧(血鉱1/灰5)", action: () => { if(PLAYER.inventory.bloodOre >= 1 && PLAYER.inventory.ash >= 5){ PLAYER.inventory.bloodOre--; PLAYER.inventory.ash -= 5; PLAYER.items.armor = 2; logMessage("禍々しい防具を作成した。"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }}); }
    if (PLAYER.inventory.pureAsh > 0) { choices.push({ text: "7: 純白の秘薬(白灰1/草1)", action: () => { if(PLAYER.inventory.pureAsh >= 1 && PLAYER.inventory.herb >= 1){ PLAYER.inventory.pureAsh--; PLAYER.inventory.herb--; PLAYER.maxHp += 50; PLAYER.hp = PLAYER.maxHp; logMessage("<span style='color:#add8e6; font-weight:bold;'>奇跡の薬を作成・使用した！<br>最大HPが50上昇し、耐久が完全に回復した！</span>"); showNext(endEvent); } else { logMessage("素材が足りない。"); showNext(endEvent); } }}); }
    choices.push({ text: "0: やめる", action: endEvent }); showChoices("レシピを選んでください", choices); 
}

function openSaveMenu() { const titleScreen = document.getElementById("title-screen"); if (titleScreen && titleScreen.style.display !== "none") { titleScreen.style.display = "none"; document.getElementById("game-container").style.display = "flex"; renderMap(); } isEventActive = true; logMessage("【記憶の石碑】"); const choices = [1, 2, 3, 4].map((s) => ({ text: `${s}: 記憶点 ${s}`, action: () => { showChoices(`スロット ${s} 操作`, [{ text: "1: 記録する (SAVE)", action: () => { localStorage.setItem(`RES_FINAL_1_5_${s}`, JSON.stringify(PLAYER)); logMessage("保存した。"); showNext(endEvent); }}, { text: "2: 呼び戻す (LOAD)", action: () => { const d = localStorage.getItem(`RES_FINAL_1_5_${s}`); if(d) { PLAYER = JSON.parse(d); checkFlagsIntegrity(); updateDarkness(PLAYER.currentScene.startsWith("1-4")); updateCurseUI(); renderMap(); logMessage("記憶を呼び戻した。"); showNext(endEvent); } else { showNext(endEvent); } }}, { text: "3: 戻る", action: openSaveMenu }]); }})); choices.push({ text: "5: 閉じる", action: endEvent }); showChoices("スロットを選択してください", choices); }
function usePotion() { if (isEventActive || PLAYER.items.potion <= 0 || PLAYER.hp >= PLAYER.maxHp) return; PLAYER.items.potion--; PLAYER.hp = Math.min(PLAYER.maxHp, PLAYER.hp + 40); logMessage("<span style='color:#add8e6;'>忘却のポーションを使用した。器の傷が癒えていく……（耐久+40）</span>"); showNext(endEvent); }

function handleHoleInteraction(x, y) { 
    if (!PLAYER.flags.needPlank) { PLAYER.flags.needPlank = true; logMessage("大きな穴があいている。橋代わりの「板」があれば……。"); showNext(endEvent); return; } 
    if (PLAYER.inventory.plank > 0) { isEventActive = true; showChoices("「板」を架けますか？", [ { text: "1: 架ける", action: () => { PLAYER.inventory.plank--; PLAYER.flags.plankPlaced1_3 = true; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("穴に板を架けて、道を作った！"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent } ]); } else { logMessage("渡るには「板」が必要だ。"); showNext(endEvent); } 
}

function triggerBadEnd(reason) { 
    isEventActive = true; document.getElementById("noise-overlay").classList.add("noise-anim"); document.body.style.filter = "grayscale(100%) brightness(0.4) sepia(1) hue-rotate(300deg)"; 
    setTimeout(() => { 
        document.getElementById("map-wrapper").style.opacity = "0"; 
        document.getElementById("dialogue-text").style.display = "none"; 
        document.getElementById("dialogue-name").innerText = ""; 
        const msgBox = document.getElementById("game-message"); msgBox.style.display = "block"; 
        
        let msg = reason === "queen" ? "身代わりの王妃を斬り伏せたレオン。<br>その罪の重さに耐えきれず、<br>自らもまた『残響』の一部となった……。" 
        : reason === "sewer" ? "大量の亡者の未練を一気に引き受けた結果、<br>器の許容量を遥かに超え、<br>レオンの自我は完全に崩壊した……。" 
        : reason === "curse" ? "呪われた大剣に命を吸い尽くされ、<br>名もなき残響の一部として<br>永遠に森を彷徨うことになった……。" 
        : reason === "thorn" ? "見えない血の茨に全身を貫かれ、<br>限界を迎えた器は砕け散った……。" 
        : reason === "steps" ? "歩数制限の呪いが限界を超え、<br>レオンの自我は虚無へと溶け込んだ……。" 
        : reason === "pit" ? "奈落の底へと落ちていったレオン。<br>器は砕け散り、その魂は<br>永遠の闇へと囚われた……。" 
        : "器は限界を迎え、砕け散った。<br>レオンの自我は虚無へと溶け込み、<br>二度と戻ることはなかった……。"; 
        
        msgBox.innerHTML = `<div style='text-align:center; padding:30px; color:#f44; font-size:1.2rem; line-height:2;'>【BAD END】<br><br>${msg}</div>`; 
        document.getElementById("dialogue-ui").style.display = "flex"; 
        document.getElementById("action-area").innerHTML = `<div class="action-btn" onclick="location.reload()" style="text-align:center; margin:0 auto;">タイトルへ戻る</div>`; 
    }, 1500); 
}

function handleChapter2Transition() { 
    logMessage("重い足取りで、城の外へ向かう……。"); 
    setTimeout(() => { document.getElementById("map-wrapper").style.opacity = "0"; document.getElementById("noise-overlay").classList.add("noise-anim"); setTimeout(() => { document.getElementById("game-container").style.background = "#ddd"; const msgBox = document.getElementById("game-message"); msgBox.style.display = "block"; msgBox.innerHTML = `<div style='text-align:center; padding:30px; font-size:1.3rem; color:#000; font-weight:bold; letter-spacing:3px;'>「この国は、答えを捨てる場所だった。」</div>`; document.getElementById("dialogue-ui").style.display = "flex"; setTimeout(() => { msgBox.innerHTML += `<div style='text-align:center; color:#f00; font-size:1.1rem; margin-top:20px;'>（激しい金属音と怒号が響き渡る……！）</div>`; setTimeout(() => { document.getElementById("game-container").style.background = "#050505"; logMessage("視界が開けると、そこはレオンのいた「未練の国」とは全く景色の違う、「鉄と血の匂いがする戦場（騎士国）」だった。"); showNext(() => { logMessage("そこには、返り血を浴びて立ち尽くす騎士カインの後ろ姿がある。"); showNext(() => { PLAYER.currentScene = "2-1"; PLAYER.x = 9; PLAYER.y = 15; renderMap(); logMessage("<span style='color:#add8e6; font-size:1.2rem;'>--- 第 2 章 開幕 ---</span>"); document.getElementById("map-wrapper").style.opacity = "1"; showNext(endEvent); }); }); }, 3000); }, 2500); }, 1500); }, 1000); 
}

function endEvent() { isEventActive = false; currentChoices = []; document.getElementById("action-area").innerHTML = ""; document.getElementById("game-message").innerHTML = ""; document.getElementById("dialogue-text").innerHTML = ""; hideTalk(); }

function renderMap() {
    const area = document.getElementById("visual-area"); area.innerHTML = "";
    const fog = document.getElementById("fog-overlay");
    if (fog && PLAYER.currentScene.startsWith("1-4")) {
        const px = (PLAYER.x * 5) + 2.5, py = (PLAYER.y * 5) + 2.5;
        fog.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,1) 40%)`;
    }

    MAPS[PLAYER.currentScene].forEach((row, y) => row.forEach((cell, x) => {
        const tile = document.createElement("div"); tile.className = "tile";
        if (cell === 0) tile.classList.add("tile-wall");
        if (cell === 9 || cell === 998) tile.classList.add("tile-hole");
        if (cell === 116) { if (isEmotionSightActive) { tile.innerText = "👣"; tile.style.color = "#f00"; tile.style.textShadow = "0 0 5px #f00"; tile.classList.add("tile-floor"); } else { tile.classList.add("tile-hole"); } }
        
        if (cell === 916) { 
            if (isEmotionSightActive) { 
                tile.innerText = "🕸"; 
                tile.style.color = "#f44"; 
                tile.style.textShadow = "0 0 5px #f44"; 
                tile.classList.add("tile-floor"); 
            } else { 
                tile.classList.add("tile-floor"); 
            } 
        }
        
        if (cell === 111) { if (isEmotionSightActive) { tile.innerText = "👣"; tile.style.color = "#a0f"; tile.style.textShadow = "0 0 5px #a0f"; } else { tile.classList.add("tile-wall"); } }
        if (cell === 915) { if (isEmotionSightActive) { tile.innerText = "👣"; tile.style.color = "#a0f"; tile.style.textShadow = "0 0 5px #a0f"; } else { tile.classList.add("tile-hole"); } }
        if (cell === 807) { if (isEmotionSightActive) { tile.innerText = "🚪"; tile.style.color = "#a0f"; } else { tile.classList.add("tile-wall"); } }
        if (cell === 809) { if (isEmotionSightActive) { tile.innerText = "👁️"; tile.style.color = "#f44"; } else { tile.classList.add("tile-wall"); } }
        if (cell === 911) { if (isEmotionSightActive) { tile.classList.add("tile-slash-warn"); } else { tile.classList.add("tile-floor"); } }
        if (cell === 912) tile.classList.add("tile-slash-active");

        if (x === PLAYER.x && y === PLAYER.y) { 
            tile.classList.add("player-tile"); 
            tile.style.position = "relative";
            tile.style.left = "0";
            tile.style.top = "0";
            tile.style.display = "flex";
            tile.style.alignItems = "center";
            tile.style.justifyContent = "center";
            
            if (isEmotionSightActive) {
                tile.innerText = "●";
                tile.style.color = "#ffffff"; 
                tile.style.textShadow = "0 0 15px #ffffff, 0 0 30px #add8e6";
                tile.style.fontSize = "calc(90vmin / 14)"; 
                tile.style.zIndex = "100";
            } else {
                tile.innerText = "●"; 
            }
        }
        else if (cell === 304 || cell === 602) tile.innerText = "🔽"; 
        else if (cell === 305 || cell === 601) tile.innerText = "🔼"; 
        else if (cell === 312) tile.innerText = "〓"; 
        else if (cell === 303 || cell === 106) { tile.innerText = "🔥"; tile.style.color = "#add8e6"; }
        else if (cell === 306) tile.innerText = "📚";
        else if (cell === 307 || cell === 203) { tile.innerText = "🪞"; if (PLAYER.res >= 60) tile.style.filter = "invert(1) sepia(1) saturate(5)"; }
        else if (cell === 308) tile.innerText = "⛩";
        else if (cell === 309) tile.innerText = "升";
        else if (cell === 311 || cell === 206 || cell === 401 || cell === 402 || cell === 403 || cell === 502) tile.innerText = "👤";
        else if (cell === 315 || cell === 117) tile.innerText = "⚖️"; 
        else if (cell === 404 || cell === 504 || cell === 414 || cell === 644 || cell === 701 || cell === 702 || cell === 801 || cell === 802 || cell === 803 || cell === 805 || cell === 316 || cell === 119) tile.innerText = "🚪";
        else if (cell === 817) { if (PLAYER.flags.fountainOpened) tile.innerText = "🕳️"; else { tile.innerText = "⛲"; tile.style.color = "#add8e6"; } }
        else if (cell === 804) tile.innerText = "🕳️";
        else if (cell === 405 || cell === 103 || cell === 503) tile.innerText = "🤺";
        else if (cell === 200 || cell === 501 || cell === 703 || cell === 704 || cell === 705 || cell === 112 || cell === 113 || cell === 808 || cell === 818) tile.innerText = "📦";
        else if (cell === 201) tile.innerText = "🧙‍♂️"; 
        else if (cell === 406) tile.innerText = "🧰"; 
        else if (cell === 205) tile.innerText = "🕯";
        else if (cell === 317) tile.innerText = "🕹️"; 
        else if (cell === 320 || cell === 118) tile.innerText = "🗿"; 
        else if (cell === 121) { tile.innerText = "💠"; tile.style.color = "#fff"; tile.style.textShadow = "0 0 5px #fff"; }
        else if (cell === 913) { tile.innerText = "💠"; tile.style.color = "#add8e6"; tile.style.textShadow = "0 0 5px #add8e6"; }
        else if (cell === 914) { tile.innerText = "🗡️"; tile.style.color = "#aaa"; }
        else if (cell === 411) tile.innerText = "🔴";
        else if (cell === 412) tile.innerText = "🔵";
        else if (cell === 413) tile.innerText = "🟢";
        else if (cell === 641) tile.innerText = "🗜️"; 
        else if (cell === 642) tile.innerText = "⚙️"; 
        else if (cell === 643) tile.innerText = "🗝️"; 
        else if (cell === 645) { tile.innerText = "♒"; tile.style.color = "#44f"; } 
        else if (cell === 600) tile.innerText = "🔼"; 
        else if (cell === 605) tile.innerText = "👑"; 
        else if (cell === 610) tile.innerText = "💎"; 
        else if (cell === 611) tile.innerText = "♜"; 
        else if (cell === 612) { if (isEmotionSightActive) { tile.innerText = "👣"; tile.style.color = "#a0f"; tile.style.textShadow = "0 0 5px #a0f"; } else { tile.innerText = ""; } }
        else if (cell === 620) tile.innerText = "🍽️"; 
        else if (cell === 623) tile.innerText = "🧱"; 
        else if (cell === 624) tile.innerText = "🍖"; 
        else if (cell === 625) tile.innerText = "🛏️"; 
        else if (cell === 626 || cell === 806) tile.innerText = "📖"; 
        else if (cell === 632) tile.innerText = "🚪"; 
        else if (cell === 633) tile.innerText = "💀"; 
        else if (cell === 635) tile.innerText = "🕳️"; 
        else if (cell === 640 || cell === 812) tile.innerText = "🪞"; 
        else if (cell === 999 && isBridgeVisible) { tile.innerText = "░"; tile.style.color = "#a0f"; }
        else if (cell === 101) tile.innerText = "✦";
        else if (cell === 102) tile.innerText = "👻";
        else if (cell === 114) tile.innerText = "🪦";
        else if (cell === 115) tile.innerText = "🕍";
        else if (cell === 811) tile.innerText = "🗡️";
        else if (cell === 813) tile.innerText = "❄️";
        else if (cell === 814) tile.innerText = "🧟";
        else if (cell === 815) tile.innerText = "🌀";
        else if (cell === 105) tile.innerText = "🛡️";
        else if (cell === 1000 || cell === 5 || cell === 407 || cell === 505) tile.innerText = "門";
        else if (cell !== 0 && cell !== 998 && cell !== 9 && cell !== 116 && cell !== 916) tile.classList.add("tile-floor"); 

        area.appendChild(tile);
    }));
}

function startAsh() { if(ashInterval) return; ashInterval = setInterval(() => { if(PLAYER.flags.timeStopped) return; const c = document.getElementById("ash-container"); if (!c) return; const a = document.createElement("div"); a.className = "ash"; a.style.left = Math.random() * 100 + "vw"; a.style.width = a.style.height = (Math.random()*4+2)+"px"; a.style.animationDuration = (Math.random()*3+3)+"s"; c.appendChild(a); setTimeout(() => a.remove(), 5000); }, 400); }
function startMetaEffects() { setInterval(() => { if (PLAYER.currentScene.startsWith("1-3") && !isEventActive && Math.random() < 0.05) { const whispers = ["ありがとう", "許さない", "重い", "……たすけて……", "器よ"]; const el = document.createElement("div"); el.className = "whisper-noise"; el.innerText = whispers[Math.floor(Math.random() * whispers.length)]; el.style.left = (Math.random() * 60 + 20) + "vw"; el.style.top = (Math.random() * 60 + 20) + "vh"; document.body.appendChild(el); setTimeout(() => el.remove(), 800); } }, 3000); }


// ==========================================
// 🌟 預かり所（倉庫）システム 🌟
// ==========================================
const ITEM_NAMES = {
    ash: "灰", herb: "草", ember: "火", ore: "鉱石",
    potion: "回復薬", lamp: "共鳴灯",
    plank: "木材の板", gearRed: "赤の歯車", gearGreen: "緑の歯車", gearBlue: "青の歯車",
    rustyValve: "錆びたバルブ", throneKey: "王座への鍵", pendant: "王妃のペンダント",
    castleKey2F: "地下牢の鍵", unknownFragment: "謎のかけら", bloodOre: "血濡れた鉱石",
    regenRing: "再生の指輪", pureAsh: "純白の灰", goddessTear: "女神の涙", sorrowWeight: "悲哀の重り"
};

function openStorageMenu() {
    isEventActive = true;
    showChoices("「預かり所ですね。どうしますか？」", [
        { text: "1: 預ける", action: () => openStorageSubMenu("deposit") },
        { text: "2: 引き出す", action: () => openStorageSubMenu("withdraw") },
        { text: "3: やめる", action: () => talk("zepp", "またどうぞ。", endEvent) }
    ]);
}

function openStorageSubMenu(mode) {
    if (!PLAYER.storage) PLAYER.storage = {}; 
    let choices = [];
    const categories = ["inventory", "items"];
    
    categories.forEach(cat => {
        let source = mode === "deposit" ? PLAYER[cat] : (PLAYER.storage[cat] || {});
        let dest = mode === "deposit" ? (PLAYER.storage[cat] = PLAYER.storage[cat] || {}) : PLAYER[cat];
        
        for (let key in source) {
            if (key === "fragments" || typeof source[key] !== "number") continue; 
            let amount = source[key];
            if (amount > 0 && ITEM_NAMES[key]) {
                choices.push({
                    text: `${ITEM_NAMES[key]} (${amount}個) を${mode === "deposit" ? "預ける" : "引き出す"}`,
                    action: () => {
                        source[key]--;
                        if (!dest[key]) dest[key] = 0;
                        dest[key]++;
                        logMessage(`<span style="color:#add8e6;">${ITEM_NAMES[key]} を1つ${mode === "deposit" ? "預けました" : "引き出しました"}。</span>`);
                        showNext(() => openStorageSubMenu(mode)); 
                    }
                });
            }
        }
    });

    choices.push({ text: "戻る", action: openStorageMenu });

    if (choices.length === 1) {
        showChoices("「対象のアイテムがありませんね。」", choices);
    } else {
        showChoices(`「どのアイテムを${mode === "deposit" ? "預けます" : "引き出します"}か？」`, choices);
    }
}
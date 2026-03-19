/**
 * RESONANCE - イベント処理 (ch1_events.js)
 */

function triggerEvent(cell, x, y) {
    isEventActive = true; let tempMsg = ""; 
    switch(cell) {
        case 105: logMessage("王城へ続く道だが、無数の衛兵の残響が壁のように立ち塞がっている。<br>今は強行突破できそうにない。左（西）の隠れ家の方へ迂回しよう。"); showNext(endEvent); break;
        case 304: handleStairsDown(x, y); break; case 305: handleStairsUp(x, y); break;
        case 316: logMessage("深く冷たい地下水脈の奥に、巨大な洞窟の入り口がある。"); setTimeout(() => { document.getElementById("map-wrapper").style.opacity = "0"; setTimeout(() => { document.getElementById("game-message").innerHTML = `<div style='text-align:center; padding:30px;'>洞窟の冷気が肌を刺す……。</div>`; setTimeout(() => { PLAYER.flags.reached1_4 = true; logMessage("【1-3 踏破：1-4 試練の洞窟へ】"); PLAYER.currentScene = "1-4-Entrance"; PLAYER.x = 9; PLAYER.y = 17; updateDarkness(true); document.getElementById("map-wrapper").style.opacity = "1"; showNext(() => { renderMap(); endEvent(); }); }, 2500); }, 1500); }, 1000); break;
        case 320: if (PLAYER.flags.leverAppeared) { logMessage("台座には『悲哀の重り』が沈み込んでいる。"); showNext(endEvent); } else if (PLAYER.inventory.sorrowWeight > 0) { logMessage("重厚な石の台座がある。上に何かを乗せるくぼみがある。"); showChoices("『悲哀の重り』を乗せますか？", [ { text: "1: 乗せる", action: () => { PLAYER.inventory.sorrowWeight--; PLAYER.flags.leverAppeared = true; MAPS["1-3-B2"][y][x+1] = 317; renderMap(); logMessage("<span style='color:#add8e6;'>ゴゴゴゴ……！</span><br>重りの代償によって隠し壁が開き、奥から『水門のレバー』が現れた！"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent } ]); } else { logMessage("重厚な石の台座がある。上に何か非常に重いものを乗せる必要がありそうだ。"); showNext(endEvent); } break;
        case 317: if (PLAYER.flags.waterDrained1_3) { logMessage("レバーは既に引かれている。"); showNext(endEvent); } else { showChoices("古びた水門のレバーがある。", [ { text: "1: 引く", action: () => { PLAYER.flags.waterDrained1_3 = true; for(let r=0; r<20; r++){ for(let c=0; c<20; c++){ if(MAPS["1-3-B3"][r][c] === 645) MAPS["1-3-B3"][r][c] = 1; } } renderMap(); logMessage("<span style='color:#add8e6;'>ゴゴゴゴ……！</span><br>どこか下の階で、大量の水が排水される音がした！"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent } ]); } break;
        case 801: if(PLAYER.flags.zeppDoorUnlocked) { PLAYER.currentScene = "1-2-House2"; PLAYER.x = 9; PLAYER.y = 10; logMessage("商館の中に入った。"); showNext(() => { renderMap(); endEvent(); }); } else { logMessage("重い扉だ。内側から鍵がかかっている。"); showNext(endEvent); } break;
        case 802: PLAYER.currentScene = "1-2-Guardhouse"; PLAYER.x = 9; PLAYER.y = 10; logMessage("衛兵の詰め所に入った。"); showNext(() => { renderMap(); endEvent(); }); break;
        case 803: PLAYER.currentScene = "1-2-MirrorHouse"; PLAYER.x = 9; PLAYER.y = 6; logMessage("不気味な静けさの家に入った。"); showNext(() => { renderMap(); endEvent(); }); break;
        case 817: if (PLAYER.flags.fountainOpened) { PLAYER.currentScene = "1-2-Sewer"; PLAYER.x = 9; PLAYER.y = 2; logMessage("水が引いた噴水の底から、地下水路へ降りた。"); showNext(() => { renderMap(); endEvent(); }); } else if (PLAYER.inventory.goddessTear > 0) { logMessage("噴水の女神像に、青い石がはまりそうなくぼみがある。"); showChoices("『女神の涙』をはめ込みますか？", [ { text: "1: はめ込む", action: () => { PLAYER.inventory.goddessTear--; PLAYER.flags.fountainOpened = true; renderMap(); logMessage("<span style='color:#add8e6;'>ゴゴゴゴ……！</span><br>女神像が動き、噴水の水が引いて隠し通路が現れた！"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent } ]); } else { logMessage("美しい噴水だ。女神像に何か丸いものをはめ込むくぼみがある。<br>底の方に通路らしきものが見えるが、水流が激しくて進めない。"); showNext(endEvent); } break;
        case 818: PLAYER.inventory.goddessTear++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6; font-weight:bold;'>古い木箱の中から、透き通った青い石『女神の涙』を見つけた！</span>"); showNext(endEvent); break;
        case 805: if (PLAYER.currentScene === "1-2-House2") { PLAYER.currentScene = "1-2-East"; PLAYER.x = 10; PLAYER.y = 8; } else if (PLAYER.currentScene === "1-2-Guardhouse") { PLAYER.currentScene = "1-2-North"; PLAYER.x = 10; PLAYER.y = 7; } else if (PLAYER.currentScene === "1-2-MirrorHouse") { PLAYER.currentScene = "1-2-West"; PLAYER.x = 7; PLAYER.y = 12; } else if (PLAYER.currentScene === "1-2-Sewer") { PLAYER.currentScene = "1-2"; PLAYER.x = 8; PLAYER.y = 9; } logMessage("外へ出た。"); showNext(() => { renderMap(); endEvent(); }); break;
        case 806: logMessage("<strong>【ゼップの日記】</strong><br>『忘れてはならない。私は……商人だ。何を売っていた？……いや、誰の未練を集めていた？』<br>文字が震えていて、後半は読めない。"); showNext(endEvent); break;
        case 807: MAPS["1-2-House2"][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6;'>壁に隠された仕掛けが動いた！</span>"); showNext(endEvent); break;
        case 808: PLAYER.items.potion += 3; PLAYER.inventory.ash += 10; MAPS["1-2-House2"][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6;'>「忘却のポーション」を3つ、「灰」を10個手に入れた！</span>"); showNext(endEvent); break;
        case 809: MAPS["1-2-Guardhouse"][5][9] = 1; MAPS["1-2-Guardhouse"][y][x] = 1; renderMap(); logMessage("<span style='color:#f44;'>血で描かれた手形に触れると、奥の壁が崩れ落ちた！</span>"); showNext(endEvent); break;
        case 811: PLAYER.items.rustyGreatsword = 1; MAPS["1-2-Guardhouse"][y][x] = 1; renderMap(); logMessage("<span style='color:#f44; font-weight:bold;'>禍々しい記憶が宿る『呪われた錆びた大剣』を手に入れた！</span><br>（装備すると歩くたびにHPが減る危険がある……）"); showNext(endEvent); break;
        case 812: if (PLAYER.res >= 50) { logMessage("<span style='color:#a0f; font-weight:bold;'>鏡の中の反転した世界に引きずり込まれる……！</span>"); showNext(() => { PLAYER.currentScene = "1-2-Mirror"; PLAYER.x = 9; PLAYER.y = 15; document.getElementById("map-wrapper").style.filter = "hue-rotate(180deg) invert(0.8)"; renderMap(); endEvent(); }); } else { logMessage("巨大な鏡だ。今の自分には、ただの自分の姿しか映っていない。"); showNext(endEvent); } break;
        case 813: PLAYER.inventory.pureAsh++; MAPS["1-2-Mirror"][y][x] = 1; renderMap(); logMessage("<span style='color:#fff; text-shadow:0 0 5px #fff; font-weight:bold;'>奇跡のような光を放つ『純白の灰』を手に入れた！</span>"); showNext(endEvent); break;
        case 815: logMessage("空間の歪みから、元の世界へ戻った。"); showNext(() => { PLAYER.currentScene = "1-2-West"; PLAYER.x = 9; PLAYER.y = 10; document.getElementById("map-wrapper").style.filter = "none"; renderMap(); endEvent(); }); break;
        case 814: talk("echo", "……タスケテ……ミズヲ……", () => { showChoices("無数の亡者が道を塞いでいる。", [{ text: "1: 鎮魂する (優しさ)", action: () => { logMessage("彼らの途方もない苦痛を、すべて引き受けた……。"); setTimeout(() => { triggerBadEnd("sewer"); }, 1500); }}, { text: "2: 切り捨てる (冷酷)", action: () => { PLAYER.items.armor = 3; PLAYER.inventory.ash += 15; MAPS["1-2-Sewer"][y][x] = 1; renderMap(); logMessage("<span style='color:#f44; font-weight:bold;'>亡者たちを無慈悲に斬り伏せた……。</span><br><span style='color:#add8e6;'>遺骸から『亡者の怨骸（防具）』と大量の灰を手に入れた！</span>"); showNext(endEvent); }} ]); }); break;
        case 114: { const dirNames = { north: "北", south: "南", west: "西" }; const hintText = PLAYER.flags.mazeCorrectSequence.map(d => dirNames[d]).join("、"); logMessage(`<span style='color:#f44;'>古い石碑に、血のような文字で刻まれている……</span><br>『${hintText}と進め。さもなくば永遠に彷徨う』`); showNext(endEvent); break; }
        case 115: if (PLAYER.inventory.regenRing === 0) { logMessage("忘れられた祭壇に、微かな光を放つ指輪が置かれている。"); showChoices("指輪を取りますか？", [{ text: "1: 取る", action: () => { PLAYER.inventory.regenRing = 1; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6; font-weight:bold;'>『再生の指輪』を手に入れた！</span><br>（持っているだけで、歩くたびに少しずつHPが自動回復する）"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); } else { logMessage("静かな祭壇だ。"); showNext(endEvent); } break;
        case 701: PLAYER.currentScene = "1-2-House1"; PLAYER.x = 9; PLAYER.y = 13; logMessage("廃屋の中に入った。"); showNext(() => { renderMap(); endEvent(); }); break;
        case 702: PLAYER.currentScene = "1-2-West"; PLAYER.x = 7; PLAYER.y = 7; logMessage("外へ出た。"); showNext(() => { renderMap(); endEvent(); }); break;
        case 703: PLAYER.inventory.ore++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6;'>木箱の中から「記憶の鉱石」を見つけた！</span>"); showNext(endEvent); break;
        case 704: PLAYER.inventory.herb++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("戸棚から「枯れた薬草」を見つけた！"); showNext(endEvent); break;
        case 705: PLAYER.inventory.ember++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#f66;'>暖炉の跡から「藍の残り火」を見つけた！</span>"); showNext(endEvent); break;
        case 112: logMessage("ひっそりと倒れている白骨死体がある。手には何か握りしめられている……。"); showChoices("探りますか？", [{ text: "1: 探る", action: () => { PLAYER.inventory.herb += 3; PLAYER.inventory.ash += 5; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6;'>「枯れた薬草」を3つと、「灰」を5つ手に入れた！</span>"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); break;
        case 113: PLAYER.inventory.bloodOre++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#f44; font-weight:bold;'>微かに赤く脈打つ不気味な鉱石を見つけた……！</span><br>『血濡れた記憶の鉱石』を手に入れた！"); showNext(endEvent); break;
        case 101: PLAYER.inventory.herb++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("「枯れた薬草」を見つけた。"); showNext(endEvent); break;
        case 102: showChoices("漂う残響が道を塞いでいる。", [{ text: "1: 話しかける", action: () => { talk("echo", "……キヲ……マモリ……タカッタ……", endEvent); }}, { text: "2: 攻撃して倒す", action: () => { PLAYER.inventory.ash++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("残響を打ち払った。"); showNext(endEvent); }}]); break;
        case 103: showChoices("負傷した兵士がうめいている。", [{ text: "1: 薬を与える", action: () => { if(PLAYER.items.potion > 0) { PLAYER.items.potion--; MAPS[PLAYER.currentScene][y][x]=1; MAPS["1-1-North"][2][9]=1000; renderMap(); logMessage("薬を与えると、兵士は静かに消え、遠くで重い門が開く音がした。"); showNext(endEvent); } else { talk("soldier", "……薬を……", endEvent); } }}, { text: "2: 温存", action: endEvent }]); break;
        case 5: logMessage("巨大な門が固く閉ざされている。周囲を探索して開ける方法を探そう。"); showNext(endEvent); break;
        case 1000: handleTransition(); break;
        case 200: logMessage("亡者が重い荷車（未練）を引いている。"); showChoices("どう扱うか？", [{ text: "1: 「鎮魂」する", action: () => performRequiem(x, y, 15) }, { text: "2: 「攻撃」する", action: () => { PLAYER.inventory.ash++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("切り捨てた。"); showNext(endEvent); }}]); break;
        case 201: talk("zepp", PLAYER.res >= 50 ? "ようこそ、器様。" : "お初にお目にかかります、王子。", () => { 
            let choices = [{ text: "1: 安らぎを乞う (灰5)", action: () => { if(PLAYER.inventory.ash >= 5) { PLAYER.inventory.ash -= 5; PLAYER.res = Math.max(0, PLAYER.res - 12); PLAYER.flags.zeppHealCount++; logMessage("少し楽になった。"); if(PLAYER.flags.zeppHealCount === 3 && !PLAYER.flags.zeppDoorUnlocked) { PLAYER.flags.zeppDoorUnlocked = true; setTimeout(() => logMessage("<span style='color:#a0f;'>ゼップは背後の商館の鍵を、こっそりと開けたようだ……。</span>"), 1000); } } else { logMessage("灰が足りない。"); } showNext(endEvent); }}];
            // 1-4に到達しているか、すでに1-4の石碑の呪いを受けたことがあるデータなら解放
            if (PLAYER.flags.reached1_4 || PLAYER.flags.curseSteps !== -1) { 
                choices.push({ text: "2: 預かり所を利用する", action: openStorageMenu });
            }
            choices.push({ text: (PLAYER.flags.reached1_4 || PLAYER.flags.curseSteps !== -1 ? "3" : "2") + ": 立ち去る", action: endEvent });
            showChoices("「何か入り用ですか？」", choices); 
        }); break;
        case 203: case 307: tempMsg = "鏡には王子レオンの姿が映っている。"; if (PLAYER.res >= 40 && PLAYER.res < 70) tempMsg = "鏡の中のレオンが、一瞬だけ『泥』のように崩れた気がした。"; if (PLAYER.res >= 70) tempMsg = "鏡には、返り血を浴びた見知らぬ男（カイン）が映っている……。"; logMessage(tempMsg); showNext(() => { if (PLAYER.res >= 70) { talk("leon", "……誰だ？ こいつは……なぜ、私と同じ動きを……？", endEvent); } else { endEvent(); } }); break;
        case 204: if(PLAYER.res >= 50) logMessage("街灯：『光を失うことは、別の色の世界への入り口だ。』"); else logMessage("文字は読めない。"); showNext(endEvent); break;
        case 205: if (PLAYER.items.lamp > 0) showChoices("灯を捧げますか？", [{ text: "1: 捧げる", action: () => { isBridgeVisible = true; PLAYER.items.lamp--; renderMap(); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); else { logMessage("灯火が必要だ。"); showNext(endEvent); } break;
        case 206: talk("echo", "西の壁の向こうに熱を感じます……", () => { if (!PLAYER.flags.heardEmberHint) { PLAYER.flags.heardEmberHint = true; MAPS["1-2"][9][4] = 1; } renderMap(); endEvent(); }); break;
        case 106: PLAYER.inventory.ember++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6; font-weight:bold;'>「藍の残り火」を手に入れた。</span>"); showNext(endEvent); break;
        case 301: logMessage("壁の傷跡。『鐘の音に耐えきれない。私は、私を捨てることにした。』"); showNext(endEvent); break;
        case 302: logMessage("食卓。パンの代わりに「灰」を食べていた形跡がある。"); showNext(endEvent); break;
        case 303: if (PLAYER.res >= 30) { PLAYER.items.fragments.push("拒絶"); MAPS["1-3-B1"][y][x] = 1; renderMap(); logMessage("**「拒絶の欠片」**を入手。"); showNext(endEvent); } else { showChoices("灰が熱い。手を入れる？", [{ text: "1: 無理に引く(HP-5)", action: () => { PLAYER.hp -= 5; if(PLAYER.hp<=0){ setTimeout(() => triggerBadEnd("dead"), 1000); return; } PLAYER.items.fragments.push("拒絶"); MAPS["1-3-B1"][y][x] = 1; renderMap(); logMessage("**「拒絶の欠片」**を入手。"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); } break;
        case 306: showChoices("影の手が紙を掴んでいる。", [{ text: "1: 攻撃", action: endEvent }, { text: "2: 近づく", action: () => { PLAYER.items.fragments.push("執着"); MAPS["1-3-B2"][y][x] = 1; renderMap(); logMessage("**「執着の欠片」**を入手。"); showNext(endEvent); }}]); break;
        case 308: if(PLAYER.items.fragments.length < 4) { logMessage(`祭壇には4つのくぼみがある。現在の欠片は ${PLAYER.items.fragments.length} 個だ。`); showNext(() => { showChoices("欠片が足りない……どうする？", [{ text: "1: 自分の血を代償にする (HP-30)", action: () => { PLAYER.hp -= 30; if(PLAYER.hp<=0){ setTimeout(() => triggerBadEnd("dead"), 1000); return; } PLAYER.flags.altarDone = true; logMessage("<span style='color:#f44; font-weight:bold;'>レオンは自らの血を祭壇に注ぎ込んだ！ (HP-30)</span><br>祭壇が禍々しい赤色に輝き、昇降機のロックが外れた。"); showNext(endEvent); }}, { text: "2: 引き返す", action: endEvent }]); }); } else { showChoices("4つの欠片が揃っている。儀式を行う？", [{ text: "1: 行う", action: () => { PLAYER.flags.altarDone = true; logMessage("祭壇が青く輝き、昇降機のロックが外れた。"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); } break;
        case 309: if(PLAYER.flags.altarDone) { logMessage("昇降機に乗り込んだ。"); setTimeout(() => { document.getElementById("map-wrapper").style.opacity = "0"; setTimeout(() => { PLAYER.currentScene = "1-3-B3"; PLAYER.x = 9; PLAYER.y = 2; document.getElementById("map-wrapper").style.opacity = "1"; renderMap(); endEvent(); }, 1500); }, 1000); } else { logMessage("祭壇での儀式を終えねば動力は入らない。"); showNext(endEvent); } break;
        case 310: logMessage("忘却の隠れ家。ガレキの中に、誰かが捨てた『記憶の残滓』が山積みになっている。"); showNext(() => { showChoices("ガレキの中を探りますか？", [{ text: "1: 探る (HP-5)", action: () => { PLAYER.hp -= 5; if(PLAYER.hp<=0){ setTimeout(() => triggerBadEnd("dead"), 1000); return; } const fragments = ["拒絶", "執着", "諦嘆", "空白"]; let missingFragment = fragments.find(f => !PLAYER.items.fragments.includes(f)); if (missingFragment) { PLAYER.items.fragments.push(missingFragment); logMessage(`鋭いガレキで手を切りながらも、<span style='color:#add8e6; font-weight:bold;'>『${missingFragment}の欠片』</span>を見つけ出した！`); } else { logMessage("すでに全ての欠片を持っているようだ。"); } showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); }); break;
        case 311: talk("echo", "鎮めてくれ……！", () => { showChoices("襲いかかってくる！", [{ text: "1: 鎮魂する", action: () => { performRequiem(x, y, 25, () => { PLAYER.items.fragments.push("空白"); MAPS["1-3-B2"][y][x] = 1; renderMap(); logMessage("**「空白の欠片」**を入手。"); showNext(endEvent); }); }}, { text: "2: 逃げる", action: endEvent }]); }); break;
        case 312: if(PLAYER.flags.needPlank){ PLAYER.inventory.plank++; MAPS[PLAYER.currentScene][y][x]=1; renderMap(); logMessage("「丈夫な板」を拾った！これで穴に架けられる。"); showNext(endEvent); } else { logMessage("ガレキに混じって板が落ちている。今は不要だ。"); showNext(endEvent); } break;
        case 315: logMessage("二つの残響が縋り付いている。一方は『子供を守りたい親』、もう一方は『親に会いたい子供』だ。<br>……救えるのは片方だけのようだ。"); showNext(() => { showChoices("どちらを鎮魂する？", [{ text: "1: 母親を鎮魂する", action: () => { performRequiem(x, y, 20, () => { PLAYER.inventory.sorrowWeight = 1; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); if(PLAYER.res >= 50) logMessage("取り残された子供の残響は、激しく呪う言葉を吐き出しながら結晶化した……。"); else logMessage("子供の残響は、絶望と共に重い結晶へと変わった……。"); logMessage("<span style='color:#a0f; font-weight:bold;'>『悲哀の重り』を手に入れた。</span>"); showNext(endEvent); }); }}, { text: "2: 子供を鎮魂する", action: () => { performRequiem(x, y, 20, () => { PLAYER.inventory.sorrowWeight = 1; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); if(PLAYER.res >= 50) logMessage("取り残された母親の残響は、血を流すような音を立てて絶叫し、結晶化した……。"); else logMessage("母親の残響は、絶望と共に重い結晶へと変わった……。"); logMessage("<span style='color:#a0f; font-weight:bold;'>『悲哀の重り』を手に入れた。</span>"); showNext(endEvent); }); }}, { text: "3: 立ち去る", action: endEvent }]); }); break;
        case 118: if (PLAYER.flags.curseSteps !== -1) { logMessage("石碑の文字はすでに消え去っている。"); showNext(endEvent); } else { PLAYER.flags.curseSteps = 60; MAPS["1-4-Entrance"][0][9] = 1; MAPS["1-4-Entrance"][0][10] = 1; renderMap(); updateCurseUI(); logMessage("<span style='color:#f44; font-weight:bold;'>『汝の命、あと60歩なり』</span><br>石碑を読んだ瞬間、強烈な呪いが身体に絡みついた！<br>（歩くたびに呪いが進行し、0になると大ダメージを受けます）"); document.getElementById("noise-overlay").classList.add("noise-anim"); setTimeout(() => { document.getElementById("noise-overlay").classList.remove("noise-anim"); showNext(endEvent); }, 1000); } break;
        case 119: logMessage("固く閉ざされた扉だ。手前の石碑を読まなければ開かないようだ。"); showNext(endEvent); break;
        case 120: if (PLAYER.flags.curseSteps > 0) { PLAYER.flags.curseSteps = -1; updateCurseUI(); logMessage("<span style='color:#add8e6; font-weight:bold;'>最深部の澄んだ空気に触れ、歩数制限の呪いが解けた……！</span>"); showNext(endEvent); } else { endEvent(); } break;
        case 121: if (PLAYER.flags.curseSteps > 0) { PLAYER.flags.curseSteps += 20; updateCurseUI(); MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#fff; font-weight:bold;'>『浄化の灰』を拾った！<br>呪いの進行が20歩分遅れた！</span>"); showNext(endEvent); } else { MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("『浄化の灰』を拾った。（呪いがかかっていないため何も起きない）"); showNext(endEvent); } break;
        case 122: logMessage("目の前は真っ暗な奈落だ……『Rキー（残響視）』を使わなければ、一歩先すら見えない。<br><span style='color:#a0f;'>（※Rキーを押している間だけ、過去の残響「血の足跡」が浮かび上がります）</span>"); MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); showNext(endEvent); break;
        case 117: if (PLAYER.flags.scaleSacrifice !== "") { logMessage("天秤は既に傾いている。"); showNext(endEvent); break; } logMessage("巨大な『罪の天秤』が道を塞いでいる。<br>奥の扉を開くには、何か『大切なもの』を捧げなければならない。"); showChoices("何を天秤に乗せる？", [ { text: "1: 最大HPを半減させる", action: () => { PLAYER.maxHp = Math.floor(PLAYER.maxHp / 2); if (PLAYER.hp > PLAYER.maxHp) PLAYER.hp = PLAYER.maxHp; PLAYER.flags.scaleSacrifice = "hp"; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#f44;'>自らの生命力を切り取り、天秤に乗せた……！<br>（最大HPが半減した）</span>"); showNext(endEvent); }}, { text: "2: 全ての『回復薬』を捨てる", action: () => { if (PLAYER.items.potion > 0) { PLAYER.items.potion = 0; PLAYER.flags.scaleSacrifice = "potion"; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#a0f;'>全ての回復薬を天秤に乗せ、灰に変えた……！</span>"); showNext(endEvent); } else { logMessage("捧げる回復薬を持っていない！"); showNext(endEvent); } }}, { text: "3: 記憶の欠片を1つ砕く", action: () => { if (PLAYER.items.fragments.length > 0) { const lost = PLAYER.items.fragments.pop(); PLAYER.flags.scaleSacrifice = "fragment"; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage(`<span style='color:#ccc;'>『${lost}の欠片』を天秤に乗せ、永遠に砕き去った……！</span>`); showNext(endEvent); } else { logMessage("捧げる記憶の欠片を持っていない！"); showNext(endEvent); } }}, { text: "4: やめる", action: endEvent } ]); break;
        case 913: let cColor = "red"; if (x > 10) cColor = "blue"; if (y > 15) cColor = "green"; const cNames = { red: "<span style='color:#f66;'>赤</span>", blue: "<span style='color:#add8e6;'>青</span>", green: "<span style='color:#8f8;'>緑</span>" }; if (cColor === "red") { logMessage(`禍々しい結晶の中に、${cNames[cColor]}の歯車が封印されている……。<br>（ひどく血の匂いがする。生半可な傷では引き抜けそうにない）`); showChoices("引き抜きますか？", [ { text: "1: 引き抜く", action: () => { if (PLAYER.hp <= 20) { logMessage("<span style='color:#f44; font-weight:bold;'>瀕死の血が結晶と共鳴し、封印が解けた！</span>"); giveGear("red", x, y); } else { PLAYER.hp -= 10; logMessage("<span style='color:#f44;'>血が足りない……！結晶に拒絶され弾き飛ばされた！（HP-10）</span>"); if (PLAYER.hp <= 0) { setTimeout(() => triggerBadEnd("dead"), 1000); } else { showNext(endEvent); renderMap(); updateMenuUI(); } } }}, { text: "2: やめる", action: endEvent } ]); } else if (cColor === "blue") { if (PLAYER.res >= 50 || isEmotionSightActive) { logMessage(`深い海の底のような結晶の中に、${cNames[cColor]}の歯車が封印されている……。<br>（共鳴度が高い、または残響視を使っているため存在を認識できた）`); showChoices("どうやって手に入れる？", [ { text: "1: 守護者と戦う", action: () => { talk("echo", "……フカキ……ウミヘ……", () => { const dmg = Math.floor(Math.random() * 10) + 15; PLAYER.hp -= dmg; if (PLAYER.hp <= 0) { logMessage(`<span style='color:#f44;'>激しい戦闘の末、守護者を打ち倒した！ (耐久-${dmg})</span>`); setTimeout(() => triggerBadEnd("dead"), 1000); return; } logMessage(`<span style='color:#f44;'>激しい戦闘の末、守護者を打ち倒した！ (耐久-${dmg})</span>`); giveGear("blue", x, y); }); }}, { text: "2: 立ち去る", action: endEvent } ]); } else { logMessage("ただの空間に見えるが、何かがそこにあるような気がする……。（今の共鳴度では認識できない）"); showNext(endEvent); } } else { logMessage(`苔生した結晶の中に、${cNames[cColor]}の歯車が封印されている……。`); showChoices("引き抜きますか？", [ { text: "1: 力ずくで引き抜く (HP-20)", action: () => { PLAYER.hp -= 20; if (PLAYER.hp <= 0) { logMessage("<span style='color:#f44; font-weight:bold;'>無理やり引き抜いた！ (HP-20)</span>"); setTimeout(() => triggerBadEnd("dead"), 1000); return; } logMessage("<span style='color:#f44; font-weight:bold;'>無理やり引き抜いた！ (HP-20)</span>"); giveGear("green", x, y); }}, { text: "2: やめる", action: endEvent } ]); } break;
        case 401: logMessage("幻影：『……扉を開く最初は、血のように赤い記憶……』"); showNext(endEvent); break;
        case 402: logMessage("幻影：『……最後は、深海のように青い記憶……』"); showNext(endEvent); break;
        case 403: logMessage("幻影：『……真ん中には、森のように緑の記憶……』"); showNext(endEvent); break;
        case 405: handleLucasBattle(); break;
        case 406: 
            PLAYER.inventory.pureAsh++; 
            MAPS[PLAYER.currentScene][y][x] = 1; // 宝箱を消して道を開ける
            renderMap(); 
            logMessage("<span style='color:#fff; font-weight:bold;'>宝箱から『純白の灰』を手に入れた！</span>"); 
            showNext(endEvent); 
            break;
        case 407: 
            PLAYER.currentScene = "1-5"; 
            PLAYER.x = 9; 
            PLAYER.y = 18; 
            updateDarkness(false); 
            renderMap(); 
            logMessage("巨大な門を抜け、さらなる深部へ足を踏み入れた……。<br>【1-4 試練の洞窟 踏破】"); 
            showNext(endEvent); 
            break;
        case 414: handleGearDoor(x, y); break;
        case 914: handleSwordMemorial(x, y); break;
        case 501: logMessage("木箱だ。"); showNext(endEvent); break;
        case 502: logMessage("過去の亡霊が彷徨っている……"); showNext(endEvent); break;
        case 503: if (PLAYER.flags.gatekeeperDefeated) { MAPS["1-5"][y][x] = 1; renderMap(); endEvent(); return; } talk("echo", "ガアアアァッ！！", () => { showChoices("未練の集積体（門番）が立ち塞がっている。", [{ text: "1: 立ち向かう", action: () => { PLAYER.hp -= 15; let lostItem = ""; if (PLAYER.items.potion > 0 && Math.random() < 0.5) { PLAYER.items.potion--; PLAYER.inventory.ash++; lostItem = "懐のポーションが灰に変わってしまった！"; } else if (PLAYER.inventory.herb > 0) { PLAYER.inventory.herb--; PLAYER.inventory.ash++; lostItem = "薬草が灰に変わってしまった！"; } if(PLAYER.hp<=0){ logMessage(`激しい攻撃を受けた！ 耐久-15。${lostItem}`); setTimeout(() => triggerBadEnd("dead"), 1000); return; } logMessage(`激しい攻撃を受けた！ 耐久-15。${lostItem}`); showNext(() => { showChoices("さらに追撃する！", [{ text: "1: 剣を振り下ろす", action: () => { PLAYER.flags.gatekeeperDefeated = true; PLAYER.items.fragments.push("最後"); MAPS["1-5"][y][x] = 1; renderMap(); logMessage("門番の核を砕いた！<br><span style='color:#add8e6;'>『最後の記憶の欠片』を入手した。</span>"); showNext(endEvent); }}]); }); }}, { text: "2: 一旦引く", action: endEvent }]); }); break;
        case 504: logMessage("門番の部屋の出口だ。"); showNext(endEvent); break;
        case 505: PLAYER.currentScene = "1-6-F1"; PLAYER.x = 9; PLAYER.y = 17; updateDarkness(false); renderMap(); logMessage("【1-5 踏破】 重い扉を押し開け、王都の中枢へ足を踏み入れた。"); showNext(endEvent); break;
        case 600: logMessage("王都の入り口だ。もう後戻りはできない。"); showNext(endEvent); break;
        case 601: handleStairsUp(x, y); break;
        case 602: handleStairsDown(x, y); break;
        case 605: talk("queen", "……どうか、本当の彼を……止めて……", () => { showChoices("身代わりの王妃の残響が、悲しげにこちらを見つめている。", [{ text: "1: 鎮魂する", action: () => { performRequiem(x, y, 30, () => { logMessage("王妃が灰となって崩れ去り、王座の間には静寂が訪れる。"); showNext(() => { logMessage("しかし、その静寂を切り裂くように、街中に設置された「鐘」が一斉に鳴り始める。<br>それはこれまで聴いたどの鐘よりも、機械的で、無機質な音。"); showNext(() => { logMessage("鳴り止まない鐘の音の中、レオンは自分の両手を見つめる。そこには膨大な「灰」が渦巻いているが、その色は王国の色とは似ても似つかない。"); showNext(() => { talk("leon", "……おかしい。これだけの重み、これだけの苦しみ……。鎮めても、鎮めても、私の心は少しも軽くならない。", () => { logMessage("（レオンの瞳に、自分のものではない「別の国の戦場」や「見知らぬ騎士の叫び」がノイズとして一瞬映り込む）"); showNext(() => { talk("leon", "……わかったぞ。この身に宿った未練は……『俺たち（この国の人間）』のものではなかったんだ。", () => { const condMet = (PLAYER.items.fragments.length >= 3 && PLAYER.items.silverSword >= 1 && PLAYER.res >= 25 && PLAYER.res <= 75); if (condMet) { MAPS["1-6-F3"][0][9] = 635; renderMap(); logMessage("王妃が消滅した後の静寂の中、王座の後ろの壁が「未練の消失」によって崩れ、隠し部屋への道が開いた。"); showNext(endEvent); } else { logMessage("レオンは崩れゆく玉座を振り返ることもなく、重い足取りで歩き始めた。"); showNext(() => { handleChapter2Transition(); }); } }); }); }); }); }); }); }); }}, { text: "2: 攻撃する", action: () => { talk("queen", "ああ……やはり貴方も、狂気に呑まれて……", () => { triggerBadEnd("queen"); }); }}]); }); break; 
        case 610: handleMemoryItem(x, y); break;
        case 611: handlePedestal(); break;
        case 612: logMessage("微かな残響が漂っている……「Rキー」で視えそうだ。"); showNext(endEvent); break;
        case 620: tempMsg = "立派な晩餐テーブルだ。埃がかぶっている。"; if (PLAYER.equipment.weapon.includes("白銀騎士の古剣")) { tempMsg += "<br><br><span style='color:#add8e6;'>（……そうだ。ここで私は、騎士団の仲間と祝杯を挙げた。あの日までは。）</span><br><span style='color:#aaa; font-size:0.8rem;'>※剣の記憶が流れ込んでいる……</span>"; } logMessage(tempMsg); showNext(endEvent); break;
        case 623: if (PLAYER.flags.b1StairsRevealed) { logMessage("かまどの奥の隠しレバーは既に引かれている。"); showNext(endEvent); } else { showChoices("かまどの中に、不自然な隙間がある。", [{ text: "1: 手を入れてみる", action: () => { PLAYER.flags.b1StairsRevealed = true; MAPS["1-6-F1"][2][2] = 602; renderMap(); logMessage("<span style='color:#f44; font-weight:bold;'>ガコンッ！</span><br>遠くで重い石が動く音がした！ホールの左上に『地下へ続く階段』が現れた！"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); } break;
        case 624: logMessage("カチカチになった食材の山だ。"); showNext(endEvent); break;
        case 625: tempMsg = "使用人のベッドだ。綺麗に整えられている。"; if (PLAYER.equipment.weapon.includes("白銀騎士の古剣")) { tempMsg += "<br><br><span style='color:#add8e6;'>（……カイン、お前はいつもここで剣の手入れをしていたな……）</span>"; } logMessage(tempMsg); showNext(endEvent); break;
        case 626: logMessage("<strong>【古い日記】</strong><br>『地下牢からうめき声が聞こえる。衛兵が鍵を持ったまま閉じ込められたらしい。』<br>『地下へ続く階段は、キッチンの「かまど」の奥のレバーで開くようになっている。』"); showNext(endEvent); break;
        case 632: if (PLAYER.inventory.castleKey2F > 0) { PLAYER.inventory.castleKey2F--; MAPS["1-6-F2"][y][x] = 1; renderMap(); logMessage("『地下牢の鍵』を使って、2階の大きな扉を開けた！"); showNext(endEvent); } else { logMessage("巨大な扉が閉ざされている。鍵穴には王家の紋章がある……。<br>（どこかの『地下牢』に鍵を持つ者がいるかもしれない）"); showNext(endEvent); } break;
        case 633: talk("skeleton", "うぅ……私は王家を裏切ってなどいない……！", () => { showChoices("残響が強く鍵を握りしめ、震えている。", [{ text: "1: 「私がレオンだ」と告げる", action: () => { talk("skeleton", "おお……レオン王子……！ご無事でしたか……！", () => { PLAYER.inventory.castleKey2F = 1; MAPS["1-6-B1"][y][x] = 1; renderMap(); logMessage("残響は安堵したようにスッと消え、後に鍵が残された。<br><span style='color:#a0f; font-weight:bold;'>『地下牢の鍵（2階扉用）』を入手した！</span>"); showNext(endEvent); }); }}, { text: "2: 無理やり奪う (HP-10)", action: () => { PLAYER.hp -= 10; if(PLAYER.hp<=0){ logMessage("<span style='color:#f44;'>残響は激しく抵抗した！ (HP-10)</span>"); setTimeout(() => triggerBadEnd("dead"), 1000); return; } PLAYER.inventory.castleKey2F = 1; MAPS["1-6-B1"][y][x] = 1; renderMap(); logMessage("<span style='color:#f44;'>残響は激しく抵抗した！ (HP-10)</span><br>無理やり鍵を奪い取った……。<br><span style='color:#a0f; font-weight:bold;'>『地下牢の鍵（2階扉用）』を入手した！</span>"); showNext(endEvent); }}, { text: "3: 立ち去る", action: endEvent }]); }); break;
        case 635: logMessage("王座の奥の隠し部屋へ足を踏み入れた。"); showNext(() => { PLAYER.currentScene = "1-6-Hidden"; PLAYER.x = 9; PLAYER.y = 9; logMessage("画面からBGMが消え、レオンの荒い呼吸音と足音だけが響く。"); showNext(() => { renderMap(); endEvent(); }); }); break;
        case 640: logMessage("部屋の中央には、かつて王妃が大切にしていたであろう、大きな「姿見（鏡）」が一つ置かれている。"); showNext(() => { logMessage("レオンが鏡の前に立ったとき、鏡の中に映っているのは「王子レオン」の姿ではなかった。"); showNext(() => { logMessage("ボロボロの布を纏った、顔のない空っぽの器——。"); showNext(() => { logMessage("レオンが頭を触れば、鏡の中の「彼」も同じ動きをする。しかし、姿は明らかに別人だ。"); showNext(() => { talk("leon", "……これは、誰だ？ 私の手は、私の顔は……どこへ行った？", () => { logMessage("鏡に触れると、水面のように波紋が広がり、レオンの指が鏡の中に沈み込んでいく……！"); showNext(() => { logMessage("鏡の中の「自分ではない自分」が、手のひらを差し出した。そこには、結晶化した「青い灰」が握られている。"); showNext(() => { PLAYER.inventory.unknownFragment = 1; MAPS["1-6-Hidden"][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6; font-weight:bold;'>『？？？の記憶のかけら』を入手した！</span>"); showNext(() => { logMessage("取得した瞬間、レオンの脳内に直接「この世界の設計図」のような幾何学的なイメージが流れ込み、激しい頭痛と共に倒れ込む。"); showNext(() => { talk("leon", "……わかったぞ。この身に宿った未練は……『俺たち』のものではなかったんだ。そして……この体さえも、私のものではないのかもしれない。", () => { logMessage("かけらを手にしたレオンは、激しい混乱と確信を抱きながら、城の外の「灰の奔流」へ歩き出した。"); showNext(() => { handleChapter2Transition(); }); }); }); }); }); }); }); }); }); }); }); break;
        case 641: PLAYER.inventory.rustyValve++; MAPS["1-6-F1"][y][x] = 1; renderMap(); logMessage("<span style='color:#ccc; font-weight:bold;'>『錆びたバルブ』</span>が落ちている。何かの装置に使えそうだ。"); showNext(endEvent); break;
        case 642: if (PLAYER.flags.valveOpened) { logMessage("バルブは既に回されている。地下から水が引く音が聞こえる。"); showNext(endEvent); } else if (PLAYER.inventory.rustyValve > 0) { showChoices("台座に『錆びたバルブ』を取り付けて回しますか？", [{ text: "1: 回す", action: () => { PLAYER.inventory.rustyValve--; PLAYER.flags.valveOpened = true; for(let r=0; r<20; r++){ for(let c=0; c<20; c++){ if(MAPS["1-6-B1"][r][c] === 645) MAPS["1-6-B1"][r][c] = 1; } } renderMap(); logMessage("<span style='color:#add8e6;'>ゴゴゴゴ……！</span><br>どこか下の階で、大量の水が引いていく音がした！"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent }]); } else { logMessage("何かを差し込んで回す装置のようだ。"); showNext(endEvent); } break;
        case 643: PLAYER.inventory.throneKey++; MAPS["1-6-B1"][y][x] = 1; renderMap(); logMessage("<span style='color:#a0f; font-weight:bold;'>『王座の間への鍵』</span>を見つけた！これで最上階の奥へ進める。"); showNext(endEvent); break;
        case 644: if (PLAYER.inventory.throneKey > 0) { PLAYER.inventory.throneKey--; MAPS["1-6-F3"][y][x] = 1; renderMap(); logMessage("『王座の間への鍵』を使って、重厚な扉を開けた。"); showNext(endEvent); } else { logMessage("王家の紋章が刻まれた扉だ。固く閉ざされている。"); showNext(endEvent); } break;
        default: endEvent(); break;
    }
}

function handleStairsUp(x, y) { 
    if (PLAYER.currentScene === "1-6-B1") { PLAYER.currentScene = "1-6-F1"; PLAYER.x = x; PLAYER.y = y; } 
    else if (PLAYER.currentScene === "1-6-F1") { PLAYER.currentScene = "1-6-F2"; PLAYER.x = x; PLAYER.y = y; } 
    else if (PLAYER.currentScene === "1-6-F2") { PLAYER.currentScene = "1-6-F3"; PLAYER.x = x; PLAYER.y = y; } 
    else if (PLAYER.currentScene === "1-3-B1") { PLAYER.currentScene = "1-3-F1"; PLAYER.x = 4; PLAYER.y = 4; }
    else if (PLAYER.currentScene === "1-3-B2") { PLAYER.currentScene = "1-3-B1"; PLAYER.x = 2; PLAYER.y = 2; }
    renderMap(); logMessage("階段を上った。"); showNext(endEvent); 
}

function handleStairsDown(x, y) { 
    if (PLAYER.currentScene === "1-6-F3") { PLAYER.currentScene = "1-6-F2"; PLAYER.x = x; PLAYER.y = y; } 
    else if (PLAYER.currentScene === "1-6-F2") { PLAYER.currentScene = "1-6-F1"; PLAYER.x = x; PLAYER.y = y; } 
    else if (PLAYER.currentScene === "1-6-F1") { PLAYER.currentScene = "1-6-B1"; PLAYER.x = x; PLAYER.y = y; } 
    else if (PLAYER.currentScene === "1-3-F1") { PLAYER.currentScene = "1-3-B1"; PLAYER.x = 12; PLAYER.y = 2; }
    else if (PLAYER.currentScene === "1-3-B1") { PLAYER.currentScene = "1-3-B2"; PLAYER.x = 9; PLAYER.y = 9; }
    renderMap(); logMessage("階段を下りた。"); showNext(endEvent); 
}

function handleGearDoor(x, y) {
    if (PLAYER.flags.gearSequence.length === 0) { logMessage("巨大な扉に、3つの歯車をはめ込むくぼみがある。"); } else { logMessage(`現在 ${PLAYER.flags.gearSequence.length} つの歯車をはめ込んでいる……。`); }
    showNext(() => {
        let choices = [];
        if (PLAYER.inventory.gearRed > 0 && !PLAYER.flags.gearSequence.includes("red")) choices.push({ text: "赤の歯車をはめる", action: () => insertGear("red", x, y) });
        if (PLAYER.inventory.gearGreen > 0 && !PLAYER.flags.gearSequence.includes("green")) choices.push({ text: "緑の歯車をはめる", action: () => insertGear("green", x, y) });
        if (PLAYER.inventory.gearBlue > 0 && !PLAYER.flags.gearSequence.includes("blue")) choices.push({ text: "青の歯車をはめる", action: () => insertGear("blue", x, y) });
        choices.push({ text: "やめる", action: endEvent });
        if (choices.length > 1) { showChoices("どれをはめ込む？", choices); } else { logMessage("しかし、はめ込める歯車を持っていないようだ。"); showNext(endEvent); }
    });
}

function insertGear(color, x, y) {
    PLAYER.flags.gearSequence.push(color);
    if(color === "red") { PLAYER.inventory.gearRed--; logMessage("赤の歯車をはめ込んだ。カチッと音がした。"); }
    if(color === "green") { PLAYER.inventory.gearGreen--; logMessage("緑の歯車をはめ込んだ。カチッと音がした。"); }
    if(color === "blue") { PLAYER.inventory.gearBlue--; logMessage("青の歯車をはめ込んだ。カチッと音がした。"); }
    if (PLAYER.flags.gearSequence.length === 3) {
        if (PLAYER.flags.gearSequence[0] === "red" && PLAYER.flags.gearSequence[1] === "green" && PLAYER.flags.gearSequence[2] === "blue") {
            showNext(() => { MAPS["1-4-Depths"][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6; font-weight:bold;'>ゴゴゴゴゴ……！</span><br>仕掛けが解け、巨大な扉がゆっくりと開いた！"); showNext(endEvent); });
        } else {
            showNext(() => {
                PLAYER.hp -= 20; 
                if (PLAYER.hp <= 0) { logMessage("<span style='color:#f44; font-weight:bold;'>ガキンッ！</span><br>順番が間違っていた！仕掛けから電撃が走り、はめた歯車が弾き飛ばされた！（HP-20）"); setTimeout(() => triggerBadEnd("dead"), 1000); return; }
                logMessage("<span style='color:#f44; font-weight:bold;'>ガキンッ！</span><br>順番が間違っていた！仕掛けから電撃が走り、はめた歯車が弾き飛ばされた！（HP-20）");
                PLAYER.flags.gearSequence.forEach(c => { if(c === "red") PLAYER.inventory.gearRed++; if(c === "green") PLAYER.inventory.gearGreen++; if(c === "blue") PLAYER.inventory.gearBlue++; });
                PLAYER.flags.gearSequence = []; showNext(endEvent);
            });
        }
    } else { showNext(() => handleGearDoor(x, y)); }
}

function giveGear(color, x, y) {
    if(color === "red") PLAYER.inventory.gearRed++; if(color === "blue") PLAYER.inventory.gearBlue++; if(color === "green") PLAYER.inventory.gearGreen++;
    MAPS["1-4-Depths"][y][x] = 1; renderMap();
    showNext(() => { logMessage(`<span style='color:#add8e6; font-weight:bold;'>『${color==="red"?"赤":(color==="blue"?"青":"緑")}の記憶の歯車』を手に入れた！</span>`); showNext(endEvent); });
}

function handleSwordMemorial(x, y) {
    logMessage("無数に突き刺さった折れた剣の一つだ。かつてルーカスに挑んだ騎士の墓標だろうか。");
    showChoices("剣に触れますか？", [
        { text: "1: 触れる", action: () => {
            const r = Math.random();
            if (r < 0.3) { MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#aaa;'>……静かだ。何も感じない。</span>"); showNext(endEvent); } 
            else if (r < 0.6) { PLAYER.inventory.herb++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6;'>剣の柄に、誰かが遺した「枯れた薬草」が結わえられていた。</span>"); showNext(endEvent); } 
            else if (r < 0.8) { PLAYER.items.potion++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#f66;'>白骨死体が「忘却のポーション」を握りしめていた。</span>"); showNext(endEvent); } 
            else {
                talk("echo", "……貴様モ……灰トナレ……！", () => {
                    const dmg = Math.floor(Math.random() * 5) + 5; PLAYER.hp -= dmg;
                    if (PLAYER.hp <= 0) { logMessage(`<span style='color:#f44;'>剣に宿っていた怨念が襲いかかってきた！ (耐久-${dmg})</span>`); setTimeout(() => triggerBadEnd("dead"), 1000); return; }
                    MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage(`<span style='color:#f44;'>剣に宿っていた怨念が襲いかかってきた！ (耐久-${dmg})</span>`); showNext(endEvent);
                });
            }
        }}, { text: "2: やめる", action: endEvent }
    ]);
}

function handleLucasBattle() { 
    if (PLAYER.flags.lucasDefeated) { logMessage("ルーカスは既に鎮められている。"); showNext(endEvent); return; }
    if (PLAYER.flags.lucasPhase === 0) {
        talk("lucas", "……通さぬ。何人たりとも……", () => {
            logMessage("<span style='color:#aaa;'>（ルーカスの記憶が微かに漏れ出ている……）</span>");
            showChoices("白銀騎士が立ちはだかる！どうする？", [ { text: "1: 剣を交えて倒す (力で突破)", action: () => { PLAYER.flags.lucasPhase = 1; triggerEvent(405, PLAYER.x, PLAYER.y); } }, { text: "2: 記憶に触れて鎮魂する (真実の鍵)", action: () => { PLAYER.flags.lucasPhase = 10; triggerEvent(405, PLAYER.x, PLAYER.y); } } ]);
        });
    } else if (PLAYER.flags.lucasPhase === 1) { 
        document.body.style.filter = "grayscale(100%) brightness(1.5)"; logMessage("<strong>【激しい戦闘のフラッシュバック】</strong>");
        setTimeout(() => { document.body.style.filter = `grayscale(${Math.min(PLAYER.res, 100)}%)`; showChoices("さらに剣を打ち込む！", [{ text: "1: 踏み込む", action: () => { PLAYER.flags.lucasPhase = 2; triggerEvent(405, PLAYER.x, PLAYER.y); } }]); }, 1500);
    } else if (PLAYER.flags.lucasPhase === 2) { 
        PLAYER.flags.lucasDefeated = true; MAPS[PLAYER.currentScene][PLAYER.y][PLAYER.x] = 1; renderMap(); logMessage("激しい斬り合いの末、ルーカスの影は霧散した……。"); showNext(endEvent);
    } else if (PLAYER.flags.lucasPhase === 10) { 
        document.body.style.filter = "grayscale(100%) brightness(1.5)"; logMessage("<strong>【失われた記憶がフラッシュバックする】</strong>");
        setTimeout(() => { document.body.style.filter = `grayscale(${Math.min(PLAYER.res, 100)}%)`; logMessage("レオンの脳内に、かつてルーカスと交わした誓いの記憶が流れ込んでくる……。"); showNext(() => { showChoices("ルーカスの魂に触れる", [{ text: "1: 記憶を受け入れる", action: () => { PLAYER.flags.lucasPhase = 11; triggerEvent(405, PLAYER.x, PLAYER.y); } }]); }); }, 1500);
    } else if (PLAYER.flags.lucasPhase === 11) { 
        document.body.style.filter = "grayscale(100%) brightness(1.5)"; logMessage("<strong>【記憶の完全な復元】</strong>");
        setTimeout(() => { document.body.style.filter = `grayscale(${Math.min(PLAYER.res, 100)}%)`; talk("lucas", "……思い出した。私はあの日、貴方に『答え』を託したのだ。", () => { showChoices("ルーカスの魂が光に包まれていく。", [{ text: "1: 完全に鎮魂する", action: () => { performRequiem(PLAYER.x, PLAYER.y, 10, () => { talk("lucas", "頼んだぞ……我が主……", () => { PLAYER.flags.lucasDefeated = true; PLAYER.items.silverSword = 1; MAPS[PLAYER.currentScene][PLAYER.y][PLAYER.x] = 1; renderMap(); logMessage("ルーカスの魂を引き受け、真の記憶を取り戻した。<br><span style='color:#add8e6;'>『白銀騎士の古剣』を入手した！装備メニューから変更できる。<br>（真実へ至る鍵の一つを得た）</span>"); showNext(endEvent); }); }); }}]); }); }, 1500);
    }
}

function handleMemoryItem(x, y) { PLAYER.inventory.pendant++; MAPS[PLAYER.currentScene][y][x] = 1; renderMap(); logMessage("<span style='color:#add8e6;'>「王妃のペンダント」を手に入れた。</span>"); showNext(endEvent); }

function handlePedestal() { 
    if (PLAYER.flags.bossDoorOpened) { logMessage("台座にはペンダントが置かれている。"); showNext(endEvent); return; } 
    if (PLAYER.inventory.pendant > 0) { showChoices("「王妃のペンダント」を置く？", [ { text: "1: 置く", action: () => { PLAYER.inventory.pendant--; PLAYER.flags.bossDoorOpened = true; MAPS["1-6-F3"][3][9] = 1; MAPS["1-6-F3"][3][10] = 1; renderMap(); logMessage("<span style='color:#f44;'>感情の炎が消える音がした！</span>"); showNext(endEvent); }}, { text: "2: やめる", action: endEvent } ]); } else { logMessage("くぼみのある台座がある。"); showNext(endEvent); } 
}

function performRequiem(targetX, targetY, resAmount, onComplete) { 
    logMessage("<span style='color:#f00; font-weight:bold;'>ドクン……</span>"); 
    setTimeout(() => { PLAYER.res += resAmount; MAPS[PLAYER.currentScene][targetY][targetX] = 1; renderMap(); logMessage("対象の未練が器に吸い込まれた。"); showNext(() => { if (onComplete) onComplete(); else showNext(endEvent); }); }, 800); 
}

function handleTransition() { 
    if (PLAYER.currentScene === "1-1-North") { PLAYER.currentScene = "1-2"; PLAYER.x = 9; PLAYER.y = 18; } 
    else if (PLAYER.currentScene === "1-2-North") { PLAYER.currentScene = "1-3-Entrance"; PLAYER.x = 9; PLAYER.y = 18; } 
    renderMap(); logMessage(`--- 第 ${PLAYER.currentScene.split('-')[0]} 章 ---`); showNext(endEvent); 
}
/* =========================================================================
   minigames.js — one tiny playable demo per puzzle type (vanilla, no build)

   Exposes window.MINIGAMES = { <puzzle-slug>: function(host, L) }.
   app.js calls the matching builder inside the puzzle detail dialog (only on
   the puzzles page). Each game is self-contained, bilingual (reads L.state.lang)
   and EPHEMERAL — state lives only in the open dialog and resets on reload or
   language switch. All visible strings are inline literals here (author-
   controlled), built with textContent / static markup, so there is no XSS path
   from data into the DOM.
   ========================================================================= */
(function () {
  "use strict";
  var M = {};

  /* ---------- tiny helpers ---------- */
  function mk(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function tx(L, en, zh) { return L.state.lang === "en" ? en : zh; }
  function instr(host, L, en, zh) { host.appendChild(mk("p", "mg__instr", tx(L, en, zh))); }
  function row(cls) { return mk("div", "mg-row" + (cls ? " " + cls : "")); }
  function btn(cls, txt) { var b = mk("button", "mg-btn" + (cls ? " " + cls : ""), txt); b.type = "button"; return b; }
  function win(host, L) {
    var b = mk("div", "mg-win", tx(L, "Solved! ✅", "解開了! ✅"));
    host.appendChild(b);
    return b;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function rnd(n) { return Math.floor(Math.random() * n); }

  /* ============================ 1. SEARCH ============================ */
  M.search = function (host, L) {
    instr(host, L, "Search the 12 spots — one hides the key. Click to look.",
                   "搜索這 12 個地方,其中一個藏了鑰匙。點擊翻找。");
    var icons = ["chair", "book_2", "umbrella", "bed", "weekend", "wall_art",
                 "door_open", "luggage", "checkroom", "inventory_2", "window", "desk"];
    var keyAt = rnd(12), found = false;
    var grid = mk("div", "mg-grid mg-grid--4");
    icons.forEach(function (ic, i) {
      var b = btn("mg-cell"); b.innerHTML = '<span class="material-symbols-rounded">' + ic + "</span>";
      b.addEventListener("click", function () {
        if (found || b.classList.contains("mg-cell--open")) return;
        b.classList.add("mg-cell--open");
        if (i === keyAt) {
          b.classList.add("mg-cell--hit");
          b.innerHTML = '<span class="material-symbols-rounded">key</span>';
          found = true; win(host, L);
        } else { b.innerHTML = '<span class="mg-empty">·</span>'; }
      });
      grid.appendChild(b);
    });
    host.appendChild(grid);
  };

  /* ============================ 2. CIPHERS (Caesar) ============================ */
  M.ciphers = function (host, L) {
    var answer = "CODE", shift = 3, cur = 0;
    var cipher = answer.split("").map(function (c) {
      return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
    }).join("");
    instr(host, L, "Caesar cipher — rotate the wheel until the letters spell an English word.",
                   "凱撒密碼——轉動轉盤,直到字母拼出讀得懂的英文單字。");
    var disp = mk("div", "mg-cipher");
    var minus = btn(null, "◀ −1"), plus = btn(null, "+1 ▶"), pill = mk("span", "mg-pill");
    function decoded() {
      return cipher.split("").map(function (c) {
        return String.fromCharCode((c.charCodeAt(0) - 65 - cur + 260) % 26 + 65);
      }).join("");
    }
    function upd() {
      disp.textContent = decoded();
      pill.textContent = (L.state.lang === "en" ? "shift " : "位移 ") + cur;
      if (decoded() === answer) { disp.classList.add("mg-cipher--ok"); minus.disabled = plus.disabled = true; win(host, L); }
    }
    minus.addEventListener("click", function () { cur = (cur + 25) % 26; upd(); });
    plus.addEventListener("click", function () { cur = (cur + 1) % 26; upd(); });
    var r = row("mg-row--center"); r.appendChild(minus); r.appendChild(pill); r.appendChild(plus);
    host.appendChild(disp); host.appendChild(r); upd();
  };

  /* ============================ 3. HIDDEN TEXT (acrostic) ============================ */
  M["hidden-text"] = function (host, L) {
    var en = ["Curtains hide a draft", "Look behind the clock", "Under the rug, dust", "Every corner counts"];
    var zh = ["密道就在牆後", "室內藏有線索", "逃出全靠鑰匙", "脫困務必冷靜"];
    var lines = L.state.lang === "en" ? en : zh;
    var answer = lines.map(function (s) { return s.charAt(0); }).join("");
    instr(host, L, "Read the FIRST letter of each line, top to bottom. Click the lines in order.",
                   "讀每一行的第一個字(由上而下)。依序點選每一行。");
    var next = 0;
    var prog = mk("div", "mg-acro-prog", "—");
    var box = mk("div", "mg-acro");
    lines.forEach(function (s, i) {
      var b = btn("mg-acro-line");
      b.innerHTML = '<b class="mg-acro-first">' + s.charAt(0) + "</b><span>" + s.slice(1) + "</span>";
      b.addEventListener("click", function () {
        if (i === next) {
          b.classList.add("mg-acro-line--on"); next++;
          prog.textContent = lines.slice(0, next).map(function (x) { return x.charAt(0); }).join("");
          if (next === lines.length) { prog.classList.add("mg-cipher--ok"); win(host, L); }
        } else {
          next = 0;
          [].forEach.call(box.querySelectorAll(".mg-acro-line"), function (x) { x.classList.remove("mg-acro-line--on"); });
          prog.textContent = tx(L, "(start again from the top)", "(請從第一行重新點起)");
        }
      });
      box.appendChild(b);
    });
    host.appendChild(box);
    host.appendChild(mk("div", "mg-hint", tx(L, "Spelled so far:", "目前拼出:")));
    host.appendChild(prog);
  };

  /* ============================ 4. REVEAL (UV light) ============================ */
  M.reveal = function (host, L) {
    var code = String(100 + rnd(900));
    instr(host, L, "Hold the UV light over the panel to reveal a hidden code, then enter it.",
                   "按住 UV 燈照亮面板,顯現隱藏密碼,再輸入它。");
    var panel = mk("div", "mg-uv"); panel.appendChild(mk("span", "mg-uv__code", code));
    var lamp = btn("mg-btn--ghost", "🔦 " + tx(L, "Hold to shine UV", "按住照 UV"));
    var on = function () { panel.classList.add("mg-uv--on"); }, off = function () { panel.classList.remove("mg-uv--on"); };
    lamp.addEventListener("mousedown", on); lamp.addEventListener("mouseup", off); lamp.addEventListener("mouseleave", off);
    lamp.addEventListener("touchstart", function (e) { e.preventDefault(); on(); }, { passive: false });
    lamp.addEventListener("touchend", off);
    var inp = mk("input", "mg-input"); inp.type = "text"; inp.inputMode = "numeric"; inp.maxLength = 3;
    inp.placeholder = tx(L, "code", "密碼");
    var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = mk("span", "mg-fb");
    chk.addEventListener("click", function () {
      if (inp.value.trim() === code) { chk.disabled = true; win(host, L); }
      else { fb.textContent = "❌"; }
    });
    var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb);
    host.appendChild(panel); host.appendChild(lamp); host.appendChild(r);
  };

  /* ============================ 5. MATH (counting) ============================ */
  M.math = function (host, L) {
    var set = ["🔴", "🔵", "🟢", "🟡"], target = set[rnd(set.length)];
    var n = 9 + rnd(7), cells = [], count = 0;
    for (var i = 0; i < n; i++) { var e = set[rnd(set.length)]; if (e === target) count++; cells.push(e); }
    if (count === 0) { cells[0] = target; count = 1; }
    instr(host, L, "Count how many " + target + " there are, then enter the number.",
                   "數一數有幾個 " + target + ",然後輸入數量。");
    host.appendChild(mk("div", "mg-count", cells.join(" ")));
    var inp = mk("input", "mg-input"); inp.type = "text"; inp.inputMode = "numeric"; inp.placeholder = "#";
    var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = mk("span", "mg-fb");
    chk.addEventListener("click", function () {
      if (parseInt(inp.value, 10) === count) { chk.disabled = true; win(host, L); }
      else { fb.textContent = "❌"; }
    });
    var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb);
    host.appendChild(r);
  };

  /* ============================ 6. LOGIC (deduction) ============================ */
  M.logic = function (host, L) {
    instr(host, L, "One box holds the key. Clues: it is NOT red, AND it is the smallest. Click it.",
                   "只有一個盒子有鑰匙。線索:不是紅色、而且是最小的。點出它。");
    var boxes = [
      { color: "#c0392b", size: 64, key: false },
      { color: "#2980b9", size: 50, key: false },
      { color: "#27ae60", size: 38, key: true }   // green + smallest
    ];
    shuffle(boxes);
    var grid = mk("div", "mg-row mg-row--center");
    boxes.forEach(function (b) {
      var cell = mk("button", "mg-box"); cell.type = "button";
      cell.style.background = b.color; cell.style.width = cell.style.height = b.size + "px";
      cell.addEventListener("click", function () {
        if (b.key) { cell.innerHTML = '<span class="material-symbols-rounded">key</span>'; win(host, L); }
        else { cell.classList.add("mg-shake"); setTimeout(function () { cell.classList.remove("mg-shake"); }, 400); }
      });
      grid.appendChild(cell);
    });
    host.appendChild(grid);
  };

  /* ============================ 7. ASSEMBLY (order tiles) ============================ */
  M.assembly = function (host, L) {
    var ans = L.state.lang === "en" ? ["C", "O", "D", "E"] : ["解", "開", "謎", "題"];
    instr(host, L, "Rearrange the tiles to read: " + ans.join(""),
                   "把碎片排好,讀出:" + ans.join(""));
    var order = shuffle(ans.slice());
    while (order.join("") === ans.join("")) order = shuffle(ans.slice());
    var sel = -1;
    var rowEl = mk("div", "mg-row mg-row--center");
    function repaint() {
      rowEl.innerHTML = "";
      order.forEach(function (ch, i) {
        var t = mk("button", "mg-tile" + (i === sel ? " mg-tile--sel" : ""), ch); t.type = "button";
        t.addEventListener("click", function () {
          if (sel === -1) { sel = i; }
          else { var tmp = order[sel]; order[sel] = order[i]; order[i] = tmp; sel = -1; }
          repaint();
          if (order.join("") === ans.join("")) {
            [].forEach.call(rowEl.querySelectorAll(".mg-tile"), function (x) { x.classList.add("mg-tile--ok"); x.disabled = true; });
            win(host, L);
          }
        });
        rowEl.appendChild(t);
      });
    }
    repaint();
    host.appendChild(rowEl);
    host.appendChild(mk("div", "mg-hint", tx(L, "Click two tiles to swap them.", "點兩個碎片即可交換位置。")));
  };

  /* ============================ 8. SPATIAL (follow directions) ============================ */
  M.spatial = function (host, L) {
    var N = 5, start = { r: 4, c: 0 }, goal = { r: 1, c: 2 };  // North 3, East 2
    instr(host, L, "Follow the clue from the start (◆) to the treasure: North 3, East 2.",
                   "依線索從起點(◆)走到寶藏:北 3、東 2。");
    var pos = { r: start.r, c: start.c };
    var board = mk("div", "mg-board"); board.style.setProperty("--n", N);
    function paint() {
      board.innerHTML = "";
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        var cell = mk("div", "mg-board-cell");
        if (r === pos.r && c === pos.c) cell.classList.add("mg-board-cell--me"), cell.textContent = "◆";
        else if (r === goal.r && c === goal.c) cell.classList.add("mg-board-cell--goal"), cell.textContent = "★";
        board.appendChild(cell);
      }
    }
    function move(dr, dc) {
      var nr = pos.r + dr, nc = pos.c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) return;
      pos.r = nr; pos.c = nc; paint();
      if (pos.r === goal.r && pos.c === goal.c) { win(host, L); }
    }
    paint(); host.appendChild(board);
    host.appendChild(dpad(move));
  };

  /* ============================ 9. MAZE ============================ */
  M.maze = function (host, L) {
    var N = 5;
    var walls = { "0,1": 1, "1,1": 1, "1,3": 1, "2,3": 1, "3,0": 1, "3,1": 1, "3,3": 1 };
    var start = { r: 0, c: 0 }, exit = { r: 4, c: 4 }, pos = { r: 0, c: 0 };
    instr(host, L, "Steer from the start to the exit (★). Walls block you.",
                   "從起點走到出口(★),牆壁會擋路。");
    var board = mk("div", "mg-board"); board.style.setProperty("--n", N);
    function paint() {
      board.innerHTML = "";
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        var cell = mk("div", "mg-board-cell");
        if (walls[r + "," + c]) cell.classList.add("mg-board-cell--wall");
        else if (r === pos.r && c === pos.c) cell.classList.add("mg-board-cell--me"), cell.textContent = "◆";
        else if (r === exit.r && c === exit.c) cell.classList.add("mg-board-cell--goal"), cell.textContent = "★";
        board.appendChild(cell);
      }
    }
    function move(dr, dc) {
      var nr = pos.r + dr, nc = pos.c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N || walls[nr + "," + nc]) return;
      pos.r = nr; pos.c = nc; paint();
      if (pos.r === exit.r && pos.c === exit.c) win(host, L);
    }
    paint(); host.appendChild(board);
    host.appendChild(dpad(move));
  };

  /* shared D-pad for spatial + maze */
  function dpad(move) {
    var pad = mk("div", "mg-dpad");
    [["north", -1, 0, "↑"], ["west", 0, -1, "←"], ["south", 1, 0, "↓"], ["east", 0, 1, "→"]].forEach(function (d) {
      var b = btn("mg-dpad__btn mg-dpad__btn--" + d[0], d[3]);
      b.addEventListener("click", function () { move(d[1], d[2]); });
      pad.appendChild(b);
    });
    return pad;
  }

  /* ============================ 10. MATCHING (connect pairs) ============================ */
  M.matching = function (host, L) {
    var pairs = L.state.lang === "en"
      ? [["▲", "Triangle"], ["■", "Square"], ["●", "Circle"], ["★", "Star"]]
      : [["▲", "三角"], ["■", "正方"], ["●", "圓形"], ["★", "星形"]];
    instr(host, L, "Match each shape to its name. Click a shape, then its name.",
                   "把每個形狀和名稱配對。先點形狀,再點名稱。");
    var rights = shuffle(pairs.map(function (p, i) { return { txt: p[1], idx: i }; }));
    var sel = null, done = 0;
    var grid = mk("div", "mg-match");
    var left = mk("div", "mg-match__col"), right = mk("div", "mg-match__col");
    pairs.forEach(function (p, i) {
      var l = mk("button", "mg-match__item mg-match__sym", p[0]); l.type = "button"; l.dataset.idx = i;
      l.addEventListener("click", function () {
        if (l.classList.contains("mg-match__item--ok")) return;
        [].forEach.call(left.children, function (x) { x.classList.remove("mg-match__item--sel"); });
        l.classList.add("mg-match__item--sel"); sel = i;
      });
      left.appendChild(l);
    });
    rights.forEach(function (o) {
      var rb = mk("button", "mg-match__item", o.txt); rb.type = "button"; rb.dataset.idx = o.idx;
      rb.addEventListener("click", function () {
        if (sel === null || rb.classList.contains("mg-match__item--ok")) return;
        if (o.idx === sel) {
          rb.classList.add("mg-match__item--ok");
          var l = left.querySelector('[data-idx="' + sel + '"]'); l.classList.remove("mg-match__item--sel"); l.classList.add("mg-match__item--ok");
          sel = null; done++;
          if (done === pairs.length) win(host, L);
        } else {
          rb.classList.add("mg-shake"); setTimeout(function () { rb.classList.remove("mg-shake"); }, 400);
        }
      });
      right.appendChild(rb);
    });
    grid.appendChild(left); grid.appendChild(right); host.appendChild(grid);
  };

  /* ============================ 11. AUDIO (Simon) ============================ */
  M.audio = function (host, L) {
    var freqs = [330, 392, 494, 587], colors = ["#c0392b", "#27ae60", "#2980b9", "#d4a017"];
    var seq = [], inp = [], locked = true;
    for (var i = 0; i < 4; i++) seq.push(rnd(4));
    instr(host, L, "Press Play, watch the flashes, then repeat the sequence on the pads.",
                   "按播放、看閃光順序,再依序點按色塊重現它。");
    var ac = null;
    function beep(f) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        if (!ac) ac = new AC(); if (ac.state === "suspended") ac.resume();
        var o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = f; o.connect(g); g.connect(ac.destination);
        g.gain.value = 0.07; o.start(); o.stop(ac.currentTime + 0.22);
      } catch (e) {}
    }
    var padsBox = mk("div", "mg-pads"), pads = [];
    function flash(i) { pads[i].classList.add("mg-pad--lit"); beep(freqs[i]); setTimeout(function () { pads[i].classList.remove("mg-pad--lit"); }, 280); }
    for (var k = 0; k < 4; k++) (function (k) {
      var p = mk("button", "mg-pad"); p.type = "button"; p.style.setProperty("--pad", colors[k]);
      p.addEventListener("click", function () {
        if (locked) return;
        flash(k); inp.push(k);
        if (seq[inp.length - 1] !== k) { inp = []; fb.textContent = tx(L, "❌ try again", "❌ 再試一次"); return; }
        if (inp.length === seq.length) { locked = true; win(host, L); }
      });
      pads.push(p); padsBox.appendChild(p);
    })(k);
    var play = btn("mg-btn--primary", "▶ " + tx(L, "Play", "播放"));
    var fb = mk("span", "mg-fb");
    play.addEventListener("click", function () {
      locked = true; inp = []; fb.textContent = "";
      seq.forEach(function (s, i) { setTimeout(function () { flash(s); if (i === seq.length - 1) setTimeout(function () { locked = false; }, 320); }, 450 * i); });
    });
    host.appendChild(padsBox);
    var r = row("mg-row--center"); r.appendChild(play); r.appendChild(fb); host.appendChild(r);
  };

  /* ============================ 12. REACH (drag the magnet) ============================ */
  M.reach = function (host, L) {
    instr(host, L, "The key is behind the bars. Drag the magnet close to it to pull it out.",
                   "鑰匙在欄杆後面。把磁鐵拖近鑰匙,就能把它吸出來。");
    var stage = mk("div", "mg-reach");
    var bars = mk("div", "mg-reach__bars");
    var key = mk("div", "mg-reach__key"); key.innerHTML = '<span class="material-symbols-rounded">key</span>';
    var mag = mk("div", "mg-reach__magnet"); mag.innerHTML = "🧲";
    stage.appendChild(bars); stage.appendChild(key); stage.appendChild(mag);
    host.appendChild(stage);
    var won = false, dragging = false;
    mag.addEventListener("pointerdown", function (e) { dragging = true; mag.setPointerCapture(e.pointerId); mag.classList.add("mg-reach__magnet--grab"); });
    mag.addEventListener("pointerup", function () { dragging = false; mag.classList.remove("mg-reach__magnet--grab"); });
    mag.addEventListener("pointermove", function (e) {
      if (!dragging || won) return;
      var box = stage.getBoundingClientRect();
      var x = Math.max(0, Math.min(box.width, e.clientX - box.left));
      var y = Math.max(0, Math.min(box.height, e.clientY - box.top));
      mag.style.left = x + "px"; mag.style.top = y + "px";
      var kb = key.getBoundingClientRect();
      var dx = e.clientX - (kb.left + kb.width / 2), dy = e.clientY - (kb.top + kb.height / 2);
      if (Math.sqrt(dx * dx + dy * dy) < 46) {
        won = true; dragging = false;
        key.style.right = "auto"; key.style.transform = "none";
        key.style.left = x + "px"; key.style.top = y + "px"; key.classList.add("mg-reach__key--pulled");
        win(host, L);
      }
    });
  };

  /* ============================ 13. MECHANISM (circuit switches) ============================ */
  M.mechanism = function (host, L) {
    instr(host, L, "Flip all three switches ON to complete the circuit and light the lamp.",
                   "把三個開關全部扳到 ON,接通電路、點亮燈泡。");
    var lamp = mk("div", "mg-lamp"); lamp.innerHTML = '<span class="material-symbols-rounded">lightbulb</span>';
    var state = [false, false, false];
    var switches = mk("div", "mg-row mg-row--center");
    state.forEach(function (_, i) {
      var sw = mk("button", "mg-switch", "OFF"); sw.type = "button";
      sw.addEventListener("click", function () {
        state[i] = !state[i];
        sw.textContent = state[i] ? "ON" : "OFF";
        sw.classList.toggle("mg-switch--on", state[i]);
        var all = state[0] && state[1] && state[2];
        lamp.classList.toggle("mg-lamp--on", all);
        if (all && !host.querySelector(".mg-win")) win(host, L);
      });
      switches.appendChild(sw);
    });
    host.appendChild(lamp); host.appendChild(switches);
  };

  /* ============================ 14. COOPERATION (relay) ============================ */
  M.cooperation = function (host, L) {
    var syms = ["▲", "●", "■", "★"], secret = syms[rnd(4)];
    instr(host, L, "Room A holds a secret symbol — peek, then press the matching button in Room B.",
                   "A 房有一個祕密符號——先偷看,再到 B 房按下相符的按鈕。");
    var grid = mk("div", "mg-coop");
    var aRoom = mk("div", "mg-coop__room");
    aRoom.appendChild(mk("div", "mg-coop__label", tx(L, "Room A", "A 房")));
    var peek = btn(null, tx(L, "👁 Peek", "👁 偷看")), aShow = mk("div", "mg-coop__secret", "?");
    peek.addEventListener("mousedown", function () { aShow.textContent = secret; });
    peek.addEventListener("mouseup", function () { aShow.textContent = "?"; });
    peek.addEventListener("mouseleave", function () { aShow.textContent = "?"; });
    aRoom.appendChild(aShow); aRoom.appendChild(peek);
    var bRoom = mk("div", "mg-coop__room");
    bRoom.appendChild(mk("div", "mg-coop__label", tx(L, "Room B", "B 房")));
    var bBtns = mk("div", "mg-row mg-row--center");
    shuffle(syms.slice()).forEach(function (s) {
      var b = btn("mg-coop__pick", s);
      b.addEventListener("click", function () {
        if (s === secret) { b.classList.add("mg-match__item--ok"); win(host, L); }
        else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); }
      });
      bBtns.appendChild(b);
    });
    bRoom.appendChild(bBtns);
    grid.appendChild(aRoom); grid.appendChild(bRoom); host.appendChild(grid);
  };

  /* ============================ 15. ROLEPLAY (dialogue) ============================ */
  M.roleplay = function (host, L) {
    var steps = L.state.lang === "en" ? [
      { npc: "A guard blocks the door: “Nobody passes without a pass.”",
        opts: [["Show the forged pass confidently", true], ["Shout and shove past him", false], ["Admit you have no pass", false]] },
      { npc: "Inside, a clerk asks: “And you are…?”",
        opts: [["“The new inspector — here for the audit.”", true], ["Stay silent and sweat", false], ["“Just looking around.”", false]] }
    ] : [
      { npc: "守衛擋住門口:「沒有通行證不准過。」",
        opts: [["自信地出示偽造通行證", true], ["大吼著硬推過去", false], ["老實說你沒有通行證", false]] },
      { npc: "進門後職員問:「請問您是…?」",
        opts: [["「新來的督察,來做稽核的。」", true], ["沉默不語、冒冷汗", false], ["「只是隨便看看。」", false]] }
    ];
    instr(host, L, "Stay in character. Pick the response that keeps your cover.",
                   "保持角色設定,選出能繼續掩飾身分的回應。");
    var i = 0;
    var npc = mk("div", "mg-rp__npc"), opts = mk("div", "mg-rp__opts"), fb = mk("div", "mg-fb");
    function render() {
      var st = steps[i]; npc.textContent = st.npc; opts.innerHTML = ""; fb.textContent = "";
      st.opts.forEach(function (o) {
        var b = btn("mg-rp__opt", o[0]);
        b.addEventListener("click", function () {
          if (o[1]) {
            i++;
            if (i >= steps.length) { opts.innerHTML = ""; npc.textContent = tx(L, "You are through. 🎭", "你順利過關了。🎭"); win(host, L); }
            else render();
          } else {
            b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400);
            fb.textContent = tx(L, "That blows your cover — try another line.", "這樣會露餡——換一句試試。");
          }
        });
        opts.appendChild(b);
      });
    }
    render();
    host.appendChild(npc); host.appendChild(opts); host.appendChild(fb);
  };

  /* ============================ 16. MULTISTEP (chained) ============================ */
  M.multistep = function (host, L) {
    instr(host, L, "Two linked steps. Solve step 1 — its answer feeds step 2.",
                   "兩個相扣的步驟。先解第 1 步,它的答案會餵給第 2 步。");
    var mid = 2 + rnd(7);                  // single-digit middle code (2..8)
    var a = 1 + rnd(mid - 1), b = mid - a; // a + b = mid, both >= 1
    var s1 = mk("div", "mg-step");
    s1.appendChild(mk("div", "mg-step__label", tx(L, "Step 1 · the middle digit", "第 1 步 · 中間那一碼")));
    s1.appendChild(mk("div", "mg-step__q", a + " + " + b + " = ?"));
    var i1 = mk("input", "mg-input"); i1.type = "text"; i1.inputMode = "numeric"; i1.placeholder = "?";
    var c1 = btn("mg-btn--primary", tx(L, "OK", "確認")), f1 = mk("span", "mg-fb");
    var r1 = row(); r1.appendChild(i1); r1.appendChild(c1); r1.appendChild(f1); s1.appendChild(r1);

    var s2 = mk("div", "mg-step mg-step--locked");
    s2.appendChild(mk("div", "mg-step__label", tx(L, "Step 2 · the final code", "第 2 步 · 最終密碼")));
    var clue2 = mk("div", "mg-step__q");
    s2.appendChild(clue2);
    var i2 = mk("input", "mg-input"); i2.type = "text"; i2.inputMode = "numeric"; i2.maxLength = 3; i2.placeholder = "###"; i2.disabled = true;
    var c2 = btn("mg-btn--primary", tx(L, "Unlock", "解鎖")); c2.disabled = true;
    var f2 = mk("span", "mg-fb");
    var r2 = row(); r2.appendChild(i2); r2.appendChild(c2); r2.appendChild(f2); s2.appendChild(r2);

    var finalCode = "2" + mid + "9"; // left 2, middle = step-1 answer, right 9
    c1.addEventListener("click", function () {
      if (parseInt(i1.value, 10) === mid) {
        f1.textContent = "✅"; c1.disabled = i1.disabled = true; s2.classList.remove("mg-step--locked");
        i2.disabled = c2.disabled = false;
        clue2.textContent = tx(L, "Code = 2, then step-1 answer, then 9 →  2_9",
                                 "密碼 = 2、接著第 1 步答案、再接 9 →  2_9");
      } else { f1.textContent = "❌"; }
    });
    c2.addEventListener("click", function () {
      if (i2.value.trim() === finalCode) { c2.disabled = true; win(host, L); }
      else { f2.textContent = "❌"; }
    });
    host.appendChild(s1); host.appendChild(s2);
  };

  window.MINIGAMES = M;
})();

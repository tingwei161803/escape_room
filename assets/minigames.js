/* =========================================================================
   minigames.js — playable demos for every puzzle TYPE and its SUB-techniques,
   each scaling across FOUR difficulty levels (1 Easy → 4 Expert).

   window.MINIGAMES[<puzzle-slug>] = [ { id, name:{en,zh}, build(host,L,diff) } ]
   app.js shows the array as tabs + a 4-level difficulty selector inside the
   puzzle detail dialog. `diff` is 1..4; higher = longer codes, bigger grids,
   more pairs/decoys, faster sequences. Vanilla, zero-build, bilingual,
   EPHEMERAL. All visible strings are inline literals rendered via textContent /
   static markup — no data-derived value reaches innerHTML.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  function mk(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function tx(L, en, zh) { return L.state.lang === "en" ? en : zh; }
  function instr(host, L, en, zh) { host.appendChild(mk("p", "mg__instr", tx(L, en, zh))); }
  function row(cls) { return mk("div", "mg-row" + (cls ? " " + cls : "")); }
  function btn(cls, txt) { var b = mk("button", "mg-btn" + (cls ? " " + cls : ""), txt); b.type = "button"; return b; }
  function win(host, L) { if (host.querySelector(".mg-win")) return null; var b = mk("div", "mg-win", tx(L, "Solved! ✅", "解開了! ✅")); host.appendChild(b); return b; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function norm(s) { return String(s == null ? "" : s).trim().toUpperCase().replace(/\s+/g, ""); }
  function nm(en, zh) { return { en: en, zh: zh }; }
  function feedback() { return mk("span", "mg-fb"); }
  function D(diff, arr) { return arr[Math.max(0, Math.min(arr.length - 1, (diff || 2) - 1))]; }
  function badge(host, L, diff) {
    var names = L.state.lang === "en" ? ["Easy", "Normal", "Hard", "Expert"] : ["簡單", "普通", "困難", "專家"];
    var b = mk("span", "mg-lvl", "Lv." + diff + " · " + names[diff - 1]); host.appendChild(b);
  }
  function checkInput(host, L, inp, chk, fb, answer) {
    chk.addEventListener("click", function () {
      if (norm(inp.value) === norm(typeof answer === "function" ? answer() : answer)) { chk.disabled = true; win(host, L); }
      else fb.textContent = "❌";
    });
  }
  function inputRow(host, L, answer, width, ph) {
    var inp = mk("input", "mg-input"); inp.type = "text"; if (width) inp.style.width = width; inp.placeholder = ph || "?";
    var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
    checkInput(host, L, inp, chk, fb, answer);
    var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
    return inp;
  }
  function randDigits(n) { var s = ""; for (var i = 0; i < n; i++) s += rnd(10); return s; }
  var ALPHA = "ABCDEFGHJKLMNPRSTUVWXYZ";
  function randLetters(n) { var s = ""; for (var i = 0; i < n; i++) s += ALPHA.charAt(rnd(ALPHA.length)); return s; }
  /* random solvable cell-blocked maze */
  function genMaze(n, density) {
    function ok(walls) {
      var seen = {}, q = [[0, 0]]; seen["0,0"] = 1;
      while (q.length) { var c = q.shift(); if (c[0] === n - 1 && c[1] === n - 1) return true;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var r = c[0] + d[0], k = c[1] + d[1], key = r + "," + k;
          if (r >= 0 && r < n && k >= 0 && k < n && !walls[key] && !seen[key]) { seen[key] = 1; q.push([r, k]); } }); }
      return false;
    }
    for (var a = 0; a < 250; a++) {
      var w = {};
      for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) { if ((r === 0 && k === 0) || (r === n - 1 && k === n - 1)) continue; if (Math.random() < density) w[r + "," + k] = 1; }
      if (ok(w)) return w;
    }
    return {};
  }
  var WORDS = { 3: ["KEY", "MAP", "FOX", "OWL", "SUN"], 4: ["CODE", "LOCK", "DOOR", "CLUE", "EXIT", "MAZE"], 5: ["CHEST", "GHOST", "VAULT", "NIGHT", "TOKEN", "CRYPT"], 6: ["ESCAPE", "PUZZLE", "CIPHER", "SECRET", "LOCKED", "HIDDEN"] };
  var ZHWORDS = { 3: ["鑰匙鎖", "暗門關", "謎與題"], 4: ["解開謎題", "破解密碼", "逃出密室"], 5: ["密室逃脫趣", "層層解開鎖"], 6: ["逃出這間密室", "破解所有機關"] };

  /* =====================================================================
     ENGINES — each returns build(host, L, diff)
     ===================================================================== */

  /* lookup-table decode; length scales with difficulty */
  function decoderGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, o.instr.en, o.instr.zh);
      host.appendChild(mk("div", "mg-hint", tx(L, o.keyLabel.en, o.keyLabel.zh)));
      var kt = mk("div", "mg-keytable");
      o.pool.forEach(function (p) { var c = mk("div", "mg-key"); c.appendChild(mk("span", "mg-key__sym", p[0])); c.appendChild(mk("span", "mg-key__val", p[1])); kt.appendChild(c); });
      host.appendChild(kt);
      var len = D(diff, [3, 4, 5, 6]);
      var picks = []; for (var i = 0; i < len; i++) picks.push(o.pool[rnd(o.pool.length)]);
      host.appendChild(mk("div", "mg-coded", picks.map(function (p) { return p[0]; }).join("   ")));
      inputRow(host, L, picks.map(function (p) { return p[1]; }).join(""), "160px", tx(L, "decode…", "解出…"));
    };
  }

  /* Caesar wheel; word length scales */
  function caesarGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var len = D(diff, [3, 4, 5, 6]), pool = WORDS[len], answer = pool[rnd(pool.length)], shift = 1 + rnd(25), cur = 0;
      var cipher = answer.split("").map(function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65); }).join("");
      instr(host, L, "Caesar cipher — rotate until the letters spell an English word.", "凱撒密碼——轉動轉盤,直到字母拼出讀得懂的英文單字。");
      var disp = mk("div", "mg-cipher"), minus = btn(null, "◀ −1"), plus = btn(null, "+1 ▶"), pill = mk("span", "mg-pill");
      function dec() { return cipher.split("").map(function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 - cur + 260) % 26 + 65); }).join(""); }
      function upd() { disp.textContent = dec(); pill.textContent = (L.state.lang === "en" ? "shift " : "位移 ") + cur; if (dec() === answer) { disp.classList.add("mg-cipher--ok"); minus.disabled = plus.disabled = true; win(host, L); } }
      minus.addEventListener("click", function () { cur = (cur + 25) % 26; upd(); });
      plus.addEventListener("click", function () { cur = (cur + 1) % 26; upd(); });
      var r = row("mg-row--center"); r.appendChild(minus); r.appendChild(pill); r.appendChild(plus);
      host.appendChild(disp); host.appendChild(r); upd();
    };
  }

  /* binary bit switches; bit count scales */
  function bitGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var bits = D(diff, [[8, 4, 2, 1], [16, 8, 4, 2, 1], [32, 16, 8, 4, 2, 1], [64, 32, 16, 8, 4, 2, 1]]);
      var max = bits.reduce(function (a, b) { return a + b; }, 0), target = 1 + rnd(max);
      instr(host, L, "Binary: toggle the bit switches so the value equals " + target + ".", "二進位:切換位元開關,讓數值等於 " + target + "。");
      var st = bits.map(function () { return false; }), disp = mk("div", "mg-cipher");
      function val() { return bits.reduce(function (a, b, i) { return a + (st[i] ? b : 0); }, 0); }
      var rowEl = mk("div", "mg-bits");
      function upd() { disp.textContent = val(); if (val() === target) { disp.classList.add("mg-cipher--ok"); win(host, L); } else disp.classList.remove("mg-cipher--ok"); }
      bits.forEach(function (b, i) { var sw = mk("button", "mg-bit"); sw.type = "button"; sw.dataset.bit = b; sw.appendChild(mk("span", "mg-bit__v", String(b))); sw.appendChild(mk("span", "mg-bit__s", "0"));
        sw.addEventListener("click", function () { st[i] = !st[i]; sw.classList.toggle("mg-bit--on", st[i]); sw.querySelector(".mg-bit__s").textContent = st[i] ? "1" : "0"; upd(); }); rowEl.appendChild(sw); });
      host.appendChild(mk("div", "mg-hint", tx(L, "Target value: " + target, "目標數值:" + target))); host.appendChild(rowEl); host.appendChild(disp); upd();
    };
  }

  /* click the correct item(s); config builder receives diff */
  function pickGame(make) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var o = make(diff, L);
      instr(host, L, o.instr.en, o.instr.zh);
      if (o.note) host.appendChild(mk("div", "mg-hint", tx(L, o.note.en, o.note.zh)));
      var box = mk("div", o.cls || "mg-row mg-row--center");
      o.items.forEach(function (it) {
        var b = mk("button", "mg-pick" + (it.cls ? " " + it.cls : "")); b.type = "button";
        if (it.style) b.setAttribute("style", it.style);
        b.textContent = it.label ? (it.label[L.state.lang] || it.label.en || it.label) : (it.text || "");
        b.addEventListener("click", function () { if (it.ok) { b.classList.add("mg-pick--ok"); win(host, L); } else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); } });
        box.appendChild(b);
      });
      host.appendChild(box);
    };
  }

  /* reorder tiles; sequence length scales. kind = "word" | "num" */
  function orderGame(kind) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var ans;
      if (kind === "num") { var n = D(diff, [4, 6, 8, 9]); ans = []; for (var i = 1; i <= n; i++) ans.push(String(i)); }
      else { var len = D(diff, [3, 4, 5, 6]); ans = (L.state.lang === "en" ? WORDS[len][rnd(WORDS[len].length)] : ZHWORDS[len][rnd(ZHWORDS[len].length)]).split(""); }
      instr(host, L, "Rearrange the tiles to read: " + ans.join(""), "把碎片排好,讀出:" + ans.join(""));
      var order = shuffle(ans.slice()); while (order.join("") === ans.join("")) order = shuffle(ans.slice());
      var sel = -1, rowEl = mk("div", kind === "num" ? "mg-jig" : "mg-row mg-row--center");
      function repaint() {
        rowEl.innerHTML = "";
        order.forEach(function (ch, i) {
          var tEl = mk("button", "mg-tile" + (i === sel ? " mg-tile--sel" : ""), ch); tEl.type = "button";
          tEl.addEventListener("click", function () {
            if (sel === -1) sel = i; else { var tmp = order[sel]; order[sel] = order[i]; order[i] = tmp; sel = -1; }
            repaint();
            if (order.join("") === ans.join("")) { [].forEach.call(rowEl.querySelectorAll(".mg-tile"), function (x) { x.classList.add("mg-tile--ok"); x.disabled = true; }); win(host, L); }
          });
          rowEl.appendChild(tEl);
        });
      }
      repaint(); host.appendChild(rowEl);
      host.appendChild(mk("div", "mg-hint", tx(L, "Click two tiles to swap them.", "點兩個碎片即可交換位置。")));
    };
  }

  /* match the lights pattern; switch count scales */
  function switchesGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var n = D(diff, [3, 4, 5, 6]);
      var target = []; for (var i = 0; i < n; i++) target.push(rnd(2) === 1);
      if (target.every(function (x) { return !x; })) target[0] = true;
      instr(host, L, o.instr.en, o.instr.zh);
      var tgt = mk("div", "mg-targetlights");
      target.forEach(function (on) { tgt.appendChild(mk("span", "mg-tl" + (on ? " mg-tl--on" : ""), on ? "●" : "○")); });
      host.appendChild(mk("div", "mg-hint", tx(L, "Match this pattern:", "把開關設成這個樣式:"))); host.appendChild(tgt);
      var lamp = mk("div", "mg-lamp"); lamp.innerHTML = '<span class="material-symbols-rounded">' + (o.icon || "lightbulb") + "</span>";
      var st = target.map(function () { return false; }), sw = mk("div", "mg-row mg-row--center");
      st.forEach(function (_, i) {
        var b = mk("button", "mg-switch", "OFF"); b.type = "button"; b.dataset.want = target[i] ? "1" : "0";
        b.addEventListener("click", function () { st[i] = !st[i]; b.textContent = st[i] ? "ON" : "OFF"; b.classList.toggle("mg-switch--on", st[i]);
          var match = st.every(function (x, j) { return x === target[j]; }); lamp.classList.toggle("mg-lamp--on", match); if (match) win(host, L); });
        sw.appendChild(b);
      });
      host.appendChild(lamp); host.appendChild(sw);
    };
  }

  /* press buttons in the shown order; length + button count scale */
  function seqPressGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var nBtn = D(diff, [2, 3, 3, 4]), len = D(diff, [3, 4, 5, 6]);
      var labels = (o.labels || ["①", "②", "③", "④"]).slice(0, nBtn);
      var order = []; for (var i = 0; i < len; i++) order.push(rnd(nBtn));
      instr(host, L, o.instr.en, o.instr.zh);
      host.appendChild(mk("div", "mg-coded", order.map(function (i) { return labels[i]; }).join(" → ")));
      var pos = 0, box = mk("div", "mg-row mg-row--center");
      labels.forEach(function (lab, i) {
        var b = mk("button", "mg-pick", lab); b.type = "button";
        b.addEventListener("click", function () {
          if (i === order[pos]) { pos++; b.classList.add("mg-pick--ok"); setTimeout(function () { b.classList.remove("mg-pick--ok"); }, 220); if (pos === order.length) win(host, L); }
          else { pos = 0; b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); }
        });
        box.appendChild(b);
      });
      host.appendChild(box);
    };
  }

  /* connect pairs; count scales */
  function matchGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var n = D(diff, [3, 4, 5, 6]); var all = (o.pairs[L.state.lang] || o.pairs.en).slice();
      var pairs = shuffle(all).slice(0, Math.min(n, all.length));
      instr(host, L, o.instr.en, o.instr.zh);
      var rights = shuffle(pairs.map(function (p, i) { return { txt: p[1], idx: i }; })), sel = null, done = 0;
      var grid = mk("div", "mg-match"), left = mk("div", "mg-match__col"), right = mk("div", "mg-match__col");
      pairs.forEach(function (p, i) {
        var l = mk("button", "mg-match__item mg-match__sym", p[0]); l.type = "button"; l.dataset.idx = i;
        l.addEventListener("click", function () { if (l.classList.contains("mg-match__item--ok")) return; [].forEach.call(left.children, function (x) { x.classList.remove("mg-match__item--sel"); }); l.classList.add("mg-match__item--sel"); sel = i; });
        left.appendChild(l);
      });
      rights.forEach(function (o2) {
        var rb = mk("button", "mg-match__item", o2.txt); rb.type = "button"; rb.dataset.idx = o2.idx;
        rb.addEventListener("click", function () {
          if (sel === null || rb.classList.contains("mg-match__item--ok")) return;
          if (o2.idx === sel) { rb.classList.add("mg-match__item--ok"); var l = left.querySelector('[data-idx="' + sel + '"]'); l.classList.remove("mg-match__item--sel"); l.classList.add("mg-match__item--ok"); sel = null; done++; if (done === pairs.length) win(host, L); }
          else { rb.classList.add("mg-shake"); setTimeout(function () { rb.classList.remove("mg-shake"); }, 400); }
        });
        right.appendChild(rb);
      });
      grid.appendChild(left); grid.appendChild(right); host.appendChild(grid);
    };
  }

  /* memory pairs; count scales */
  function memoryGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var n = D(diff, [3, 4, 6, 8]); var syms = o.syms.slice(0, Math.min(n, o.syms.length));
      while (syms.length < n) syms.push(o.syms[syms.length % o.syms.length] + "​".repeat(syms.length)); /* pad uniquely if pool small */
      instr(host, L, "Flip two cards at a time to find all matching pairs.", "一次翻兩張卡,找出所有相同的配對。");
      var deck = shuffle(syms.concat(syms)), grid = mk("div", "mg-mem-grid"), first = null, lock = false, matched = 0;
      deck.forEach(function (s) {
        var c = mk("button", "mg-mem"); c.type = "button"; c.dataset.s = s; c.appendChild(mk("span", "mg-mem__back", "?")); c.appendChild(mk("span", "mg-mem__face", s.replace(/​/g, "")));
        c.addEventListener("click", function () {
          if (lock || c.classList.contains("mg-mem--up") || c.classList.contains("mg-mem--done")) return;
          c.classList.add("mg-mem--up");
          if (!first) { first = c; return; }
          if (first.dataset.s === c.dataset.s) { first.classList.add("mg-mem--done"); c.classList.add("mg-mem--done"); matched++; first = null; if (matched === syms.length) win(host, L); }
          else { lock = true; var a = first, b = c; first = null; setTimeout(function () { a.classList.remove("mg-mem--up"); b.classList.remove("mg-mem--up"); lock = false; }, 700); }
        });
        grid.appendChild(c);
      });
      host.appendChild(grid);
    };
  }

  /* navigation; maze (walls) or spatial (clue). grid size scales */
  function navGame(kind) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var n = D(diff, [5, 6, 7, 8]);
      var walls = kind === "maze" ? genMaze(n, D(diff, [0.18, 0.24, 0.30, 0.34])) : {};
      var start = { r: n - 1, c: 0 }, pos = { r: n - 1, c: 0 }, goal;
      if (kind === "maze") { start = { r: 0, c: 0 }; pos = { r: 0, c: 0 }; goal = { r: n - 1, c: n - 1 }; }
      else { var up = 1 + rnd(n - 1), rt = rnd(n); goal = { r: n - 1 - up, c: rt };
        instr(host, L, "Follow the clue from ◆ to ★: North " + up + ", East " + rt + ".", "依線索從 ◆ 走到 ★:北 " + up + "、東 " + rt + "。"); }
      if (kind === "maze") instr(host, L, "Steer from the start to the exit (★). Walls block you.", "從起點走到出口(★),牆壁會擋路。");
      var board = mk("div", "mg-board"); board.style.setProperty("--n", n);
      function paint() {
        board.innerHTML = "";
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
          var cell = mk("div", "mg-board-cell");
          if (walls[r + "," + c]) cell.classList.add("mg-board-cell--wall");
          else if (r === pos.r && c === pos.c) { cell.classList.add("mg-board-cell--me"); cell.textContent = "◆"; }
          else if (r === goal.r && c === goal.c) { cell.classList.add("mg-board-cell--goal"); cell.textContent = "★"; }
          board.appendChild(cell);
        }
      }
      function move(dr, dc) { var nr = pos.r + dr, nc = pos.c + dc; if (nr < 0 || nr >= n || nc < 0 || nc >= n || walls[nr + "," + nc]) return; pos.r = nr; pos.c = nc; paint(); if (pos.r === goal.r && pos.c === goal.c) win(host, L); }
      paint(); host.appendChild(board);
      var pad = mk("div", "mg-dpad");
      [["north", -1, 0, "↑"], ["west", 0, -1, "←"], ["south", 1, 0, "↓"], ["east", 0, 1, "→"]].forEach(function (d) { var b = btn("mg-dpad__btn mg-dpad__btn--" + d[0], d[3]); b.addEventListener("click", function () { move(d[1], d[2]); }); pad.appendChild(b); });
      host.appendChild(pad);
    };
  }

  /* extend slider into a target zone; zone narrows with difficulty */
  function sliderGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var w = D(diff, [40, 24, 16, 10]), lo = 100 - w - rnd(Math.max(1, 30 - w)) , hi = lo + w; if (hi > 100) { hi = 100; lo = 100 - w; }
      instr(host, L, o.instr.en, o.instr.zh);
      var stage = mk("div", "mg-slide");
      var zone = mk("div", "mg-slide__zone"); zone.style.left = lo + "%"; zone.style.width = (hi - lo) + "%";
      var fill = mk("div", "mg-slide__fill"), prize = mk("div", "mg-slide__prize"); prize.innerHTML = '<span class="material-symbols-rounded">' + (o.icon || "key") + "</span>";
      stage.appendChild(zone); stage.appendChild(fill); stage.appendChild(prize); host.appendChild(stage);
      var sl = mk("input", "mg-range"); sl.type = "range"; sl.min = "0"; sl.max = "100"; sl.value = "0";
      sl.dataset.lo = lo; sl.dataset.hi = hi;
      sl.addEventListener("input", function () { fill.style.width = sl.value + "%"; });
      host.appendChild(sl);
      var lock = btn("mg-btn--primary", tx(L, "Lock it", "卡住!")), fb = feedback();
      lock.addEventListener("click", function () { var v = parseInt(sl.value, 10); if (v >= lo && v <= hi) { prize.classList.add("mg-slide__prize--got"); lock.disabled = true; win(host, L); } else fb.textContent = "❌"; });
      var r = row("mg-row--center"); r.appendChild(lock); r.appendChild(fb); host.appendChild(r);
      host.appendChild(mk("div", "mg-hint", tx(L, "Stop inside the lit zone.", "停在亮起的區段內。")));
    };
  }

  /* Simon; sequence length + speed scale */
  function simonGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var freqs = [330, 392, 494, 587], colors = ["#c0392b", "#27ae60", "#2980b9", "#d4a017"];
      var len = D(diff, [3, 4, 5, 6]), gap = D(diff, [520, 450, 380, 320]), seq = [], inp = [], locked = true;
      for (var i = 0; i < len; i++) seq.push(rnd(4));
      instr(host, L, "Press Play, watch the flashes, then repeat the sequence.", "按播放、看閃光順序,再依序點按色塊重現它。");
      var ac = null;
      function beep(f) { try { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; if (!ac) ac = new AC(); if (ac.state === "suspended") ac.resume(); var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.connect(g); g.connect(ac.destination); g.gain.value = 0.07; o.start(); o.stop(ac.currentTime + 0.22); } catch (e) {} }
      var padsBox = mk("div", "mg-pads"), pads = [];
      function flash(i) { pads[i].classList.add("mg-pad--lit"); beep(freqs[i]); setTimeout(function () { pads[i].classList.remove("mg-pad--lit"); }, gap * 0.6); }
      for (var k = 0; k < 4; k++) (function (k) {
        var p = mk("button", "mg-pad"); p.type = "button"; p.style.setProperty("--pad", colors[k]);
        p.addEventListener("click", function () { if (locked) return; flash(k); inp.push(k); if (seq[inp.length - 1] !== k) { inp = []; fb.textContent = tx(L, "❌ try again", "❌ 再試一次"); return; } if (inp.length === seq.length) { locked = true; win(host, L); } });
        pads.push(p); padsBox.appendChild(p);
      })(k);
      var play = btn("mg-btn--primary", "▶ " + tx(L, "Play", "播放")), fb = feedback();
      play.addEventListener("click", function () { locked = true; inp = []; fb.textContent = ""; seq.forEach(function (s, i) { setTimeout(function () { flash(s); if (i === seq.length - 1) setTimeout(function () { locked = false; }, gap * 0.7); }, gap * i); }); });
      host.appendChild(padsBox);
      var r = row("mg-row--center"); r.appendChild(play); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* drag the magnet to the key; catch radius shrinks with difficulty */
  function magnetGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, "The key is behind the bars. Drag the magnet close to pull it out.", "鑰匙在欄杆後面。把磁鐵拖近鑰匙,就能吸出來。");
      var radius = D(diff, [52, 42, 32, 24]);
      var stage = mk("div", "mg-reach"); var bars = mk("div", "mg-reach__bars"), key = mk("div", "mg-reach__key"), mag = mk("div", "mg-reach__magnet", "🧲");
      key.innerHTML = '<span class="material-symbols-rounded">key</span>'; key.style.top = (20 + rnd(60)) + "%";
      stage.appendChild(bars); stage.appendChild(key); stage.appendChild(mag); host.appendChild(stage);
      var won = false, dragging = false;
      mag.addEventListener("pointerdown", function (e) { dragging = true; mag.setPointerCapture(e.pointerId); mag.classList.add("mg-reach__magnet--grab"); });
      mag.addEventListener("pointerup", function () { dragging = false; mag.classList.remove("mg-reach__magnet--grab"); });
      mag.addEventListener("pointermove", function (e) {
        if (!dragging || won) return;
        var box = stage.getBoundingClientRect(), x = Math.max(0, Math.min(box.width, e.clientX - box.left)), y = Math.max(0, Math.min(box.height, e.clientY - box.top));
        mag.style.left = x + "px"; mag.style.top = y + "px";
        var kb = key.getBoundingClientRect(), dx = e.clientX - (kb.left + kb.width / 2), dy = e.clientY - (kb.top + kb.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < radius) { won = true; dragging = false; key.style.right = "auto"; key.style.transform = "none"; key.style.left = x + "px"; key.style.top = y + "px"; key.classList.add("mg-reach__key--pulled"); win(host, L); }
      });
    };
  }

  /* relay; symbol pool scales */
  function relayGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var pool = ["▲", "●", "■", "★", "◆", "✚", "❄", "♣"], n = D(diff, [4, 5, 6, 8]), syms = pool.slice(0, n), secret = syms[rnd(syms.length)];
      instr(host, L, "Room A holds a secret symbol — peek, then press the matching button in Room B.", "A 房有一個祕密符號——先偷看,再到 B 房按下相符的按鈕。");
      var grid = mk("div", "mg-coop"), aRoom = mk("div", "mg-coop__room"); aRoom.appendChild(mk("div", "mg-coop__label", tx(L, "Room A", "A 房")));
      var peek = btn(null, tx(L, "👁 Peek", "👁 偷看")), aShow = mk("div", "mg-coop__secret", "?");
      peek.addEventListener("mousedown", function () { aShow.textContent = secret; }); peek.addEventListener("mouseup", function () { aShow.textContent = "?"; }); peek.addEventListener("mouseleave", function () { aShow.textContent = "?"; });
      aRoom.appendChild(aShow); aRoom.appendChild(peek);
      var bRoom = mk("div", "mg-coop__room"); bRoom.appendChild(mk("div", "mg-coop__label", tx(L, "Room B", "B 房")));
      var bBtns = mk("div", "mg-row mg-row--center");
      shuffle(syms.slice()).forEach(function (s) { var b = btn("mg-coop__pick", s); b.addEventListener("click", function () { if (s === secret) { b.classList.add("mg-match__item--ok"); win(host, L); } else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); } }); bBtns.appendChild(b); });
      bRoom.appendChild(bBtns); grid.appendChild(aRoom); grid.appendChild(bRoom); host.appendChild(grid);
    };
  }

  /* hold all buttons at once; button count scales */
  function syncGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var n = D(diff, [2, 2, 3, 4]);
      instr(host, L, "It takes a team: hold ALL " + n + " buttons down at the same time.", "需要團隊:同時按住全部 " + n + " 個按鈕。");
      var down = [], doneFlag = false, box = mk("div", "mg-row mg-row--center");
      function chk() { if (down.every(function (x) { return x; }) && !doneFlag) { doneFlag = true; win(host, L); } }
      for (var i = 0; i < n; i++) { down.push(false); (function (i) {
        var bt = mk("button", "mg-pick mg-sync", String.fromCharCode(65 + i)); bt.type = "button";
        bt.addEventListener("mousedown", function () { down[i] = true; bt.classList.add("mg-pick--ok"); chk(); });
        bt.addEventListener("mouseup", function () { down[i] = false; bt.classList.remove("mg-pick--ok"); });
        bt.addEventListener("mouseleave", function () { down[i] = false; bt.classList.remove("mg-pick--ok"); });
        bt.addEventListener("touchstart", function (e) { e.preventDefault(); down[i] = true; bt.classList.add("mg-pick--ok"); chk(); }, { passive: false });
        bt.addEventListener("touchend", function () { down[i] = false; bt.classList.remove("mg-pick--ok"); });
        box.appendChild(bt);
      })(i); }
      host.appendChild(box);
    };
  }

  /* branching dialogue; step count scales (correct option stays first) */
  function dialogueGame() {
    var bankEn = [
      { npc: "A guard blocks the door: “Nobody passes without a pass.”", opts: [["Show the forged pass confidently", true], ["Shout and shove past him", false], ["Admit you have no pass", false]] },
      { npc: "Inside, a clerk asks: “And you are…?”", opts: [["“The new inspector — here for the audit.”", true], ["Stay silent and sweat", false], ["“Just looking around.”", false]] },
      { npc: "A colleague frowns: “I don't recognise you.”", opts: [["“I transferred in last week — ask HR.”", true], ["Run for the exit", false], ["“None of your business.”", false]] },
      { npc: "The director offers a handshake: “Your credentials?”", opts: [["Hand over the badge calmly", true], ["Drop everything and bolt", false], ["“I left them at home.”", false]] }
    ];
    var bankZh = [
      { npc: "守衛擋住門口:「沒有通行證不准過。」", opts: [["自信地出示偽造通行證", true], ["大吼著硬推過去", false], ["老實說你沒有通行證", false]] },
      { npc: "進門後職員問:「請問您是…?」", opts: [["「新來的督察,來做稽核的。」", true], ["沉默不語、冒冷汗", false], ["「只是隨便看看。」", false]] },
      { npc: "同事皺眉:「我不認得你耶。」", opts: [["「我上週剛調來,問人資就知道。」", true], ["拔腿往出口跑", false], ["「不關你的事。」", false]] },
      { npc: "主管伸手:「證件給我看一下?」", opts: [["鎮定地遞出識別證", true], ["丟下東西就衝出去", false], ["「我證件放在家裡。」", false]] }
    ];
    return function (host, L, diff) {
      badge(host, L, diff);
      var k = D(diff, [2, 2, 3, 4]); var steps = (L.state.lang === "en" ? bankEn : bankZh).slice(0, k);
      instr(host, L, "Stay in character. Pick the response that keeps your cover.", "保持角色設定,選出能繼續掩飾身分的回應。");
      var i = 0, npc = mk("div", "mg-rp__npc"), opts = mk("div", "mg-rp__opts"), fb = mk("div", "mg-fb");
      function rndr() {
        var st = steps[i]; npc.textContent = st.npc; opts.innerHTML = ""; fb.textContent = "";
        st.opts.forEach(function (o) { var b = btn("mg-rp__opt", o[0]); b.addEventListener("click", function () {
          if (o[1]) { i++; if (i >= steps.length) { opts.innerHTML = ""; npc.textContent = tx(L, "You are through. 🎭", "你順利過關了。🎭"); win(host, L); } else rndr(); }
          else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); fb.textContent = tx(L, "That blows your cover — try another line.", "這樣會露餡——換一句試試。"); }
        }); opts.appendChild(b); });
      }
      rndr(); host.appendChild(npc); host.appendChild(opts); host.appendChild(fb);
    };
  }

  /* chained arithmetic; step count scales, final code = concatenated digits */
  function multistepGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var k = D(diff, [2, 2, 3, 4]);
      instr(host, L, "Linked steps — solve each; the digits combine into the final code.", "相扣的步驟——逐步解開,各位數字組成最終密碼。");
      var digits = [];
      var stepsWrap = mk("div");
      var finalWrap = mk("div", "mg-step mg-step--locked");
      function makeStep(idx) {
        var mid = 1 + rnd(9), a = 1 + rnd(Math.max(1, mid)), b = mid - a; if (b < 0) { a = mid; b = 0; }
        var s = mk("div", "mg-step" + (idx === 0 ? "" : " mg-step--locked"));
        s.appendChild(mk("div", "mg-step__label", tx(L, "Step " + (idx + 1), "第 " + (idx + 1) + " 步")));
        s.appendChild(mk("div", "mg-step__q", a + " + " + b + " = ?"));
        var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = "?"; inp.disabled = idx !== 0;
        var c = btn("mg-btn--primary", tx(L, "OK", "確認")); c.disabled = idx !== 0; var f = feedback();
        var r = row(); r.appendChild(inp); r.appendChild(c); r.appendChild(f); s.appendChild(r);
        c.addEventListener("click", function () {
          if (parseInt(inp.value, 10) === mid) { f.textContent = "✅"; c.disabled = inp.disabled = true; digits[idx] = mid;
            if (idx + 1 < k) { var ns = stepsWrap.children[idx + 1]; ns.classList.remove("mg-step--locked"); ns.querySelector(".mg-input").disabled = false; ns.querySelector(".mg-btn").disabled = false; }
            else { finalWrap.classList.remove("mg-step--locked"); var fi = finalWrap.querySelector(".mg-input"), fbn = finalWrap.querySelector(".mg-btn"); fi.disabled = false; fbn.disabled = false; finalWrap.querySelector(".mg-step__q").textContent = tx(L, "Enter the digits in order → " + digits.join(""), "依序輸入各位數字 → " + digits.join("")); }
          } else f.textContent = "❌";
        });
        return s;
      }
      for (var idx = 0; idx < k; idx++) stepsWrap.appendChild(makeStep(idx));
      host.appendChild(stepsWrap);
      finalWrap.appendChild(mk("div", "mg-step__label", tx(L, "Final code", "最終密碼")));
      finalWrap.appendChild(mk("div", "mg-step__q", tx(L, "Solve the steps above first.", "請先解開上面的步驟。")));
      var fi = mk("input", "mg-input"); fi.type = "text"; fi.maxLength = k; fi.placeholder = "#".repeat(k); fi.disabled = true;
      var fbn = btn("mg-btn--primary", tx(L, "Unlock", "解鎖")); fbn.disabled = true; var ff = feedback();
      var fr = row(); fr.appendChild(fi); fr.appendChild(fbn); fr.appendChild(ff); finalWrap.appendChild(fr);
      fbn.addEventListener("click", function () { if (fi.value.trim() === digits.join("")) { fbn.disabled = true; win(host, L); } else ff.textContent = "❌"; });
      host.appendChild(finalWrap);
    };
  }

  /* acrostic; line count scales */
  function acrosticGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      var k = D(diff, [3, 4, 5, 6]), all = (o[L.state.lang] || o.en), lines = all.slice(0, k);
      instr(host, L, "Read the FIRST character of each line, top to bottom. Click the lines in order.", "讀每一行的第一個字(由上而下)。依序點選每一行。");
      var next = 0, prog = mk("div", "mg-acro-prog", "—"), box = mk("div", "mg-acro");
      lines.forEach(function (s, i) {
        var b = mk("button", "mg-acro-line"); b.type = "button"; b.appendChild(mk("b", "mg-acro-first", s.charAt(0))); b.appendChild(mk("span", null, s.slice(1)));
        b.addEventListener("click", function () {
          if (i === next) { b.classList.add("mg-acro-line--on"); next++; prog.textContent = lines.slice(0, next).map(function (x) { return x.charAt(0); }).join(""); if (next === lines.length) { prog.classList.add("mg-cipher--ok"); win(host, L); } }
          else { next = 0; [].forEach.call(box.querySelectorAll(".mg-acro-line"), function (x) { x.classList.remove("mg-acro-line--on"); }); prog.textContent = tx(L, "(start from the top)", "(從第一行重新點起)"); }
        });
        box.appendChild(b);
      });
      host.appendChild(box); host.appendChild(mk("div", "mg-hint", tx(L, "Spelled so far:", "目前拼出:"))); host.appendChild(prog);
    };
  }

  /* search the grid; size scales */
  function searchGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, o.instr.en, o.instr.zh);
      var n = D(diff, [8, 12, 16, 20]), keyAt = rnd(n), found = false, grid = mk("div", "mg-grid mg-grid--4");
      for (var i = 0; i < n; i++) (function (i) {
        var b = btn("mg-cell"); b.innerHTML = '<span class="material-symbols-rounded">' + o.icons[i % o.icons.length] + "</span>";
        b.addEventListener("click", function () { if (found || b.classList.contains("mg-cell--open")) return; b.classList.add("mg-cell--open");
          if (i === keyAt) { b.classList.add("mg-cell--hit"); b.innerHTML = '<span class="material-symbols-rounded">' + o.target + "</span>"; found = true; win(host, L); } else b.innerHTML = '<span class="mg-empty">·</span>'; });
        grid.appendChild(b);
      })(i);
      host.appendChild(grid);
    };
  }

  /* reveal hidden code (UV / mirror / overlay); code length scales */
  function revealGame(o) {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, o.instr.en, o.instr.zh);
      var code = randDigits(D(diff, [3, 4, 5, 6]));
      var panel = mk("div", "mg-uv" + (o.mirror ? " mg-uv--mirror" : "")); panel.appendChild(mk("span", "mg-uv__code", code));
      var toggle = btn("mg-btn--ghost", o.btn[L.state.lang] || o.btn.en);
      if (o.hold) { var on = function () { panel.classList.add("mg-uv--on"); }, off = function () { panel.classList.remove("mg-uv--on"); };
        toggle.addEventListener("mousedown", on); toggle.addEventListener("mouseup", off); toggle.addEventListener("mouseleave", off);
        toggle.addEventListener("touchstart", function (e) { e.preventDefault(); on(); }, { passive: false }); toggle.addEventListener("touchend", off); }
      else toggle.addEventListener("click", function () { panel.classList.toggle("mg-uv--on"); });
      host.appendChild(panel); host.appendChild(toggle);
      inputRow(host, L, code, null, tx(L, "code", "密碼"));
    };
  }

  /* highlighted letters; word + distractor count scale */
  function highlightGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var total = D(diff, [6, 8, 10, 12]), hiN = D(diff, [3, 4, 4, 5]);
      var letters = randLetters(total).split(""), idx = shuffle(letters.map(function (_, i) { return i; })).slice(0, hiN).sort(function (a, b) { return a - b; });
      instr(host, L, "Some letters are highlighted. Read the highlighted ones in order and type the word.", "有些字母被標色了。依序讀出標色的字母,拼成單字輸入。");
      var rowEl = mk("div", "mg-letters");
      letters.forEach(function (ch, i) { rowEl.appendChild(mk("span", "mg-letter" + (idx.indexOf(i) !== -1 ? " mg-hl" : ""), ch)); });
      host.appendChild(rowEl);
      inputRow(host, L, idx.map(function (i) { return letters[i]; }).join(""), null, "?");
    };
  }

  /* punch-card mask; grid size scales */
  function maskGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var n = D(diff, [3, 3, 4, 4]), total = n * n, holesN = D(diff, [3, 4, 5, 6]);
      var letters = randLetters(total).split(""), holes = shuffle(letters.map(function (_, i) { return i; })).slice(0, holesN).sort(function (a, b) { return a - b; });
      instr(host, L, "Lay the punched mask over the grid, read the letters showing through the holes.", "把挖孔卡蓋上,讀出從孔洞露出的字母。");
      var grid = mk("div", "mg-mask"); grid.style.setProperty("--mn", n);
      letters.forEach(function (ch) { grid.appendChild(mk("div", "mg-mask__cell", ch)); });
      host.appendChild(grid);
      var toggle = btn(null, tx(L, "Place / lift the mask", "蓋上 / 掀開挖孔卡"));
      toggle.addEventListener("click", function () { var on = grid.classList.toggle("mg-mask--on"); [].forEach.call(grid.children, function (c, i) { c.classList.toggle("mg-mask__cell--hole", on && holes.indexOf(i) !== -1); }); });
      host.appendChild(toggle);
      inputRow(host, L, holes.map(function (i) { return letters[i]; }).join(""), null, "?");
    };
  }

  /* ghost-leg; columns + levels scale */
  function ghostlegGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, "Ghost-leg: pick the TOP that traces down to the ★.", "鬼腳圖:選出能一路走到 ★ 的頂端。");
      var cols = D(diff, [3, 3, 4, 5]), levels = D(diff, [4, 5, 6, 7]);
      var W = 60 + cols * 56, gx = []; for (var i = 0; i < cols; i++) gx.push(34 + i * 56);
      var topY = 22, botY = 22 + levels * 24 + 24, H = botY + 30;
      var rungs = []; for (var lv = 0; lv < levels; lv++) rungs.push({ lvl: lv, col: rnd(cols - 1) });
      function walk(t) { var c = t; for (var lv = 0; lv < levels; lv++) rungs.forEach(function (r) { if (r.lvl === lv) { if (c === r.col) c = r.col + 1; else if (c === r.col + 1) c = r.col; } }); return c; }
      var prize = rnd(cols);
      var svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="mg-ghostleg">';
      gx.forEach(function (x) { svg += '<line x1="' + x + '" y1="' + topY + '" x2="' + x + '" y2="' + botY + '" class="gl-line"/>'; });
      rungs.forEach(function (r) { var y = topY + (botY - topY) * (r.lvl + 1) / (levels + 1); svg += '<line x1="' + gx[r.col] + '" y1="' + y + '" x2="' + gx[r.col + 1] + '" y2="' + y + '" class="gl-rung"/>'; });
      svg += '<text x="' + gx[prize] + '" y="' + (botY + 18) + '" text-anchor="middle" class="gl-star">★</text></svg>';
      var wrap = mk("div"); wrap.innerHTML = svg; host.appendChild(wrap);
      var picks = mk("div", "mg-row mg-row--center");
      for (var t = 0; t < cols; t++) (function (t) { var b = btn("mg-pick", String.fromCharCode(65 + t)); b.addEventListener("click", function () { if (walk(t) === prize) { b.classList.add("mg-pick--ok"); win(host, L); } else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); } }); picks.appendChild(b); })(t);
      host.appendChild(picks);
    };
  }

  /* counting; item count + colours scale */
  function countGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      var palette = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"], colors = palette.slice(0, D(diff, [3, 4, 5, 6])), target = colors[rnd(colors.length)];
      var nItems = D(diff, [10, 14, 18, 24]), cells = [], count = 0;
      for (var i = 0; i < nItems; i++) { var e = colors[rnd(colors.length)]; if (e === target) count++; cells.push(e); }
      if (count === 0) { cells[0] = target; count = 1; }
      instr(host, L, "Count how many " + target + " there are, then enter the number.", "數一數有幾個 " + target + ",然後輸入數量。");
      host.appendChild(mk("div", "mg-count", cells.join(" ")));
      inputRow(host, L, String(count), "90px", "#");
    };
  }

  /* arithmetic; complexity scales */
  function arithGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, "Work out the answer to unlock the code.", "算出答案來解出密碼。");
      var expr, ans;
      if (diff <= 1) { var a = 4 + rnd(6), b = 1 + rnd(9); expr = a + " + " + b; ans = a + b; }
      else if (diff === 2) { var a2 = 3 + rnd(7), b2 = 2 + rnd(7), c2 = 1 + rnd(8); expr = a2 + " × " + b2 + " + " + c2; ans = a2 * b2 + c2; }
      else if (diff === 3) { var a3 = 4 + rnd(8), b3 = 2 + rnd(8), c3 = 2 + rnd(6); expr = a3 + " × " + b3 + " − " + c3; ans = a3 * b3 - c3; }
      else { var a4 = 5 + rnd(6), b4 = 2 + rnd(5), c4 = 2 + rnd(6), d4 = 1 + rnd(9); expr = a4 + " × " + b4 + " + " + c4 + " × " + d4; ans = a4 * b4 + c4 * d4; }
      host.appendChild(mk("div", "mg-cipher", expr + " = ?"));
      inputRow(host, L, String(ans), "90px", "?");
    };
  }

  /* number sequence; arithmetic or geometric, harder steps with difficulty */
  function sequenceGame() {
    return function (host, L, diff) {
      badge(host, L, diff);
      instr(host, L, "Find the pattern and enter the next number.", "找出規律,輸入下一個數字。");
      var shown = D(diff, [4, 4, 5, 5]), seq = [], next;
      var geo = (diff >= 3) ? (rnd(2) === 1) : (diff === 2);
      if (geo) { var start = 1 + rnd(3), ratio = D(diff, [2, 2, 2, 3]); seq.push(start); for (var i = 1; i < shown; i++) seq.push(seq[i - 1] * ratio); next = seq[shown - 1] * ratio; }
      else { var s0 = 1 + rnd(5), step = D(diff, [2, 3, 4, 7]); seq.push(s0); for (var j = 1; j < shown; j++) seq.push(seq[j - 1] + step); next = seq[shown - 1] + step; }
      host.appendChild(mk("div", "mg-cipher", seq.join(", ") + ", ?"));
      inputRow(host, L, String(next), "90px", "?");
    };
  }

  /* helper for pickGame configs */
  function shapeGrid(diff) { return D(diff, ["mg-grid mg-grid--4", "mg-grid mg-grid--4", "mg-grid mg-grid--4", "mg-grid mg-grid--4"]); }

  /* =====================================================================
     CATALOG
     ===================================================================== */
  var M = {};

  M.search = [
    { id: "sweep", name: nm("Sweep search", "地毯式搜索"), build: searchGame({ instr: nm("Search the spots — one hides the key. Click to look.", "搜索這些地方,其中一個藏了鑰匙。點擊翻找。"), icons: ["chair", "book_2", "umbrella", "bed", "weekend", "wall_art", "door_open", "luggage", "checkroom", "inventory_2", "window", "desk"], target: "key" }) },
    { id: "odd", name: nm("Spot the odd one", "找出不一樣的"),
      build: pickGame(function (diff) {
        var n = D(diff, [9, 12, 16, 20]), odd = rnd(n), pair = D(diff, [["🟦", "🟪"], ["🟦", "🟪"], ["🟦", "🟫"], ["🟦", "🟦"]]);
        var items = []; for (var i = 0; i < n; i++) items.push({ text: i === odd ? pair[1] : pair[0], ok: i === odd, cls: "mg-cell" });
        return { instr: nm("Everything looks the same — click the ONE tile that is different.", "看起來都一樣——點出唯一不一樣的那一格。"), cls: shapeGrid(diff), items: items };
      }) }
  ];

  M.ciphers = [
    { id: "caesar", name: nm("Caesar shift", "凱撒密碼"), build: caesarGame() },
    { id: "morse", name: nm("Morse code", "摩斯密碼"), build: decoderGame({ instr: nm("Decode the Morse signals into letters.", "把摩斯訊號解成字母。"), keyLabel: nm("Morse → letter", "摩斯 → 字母"), pool: [["·", "E"], ["−", "T"], ["·−", "A"], ["−·−", "K"], ["−·−−", "Y"], ["···", "S"], ["−−−", "O"], ["·−·", "R"], ["−··", "D"]] }) },
    { id: "substitution", name: nm("Substitution (Pigpen)", "替換密碼(豬圈)"), build: decoderGame({ instr: nm("Each symbol stands for a letter. Decode the word.", "每個符號代表一個字母,解出單字。"), keyLabel: nm("Symbol → letter", "符號 → 字母"), pool: [["✦", "K"], ["✿", "E"], ["❄", "Y"], ["♣", "A"], ["✚", "T"], ["◆", "S"], ["●", "O"], ["▲", "R"]] }) },
    { id: "binary", name: nm("Binary / ASCII", "二進位"), build: bitGame() },
    { id: "zhuyin", name: nm("Zhuyin key", "注音對照"), build: decoderGame({ instr: nm("Use the Zhuyin key to turn the symbols into digits.", "用注音對照表把符號轉成數字。"), keyLabel: nm("Zhuyin → digit", "注音 → 數字"), pool: [["ㄅ", "1"], ["ㄆ", "2"], ["ㄇ", "3"], ["ㄈ", "4"], ["ㄉ", "5"], ["ㄊ", "6"], ["ㄋ", "7"], ["ㄌ", "8"]] }) },
    { id: "cards", name: nm("Playing cards", "撲克牌"), build: decoderGame({ instr: nm("Each card is a number. Read them in order.", "每張牌是一個數字,依序讀出。"), keyLabel: nm("Card → number", "牌 → 數字"), pool: [["A♠", "1"], ["2♥", "2"], ["3♣", "3"], ["5♦", "5"], ["7♣", "7"], ["9♦", "9"]] }) },
    { id: "zodiac", name: nm("Chinese zodiac", "十二生肖"), build: decoderGame({ instr: nm("Each zodiac animal is its order number.", "每個生肖代表牠的排序數字。"), keyLabel: nm("Zodiac → order", "生肖 → 序號"), pool: [["鼠", "1"], ["牛", "2"], ["虎", "3"], ["兔", "4"], ["龍", "5"], ["馬", "7"], ["猴", "9"]] }) },
    { id: "bagua", name: nm("Eight trigrams (Bagua)", "八卦"), build: decoderGame({ instr: nm("Each trigram is a number. Decode the sequence.", "每個卦象是一個數字,解出序列。"), keyLabel: nm("Trigram → number", "卦象 → 數字"), pool: [["☰", "1"], ["☱", "2"], ["☲", "3"], ["☳", "4"], ["☴", "5"], ["☵", "6"], ["☶", "7"], ["☷", "8"]] }) },
    { id: "color", name: nm("Colour code", "顏色密碼"), build: decoderGame({ instr: nm("Each colour maps to a digit. Read the code.", "每個顏色對應一個數字,讀出密碼。"), keyLabel: nm("Colour → digit", "顏色 → 數字"), pool: [["🔴", "0"], ["🟠", "1"], ["🟡", "2"], ["🟢", "3"], ["🔵", "4"], ["🟣", "5"]] }) }
  ];

  M["hidden-text"] = [
    { id: "acrostic", name: nm("Acrostic", "藏頭詩"), build: acrosticGame({ en: ["Curtains hide a draft", "Look behind the clock", "Under the rug, dust", "Every corner counts", "Search the old desk", "Trust your teammates"], zh: ["密道就在牆後", "室內藏有線索", "逃出全靠鑰匙", "脫困務必冷靜", "鎖頭需要密碼", "鏈條鎖住出口"] }) },
    { id: "highlight", name: nm("Highlighted letters", "標色字母"), build: highlightGame() },
    { id: "mask", name: nm("Punch-card mask", "挖孔密碼板"), build: maskGame() }
  ];

  M.reveal = [
    { id: "uv", name: nm("UV blacklight", "紫外線顯影"), build: revealGame({ instr: nm("Hold the UV light over the panel to reveal a hidden code.", "按住 UV 燈照亮面板,顯現隱藏密碼。"), hold: true, btn: nm("🔦 Hold to shine UV", "🔦 按住照 UV") }) },
    { id: "mirror", name: nm("Mirror writing", "鏡像反字"), build: revealGame({ instr: nm("The code is mirrored. Flip it, then type the real code.", "密碼是鏡像的。翻轉後,輸入正確密碼。"), mirror: true, btn: nm("🪞 Flip in the mirror", "🪞 用鏡子翻轉") }) },
    { id: "overlay", name: nm("Overlay sheets", "投影片疊合"), build: revealGame({ instr: nm("Overlay the two transparencies to reveal the code.", "把兩張投影片疊合,顯現密碼。"), btn: nm("🗂 Overlay the sheets", "🗂 疊合投影片") }) }
  ];

  M.math = [
    { id: "count", name: nm("Count objects", "數數量"), build: countGame() },
    { id: "arith", name: nm("Arithmetic", "算式運算"), build: arithGame() },
    { id: "sequence", name: nm("Number sequence", "數列規律"), build: sequenceGame() }
  ];

  M.logic = [
    { id: "deduce", name: nm("Deduction", "刪去法推理"),
      build: pickGame(function (diff, L) {
        var n = D(diff, [3, 4, 5, 6]); var palette = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#16a085", "#d35400"];
        var sizes = []; for (var i = 0; i < n; i++) sizes.push(34 + i * 7);
        var keyIdx = 0; // smallest non-red — index 0 has smallest size; ensure not red
        var boxes = []; for (var j = 0; j < n; j++) boxes.push({ color: j === 0 ? "#2980b9" : palette[(j + 1) % palette.length], size: sizes[j], ok: j === keyIdx });
        // make sure a red exists among the larger ones
        boxes[n - 1].color = "#c0392b";
        boxes = shuffle(boxes);
        return { instr: nm("One box holds the key. Clues: NOT red, AND the smallest. Click it.", "只有一個盒子有鑰匙。線索:不是紅色、而且是最小的。點出它。"),
          cls: "mg-row mg-row--center", items: boxes.map(function (b) { return { text: "", ok: b.ok, cls: "mg-box", style: "background:" + b.color + ";width:" + b.size + "px;height:" + b.size + "px" }; }) };
      }) },
    { id: "order", name: nm("Order by clue", "排列順序"), build: orderGame("word") },
    { id: "latin", name: nm("Odd cell out", "找出該填的數"),
      build: pickGame(function (diff) {
        var n = D(diff, [3, 4, 5, 6]); var ok = 1 + rnd(n); var items = [];
        for (var i = 1; i <= n; i++) items.push({ label: nm(String(i), String(i)), ok: i === ok });
        return { instr: nm("The row 1…" + n + " is missing one number. Which completes it?", "該列 1…" + n + " 缺一個數字,哪個能補齊?"),
          note: nm("Missing from 1–" + n + " is " + ok + ".", "1–" + n + " 中缺的是 " + ok + "。"), items: items };
      }) }
  ];

  M.assembly = [
    { id: "tiles", name: nm("Reassemble word", "拼回單字"), build: orderGame("word") },
    { id: "jigsaw", name: nm("Number jigsaw", "數字拼圖"), build: orderGame("num") }
  ];

  M.spatial = [
    { id: "follow", name: nm("Follow directions", "依方位走"), build: navGame("spatial") },
    { id: "compass", name: nm("Compass bearing", "指南針方位"),
      build: pickGame(function (diff) {
        var dirs = [nm("NW", "西北"), nm("N", "北"), nm("NE", "東北"), nm("W", "西"), nm("·", "·"), nm("E", "東"), nm("SW", "西南"), nm("S", "南"), nm("SE", "東南")];
        var targets = [0, 2, 6, 8, 1, 3, 5, 7], ti = targets[rnd(D(diff, [2, 4, 6, 8]))];
        var nameEn = ["north-west", "north", "north-east", "west", "centre", "east", "south-west", "south", "south-east"][ti];
        var nameZh = ["西北", "北", "東北", "西", "中", "東", "西南", "南", "東南"][ti];
        return { instr: nm("The treasure is to the " + nameEn.toUpperCase() + " of the centre. Click that cell.", "寶藏在中心的『" + nameZh + "方』。點出那一格。"),
          cls: "mg-board--pick", items: dirs.map(function (d, i) { return { label: d, ok: i === ti }; }) };
      }) }
  ];

  M.maze = [
    { id: "maze", name: nm("Wall maze", "牆面迷宮"), build: navGame("maze") },
    { id: "ghostleg", name: nm("Ghost-leg", "鬼腳圖"), build: ghostlegGame() },
    { id: "laser", name: nm("Align the mirrors", "對準鏡面"), build: switchesGame({ instr: nm("Set the mirror switches to match the beam pattern.", "把鏡面開關設成符合光路的樣式。"), icon: "sensors" }) }
  ];

  M.matching = [
    { id: "shapes", name: nm("Shape ↔ name", "形狀配對"), build: matchGame({ instr: nm("Match each shape to its name.", "把每個形狀和名稱配對。"), pairs: { en: [["▲", "Triangle"], ["■", "Square"], ["●", "Circle"], ["★", "Star"], ["◆", "Diamond"], ["✚", "Cross"]], zh: [["▲", "三角"], ["■", "正方"], ["●", "圓形"], ["★", "星形"], ["◆", "菱形"], ["✚", "十字"]] } }) },
    { id: "colornum", name: nm("Colour ↔ number", "顏色配數字"), build: matchGame({ instr: nm("Match each colour to its number.", "把每個顏色和數字配對。"), pairs: { en: [["🔴", "1"], ["🟢", "2"], ["🔵", "3"], ["🟡", "4"], ["🟣", "5"], ["🟠", "6"]], zh: [["🔴", "1"], ["🟢", "2"], ["🔵", "3"], ["🟡", "4"], ["🟣", "5"], ["🟠", "6"]] } }) },
    { id: "memory", name: nm("Memory pairs", "記憶翻牌"), build: memoryGame({ syms: ["🔑", "🗝", "🔒", "🧩", "💡", "🕯", "🪞", "🧲"] }) }
  ];

  M.audio = [
    { id: "simon", name: nm("Simon sequence", "聲光序列"), build: simonGame() },
    { id: "notes", name: nm("Notes → digits", "音符對數字"), build: decoderGame({ instr: nm("Each note maps to a digit. Read the tune.", "每個音符對應一個數字,讀出旋律。"), keyLabel: nm("Note → digit", "音符 → 數字"), pool: [["Do", "1"], ["Re", "2"], ["Mi", "3"], ["Fa", "4"], ["So", "5"], ["La", "6"], ["Ti", "7"]] }) },
    { id: "tap", name: nm("Tap the rhythm", "敲出節奏"), build: seqPressGame({ instr: nm("Reproduce the rhythm by tapping the buttons in order.", "依序點按按鈕,重現這段節奏。"), labels: ["·", "−", "◦", "✕"] }) }
  ];

  M.reach = [
    { id: "magnet", name: nm("Magnet pull", "磁鐵吸取"), build: magnetGame() },
    { id: "pole", name: nm("Extend the pole", "伸長夾取桿"), build: sliderGame({ instr: nm("Extend the pole and stop it at the key's reach.", "伸長夾取桿,停在搆到鑰匙的位置。"), icon: "key" }) },
    { id: "mirror", name: nm("Mirror around the corner", "鏡子看轉角"),
      build: pickGame(function (diff) {
        var n = D(diff, [3, 4, 5, 6]), ok = 1 + rnd(n), items = [];
        for (var i = 1; i <= n; i++) items.push({ label: nm("Door " + i, "門 " + i), ok: i === ok });
        return { instr: nm("Use the mirror to peek around the corner — which door hides the key?", "用鏡子看轉角——哪扇門後藏著鑰匙?"), items: items };
      }) }
  ];

  M.mechanism = [
    { id: "circuit", name: nm("Set the circuit", "設定電路"), build: switchesGame({ instr: nm("Set the switches to match the wiring pattern and light the lamp.", "把開關設成符合線路的樣式,點亮燈泡。"), icon: "lightbulb" }) },
    { id: "sequence", name: nm("Button sequence", "按鈕序列"), build: seqPressGame({ instr: nm("Press the buttons in the order shown.", "依顯示的順序按下按鈕。"), labels: ["①", "②", "③", "④"] }) },
    { id: "magnet-place", name: nm("Place the magnet", "放對磁鐵"),
      build: pickGame(function (diff) {
        var n = D(diff, [6, 9, 12, 16]), ok = rnd(n), items = [];
        for (var i = 0; i < n; i++) items.push({ label: nm("·", "·"), ok: i === ok, cls: "mg-cell" });
        return { instr: nm("Place the magnet on the panel with the hidden latch. Pick the right spot.", "把磁鐵放在藏著磁簧的面板。選對位置。"), cls: "mg-grid mg-grid--4", items: items };
      }) },
    { id: "weight", name: nm("Weight sensor", "重量感應"),
      build: pickGame(function (diff) {
        var target = D(diff, [5, 7, 9, 12]); var opts = shuffle([target, target - 2, target + 3, target - 4, target + 5, 1].filter(function (v, i, a) { return v > 0 && a.indexOf(v) === i; })).slice(0, D(diff, [3, 4, 5, 6]));
        if (opts.indexOf(target) === -1) opts[0] = target;
        return { instr: nm("The plate needs exactly " + target + " kg. Place the right object.", "壓力板剛好需要 " + target + " 公斤,放上正確的物件。"),
          items: opts.map(function (v) { return { label: nm(v + " kg", v + " 公斤"), ok: v === target }; }) };
      }) }
  ];

  M.cooperation = [
    { id: "relay", name: nm("Describe & relay", "描述傳遞"), build: relayGame() },
    { id: "sync", name: nm("Hold together", "同步按住"), build: syncGame() }
  ];

  M.roleplay = [
    { id: "dialogue", name: nm("Stay in character", "保持角色"), build: dialogueGame() },
    { id: "culprit", name: nm("Name the culprit", "指認兇手"),
      build: pickGame(function (diff) {
        var feats = [["left-handed, red", "左撇子、紅衣", true], ["right-handed, red", "右撇子、紅衣", false], ["left-handed, blue", "左撇子、藍衣", false], ["right-handed, blue", "右撇子、藍衣", false], ["left-handed, green", "左撇子、綠衣", false], ["right-handed, green", "右撇子、綠衣", false]];
        var n = D(diff, [3, 4, 5, 6]); var pickset = [feats[0]].concat(shuffle(feats.slice(1)).slice(0, n - 1)); pickset = shuffle(pickset);
        return { instr: nm("Clues: the culprit is left-handed AND wore red. Who is it?", "線索:兇手是左撇子、而且穿紅衣。是誰?"),
          cls: "mg-rp__opts", items: pickset.map(function (f) { return { label: nm(f[0], f[1]), ok: f[2], cls: "mg-rp__opt" }; }) };
      }) }
  ];

  M.multistep = [
    { id: "chain", name: nm("Chained code", "連鎖密碼"), build: multistepGame() },
    { id: "relay-math", name: nm("Relay maths", "接力計算"), build: multistepGame() }
  ];

  window.MINIGAMES = M;
})();

/* =========================================================================
   minigames.js — playable demos for every puzzle TYPE and its SUB-techniques.

   window.MINIGAMES[<puzzle-slug>] = [ { id, name:{en,zh}, build(host,L) }, ... ]
   app.js shows the array as tabs inside the puzzle detail dialog (puzzles page
   only). Games are built from reusable factories so each sub-technique gets its
   own demo. Everything is vanilla, zero-build, bilingual (reads L.state.lang),
   and EPHEMERAL (state lives in the open dialog; resets on reload/lang switch).
   All visible strings are inline literals rendered via textContent / static
   markup — no data-derived value reaches innerHTML, so there is no XSS path.
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
  function checkInput(host, L, inp, chk, fb, answer) {
    chk.addEventListener("click", function () {
      if (norm(inp.value) === norm(typeof answer === "function" ? answer() : answer)) { chk.disabled = true; win(host, L); }
      else fb.textContent = "❌";
    });
  }

  /* =====================================================================
     FACTORIES — each returns a build(host, L) function
     ===================================================================== */

  /* lookup-table decode: read the key, translate the coded sequence, type it */
  function decoderGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      host.appendChild(mk("div", "mg-hint", tx(L, o.keyLabel.en, o.keyLabel.zh)));
      var kt = mk("div", "mg-keytable");
      o.pairs.forEach(function (p) {
        var c = mk("div", "mg-key");
        c.appendChild(mk("span", "mg-key__sym", p[0]));
        c.appendChild(mk("span", "mg-key__val", p[1]));
        kt.appendChild(c);
      });
      host.appendChild(kt);
      host.appendChild(mk("div", "mg-coded", o.coded.join("   ")));
      var inp = mk("input", "mg-input"); inp.type = "text"; inp.style.width = "150px"; inp.placeholder = tx(L, "decode…", "解出…");
      var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
      checkInput(host, L, inp, chk, fb, o.answer);
      var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* show a puzzle (optional build), then type the answer */
  function inputGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      var ansHolder = {};
      if (o.build) ansHolder.a = o.build(host, L);
      var ans = o.answer != null ? (typeof o.answer === "function" ? o.answer(L) : o.answer) : ansHolder.a;
      var inp = mk("input", "mg-input"); inp.type = "text"; if (o.width) inp.style.width = o.width; inp.placeholder = o.ph || "?";
      var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
      checkInput(host, L, inp, chk, fb, function () { return ans; });
      var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* click the correct item among several (wrong = shake, no penalty) */
  function pickGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      if (o.note) host.appendChild(mk("div", "mg-hint", tx(L, o.note.en, o.note.zh)));
      var box = mk("div", o.cls || "mg-row mg-row--center");
      o.items.forEach(function (it) {
        var b = mk("button", "mg-pick" + (it.cls ? " " + it.cls : "")); b.type = "button";
        if (it.style) b.setAttribute("style", it.style);
        b.textContent = it.label ? (it.label[L.state.lang] || it.label.en || it.label) : (it.text || "");
        b.addEventListener("click", function () {
          if (it.ok) { b.classList.add("mg-pick--ok"); win(host, L); }
          else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); }
        });
        box.appendChild(b);
      });
      host.appendChild(box);
    };
  }

  /* reorder tiles (click two to swap) until they read the target */
  function orderGame(o) {
    return function (host, L) {
      var ans = o.tiles[L.state.lang] || o.tiles.en;
      instr(host, L, o.instr.en + " " + ans.join(""), o.instr.zh + " " + ans.join(""));
      var order = shuffle(ans.slice());
      while (order.join("") === ans.join("")) order = shuffle(ans.slice());
      var sel = -1;
      var rowEl = mk("div", o.grid ? "mg-jig" : "mg-row mg-row--center");
      function repaint() {
        rowEl.innerHTML = "";
        order.forEach(function (ch, i) {
          var tEl = mk("button", "mg-tile" + (i === sel ? " mg-tile--sel" : ""), ch); tEl.type = "button";
          tEl.addEventListener("click", function () {
            if (sel === -1) sel = i;
            else { var tmp = order[sel]; order[sel] = order[i]; order[i] = tmp; sel = -1; }
            repaint();
            if (order.join("") === ans.join("")) {
              [].forEach.call(rowEl.querySelectorAll(".mg-tile"), function (x) { x.classList.add("mg-tile--ok"); x.disabled = true; });
              win(host, L);
            }
          });
          rowEl.appendChild(tEl);
        });
      }
      repaint(); host.appendChild(rowEl);
      host.appendChild(mk("div", "mg-hint", tx(L, "Click two tiles to swap them.", "點兩個碎片即可交換位置。")));
    };
  }

  /* flip N switches ON to light the target (circuit / laser path) */
  function switchesGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      var icon = o.icon || "lightbulb";
      var lamp = mk("div", "mg-lamp"); lamp.innerHTML = '<span class="material-symbols-rounded">' + icon + "</span>";
      var st = []; for (var k = 0; k < (o.n || 3); k++) st.push(false);
      var sw = mk("div", "mg-row mg-row--center");
      st.forEach(function (_, i) {
        var b = mk("button", "mg-switch", "OFF"); b.type = "button";
        b.addEventListener("click", function () {
          st[i] = !st[i]; b.textContent = st[i] ? "ON" : "OFF"; b.classList.toggle("mg-switch--on", st[i]);
          var all = st.every(function (x) { return x; });
          lamp.classList.toggle("mg-lamp--on", all);
          if (all) win(host, L);
        });
        sw.appendChild(b);
      });
      host.appendChild(lamp); host.appendChild(sw);
    };
  }

  /* press buttons in the displayed order */
  function seqPressGame(o) {
    return function (host, L) {
      var labels = o.labels, order = o.order; // order = array of indices into labels
      instr(host, L, o.instr.en, o.instr.zh);
      var seqTxt = order.map(function (i) { return labels[i]; }).join(" → ");
      host.appendChild(mk("div", "mg-coded", seqTxt));
      var pos = 0;
      var box = mk("div", "mg-row mg-row--center");
      labels.forEach(function (lab, i) {
        var b = mk("button", "mg-pick", lab); b.type = "button";
        b.addEventListener("click", function () {
          if (i === order[pos]) {
            pos++; b.classList.add("mg-pick--ok"); setTimeout(function () { b.classList.remove("mg-pick--ok"); }, 250);
            if (pos === order.length) win(host, L);
          } else { pos = 0; b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); }
        });
        box.appendChild(b);
      });
      host.appendChild(box);
    };
  }

  /* connect each left item to its matching right item */
  function matchGame(o) {
    return function (host, L) {
      var pairs = o.pairs[L.state.lang] || o.pairs.en;
      instr(host, L, o.instr.en, o.instr.zh);
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
      rights.forEach(function (o2) {
        var rb = mk("button", "mg-match__item", o2.txt); rb.type = "button"; rb.dataset.idx = o2.idx;
        rb.addEventListener("click", function () {
          if (sel === null || rb.classList.contains("mg-match__item--ok")) return;
          if (o2.idx === sel) {
            rb.classList.add("mg-match__item--ok");
            var l = left.querySelector('[data-idx="' + sel + '"]'); l.classList.remove("mg-match__item--sel"); l.classList.add("mg-match__item--ok");
            sel = null; done++; if (done === pairs.length) win(host, L);
          } else { rb.classList.add("mg-shake"); setTimeout(function () { rb.classList.remove("mg-shake"); }, 400); }
        });
        right.appendChild(rb);
      });
      grid.appendChild(left); grid.appendChild(right); host.appendChild(grid);
    };
  }

  /* memory: flip cards two at a time to find all pairs */
  function memoryGame(o) {
    return function (host, L) {
      instr(host, L, "Flip two cards at a time to find all matching pairs.", "一次翻兩張卡,找出所有相同的配對。");
      var deck = shuffle(o.syms.concat(o.syms));
      var grid = mk("div", "mg-mem-grid"); var first = null, lock = false, matched = 0;
      deck.forEach(function (s) {
        var c = mk("button", "mg-mem"); c.type = "button"; c.dataset.s = s;
        c.appendChild(mk("span", "mg-mem__back", "?"));
        c.appendChild(mk("span", "mg-mem__face", s));
        c.addEventListener("click", function () {
          if (lock || c.classList.contains("mg-mem--up") || c.classList.contains("mg-mem--done")) return;
          c.classList.add("mg-mem--up");
          if (!first) { first = c; return; }
          if (first.dataset.s === c.dataset.s) {
            first.classList.add("mg-mem--done"); c.classList.add("mg-mem--done"); matched++; first = null;
            if (matched === o.syms.length) win(host, L);
          } else { lock = true; var a = first, b = c; first = null; setTimeout(function () { a.classList.remove("mg-mem--up"); b.classList.remove("mg-mem--up"); lock = false; }, 700); }
        });
        grid.appendChild(c);
      });
      host.appendChild(grid);
    };
  }

  /* navigate a token on a grid to the goal (optional walls) */
  function dpadGame(o) {
    return function (host, L) {
      var N = o.n, walls = o.walls || {}, start = o.start, goal = o.goal, pos = { r: start.r, c: start.c };
      instr(host, L, o.instr.en, o.instr.zh);
      var board = mk("div", "mg-board"); board.style.setProperty("--n", N);
      function paint() {
        board.innerHTML = "";
        for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
          var cell = mk("div", "mg-board-cell");
          if (walls[r + "," + c]) cell.classList.add("mg-board-cell--wall");
          else if (r === pos.r && c === pos.c) { cell.classList.add("mg-board-cell--me"); cell.textContent = "◆"; }
          else if (r === goal.r && c === goal.c) { cell.classList.add("mg-board-cell--goal"); cell.textContent = "★"; }
          board.appendChild(cell);
        }
      }
      function move(dr, dc) {
        var nr = pos.r + dr, nc = pos.c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N || walls[nr + "," + nc]) return;
        pos.r = nr; pos.c = nc; paint();
        if (pos.r === goal.r && pos.c === goal.c) win(host, L);
      }
      paint(); host.appendChild(board);
      var pad = mk("div", "mg-dpad");
      [["north", -1, 0, "↑"], ["west", 0, -1, "←"], ["south", 1, 0, "↓"], ["east", 0, 1, "→"]].forEach(function (d) {
        var b = btn("mg-dpad__btn mg-dpad__btn--" + d[0], d[3]);
        b.addEventListener("click", function () { move(d[1], d[2]); });
        pad.appendChild(b);
      });
      host.appendChild(pad);
    };
  }

  /* drag a slider to (or past) the target to extend a tool and grab the prize */
  function sliderGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      var stage = mk("div", "mg-slide");
      var fill = mk("div", "mg-slide__fill");
      var prize = mk("div", "mg-slide__prize"); prize.innerHTML = '<span class="material-symbols-rounded">' + (o.icon || "key") + "</span>";
      stage.appendChild(fill); stage.appendChild(prize); host.appendChild(stage);
      var sl = mk("input", "mg-range"); sl.type = "range"; sl.min = "0"; sl.max = "100"; sl.value = "0";
      var won = false;
      sl.addEventListener("input", function () {
        fill.style.width = sl.value + "%";
        if (!won && parseInt(sl.value, 10) >= 96) { won = true; prize.classList.add("mg-slide__prize--got"); win(host, L); }
      });
      host.appendChild(sl);
      host.appendChild(mk("div", "mg-hint", tx(L, "Drag the slider all the way to reach it.", "把滑桿拉到底就能搆到。")));
    };
  }

  /* Caesar wheel: rotate until the ciphertext spells the word */
  function caesarGame(answer, shift) {
    return function (host, L) {
      var cur = 0;
      var cipher = answer.split("").map(function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65); }).join("");
      instr(host, L, "Caesar cipher — rotate until the letters spell an English word.", "凱撒密碼——轉動轉盤,直到字母拼出讀得懂的英文單字。");
      var disp = mk("div", "mg-cipher");
      var minus = btn(null, "◀ −1"), plus = btn(null, "+1 ▶"), pill = mk("span", "mg-pill");
      function decoded() { return cipher.split("").map(function (c) { return String.fromCharCode((c.charCodeAt(0) - 65 - cur + 260) % 26 + 65); }).join(""); }
      function upd() { disp.textContent = decoded(); pill.textContent = (L.state.lang === "en" ? "shift " : "位移 ") + cur; if (decoded() === answer) { disp.classList.add("mg-cipher--ok"); minus.disabled = plus.disabled = true; win(host, L); } }
      minus.addEventListener("click", function () { cur = (cur + 25) % 26; upd(); });
      plus.addEventListener("click", function () { cur = (cur + 1) % 26; upd(); });
      var r = row("mg-row--center"); r.appendChild(minus); r.appendChild(pill); r.appendChild(plus);
      host.appendChild(disp); host.appendChild(r); upd();
    };
  }

  /* binary bit switches: toggle to make the value equal the target */
  function bitGame(target, bits) {
    return function (host, L) {
      instr(host, L, "Binary: toggle the bit switches so the value equals " + target + ".", "二進位:切換位元開關,讓數值等於 " + target + "。");
      var st = bits.map(function () { return false; });
      var disp = mk("div", "mg-cipher");
      function val() { return bits.reduce(function (a, b, i) { return a + (st[i] ? b : 0); }, 0); }
      var rowEl = mk("div", "mg-bits");
      function upd() { disp.textContent = val(); if (val() === target) { disp.classList.add("mg-cipher--ok"); win(host, L); } else disp.classList.remove("mg-cipher--ok"); }
      bits.forEach(function (b, i) {
        var sw = mk("button", "mg-bit"); sw.type = "button"; sw.dataset.bit = b;
        sw.appendChild(mk("span", "mg-bit__v", String(b)));
        sw.appendChild(mk("span", "mg-bit__s", "0"));
        sw.addEventListener("click", function () { st[i] = !st[i]; sw.classList.toggle("mg-bit--on", st[i]); sw.querySelector(".mg-bit__s").textContent = st[i] ? "1" : "0"; upd(); });
        rowEl.appendChild(sw);
      });
      host.appendChild(mk("div", "mg-hint", tx(L, "Target value: " + target, "目標數值:" + target)));
      host.appendChild(rowEl); host.appendChild(disp); upd();
    };
  }

  /* acrostic: read the first character of each line, top to bottom */
  function acrosticGame(o) {
    return function (host, L) {
      var lines = o[L.state.lang] || o.en;
      instr(host, L, "Read the FIRST character of each line, top to bottom. Click the lines in order.", "讀每一行的第一個字(由上而下)。依序點選每一行。");
      var next = 0, prog = mk("div", "mg-acro-prog", "—"), box = mk("div", "mg-acro");
      lines.forEach(function (s, i) {
        var b = mk("button", "mg-acro-line"); b.type = "button";
        b.appendChild(mk("b", "mg-acro-first", s.charAt(0)));
        b.appendChild(mk("span", null, s.slice(1)));
        b.addEventListener("click", function () {
          if (i === next) {
            b.classList.add("mg-acro-line--on"); next++;
            prog.textContent = lines.slice(0, next).map(function (x) { return x.charAt(0); }).join("");
            if (next === lines.length) { prog.classList.add("mg-cipher--ok"); win(host, L); }
          } else { next = 0; [].forEach.call(box.querySelectorAll(".mg-acro-line"), function (x) { x.classList.remove("mg-acro-line--on"); }); prog.textContent = tx(L, "(start from the top)", "(從第一行重新點起)"); }
        });
        box.appendChild(b);
      });
      host.appendChild(box);
      host.appendChild(mk("div", "mg-hint", tx(L, "Spelled so far:", "目前拼出:")));
      host.appendChild(prog);
    };
  }

  /* search a grid of spots; one hides the key */
  function searchGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      var icons = o.icons, target = o.target, keyAt = rnd(icons.length), found = false;
      var grid = mk("div", "mg-grid mg-grid--4");
      icons.forEach(function (ic, i) {
        var b = btn("mg-cell"); b.innerHTML = '<span class="material-symbols-rounded">' + ic + "</span>";
        b.addEventListener("click", function () {
          if (found || b.classList.contains("mg-cell--open")) return;
          b.classList.add("mg-cell--open");
          if (i === keyAt) { b.classList.add("mg-cell--hit"); b.innerHTML = '<span class="material-symbols-rounded">' + target + "</span>"; found = true; win(host, L); }
          else b.innerHTML = '<span class="mg-empty">·</span>';
        });
        grid.appendChild(b);
      });
      host.appendChild(grid);
    };
  }

  /* reveal hidden text (UV / mirror / overlay flavour), then type it */
  function revealGame(o) {
    return function (host, L) {
      instr(host, L, o.instr.en, o.instr.zh);
      var code = o.code || String(100 + rnd(900));
      var panel = mk("div", "mg-uv" + (o.mirror ? " mg-uv--mirror" : ""));
      panel.appendChild(mk("span", "mg-uv__code", code)); /* mirror flavour is CSS scaleX(-1), so textContent stays the real code */
      var toggle = btn("mg-btn--ghost", o.btn[L.state.lang] || o.btn.en);
      if (o.hold) {
        var on = function () { panel.classList.add("mg-uv--on"); }, off = function () { panel.classList.remove("mg-uv--on"); };
        toggle.addEventListener("mousedown", on); toggle.addEventListener("mouseup", off); toggle.addEventListener("mouseleave", off);
        toggle.addEventListener("touchstart", function (e) { e.preventDefault(); on(); }, { passive: false }); toggle.addEventListener("touchend", off);
      } else {
        toggle.addEventListener("click", function () { panel.classList.toggle("mg-uv--on"); });
      }
      var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = tx(L, "code", "密碼");
      var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
      checkInput(host, L, inp, chk, fb, code);
      host.appendChild(panel); host.appendChild(toggle);
      var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* Simon: watch the flashing pads, repeat the sequence */
  function simonGame() {
    return function (host, L) {
      var freqs = [330, 392, 494, 587], colors = ["#c0392b", "#27ae60", "#2980b9", "#d4a017"];
      var seq = [], inp = [], locked = true; for (var i = 0; i < 4; i++) seq.push(rnd(4));
      instr(host, L, "Press Play, watch the flashes, then repeat the sequence on the pads.", "按播放、看閃光順序,再依序點按色塊重現它。");
      var ac = null;
      function beep(f) { try { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; if (!ac) ac = new AC(); if (ac.state === "suspended") ac.resume(); var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.connect(g); g.connect(ac.destination); g.gain.value = 0.07; o.start(); o.stop(ac.currentTime + 0.22); } catch (e) {} }
      var padsBox = mk("div", "mg-pads"), pads = [];
      function flash(i) { pads[i].classList.add("mg-pad--lit"); beep(freqs[i]); setTimeout(function () { pads[i].classList.remove("mg-pad--lit"); }, 280); }
      for (var k = 0; k < 4; k++) (function (k) {
        var p = mk("button", "mg-pad"); p.type = "button"; p.style.setProperty("--pad", colors[k]);
        p.addEventListener("click", function () {
          if (locked) return; flash(k); inp.push(k);
          if (seq[inp.length - 1] !== k) { inp = []; fb.textContent = tx(L, "❌ try again", "❌ 再試一次"); return; }
          if (inp.length === seq.length) { locked = true; win(host, L); }
        });
        pads.push(p); padsBox.appendChild(p);
      })(k);
      var play = btn("mg-btn--primary", "▶ " + tx(L, "Play", "播放")), fb = feedback();
      play.addEventListener("click", function () { locked = true; inp = []; fb.textContent = ""; seq.forEach(function (s, i) { setTimeout(function () { flash(s); if (i === seq.length - 1) setTimeout(function () { locked = false; }, 320); }, 450 * i); }); });
      host.appendChild(padsBox);
      var r = row("mg-row--center"); r.appendChild(play); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* drag the magnet onto the key to pull it through the bars */
  function magnetGame() {
    return function (host, L) {
      instr(host, L, "The key is behind the bars. Drag the magnet close to pull it out.", "鑰匙在欄杆後面。把磁鐵拖近鑰匙,就能吸出來。");
      var stage = mk("div", "mg-reach");
      var bars = mk("div", "mg-reach__bars"), key = mk("div", "mg-reach__key"), mag = mk("div", "mg-reach__magnet", "🧲");
      key.innerHTML = '<span class="material-symbols-rounded">key</span>';
      stage.appendChild(bars); stage.appendChild(key); stage.appendChild(mag); host.appendChild(stage);
      var won = false, dragging = false;
      mag.addEventListener("pointerdown", function (e) { dragging = true; mag.setPointerCapture(e.pointerId); mag.classList.add("mg-reach__magnet--grab"); });
      mag.addEventListener("pointerup", function () { dragging = false; mag.classList.remove("mg-reach__magnet--grab"); });
      mag.addEventListener("pointermove", function (e) {
        if (!dragging || won) return;
        var box = stage.getBoundingClientRect();
        var x = Math.max(0, Math.min(box.width, e.clientX - box.left)), y = Math.max(0, Math.min(box.height, e.clientY - box.top));
        mag.style.left = x + "px"; mag.style.top = y + "px";
        var kb = key.getBoundingClientRect(), dx = e.clientX - (kb.left + kb.width / 2), dy = e.clientY - (kb.top + kb.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < 46) { won = true; dragging = false; key.style.right = "auto"; key.style.transform = "none"; key.style.left = x + "px"; key.style.top = y + "px"; key.classList.add("mg-reach__key--pulled"); win(host, L); }
      });
    };
  }

  /* relay: peek at Room A's symbol, press the match in Room B */
  function relayGame() {
    return function (host, L) {
      var syms = ["▲", "●", "■", "★"], secret = syms[rnd(4)];
      instr(host, L, "Room A holds a secret symbol — peek, then press the matching button in Room B.", "A 房有一個祕密符號——先偷看,再到 B 房按下相符的按鈕。");
      var grid = mk("div", "mg-coop");
      var aRoom = mk("div", "mg-coop__room"); aRoom.appendChild(mk("div", "mg-coop__label", tx(L, "Room A", "A 房")));
      var peek = btn(null, tx(L, "👁 Peek", "👁 偷看")), aShow = mk("div", "mg-coop__secret", "?");
      peek.addEventListener("mousedown", function () { aShow.textContent = secret; });
      peek.addEventListener("mouseup", function () { aShow.textContent = "?"; });
      peek.addEventListener("mouseleave", function () { aShow.textContent = "?"; });
      aRoom.appendChild(aShow); aRoom.appendChild(peek);
      var bRoom = mk("div", "mg-coop__room"); bRoom.appendChild(mk("div", "mg-coop__label", tx(L, "Room B", "B 房")));
      var bBtns = mk("div", "mg-row mg-row--center");
      shuffle(syms.slice()).forEach(function (s) {
        var b = btn("mg-coop__pick", s);
        b.addEventListener("click", function () { if (s === secret) { b.classList.add("mg-match__item--ok"); win(host, L); } else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); } });
        bBtns.appendChild(b);
      });
      bRoom.appendChild(bBtns); grid.appendChild(aRoom); grid.appendChild(bRoom); host.appendChild(grid);
    };
  }

  /* press-and-hold both buttons at once (two-person sync) */
  function syncGame() {
    return function (host, L) {
      instr(host, L, "It takes two: hold BOTH buttons down at the same time.", "需要兩人:同時按住兩個按鈕。");
      var a = false, b = false, done = false;
      var box = mk("div", "mg-row mg-row--center");
      function chk() { if (a && b && !done) { done = true; win(host, L); } }
      [["A", function (v) { a = v; }], ["B", function (v) { b = v; }]].forEach(function (p) {
        var bt = mk("button", "mg-pick mg-sync", p[0]); bt.type = "button";
        bt.addEventListener("mousedown", function () { p[1](true); bt.classList.add("mg-pick--ok"); chk(); });
        bt.addEventListener("mouseup", function () { p[1](false); bt.classList.remove("mg-pick--ok"); });
        bt.addEventListener("mouseleave", function () { p[1](false); bt.classList.remove("mg-pick--ok"); });
        bt.addEventListener("touchstart", function (e) { e.preventDefault(); p[1](true); bt.classList.add("mg-pick--ok"); chk(); }, { passive: false });
        bt.addEventListener("touchend", function () { p[1](false); bt.classList.remove("mg-pick--ok"); });
        box.appendChild(bt);
      });
      host.appendChild(box);
    };
  }

  /* branching dialogue: keep your cover across two lines */
  function dialogueGame() {
    return function (host, L) {
      var steps = L.state.lang === "en" ? [
        { npc: "A guard blocks the door: “Nobody passes without a pass.”", opts: [["Show the forged pass confidently", true], ["Shout and shove past him", false], ["Admit you have no pass", false]] },
        { npc: "Inside, a clerk asks: “And you are…?”", opts: [["“The new inspector — here for the audit.”", true], ["Stay silent and sweat", false], ["“Just looking around.”", false]] }
      ] : [
        { npc: "守衛擋住門口:「沒有通行證不准過。」", opts: [["自信地出示偽造通行證", true], ["大吼著硬推過去", false], ["老實說你沒有通行證", false]] },
        { npc: "進門後職員問:「請問您是…?」", opts: [["「新來的督察,來做稽核的。」", true], ["沉默不語、冒冷汗", false], ["「只是隨便看看。」", false]] }
      ];
      instr(host, L, "Stay in character. Pick the response that keeps your cover.", "保持角色設定,選出能繼續掩飾身分的回應。");
      var i = 0, npc = mk("div", "mg-rp__npc"), opts = mk("div", "mg-rp__opts"), fb = mk("div", "mg-fb");
      function render() {
        var st = steps[i]; npc.textContent = st.npc; opts.innerHTML = ""; fb.textContent = "";
        st.opts.forEach(function (o) {
          var b = btn("mg-rp__opt", o[0]);
          b.addEventListener("click", function () {
            if (o[1]) { i++; if (i >= steps.length) { opts.innerHTML = ""; npc.textContent = tx(L, "You are through. 🎭", "你順利過關了。🎭"); win(host, L); } else render(); }
            else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); fb.textContent = tx(L, "That blows your cover — try another line.", "這樣會露餡——換一句試試。"); }
          });
          opts.appendChild(b);
        });
      }
      render(); host.appendChild(npc); host.appendChild(opts); host.appendChild(fb);
    };
  }

  /* multi-step: each answer feeds the next, ending in a final code */
  function multistepGame(stepCount) {
    return function (host, L) {
      instr(host, L, "Linked steps — each answer feeds the next, ending in the final code.", "相扣的步驟——每一步的答案餵給下一步,最後組成密碼。");
      var mid = 2 + rnd(7), a = 1 + rnd(mid - 1), b = mid - a;
      var lead = stepCount >= 3 ? 1 + rnd(4) : 2;     // 3-step adds a leading digit puzzle
      var finalCode = "" + lead + mid + "9";
      // step 1
      var s1 = mk("div", "mg-step");
      s1.appendChild(mk("div", "mg-step__label", tx(L, "Step 1 · the middle digit", "第 1 步 · 中間那一碼")));
      s1.appendChild(mk("div", "mg-step__q", a + " + " + b + " = ?"));
      var i1 = mk("input", "mg-input"); i1.type = "text"; i1.placeholder = "?";
      var c1 = btn("mg-btn--primary", tx(L, "OK", "確認")), f1 = feedback();
      var r1 = row(); r1.appendChild(i1); r1.appendChild(c1); r1.appendChild(f1); s1.appendChild(r1);
      // step 2 (final)
      var s2 = mk("div", "mg-step mg-step--locked");
      s2.appendChild(mk("div", "mg-step__label", tx(L, "Step 2 · the final code", "第 2 步 · 最終密碼")));
      var clue2 = mk("div", "mg-step__q"); s2.appendChild(clue2);
      var i2 = mk("input", "mg-input"); i2.type = "text"; i2.maxLength = 3; i2.placeholder = "###"; i2.disabled = true;
      var c2 = btn("mg-btn--primary", tx(L, "Unlock", "解鎖")); c2.disabled = true; var f2 = feedback();
      var r2 = row(); r2.appendChild(i2); r2.appendChild(c2); r2.appendChild(f2); s2.appendChild(r2);
      c1.addEventListener("click", function () {
        if (parseInt(i1.value, 10) === mid) {
          f1.textContent = "✅"; c1.disabled = i1.disabled = true; s2.classList.remove("mg-step--locked"); i2.disabled = c2.disabled = false;
          clue2.textContent = tx(L, "Code = " + lead + ", then step-1 answer, then 9 → " + lead + "_9", "密碼 = " + lead + "、接著第 1 步答案、再接 9 → " + lead + "_9");
        } else f1.textContent = "❌";
      });
      c2.addEventListener("click", function () { if (i2.value.trim() === finalCode) { c2.disabled = true; win(host, L); } else f2.textContent = "❌"; });
      host.appendChild(s1); host.appendChild(s2);
    };
  }

  /* highlighted-letters hidden message: type the highlighted letters in order */
  function highlightGame(o) {
    return function (host, L) {
      var letters = o.letters, hi = o.hi; // hi = indices to highlight
      instr(host, L, "Some letters are highlighted. Read the highlighted ones in order and type the word.", "有些字母被標色了。依序讀出標色的字母,拼成單字輸入。");
      var rowEl = mk("div", "mg-letters");
      letters.forEach(function (ch, i) {
        var sp = mk("span", "mg-letter" + (hi.indexOf(i) !== -1 ? " mg-hl" : ""), ch);
        rowEl.appendChild(sp);
      });
      host.appendChild(rowEl);
      var ans = hi.map(function (i) { return letters[i]; }).join("");
      var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = "?";
      var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
      checkInput(host, L, inp, chk, fb, ans);
      var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* punch-card mask: toggle the mask to reveal letters through the holes */
  function maskGame(o) {
    return function (host, L) {
      var letters = o.letters, holes = o.holes; // 9 letters (3x3), holes = indices revealed
      instr(host, L, "Lay the punched mask over the grid, read the letters showing through the holes.", "把挖孔卡蓋上,讀出從孔洞露出的字母。");
      var grid = mk("div", "mg-mask");
      letters.forEach(function (ch, i) { grid.appendChild(mk("div", "mg-mask__cell", ch)); });
      host.appendChild(grid);
      var toggle = btn(null, tx(L, "Place / lift the mask", "蓋上 / 掀開挖孔卡"));
      toggle.addEventListener("click", function () {
        grid.classList.toggle("mg-mask--on");
        [].forEach.call(grid.children, function (c, i) { c.classList.toggle("mg-mask__cell--hole", grid.classList.contains("mg-mask--on") && holes.indexOf(i) !== -1); });
      });
      host.appendChild(toggle);
      var ans = holes.map(function (i) { return letters[i]; }).join("");
      var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = "?";
      var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
      checkInput(host, L, inp, chk, fb, ans);
      var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
    };
  }

  /* ghost-leg (amidakuji): pick the top that reaches the ★ */
  function ghostlegGame() {
    return function (host, L) {
      instr(host, L, "Ghost-leg: pick the TOP (A/B/C) that traces down to the ★.", "鬼腳圖:選出能一路走到 ★ 的頂端(A/B/C)。");
      var cols = 3, levels = 5, gx = [40, 120, 200], topY = 22, botY = 150;
      var rungs = []; for (var lv = 0; lv < levels; lv++) rungs.push({ lvl: lv, col: rnd(cols - 1) });
      function walk(t) { var c = t; for (var lv = 0; lv < levels; lv++) rungs.forEach(function (r) { if (r.lvl === lv) { if (c === r.col) c = r.col + 1; else if (c === r.col + 1) c = r.col; } }); return c; }
      var prize = rnd(cols);
      var svg = '<svg viewBox="0 0 240 172" class="mg-ghostleg">';
      gx.forEach(function (x) { svg += '<line x1="' + x + '" y1="' + topY + '" x2="' + x + '" y2="' + botY + '" class="gl-line"/>'; });
      rungs.forEach(function (r) { var y = topY + (botY - topY) * (r.lvl + 1) / (levels + 1); svg += '<line x1="' + gx[r.col] + '" y1="' + y + '" x2="' + gx[r.col + 1] + '" y2="' + y + '" class="gl-rung"/>'; });
      svg += '<text x="' + gx[prize] + '" y="' + (botY + 18) + '" text-anchor="middle" class="gl-star">★</text></svg>';
      var wrap = mk("div"); wrap.innerHTML = svg; host.appendChild(wrap);
      var picks = mk("div", "mg-row mg-row--center");
      for (var t = 0; t < cols; t++) (function (t) {
        var b = btn("mg-pick", String.fromCharCode(65 + t));
        b.addEventListener("click", function () { if (walk(t) === prize) { b.classList.add("mg-pick--ok"); win(host, L); } else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); } });
        picks.appendChild(b);
      })(t);
      host.appendChild(picks);
    };
  }

  /* small helpers for building pick items */
  function colorItem(hex, ok) { return { text: "", ok: ok, cls: "mg-swatch", style: "background:" + hex }; }

  /* =====================================================================
     CATALOG — MINIGAMES[slug] = [ {id, name, build}, ... ]
     ===================================================================== */
  var M = {};

  /* ---- SEARCH ---- */
  M.search = [
    { id: "sweep", name: nm("Sweep search", "地毯式搜索"),
      build: searchGame({ instr: nm("Search the 12 spots — one hides the key.", "搜索這 12 個地方,其中一個藏了鑰匙。"), icons: ["chair", "book_2", "umbrella", "bed", "weekend", "wall_art", "door_open", "luggage", "checkroom", "inventory_2", "window", "desk"], target: "key" }) },
    { id: "odd", name: nm("Spot the odd one", "找出不一樣的"),
      build: (function () {
        return function (host, L) {
          instr(host, L, "Everything looks the same — click the ONE tile that is different.", "看起來都一樣——點出唯一不一樣的那一格。");
          var n = 12, odd = rnd(n), box = mk("div", "mg-grid mg-grid--4");
          for (var i = 0; i < n; i++) (function (i) {
            var b = btn("mg-cell", i === odd ? "🟪" : "🟦");
            b.addEventListener("click", function () { if (i === odd) { b.classList.add("mg-cell--hit"); win(host, L); } else { b.classList.add("mg-shake"); setTimeout(function () { b.classList.remove("mg-shake"); }, 400); } });
            box.appendChild(b);
          })(i);
          host.appendChild(box);
        };
      })() }
  ];

  /* ---- CIPHERS (the showcase: every sub-technique) ---- */
  M.ciphers = [
    { id: "caesar", name: nm("Caesar shift", "凱撒密碼"), build: caesarGame("CODE", 3) },
    { id: "morse", name: nm("Morse code", "摩斯密碼"),
      build: decoderGame({ instr: nm("Decode the Morse signals into letters.", "把摩斯訊號解成字母。"), keyLabel: nm("Morse → letter", "摩斯 → 字母"), pairs: [["·", "E"], ["−·−", "K"], ["−·−−", "Y"], ["···", "S"], ["−−−", "O"]], coded: ["−·−", "·", "−·−−"], answer: "KEY" }) },
    { id: "substitution", name: nm("Substitution (Pigpen)", "替換密碼(豬圈)"),
      build: decoderGame({ instr: nm("Each symbol stands for a letter. Decode the word.", "每個符號代表一個字母,解出單字。"), keyLabel: nm("Symbol → letter", "符號 → 字母"), pairs: [["✦", "K"], ["✿", "E"], ["❄", "Y"], ["♣", "A"], ["✚", "T"]], coded: ["✦", "✿", "❄"], answer: "KEY" }) },
    { id: "binary", name: nm("Binary / ASCII", "二進位"), build: bitGame(13, [16, 8, 4, 2, 1]) },
    { id: "zhuyin", name: nm("Zhuyin key", "注音對照"),
      build: decoderGame({ instr: nm("Use the Zhuyin key to turn the symbols into digits.", "用注音對照表把符號轉成數字。"), keyLabel: nm("Zhuyin → digit", "注音 → 數字"), pairs: [["ㄅ", "1"], ["ㄆ", "2"], ["ㄇ", "3"], ["ㄈ", "4"], ["ㄉ", "5"]], coded: ["ㄇ", "ㄈ", "ㄅ"], answer: "341" }) },
    { id: "cards", name: nm("Playing cards", "撲克牌"),
      build: decoderGame({ instr: nm("Each card is a number. Read them in order.", "每張牌是一個數字,依序讀出。"), keyLabel: nm("Card → number", "牌 → 數字"), pairs: [["A♠", "1"], ["3♥", "3"], ["7♣", "7"], ["9♦", "9"], ["K♠", "13"]], coded: ["7♣", "A♠", "3♥"], answer: "713" }) },
    { id: "zodiac", name: nm("Chinese zodiac", "十二生肖"),
      build: decoderGame({ instr: nm("Each zodiac animal is its order number.", "每個生肖代表牠的排序數字。"), keyLabel: nm("Zodiac → order", "生肖 → 序號"), pairs: [["鼠", "1"], ["牛", "2"], ["虎", "3"], ["龍", "5"], ["馬", "7"]], coded: ["虎", "鼠", "龍"], answer: "315" }) },
    { id: "bagua", name: nm("Eight trigrams (Bagua)", "八卦"),
      build: decoderGame({ instr: nm("Each trigram is a number. Decode the sequence.", "每個卦象是一個數字,解出序列。"), keyLabel: nm("Trigram → number", "卦象 → 數字"), pairs: [["☰", "1"], ["☱", "2"], ["☲", "3"], ["☷", "8"], ["☵", "6"]], coded: ["☲", "☰", "☷"], answer: "318" }) },
    { id: "color", name: nm("Colour code", "顏色密碼"),
      build: decoderGame({ instr: nm("Each colour maps to a digit. Read the code.", "每個顏色對應一個數字,讀出密碼。"), keyLabel: nm("Colour → digit", "顏色 → 數字"), pairs: [["🔴", "0"], ["🟠", "1"], ["🟡", "2"], ["🟢", "3"], ["🔵", "4"]], coded: ["🟡", "🔴", "🟢"], answer: "203" }) }
  ];

  /* ---- HIDDEN TEXT ---- */
  M["hidden-text"] = [
    { id: "acrostic", name: nm("Acrostic", "藏頭詩"),
      build: acrosticGame({ en: ["Curtains hide a draft", "Look behind the clock", "Under the rug, dust", "Every corner counts"], zh: ["密道就在牆後", "室內藏有線索", "逃出全靠鑰匙", "脫困務必冷靜"] }) },
    { id: "highlight", name: nm("Highlighted letters", "標色字母"),
      build: highlightGame({ letters: ["X", "K", "Q", "E", "Z", "Y", "W"], hi: [1, 3, 5] }) },
    { id: "mask", name: nm("Punch-card mask", "挖孔密碼板"),
      build: maskGame({ letters: ["K", "A", "P", "Q", "E", "R", "M", "Y", "T"], holes: [0, 4, 7] }) }
  ];

  /* ---- REVEAL / OBSERVE ---- */
  M.reveal = [
    { id: "uv", name: nm("UV blacklight", "紫外線顯影"),
      build: revealGame({ instr: nm("Hold the UV light over the panel to reveal a hidden code.", "按住 UV 燈照亮面板,顯現隱藏密碼。"), hold: true, btn: nm("🔦 Hold to shine UV", "🔦 按住照 UV") }) },
    { id: "mirror", name: nm("Mirror writing", "鏡像反字"),
      build: revealGame({ instr: nm("The code is written backwards. Flip it, then type the real code.", "密碼是反寫的。翻轉後,輸入正確密碼。"), mirror: true, btn: nm("🪞 Flip in the mirror", "🪞 用鏡子翻轉") }) },
    { id: "overlay", name: nm("Overlay sheets", "投影片疊合"),
      build: revealGame({ instr: nm("Overlay the two transparencies to reveal the code.", "把兩張投影片疊合,顯現密碼。"), btn: nm("🗂 Overlay the sheets", "🗂 疊合投影片") }) }
  ];

  /* ---- MATH ---- */
  M.math = [
    { id: "count", name: nm("Count objects", "數數量"),
      build: (function () {
        return function (host, L) {
          var set = ["🔴", "🔵", "🟢", "🟡"], target = set[rnd(set.length)], n = 9 + rnd(7), cells = [], count = 0;
          for (var i = 0; i < n; i++) { var e = set[rnd(set.length)]; if (e === target) count++; cells.push(e); }
          if (count === 0) { cells[0] = target; count = 1; }
          instr(host, L, "Count how many " + target + " there are, then enter the number.", "數一數有幾個 " + target + ",然後輸入數量。");
          host.appendChild(mk("div", "mg-count", cells.join(" ")));
          var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = "#";
          var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
          checkInput(host, L, inp, chk, fb, String(count));
          var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
        };
      })() },
    { id: "arith", name: nm("Arithmetic", "算式運算"),
      build: (function () {
        return function (host, L) {
          var a = 4 + rnd(6), b = 2 + rnd(7), c = 1 + rnd(8), ans = a * b + c;
          instr(host, L, "Work out the answer to unlock the code.", "算出答案來解出密碼。");
          host.appendChild(mk("div", "mg-cipher", a + " × " + b + " + " + c + " = ?"));
          var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = "?";
          var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
          checkInput(host, L, inp, chk, fb, String(ans));
          var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
        };
      })() },
    { id: "sequence", name: nm("Number sequence", "數列規律"),
      build: (function () {
        return function (host, L) {
          var start = 2 + rnd(3), ratio = 2, seq = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio], next = seq[3] * ratio;
          instr(host, L, "Find the pattern and enter the next number.", "找出規律,輸入下一個數字。");
          host.appendChild(mk("div", "mg-cipher", seq.join(", ") + ", ?"));
          var inp = mk("input", "mg-input"); inp.type = "text"; inp.placeholder = "?";
          var chk = btn("mg-btn--primary", tx(L, "Check", "確認")), fb = feedback();
          checkInput(host, L, inp, chk, fb, String(next));
          var r = row(); r.appendChild(inp); r.appendChild(chk); r.appendChild(fb); host.appendChild(r);
        };
      })() }
  ];

  /* ---- LOGIC ---- */
  M.logic = [
    { id: "deduce", name: nm("Deduction", "刪去法推理"),
      build: (function () {
        return function (host, L) {
          instr(host, L, "One box holds the key. Clues: NOT red, AND the smallest. Click it.", "只有一個盒子有鑰匙。線索:不是紅色、而且是最小的。點出它。");
          var boxes = [{ color: "#c0392b", size: 64, key: false }, { color: "#2980b9", size: 50, key: false }, { color: "#27ae60", size: 38, key: true }];
          shuffle(boxes);
          var grid = mk("div", "mg-row mg-row--center");
          boxes.forEach(function (bx) {
            var cell = mk("button", "mg-box"); cell.type = "button"; cell.style.background = bx.color; cell.style.width = cell.style.height = bx.size + "px";
            cell.addEventListener("click", function () { if (bx.key) { cell.innerHTML = '<span class="material-symbols-rounded">key</span>'; win(host, L); } else { cell.classList.add("mg-shake"); setTimeout(function () { cell.classList.remove("mg-shake"); }, 400); } });
            grid.appendChild(cell);
          });
          host.appendChild(grid);
        };
      })() },
    { id: "order", name: nm("Order by clue", "排列順序"),
      build: orderGame({ instr: nm("Tallest to shortest is C > A > B. Arrange to:", "由高到矮是 丙 > 甲 > 乙。排成:"), tiles: { en: ["C", "A", "B"], zh: ["丙", "甲", "乙"] } }) },
    { id: "latin", name: nm("Latin square", "拉丁方陣"),
      build: pickGame({ instr: nm("Each row and column uses 1–3 once. Which number fills the ? cell?", "每行每列 1–3 各一次。? 格該填哪個數字?"), note: nm("Row is 2, ? , 1  →  the ? must complete 1–3.", "該列是 2、?、1 → ? 要補齊 1–3。"), items: [{ label: nm("1", "1"), ok: false }, { label: nm("2", "2"), ok: false }, { label: nm("3", "3"), ok: true }] }) }
  ];

  /* ---- ASSEMBLY ---- */
  M.assembly = [
    { id: "tiles", name: nm("Reassemble word", "拼回單字"),
      build: orderGame({ instr: nm("Rearrange the tiles to read:", "把碎片排好,讀出:"), tiles: { en: ["C", "O", "D", "E"], zh: ["解", "開", "謎", "題"] } }) },
    { id: "jigsaw", name: nm("2×2 jigsaw", "2×2 拼圖"),
      build: orderGame({ instr: nm("Slide the pieces into order:", "把碎片排成順序:"), tiles: { en: ["1", "2", "3", "4"], zh: ["1", "2", "3", "4"] }, grid: true }) }
  ];

  /* ---- SPATIAL ---- */
  M.spatial = [
    { id: "follow", name: nm("Follow directions", "依方位走"),
      build: dpadGame({ instr: nm("Follow the clue from ◆ to the ★: North 3, East 2.", "依線索從 ◆ 走到 ★:北 3、東 2。"), n: 5, start: { r: 4, c: 0 }, goal: { r: 1, c: 2 } }) },
    { id: "compass", name: nm("Compass bearing", "指南針方位"),
      build: pickGame({ instr: nm("The treasure is to the NORTH-EAST of the centre. Click that cell.", "寶藏在中心的『東北方』。點出那一格。"), cls: "mg-board mg-board--pick", items: [
        { label: nm("NW", "西北"), ok: false }, { label: nm("N", "北"), ok: false }, { label: nm("NE", "東北"), ok: true },
        { label: nm("W", "西"), ok: false }, { label: nm("·", "·"), ok: false }, { label: nm("E", "東"), ok: false },
        { label: nm("SW", "西南"), ok: false }, { label: nm("S", "南"), ok: false }, { label: nm("SE", "東南"), ok: false }
      ] }) }
  ];

  /* ---- MAZE ---- */
  M.maze = [
    { id: "maze", name: nm("Wall maze", "牆面迷宮"),
      build: dpadGame({ instr: nm("Steer from the start to the exit (★). Walls block you.", "從起點走到出口(★),牆壁會擋路。"), n: 5, start: { r: 0, c: 0 }, goal: { r: 4, c: 4 }, walls: { "0,1": 1, "1,1": 1, "1,3": 1, "2,3": 1, "3,0": 1, "3,1": 1, "3,3": 1 } }) },
    { id: "ghostleg", name: nm("Ghost-leg", "鬼腳圖"), build: ghostlegGame() },
    { id: "laser", name: nm("Align the laser", "對準雷射"),
      build: switchesGame({ instr: nm("Flip all the mirrors ON so the laser reaches the sensor.", "把所有鏡面扳到 ON,讓雷射打到感應器。"), n: 3, icon: "sensors" }) }
  ];

  /* ---- MATCHING ---- */
  M.matching = [
    { id: "shapes", name: nm("Shape ↔ name", "形狀配對"),
      build: matchGame({ instr: nm("Match each shape to its name.", "把每個形狀和名稱配對。"), pairs: { en: [["▲", "Triangle"], ["■", "Square"], ["●", "Circle"], ["★", "Star"]], zh: [["▲", "三角"], ["■", "正方"], ["●", "圓形"], ["★", "星形"]] } }) },
    { id: "colornum", name: nm("Colour ↔ number", "顏色配數字"),
      build: matchGame({ instr: nm("Match each colour to its number.", "把每個顏色和數字配對。"), pairs: { en: [["🔴", "1"], ["🟢", "2"], ["🔵", "3"], ["🟡", "4"]], zh: [["🔴", "1"], ["🟢", "2"], ["🔵", "3"], ["🟡", "4"]] } }) },
    { id: "memory", name: nm("Memory pairs", "記憶翻牌"), build: memoryGame({ syms: ["🔑", "🗝", "🔒", "🧩"] }) }
  ];

  /* ---- AUDIO ---- */
  M.audio = [
    { id: "simon", name: nm("Simon sequence", "聲光序列"), build: simonGame() },
    { id: "notes", name: nm("Notes → digits", "音符對數字"),
      build: decoderGame({ instr: nm("Each note maps to a digit. Read the tune.", "每個音符對應一個數字,讀出旋律。"), keyLabel: nm("Note → digit", "音符 → 數字"), pairs: [["Do", "1"], ["Re", "2"], ["Mi", "3"], ["Fa", "4"], ["So", "5"]], coded: ["Mi", "Do", "So"], answer: "315" }) },
    { id: "tap", name: nm("Tap the rhythm", "敲出節奏"),
      build: seqPressGame({ instr: nm("Reproduce the Morse rhythm by tapping the buttons in order.", "依序點按按鈕,重現這段摩斯節奏。"), labels: ["·", "−"], order: [0, 1, 0, 0] }) }
  ];

  /* ---- REACH ---- */
  M.reach = [
    { id: "magnet", name: nm("Magnet pull", "磁鐵吸取"), build: magnetGame() },
    { id: "pole", name: nm("Extend the pole", "伸長夾取桿"), build: sliderGame({ instr: nm("Extend the pole to reach the key beyond the gap.", "伸長夾取桿,搆到對面的鑰匙。"), icon: "key" }) },
    { id: "mirror", name: nm("Mirror around the corner", "鏡子看轉角"),
      build: pickGame({ instr: nm("Use the mirror to peek around the corner — which door hides the key?", "用鏡子看轉角——哪扇門後藏著鑰匙?"), items: [{ label: nm("Door 1", "門 1"), ok: false }, { label: nm("Door 2", "門 2"), ok: true }, { label: nm("Door 3", "門 3"), ok: false }] }) }
  ];

  /* ---- MECHANISM ---- */
  M.mechanism = [
    { id: "circuit", name: nm("Complete the circuit", "接通電路"),
      build: switchesGame({ instr: nm("Flip all three switches ON to light the lamp.", "把三個開關全部扳到 ON,點亮燈泡。"), n: 3, icon: "lightbulb" }) },
    { id: "sequence", name: nm("Button sequence", "按鈕序列"),
      build: seqPressGame({ instr: nm("Press the buttons in the order shown.", "依顯示的順序按下按鈕。"), labels: ["①", "②", "③"], order: [0, 2, 1] }) },
    { id: "magnet-place", name: nm("Place the magnet", "放對磁鐵"),
      build: pickGame({ instr: nm("Place the magnet on the panel with the hidden latch. Pick the right spot.", "把磁鐵放在藏著磁簧的面板。選對位置。"), cls: "mg-grid mg-grid--4", items: (function () { var a = []; var ok = rnd(8); for (var i = 0; i < 8; i++) a.push({ label: nm("·", "·"), ok: i === ok, cls: "mg-cell" }); return a; })() }) },
    { id: "weight", name: nm("Weight sensor", "重量感應"),
      build: pickGame({ instr: nm("The plate needs exactly 5 kg. Place the right object.", "壓力板剛好需要 5 公斤,放上正確的物件。"), items: [{ label: nm("2 kg", "2 公斤"), ok: false }, { label: nm("5 kg", "5 公斤"), ok: true }, { label: nm("8 kg", "8 公斤"), ok: false }] }) }
  ];

  /* ---- COOPERATION ---- */
  M.cooperation = [
    { id: "relay", name: nm("Describe & relay", "描述傳遞"), build: relayGame() },
    { id: "sync", name: nm("Two-person sync", "雙人同步"), build: syncGame() }
  ];

  /* ---- ROLEPLAY ---- */
  M.roleplay = [
    { id: "dialogue", name: nm("Stay in character", "保持角色"), build: dialogueGame() },
    { id: "culprit", name: nm("Name the culprit", "指認兇手"),
      build: pickGame({ instr: nm("Clues: the culprit is left-handed and wore red. Who is it?", "線索:兇手是左撇子、穿紅衣。是誰?"), items: [{ label: nm("Blue, right-handed", "藍衣、右撇子"), ok: false }, { label: nm("Red, left-handed", "紅衣、左撇子"), ok: true }, { label: nm("Red, right-handed", "紅衣、右撇子"), ok: false }] }) }
  ];

  /* ---- MULTISTEP ---- */
  M.multistep = [
    { id: "two", name: nm("Two-step chain", "兩段嵌套"), build: multistepGame(2) },
    { id: "three", name: nm("Three-step chain", "三段嵌套"), build: multistepGame(3) }
  ];

  window.MINIGAMES = M;
})();

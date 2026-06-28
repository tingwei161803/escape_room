/* =========================================================================
   台灣密室逃脫知識庫 · data.js  (Taiwan Escape Room Codex)

   ONE shared data file, loaded by every .html page. Two globals drive the
   whole multi-page site:
     window.SITE_META  = { title:{en,zh}, subtitle:{en,zh} }
     window.SITE_PAGES = [ { slug, layout, icon, title:{en,zh}, ...data } ]

   Every human-visible string is {en,zh} so the language toggle repaints the
   whole site with nothing stuck in the other language. Content compiled from
   web research on Taiwan's escape-room scene — sources listed in README.md.
   Studio locations on the map are approximate (district level).
   ========================================================================= */

window.SITE_META = {
  title:    { en: "Taiwan Escape Room Codex", zh: "台灣密室逃脫知識庫" },
  subtitle: { en: "Puzzle types, lock families, history, lingo and quizzes — the Taiwan escape-room scene, organized.",
              zh: "遊戲題型、鎖具分類、發展史、術語與測驗 —— 把台灣密室逃脫的知識一次整理清楚。" }
};

window.SITE_PAGES = [

  /* ===================== HOME / HUB ===================== */
  {
    slug: "home", layout: "home", icon: "home",
    title:    { en: "Overview", zh: "總覽" },
    subtitle: { en: "An organized guide to Taiwan's escape-room culture.", zh: "一份系統化的台灣密室逃脫知識整理。" },
    hero: {
      eyebrow: { en: "Taiwan · Real-life escape games", zh: "台灣 · 實境解謎" },
      title:   { en: "Crack the design behind", zh: "拆解每一道鎖" },
      accent:  { en: "every lock", zh: "背後的設計" },
      lead:    { en: "16 puzzle types, 16 lock families, 49 playable mini-games, industry data and a studio map — an encyclopedia for players and creators.",
                 zh: "16 種題型、16 類鎖具、49 個可試玩的小遊戲、產業數據與名店地圖——一座為玩家與創作者打造的密室百科。" },
      stats: [
        { value: 16, label: { en: "Puzzle types", zh: "遊戲題型" } },
        { value: 76, label: { en: "Mini-games", zh: "互動小遊戲" } },
        { value: 16, label: { en: "Lock families", zh: "鎖具分類" } },
        { value: 34, label: { en: "Glossary terms", zh: "術語詞條" } }
      ],
      cta: [
        { href: "puzzles.html", primary: true, label: { en: "Explore puzzle types", zh: "探索遊戲題型" } },
        { href: "tips.html", label: { en: "Beginner's guide", zh: "新手攻略" } }
      ]
    },
    highlights: [
      { icon: "extension", badge: { en: "Puzzles", zh: "題型" },
        title: { en: "16 puzzle types, 76 mini-games", zh: "16 種題型,76 個小遊戲" },
        body:  { en: "From sweep-searching and Caesar ciphers to mazes, UV reveals and circuit mechanisms — every sub-technique has a playable demo with 4 difficulty levels.",
                 zh: "從地毯式搜索、凱撒密碼,到迷宮、UV 顯影、電路機關——每個子技法都能直接試玩,還有 4 種難度。" }, href: "puzzles.html" },
      { icon: "lock", badge: { en: "Locks", zh: "鎖具" },
        title: { en: "16 lock & trigger families", zh: "16 類鎖具與觸發機關" },
        body:  { en: "What each lock looks like, how it opens, how many digits, and which clue feeds it — grouped by mechanism in a spec catalog.",
                 zh: "每種鎖長怎樣、怎麼開、幾位數、對應哪種線索——依機構分類的規格圖鑑。" }, href: "locks.html" },
      { icon: "theater_comedy", badge: { en: "Themes", zh: "主題" },
        title: { en: "Genres, from micro-horror to theatre", zh: "從微恐到沉浸式劇場" },
        body:  { en: "Horror, mystery, adventure, emotional, outdoor city-quests and immersive theatre — how Taiwan's scene styles its rooms.",
                 zh: "恐怖、推理、冒險、情感、戶外城市解謎到沉浸式劇場——台灣如何打造各種主題。" }, href: "themes.html" },
      { icon: "map", badge: { en: "Map", zh: "地圖" },
        title: { en: "Studios across Taiwan", zh: "全台知名工作室地圖" },
        body:  { en: "A searchable map of notable studios north to south, with their signature rooms — plus industry data and history.",
                 zh: "可搜尋的全台名店地圖(北到南),附代表作,再加上產業數據與發展史。" }, href: "brands.html" }
    ],
    explore: [
      { eyebrow: { en: "Core play", zh: "玩法核心" },
        lead: { href: "puzzles.html", title: { en: "16 puzzle types", zh: "16 種遊戲題型" },
                sub: { en: "Search, decode, mechanisms, story — each with a playable demo.", zh: "搜索、解碼、機關、劇情——每種都能試玩。" } },
        links: [ { href: "locks.html", title: { en: "16 lock families", zh: "16 類鎖具圖鑑" } },
                 { href: "glossary.html", title: { en: "Glossary & lingo", zh: "術語速查" } } ] },
      { eyebrow: { en: "Culture & industry", zh: "文化與產業" },
        lead: { href: "history.html", title: { en: "How it grew in Taiwan", zh: "台灣發展史" },
                sub: { en: "From Flash room-escapes to immersive theatre with live actors.", zh: "從 Flash 逃脫到結合真人演員的沉浸式劇場。" } },
        links: [ { href: "stats.html", title: { en: "Industry snapshot", zh: "產業數據" } },
                 { href: "brands.html", title: { en: "Studio map", zh: "知名工作室地圖" } } ] },
      { eyebrow: { en: "Play & practice", zh: "練功與測驗" },
        lead: { href: "quiz.html", title: { en: "Pop quiz", zh: "隨堂測驗" },
                sub: { en: "Ten questions on puzzles, locks and lingo — scored live.", zh: "十題題型、鎖具與術語測驗,即時計分。" } },
        links: [ { href: "flashcards.html", title: { en: "Flashcards", zh: "解謎字卡" } },
                 { href: "tips.html", title: { en: "Beginner's playbook", zh: "新手攻略" } } ] }
    ],
    quote: { text: { en: "A great escape room doesn't test your IQ — it briefly makes you believe another world is real.",
                     zh: "好的密室不是考驗智商,而是讓人短暫相信另一個世界是真的。" },
             cite: { en: "— from a veteran game-master interview", zh: "— 資深關主訪談" } }
  },

  /* ===================== PUZZLE TYPES (gallery) ===================== */
  {
    slug: "puzzles", layout: "catalog", icon: "extension",
    title:    { en: "Puzzle Types", zh: "遊戲題型圖鑑" },
    subtitle: { en: "16 puzzle archetypes you meet in escape rooms, grouped by the skill they test. Tap a card for how to crack it.",
                zh: "密室逃脫常見的 16 種題型,依考驗的能力分類。點卡片看怎麼破解。" },
    categories: [
      { key: "search",    en: "Search",       zh: "搜索類" },
      { key: "code",      en: "Ciphers",      zh: "密碼破譯類" },
      { key: "observe",   en: "Observation",  zh: "觀察類" },
      { key: "logic",     en: "Logic",        zh: "邏輯推理類" },
      { key: "math",      en: "Math",         zh: "數學計算類" },
      { key: "mechanism", en: "Mechanisms",   zh: "機關操作類" },
      { key: "spatial",   en: "Spatial",      zh: "空間方位類" },
      { key: "audio",     en: "Audio",        zh: "聲光感官類" },
      { key: "team",      en: "Teamwork",     zh: "團隊協作類" }
    ],
    items: [
      {
        slug: "search", category: "search",
        title:   { en: "Search & Find Clues", zh: "地毯式搜索" },
        summary: { en: "Comb the room for hidden keys, notes and props.", zh: "翻遍場景,找出被藏起來的鑰匙、紙條與道具。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Search" ],
        overview:{ en: "The first thing any team should do: systematically sweep the room — drawers, behind frames, inside book pages, pockets, window sills. Designers hide clues in 'odd but safe' places and avoid danger zones like ceilings and outlets. Divide the room into zones and call out what you find.",
                   zh: "進房第一件事:有系統地分區搜索——抽屜、相框背後、書頁夾層、口袋、窗台。設計者會把線索藏在「奇怪但安全」的地方,避開天花板、插座等危險區。把房間分區、彼此回報找到什麼,效率最高。" }
      },
      {
        slug: "ciphers", category: "code",
        title:   { en: "Cipher Decoding", zh: "密碼破譯" },
        summary: { en: "Translate symbols back to text with a key: Morse, Caesar, Pigpen, colors and more.", zh: "用對照表把符號譯回文字:摩斯、凱撒、豬圈、顏色密碼等。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Morse", "Caesar", "Pigpen" ],
        overview:{ en: "You get an unreadable message plus a decoding key (or a hint about which cipher it is). Common sub-types: Morse (dots/dashes shown as lights, taps or lines), Caesar (shift letters N places), substitution (custom symbol-to-letter, e.g. Pigpen), binary/ASCII, Zhuyin/kana mapping, and keys built from playing cards, the Chinese zodiac, the eight trigrams (bagua) or colors.",
                   zh: "你拿到一段看不懂的訊息,加上一張解碼表(或提示用哪種密碼)。常見子類:摩斯密碼(點線,常以燈號、敲擊、長短線呈現)、凱撒密碼(字母位移 N 格)、替換密碼(自訂符號↔字母,如豬圈密碼)、二進位/ASCII、注音或五十音對照,以及用撲克牌、十二生肖、八卦、顏色排列當作編碼鍵。" }
      },
      {
        slug: "hidden-text", category: "observe",
        title:   { en: "Hidden Message in Text", zh: "文本隱藏訊息" },
        summary: { en: "Pull the real message out of a block of ordinary-looking text.", zh: "從一段看似正常的文字裡,挑出真正要讀的訊息。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Acrostic" ],
        overview:{ en: "The answer is buried inside normal prose. Techniques include acrostics (first letter of each line spells a word), colored or highlighted letters, and overlay grids — a card with holes laid over a page to reveal only certain words. Tests reading and pattern recognition.",
                   zh: "答案藏在一整段正常文字裡。手法包含藏頭詩(每行首字組成訊息)、用顏色標出特定字、以及挖孔密碼板(蓋上去只露出特定字)。考驗閱讀理解與圖樣辨識。" }
      },
      {
        slug: "reveal", category: "observe",
        title:   { en: "Reveal & Observe (UV / Mirror)", zh: "顯影觀察(紫外線 / 鏡像)" },
        summary: { en: "Use UV light, mirrors or overlays to make invisible clues appear.", zh: "用紫外線、鏡子或疊圖,讓看不見的線索現形。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "UV light" ],
        overview:{ en: "Something is there — you just need the right way to see it. A UV flashlight reveals invisible-ink writing (an escape-room classic); mirrors read reversed text; two semi-transparent sheets overlaid show a hidden answer; magnifiers expose micro-text. Rewards looking at things from a new angle.",
                   zh: "東西其實就在那裡,只是要用對方法看。紫光燈照出隱形墨水寫的字(密室最經典機制之一);鏡子讀反字;兩張半透明圖疊合才出現答案;放大鏡找微縮字。考驗「換個視角」的觀察靈活度。" }
      },
      {
        slug: "math", category: "math",
        title:   { en: "Numbers & Math", zh: "數字計算" },
        summary: { en: "Arithmetic, sequences and counting that produce a lock code.", zh: "靠運算、數列規律或數數量,算出鎖的密碼。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Counting" ],
        overview:{ en: "A code hides in arithmetic, number sequences (arithmetic/Fibonacci), bases or order-of-operations. A frequent variant is counting: tally how many of each object or color appear in a picture, then turn the counts into a code. The result usually feeds a numeric combination lock.",
                   zh: "密碼藏在加減乘除、數列規律(等差/費氏)、進位制或運算順序中。常見變體是「數數量」:數出圖中各物件或各顏色的個數,轉成密碼。算出的數字通常拿去開數字密碼鎖。" }
      },
      {
        slug: "logic", category: "logic",
        title:   { en: "Logic & Deduction", zh: "邏輯推理 / 數獨" },
        summary: { en: "Reason from clue conditions to a single answer or correct order.", zh: "依條件式線索推理出唯一解或正確順序。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Sudoku" ],
        overview:{ en: "You get a set of conditional clues ('A is next to B', 'C is not red') and deduce the answer by elimination — or solve a Sudoku, logic grid, or an ordering puzzle (arrange bottles/cards in the right sequence). Designers also use permutation rules to quickly generate codes. Tests deductive, systematic thinking.",
                   zh: "給一組條件式線索(誰在誰旁邊、A 不等於 B),用刪去法推出答案;或解數獨、邏輯方格、排列順序題(把瓶子/卡片排成正確順序)。設計者也常用排列組合規則快速生成密碼。考驗演繹與系統性思考。" }
      },
      {
        slug: "assembly", category: "observe",
        title:   { en: "Jigsaw & Assembly", zh: "拼圖 / 圖形組合" },
        summary: { en: "Combine scattered pieces into a complete image or message.", zh: "把分散的碎片拼湊成完整圖案或訊息。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Jigsaw" ],
        overview:{ en: "You collect fragments over time — puzzle pieces, torn paper, blocks, transparencies — and only when they are all gathered and correctly assembled does the full message appear. Variants include folding paper to align marks, or stacking blocks into a shape. Builds the instinct that 'I need more clues first'.",
                   zh: "玩家分次蒐集到拼圖碎片、撕裂的紙片、積木或透明片,必須全部到齊並拼對才顯示完整訊息。變體包含摺紙(摺起來才對齊)、積木堆出圖形。也培養「需要先湊齊更多線索」的意識。" }
      },
      {
        slug: "spatial", category: "spatial",
        title:   { en: "Direction, Space & Maps", zh: "方位 / 空間 / 地圖" },
        summary: { en: "Use directions, maps, coordinates or compass bearings to find a position.", zh: "用方向、地圖、座標或指南針,找出位置或順序。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Map" ],
        overview:{ en: "Use N/S/E/W, map coordinates, floor plans or a compass to find a location or work out a movement order. Also includes turning the relative positions of objects in the scene into a code. Tests spatial sense and the ability to translate between directions and answers.",
                   zh: "依東南西北、地圖座標、平面圖或指南針,找到對應位置或解出移動順序。也包含把場景中物件的相對位置轉成密碼。考驗空間感與方位轉換能力。" }
      },
      {
        slug: "maze", category: "spatial",
        title:   { en: "Maze & Path-tracing", zh: "迷宮 / 鬼腳圖" },
        summary: { en: "Trace a path through a maze, ghost-leg chart or rolling-ball board.", zh: "走通迷宮、追蹤鬼腳圖,或用滾珠把鑰匙導出。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Ghost-leg" ],
        overview:{ en: "Get through a maze, follow a ghost-leg (amidakuji) chart, or physically guide a ball/key out of a tilt-maze board. There are 3D wall mazes and laser mazes (don't break the beam) too. Tests hand-eye coordination and path-tracking.",
                   zh: "走通迷宮、追蹤鬼腳圖路線,或實體傾斜板把球(或鑰匙)導出迷宮。也有立體牆面迷宮、雷射迷宮(避開光線)。考驗手眼協調與路徑追蹤。" }
      },
      {
        slug: "matching", category: "logic",
        title:   { en: "Matching & Pairing", zh: "連連看 / 配對" },
        summary: { en: "Correctly pair two sets of elements to get the answer.", zh: "把兩組元素正確配對,得出答案或順序。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Pairing" ],
        overview:{ en: "Pair symbol-to-meaning, image-to-word, or color-to-number; the pairing result is the code or unlock condition. Often combined with color codes and symbol tables. Tests association and recognition.",
                   zh: "把符號↔意義、圖↔字、顏色↔數字成對連起來,配對結果就是密碼或開鎖條件。常與顏色密碼、符號表結合。考驗關聯辨識。" }
      },
      {
        slug: "audio", category: "audio",
        title:   { en: "Sound, Music & Rhythm", zh: "聲音 / 音樂 / 節奏" },
        summary: { en: "Solve via pitch, melody, rhythm or tapping patterns.", zh: "靠音高、旋律、節奏或敲擊聲解出答案。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Audio" ],
        overview:{ en: "The puzzle plays out through your ears: the length of taps (the same idea as Morse), notes that map to numbers, the order colored lights flash, or a coded phrase hidden in a recording. Match what you hear against a key. Tests listening and rhythm memory.",
                   zh: "用聽覺呈現題目:敲擊聲的長短(等同摩斯)、音符對應數字、燈號閃爍順序、錄音中的暗語。把聽到的對照解碼表轉成答案。考驗聽辨與節奏記憶。" }
      },
      {
        slug: "reach", category: "mechanism",
        title:   { en: "Reaching the Unreachable", zh: "取得搆不到之物" },
        summary: { en: "Use tools to retrieve an object you cannot reach by hand.", zh: "用工具把直接拿不到的東西取出來。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Tool use" ],
        overview:{ en: "A key object is visible but out of reach. Use a long stick, magnet, string or mirror to get it — a staple of prison-break themes (a magnet pulls a key ring through the bars). Rewards hands-on creativity.",
                   zh: "關鍵物件看得到卻搆不到,用長棍、磁鐵、繩子或鏡子取得——越獄主題常見(用磁鐵隔著欄杆把鑰匙圈吸出來)。考驗動手創意與工具運用。" }
      },
      {
        slug: "mechanism", category: "mechanism",
        title:   { en: "Mechanism Operation", zh: "機關操作(電路 / 磁感)" },
        summary: { en: "Trigger physical devices — circuits, magnets, sensors — instead of a lock.", zh: "透過電路、磁力或感應裝置觸發,取代傳統密碼鎖。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Sensors" ],
        overview:{ en: "Modern 'mechanism rooms' replace padlocks with triggers: press switches in the right order, complete a circuit (players join hands), place magnets correctly, or break/reflect a laser beam. A control board reads the correct input and releases a maglock or starts the next effect — the heart of the immersive feel.",
                   zh: "現代「機關型密室」用觸發裝置取代鎖頭:依順序按開關、接通電路(玩家手拉手)、把磁鐵放對位置、或讓雷射打到接收器。電路板收到正確輸入就驅動電磁鎖解鎖或啟動下一機關,是沉浸感的核心。" }
      },
      {
        slug: "cooperation", category: "team",
        title:   { en: "Split-room Cooperation", zh: "分隔房間協作" },
        summary: { en: "Players are separated and must describe and relay to solve together.", zh: "玩家被分隔或分工,靠口述、傳遞資訊合解一題。" },
        tags:    [ { en: "Common", zh: "中頻" }, "Communication" ],
        overview:{ en: "Information is deliberately split — one player sees a diagram in room A, another has buttons in room B, and they can only shout or use an intercom. Or two people must operate at once (a two-player maze, synchronized buttons). Tests communication, division of labor and trust.",
                   zh: "資訊刻意分散——有人在 A 房看到圖、有人在 B 房有按鈕,只能靠喊話或對講機溝通;或需要兩人同時操作(雙人迷宮、同步按鈕)。考驗溝通、分工與信任。" }
      },
      {
        slug: "roleplay", category: "team",
        title:   { en: "Role-play & Story Progress", zh: "角色扮演 / 劇情推進" },
        summary: { en: "Play a character and advance the plot through interaction.", zh: "扮演角色,靠演出與互動推進劇情、解鎖下一段。" },
        tags:    [ { en: "Story-driven", zh: "劇情向" }, "Immersive" ],
        overview:{ en: "Common in immersive / live-theater rooms: each player has a character and private information, and must interact with NPCs (actors) and make choices that move the story. Puzzles are wrapped inside narrative tasks. Tests immersion and situational judgment.",
                   zh: "偏沉浸式/實境劇場類密室:每位玩家有角色與專屬資訊,需與 NPC(演員)互動、做選擇來推進劇情。謎題包在劇情任務裡。考驗投入感與情境判斷。" }
      },
      {
        slug: "multistep", category: "logic",
        title:   { en: "Multi-step Nested Puzzles", zh: "多階段嵌套謎題" },
        summary: { en: "Each answer becomes the key to the next — a chained puzzle ladder.", zh: "一題的答案是下一題的鑰匙,層層解鎖串成謎題鏈。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Chained" ],
        overview:{ en: "Not a single puzzle but a chain: solve A to get an item/number, use it on B, which opens C — usually combining many of the other types. It is how designers control pacing and the difficulty curve, and forms the skeleton of almost every mid-to-large room.",
                   zh: "不是單一謎題,而是「解開 A 得到道具/數字 → 用它解 B → 再開 C」的串連結構,常把前面各題型組合在一起。這是設計者控制節奏與難度曲線的手法,也是幾乎所有中大型密室的骨架。" }
      }
    ]
  },

  /* ===================== LOCK FAMILIES (gallery) ===================== */
  {
    slug: "locks", layout: "spec", icon: "lock",
    title:    { en: "Lock Families", zh: "鎖具圖鑑" },
    subtitle: { en: "16 kinds of locks and triggers you will crack — what they look like, how they open, and which clue feeds each one.",
                zh: "你會破解的 16 類鎖具與觸發機關:長怎樣、怎麼開、對應到哪種線索。" },
    categories: [
      { key: "combo",     en: "Combination", zh: "密碼鎖類" },
      { key: "key",       en: "Key locks",   zh: "鑰匙鎖類" },
      { key: "direction", en: "Directional", zh: "方向鎖類" },
      { key: "electronic",en: "Electronic",  zh: "電子鎖類" },
      { key: "mechanism", en: "Mechanical",  zh: "機關/感應類" },
      { key: "hidden",    en: "Hidden / clue",zh: "暗格/線索類" }
    ],
    items: [
      {
        slug: "number-dial", category: "combo",
        title:   { en: "Number Combination Lock", zh: "數字密碼鎖(撥輪)" },
        summary: { en: "Rows of 0–9 dials; line up the right digits and pull.", zh: "幾排 0–9 數字滾輪,轉到正確組合往下拉就開。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "3–4 digits" ],
        overview:{ en: "The most basic escape-room lock: usually 3 or 4 wheels of 0–9. Set each wheel to the answer digit and pull the shackle. Clues produce N digits (arithmetic, counting, mapping symbols to numbers). If you are one wheel short, you can brute-force that single digit.",
                   zh: "密室最基本款:常見 3 輪或 4 輪,每輪 0–9。把每輪轉到答案數字後拉開鎖鉤。謎題會導出 N 個數字(算術、計數、符號對照)。若只差一位,可以暴力破解那一位逐一試。" }
      },
      {
        slug: "rotary-dial", category: "combo",
        title:   { en: "Rotary Dial Lock", zh: "轉盤式密碼鎖(單盤)" },
        summary: { en: "A single dial; turn right-left-right to three numbers.", zh: "單一旋鈕,右-左-右依序對齊三個數字。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "Gym-locker style" ],
        overview:{ en: "The classic gym-locker dial: one disc marked 0–39 (or 0–59). Turn clockwise to the first number, counter-clockwise past it to the second, clockwise to the third. Harder to operate than wheel locks, so it appears less often. Clues give 3 numbers plus a hint about turn direction.",
                   zh: "傳統健身房置物櫃鎖:一個圓盤刻 0–39(或 0–59),順時針對第一碼、逆時針繞過一圈對第二碼、再順時針對第三碼。比撥輪式難操作,出現頻率較低。線索給 3 個數字加上旋轉方向提示。" }
      },
      {
        slug: "directional", category: "direction",
        title:   { en: "Directional Lock", zh: "方向鎖 / 方位鎖" },
        summary: { en: "Open with a sequence of up/down/left/right, not numbers.", zh: "靠上下左右的方向序列開鎖,而非數字。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "8–10 steps" ],
        overview:{ en: "A cross-shaped lever opened by a sequence of pushes — often 8 to 10 steps, with no fixed length limit. Clues come from map paths, mazes, stroke order, a compass or clock hands; sometimes letters are stuck on the directions, turning it into a 'find the word' puzzle.",
                   zh: "一個十字方向桿,依序推上下左右一連串動作開鎖,常 8–10 步且沒有固定上限。線索來自地圖路徑、迷宮、筆順、指南針或時鐘指向;有時方向格貼上字母,變成「找字母」題。" }
      },
      {
        slug: "letter", category: "combo",
        title:   { en: "Letter / Word Lock", zh: "字母鎖 / 單字鎖" },
        summary: { en: "Wheels of A–Z; spell the right word to open.", zh: "滾輪是 A–Z 字母,轉出正確單字才開。" },
        tags:    [ { en: "Medium-high", zh: "中高頻" }, "4–6 letters" ],
        overview:{ en: "Looks like a number wheel lock but each wheel is a letter; spell a 4–6 letter word from the puzzle answer. Clues are anagrams, riddles, missing words in a poem, or symbols decoded to letters. Often several candidate words must be tried.",
                   zh: "外型像數字撥輪鎖,但每輪是字母;轉出 4–6 個字母的單字。線索是重組字謎(anagram)、謎語、詩中缺字,或把符號解碼成字母。常有多組可能字需要試。" }
      },
      {
        slug: "key-padlock", category: "key",
        title:   { en: "Key Padlock", zh: "鑰匙掛鎖" },
        summary: { en: "The classic lock — find the matching key and turn.", zh: "最經典的鎖,找到對應鑰匙插入轉開。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Find the key" ],
        overview:{ en: "A traditional padlock with no code — the puzzle is finding the right key, hidden in a compartment, a prop's lining, or revealed only after solving the previous step. Tip: once open, leave the key in the lock so you do not mix it up later.",
                   zh: "傳統掛鎖,沒有密碼——核心是「找鑰匙」,藏在暗格、道具夾層,或解完前一關才出現。小撇步:開了之後把鑰匙留在鎖上,避免之後搞混。" }
      },
      {
        slug: "luggage", category: "combo",
        title:   { en: "Luggage / Briefcase Lock", zh: "行李箱撥輪鎖" },
        summary: { en: "A small 3-wheel dial built into a case; set code, press to pop.", zh: "箱體內嵌的小型 3 輪撥盤,轉到密碼按鈕彈開。" },
        tags:    [ { en: "Medium-high", zh: "中高頻" }, "3 digits" ],
        overview:{ en: "The small 3-wheel dial on a suitcase or briefcase (000–999). Turn to the code and press the release to pop it open; the code is resettable. Cheap and easy to source, so both DIY and commercial rooms use it as a container lock.",
                   zh: "行李箱或手提箱上的小型 3 輪撥盤(000–999),轉到密碼後按開關鈕彈開,密碼可重設。便宜好取得,DIY 與商業密室都常拿來當「鎖住道具箱」的容器鎖。" }
      },
      {
        slug: "maglock", category: "electronic",
        title:   { en: "Electromagnetic Lock (Maglock)", zh: "電磁鎖(Maglock)" },
        summary: { en: "Electric magnet holds a door shut; correct input cuts power to release.", zh: "電磁鐵把門吸住,輸入正確才斷電釋放。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "No bolt" ],
        overview:{ en: "An electromagnet on the frame holds a steel plate on the door — no mechanical bolt. A control board judges the 'correct input' and cuts power so the door springs open. Because there is no bolt it cannot jam, making escape safer. Common in large mechanism rooms.",
                   zh: "門框上一塊電磁鐵吸住門上的鐵板,沒有機械鎖舌。電路板判定「正確輸入」後斷電,門就彈開。因為沒有鎖舌不會卡死,逃生較安全,是大型機關密室的標準配備。" }
      },
      {
        slug: "hidden-compartment", category: "hidden",
        title:   { en: "Hidden Compartment / Secret Drawer", zh: "暗格 / 暗櫃" },
        summary: { en: "Clues hidden in false bottoms or disguised objects.", zh: "把線索藏在假底、夾層或偽裝物件裡。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Disguised" ],
        overview:{ en: "Looks like ordinary furniture or decor, but conceals a hidden switch, a sliding false bottom, or a compartment that only pops after you solve something. Found via search puzzles and noticing anomalies — a raised book spine, something under the rug, behind a frame.",
                   zh: "外觀像普通家具或擺設,卻藏著隱藏開關、滑動假底,或解謎後才彈開的暗格。靠搜索題與觀察異常找到——書背凸起、地毯下、畫框後方。" }
      },
      {
        slug: "mechanical", category: "mechanism",
        title:   { en: "Mechanical Mechanism Lock", zh: "機械機關鎖" },
        summary: { en: "Gears, levers and button sequences release a latch physically.", zh: "齒輪、拉桿或按鈕序列以物理方式釋放。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "Gears" ],
        overview:{ en: "Opens through a physical mechanism — align gears, press buttons in the right order, push a lever into place — not necessarily electric. The answer is a correct order/combination rather than a number. A core delight of high-quality mechanism rooms, but costlier to build.",
                   zh: "靠物理機構開啟——轉齒輪對位、依正確順序按按鈕、推拉桿到定位,不一定用電。答案是「正確的順序/組合」而非數字。是高品質機關密室的核心趣味,但成本較高。" }
      },
      {
        slug: "magnet", category: "mechanism",
        title:   { en: "Hidden Magnet Lock", zh: "磁鐵鎖 / 隱藏磁吸" },
        summary: { en: "Find the right magnet and place it to release a latch.", zh: "找到正確磁鐵、放對位置來釋放閂或觸發感應。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "Magnet" ],
        overview:{ en: "A magnet hidden in a prop or pocket releases a concealed reed latch when brought near, or completes a magnetic sensor when stuck to the right spot. No code — it is about the correct object in the correct position. Often paired with secret compartments.",
                   zh: "某處藏一塊磁鐵(道具裡、口袋),靠近隱藏的磁簧閂使其釋放,或貼到指定點接通磁感機關。沒有密碼,核心是「正確物件 + 正確位置」。常與暗格搭配。" }
      },
      {
        slug: "uv-clue", category: "hidden",
        title:   { en: "UV / Blacklight Clue", zh: "UV 紫外線線索" },
        summary: { en: "Not a lock — invisible-ink clues that only show under UV light.", zh: "嚴格說不是鎖——用紫外線照才現形的隱形線索。" },
        tags:    [ { en: "Very common", zh: "高頻" }, "Clue layer" ],
        overview:{ en: "Strictly a clue layer, not a lock. A UV flashlight reveals invisible-ink numbers, letters, directions or symbols written on walls, props or paper — which then feed a real lock (number, letter or directional). One of the most common reveal techniques.",
                   zh: "嚴格說是「揭露密碼」的線索層,不是鎖。用紫光燈照牆面、道具或紙張,顯現隱形墨水寫的數字、字母、方向或符號,再拿去開對應的鎖(數字/字母/方向)。最常見的顯影手法之一。" }
      },
      {
        slug: "sensor", category: "mechanism",
        title:   { en: "Weight / IR Sensor Trigger", zh: "重量 / 紅外線感應機關" },
        summary: { en: "Pressure plates, lasers or proximity sensors fire a mechanism.", zh: "壓力板、雷射或感應器偵測,觸發機關開鎖。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "Sensors" ],
        overview:{ en: "Detect a physical condition — place the right weight on a tray, hit a receiver with a laser, break an IR beam, or bring metal near a sensor — and the control board outputs an unlock signal or plays a sound. Common in higher-end mechanism rooms.",
                   zh: "偵測物理條件——把對的重量放上托盤、用雷射打到接收器、遮斷紅外線、或把金屬靠近感應器——電路板就輸出開鎖訊號或播音效。較高階的機關密室常見。" }
      },
      {
        slug: "rfid", category: "electronic",
        title:   { en: "RFID / Proximity Card", zh: "RFID / 感應卡" },
        summary: { en: "Tap the right tagged object to a reader to trigger a release.", zh: "把帶標籤的正確道具靠近感應器即觸發。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "NFC" ],
        overview:{ en: "An RFID-tagged card, coin or key ring is tapped to a reader to release a lock or fire a mechanism — pop a cabinet, light up, play audio, or trigger something remotely. The puzzle is working out which prop is the 'right' tag. Common in modern spy/sci-fi themes.",
                   zh: "把帶 RFID 標籤的卡片、硬幣或鑰匙圈靠近讀頭即觸發開鎖或機關——彈開櫃子、亮燈、播音,或遠端觸發其他效果。謎題是找出「哪個道具才是對的卡」。現代諜報/科幻主題常用。" }
      },
      {
        slug: "keypad", category: "electronic",
        title:   { en: "Digital Keypad Lock", zh: "數字鍵盤電子鎖" },
        summary: { en: "Type the right code on an electronic pad to release a maglock.", zh: "在電子按鍵面板輸入正確密碼,驅動電磁鎖開門。" },
        tags:    [ { en: "Medium-high", zh: "中高頻" }, "4–6 digits" ],
        overview:{ en: "An electronic keypad (touch or physical) — enter the correct 4–6 digit code and the mechanism or maglock releases. The code comes from a logic, math or pattern puzzle. A staple of high-tech, heist and sci-fi themed rooms.",
                   zh: "電子按鍵面板(觸控或實體),輸入正確的 4–6 位密碼,機構或電磁鎖就釋放。密碼來自邏輯、數學或找規律題。科技、搶劫、科幻主題的標配。" }
      },
      {
        slug: "cryptex", category: "combo",
        title:   { en: "Cryptex", zh: "密碼筒(Cryptex)" },
        summary: { en: "A cylinder with letter rings; spell the word to pull out the core.", zh: "圓筒外圈字母環,轉出單字才能抽出內藏物。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "5–6 letters" ],
        overview:{ en: "The Da Vinci Code-style cylinder — usually 5–6 rotating letter rings. Align the password word and slide out the core (often a key or note). Clues are multi-step word riddles, lines of poetry or coded hints. Common in history, literary and mystery themes.",
                   zh: "像《達文西密碼》的圓筒,通常 5–6 個字母環。對齊密碼單字後抽出內芯(常藏鑰匙或紙條)。線索是多步驟字謎、詩句或暗號。歷史、文學、推理主題常見。" }
      },
      {
        slug: "symbol", category: "combo",
        title:   { en: "Kana / Zhuyin / Symbol Lock", zh: "五十音 / 注音 / 符號鎖" },
        summary: { en: "Decode symbols to kana, Zhuyin or numbers, then feed a standard lock.", zh: "把符號查表轉成假名/注音/數字,再去開標準鎖。" },
        tags:    [ { en: "Medium", zh: "中頻" }, "Decode table" ],
        overview:{ en: "Usually a 'decode table' design rather than a physical kana lock: a reference chart maps symbols to Japanese kana, Zhuyin or numbers, which you translate and then enter into a standard number/letter lock. Chinese radical, stroke-count and Zhuyin conversions are common local variants.",
                   zh: "實務上多是「對照表」設計,而非純實體的五十音鎖:給一張解碼盤,把場景符號逐一查表轉成假名、注音或數字,再輸入標準的數字/字母鎖。中文部首、筆畫、注音轉換是常見的在地變體。" }
      }
    ]
  },

  /* ===================== THEME TYPES (gallery) ===================== */
  {
    slug: "themes", layout: "editorial", icon: "theater_comedy",
    title:    { en: "Theme Types", zh: "主題類型" },
    subtitle: { en: "The genres and formats of Taiwan's real-life games — from micro-horror to immersive theater and outdoor city quests.",
                zh: "台灣實境遊戲的主題與形式——從微恐到沉浸式劇場,再到戶外城市解謎。" },
    categories: [
      { key: "thrill",    en: "Thrill",    zh: "驚悚刺激" },
      { key: "mystery",   en: "Mystery",   zh: "推理懸疑" },
      { key: "adventure", en: "Adventure", zh: "冒險輕鬆" },
      { key: "narrative", en: "Narrative", zh: "敘事沉浸" },
      { key: "format",    en: "Format",    zh: "體驗形式" }
    ],
    items: [
      {
        slug: "horror", category: "thrill",
        title:   { en: "Horror & Thriller", zh: "恐怖驚悚" },
        summary: { en: "Taiwan's most-watched genre, split into micro-horror and extreme-horror.", zh: "台灣最受關注的類型之一,分微恐與極恐。" },
        tags:    [ { en: "Popular", zh: "熱門" } ],
        overview:{ en: "Often ranked as its own category in annual lists, with 'micro' and 'extreme' tiers. Common in Taiwan: haunted/abandoned-hospital/ruins settings, jump scares, light-and-sound effects and live actors chasing players.",
                   zh: "常於年度評比中獨立成類,分「微恐」與「極恐」。台灣常見:鬼怪/廢墟/醫院場景、jump scare、聲光特效,以及真人鬼追逐。" }
      },
      {
        slug: "mystery", category: "mystery",
        title:   { en: "Mystery & Detective", zh: "推理懸疑" },
        summary: { en: "Logic and plot heavy — solve the case, find the culprit.", zh: "重邏輯與劇情,偵探辦案、找真兇。" },
        tags:    [ { en: "Plot-heavy", zh: "重劇情" } ],
        overview:{ en: "Emphasizes deduction and story: castle or crime-scene settings, piecing clues together, plot twists. Taiwan studios such as BGLOCK and various reasoning-focused titles specialize here.",
                   zh: "重視推理與劇情:古堡或案發現場場景、線索拼湊、劇情反轉。台灣如 BGLOCK 與多款推理主題專攻此類。" }
      },
      {
        slug: "adventure", category: "adventure",
        title:   { en: "Adventure & Escape", zh: "冒險解謎" },
        summary: { en: "Light, beginner-friendly romps — treasure, exploration, escape.", zh: "輕鬆闖關、新手友善——寶藏、探險、逃出。" },
        tags:    [ { en: "Beginner", zh: "新手友善" } ],
        overview:{ en: "A relaxed take aimed at newcomers: treasure/exploration/escape setups with lots of mechanisms, fewer locks, and an emphasis on fun over fear.",
                   zh: "輕鬆取向、適合新手:寶藏/探險/逃出設定,機關多、鎖頭少,強調趣味而非驚嚇。" }
      },
      {
        slug: "history", category: "narrative",
        title:   { en: "History & Culture", zh: "歷史文化" },
        summary: { en: "Periods and places brought to life through puzzles.", zh: "用謎題重現特定時代與地方。" },
        tags:    [ { en: "Educational", zh: "知識感" } ],
        overview:{ en: "Rooms built around historical settings and cultural motifs; puzzles often tie into period props, scripts and local stories — overlaps with Taiwan's issue-based outdoor games.",
                   zh: "以歷史場景與文化元素打造的密室;謎題常結合時代道具、劇本與地方故事——與台灣的議題式戶外遊戲常有交集。" }
      },
      {
        slug: "scifi", category: "adventure",
        title:   { en: "Sci-fi & Future", zh: "科幻未來" },
        summary: { en: "Spaceships, labs and heists with high-tech locks.", zh: "太空船、實驗室、諜報,配上科技感鎖具。" },
        tags:    [ { en: "High-tech", zh: "科技感" } ],
        overview:{ en: "Future and tech settings lean on electronic gear: keypads, RFID taps, sensor mechanisms and screens. Strong on spectacle and 'control-room' atmosphere.",
                   zh: "未來與科技場景大量使用電子裝置:鍵盤鎖、RFID 感應、感應機關與螢幕。著重視覺奇觀與「控制室」氛圍。" }
      },
      {
        slug: "emotional", category: "narrative",
        title:   { en: "Emotional & Heartfelt", zh: "情感敘事 / 溫馨" },
        summary: { en: "Move you with a story rather than scare you — an emerging direction.", zh: "不靠驚嚇,用故事感動人,近年新興方向。" },
        tags:    [ { en: "Emerging", zh: "新興" } ],
        overview:{ en: "A growing trend that swaps scares for feeling: family, memory and journey themes (e.g. grandmother / old-home settings from studios like Mr.Myth and EnterSpace).",
                   zh: "近年成長的方向,以情感取代驚嚇:家庭、回憶、旅程題材(如謎先生、EnterSpace 的外婆/阿嬤家主題)。" }
      },
      {
        slug: "family", category: "adventure",
        title:   { en: "Family & Kids", zh: "親子闖關" },
        summary: { en: "Gentle difficulty for families and children.", zh: "適合家庭與兒童的友善難度。" },
        tags:    [ { en: "All ages", zh: "闔家" } ],
        overview:{ en: "Friendly-difficulty rooms with cartoonish settings, simple puzzles and cooperative challenges. Many studios run a dedicated family line.",
                   zh: "友善難度,卡通化場景、簡易謎題、合作闖關。多家工作室設有專屬的親子線。" }
      },
      {
        slug: "immersive", category: "format",
        title:   { en: "Immersive Theater", zh: "沉浸式劇場" },
        summary: { en: "Close-up actor interaction; some shows have no puzzles at all.", zh: "與演員近距離互動,有些全程甚至沒有謎題。" },
        tags:    [ { en: "Actors", zh: "真人演員" } ],
        overview:{ en: "Experience-driven and dynamic: professional actors, improvisation and theatrical atmosphere. Some productions (e.g. INSANE by Dream Kingdom) run as a 90-minute show with no puzzles at all.",
                   zh: "體驗導向、動態:專業演員、即興與戲劇氛圍。部分製作(如夢遊王國 INSANE)是 90 分鐘演出、全程無謎題。" }
      },
      {
        slug: "outdoor", category: "format",
        title:   { en: "Outdoor / City Quest", zh: "戶外實境 / 城市解謎" },
        summary: { en: "Small groups solve puzzles across real streets and landmarks.", zh: "小組在真實街道、景點移動解謎。" },
        tags:    [ { en: "On location", zh: "走出戶外" } ],
        overview:{ en: "Groups of up to six move through real streets and sites with a physical puzzle kit plus a phone web-app, often tied to local stories or social issues — pioneered in Taiwan by Clubon.",
                   zh: "6 人以內小組,帶著實體謎題包加手機網頁,在真實街道與景點移動解謎,常結合地方故事或社會議題——台灣由聚樂邦 Clubon 開創。" }
      },
      {
        slug: "largegroup", category: "format",
        title:   { en: "Large Group / LARP", zh: "大型團體 / 劇本殺" },
        summary: { en: "Dozens of players, NPC interaction, team competition.", zh: "數十人分組、NPC 互動、隊伍競賽。" },
        tags:    [ { en: "Team-building", zh: "團建常用" } ],
        overview:{ en: "Task-driven and dynamic for tens to over a hundred players: NPC interaction, multi-stage challenges and inter-team competition — popular for corporate team-building. Overlaps with script-murder (LARP) where each player has a role.",
                   zh: "任務導向、動態,可數十至上百人:NPC 互動、多重關卡、隊伍競賽——企業團建常用。與「劇本殺」(每人有角色設定)有交集。" }
      }
    ]
  },

  /* ===================== HISTORY (timeline) ===================== */
  {
    slug: "history", layout: "timeline", icon: "history",
    title:    { en: "How It Grew in Taiwan", zh: "台灣發展史" },
    subtitle: { en: "From Flash 'escape the room' games to immersive theater with live actors.",
                zh: "從 Flash「逃出房間」小遊戲,到結合真人演員的沉浸式劇場。" },
    events: [
      { date: { en: "~2004", zh: "約 2004" },
        title: { en: "Flash room-escape games", zh: "電腦解謎遊戲時代" },
        body:  { en: "One root of the genre: Toshimitsu Takagi's Flash games (e.g. Crimson Room) had players click around a virtual room to find clues and escape — the seed of the core 'find clues in a sealed room' loop.",
                 zh: "類型源頭之一:高木敏光的 Flash 遊戲(如緋紅房間)讓玩家在虛擬房間點擊找線索、解謎開門,奠定「在密閉空間找線索逃脫」的核心玩法雛形。" } },
      { date: { en: "2006", zh: "2006" },
        title: { en: "Real-life concept forms (US)", zh: "真人實境概念成形(美國)" },
        body:  { en: "Real-life escape — moving the screen into a physical room — is recorded as starting in 2006, when Silicon Valley programmers built Agatha Christie-inspired puzzle escapes, first as a company team activity.",
                 zh: "把螢幕搬進真實房間的真人實境,被記載為 2006 年起源於美國矽谷,工程師以阿嘉莎·克莉絲蒂作品為靈感設計真人解謎逃脫,最初是公司團康。" } },
      { date: { en: "2007", zh: "2007" },
        title: { en: "Asia's origin: SCRAP (Japan)", zh: "亞洲起源:日本 SCRAP" },
        body:  { en: "Japan's SCRAP held the first 'Real Escape Game' in 2007. Early events focused on puzzle-solving with no real 'room' or 'escape' — those came in later works.",
                 zh: "日本 SCRAP 於 2007 年舉辦第一場「解謎脫逃遊戲」。初期著重解謎,還沒有真正的「房間」與「逃脫」,要到後續作品才導入密室概念。" } },
      { date: { en: "2011", zh: "2011" },
        title: { en: "The wave reaches Taiwan", zh: "風潮擴散至台灣" },
        body:  { en: "From 2011 SCRAP staged shows across China, Taiwan and Singapore, sparking Asia's escape-room boom — Taiwan began encountering the real-life puzzle format.",
                 zh: "SCRAP 自 2011 年起在中國、台灣、新加坡等地初演,帶動亞洲密室逃脫風潮,台灣開始接觸實境解謎形式。" } },
      { date: { en: "2012", zh: "2012" },
        title: { en: "Local teams, first physical rooms", zh: "在地團隊與本土實體密室" },
        body:  { en: "From 2012, local creative teams in Taiwan and elsewhere began opening their own escape themes, shifting from pure puzzle events toward rooms with physical sets.",
                 zh: "2012 年起,台灣等地的在地創意團隊開始自行開設密室主題,從單純解謎活動逐漸轉向有實體場景的密室。" } },
      { date: { en: "2013", zh: "2013" },
        title: { en: "Landmark local studio", zh: "本土代表工作室成立" },
        body:  { en: "Stupidparticle was founded in 2013; its breakout title 'Deadly Chains' became a years-long classic. Taiwan entered a phase of rapid expansion with venues opening across the north, center and south.",
                 zh: "笨蛋工作室於 2013 年成立,發跡作《奪命鎖鏈》成為熱銷多年的經典。此後台灣進入實體密室快速展店期,北中南陸續開設。" } },
      { date: { en: "2016", zh: "2016" },
        title: { en: "Outdoor / issue-based games", zh: "戶外與議題遊戲分支" },
        body:  { en: "Clubon was founded in 2016, using 'issue-based reality games' to link places and social topics — players solve on real streets with a game box and phone, extending the room into the city.",
                 zh: "聚樂邦 Clubon 於 2016 年創立,以「議題實境遊戲」連結地方與社會議題,玩家拿遊戲盒在真實街道搭配手機解謎,把密室延伸到城市場景。" } },
      { date: { en: "~2016", zh: "約 2016" },
        title: { en: "Big immersive rooms & headwinds", zh: "大型沉浸式與產業挑戰" },
        body:  { en: "Venues upgraded to film-grade sets and effects, while the industry faced seasonality and outside competition — when Pokemon GO launched in 2016, some operators saw monthly revenue fall below half of prior years.",
                 zh: "場館升級為電影級場景與特效,同時面臨淡旺季與外部衝擊——2016 年 Pokemon GO 上線曾使部分業者單月營業額不到往年同期一半。" } },
      { date: { en: "2024–2026", zh: "2024–2026" },
        title: { en: "Theatrical turn with live NPCs", zh: "結合 NPC 的劇場化演進" },
        body:  { en: "High-end productions add live actors: Slipaway blends escape with immersive theater (two pro actors per session), Mr.Myth brought China-style light/sound + live-NPC horror to Taichung, and Dream Kingdom runs a puzzle-free 90-minute immersive show. The scene shifts from 'hardest puzzles' to 'best immersion'.",
                 zh: "高規格製作加入真人演員:開溜製造所結合密室與沉浸式劇場(每場 2 名專業演員)、謎先生把中國式聲光電加真人 NPC 恐怖密室引進台中、夢遊王國推出全程 90 分鐘無謎題沉浸式演出。產業從「比解謎難度」轉向「比沉浸體驗」。" } },
      { date: { en: "2025", zh: "2025" },
        title: { en: "Market tops NT$1 billion", zh: "市場產值破 10 億" },
        body:  { en: "Operators estimate Taiwan's offline reality-experience market (escape rooms + immersive theatre) topped NT$1 billion in 2025, with multi-million-dollar productions like Stupidparticle's 165-minute 'Yesterday Ward' (four story lines, eight endings) drawing replay-driven, non-traditional audiences.",
                 zh: "業者估計台灣線下實境體驗(密室 + 沉浸式劇場)2025 年產值突破新台幣 10 億元;出現耗資千萬的大製作,如笨蛋工作室約 165 分鐘的《昨日病房》(4 條故事線、8 種結局),以多結局吸引重複遊玩與非傳統客群。" } },
      { date: { en: "2022–2026", zh: "2022–2026" },
        title: { en: "Industrialization & regulation push", zh: "產業化與法規推動" },
        body:  { en: "A Taiwan Immersive Experience Association formed in 2022 and lobbied to fold immersive entertainment into the cultural-creative industries in 2023. Genres keep blurring with script-murder (LARP) and IP crossovers — while fuzzy definitions, high build costs and unclear fire/safety rules remain hurdles to scaling.",
                 zh: "2022 年成立「台灣沉浸式體驗協會」,2023 年推動將沉浸式產業納入文創產業;類型持續與劇本殺(LARP)、IP 聯名融合——但定義模糊、建置成本高、消防/公安法規不明,仍是規模化的阻礙。" } }
    ]
  },

  /* ===================== INDUSTRY STATS (dashboard) ===================== */
  {
    slug: "stats", layout: "dashboard", icon: "bar_chart",
    title:    { en: "Industry Snapshot", zh: "產業數據" },
    subtitle: { en: "Approximate figures gathered from Taiwan player guides and operator articles — for orientation, not official statistics.",
                zh: "整理自台灣玩家指南與業者文章的概略數字,僅供參考,非官方統計。" },
    stats: [
      { label: { en: "Venues nationwide", zh: "全台店家概數" }, value: "80", unit: { en: "approx.", zh: "間左右" } },
      { label: { en: "Avg. price (Greater Taipei)", zh: "大台北平均價" }, value: "550", unit: { en: "NT$/person", zh: "元/人" } },
      { label: { en: "Common duration", zh: "常見遊戲時長" }, value: "60", unit: { en: "min", zh: "分鐘" } },
      { label: { en: "Typical team size", zh: "常見隊伍人數" }, value: "2–8", unit: { en: "players", zh: "人" } }
    ],
    bars: {
      title: { en: "Venues by city (approx.)", zh: "各縣市店家數(概數)" },
      series: [
        { label: { en: "Taipei",    zh: "台北" }, value: 27 },
        { label: { en: "Taichung",  zh: "台中" }, value: 18 },
        { label: { en: "Taoyuan",   zh: "桃園" }, value: 15 },
        { label: { en: "Kaohsiung", zh: "高雄" }, value: 9 },
        { label: { en: "Tainan",    zh: "台南" }, value: 6 },
        { label: { en: "New Taipei",zh: "新北" }, value: 6 }
      ]
    },
    table: {
      columns: [
        { key: "region",  label: { en: "Region", zh: "區域" } },
        { key: "venues",  label: { en: "Venues", zh: "店家數" } },
        { key: "price",   label: { en: "Typical price", zh: "常見價位" } },
        { key: "cities",  label: { en: "Main cities", zh: "主要城市" } }
      ],
      rows: [
        { region: { en: "North",   zh: "北部" }, venues: "~47", price: { en: "NT$200–2,400", zh: "200–2,400 元" }, cities: { en: "Taipei, Taoyuan", zh: "台北、桃園" } },
        { region: { en: "Central", zh: "中部" }, venues: "~20", price: { en: "NT$190–1,499", zh: "190–1,499 元" }, cities: { en: "Taichung", zh: "台中" } },
        { region: { en: "South",   zh: "南部" }, venues: "~14", price: { en: "NT$100–2,200", zh: "100–2,200 元" }, cities: { en: "Kaohsiung, Tainan", zh: "高雄、台南" } }
      ]
    }
  },

  /* ===================== STUDIOS MAP (map) ===================== */
  {
    slug: "brands", layout: "map", icon: "map",
    title:    { en: "Notable Studios", zh: "知名工作室地圖" },
    subtitle: { en: "A sample of well-known Taiwan studios. Markers are approximate (district level), not exact addresses.",
                zh: "台灣知名工作室取樣。圖釘為概略位置(行政區級),非精確地址。" },
    categories: [
      { key: "north",   en: "Northern Taiwan", zh: "北部" },
      { key: "central", en: "Central Taiwan",  zh: "中部" },
      { key: "south",   en: "Southern Taiwan", zh: "南部" }
    ],
    places: [
      { slug: "stupidparticle", category: "north", lat: 25.047, lng: 121.517,
        name: { en: "Stupidparticle", zh: "笨蛋工作室" },
        body: { en: "Veteran chain founded 2013 (Taipei / Hsinchu / Taichung); 500k+ visitors, known for 'Deadly Chains' and 'Deja Vu'. Approx. Taipei.",
                zh: "2013 成立的老牌連鎖(台北/新竹/台中),累積超過 50 萬人,代表作《奪命鎖鏈》《奪命記憶》。概略台北。" } },
      { slug: "enterspace", category: "north", lat: 25.052, lng: 121.520,
        name: { en: "EnterSpace", zh: "EnterSpace 智慧獵人" },
        body: { en: "'Escape-room cinema' with film-grade effects, ~14 themes, 2–10 players. Zhongshan, Taipei (approx.).",
                zh: "主打「密室逃脫電影院」,電影級特效、約 14 款主題、2–10 人。台北中山(概略)。" } },
      { slug: "clubon", category: "north", lat: 25.045, lng: 121.530,
        name: { en: "Clubon", zh: "聚樂邦" },
        body: { en: "Pioneer of outdoor 'issue-based reality games' since 2016, 40+ titles linking social topics. Taipei (approx.).",
                zh: "2016 起的戶外「議題實境遊戲」先驅,40+ 款連結社會議題的遊戲。台北(概略)。" } },
      { slug: "slipaway", category: "north", lat: 25.088, lng: 121.524,
        name: { en: "Slipaway", zh: "開溜製造所" },
        body: { en: "Escape blended with immersive theater; a 100-ping double-height set with two pro actors per session. Shilin, Taipei (approx.).",
                zh: "密室結合沉浸式劇場,百坪挑高雙層場景,每場 2 名專業演員。台北士林(概略)。" } },
      { slug: "dream", category: "north", lat: 25.056, lng: 121.510,
        name: { en: "Dream Kingdom", zh: "夢遊王國" },
        body: { en: "'Dream-entering' ritual with horror/mystery/idol/family styles; runs the puzzle-free immersive show INSANE. Dadaocheng, Taipei (approx.).",
                zh: "入夢儀式 + 驚悚/懸疑/偶像/親子多風格,推全程無謎題沉浸式演出 INSANE。台北大稻埕(概略)。" } },
      { slug: "funlock", category: "north", lat: 25.041, lng: 121.545,
        name: { en: "Funlock", zh: "Funlock 放樂工作室" },
        body: { en: "Well-known chain that grew from the north and expanded to Taichung. Taipei (approx.).",
                zh: "北部起家、展店至台中的知名連鎖工作室。台北(概略)。" } },
      { slug: "loop", category: "central", lat: 24.151, lng: 120.646,
        name: { en: "LOOP", zh: "LOOP 迴圈" },
        body: { en: "A Taichung flagship — three branches clustered on Wenxin Rd., known for varied horror themes. Taichung (approx.).",
                zh: "台中代表工作室,三館集中文心路,以多樣恐怖主題著稱。台中(概略)。" } },
      { slug: "bglock", category: "central", lat: 24.137, lng: 120.685,
        name: { en: "BGLOCK", zh: "BGLOCK 推理解謎館" },
        body: { en: "Reasoning-focused studio; original branch plus a store near Miyahara. East/Central Taichung (approx.).",
                zh: "主打推理解謎,東光園創始店加宮原眼科旁綠川店。台中東區/中區(概略)。" } },
      { slug: "sogoods", category: "central", lat: 24.150, lng: 120.660,
        name: { en: "SoGoods", zh: "SoGoods 說故事" },
        body: { en: "Novel-like visuals with a strong 'storytelling' immersion style. Taichung (approx.).",
                zh: "主題視覺如小說,強調劇情沉浸的「說故事」風格。台中(概略)。" } },
      { slug: "mrmyth", category: "central", lat: 24.160, lng: 120.650,
        name: { en: "Mr.Myth", zh: "謎先生 Mr.Myth" },
        body: { en: "Brought China-style light/sound + live-NPC horror to Taichung in 2024 (e.g. the 'Haunted Toilet' series). Taichung (approx.).",
                zh: "2024 把中國式聲光電加真人 NPC 恐怖密室引進台中(如「詭廁」系列)。台中(概略)。" } },
      { slug: "rostart", category: "north", lat: 25.033, lng: 121.567,
        name: { en: "Rostart Games", zh: "邏思起子" },
        body: { en: "Scenery-rich adventure rooms; the long-running pirate hit 'One-eyed Jack'. Xinyi, Taipei (approx.).",
                zh: "以場景與冒險主題著稱,長壽海盜尋寶作《獨眼傑克》。台北信義(概略)。" } },
      { slug: "crazymi", category: "north", lat: 24.999, lng: 121.499,
        name: { en: "Crazy Mi", zh: "瘋密工作室" },
        body: { en: "Immersive light/sound with live dance performance; the Japanese-yokai bathhouse room 'Yotang'. Zhonghe, New Taipei (approx.).",
                zh: "結合聲光與真人舞蹈表演的沉浸式體驗,日式妖怪湯屋《妖湯異聞錄》。新北中和(概略)。" } },
      { slug: "a5studio", category: "north", lat: 24.989, lng: 121.314,
        name: { en: "A5 Studio", zh: "A5 Studio 全員脫逃中" },
        body: { en: "Taoyuan's first escape studio; theatre/film crew built theatre-grade sets. Taoyuan + Zhongli (approx.).",
                zh: "桃園第一間密室工作室,劇場/電影團隊打造劇場級場景。桃園站前 + 中壢(概略)。" } },
      { slug: "grimmtell", category: "north", lat: 24.804, lng: 120.971,
        name: { en: "Grimm Tell", zh: "格林跳工作室" },
        body: { en: "A Hsinchu must-play with rich storylines and beginner-friendly rooms like 'Moon-Thief's Notes'. Hsinchu (approx.).",
                zh: "新竹必玩,劇情豐富,有新手友善的《盜月筆記》。新竹(概略)。" } },
      { slug: "taog", category: "central", lat: 24.144, lng: 120.679,
        name: { en: "TAOG (God's Absence)", zh: "神不在場" },
        body: { en: "Self-styled 'Taiwan's largest', spanning Taichung / Tainan / Taipei; e.g. 'Heir of Fairy Tales'. Central Taichung (approx.).",
                zh: "自述「全台最大」,跨台中/台南/台北,代表作《童話的繼承者》。台中中區(概略)。" } },
      { slug: "escer", category: "central", lat: 24.151, lng: 120.664,
        name: { en: "Escer", zh: "異世客" },
        body: { en: "Founded by enthusiasts; 20+ big themes including VR and immersive theatre, three branches, 2-player start. Taichung (approx.).",
                zh: "密室愛好者創立,20+ 大主題含 VR 與沉浸式劇場,三店、2 人可開。台中(概略)。" } },
      { slug: "inme", category: "south", lat: 22.662, lng: 120.281,
        name: { en: "In-me", zh: "癮密 In-me" },
        body: { en: "Eerie micro-horror based on true events; debut 'Lingering Grudge' (2024) casts you as a coroner. Gushan, Kaohsiung (approx.).",
                zh: "走陰森微恐、真實事件改編,首作《遺怨》(2024)扮法醫查命案。高雄鼓山(概略)。" } },
      { slug: "onesplan", category: "south", lat: 22.690, lng: 120.302,
        name: { en: "One's Plan", zh: "玩出計畫" },
        body: { en: "Escape + script-murder with detailed storytelling; horror 'Inner Demon' and emotional 'Room 37'. Zuoying, Kaohsiung (approx.).",
                zh: "密室 + 劇本殺,細膩說故事,恐怖《心魔》、情感《參樓柒號》。高雄左營(概略)。" } },
      { slug: "boom", category: "south", lat: 22.640, lng: 120.320,
        name: { en: "Mr. Boom", zh: "爆炸先生" },
        body: { en: "Kaohsiung's most-visited, open latest (to midnight), great value. Sanmin, Kaohsiung (approx.).",
                zh: "全高雄人氣最高、營業最晚(可至凌晨)、CP 值高。高雄三民(概略)。" } },
      { slug: "jzj", category: "south", lat: 22.993, lng: 120.205,
        name: { en: "Plot-in-Plot", zh: "計中計" },
        body: { en: "A 'museum' world of many story rooms (e.g. 'Ghost Scheme'), since 2022. Tainan (approx.).",
                zh: "「計中計博物館」世界觀的多故事主題(如《鬼計》),2022 起。台南(概略)。" } }
    ]
  },

  /* ===================== BEGINNER TIPS (faq) ===================== */
  {
    slug: "tips", layout: "faq", icon: "tips_and_updates",
    title:    { en: "Beginner's Playbook", zh: "新手攻略" },
    subtitle: { en: "Common questions and practical tips for your first escape room.", zh: "第一次玩密室的常見問題與實用技巧。" },
    qa: [
      { q: { en: "What should I do first when I enter?", zh: "進房第一件事該做什麼?" },
        a: { en: "Search systematically. Split the room into zones, have everyone comb their area — drawers, under and behind furniture, book pages, pockets — and call out everything you find. Most early clues come from a thorough first sweep.",
             zh: "有系統地搜索。把房間分區,每個人負責一塊,翻抽屜、家具上下與背面、書頁、口袋,並把找到的東西全部喊出來。多數開場線索都來自第一輪徹底搜索。" } },
      { q: { en: "How many players is ideal?", zh: "幾個人玩最好?" },
        a: { en: "Most rooms suit 2–8 players; many list a sweet spot of 3–5. Too few and you may run out of time; too many and people stand around. Check each room's recommended size — some require 6 to run.",
             zh: "多數密室適合 2–8 人,常見甜蜜點是 3–5 人。太少可能時間不夠,太多會有人沒事做。看各房建議人數——有些要 6 人才成行。" } },
      { q: { en: "What do I do when we are stuck?", zh: "卡關了怎麼辦?" },
        a: { en: "First re-check: have you used every clue you already found? Lay everything out and look for unused items. If you are still stuck, ask the Game Master for a hint — that is what hints are for, and they rarely cost you a 'win'.",
             zh: "先回頭檢查:已經找到的線索全部用過了嗎?把東西全攤開,找出還沒用到的。真的卡住就向 GM(控場)要提示——提示就是設計來幫你的,通常不影響「成功逃脫」。" } },
      { q: { en: "Are escape rooms always scary?", zh: "密室一定很恐怖嗎?" },
        a: { en: "No. Horror is just one genre, and even it is split into 'micro' and 'extreme'. There are plenty of adventure, mystery, family and emotional themes with no scares at all — check the theme and difficulty before booking.",
             zh: "不會。恐怖只是其中一類,而且還分「微恐」與「極恐」。也有大量冒險、推理、親子、情感主題完全不嚇人——訂之前先看主題與難度。" } },
      { q: { en: "Should I read a walkthrough first?", zh: "要先看攻略嗎?" },
        a: { en: "Please do not — spoilers ruin the one-time experience. Read general beginner tips (like these) instead. Each room can only be 'discovered' once, so save the surprise.",
             zh: "拜託不要——劇透會毀掉一次性的體驗。看通用新手技巧(像這頁)就好。每個密室只能「初次探索」一次,把驚喜留著。" } },
      { q: { en: "How should we divide the work?", zh: "該怎麼分工?" },
        a: { en: "Avoid everyone crowding one puzzle. Spread out to find clues, but pool them in one visible spot. Shout findings out loud so connections surface — many answers need two clues from different people.",
             zh: "別全擠在同一題。分頭找線索,但集中放在一個看得到的地方。把發現大聲喊出來,關聯才會浮現——很多答案需要兩個來自不同人的線索。" } },
      { q: { en: "I opened a lock — what do I do with the key?", zh: "開了鎖,鑰匙怎麼處理?" },
        a: { en: "Leave the key in the lock it opened, and set 'used' clues aside from 'unused' ones. This stops you re-trying solved locks and keeps the team focused on what is still open.",
             zh: "把鑰匙留在它打開的那個鎖上,並把「用過的」線索和「沒用過的」分開放。這樣才不會重複試已解開的鎖,讓團隊專注在還沒開的。" } },
      { q: { en: "When should we use hints?", zh: "提示要不要用?該何時用?" },
        a: { en: "Use them before frustration sets in. A good rule: if the whole team has been stuck on one puzzle for several minutes with no new idea, take a hint. Finishing and enjoying the story beats stubbornly running out the clock.",
             zh: "在挫折累積前就用。原則:全隊卡在同一題好幾分鐘、毫無新想法,就拿提示。完成並享受故事,勝過硬撐到時間用完。" } },
      { q: { en: "Do I need to be good at math or puzzles?", zh: "我數學/解謎很差也能玩嗎?" },
        a: { en: "Yes. Rooms mix many puzzle types — search, observation, teamwork, hands-on mechanisms — so everyone contributes something. Communication and noticing details matter more than raw puzzle skill.",
             zh: "可以。密室會混很多題型——搜索、觀察、團隊合作、動手機關——每個人都能貢獻。溝通與注意細節,比單純的解謎能力更重要。" } },
      { q: { en: "Can a 60-minute timer actually be finished?", zh: "60 分鐘真的解得完嗎?" },
        a: { en: "Often yes, with good teamwork — but escape rates vary by room and difficulty, and not finishing is normal and still fun. Treat the timer as part of the thrill, not a pass/fail exam.",
             zh: "團隊合作好通常解得完——但過關率因房與難度而異,沒逃出來也很正常、一樣好玩。把計時當成刺激的一部分,而不是及格與否的考試。" } },
      { q: { en: "Etiquette: what should I NOT do inside?", zh: "禮儀:進密室「不要」做什麼?" },
        a: { en: "Don't force, yank or pry the set — puzzles are solved by observation and logic, never brute strength. Don't take any prop out (keys, notes and locks belong to the next team), don't photograph or film (it spoils the room), and never hit or shove the NPC actors even when scared.",
             zh: "不要硬拉、硬扯、硬撬場景——解謎靠觀察與邏輯,不需要蠻力。不要帶走任何道具(鎖、鑰匙、紙條都屬於下一組),全程禁止拍照錄影(會暴雷),被嚇到也別對 NPC 演員動手。" } },
      { q: { en: "What should I wear and bring?", zh: "該穿什麼、帶什麼?" },
        a: { en: "Wear comfortable clothes you can crouch and climb in (skirts are awkward for some sets), and socks to protect the floor. Stow bags, phones and valuables in the locker, and take off dangling or glowing accessories that could fall into a mechanism.",
             zh: "穿好活動、能蹲能爬的衣服(裙裝在某些橋段較不便),建議穿襪子保護場景地板。包包、手機、貴重物品寄進置物櫃,拿下會掉落或會發光的飾品,以免影響機關。" } },
      { q: { en: "How do I pick a room by horror level?", zh: "怎麼依恐怖程度挑主題?" },
        a: { en: "Rooms are usually rated normal / micro-horror / horror. If you scare easily, choose normal or micro-horror (often cute or Japanese-styled); full horror often has live NPCs chasing and jump scares. When booking for a group, cater to the most easily-scared member.",
             zh: "主題多分「一般 / 微恐 / 恐怖」。怕鬼就選一般或微恐(常帶可愛或日式風);恐怖主題多有真人 NPC 追逐與嚇人橋段。揪團時遷就團裡最怕的人。" } },
      { q: { en: "How do I pick by difficulty as a newcomer?", zh: "新手該怎麼挑難度?" },
        a: { en: "Pick rooms tagged 'beginner-friendly' (about ★~★★) with generous hints — most modern rooms are intuitive and you'll rarely truly fail. Mechanism-showcase rooms with lots of gadgets are a fun first taste; save the gadget-dense, high-difficulty rooms for when you have a few games under your belt.",
             zh: "選標「新手友善」(約 ★~★★)、提示寬鬆的主題——現在多數密室直觀、幾乎玩得完。機關表演型、道具多的主題很適合初體驗;高難度、機關量大的留到玩過幾場再挑戰。" } },
      { q: { en: "What group size and how do I book?", zh: "幾人成行?怎麼預約?" },
        a: { en: "Many rooms start at 2, but 3–5 is the sweet spot — more eyes, faster solving, more room. Big groups (9+) need a studio with large-format rooms. Sessions are private (no strangers), so always book ahead, and check spoiler-free reviews or the Escapebar platform before you commit.",
             zh: "很多主題 2 人可開,但 3–5 人最甜——多雙眼睛、解得快、空間也夠;大團(9 人以上)要找有大型主題的工作室。多採包場制(不與陌生人併團),務必先預約;訂之前可看無雷心得或「逃脫吧」平台再決定。" } }
    ]
  },

  /* ===================== GLOSSARY (custom layout) ===================== */
  {
    slug: "glossary", layout: "glossary", icon: "menu_book",
    title:    { en: "Glossary & Lingo", zh: "術語速查" },
    subtitle: { en: "Searchable jargon — from Game Master to Taiwan player slang. Tap to expand.", zh: "可搜尋的行話——從控場到台灣玩家黑話。點擊展開。" },
    terms: [
      { term: { en: "Game Master (GM)", zh: "控場 / 遊戲主持人(GM)" },
        def: { en: "Staff who greet players, explain rules, monitor the game, give hints and keep things safe and on-track.",
               zh: "負責迎接玩家、說明規則、全程監看、給提示,並把控安全與品質的工作人員。" } },
      { term: { en: "NPC", zh: "NPC(非玩家角色)" },
        def: { en: "Non-player character — staff who play a role and interact with players to push the story (e.g. a hotel manager).",
               zh: "由工作人員扮演、會與玩家互動推進劇情的角色(如飯店經理)。" } },
      { term: { en: "Little Angel (xiao tianshi)", zh: "小天使(台灣慣用語)" },
        def: { en: "Taiwan nickname for the GM / host — tells the opening story, gives hints when you are stuck, and leads you out if needed.",
               zh: "台灣對 GM / 帶場人員的暱稱;負責開場說故事、卡關時給提示、必要時帶玩家逃生。" } },
      { term: { en: "Clue", zh: "線索(clue)" },
        def: { en: "An element inside the game scene that players must observe and combine. Different from a 'hint'.",
               zh: "遊戲場景內、需要玩家觀察並解讀組合的元素。與外部的「提示」不同。" } },
      { term: { en: "Hint", zh: "提示 / 暗示(hint)" },
        def: { en: "Help that comes from outside the game, given by the GM. In Taiwan often counted as 'hint tokens' or a hint quota.",
               zh: "來自遊戲外部、由 GM 主動給的協助。台灣常以「提示幣 / 提示次數」計算。" } },
      { term: { en: "Mechanism", zh: "機關" },
        def: { en: "An interactive device triggered by circuits, sensors or physical mechanics; meeting its condition opens a door or fires an effect.",
               zh: "靠電路、感應或物理機構觸發的互動裝置,完成條件即開門或產生效果。" } },
      { term: { en: "Hidden compartment", zh: "暗格 / 暗櫃" },
        def: { en: "A concealed layer, false bottom or disguised object that hides clues or keys.",
               zh: "藏線索或鑰匙的隱藏夾層、假底或偽裝物件。" } },
      { term: { en: "Stuck", zh: "卡關" },
        def: { en: "When the team is blocked on a puzzle and cannot progress — usually the cue to ask for a hint.",
               zh: "玩家被某題卡住、無法推進的狀態,通常是該向 GM 要提示的時機。" } },
      { term: { en: "Combination lock", zh: "密碼鎖" },
        def: { en: "A lock opened by entering the correct code — numeric, letter or directional.",
               zh: "需輸入正確密碼(數字/字母/方向)才能開的鎖具。" } },
      { term: { en: "Linear vs non-linear", zh: "線性 vs 非線性關卡" },
        def: { en: "Linear = puzzles solved in a fixed order, one after another; non-linear = many puzzles can be tackled at once, in any order.",
               zh: "線性=謎題依固定順序一關接一關;非線性=多題可同時進行、可自由選順序。" } },
      { term: { en: "Immersive", zh: "沉浸式" },
        def: { en: "Design — set, story, characters — that makes players feel like part of the story.",
               zh: "場景、劇情、角色塑造到讓玩家覺得自己是故事一員的設計。" } },
      { term: { en: "Script murder (LARP)", zh: "劇本殺" },
        def: { en: "A story-driven, role-play-and-deduction game type, often listed alongside escape rooms.",
               zh: "劇情導向、重角色扮演與推理的遊戲類型,常與密室並列。" } },
      { term: { en: "Red herring", zh: "誤導線索 / 陷阱線索" },
        def: { en: "A fake clue or prop that leads nowhere and only wastes the team's time.",
               zh: "不通往任何解答、只會讓玩家浪費時間的假線索或道具。" } },
      { term: { en: "Deduction", zh: "推理 / 邏輯題" },
        def: { en: "A puzzle requiring deductive, logical reasoning to solve.",
               zh: "需要演繹推理、邏輯思考才能解的謎題。" } },
      { term: { en: "Escape rate", zh: "過關率 / 通關率" },
        def: { en: "The share of teams that successfully escape — often used to signal difficulty.",
               zh: "玩家成功逃脫的比例,常用來標示難度。" } },
      { term: { en: "Timer", zh: "計時 / 限時" },
        def: { en: "Completing the goal within a limit (commonly 60 minutes); a countdown timer is standard.",
               zh: "在限定時間(通常 60 分鐘)內完成目標;倒數計時器是密室標配。" } },
      { term: { en: "Prop", zh: "道具" },
        def: { en: "An in-game object — could be a puzzle component, or a red herring.",
               zh: "遊戲內物件,可能是解謎元件,也可能是誤導線索。" } },
      { term: { en: "Meta / final puzzle", zh: "終局謎題(meta)" },
        def: { en: "A final puzzle that combines the results of earlier ones, usually near the end.",
               zh: "把前面多個小謎題結果匯整成的最後一道大謎題,通常在尾段。" } },
      { term: { en: "Gating", zh: "關卡阻隔(gating)" },
        def: { en: "A design technique that blocks access to a space or element until a specific puzzle is solved.",
               zh: "在玩家解開某謎題前,封鎖某空間或元素存取的設計手法。" } },
      { term: { en: "Reset", zh: "重置(reset)" },
        def: { en: "Restoring the room to its starting state before the next team — re-hiding props, re-locking, rebooting electronics.",
               zh: "把密室還原到下一隊開始前的初始狀態:重藏道具、重新上鎖、重啟電子裝置。" } },
      { term: { en: "Brute force", zh: "暴力破解" },
        def: { en: "Solving without reasoning by trying every possibility of one digit/combination — handy when you are one digit short.",
               zh: "不靠推理,把某一位/某組合所有可能逐一試開的解法,常用在只差一碼時。" } },
      { term: { en: "Tongling (mind-reading)", zh: "通靈(台灣慣用語)" },
        def: { en: "Taiwan slang: guessing the right answer with no logic, or a puzzle whose logic is too big a leap to follow.",
               zh: "台灣黑話:不靠邏輯就猜對答案;或形容謎題邏輯太跳、沒有可循線索。" } },
      { term: { en: "Sightseeing (guanguang)", zh: "觀光(台灣慣用語)" },
        def: { en: "Taiwan slang for admiring the set and mechanisms without actually solving and progressing.",
               zh: "台灣黑話:只顧著欣賞場景與機關、不實際解謎推進進度的行為。" } },
      { term: { en: "Hamster / Tank", zh: "倉鼠 / 坦(恐怖密室黑話)" },
        def: { en: "Horror-room slang: a 'hamster' scares easily; a 'tank' is fearless and shields teammates up front.",
               zh: "恐怖主題黑話:「倉鼠」=容易被嚇的人;「坦」=不太怕、會擋在前面保護隊友的人。" } },
      { term: { en: "Private session (baochang)", zh: "包場制" },
        def: { en: "Booking takes the whole session — you are never grouped with strangers, the Taiwan norm.",
               zh: "預約即把整場包下,不會與陌生玩家併團,是台灣常態。" } },
      { term: { en: "Spoiler / spoiler-free", zh: "暴雷 / 無雷" },
        def: { en: "'Spoiler' = revealing puzzles or the ending; a 'spoiler-free' review shares without ruining the game.",
               zh: "「暴雷」=劇透謎題或結局;「無雷心得」=不破壞體驗、不講解法的分享。" } },
      { term: { en: "Golden Escape Award", zh: "金逃獎" },
        def: { en: "Taiwan's annual selection/awards for real-life games.",
               zh: "台灣實境遊戲的年度選拔 / 評選。" } },
      { term: { en: "TPC club", zh: "TPC 社團" },
        def: { en: "Taiwan's largest escape-room player community (the 'T.P.C. real-life escape club' on Facebook).",
               zh: "台灣最大的密室逃脫玩家社群(Facebook「T.P.C. 真人實境密室逃脫俱樂部」)。" } },
      { term: { en: "Mechanism lover", zh: "機關控" },
        def: { en: "A player who favours mechanism-heavy rooms (sensors, circuits) over traditional padlocks.",
               zh: "偏愛大量感應 / 電路機關、而非傳統鎖頭的玩家。" } },
      { term: { en: "Linear vs sandbox", zh: "線性 vs 沙盒" },
        def: { en: "Design terms: 'linear' = puzzles in fixed order; 'sandbox' (non-linear) = many threads run at once, good for splitting up.",
               zh: "設計術語:「線性」=照順序一關一關;「沙盒」(非線性)=多線並進、人多好分工。" } },
      { term: { en: "Immersive theatre", zh: "沉浸式劇場" },
        def: { en: "Experience-driven rooms with close actor interaction and strong story immersion; some have no puzzles.",
               zh: "強調演員近距離互動與劇情代入的體驗型房間,部分甚至無謎題。" } },
      { term: { en: "Bao (a dud)", zh: "雷(地雷)" },
        def: { en: "Player slang for a disappointing room — weak puzzles, story or production.",
               zh: "玩家黑話:形容踩到不好玩的主題(謎題/劇情/製作差)。" } },
      { term: { en: "Walkthrough (peek)", zh: "看攻略" },
        def: { en: "Reading the solution to a room — a major spoiler that ruins the one-time experience; avoid before playing.",
               zh: "去看某房的解法——嚴重暴雷、毀掉一次性體驗,玩之前千萬別看。" } },
      { term: { en: "Clear time", zh: "通關時間" },
        def: { en: "How long a team took to escape; bragging rights and a difficulty signal alongside escape rate.",
               zh: "隊伍逃脫所花的時間;除了過關率,也是炫耀與難度的指標。" } }
    ]
  },

  /* ===================== QUIZ (custom layout) ===================== */
  {
    slug: "quiz", layout: "quiz", icon: "quiz",
    title:    { en: "Pop Quiz", zh: "隨堂測驗" },
    subtitle: { en: "Ten questions on puzzles, locks and lingo. Score is per-session — refresh to start over.",
                zh: "十題關於題型、鎖具與術語的測驗。分數只算當次,重新整理即歸零。" },
    questions: [
      { q: { en: "A UV flashlight in an escape room is mainly used to…", zh: "密室裡的紫外線手電筒主要用來做什麼?" },
        options: [ { en: "Reveal invisible-ink clues", zh: "顯現隱形墨水的線索" },
                   { en: "Charge the maglock", zh: "幫電磁鎖充電" },
                   { en: "Scare players", zh: "嚇唬玩家" },
                   { en: "Open number locks directly", zh: "直接打開數字鎖" } ],
        answer: 0,
        explain: { en: "UV light is a clue layer, not a lock — it makes invisible-ink numbers, letters or symbols appear, which then feed a real lock.",
                   zh: "UV 是線索層,不是鎖——它讓隱形墨水的數字、字母或符號現形,再拿去開真正的鎖。" } },
      { q: { en: "A directional lock opens with a sequence of…", zh: "方向鎖是靠什麼序列開鎖?" },
        options: [ { en: "Up / down / left / right", zh: "上 / 下 / 左 / 右" },
                   { en: "0–9 digits", zh: "0–9 數字" },
                   { en: "A–Z letters", zh: "A–Z 字母" },
                   { en: "Colors", zh: "顏色" } ],
        answer: 0,
        explain: { en: "A directional lock uses a sequence of pushes (often 8–10 steps) in the four directions, not numbers.",
                   zh: "方向鎖用四個方向的推動序列(常 8–10 步)開鎖,不是數字。" } },
      { q: { en: "Which is the single most basic lock in escape rooms?", zh: "密室最基本款的鎖是哪一種?" },
        options: [ { en: "3–4 digit number combination lock", zh: "3–4 位數字密碼鎖" },
                   { en: "Cryptex", zh: "密碼筒" },
                   { en: "RFID card", zh: "RFID 感應卡" },
                   { en: "Electromagnetic lock", zh: "電磁鎖" } ],
        answer: 0,
        explain: { en: "The 3–4 wheel number combination lock is the most common and basic; clues simply produce N digits.",
                   zh: "3–4 輪數字密碼鎖最常見、最基本;線索只要導出 N 個數字即可。" } },
      { q: { en: "Morse code is usually presented as…", zh: "摩斯密碼通常以什麼形式呈現?" },
        options: [ { en: "Long/short signals — lights, taps or lines", zh: "長短訊號——燈號、敲擊或線條" },
                   { en: "A jigsaw", zh: "一幅拼圖" },
                   { en: "A magnet", zh: "一塊磁鐵" },
                   { en: "A floor plan", zh: "一張平面圖" } ],
        answer: 0,
        explain: { en: "Morse is dots and dashes, often shown as flashing lights, tapping sounds, or short/long marks to decode.",
                   zh: "摩斯是點與線,常以閃爍燈號、敲擊聲或長短線呈現,再對照解碼。" } },
      { q: { en: "In Taiwan slang, a '坦 (tank)' in a horror room is someone who…", zh: "台灣恐怖密室黑話中,「坦」是指?" },
        options: [ { en: "Is fearless and shields teammates up front", zh: "不太怕、會擋在前面保護隊友" },
                   { en: "Scares easily", zh: "很容易被嚇到" },
                   { en: "Only watches the scenery", zh: "只顧著看場景" },
                   { en: "Hosts the game", zh: "負責主持遊戲" } ],
        answer: 0,
        explain: { en: "A 'tank' is the brave one who goes in front to protect the team; the easily-scared one is a 'hamster'.",
                   zh: "「坦」是勇敢走前面保護隊友的人;容易被嚇的則是「倉鼠」。" } },
      { q: { en: "What is the difference between a 'clue' and a 'hint'?", zh: "「線索」和「提示」差在哪裡?" },
        options: [ { en: "Clue is inside the game; hint comes from the GM outside", zh: "線索在遊戲內;提示由 GM 從外部給" },
                   { en: "They are exactly the same", zh: "兩者完全一樣" },
                   { en: "Hint is inside the game; clue is from outside", zh: "提示在遊戲內;線索從外部給" },
                   { en: "Both are types of lock", zh: "兩者都是鎖的種類" } ],
        answer: 0,
        explain: { en: "A clue is an element within the scene to observe and combine; a hint is external help given by the Game Master.",
                   zh: "線索是場景內要觀察組合的元素;提示是 GM 從遊戲外部給的協助。" } },
      { q: { en: "An electromagnetic lock (maglock) is released by…", zh: "電磁鎖(maglock)是怎麼釋放的?" },
        options: [ { en: "Cutting power on correct input", zh: "輸入正確後斷電" },
                   { en: "Inserting a brass key", zh: "插入銅製鑰匙" },
                   { en: "Spelling a word", zh: "拼出一個單字" },
                   { en: "Shining UV on it", zh: "用紫外線照它" } ],
        answer: 0,
        explain: { en: "A control board cuts power to the electromagnet when the input is correct, so the door springs open — no bolt to jam.",
                   zh: "電路板在輸入正確時把電磁鐵斷電,門就彈開——沒有鎖舌不會卡死。" } },
      { q: { en: "What is the best first move when entering a room?", zh: "進房後最好的第一個動作是?" },
        options: [ { en: "Systematically search every area", zh: "有系統地分區搜索每個角落" },
                   { en: "Immediately ask for a hint", zh: "馬上要提示" },
                   { en: "Try every lock at random", zh: "隨機亂試每個鎖" },
                   { en: "Stand still and watch", zh: "站著不動看場景" } ],
        answer: 0,
        explain: { en: "Split into zones and comb the room — most opening clues come from a thorough first search.",
                   zh: "分區把房間翻一遍——多數開場線索都來自徹底的第一輪搜索。" } },
      { q: { en: "'Non-linear' puzzles mean…", zh: "「非線性」關卡的意思是?" },
        options: [ { en: "Many puzzles can be solved at once, in any order", zh: "多題可同時進行、順序自由" },
                   { en: "One puzzle strictly after another", zh: "一題接一題、固定順序" },
                   { en: "There are no puzzles", zh: "完全沒有謎題" },
                   { en: "Only one player may solve", zh: "只能一個人解謎" } ],
        answer: 0,
        explain: { en: "Non-linear lets the team split up and tackle several open puzzles in parallel; linear is one fixed order.",
                   zh: "非線性讓團隊分頭並行解多題;線性則是固定一條順序。" } },
      { q: { en: "When the whole team is stuck with no new ideas, you should…", zh: "全隊卡關又沒新想法時,應該?" },
        options: [ { en: "Take a hint from the GM", zh: "向 GM 拿提示" },
                   { en: "Give up and leave", zh: "放棄離場" },
                   { en: "Break the prop open", zh: "把道具拆爆" },
                   { en: "Stay silent and wait", zh: "保持安靜等時間到" } ],
        answer: 0,
        explain: { en: "Hints exist to keep the experience flowing — using one before frustration builds is the smart move.",
                   zh: "提示就是為了讓體驗順暢——在挫折累積前用一個,才是聰明做法。" } }
    ]
  },

  /* ===================== FLASHCARDS (custom layout) ===================== */
  {
    slug: "flashcards", layout: "flashcards", icon: "style",
    title:    { en: "Flashcards", zh: "解謎字卡" },
    subtitle: { en: "Tap a card to flip. Quick recall for puzzle types, locks and lingo.", zh: "點卡片翻面。快速複習題型、鎖具與術語。" },
    cards: [
      { front: { en: "Cipher decoding", zh: "密碼破譯" }, back: { en: "Translate symbols back to text with a key: Morse, Caesar, Pigpen, color codes.", zh: "用對照表把符號譯回文字:摩斯、凱撒、豬圈、顏色密碼。" } },
      { front: { en: "Search puzzle", zh: "搜索題" }, back: { en: "Systematically comb the room for hidden keys, notes and props.", zh: "有系統地翻遍場景,找出藏起來的鑰匙、紙條與道具。" } },
      { front: { en: "Directional lock", zh: "方向鎖" }, back: { en: "Opens with an up/down/left/right sequence, often 8–10 steps.", zh: "靠上下左右的序列開鎖,常 8–10 步。" } },
      { front: { en: "Number combination lock", zh: "數字密碼鎖" }, back: { en: "3–4 wheels of 0–9; the most basic escape-room lock.", zh: "3–4 輪 0–9 數字,密室最基本款。" } },
      { front: { en: "Maglock", zh: "電磁鎖" }, back: { en: "Electromagnet holds the door; correct input cuts power to release. No bolt.", zh: "電磁鐵吸住門,輸入正確就斷電釋放。沒有鎖舌。" } },
      { front: { en: "Cryptex", zh: "密碼筒" }, back: { en: "Cylinder with 5–6 letter rings; spell the word to slide out the core.", zh: "圓筒上 5–6 個字母環,轉出單字才能抽出內芯。" } },
      { front: { en: "UV / blacklight clue", zh: "UV 紫外線線索" }, back: { en: "Not a lock — reveals invisible-ink clues that feed a real lock.", zh: "不是鎖——顯現隱形墨水線索,再去開真正的鎖。" } },
      { front: { en: "Game Master (GM)", zh: "控場 GM" }, back: { en: "Staff who run the game: rules, monitoring, hints and safety.", zh: "負責規則、監看、提示與安全的工作人員。" } },
      { front: { en: "NPC", zh: "NPC" }, back: { en: "A character played by staff who interacts to push the story.", zh: "工作人員扮演、互動推進劇情的角色。" } },
      { front: { en: "Red herring", zh: "誤導線索" }, back: { en: "A fake clue that leads nowhere and wastes your time.", zh: "不通往答案、只會浪費時間的假線索。" } },
      { front: { en: "Meta / final puzzle", zh: "終局謎題" }, back: { en: "Combines the results of earlier puzzles into the last big one.", zh: "把前面謎題結果匯整成最後一道大謎題。" } },
      { front: { en: "Brute force", zh: "暴力破解" }, back: { en: "Try every possibility of one digit — handy when one short.", zh: "把某一位的所有可能逐一試——只差一碼時好用。" } },
      { front: { en: "Linear vs non-linear", zh: "線性 vs 非線性" }, back: { en: "Fixed one-by-one order vs many puzzles solvable in parallel.", zh: "固定一題接一題,對上多題可並行解。" } },
      { front: { en: "Hidden compartment", zh: "暗格" }, back: { en: "A false bottom or disguised object hiding clues or keys.", zh: "藏線索或鑰匙的假底/偽裝物件。" } },
      { front: { en: "Little Angel", zh: "小天使" }, back: { en: "Taiwan nickname for the host/GM who guides and hints.", zh: "台灣對帶場 GM 的暱稱,負責引導與提示。" } },
      { front: { en: "Multi-step nested puzzle", zh: "多階段嵌套" }, back: { en: "Each answer is the key to the next — the skeleton of most rooms.", zh: "一題答案是下一題鑰匙——多數密室的骨架。" } }
    ]
  }
];

// 英文法の解説データ
// points / pitfalls には強調用の <b> タグを含めることがあります（固定データなので innerHTML で表示します）。
// axis が指定された項目は、解説から「種類分け一覧」の該当する分類へ移動できます。

const GRAMMAR_TOPICS = [
  {
    id: "patterns",
    title: "5文型",
    category: "文の骨組み",
    axis: "pattern",
    summary: "英語の文は、主語(S)・動詞(V)・目的語(O)・補語(C)の組み合わせで5つの型に分けられます。修飾語(M)は文型に数えません。",
    points: [
      "<b>第1文型 SV</b>：主語と動詞だけで文が成り立つ。例）Birds sing.",
      "<b>第2文型 SVC</b>：S = C の関係。be動詞・become・look・seem・taste などが補語をとる。例）She is happy.",
      "<b>第3文型 SVO</b>：動詞の動作が目的語に及ぶ。例）I like music.",
      "<b>第4文型 SVOO</b>：「人に(O1)」「ものを(O2)」の2つの目的語。give・show・tell・teach・buy など。例）He gave me a book.",
      "<b>第5文型 SVOC</b>：O = C の関係。call・name・make・keep・find など。例）We call him Ken.",
      "場所・時・様子を表す語句（in the park / yesterday / quickly など）は<b>修飾語(M)</b>で、文型には含めない。"
    ],
    examples: [
      ["The sun rises in the east.", "太陽は東から昇る。（SV／in the east は M）"],
      ["This soup tastes good.", "このスープはおいしい。（SVC／soup = good）"],
      ["She plays the piano.", "彼女はピアノを弾く。（SVO）"],
      ["My mother made me a cake.", "母は私にケーキを作ってくれた。（SVOO）"],
      ["The news made me sad.", "その知らせは私を悲しませた。（SVOC／me = sad）"]
    ],
    pitfalls: [
      "SVC と SVO の見分け方：<b>S = 後ろの語</b> が成り立てば C（She is a teacher.）、成り立たなければ O（She likes the teacher.）。",
      "SVOO と SVOC の見分け方：<b>O = 後ろの語</b> が成り立てば SVOC（made him happy：him = happy）、成り立たなければ SVOO（made him a cake：him ≠ a cake）。",
      "There is 構文の主語は there ではなく、be動詞の後ろの名詞。There is a cat. は SV。"
    ]
  },
  {
    id: "sentence-types",
    title: "文の種類",
    category: "文の骨組み",
    axis: "type",
    summary: "文は伝える目的によって、平叙文・疑問文・命令文・感嘆文の4種類に分けられます。",
    points: [
      "<b>平叙文</b>：事実や考えをそのまま述べる文。ピリオド（.）で終わる。否定文も平叙文に含む。",
      "<b>疑問文</b>：相手にたずねる文。be動詞・助動詞・Do/Does/Did を主語の前に出すか、疑問詞（what / where / who など）で始める。? で終わる。",
      "<b>命令文</b>：主語 you を省略し、<b>動詞の原形</b>で始める。禁止は Don't + 原形、ていねいにするなら please をつける。",
      "<b>感嘆文</b>：驚きや感動を表す。<b>What + (a/an) + 形容詞 + 名詞 + S + V!</b> または <b>How + 形容詞/副詞 + S + V!</b>"
    ],
    examples: [
      ["I don't like coffee.", "私はコーヒーが好きではない。（平叙文・否定）"],
      ["Where do you live?", "どこに住んでいますか。（疑問文）"],
      ["Be careful.", "気をつけて。（命令文）"],
      ["What a beautiful day it is!", "なんて美しい日だろう。（感嘆文）"],
      ["How fast he runs!", "彼はなんて速く走るのだろう。（感嘆文）"]
    ],
    pitfalls: [
      "be動詞の命令文は <b>Be</b> で始める（Be quiet.）。× Are quiet.",
      "What と How の使い分け：後ろに<b>名詞があれば What</b>、形容詞・副詞だけなら How。",
      "Let's 〜. は「〜しよう」と誘う文で、命令文の仲間として扱う。"
    ]
  },
  {
    id: "present-past",
    title: "現在形と過去形",
    category: "時制",
    axis: "tense",
    summary: "現在形は習慣・事実・今の状態を、過去形は過去に終わった出来事や状態を表します。",
    points: [
      "現在形：<b>習慣</b>（I walk to school.）、<b>変わらない事実</b>（Water boils at 100°C.）、<b>今の状態</b>（I am tired.）。",
      "主語が3人称単数（he / she / it / 1人の人や1つのもの）のとき、一般動詞に <b>-s / -es</b> をつける。",
      "過去形：規則動詞は <b>-ed</b>（played / studied / stopped）、不規則動詞は形が変わる（go → went, eat → ate）。",
      "疑問文・否定文では Do / Does / Did を使い、動詞は<b>原形</b>に戻す。"
    ],
    examples: [
      ["She runs every morning.", "彼女は毎朝走る。（習慣）"],
      ["The sun rises in the east.", "太陽は東から昇る。（事実）"],
      ["He bought a new bike.", "彼は新しい自転車を買った。（過去）"],
      ["Did you sleep well?", "よく眠れましたか。（過去の疑問文）"]
    ],
    pitfalls: [
      "× Did you went? → ○ Did you go?（did のあとは原形）",
      "× He don't like it. → ○ He doesn't like it.",
      "study → studied（子音字 + y は y を i に）、stop → stopped（子音字を重ねる）。"
    ]
  },
  {
    id: "future",
    title: "未来の表現",
    category: "時制",
    axis: "tense",
    summary: "未来のことは will または be going to で表します。",
    points: [
      "<b>will + 原形</b>：その場で決めたこと・予測・意志。（I will call you tonight.）",
      "<b>be going to + 原形</b>：前から決めていた予定・今の状況から確実と思える予測。（I am going to visit my aunt.）",
      "否定は will not（won't）、疑問は Will you 〜? / Are you going to 〜?"
    ],
    examples: [
      ["I will go to Kyoto next week.", "私は来週京都へ行く。"],
      ["I am going to visit my aunt.", "私はおばを訪ねる予定だ。"],
      ["Will it snow tomorrow?", "明日は雪が降るだろうか。"],
      ["Look at those clouds. It's going to rain.", "あの雲を見て。雨が降りそうだ。"]
    ],
    pitfalls: [
      "× I will going → ○ I will go（will のあとは原形）",
      "時や条件を表す when / if の中では、未来のことでも現在形を使う。（If it rains tomorrow, I will stay home.）"
    ]
  },
  {
    id: "progressive",
    title: "進行形",
    category: "時制",
    axis: "tense",
    summary: "be動詞 + 動詞の -ing 形で、ある時点に動作が進行中であることを表します。",
    points: [
      "<b>現在進行形</b>：am / is / are + -ing「（今）〜している」",
      "<b>過去進行形</b>：was / were + -ing「（そのとき）〜していた」",
      "-ing のつけ方：make → making（e をとる）、run → running（子音字を重ねる）。"
    ],
    examples: [
      ["The baby is sleeping.", "赤ちゃんは眠っている。"],
      ["I am reading a book.", "私は本を読んでいる。"],
      ["They were watching TV.", "彼らはテレビを見ていた。"],
      ["It is getting dark.", "暗くなってきている。"]
    ],
    pitfalls: [
      "状態を表す動詞（know / like / have「持っている」/ want など）はふつう進行形にしない。× I am knowing him.",
      "be動詞を忘れない。× I reading a book."
    ]
  },
  {
    id: "perfect",
    title: "現在完了",
    category: "時制",
    axis: "tense",
    summary: "have / has + 過去分詞で、過去の出来事が今とつながっていることを表します。",
    points: [
      "<b>完了・結果</b>：「（ちょうど／もう）〜した」 just / already / yet とよく使う。",
      "<b>経験</b>：「〜したことがある」 ever / never / before / 〜 times とよく使う。",
      "<b>継続</b>：「（ずっと）〜している」 for（期間）/ since（起点）とよく使う。",
      "疑問文は Have / Has を主語の前に、否定文は have not（haven't）/ has not（hasn't）。"
    ],
    examples: [
      ["He has just arrived.", "彼はちょうど着いたところだ。（完了）"],
      ["Have you ever been abroad?", "外国に行ったことがありますか。（経験）"],
      ["They have been friends for ten years.", "彼らは10年間ずっと友達だ。（継続）"],
      ["I have lost my key.", "鍵をなくしてしまった。（結果：今も見つかっていない）"]
    ],
    pitfalls: [
      "yesterday / last week / ago など、<b>はっきり過去を示す語とは使えない</b>。× I have seen him yesterday.",
      "「〜へ行ったことがある」は have <b>been</b> to。have gone to は「行ってしまって今はいない」。"
    ]
  },
  {
    id: "modals",
    title: "助動詞",
    category: "動詞の働き",
    summary: "助動詞は動詞の前に置いて、可能・義務・推量などの意味を加えます。後ろの動詞は必ず原形です。",
    points: [
      "<b>can</b>：〜できる（能力）、〜してもよい（許可）。Can you 〜? で依頼。",
      "<b>may</b>：〜してもよい（許可）、〜かもしれない（推量）。",
      "<b>must</b>：〜しなければならない（義務）、〜にちがいない（確信）。must not は禁止。",
      "<b>should</b>：〜すべきだ、〜したほうがよい（助言）。",
      "書きかえ：can = be able to、must = have to。"
    ],
    examples: [
      ["Can you lend me your pen?", "ペンを貸してくれませんか。"],
      ["You must wear a helmet.", "ヘルメットをかぶらなければならない。"],
      ["You should see a doctor.", "医者に診てもらったほうがいい。"],
      ["It may rain this afternoon.", "午後は雨が降るかもしれない。"]
    ],
    pitfalls: [
      "× She cans swim. → ○ She can swim.（助動詞に -s はつかない）",
      "must not は「〜してはいけない」、don't have to は「〜しなくてよい」。意味がまったく違う。"
    ]
  },
  {
    id: "passive",
    title: "受動態",
    category: "動詞の働き",
    summary: "be動詞 + 過去分詞で「〜される」という意味を表します。動作を受ける側を主語にした文です。",
    points: [
      "形：<b>be動詞 + 過去分詞 (+ by 〜)</b>",
      "能動態の目的語が、受動態の主語になる。Tom broke the window. → The window was broken by Tom.",
      "時制は be動詞で表す：is made（現在）/ was made（過去）/ will be made（未来）。",
      "行為者が分からない・言う必要がないときは by 〜 を省略する。"
    ],
    examples: [
      ["English is spoken in many countries.", "英語は多くの国で話されている。"],
      ["This temple was built in 1200.", "この寺は1200年に建てられた。"],
      ["The window was broken by Tom.", "窓はトムによって割られた。"],
      ["The work will be finished tomorrow.", "その仕事は明日終わるだろう。"]
    ],
    pitfalls: [
      "be動詞を忘れない。× The temple built in 1200.",
      "by 以外を使う表現：be interested in / be covered with / be known to など。"
    ]
  },
  {
    id: "comparison",
    title: "比較",
    category: "形容詞・副詞",
    summary: "2つ以上のものを比べるとき、形容詞・副詞を原級・比較級・最上級の形で使います。",
    points: [
      "<b>原級</b>：as + 原級 + as「〜と同じくらい」、not as 〜 as「〜ほど…ではない」",
      "<b>比較級</b>：-er than / more 〜 than「〜よりも…」",
      "<b>最上級</b>：the -est / the most 〜「最も…」。範囲は in（場所・集団）/ of（複数のもの）。",
      "不規則変化：good / well → better → best、bad → worse → worst、many / much → more → most"
    ],
    examples: [
      ["Tom is as tall as his father.", "トムは父親と同じくらいの背の高さだ。"],
      ["This bag is lighter than that one.", "このかばんはあのかばんより軽い。"],
      ["This is the most interesting book of the three.", "これは3冊の中で最もおもしろい本だ。"],
      ["Mt. Fuji is the highest mountain in Japan.", "富士山は日本で最も高い山だ。"]
    ],
    pitfalls: [
      "長い単語（beautiful / interesting など）は -er / -est ではなく more / most を使う。",
      "× more taller → ○ taller（重ねて使わない）"
    ]
  },
  {
    id: "infinitive",
    title: "不定詞",
    category: "準動詞",
    summary: "to + 動詞の原形を不定詞といい、名詞・形容詞・副詞の働きをします。",
    points: [
      "<b>名詞的用法</b>「〜すること」：I want to be a pilot. / To read books is fun.",
      "<b>形容詞的用法</b>「〜するための／〜すべき」：I have a lot of homework to do.",
      "<b>副詞的用法</b>「〜するために（目的）」「〜して（感情の原因）」：I went to the shop to buy milk. / I'm glad to see you.",
      "疑問詞 + to：how to 〜（〜のしかた）/ what to 〜（何を〜すべきか）"
    ],
    examples: [
      ["I want to study abroad.", "私は留学したい。（名詞的）"],
      ["I have something to tell you.", "あなたに話すことがある。（形容詞的）"],
      ["She went to the library to study.", "彼女は勉強するために図書館へ行った。（副詞的・目的）"],
      ["Do you know how to use this?", "これの使い方を知っていますか。"]
    ],
    pitfalls: [
      "to のあとは必ず原形。× to studied",
      "It is 〜 (for 人) to …「（人が）…することは〜だ」の形もよく使う。"
    ]
  },
  {
    id: "gerund",
    title: "動名詞",
    category: "準動詞",
    summary: "動詞の -ing 形を名詞として使い、「〜すること」を表します。",
    points: [
      "主語・目的語・前置詞の目的語になる。Swimming is fun. / I like swimming.",
      "<b>動名詞だけを目的語にとる動詞</b>：enjoy / finish / stop / mind / give up",
      "<b>不定詞だけを目的語にとる動詞</b>：want / hope / decide / plan / wish",
      "前置詞のあとは動名詞：Thank you for <b>coming</b>. / be good at <b>cooking</b>"
    ],
    examples: [
      ["I enjoyed talking with you.", "あなたと話せて楽しかった。"],
      ["She finished writing the report.", "彼女はレポートを書き終えた。"],
      ["He is good at playing tennis.", "彼はテニスが得意だ。"],
      ["Reading books is my hobby.", "本を読むことが私の趣味だ。"]
    ],
    pitfalls: [
      "× I enjoyed to talk. → ○ I enjoyed talking.",
      "stop + -ing は「〜するのをやめる」、stop + to 〜 は「〜するために立ち止まる」。"
    ]
  },
  {
    id: "relative",
    title: "関係代名詞",
    category: "文をつなぐ",
    summary: "名詞（先行詞）のあとに置いて、その名詞を説明する文をつなぎます。",
    points: [
      "<b>who</b>：先行詞が人。<b>which</b>：先行詞がもの・動物。<b>that</b>：人にもものにも使える。",
      "<b>主格</b>（関係代名詞のあとに動詞が続く）：I have a friend who lives in Paris.",
      "<b>目的格</b>（関係代名詞のあとに主語＋動詞が続く）：This is the book which I bought yesterday.",
      "目的格の関係代名詞は<b>省略できる</b>：This is the book I bought yesterday."
    ],
    examples: [
      ["I have a friend who lives in Paris.", "私にはパリに住んでいる友人がいる。"],
      ["This is the cake that my mother made.", "これは母が作ったケーキだ。"],
      ["The man who is standing there is my teacher.", "あそこに立っている男性は私の先生だ。"],
      ["The bag I bought yesterday is blue.", "昨日買ったかばんは青い。（目的格の省略）"]
    ],
    pitfalls: [
      "関係代名詞の後ろでは、先行詞にあたる語をくり返さない。× the book which I bought it",
      "主格の関係代名詞は省略できない。"
    ]
  },
  {
    id: "subjunctive",
    title: "仮定法",
    category: "文をつなぐ",
    summary: "現実とちがうことや、実現しそうにない願望を表すときに使います。時制を1つ過去にずらすのが特徴です。",
    points: [
      "<b>仮定法過去</b>：If + S + 過去形, S + would / could + 原形「もし〜なら、…だろうに」（今の事実と反対）",
      "<b>I wish + S + 過去形</b>「〜ならいいのに」",
      "be動詞は主語に関係なく <b>were</b> を使うのが基本。If I were you, …"
    ],
    examples: [
      ["If I had wings, I could fly.", "もし翼があれば、飛べるのに。"],
      ["If I were you, I would accept the offer.", "私があなたなら、その申し出を受けるだろう。"],
      ["I wish I lived near the sea.", "海の近くに住んでいたらいいのに。"]
    ],
    pitfalls: [
      "形は過去でも、意味は<b>現在</b>のこと。",
      "実際に起こりうる条件なら仮定法ではなく現在形：If it rains, I will stay home."
    ]
  }
];

// 種類分けに使う英短文のデータ
// 各行：[英文, 日本語訳, 文型, 文の種類, 時制, 解説]
//   文型   : SV / SVC / SVO / SVOO / SVOC
//   文の種類: D=平叙文 Q=疑問文 I=命令文 E=感嘆文
//   時制   : pr=現在形 pa=過去形 fu=未来 prp=現在進行形 pap=過去進行形 pf=現在完了
//            命令文は時制を持たないため null（時制の分類からは除外します）

const SENTENCE_ROWS = [
  // ---- 第1文型 SV ----
  ["Birds sing.", "鳥は歌う。", "SV", "D", "pr", "Birds(S) sing(V)。目的語も補語もありません。"],
  ["The sun rises in the east.", "太陽は東から昇る。", "SV", "D", "pr", "in the east は場所を表す修飾語(M)で、文型には数えません。"],
  ["She runs every morning.", "彼女は毎朝走る。", "SV", "D", "pr", "every morning は時を表す修飾語(M)です。"],
  ["My father works at a bank.", "父は銀行で働いている。", "SV", "D", "pr", "at a bank は修飾語(M)。work は目的語をとっていません。"],
  ["The baby is sleeping.", "赤ちゃんは眠っている。", "SV", "D", "prp", "is sleeping で1つの動詞(V)として扱います。"],
  ["We arrived at the station at noon.", "私たちは正午に駅に着いた。", "SV", "D", "pa", "at the station・at noon はどちらも修飾語(M)です。"],
  ["It rained heavily last night.", "昨夜は激しく雨が降った。", "SV", "D", "pa", "It は天候を表す主語。heavily は副詞なので修飾語(M)です。"],
  ["They were swimming in the river.", "彼らは川で泳いでいた。", "SV", "D", "pap", "were swimming が動詞(V)、in the river は修飾語(M)です。"],
  ["I will go to Kyoto next week.", "私は来週京都へ行く。", "SV", "D", "fu", "to Kyoto は方向を表す修飾語(M)。go は目的語をとりません。"],
  ["He has just arrived.", "彼はちょうど着いたところだ。", "SV", "D", "pf", "has arrived が動詞(V)、just は副詞(M)です。"],
  ["There is a cat under the table.", "テーブルの下に猫がいる。", "SV", "D", "pr", "There is 構文の主語は a cat。there は主語ではありません。"],
  ["Does the bus stop here?", "バスはここに止まりますか。", "SV", "Q", "pr", "the bus(S) stop(V)。here は副詞(M)です。"],
  ["Where do you live?", "どこに住んでいますか。", "SV", "Q", "pr", "where は場所をたずねる疑問副詞で、修飾語(M)にあたります。"],
  ["Did you sleep well?", "よく眠れましたか。", "SV", "Q", "pa", "you(S) sleep(V)。well は副詞(M)です。"],
  ["Have you ever been abroad?", "外国に行ったことがありますか。", "SV", "Q", "pf", "abroad は副詞なので補語ではなく修飾語(M)です。"],
  ["Will it snow tomorrow?", "明日は雪が降るだろうか。", "SV", "Q", "fu", "it(S) snow(V)。tomorrow は時を表す修飾語(M)です。"],
  ["Stand up.", "立ちなさい。", "SV", "I", null, "主語 you が省略された命令文。up は副詞(M)です。"],
  ["Come here, please.", "こちらへ来てください。", "SV", "I", null, "here は副詞(M)。please で命令をていねいにしています。"],
  ["Don't run in the hallway.", "廊下を走ってはいけない。", "SV", "I", null, "Don't + 動詞の原形で禁止を表します。in the hallway は修飾語(M)です。"],
  ["How fast he runs!", "彼はなんて速く走るのだろう。", "SV", "E", "pr", "How + 副詞 + S + V! の感嘆文。fast は副詞(M)です。"],

  // ---- 第2文型 SVC ----
  ["I am a student.", "私は学生だ。", "SVC", "D", "pr", "I = a student の関係が成り立つので、a student は補語(C)です。"],
  ["She looks happy.", "彼女はうれしそうに見える。", "SVC", "D", "pr", "She = happy。look は「〜に見える」の意味で補語をとります。"],
  ["This soup tastes good.", "このスープはおいしい。", "SVC", "D", "pr", "soup = good。taste は「〜な味がする」で補語をとります。"],
  ["He became a doctor.", "彼は医者になった。", "SVC", "D", "pa", "He = a doctor。become は補語をとる代表的な動詞です。"],
  ["The leaves turned red.", "葉が赤くなった。", "SVC", "D", "pa", "leaves = red。turn + 形容詞で「〜になる」です。"],
  ["It is getting dark.", "暗くなってきている。", "SVC", "D", "prp", "It = dark。get + 形容詞で「〜になる」。進行形になっています。"],
  ["My brother will be twenty next month.", "兄は来月20歳になる。", "SVC", "D", "fu", "My brother = twenty。next month は修飾語(M)です。"],
  ["They have been friends for ten years.", "彼らは10年間ずっと友達だ。", "SVC", "D", "pf", "They = friends。for ten years は期間を表す修飾語(M)です。"],
  ["The room was very quiet.", "その部屋はとても静かだった。", "SVC", "D", "pa", "room = quiet。very は quiet を強める副詞です。"],
  ["You look tired.", "疲れているように見えるね。", "SVC", "D", "pr", "You = tired。look + 形容詞の形です。"],
  ["Is this your bag?", "これはあなたのかばんですか。", "SVC", "Q", "pr", "this = your bag。be動詞を主語の前に出した疑問文です。"],
  ["Are you hungry?", "おなかがすいていますか。", "SVC", "Q", "pr", "you = hungry の関係が成り立ちます。"],
  ["Why was she angry?", "なぜ彼女は怒っていたのですか。", "SVC", "Q", "pa", "she = angry。why は理由をたずねる疑問副詞(M)です。"],
  ["Who is that man?", "あの男性はだれですか。", "SVC", "Q", "pr", "that man が主語(S)、Who が補語(C)。that man = 誰か、をたずねています。"],
  ["Be quiet.", "静かにしなさい。", "SVC", "I", null, "be動詞の命令文。省略された主語 you = quiet です。"],
  ["Don't be late.", "遅れないでね。", "SVC", "I", null, "Don't be + 形容詞で「〜になるな」。you = late の関係です。"],
  ["Be careful.", "気をつけて。", "SVC", "I", null, "省略された主語 you = careful。Be で始まる命令文です。"],
  ["What a beautiful day it is!", "なんて美しい日だろう。", "SVC", "E", "pr", "What + a + 形容詞 + 名詞 + S + V!。it = a beautiful day です。"],
  ["How kind you are!", "あなたはなんて親切なのでしょう。", "SVC", "E", "pr", "How + 形容詞 + S + V!。you = kind です。"],
  ["How cold it was yesterday!", "昨日はなんて寒かったのだろう。", "SVC", "E", "pa", "it = cold。yesterday は修飾語(M)です。"],

  // ---- 第3文型 SVO ----
  ["I like music.", "私は音楽が好きだ。", "SVO", "D", "pr", "I ≠ music なので music は目的語(O)です。"],
  ["She plays the piano.", "彼女はピアノを弾く。", "SVO", "D", "pr", "the piano は play の目的語(O)です。"],
  ["We study English every day.", "私たちは毎日英語を勉強する。", "SVO", "D", "pr", "English が目的語(O)、every day は修飾語(M)です。"],
  ["He bought a new bike.", "彼は新しい自転車を買った。", "SVO", "D", "pa", "a new bike が目的語(O)。He ≠ a new bike です。"],
  ["I am reading a book.", "私は本を読んでいる。", "SVO", "D", "prp", "am reading が動詞(V)、a book が目的語(O)です。"],
  ["They were watching TV.", "彼らはテレビを見ていた。", "SVO", "D", "pap", "were watching が動詞(V)、TV が目的語(O)です。"],
  ["I will call you tonight.", "今夜あなたに電話するね。", "SVO", "D", "fu", "you が目的語(O)。tonight は修飾語(M)です。"],
  ["I am going to visit my aunt.", "私はおばを訪ねる予定だ。", "SVO", "D", "fu", "be going to + 原形で予定を表します。my aunt が目的語(O)です。"],
  ["She has finished her homework.", "彼女は宿題を終えた。", "SVO", "D", "pf", "has finished が動詞(V)、her homework が目的語(O)です。"],
  ["I have lost my key.", "鍵をなくしてしまった。", "SVO", "D", "pf", "my key が目的語(O)。今も見つかっていないという結果を表します。"],
  ["Do you like cats?", "猫は好きですか。", "SVO", "Q", "pr", "you(S) like(V) cats(O)。Do を主語の前に置いた疑問文です。"],
  ["What did you eat for lunch?", "昼食に何を食べましたか。", "SVO", "Q", "pa", "What が eat の目的語(O)で、文の先頭に出ています。"],
  ["Have you read this book?", "この本を読んだことがありますか。", "SVO", "Q", "pf", "this book が目的語(O)。Have を主語の前に出した疑問文です。"],
  ["Who broke the window?", "だれが窓を割ったのですか。", "SVO", "Q", "pa", "Who が主語(S)、the window が目的語(O)です。"],
  ["Open the window.", "窓を開けて。", "SVO", "I", null, "主語 you が省略された命令文。the window が目的語(O)です。"],
  ["Please close the door.", "ドアを閉めてください。", "SVO", "I", null, "the door が目的語(O)。please でていねいな命令になります。"],
  ["Don't touch the paintings.", "絵に触らないでください。", "SVO", "I", null, "Don't + 原形の禁止。the paintings が目的語(O)です。"],
  ["Wash your hands.", "手を洗いなさい。", "SVO", "I", null, "your hands が目的語(O)です。"],
  ["What a nice car you have!", "なんてすてきな車を持っているのでしょう。", "SVO", "E", "pr", "you have a nice car の目的語 a nice car が前に出た感嘆文です。"],
  ["How much money he spent!", "彼はなんてたくさんのお金を使ったのだろう。", "SVO", "E", "pa", "he spent much money の目的語が前に出た形です。"],

  // ---- 第4文型 SVOO ----
  ["My mother made me a cake.", "母は私にケーキを作ってくれた。", "SVOO", "D", "pa", "me(O1：人に)と a cake(O2：ものを)。me ≠ a cake なので SVOC ではありません。"],
  ["He gave her a ring.", "彼は彼女に指輪をあげた。", "SVOO", "D", "pa", "her(O1)・a ring(O2)。gave a ring to her と書きかえられます。"],
  ["I will show you my photos.", "あなたに写真を見せてあげる。", "SVOO", "D", "fu", "you(O1)・my photos(O2)。show 人 もの の形です。"],
  ["She teaches us English.", "彼女は私たちに英語を教えている。", "SVOO", "D", "pr", "us(O1)・English(O2)。teach 人 もの の形です。"],
  ["My uncle sent me a letter.", "おじが私に手紙を送ってくれた。", "SVOO", "D", "pa", "me(O1)・a letter(O2)。sent a letter to me と書きかえられます。"],
  ["He asked me a question.", "彼は私に質問をした。", "SVOO", "D", "pa", "me(O1)・a question(O2)。ask 人 もの の形です。"],
  ["I have told you the story.", "その話はもうあなたにしたよ。", "SVOO", "D", "pf", "you(O1)・the story(O2)。have told で現在完了です。"],
  ["She is writing her friend a letter.", "彼女は友達に手紙を書いている。", "SVOO", "D", "prp", "her friend(O1)・a letter(O2)。進行形になっています。"],
  ["I will buy you lunch.", "お昼をおごるよ。", "SVOO", "D", "fu", "you(O1)・lunch(O2)。buy lunch for you と書きかえられます。"],
  ["Can you lend me your pen?", "ペンを貸してくれませんか。", "SVOO", "Q", "pr", "me(O1)・your pen(O2)。Can you 〜? は依頼の表現です。"],
  ["Did he buy you a present?", "彼はあなたにプレゼントを買ってくれましたか。", "SVOO", "Q", "pa", "you(O1)・a present(O2)です。"],
  ["Who taught you the guitar?", "だれがあなたにギターを教えたのですか。", "SVOO", "Q", "pa", "Who が主語(S)、you(O1)・the guitar(O2)です。"],
  ["Tell me the truth.", "本当のことを話して。", "SVOO", "I", null, "me(O1)・the truth(O2)。主語 you が省略された命令文です。"],
  ["Give me some water, please.", "水をください。", "SVOO", "I", null, "me(O1)・some water(O2)です。"],
  ["Pass me the salt, please.", "塩を取ってください。", "SVOO", "I", null, "me(O1)・the salt(O2)。食卓でよく使う表現です。"],
  ["What a nice present you gave me!", "なんてすてきなプレゼントをくれたのでしょう。", "SVOO", "E", "pa", "you gave me a nice present の O2 が前に出た感嘆文です。"],

  // ---- 第5文型 SVOC ----
  ["We call him Ken.", "私たちは彼をケンと呼ぶ。", "SVOC", "D", "pr", "him = Ken の関係が成り立つので、Ken は補語(C)です。"],
  ["The news made me sad.", "その知らせは私を悲しませた。", "SVOC", "D", "pa", "me = sad。make + O + 形容詞で「O を〜にする」です。"],
  ["She named her dog Max.", "彼女は犬にマックスと名づけた。", "SVOC", "D", "pa", "her dog = Max。name + O + C で「O を C と名づける」です。"],
  ["I found the book interesting.", "その本はおもしろいとわかった。", "SVOC", "D", "pa", "the book = interesting。find + O + C で「O が C だとわかる」です。"],
  ["The movie made her a star.", "その映画で彼女はスターになった。", "SVOC", "D", "pa", "her = a star なので SVOC。made her a cake（her ≠ a cake）の SVOO と比べてみましょう。"],
  ["They elected him captain.", "彼らは彼をキャプテンに選んだ。", "SVOC", "D", "pa", "him = captain。elect + O + C で「O を C に選ぶ」です。"],
  ["You will make your parents happy.", "あなたはご両親を喜ばせるだろう。", "SVOC", "D", "fu", "your parents = happy です。"],
  ["Hard work has made him rich.", "努力のおかげで彼は裕福になった。", "SVOC", "D", "pf", "him = rich。has made で現在完了です。"],
  ["I am painting the wall white.", "私は壁を白く塗っている。", "SVOC", "D", "prp", "the wall = white（塗った結果、白くなる）です。"],
  ["What do you call this flower?", "この花を何と呼びますか。", "SVOC", "Q", "pr", "you call this flower 〇〇 の 〇〇(C) を What でたずねています。"],
  ["Did the song make you cry?", "その歌を聞いて泣きましたか。", "SVOC", "Q", "pa", "make + O + 動詞の原形で「O に〜させる」。you が cry する関係です。"],
  ["Please keep the door open.", "ドアを開けたままにしておいてください。", "SVOC", "I", null, "the door = open。keep + O + C で「O を C のままにする」です。"],
  ["Leave me alone.", "ひとりにして。", "SVOC", "I", null, "me = alone。leave + O + C で「O を C のままにしておく」です。"],
  ["Don't leave the water running.", "水を出しっぱなしにしないで。", "SVOC", "I", null, "the water = running（流れている状態）です。"],
  ["Keep your room clean.", "部屋をきれいにしておきなさい。", "SVOC", "I", null, "your room = clean です。"],
  ["How happy the letter made her!", "その手紙は彼女をなんと喜ばせたことか。", "SVOC", "E", "pa", "the letter made her happy の C（happy）が How とともに前に出た形です。"]
];

// 分類の軸と、それぞれの分類の説明
const AXES = {
  pattern: {
    label: "文型",
    values: [
      { key: "SV", label: "第1文型 SV", hint: "主語と動詞だけで文が成り立ちます。後ろの語句は修飾語(M)です。" },
      { key: "SVC", label: "第2文型 SVC", hint: "S = C の関係が成り立ちます（be動詞・look・become など）。" },
      { key: "SVO", label: "第3文型 SVO", hint: "動詞のあとに目的語が1つ。S ≠ O です。" },
      { key: "SVOO", label: "第4文型 SVOO", hint: "「人に」「ものを」の2つの目的語があり、O1 ≠ O2 です。" },
      { key: "SVOC", label: "第5文型 SVOC", hint: "目的語のあとに補語があり、O = C の関係が成り立ちます。" }
    ]
  },
  type: {
    label: "文の種類",
    values: [
      { key: "D", label: "平叙文", hint: "事実や考えをそのまま述べ、ピリオドで終わる文です。" },
      { key: "Q", label: "疑問文", hint: "be動詞・助動詞・Do/Does/Did が主語の前に出るか、疑問詞で始まり ? で終わります。" },
      { key: "I", label: "命令文", hint: "主語がなく、動詞の原形（Be / Don't を含む）で始まります。" },
      { key: "E", label: "感嘆文", hint: "What または How で始まり、! で終わります。" }
    ]
  },
  tense: {
    label: "時制",
    values: [
      { key: "pr", label: "現在形", hint: "習慣・事実・今の状態を表します。" },
      { key: "pa", label: "過去形", hint: "過去に終わった出来事・状態を表します（-ed や不規則変化、did / was / were）。" },
      { key: "fu", label: "未来", hint: "will + 原形、または be going to + 原形です。" },
      { key: "prp", label: "現在進行形", hint: "am / is / are + -ing です。" },
      { key: "pap", label: "過去進行形", hint: "was / were + -ing です。" },
      { key: "pf", label: "現在完了", hint: "have / has + 過去分詞です。" }
    ]
  }
};

const SENTENCES = SENTENCE_ROWS.map(function (row, index) {
  return {
    id: index,
    en: row[0],
    ja: row[1],
    pattern: row[2],
    type: row[3],
    tense: row[4],
    note: row[5]
  };
});

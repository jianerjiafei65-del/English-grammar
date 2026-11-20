(function () {
  "use strict";

  // ===== 保存（使えない環境でも動くようにする） =====
  var STORE_KEY = "english-grammar-tool:v1";

  function loadStore() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStore() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) {
      // 保存できなくても続行する
    }
  }

  var store = loadStore();
  store.stats = store.stats || {};
  store.wrong = store.wrong || {};
  Object.keys(AXES).forEach(function (axis) {
    store.stats[axis] = store.stats[axis] || { answered: 0, correct: 0, streak: 0 };
    store.wrong[axis] = Array.isArray(store.wrong[axis]) ? store.wrong[axis] : [];
  });

  // ===== 小さな道具 =====
  function $(id) { return document.getElementById(id); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val === null || val === undefined || val === false) return;
        if (key === "text") node.textContent = val;
        else if (key === "html") node.innerHTML = val;
        else if (key === "className") node.className = val;
        else if (key.indexOf("on") === 0) node.addEventListener(key.slice(2), val);
        else node.setAttribute(key, val === true ? "" : val);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function valueInfo(axis, key) {
    var values = AXES[axis].values;
    for (var i = 0; i < values.length; i++) {
      if (values[i].key === key) return values[i];
    }
    return null;
  }

  function labelOf(axis, key) {
    var info = valueInfo(axis, key);
    return info ? info.label : "—";
  }

  // 時制の分類では、時制を持たない命令文を除く
  function sentencesFor(axis) {
    return SENTENCES.filter(function (s) { return s[axis] !== null; });
  }

  function normalize(text) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
  }

  // ===== タブ =====
  var SUBTITLES = {
    grammar: "英文法の解説",
    list: "英短文の種類分け一覧",
    practice: "種類分けの練習"
  };

  var state = {
    tab: "grammar",
    topicId: null,
    grammarQuery: "",
    listAxis: "pattern",
    listFilter: "all",
    listQuery: "",
    practiceAxis: "pattern",
    wrongOnly: false,
    question: null,
    answered: false,
    lastId: null
  };

  function showTab(tab) {
    state.tab = tab;
    document.querySelectorAll(".tab").forEach(function (btn) {
      if (btn.dataset.tab === tab) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
    document.querySelectorAll(".panel").forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== tab;
    });
    $("header-sub").textContent = SUBTITLES[tab];
    if (tab === "practice" && !state.question) nextQuestion();
    window.scrollTo(0, 0);
  }

  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () { showTab(btn.dataset.tab); });
  });

  function renderSegmented(container, current, onSelect) {
    container.innerHTML = "";
    Object.keys(AXES).forEach(function (axis) {
      container.appendChild(el("button", {
        type: "button",
        role: "tab",
        "aria-selected": axis === current ? "true" : "false",
        text: AXES[axis].label,
        onclick: function () { onSelect(axis); }
      }));
    });
  }

  // ===== 解説 =====
  var isWide = window.matchMedia("(min-width: 768px)");

  function renderGrammarList() {
    var list = $("grammar-list");
    var query = normalize(state.grammarQuery);
    list.innerHTML = "";

    var topics = GRAMMAR_TOPICS.filter(function (t) {
      if (!query) return true;
      var hay = normalize([t.title, t.category, t.summary].concat(t.points).join(" ").replace(/<[^>]+>/g, ""));
      return hay.indexOf(query) !== -1;
    });

    if (topics.length === 0) {
      list.appendChild(el("p", { className: "grammar-empty", text: "該当する項目がありません。" }));
      return;
    }

    var groups = [];
    topics.forEach(function (t) {
      var group = groups.filter(function (g) { return g.name === t.category; })[0];
      if (!group) {
        group = { name: t.category, items: [] };
        groups.push(group);
      }
      group.items.push(t);
    });

    groups.forEach(function (g) {
      var ul = el("ul");
      g.items.forEach(function (t) {
        ul.appendChild(el("li", null, [
          el("button", {
            type: "button",
            className: "topic-btn",
            "aria-current": t.id === state.topicId ? "true" : null,
            onclick: function () { openTopic(t.id); }
          }, [
            el("span", null, [
              el("span", { className: "topic-name", text: t.title }),
              el("span", { className: "topic-sum", text: t.summary })
            ]),
            el("span", { className: "chev", "aria-hidden": "true", text: "›" })
          ])
        ]));
      });
      list.appendChild(el("section", { className: "grammar-group" }, [
        el("h2", { text: g.name }),
        ul
      ]));
    });
  }

  function renderGrammarDetail() {
    var detail = $("grammar-detail");
    var topic = GRAMMAR_TOPICS.filter(function (t) { return t.id === state.topicId; })[0];
    detail.innerHTML = "";
    if (!topic) return;

    var examples = el("ul", { className: "examples" });
    topic.examples.forEach(function (ex) {
      examples.appendChild(el("li", null, [
        el("span", { className: "en", lang: "en", text: ex[0] }),
        el("span", { className: "ja", text: ex[1] })
      ]));
    });

    var actions = el("div", { className: "detail-actions" });
    if (topic.axis) {
      actions.appendChild(el("button", {
        type: "button",
        className: "btn-ghost",
        text: "「" + AXES[topic.axis].label + "」で英短文を見る",
        onclick: function () {
          state.listAxis = topic.axis;
          state.listFilter = "all";
          renderList();
          showTab("list");
        }
      }));
      actions.appendChild(el("button", {
        type: "button",
        className: "btn-ghost",
        text: "「" + AXES[topic.axis].label + "」を練習する",
        onclick: function () {
          setPracticeAxis(topic.axis);
          showTab("practice");
        }
      }));
    }

    detail.appendChild(el("button", {
      type: "button",
      className: "btn-ghost back",
      text: "‹ 項目一覧へ",
      onclick: function () {
        $("grammar-layout").classList.remove("show-detail");
        window.scrollTo(0, 0);
      }
    }));

    detail.appendChild(el("div", { className: "card detail-card" }, [
      el("p", { className: "detail-cat", text: topic.category }),
      el("h2", { text: topic.title }),
      el("p", { className: "summary", text: topic.summary }),
      el("h3", { text: "ポイント" }),
      el("ul", null, topic.points.map(function (p) { return el("li", { html: p }); })),
      el("h3", { text: "例文" }),
      examples,
      el("h3", { text: "間違えやすい点" }),
      el("ul", { className: "pitfalls" }, topic.pitfalls.map(function (p) { return el("li", { html: p }); })),
      actions.childNodes.length ? actions : null
    ]));
  }

  function openTopic(id) {
    state.topicId = id;
    renderGrammarList();
    renderGrammarDetail();
    $("grammar-layout").classList.add("show-detail");
    if (!isWide.matches) window.scrollTo(0, 0);
  }

  $("grammar-search").addEventListener("input", function (e) {
    state.grammarQuery = e.target.value;
    renderGrammarList();
  });

  // ===== 種類分け一覧 =====
  function renderList() {
    var axis = state.listAxis;
    renderSegmented($("list-axis"), axis, function (next) {
      state.listAxis = next;
      state.listFilter = "all";
      renderList();
    });

    var pool = sentencesFor(axis);
    var filters = $("list-filters");
    filters.innerHTML = "";
    var options = [{ key: "all", label: "すべて", count: pool.length }].concat(
      AXES[axis].values.map(function (v) {
        return {
          key: v.key,
          label: v.label,
          count: pool.filter(function (s) { return s[axis] === v.key; }).length
        };
      })
    );
    options.forEach(function (opt) {
      filters.appendChild(el("button", {
        type: "button",
        className: "chip",
        "aria-pressed": state.listFilter === opt.key ? "true" : "false",
        onclick: function () {
          state.listFilter = opt.key;
          renderList();
        }
      }, [opt.label, el("span", { className: "count", text: String(opt.count) })]));
    });

    var query = normalize(state.listQuery);
    var items = pool.filter(function (s) {
      if (state.listFilter !== "all" && s[axis] !== state.listFilter) return false;
      if (query && normalize(s.en + " " + s.ja).indexOf(query) === -1) return false;
      return true;
    });

    var info = state.listFilter === "all" ? null : valueInfo(axis, state.listFilter);
    var countText = items.length + " 文";
    if (axis === "tense" && state.listFilter === "all") countText += "（命令文は時制を持たないため除いています）";
    else if (info) countText += "：" + info.hint;
    $("list-count").textContent = countText;

    var list = $("sentence-list");
    list.innerHTML = "";
    if (items.length === 0) {
      list.appendChild(el("li", { className: "list-empty", text: "該当する英文がありません。" }));
      return;
    }

    items.forEach(function (s) {
      var tags = el("div", { className: "tags" });
      Object.keys(AXES).forEach(function (a) {
        if (s[a] === null) return;
        tags.appendChild(el("span", {
          className: "tag" + (a === axis ? " is-main" : ""),
          text: AXES[a].label + "：" + labelOf(a, s[a])
        }));
      });
      list.appendChild(el("li", null, [
        el("details", null, [
          el("summary", null, [
            el("span", { className: "en", lang: "en", text: s.en }),
            el("span", { className: "tag is-main", text: labelOf(axis, s[axis]) })
          ]),
          el("div", { className: "sentence-body" }, [
            el("p", { className: "ja", text: s.ja }),
            tags,
            el("p", { className: "note", text: s.note })
          ])
        ])
      ]));
    });
  }

  $("list-search").addEventListener("input", function (e) {
    state.listQuery = e.target.value;
    renderList();
  });

  // ===== 練習 =====
  function setPracticeAxis(axis) {
    if (typeof disarmReset === "function") disarmReset();
    state.practiceAxis = axis;
    state.question = null;
    renderPracticeHeader();
    nextQuestion();
  }

  function renderPracticeHeader() {
    renderSegmented($("practice-axis"), state.practiceAxis, setPracticeAxis);
    var st = store.stats[state.practiceAxis];
    var rate = st.answered ? Math.round((st.correct / st.answered) * 100) + "%" : "—";
    var stats = $("practice-stats");
    stats.innerHTML = "";
    [
      [rate, "正答率（" + st.correct + "/" + st.answered + "）"],
      [String(st.streak), "連続正解"],
      [String(store.wrong[state.practiceAxis].length), "間違えた文"]
    ].forEach(function (item) {
      stats.appendChild(el("div", { className: "stat" }, [
        el("span", { className: "num", text: item[0] }),
        el("span", { className: "lbl", text: item[1] })
      ]));
    });
    $("practice-wrong-only").checked = state.wrongOnly;
  }

  function practicePool() {
    var axis = state.practiceAxis;
    var pool = sentencesFor(axis);
    if (state.wrongOnly) {
      var wrong = store.wrong[axis];
      pool = pool.filter(function (s) { return wrong.indexOf(s.id) !== -1; });
    }
    return pool;
  }

  function nextQuestion() {
    var pool = practicePool();
    state.answered = false;
    if (pool.length === 0) {
      state.question = null;
      renderQuestion();
      return;
    }
    var candidates = pool.length > 1
      ? pool.filter(function (s) { return s.id !== state.lastId; })
      : pool;
    state.question = candidates[Math.floor(Math.random() * candidates.length)];
    state.lastId = state.question.id;
    renderQuestion();
  }

  function renderQuestion() {
    var card = $("question-card");
    card.innerHTML = "";
    var axis = state.practiceAxis;
    var q = state.question;

    if (!q) {
      card.appendChild(el("p", {
        className: "practice-empty",
        text: state.wrongOnly
          ? "間違えた文はありません。「間違えた文だけ出す」を外すと、すべての文から出題します。"
          : "出題できる文がありません。"
      }));
      return;
    }

    var choices = el("div", { className: "choices", role: "group", "aria-label": "選択肢" });
    AXES[axis].values.forEach(function (v) {
      choices.appendChild(el("button", {
        type: "button",
        className: "choice",
        "data-key": v.key,
        text: v.label,
        onclick: function () { answer(v.key); }
      }));
    });

    card.appendChild(el("p", { className: "q-label", text: "この文の「" + AXES[axis].label + "」はどれ？" }));
    card.appendChild(el("p", { className: "q-sentence en", lang: "en", text: q.en }));
    card.appendChild(choices);
    card.appendChild(el("div", { id: "feedback-slot", "aria-live": "polite" }));
  }

  function answer(key) {
    if (state.answered || !state.question) return;
    state.answered = true;

    var axis = state.practiceAxis;
    var q = state.question;
    var correctKey = q[axis];
    var isCorrect = key === correctKey;

    var st = store.stats[axis];
    st.answered += 1;
    if (isCorrect) {
      st.correct += 1;
      st.streak += 1;
    } else {
      st.streak = 0;
    }
    var wrong = store.wrong[axis];
    var pos = wrong.indexOf(q.id);
    if (isCorrect && pos !== -1) wrong.splice(pos, 1);
    if (!isCorrect && pos === -1) wrong.push(q.id);
    saveStore();

    document.querySelectorAll("#question-card .choice").forEach(function (btn) {
      btn.disabled = true;
      if (btn.dataset.key === correctKey) btn.classList.add("is-correct");
      else if (btn.dataset.key === key) btn.classList.add("is-wrong");
    });

    var info = valueInfo(axis, correctKey);
    var slot = $("feedback-slot");
    slot.appendChild(el("div", { className: "feedback " + (isCorrect ? "ok" : "ng") }, [
      el("p", {
        className: "result",
        text: (isCorrect ? "正解！ " : "不正解… 正解は ") + info.label + (isCorrect ? "" : " です")
      }),
      el("p", { className: "ja", text: q.ja }),
      el("p", { text: info.hint }),
      axis === "pattern" ? el("p", { text: q.note }) : null
    ]));
    var nextBtn = el("button", {
      type: "button",
      className: "btn",
      text: "次の問題へ",
      onclick: nextQuestion
    });
    slot.appendChild(el("div", { className: "next-row" }, [nextBtn]));
    nextBtn.focus({ preventScroll: true });
    nextBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });

    renderPracticeHeader();
  }

  $("practice-wrong-only").addEventListener("change", function (e) {
    state.wrongOnly = e.target.checked;
    nextQuestion();
  });

  // 確認ダイアログが使えない環境もあるため、2回押すと消去する方式にする
  var resetTimer = null;
  function disarmReset() {
    var btn = $("practice-reset");
    clearTimeout(resetTimer);
    btn.dataset.armed = "";
    btn.textContent = "成績をリセット";
  }

  $("practice-reset").addEventListener("click", function () {
    var btn = $("practice-reset");
    var axis = state.practiceAxis;
    if (btn.dataset.armed !== "1") {
      btn.dataset.armed = "1";
      btn.textContent = "もう一度押すと「" + AXES[axis].label + "」の成績を消去";
      resetTimer = setTimeout(disarmReset, 4000);
      return;
    }
    disarmReset();
    store.stats[axis] = { answered: 0, correct: 0, streak: 0 };
    store.wrong[axis] = [];
    saveStore();
    renderPracticeHeader();
    if (state.wrongOnly) nextQuestion();
  });

  // ===== 初期表示 =====
  state.topicId = GRAMMAR_TOPICS[0].id;
  renderGrammarList();
  renderGrammarDetail();
  renderList();
  renderPracticeHeader();
})();

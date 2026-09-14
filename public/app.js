// ==============================================================================
// SQL Learning Studio Pro — Client-Side Reactive Controller
// Practice Studio & Exam / Mock Paper Engine
// ==============================================================================

class SqlStudioApp {
  constructor() {
    this.mode = 'practice'; // 'practice' | 'exam'
    this.curriculum = [];
    this.chapters = [];
    this.tables = [];

    // Practice State
    this.currentTopicIndex = 0;
    this.currentQuestionIndex = 0;
    this.passedQuestions = new Set(JSON.parse(localStorage.getItem('sql_passed_questions') || '[]'));

    // Exam State
    this.examState = 'setup'; // 'setup' | 'active' | 'scorecard'
    this.currentExam = null;
    this.currentExamQIndex = 0;
    this.examAnswers = new Map(); // questionId -> sqlString
    this.examFlags = new Set(); // Set of flagged questionIds
    this.examTimerInterval = null;
    this.examTotalSeconds = 0;
    this.examSecondsRemaining = 0;
    this.examSelectedTime = 20;
    this.examSelectedCount = 5;
    this.selectedExamChapterIds = new Set();

    this.initElements();
    this.initEventListeners();
    this.boot();
  }

  initElements() {
    // Mode Switcher
    this.modeBtnPractice = document.getElementById('modeBtnPractice');
    this.modeBtnExam = document.getElementById('modeBtnExam');
    this.practiceWorkspace = document.getElementById('practiceWorkspace');
    this.examWorkspace = document.getElementById('examWorkspace');
    this.practiceTopicWrapper = document.getElementById('practiceTopicWrapper');
    this.examTimerPill = document.getElementById('examTimerPill');
    this.examTimerDisplay = document.getElementById('examTimerDisplay');
    this.examTimerBar = document.getElementById('examTimerBar');

    // Practice Elements
    this.topicSelect = document.getElementById('topicSelect');
    this.questionPills = document.getElementById('questionPills');
    this.qLevelBadge = document.getElementById('qLevelBadge');
    this.qConceptBadge = document.getElementById('qConceptBadge');
    this.qTitle = document.getElementById('qTitle');
    this.qDescription = document.getElementById('qDescription');
    this.qTables = document.getElementById('qTables');
    this.hint1Text = document.getElementById('hint1Text');
    this.hint2Text = document.getElementById('hint2Text');
    this.hint3Text = document.getElementById('hint3Text');
    this.hint1Details = document.getElementById('hint1Details');
    this.hint2Details = document.getElementById('hint2Details');
    this.hint3Details = document.getElementById('hint3Details');
    this.btnCopySkeleton = document.getElementById('btnCopySkeleton');
    this.btnRevealSolution = document.getElementById('btnRevealSolution');
    this.btnNextQuestion = document.getElementById('btnNextQuestion');
    this.btnResetDb = document.getElementById('btnResetDb');
    this.sqlEditor = document.getElementById('sqlEditor');
    this.btnRunQuery = document.getElementById('btnRunQuery');
    this.btnCheckQuery = document.getElementById('btnCheckQuery');
    this.btnClearEditor = document.getElementById('btnClearEditor');
    this.tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    this.resCountBadge = document.getElementById('resCountBadge');
    this.valStatusIcon = document.getElementById('valStatusIcon');
    this.resultsTableContainer = document.getElementById('resultsTableContainer');
    this.queryStatusBanner = document.getElementById('queryStatusBanner');
    this.validationReport = document.getElementById('validationReport');
    this.tableList = document.getElementById('tableList');
    this.currentExplorerTableName = document.getElementById('currentExplorerTableName');
    this.currentExplorerRowCount = document.getElementById('currentExplorerRowCount');
    this.explorerColumnsView = document.getElementById('explorerColumnsView');
    this.explorerDataGrid = document.getElementById('explorerDataGrid');
    this.tabBtnSolution = document.getElementById('tabBtnSolution');
    this.solutionQueryCode = document.getElementById('solutionQueryCode');
    this.btnCopySolution = document.getElementById('btnCopySolution');

    this.examSetupScreen = document.getElementById('examSetupScreen');
    this.examActiveScreen = document.getElementById('examActiveScreen');
    this.examScorecardScreen = document.getElementById('examScorecardScreen');
    this.examChaptersContainer = document.getElementById('examChaptersContainer');
    this.btnSelectAllChapters = document.getElementById('btnSelectAllChapters');
    this.btnDeselectAllChapters = document.getElementById('btnDeselectAllChapters');
    this.examSelectedCountSummary = document.getElementById('examSelectedCountSummary');
    this.examSelectedPoolSummary = document.getElementById('examSelectedPoolSummary');
    this.timeChips = document.querySelectorAll('#timeChipGroup .chip');
    this.countChips = document.querySelectorAll('#countChipGroup .chip');
    this.btnStartExam = document.getElementById('btnStartExam');

    // Active Exam Elements
    this.examActiveChapterTitle = document.getElementById('examActiveChapterTitle');
    this.examQuestionProgressBadge = document.getElementById('examQuestionProgressBadge');
    this.examQuestionPalette = document.getElementById('examQuestionPalette');
    this.examQLevelBadge = document.getElementById('examQLevelBadge');
    this.examQConceptBadge = document.getElementById('examQConceptBadge');
    this.examQTitle = document.getElementById('examQTitle');
    this.examQDescription = document.getElementById('examQDescription');
    this.examQTables = document.getElementById('examQTables');
    this.chkFlagQuestion = document.getElementById('chkFlagQuestion');
    this.btnSaveExamAnswer = document.getElementById('btnSaveExamAnswer');
    this.btnPrevExamQ = document.getElementById('btnPrevExamQ');
    this.btnNextExamQ = document.getElementById('btnNextExamQ');
    this.btnSubmitExam = document.getElementById('btnSubmitExam');
    this.examSqlEditor = document.getElementById('examSqlEditor');
    this.btnExamRunScratchpad = document.getElementById('btnExamRunScratchpad');
    this.examTabBtns = document.querySelectorAll('.tab-btn[data-examtab]');
    this.examScratchStatusBanner = document.getElementById('examScratchStatusBanner');
    this.examScratchTableContainer = document.getElementById('examScratchTableContainer');
    this.examScratchCountBadge = document.getElementById('examScratchCountBadge');
    this.examTableList = document.getElementById('examTableList');
    this.examExplorerColumnsView = document.getElementById('examExplorerColumnsView');
    this.examExplorerDataGrid = document.getElementById('examExplorerDataGrid');

    // Scorecard Elements
    this.scorecardGradeBadge = document.getElementById('scorecardGradeBadge');
    this.scorecardHeading = document.getElementById('scorecardHeading');
    this.scorecardSubheading = document.getElementById('scorecardSubheading');
    this.scorecardScorePct = document.getElementById('scorecardScorePct');
    this.scorecardQuestionsPassed = document.getElementById('scorecardQuestionsPassed');
    this.scorecardTimeElapsed = document.getElementById('scorecardTimeElapsed');
    this.scorecardQuestionsList = document.getElementById('scorecardQuestionsList');
    this.btnRetakeExam = document.getElementById('btnRetakeExam');
    this.btnChooseAnotherChapter = document.getElementById('btnChooseAnotherChapter');
    this.btnBackToPractice = document.getElementById('btnBackToPractice');

    // Modal & Toast
    this.examSubmitModal = document.getElementById('examSubmitModal');
    this.examSubmitSummaryText = document.getElementById('examSubmitSummaryText');
    this.btnCancelSubmit = document.getElementById('btnCancelSubmit');
    this.btnConfirmSubmit = document.getElementById('btnConfirmSubmit');
    this.toast = document.getElementById('toast');
  }

  initEventListeners() {
    // Mode Switcher
    this.modeBtnPractice.addEventListener('click', () => this.switchMode('practice'));
    this.modeBtnExam.addEventListener('click', () => this.switchMode('exam'));

    // Topic Selector (Practice)
    this.topicSelect.addEventListener('change', (e) => {
      this.currentTopicIndex = parseInt(e.target.value, 10);
      this.currentQuestionIndex = 0;
      this.renderQuestion();
    });

    // Practice Editor Buttons
    this.btnRunQuery.addEventListener('click', () => this.runQuery());
    this.btnCheckQuery.addEventListener('click', () => this.checkQuery());
    this.btnClearEditor.addEventListener('click', () => {
      this.sqlEditor.value = '';
      this.sqlEditor.focus();
    });

    // Practice Keyboard Shortcuts
    this.sqlEditor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.runQuery();
        } else {
          this.checkQuery();
        }
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.sqlEditor.selectionStart;
        const end = this.sqlEditor.selectionEnd;
        this.sqlEditor.value = this.sqlEditor.value.substring(0, start) + '  ' + this.sqlEditor.value.substring(end);
        this.sqlEditor.selectionStart = this.sqlEditor.selectionEnd = start + 2;
      }
    });

    // Snippets
    document.querySelectorAll('.snippet-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetEditor = this.mode === 'practice' ? this.sqlEditor : this.examSqlEditor;
        const snippet = btn.dataset.sql;
        const start = targetEditor.selectionStart;
        const end = targetEditor.selectionEnd;
        const text = targetEditor.value;
        targetEditor.value = text.substring(0, start) + snippet + text.substring(end);
        targetEditor.selectionStart = targetEditor.selectionEnd = start + snippet.length;
        targetEditor.focus();
      });
    });

    // Practice Hints
    this.btnCopySkeleton.addEventListener('click', () => {
      const q = this.getCurrentQuestion();
      if (q && q.hint3) {
        this.sqlEditor.value = q.hint3;
        this.sqlEditor.focus();
        this.showToast('Query outline inserted into editor!');
      }
    });

    this.btnRevealSolution.addEventListener('click', () => this.revealSolution());
    this.btnCopySolution.addEventListener('click', () => {
      this.sqlEditor.value = this.solutionQueryCode.textContent;
      this.sqlEditor.focus();
      this.showToast('Solution copied to editor!');
    });

    this.btnNextQuestion.addEventListener('click', () => this.nextQuestion());
    this.btnResetDb.addEventListener('click', () => this.resetDatabase());

    // Practice Tabs
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // ------------------------------------------------------------------------
    // EXAM EVENT LISTENERS
    // ------------------------------------------------------------------------
    // Time & Count Chips
    this.timeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.timeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.examSelectedTime = parseInt(chip.dataset.time, 10);
      });
    });

    this.countChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.countChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.examSelectedCount = parseInt(chip.dataset.count, 10);
      });
    });

    this.btnStartExam.addEventListener('click', () => this.startExam());
    if (this.btnSelectAllChapters) {
      this.btnSelectAllChapters.addEventListener('click', () => this.selectAllChapters());
    }
    if (this.btnDeselectAllChapters) {
      this.btnDeselectAllChapters.addEventListener('click', () => this.deselectAllChapters());
    }

    // Exam Editor Keydown
    this.examSqlEditor.addEventListener('input', () => {
      this.saveCurrentExamAnswerInMemory();
    });

    this.examSqlEditor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runExamScratchpad();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.examSqlEditor.selectionStart;
        const end = this.examSqlEditor.selectionEnd;
        this.examSqlEditor.value = this.examSqlEditor.value.substring(0, start) + '  ' + this.examSqlEditor.value.substring(end);
        this.examSqlEditor.selectionStart = this.examSqlEditor.selectionEnd = start + 2;
        this.saveCurrentExamAnswerInMemory();
      }
    });

    this.btnExamRunScratchpad.addEventListener('click', () => this.runExamScratchpad());
    this.btnSaveExamAnswer.addEventListener('click', () => {
      this.saveCurrentExamAnswerInMemory();
      this.showToast('Answer saved for this question!');
    });

    this.chkFlagQuestion.addEventListener('change', (e) => {
      const q = this.getCurrentExamQuestion();
      if (!q) return;
      if (e.target.checked) {
        this.examFlags.add(q.id);
      } else {
        this.examFlags.delete(q.id);
      }
      this.renderExamPalette();
    });

    this.btnPrevExamQ.addEventListener('click', () => {
      if (this.currentExamQIndex > 0) {
        this.saveCurrentExamAnswerInMemory();
        this.currentExamQIndex--;
        this.renderActiveExamQuestion();
      }
    });

    this.btnNextExamQ.addEventListener('click', () => {
      if (this.currentExam && this.currentExamQIndex < this.currentExam.questions.length - 1) {
        this.saveCurrentExamAnswerInMemory();
        this.currentExamQIndex++;
        this.renderActiveExamQuestion();
      }
    });

    this.btnSubmitExam.addEventListener('click', () => this.openSubmitModal());
    this.btnCancelSubmit.addEventListener('click', () => {
      this.examSubmitModal.style.display = 'none';
    });
    this.btnConfirmSubmit.addEventListener('click', () => {
      this.examSubmitModal.style.display = 'none';
      this.submitExamFinal();
    });

    // Exam Tabs
    this.examTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.examtab;
        this.switchExamTab(target);
      });
    });

    // Scorecard Actions
    this.btnRetakeExam.addEventListener('click', () => {
      if (this.currentExam) {
        this.generateExam(this.currentExam.chapterId, this.examSelectedCount, this.examSelectedTime);
      }
    });
    this.btnChooseAnotherChapter.addEventListener('click', () => {
      this.setExamScreenState('setup');
    });
    this.btnBackToPractice.addEventListener('click', () => {
      this.switchMode('practice');
    });
  }

  async boot() {
    try {
      await Promise.all([this.loadCurriculum(), this.loadChapters(), this.loadTables()]);
      this.renderCurriculumDropdown();
      this.renderExamChapterSelector();
      this.renderQuestion();
      if (this.tables.length > 0) {
        this.loadTableData(this.tables[0].name);
      }
    } catch (err) {
      console.error('Bootstrap error:', err);
      this.showToast(`Error initializing app: ${err.message}`);
    }
  }

  async loadCurriculum() {
    const res = await fetch('/api/curriculum');
    const data = await res.json();
    this.curriculum = data.curriculum;
  }

  async loadChapters() {
    const res = await fetch('/api/chapters');
    const data = await res.json();
    this.chapters = data.chapters;
  }

  async loadTables() {
    const res = await fetch('/api/tables');
    const data = await res.json();
    this.tables = data.tables;
    this.renderExplorerSidebar();
    this.renderExamExplorerSidebar();
  }

  switchMode(newMode) {
    this.mode = newMode;
    this.modeBtnPractice.classList.toggle('active', newMode === 'practice');
    this.modeBtnExam.classList.toggle('active', newMode === 'exam');

    if (newMode === 'practice') {
      this.practiceWorkspace.style.display = 'grid';
      this.examWorkspace.style.display = 'none';
      this.practiceTopicWrapper.style.display = 'flex';
      this.examTimerPill.style.display = 'none';
    } else {
      this.practiceWorkspace.style.display = 'none';
      this.examWorkspace.style.display = 'flex';
      this.practiceTopicWrapper.style.display = 'none';
      if (this.examState === 'active') {
        this.examTimerPill.style.display = 'flex';
      }
    }
  }

  // --------------------------------------------------------------------------
  // PRACTICE STUDIO LOGIC
  // --------------------------------------------------------------------------
  renderCurriculumDropdown() {
    this.topicSelect.innerHTML = '';
    this.curriculum.forEach((topic, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = topic.topicTitle;
      this.topicSelect.appendChild(opt);
    });
  }

  getCurrentTopic() {
    return this.curriculum[this.currentTopicIndex] || null;
  }

  getCurrentQuestion() {
    const topic = this.getCurrentTopic();
    if (!topic || !topic.questions) return null;
    return topic.questions[this.currentQuestionIndex] || null;
  }

  renderQuestion() {
    const topic = this.getCurrentTopic();
    const q = this.getCurrentQuestion();
    if (!topic || !q) return;

    this.questionPills.innerHTML = '';
    topic.questions.forEach((question, idx) => {
      const pill = document.createElement('div');
      pill.className = `q-pill ${idx === this.currentQuestionIndex ? 'active' : ''} ${this.passedQuestions.has(question.id) ? 'passed' : ''}`;
      pill.textContent = question.number;
      pill.title = question.title;
      pill.addEventListener('click', () => {
        this.currentQuestionIndex = idx;
        this.renderQuestion();
      });
      this.questionPills.appendChild(pill);
    });

    this.qLevelBadge.textContent = `Level ${q.level}`;
    this.qConceptBadge.textContent = q.concept;
    this.qTitle.textContent = `Q${q.number}: ${q.title}`;
    this.qDescription.innerHTML = this.formatMarkdownCode(q.description);

    this.qTables.innerHTML = '';
    if (q.tables && q.tables.length > 0) {
      q.tables.forEach(tableName => {
        const tag = document.createElement('span');
        tag.className = 'table-tag';
        tag.textContent = tableName;
        tag.title = `Click to view ${tableName} table schema & rows`;
        tag.addEventListener('click', () => {
          this.switchTab('explorerTab');
          this.loadTableData(tableName);
        });
        this.qTables.appendChild(tag);
      });
    }

    this.sqlEditor.value = q.starterSql || '-- Write your SQL query here...\nSELECT ';
    this.hint1Text.textContent = q.hint1 || 'No conceptual hint available.';
    this.hint2Text.textContent = q.hint2 || 'No clause hint available.';
    this.hint3Text.textContent = q.hint3 || 'No outline available.';
    this.hint1Details.open = false;
    this.hint2Details.open = false;
    this.hint3Details.open = false;

    if (this.passedQuestions.has(q.id)) {
      this.btnNextQuestion.style.display = 'inline-flex';
      this.valStatusIcon.textContent = '✓';
      this.valStatusIcon.style.color = 'var(--color-success)';
    } else {
      this.btnNextQuestion.style.display = 'none';
      this.valStatusIcon.textContent = '';
    }

    this.tabBtnSolution.style.display = 'none';
  }

  formatMarkdownCode(text) {
    if (!text) return '';
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  switchTab(tabId) {
    this.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    this.tabPanes.forEach(p => p.classList.toggle('active', p.id === tabId));
  }

  switchExamTab(tabId) {
    this.examTabBtns.forEach(b => b.classList.toggle('active', b.dataset.examtab === tabId));
    document.getElementById('examScratchpadTab').classList.toggle('active', tabId === 'examScratchpadTab');
    document.getElementById('examTableExplorerTab').classList.toggle('active', tabId === 'examTableExplorerTab');
  }

  async runQuery() {
    const query = this.sqlEditor.value.trim();
    if (!query) {
      this.showToast('Please enter an SQL query first.');
      return;
    }

    this.switchTab('resultsTab');
    this.resultsTableContainer.innerHTML = '<div class="empty-state"><p>Executing query on sql_practice...</p></div>';
    this.queryStatusBanner.style.display = 'none';

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        this.queryStatusBanner.className = 'status-banner error';
        this.queryStatusBanner.style.display = 'flex';
        this.queryStatusBanner.innerHTML = `<span><strong>Error:</strong> ${data.error}</span><span>${data.executionTimeMs || 0} ms</span>`;
        this.resultsTableContainer.innerHTML = `<div class="empty-state"><p style="color:var(--color-danger)">${data.error}</p></div>`;
        this.resCountBadge.textContent = '0 rows';
        return;
      }

      this.queryStatusBanner.className = 'status-banner success';
      this.queryStatusBanner.style.display = 'flex';
      this.queryStatusBanner.innerHTML = `<span>Query executed successfully. ${data.rowCount} row(s) returned.</span><span>⚡ ${data.executionTimeMs} ms</span>`;
      this.resCountBadge.textContent = `${data.rowCount} rows`;

      this.renderDataTable(this.resultsTableContainer, data.columns, data.rows);
    } catch (err) {
      this.queryStatusBanner.className = 'status-banner error';
      this.queryStatusBanner.style.display = 'flex';
      this.queryStatusBanner.innerHTML = `<span><strong>Network Error:</strong> ${err.message}</span>`;
    }
  }

  async checkQuery() {
    const query = this.sqlEditor.value.trim();
    const q = this.getCurrentQuestion();
    if (!query || !q) {
      this.showToast('Please enter an SQL query to check.');
      return;
    }

    this.switchTab('validationTab');
    this.validationReport.innerHTML = '<div class="empty-state"><p>Evaluating your query against PostgreSQL...</p></div>';

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: q.id, userQuery: query })
      });
      const data = await res.json();

      if (data.passed) {
        this.passedQuestions.add(q.id);
        localStorage.setItem('sql_passed_questions', JSON.stringify([...this.passedQuestions]));

        this.valStatusIcon.textContent = '✓';
        this.valStatusIcon.style.color = 'var(--color-success)';
        this.btnNextQuestion.style.display = 'inline-flex';

        if (data.solutionQuery) {
          this.solutionQueryCode.textContent = data.solutionQuery;
          this.tabBtnSolution.style.display = 'inline-flex';
        }

        this.renderQuestionPillsState();

        this.validationReport.innerHTML = `
          <div class="validation-card passed">
            <div class="validation-header">
              <span style="font-size: 24px;">🎉</span>
              <h3>PASSED! Perfect SQL Query</h3>
            </div>
            <div class="validation-body">
              <p>${data.diagnostic}</p>
              <p><strong>Mastered Concept:</strong> <code>${data.concept || q.concept}</code></p>
            </div>
          </div>
        `;
        this.showToast('🎉 Question passed! Click Next Question to continue.');
      } else {
        this.valStatusIcon.textContent = '✗';
        this.valStatusIcon.style.color = 'var(--color-danger)';

        this.validationReport.innerHTML = `
          <div class="validation-card failed">
            <div class="validation-header">
              <span style="font-size: 24px;">⚠️</span>
              <h3>Query Needs Correction</h3>
            </div>
            <div class="validation-body">
              <p>${data.diagnostic}</p>
              ${data.hint ? `<div class="validation-hint-box"><strong>💡 Diagnostic Hint:</strong> ${data.hint}</div>` : ''}
            </div>
          </div>
        `;
      }
    } catch (err) {
      this.validationReport.innerHTML = `
        <div class="validation-card failed">
          <div class="validation-header">
            <h3>Validation Request Failed</h3>
          </div>
          <div class="validation-body"><p>${err.message}</p></div>
        </div>
      `;
    }
  }

  renderQuestionPillsState() {
    const topic = this.getCurrentTopic();
    if (!topic) return;
    const pills = this.questionPills.querySelectorAll('.q-pill');
    topic.questions.forEach((question, idx) => {
      if (pills[idx]) {
        pills[idx].classList.toggle('passed', this.passedQuestions.has(question.id));
      }
    });
  }

  async revealSolution() {
    const q = this.getCurrentQuestion();
    if (!q) return;
    if (!confirm('Are you sure you want to reveal the solution query?')) return;

    try {
      const res = await fetch('/api/solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: q.id })
      });
      const data = await res.json();
      if (data.solution) {
        this.solutionQueryCode.textContent = data.solution;
        this.tabBtnSolution.style.display = 'inline-flex';
        this.switchTab('solutionTab');
        this.showToast('Solution revealed.');
      }
    } catch (err) {
      this.showToast(`Error: ${err.message}`);
    }
  }

  nextQuestion() {
    const topic = this.getCurrentTopic();
    if (!topic) return;

    if (this.currentQuestionIndex < topic.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderQuestion();
    } else if (this.currentTopicIndex < this.curriculum.length - 1) {
      this.currentTopicIndex++;
      this.currentQuestionIndex = 0;
      this.topicSelect.value = this.currentTopicIndex;
      this.renderQuestion();
      this.showToast(`Advanced to: ${this.getCurrentTopic().topicTitle}`);
    } else {
      this.showToast('🏆 You have completed all questions in the curriculum!');
    }
  }

  // --------------------------------------------------------------------------
  // EXAM / MOCK PAPER ENGINE LOGIC (MULTI-CHAPTER & RANDOM DRAW)
  // --------------------------------------------------------------------------
  renderExamChapterSelector() {
    if (!this.examChaptersContainer) return;
    this.examChaptersContainer.innerHTML = '';

    // If no chapters selected yet, select all by default for immediate paper generation
    if (this.selectedExamChapterIds.size === 0) {
      this.chapters.forEach(ch => this.selectedExamChapterIds.add(ch.chapterId));
    }

    this.chapters.forEach(ch => {
      const card = document.createElement('div');
      const isSelected = this.selectedExamChapterIds.has(ch.chapterId);
      card.className = `chapter-checkbox-card ${isSelected ? 'selected' : ''}`;
      card.dataset.chapterId = ch.chapterId;

      card.innerHTML = `
        <div class="chapter-custom-checkbox">✓</div>
        <div class="chapter-card-info">
          <span class="chapter-card-title">${ch.chapterTitle}</span>
          <span class="chapter-card-desc">${ch.description}</span>
          <span class="chapter-card-badge">${ch.questionCount} Questions Available</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (this.selectedExamChapterIds.has(ch.chapterId)) {
          this.selectedExamChapterIds.delete(ch.chapterId);
          card.classList.remove('selected');
        } else {
          this.selectedExamChapterIds.add(ch.chapterId);
          card.classList.add('selected');
        }
        this.updateChapterSelectionSummary();
      });

      this.examChaptersContainer.appendChild(card);
    });

    this.updateChapterSelectionSummary();
  }

  updateChapterSelectionSummary() {
    const selectedCount = this.selectedExamChapterIds.size;
    let poolTotal = 0;
    this.chapters.forEach(ch => {
      if (this.selectedExamChapterIds.has(ch.chapterId)) {
        poolTotal += ch.questionCount;
      }
    });

    if (this.examSelectedCountSummary) {
      this.examSelectedCountSummary.textContent = `${selectedCount} of ${this.chapters.length} chapters selected`;
    }
    if (this.examSelectedPoolSummary) {
      this.examSelectedPoolSummary.textContent = `(${poolTotal} total questions available in pool)`;
    }
  }

  selectAllChapters() {
    this.chapters.forEach(ch => this.selectedExamChapterIds.add(ch.chapterId));
    if (this.examChaptersContainer) {
      this.examChaptersContainer.querySelectorAll('.chapter-checkbox-card').forEach(card => {
        card.classList.add('selected');
      });
    }
    this.updateChapterSelectionSummary();
    this.showToast('All chapters selected.');
  }

  deselectAllChapters() {
    this.selectedExamChapterIds.clear();
    if (this.examChaptersContainer) {
      this.examChaptersContainer.querySelectorAll('.chapter-checkbox-card').forEach(card => {
        card.classList.remove('selected');
      });
    }
    this.updateChapterSelectionSummary();
    this.showToast('Selection cleared.');
  }

  setExamScreenState(state) {
    this.examState = state;
    this.examSetupScreen.style.display = state === 'setup' ? 'flex' : 'none';
    this.examActiveScreen.style.display = state === 'active' ? 'grid' : 'none';
    this.examScorecardScreen.style.display = state === 'scorecard' ? 'block' : 'none';

    if (state === 'active') {
      this.examTimerPill.style.display = 'flex';
    } else {
      this.examTimerPill.style.display = 'none';
    }
  }

  async startExam() {
    const chapterIds = Array.from(this.selectedExamChapterIds);
    if (chapterIds.length === 0) {
      this.showToast('⚠️ Please select at least one chapter to generate an exam.');
      return;
    }
    await this.generateExam(chapterIds, this.examSelectedCount, this.examSelectedTime);
  }

  async generateExam(chapterIds, count, timeMinutes) {
    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterIds: Array.isArray(chapterIds) ? chapterIds : [chapterIds],
          questionCount: count,
          timeMinutes
        })
      });
      const examData = await res.json();
      if (!res.ok || examData.error) {
        this.showToast(`Failed to generate exam: ${examData.error}`);
        return;
      }

      this.currentExam = examData;
      this.currentExamQIndex = 0;
      this.examAnswers.clear();
      this.examFlags.clear();

      // Initialize answer templates
      this.currentExam.questions.forEach(q => {
        this.examAnswers.set(q.id, q.starterSql || '-- Write your query solution\nSELECT ');
      });

      // Start timer
      this.examTotalSeconds = timeMinutes * 60;
      this.examSecondsRemaining = this.examTotalSeconds;
      this.startExamTimer();

      this.setExamScreenState('active');
      this.renderActiveExamQuestion();
      this.showToast(`Exam paper generated for ${examData.chapterTitle}!`);
    } catch (err) {
      this.showToast(`Error: ${err.message}`);
    }
  }

  startExamTimer() {
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);

    this.updateTimerDisplay();
    this.examTimerInterval = setInterval(() => {
      this.examSecondsRemaining--;
      this.updateTimerDisplay();

      if (this.examSecondsRemaining <= 0) {
        clearInterval(this.examTimerInterval);
        this.showToast('⏰ Time has expired! Auto-submitting your exam...');
        this.submitExamFinal();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const mins = Math.floor(Math.max(0, this.examSecondsRemaining) / 60);
    const secs = Math.max(0, this.examSecondsRemaining) % 60;
    this.examTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const pct = (this.examSecondsRemaining / this.examTotalSeconds) * 100;
    this.examTimerBar.style.width = `${pct}%`;

    // Urgent state if under 2 minutes
    if (this.examSecondsRemaining <= 120) {
      this.examTimerPill.classList.add('urgent');
    } else {
      this.examTimerPill.classList.remove('urgent');
    }
  }

  getCurrentExamQuestion() {
    if (!this.currentExam || !this.currentExam.questions) return null;
    return this.currentExam.questions[this.currentExamQIndex] || null;
  }

  saveCurrentExamAnswerInMemory() {
    const q = this.getCurrentExamQuestion();
    if (q) {
      this.examAnswers.set(q.id, this.examSqlEditor.value);
      this.renderExamPalette();
    }
  }

  renderActiveExamQuestion() {
    if (!this.currentExam) return;
    const q = this.getCurrentExamQuestion();
    if (!q) return;

    this.examActiveChapterTitle.textContent = this.currentExam.chapterTitle;
    this.examQuestionProgressBadge.textContent = `Question ${this.currentExamQIndex + 1} of ${this.currentExam.questions.length}`;

    this.examQLevelBadge.textContent = `Level ${q.level}`;
    this.examQConceptBadge.textContent = q.concept;
    this.examQTitle.textContent = `Q${this.currentExamQIndex + 1}: ${q.title}`;
    this.examQDescription.innerHTML = this.formatMarkdownCode(q.description);

    this.examQTables.innerHTML = '';
    if (q.tables && q.tables.length > 0) {
      q.tables.forEach(tName => {
        const tag = document.createElement('span');
        tag.className = 'table-tag';
        tag.textContent = tName;
        tag.title = `Click to view ${tName} table schema & rows`;
        tag.addEventListener('click', () => {
          this.switchExamTab('examTableExplorerTab');
          this.loadExamTableData(tName);
        });
        this.examQTables.appendChild(tag);
      });
    }

    // Set editor content
    const existing = this.examAnswers.get(q.id);
    this.examSqlEditor.value = existing !== undefined ? existing : (q.starterSql || '-- Write your query solution\nSELECT ');

    this.chkFlagQuestion.checked = this.examFlags.has(q.id);
    this.btnPrevExamQ.disabled = this.currentExamQIndex === 0;
    this.btnNextExamQ.disabled = this.currentExamQIndex === this.currentExam.questions.length - 1;

    this.renderExamPalette();
  }

  renderExamPalette() {
    if (!this.currentExam) return;
    this.examQuestionPalette.innerHTML = '';

    this.currentExam.questions.forEach((q, idx) => {
      const pill = document.createElement('div');
      const isCurrent = idx === this.currentExamQIndex;
      const ans = (this.examAnswers.get(q.id) || '').trim();
      const isAnswered = ans.length > 0 && !ans.startsWith('-- Write');
      const isFlagged = this.examFlags.has(q.id);

      pill.className = `exam-palette-pill ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`;
      pill.textContent = idx + 1;
      pill.title = `Question ${idx + 1}: ${q.title}`;

      pill.addEventListener('click', () => {
        this.saveCurrentExamAnswerInMemory();
        this.currentExamQIndex = idx;
        this.renderActiveExamQuestion();
      });

      this.examQuestionPalette.appendChild(pill);
    });
  }

  async runExamScratchpad() {
    const query = this.examSqlEditor.value.trim();
    if (!query) {
      this.showToast('Please enter an SQL query first.');
      return;
    }

    this.switchExamTab('examScratchpadTab');
    this.examScratchTableContainer.innerHTML = '<div class="empty-state"><p>Running query on PostgreSQL...</p></div>';
    this.examScratchStatusBanner.style.display = 'none';

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        this.examScratchStatusBanner.className = 'status-banner error';
        this.examScratchStatusBanner.style.display = 'flex';
        this.examScratchStatusBanner.innerHTML = `<span><strong>Error:</strong> ${data.error}</span><span>${data.executionTimeMs || 0} ms</span>`;
        this.examScratchTableContainer.innerHTML = `<div class="empty-state"><p style="color:var(--color-danger)">${data.error}</p></div>`;
        this.examScratchCountBadge.textContent = '0 rows';
        return;
      }

      this.examScratchStatusBanner.className = 'status-banner success';
      this.examScratchStatusBanner.style.display = 'flex';
      this.examScratchStatusBanner.innerHTML = `<span>Query executed successfully. ${data.rowCount} row(s) returned.</span><span>⚡ ${data.executionTimeMs} ms</span>`;
      this.examScratchCountBadge.textContent = `${data.rowCount} rows`;

      this.renderDataTable(this.examScratchTableContainer, data.columns, data.rows);
    } catch (err) {
      this.examScratchStatusBanner.className = 'status-banner error';
      this.examScratchStatusBanner.style.display = 'flex';
      this.examScratchStatusBanner.innerHTML = `<span><strong>Error:</strong> ${err.message}</span>`;
    }
  }

  openSubmitModal() {
    this.saveCurrentExamAnswerInMemory();
    if (!this.currentExam) return;

    let answeredCount = 0;
    this.currentExam.questions.forEach(q => {
      const ans = (this.examAnswers.get(q.id) || '').trim();
      if (ans && !ans.startsWith('-- Write')) answeredCount++;
    });

    const total = this.currentExam.questions.length;
    this.examSubmitSummaryText.textContent = `You have answered ${answeredCount} of ${total} question(s). Are you ready to finalize and receive your grade?`;
    this.examSubmitModal.style.display = 'flex';
  }

  async submitExamFinal() {
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);
    this.saveCurrentExamAnswerInMemory();

    const timeSpentSeconds = this.examTotalSeconds - this.examSecondsRemaining;
    const answersPayload = [];

    this.currentExam.questions.forEach(q => {
      answersPayload.push({
        questionId: q.id,
        userQuery: this.examAnswers.get(q.id) || ''
      });
    });

    try {
      const res = await fetch('/api/exam/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: this.currentExam.examId,
          answers: answersPayload,
          timeSpentSeconds
        })
      });
      const report = await res.json();
      this.renderScorecard(report);
    } catch (err) {
      this.showToast(`Error grading exam: ${err.message}`);
    }
  }

  renderScorecard(report) {
    this.setExamScreenState('scorecard');

    // Letter Grade Badge Styling
    this.scorecardGradeBadge.textContent = report.letterGrade;
    this.scorecardGradeBadge.className = 'grade-badge-large';
    if (report.letterGrade === 'F') {
      this.scorecardGradeBadge.classList.add('grade-f');
      this.scorecardHeading.textContent = 'Keep Practicing!';
      this.scorecardSubheading.textContent = 'Review the detailed solution diffs below to master these concepts.';
    } else if (report.letterGrade === 'A' || report.letterGrade === 'A+') {
      this.scorecardHeading.textContent = '🎉 Outstanding Performance!';
      this.scorecardSubheading.textContent = `You demonstrated strong SQL mastery for ${this.currentExam.chapterTitle}.`;
    } else {
      this.scorecardHeading.textContent = 'Good Job!';
      this.scorecardSubheading.textContent = 'You passed several questions. Check the solutions below to improve.';
    }

    this.scorecardScorePct.textContent = `${report.scorePercentage}%`;
    this.scorecardQuestionsPassed.textContent = `${report.passedCount} / ${report.totalQuestions}`;

    const spentMins = Math.floor(report.timeSpentSeconds / 60);
    const spentSecs = report.timeSpentSeconds % 60;
    this.scorecardTimeElapsed.textContent = `${spentMins}m ${spentSecs}s`;

    // Render Question Breakdown List
    this.scorecardQuestionsList.innerHTML = '';
    report.questionResults.forEach((qRes) => {
      const card = document.createElement('div');
      card.className = `review-question-card ${qRes.passed ? 'passed' : 'failed'}`;

      card.innerHTML = `
        <div class="review-card-header">
          <div class="review-q-title">
            <span>${qRes.passed ? '✅' : '❌'} Question ${qRes.questionNumber}: ${qRes.title}</span>
          </div>
          <span class="badge ${qRes.passed ? 'badge-level' : 'badge-concept'}">
            ${qRes.passed ? 'PASSED (100%)' : 'NEEDS REVISION'}
          </span>
        </div>

        <div class="review-card-body">
          <p style="font-size: 13.5px; color: var(--text-secondary);">${qRes.description ? this.formatMarkdownCode(qRes.description) : ''}</p>
          <div class="validation-hint-box" style="margin-bottom: 8px;">
            <strong>Evaluation:</strong> ${qRes.diagnostic}
          </div>

          <div>
            <span class="section-label">Your Submitted SQL:</span>
            <pre class="review-sql-box"><code>${this.escapeHtml(qRes.userQuery)}</code></pre>
          </div>

          <div>
            <span class="section-label">Canonical Solution Query:</span>
            <pre class="solution-sql-box"><code>${this.escapeHtml(qRes.solutionQuery || '')}</code></pre>
          </div>

          <p style="font-size: 12px; color: var(--text-muted);">
            <strong>Core Concept:</strong> <code>${qRes.concept || 'SQL Standard'}</code>
          </p>
        </div>
      `;

      this.scorecardQuestionsList.appendChild(card);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // TABLE EXPLORER LOGIC
  // --------------------------------------------------------------------------
  renderExplorerSidebar() {
    this.tableList.innerHTML = '';
    this.tables.forEach(table => {
      const btn = document.createElement('button');
      btn.className = `explorer-table-btn ${this.currentExplorerTableName.textContent === table.name ? 'active' : ''}`;
      btn.innerHTML = `<span>${table.name}</span><span class="table-row-count-badge">${table.rowCount}</span>`;
      btn.addEventListener('click', () => this.loadTableData(table.name));
      this.tableList.appendChild(btn);
    });
  }

  renderExamExplorerSidebar() {
    this.examTableList.innerHTML = '';
    this.tables.forEach(table => {
      const btn = document.createElement('button');
      btn.className = 'explorer-table-btn';
      btn.innerHTML = `<span>${table.name}</span><span class="table-row-count-badge">${table.rowCount}</span>`;
      btn.addEventListener('click', () => this.loadExamTableData(table.name));
      this.examTableList.appendChild(btn);
    });
  }

  async loadTableData(tableName) {
    const tableMeta = this.tables.find(t => t.name === tableName);
    if (!tableMeta) return;

    this.currentExplorerTableName.textContent = tableName;
    this.currentExplorerRowCount.textContent = `(${tableMeta.rowCount} total rows)`;

    document.querySelectorAll('.explorer-table-btn').forEach(b => {
      b.classList.toggle('active', b.querySelector('span').textContent === tableName);
    });

    this.explorerColumnsView.innerHTML = '';
    tableMeta.columns.forEach(col => {
      const pill = document.createElement('span');
      pill.className = `schema-pill ${col.isPk ? 'is-pk' : ''} ${col.fk ? 'is-fk' : ''}`;
      pill.innerHTML = `${col.isPk ? '🔑 ' : ''}${col.fk ? '🔗 ' : ''}<strong>${col.name}</strong> <span class="type-tag">${col.type}</span>`;
      if (col.fk) pill.title = `FK -> ${col.fk.foreign_table_name}(${col.fk.foreign_column_name})`;
      this.explorerColumnsView.appendChild(pill);
    });

    this.explorerDataGrid.innerHTML = '<div class="empty-state"><p>Loading records...</p></div>';
    try {
      const res = await fetch(`/api/table/${tableName}`);
      const data = await res.json();
      this.renderDataTable(this.explorerDataGrid, data.columns, data.rows);
    } catch (err) {
      this.explorerDataGrid.innerHTML = `<div class="empty-state"><p style="color:var(--color-danger)">Error: ${err.message}</p></div>`;
    }
  }

  async loadExamTableData(tableName) {
    const tableMeta = this.tables.find(t => t.name === tableName);
    if (!tableMeta) return;

    this.examExplorerColumnsView.innerHTML = '';
    tableMeta.columns.forEach(col => {
      const pill = document.createElement('span');
      pill.className = `schema-pill ${col.isPk ? 'is-pk' : ''} ${col.fk ? 'is-fk' : ''}`;
      pill.innerHTML = `${col.isPk ? '🔑 ' : ''}${col.fk ? '🔗 ' : ''}<strong>${col.name}</strong> <span class="type-tag">${col.type}</span>`;
      this.examExplorerColumnsView.appendChild(pill);
    });

    this.examExplorerDataGrid.innerHTML = '<div class="empty-state"><p>Loading records...</p></div>';
    try {
      const res = await fetch(`/api/table/${tableName}`);
      const data = await res.json();
      this.renderDataTable(this.examExplorerDataGrid, data.columns, data.rows);
    } catch (err) {
      this.examExplorerDataGrid.innerHTML = `<div class="empty-state"><p style="color:var(--color-danger)">Error: ${err.message}</p></div>`;
    }
  }

  renderDataTable(container, columns, rows) {
    if (!columns || columns.length === 0 || !rows || rows.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📂</span><p>0 rows returned</p></div>';
      return;
    }

    let html = '<table class="data-table"><thead><tr>';
    columns.forEach(col => {
      html += `<th>${col}</th>`;
    });
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        const val = row[col];
        if (val === null || val === undefined) {
          html += '<td class="null-value">NULL</td>';
        } else {
          html += `<td>${this.escapeHtml(String(val))}</td>`;
        }
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  async resetDatabase() {
    if (!confirm('Reset sql_practice database back to clean initial seed data?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await this.loadTables();
        this.showToast('Database reset and re-seeded successfully!');
      }
    } catch (err) {
      this.showToast(`Failed to reset: ${err.message}`);
    }
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showToast(msg) {
    this.toast.textContent = msg;
    this.toast.style.display = 'block';
    setTimeout(() => {
      this.toast.style.display = 'none';
    }, 3500);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SqlStudioApp();
});

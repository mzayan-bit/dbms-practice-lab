// ==============================================================================
// SQL Learning Studio — Client-Side Reactive Controller
// ==============================================================================

class SqlStudioApp {
  constructor() {
    this.curriculum = [];
    this.tables = [];
    this.currentTopicIndex = 0;
    this.currentQuestionIndex = 0;
    this.passedQuestions = new Set(JSON.parse(localStorage.getItem('sql_passed_questions') || '[]'));

    this.initElements();
    this.initEventListeners();
    this.boot();
  }

  initElements() {
    // Dropdowns & Nav
    this.topicSelect = document.getElementById('topicSelect');
    this.questionPills = document.getElementById('questionPills');

    // Question display
    this.qLevelBadge = document.getElementById('qLevelBadge');
    this.qConceptBadge = document.getElementById('qConceptBadge');
    this.qTitle = document.getElementById('qTitle');
    this.qDescription = document.getElementById('qDescription');
    this.qTables = document.getElementById('qTables');

    // Hints
    this.hint1Text = document.getElementById('hint1Text');
    this.hint2Text = document.getElementById('hint2Text');
    this.hint3Text = document.getElementById('hint3Text');
    this.hint1Details = document.getElementById('hint1Details');
    this.hint2Details = document.getElementById('hint2Details');
    this.hint3Details = document.getElementById('hint3Details');
    this.btnCopySkeleton = document.getElementById('btnCopySkeleton');

    // Actions
    this.btnRevealSolution = document.getElementById('btnRevealSolution');
    this.btnNextQuestion = document.getElementById('btnNextQuestion');
    this.btnResetDb = document.getElementById('btnResetDb');

    // Editor
    this.sqlEditor = document.getElementById('sqlEditor');
    this.btnRunQuery = document.getElementById('btnRunQuery');
    this.btnCheckQuery = document.getElementById('btnCheckQuery');
    this.btnClearEditor = document.getElementById('btnClearEditor');

    // Tabs & Results
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    this.resCountBadge = document.getElementById('resCountBadge');
    this.valStatusIcon = document.getElementById('valStatusIcon');
    this.resultsTableContainer = document.getElementById('resultsTableContainer');
    this.queryStatusBanner = document.getElementById('queryStatusBanner');
    this.validationReport = document.getElementById('validationReport');

    // Table Explorer
    this.tableList = document.getElementById('tableList');
    this.currentExplorerTableName = document.getElementById('currentExplorerTableName');
    this.currentExplorerRowCount = document.getElementById('currentExplorerRowCount');
    this.explorerColumnsView = document.getElementById('explorerColumnsView');
    this.explorerDataGrid = document.getElementById('explorerDataGrid');

    // Solution Tab
    this.tabBtnSolution = document.getElementById('tabBtnSolution');
    this.solutionQueryCode = document.getElementById('solutionQueryCode');
    this.btnCopySolution = document.getElementById('btnCopySolution');

    // Toast
    this.toast = document.getElementById('toast');
  }

  initEventListeners() {
    // Topic Selector
    this.topicSelect.addEventListener('change', (e) => {
      this.currentTopicIndex = parseInt(e.target.value, 10);
      this.currentQuestionIndex = 0;
      this.renderQuestion();
    });

    // Editor Buttons
    this.btnRunQuery.addEventListener('click', () => this.runQuery());
    this.btnCheckQuery.addEventListener('click', () => this.checkQuery());
    this.btnClearEditor.addEventListener('click', () => {
      this.sqlEditor.value = '';
      this.sqlEditor.focus();
    });

    // Keyboard Shortcuts (Ctrl/Cmd + Enter to run or check)
    this.sqlEditor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.runQuery();
        } else {
          this.checkQuery();
        }
      }
      // Tab key support
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
        const snippet = btn.dataset.sql;
        const start = this.sqlEditor.selectionStart;
        const end = this.sqlEditor.selectionEnd;
        const text = this.sqlEditor.value;
        this.sqlEditor.value = text.substring(0, start) + snippet + text.substring(end);
        this.sqlEditor.selectionStart = this.sqlEditor.selectionEnd = start + snippet.length;
        this.sqlEditor.focus();
      });
    });

    // Hints
    this.btnCopySkeleton.addEventListener('click', () => {
      const q = this.getCurrentQuestion();
      if (q && q.hint3) {
        this.sqlEditor.value = q.hint3;
        this.sqlEditor.focus();
        this.showToast('Query outline inserted into editor!');
      }
    });

    // Solution Reveal
    this.btnRevealSolution.addEventListener('click', () => this.revealSolution());
    this.btnCopySolution.addEventListener('click', () => {
      this.sqlEditor.value = this.solutionQueryCode.textContent;
      this.sqlEditor.focus();
      this.showToast('Solution copied to editor!');
    });

    // Next Question
    this.btnNextQuestion.addEventListener('click', () => this.nextQuestion());

    // Reset Database
    this.btnResetDb.addEventListener('click', () => this.resetDatabase());

    // Tabs
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });
  }

  async boot() {
    try {
      await Promise.all([this.loadCurriculum(), this.loadTables()]);
      this.renderCurriculumDropdown();
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

  async loadTables() {
    const res = await fetch('/api/tables');
    const data = await res.json();
    this.tables = data.tables;
    this.renderExplorerSidebar();
  }

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

    // Render Question Pills
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

    // Question metadata & text
    this.qLevelBadge.textContent = `Level ${q.level}`;
    this.qConceptBadge.textContent = q.concept;
    this.qTitle.textContent = `Q${q.number}: ${q.title}`;
    this.qDescription.innerHTML = this.formatMarkdownCode(q.description);

    // Target Table Tags
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

    // Starter SQL in Editor
    this.sqlEditor.value = q.starterSql || '-- Write your SQL query here...\nSELECT ';

    // Reset hints & accordions
    this.hint1Text.textContent = q.hint1 || 'No conceptual hint available.';
    this.hint2Text.textContent = q.hint2 || 'No clause hint available.';
    this.hint3Text.textContent = q.hint3 || 'No outline available.';
    this.hint1Details.open = false;
    this.hint2Details.open = false;
    this.hint3Details.open = false;

    // Next Question Button state
    if (this.passedQuestions.has(q.id)) {
      this.btnNextQuestion.style.display = 'inline-flex';
      this.valStatusIcon.textContent = '✓';
      this.valStatusIcon.style.color = 'var(--color-success)';
    } else {
      this.btnNextQuestion.style.display = 'none';
      this.valStatusIcon.textContent = '';
    }

    // Hide solution tab by default
    this.tabBtnSolution.style.display = 'none';
  }

  formatMarkdownCode(text) {
    if (!text) return '';
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  switchTab(tabId) {
    this.tabBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    this.tabPanes.forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
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

        // Unlock solution tab
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
          <div class="validation-body">
            <p>${err.message}</p>
          </div>
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
      this.showToast(`Advanced to Topic: ${this.getCurrentTopic().topicTitle}`);
    } else {
      this.showToast('🏆 You have completed all questions in the entire curriculum!');
    }
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

  renderExplorerSidebar() {
    this.tableList.innerHTML = '';
    this.tables.forEach(table => {
      const btn = document.createElement('button');
      btn.className = `explorer-table-btn ${this.currentExplorerTableName.textContent === table.name ? 'active' : ''}`;
      btn.innerHTML = `<span>${table.name}</span><span class="table-row-count-badge">${table.rowCount}</span>`;
      btn.addEventListener('click', () => {
        this.loadTableData(table.name);
      });
      this.tableList.appendChild(btn);
    });
  }

  async loadTableData(tableName) {
    const tableMeta = this.tables.find(t => t.name === tableName);
    if (!tableMeta) return;

    this.currentExplorerTableName.textContent = tableName;
    this.currentExplorerRowCount.textContent = `(${tableMeta.rowCount} total rows)`;

    // Update active button state
    document.querySelectorAll('.explorer-table-btn').forEach(b => {
      b.classList.toggle('active', b.querySelector('span').textContent === tableName);
    });

    // Render Schema Columns
    this.explorerColumnsView.innerHTML = '';
    tableMeta.columns.forEach(col => {
      const pill = document.createElement('span');
      pill.className = `schema-pill ${col.isPk ? 'is-pk' : ''} ${col.fk ? 'is-fk' : ''}`;
      pill.innerHTML = `
        ${col.isPk ? '🔑 ' : ''}${col.fk ? '🔗 ' : ''}
        <strong>${col.name}</strong> <span class="type-tag">${col.type}</span>
      `;
      if (col.fk) {
        pill.title = `Foreign Key -> ${col.fk.foreign_table_name}(${col.fk.foreign_column_name})`;
      }
      this.explorerColumnsView.appendChild(pill);
    });

    // Fetch Rows
    this.explorerDataGrid.innerHTML = '<div class="empty-state"><p>Loading records...</p></div>';
    try {
      const res = await fetch(`/api/table/${tableName}`);
      const data = await res.json();
      this.renderDataTable(this.explorerDataGrid, data.columns, data.rows);
    } catch (err) {
      this.explorerDataGrid.innerHTML = `<div class="empty-state"><p style="color:var(--color-danger)">Error loading rows: ${err.message}</p></div>`;
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

  escapeHtml(str) {
    return str
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

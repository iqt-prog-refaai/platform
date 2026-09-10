// ============================================
// profile.js — Student profile & quiz history
// Depends on: api.js, state.js, utils.js
// ============================================

async function renderProfile() {
  $('profileName').textContent = state.user.name;
  $('profileRole').textContent = translateRole(state.user.role);
  $('profileAvatar').textContent = state.user.name.charAt(0).toUpperCase();

  const historyContainer = $('quizHistory');
  historyContainer.innerHTML = '<div class="loading-text" style="text-align:center;padding:40px;">جاري تحميل السجل...</div>';

  // Build title lookup: quiz_id → material title
  function buildTitleMap() {
    const matById = {};
    (state.allMaterials || []).forEach(m => { matById[m.material_id] = m.title; });
    const titleByQuizId = {};
    Object.entries(state.quizzes || {}).forEach(([matId, quiz]) => {
      titleByQuizId[quiz.quiz_id] = matById[matId] || quiz.title || 'اختبار';
    });
    return { matById, titleByQuizId };
  }

  function scoreColor(score, max) {
    if (!max) return 'var(--text-muted)';
    const pct = score / max;
    if (pct >= 0.7) return 'var(--success)';
    if (pct >= 0.5) return 'var(--warning)';
    return 'var(--danger)';
  }

  function renderAttempts(attempts, titleByQuizId, matById) {
    if (!attempts.length) {
      return '<div class="glass text-center" style="padding: 40px;"><p>لا توجد محاولات اختبار بعد.</p></div>';
    }
    return attempts.map(att => {
      const title = titleByQuizId[att.quiz_id] || matById?.[att.material_id] || 'اختبار';
      const color = att.is_graded ? scoreColor(att.score, att.max_score) : 'var(--warning)';
      const pct   = att.is_graded && att.max_score ? Math.round((att.score / att.max_score) * 100) : null;
      return `
        <div class="glass" style="padding: 20px; margin-bottom: 12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="margin-bottom: 4px;">${title}</h4>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${formatDate(att.attempt_date)}</p>
            ${!att.is_graded ? `<span style="font-size:0.8rem; color:var(--warning); display:inline-flex; align-items:center; gap:4px; margin-top:4px;">${ICONS.clock} بانتظار التصحيح</span>` : ''}
          </div>
          <div style="text-align:center; min-width:72px;">
            <div style="font-size:1.6rem; font-weight:800; color:${color}; line-height:1;">
              ${att.is_graded ? `${att.score}<span style="font-size:0.9rem;font-weight:500;">/${att.max_score}</span>` : '—'}
            </div>
            ${pct !== null ? `<div style="font-size:0.78rem; color:${color}; margin-top:2px;">${pct}%</div>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  if (MOCK_MODE) {
    const { titleByQuizId, matById } = buildTitleMap();
    const mockAttempts = [
      { quiz_id: 'quiz1', score: 8, max_score: 10, is_graded: true,  attempt_date: new Date(Date.now() - 172800000).toISOString() },
      { quiz_id: 'quiz2', score: 3, max_score: 5,  is_graded: false, attempt_date: new Date().toISOString() }
    ];
    historyContainer.innerHTML = renderAttempts(mockAttempts, titleByQuizId, matById);
    return;
  }

  try {
    const res = await API.get('getQuizAttempts', { username: state.user.username, quizId: '' });
    if (!res.success) {
      historyContainer.innerHTML = '<div class="glass text-center" style="padding: 40px;"><p>لا توجد محاولات اختبار بعد.</p></div>';
      return;
    }

    // If allMaterials isn't populated yet (e.g. student navigated directly to profile), load it
    if (!state.allMaterials?.length) {
      await loadStudentData();
    }

    const { titleByQuizId, matById } = buildTitleMap();
    historyContainer.innerHTML = renderAttempts(res.attempts || [], titleByQuizId, matById);

  } catch(err) {
    historyContainer.innerHTML = '<p style="color:var(--danger);">خطأ في تحميل السجل.</p>';
    console.error(err);
  }
}

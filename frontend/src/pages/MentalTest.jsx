import React, { useState, useEffect } from 'react';

// PHQ-9, GAD-7, MDQ (mood swings), ISI (insomnia)
// Added: C-SSRS (suicide risk screener), AUDIT (alcohol use), WHO-5 (well-being), DASS-21 (depression/anxiety/stress)
const PHQ9 = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way'
];

const GAD7 = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
];

// Mood Disorder Questionnaire (MDQ) - screening for bipolar spectrum (yes/no items)
const MDQ = [
  'Have you ever had a period of time when you felt so good or so hyper that other people thought you were not your normal self or you were so hyper you got into trouble?',
  'During these periods did you feel much more self-confident than usual?',
  'Did you need much less sleep than usual and still not feel tired?',
  'Were you much more talkative or spoke faster than usual?',
  'Did your thoughts race or did you have more ideas than usual?',
  'Did you find yourself being more easily distracted?',
  'Did you do things that were unusual for you or that other people might have thought were risky?',
  'Did these periods of being "up" happen at the same time as problems in your life (work, school, relationships)?',
  'Have these experiences caused moderate or serious problems for you?'
];

// Insomnia Severity Index (ISI) - 7 items, score 0-4
const ISI = [
  'Difficulty falling asleep',
  'Difficulty staying asleep',
  'Problems waking up too early',
  'How satisfied/dissatisfied are you with your current sleep pattern?',
  'How noticeable to others do you think your sleep problems are in terms of impairing the quality of your life?',
  'How worried/distressed are you about your current sleep problem?',
  'To what extent do you think your sleep problem interferes with your daily functioning?'
];

// C-SSRS (brief version) — yes/no items. Any positive flags the screener.
const CSSRS = [
  'Wish to be dead (Have you wished you were dead?)',
  'Non-specific active suicidal thoughts (Have you had any thoughts of killing yourself?)',
  'Active suicidal ideation with some intent to act',
  'Active suicidal ideation with specific plan and intent',
  'Any lifetime suicidal behavior (attempts or preparatory acts)'
];

// AUDIT (10 items) — simplified numeric 0-4 responses for most items
const AUDIT = [
  'How often do you have a drink containing alcohol?',
  'How many drinks containing alcohol do you have on a typical day when you are drinking?',
  'How often do you have six or more drinks on one occasion?',
  'How often during the last year have you found that you were not able to stop drinking once you had started?',
  'How often during the last year have you failed to do what was normally expected from you because of drinking?',
  'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?',
  'How often during the last year have you had a feeling of guilt or remorse after drinking?',
  'How often during the last year have you been unable to remember what happened the night before because you had been drinking?',
  'Have you or someone else been injured as a result of your drinking?',
  'Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?'
];

// WHO-5 Well-being index — 5 items, 0-5 each
const WHO5 = [
  'I have felt cheerful and in good spirits',
  'I have felt calm and relaxed',
  'I have felt active and vigorous',
  'I woke up feeling fresh and rested',
  'My daily life has been filled with things that interest me'
];

// DASS-21 items (21 total, 0-3 each). We'll compute three subscales (7 items each).
const DASS21 = [
  'I found it hard to wind down',
  'I was aware of dryness of my mouth',
  'I couldn’t seem to experience any positive feeling at all',
  'I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)',
  'I found it difficult to work up the initiative to do things',
  'I tended to over-react to situations',
  'I experienced trembling (e.g., in the hands)',
  'I felt I was using a lot of nervous energy',
  'I was worried about situations in which I might panic and make a fool of myself',
  'I felt that I had nothing to look forward to',
  'I found myself getting agitated',
  'I found it difficult to relax',
  'I felt down-hearted and blue',
  'I was intolerant of anything that kept me from getting on with what I was doing',
  'I felt I was close to panic',
  'I was unable to become enthusiastic about anything',
  'I felt I wasn’t worth much as a person',
  'I felt that I was rather touchy',
  'I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)',
  'I felt scared without any good reason',
  'I felt that life was meaningless'
];

function ScoreCard({ title, score, label }) {
  return (
    <div style={{ background: 'white', padding: 12, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ marginTop: 6 }}>{label} — score: {score}</div>
    </div>
  );
}

function MentalTest() {
  const [active, setActive] = useState('phq9');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  let questions = PHQ9;
  if (active === 'phq9') questions = PHQ9;
  else if (active === 'gad7') questions = GAD7;
  else if (active === 'mdq') questions = MDQ;
  else if (active === 'isi') questions = ISI;
  else if (active === 'cssrs') questions = CSSRS;
  else if (active === 'audit') questions = AUDIT;
  else if (active === 'who5') questions = WHO5;
  else if (active === 'dass21') questions = DASS21;

  const handleChange = (i, value) => {
    // For MDQ use boolean/0-1; for others numeric
    // C-SSRS and MDQ are stored as 0/1 booleans
    if (active === 'mdq' || active === 'cssrs') {
      setAnswers((s) => ({ ...s, [i]: value ? 1 : 0 }));
      return;
    }
    // DASS-21: 0-3
    setAnswers((s) => ({ ...s, [i]: Number(value) }));
  };

  const computeScore = () => {
    // MDQ: count yes answers
    if (active === 'mdq') {
      return MDQ.reduce((acc, _, i) => acc + (Number(answers[i] || 0)), 0);
    }
    // C-SSRS: flag positives (return count)
    if (active === 'cssrs') {
      return CSSRS.reduce((acc, _, i) => acc + (Number(answers[i] || 0)), 0);
    }
    // AUDIT: 10 items 0-4
    if (active === 'audit') {
      return AUDIT.reduce((acc, _, i) => acc + (Number(answers[i] || 0)), 0);
    }
    // WHO-5: 5 items 0-5
    if (active === 'who5') {
      return WHO5.reduce((acc, _, i) => acc + (Number(answers[i] || 0)), 0);
    }
    // DASS-21: 21 items 0-3
    if (active === 'dass21') {
      return DASS21.reduce((acc, _, i) => acc + (Number(answers[i] || 0)), 0);
    }
    // PHQ-9/GAD-7/ISI fallback
    return questions.reduce((acc, _, i) => acc + (Number(answers[i] || 0)), 0);
  };

  const severityLabel = (test, score) => {
    if (test === 'phq9') {
      if (score >= 20) return 'Severe depression';
      if (score >= 15) return 'Moderately severe';
      if (score >= 10) return 'Moderate';
      if (score >= 5) return 'Mild';
      return 'Minimal';
    }
    if (test === 'gad7') {
      if (score >= 15) return 'Severe anxiety';
      if (score >= 10) return 'Moderate anxiety';
      if (score >= 5) return 'Mild anxiety';
      return 'Minimal';
    }
    if (test === 'mdq') {
      if (score >= 7) return '7+ symptoms — possible bipolar spectrum (screening positive)';
      if (score >= 4) return 'Subthreshold mood symptoms';
      return 'Few or no mood-elevation symptoms';
    }
    // ISI
    if (test === 'isi') {
      if (score >= 22) return 'Severe insomnia';
      if (score >= 15) return 'Moderate insomnia';
      if (score >= 8) return 'Subthreshold insomnia';
      return 'No clinically significant insomnia';
    }
    if (test === 'cssrs') {
      if (score <= 0) return 'No recent suicidal ideation or behavior reported';
      return 'Positive screen — urgent follow-up recommended';
    }
    if (test === 'audit') {
      if (score >= 20) return 'High risk (probable dependence)';
      if (score >= 16) return 'Harmful use — likely alcohol problems';
      if (score >= 8) return 'Hazardous or harmful alcohol use';
      return 'Low risk';
    }
    if (test === 'who5') {
      // WHO-5 scaled 0-25; multiply by 4 -> 0-100
      const pct = score * 4;
      if (pct <= 28) return `Poor well-being (possible depression), WHO-5 score ${pct}%`;
      if (pct < 50) return `Low well-being (monitor), WHO-5 score ${pct}%`;
      return `Good well-being, WHO-5 score ${pct}%`;
    }
    if (test === 'dass21') {
      // We'll compute subscale labels elsewhere — placeholder
      return 'See subscale breakdown below';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = computeScore();
    const label = severityLabel(active, score);
    const payloadBase = {
      test: (function () {
        switch (active) {
          case 'phq9': return 'PHQ-9';
          case 'gad7': return 'GAD-7';
          case 'mdq': return 'MDQ';
          case 'isi': return 'ISI';
          case 'cssrs': return 'C-SSRS';
          case 'audit': return 'AUDIT';
          case 'who5': return 'WHO-5';
          case 'dass21': return 'DASS-21';
          default: return active;
        }
      })(),
      score,
      label,
      taken_at: new Date().toISOString(),
      answers: { ...answers }
    };

    // Enrich results for special tests
    let payload = { ...payloadBase };
    if (active === 'who5') {
      const pct = payload.score * 4;
      payload = { ...payload, who5_pct: pct };
    }
    if (active === 'dass21') {
      // 3 subscales each 7 items. We'll compute raw sums and scaled (x2)
      const depressionIdx = [2,5,10,16,17,12,18]; // indices (0-based) selected from DASS21 mapping (approx)
      const anxietyIdx = [1,3,6,8,14,19,20];
      const stressIdx = [0,4,7,9,11,13,15];
      const sub = { depression: 0, anxiety: 0, stress: 0 };
      depressionIdx.forEach((i) => { sub.depression += Number(answers[i] || 0); });
      anxietyIdx.forEach((i) => { sub.anxiety += Number(answers[i] || 0); });
      stressIdx.forEach((i) => { sub.stress += Number(answers[i] || 0); });
      // scale
      const scaled = { depression: sub.depression * 2, anxiety: sub.anxiety * 2, stress: sub.stress * 2 };
      payload = { ...payload, subscale_raw: sub, subscale_scaled: scaled };
    }
    if (active === 'cssrs') {
      const positiveCount = payload.score;
      payload = { ...payload, flagged: positiveCount > 0 };
      if (positiveCount > 0) {
        payload.escalation = {
          message: 'Positive suicide risk screen. If you are in immediate danger, call your local emergency number or a crisis line. See resources below.',
          resources: [
            { label: 'Local emergency services', url: '' },
            { label: 'National Suicide Prevention Lifeline (USA): 988', url: '' }
          ]
        };
      }
    }

    // persist last and history
    try { localStorage.setItem('last_mental_tests', JSON.stringify(payload)); } catch (e) { void e; }
    saveToHistory(payload);
    setResult(payload);
  };

  const saveToHistory = (item) => {
    try {
      const raw = localStorage.getItem('mental_tests_history');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(item);
      const trimmed = arr.slice(0, 50);
      localStorage.setItem('mental_tests_history', JSON.stringify(trimmed));
      setHistory(trimmed);
    } catch (e) { console.warn('history save failed', e); }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mental_tests_history');
      setHistory(raw ? JSON.parse(raw) : []);
      const last = localStorage.getItem('last_mental_tests');
      if (last) setResult(JSON.parse(last));
    } catch (err) { console.warn('load mental tests history failed', err); }
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Mental Health Tests</h1>

      <p style={{ color: '#666' }}>Quick self-assessments (screening tools). These are not diagnostic — they are informational only. If you are in crisis, contact local emergency services.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <button onClick={() => { setActive('phq9'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'phq9' ? '#2563eb' : '#f3f4f6', color: active === 'phq9' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>PHQ-9</button>
        <button onClick={() => { setActive('gad7'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'gad7' ? '#2563eb' : '#f3f4f6', color: active === 'gad7' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>GAD-7</button>
        <button onClick={() => { setActive('mdq'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'mdq' ? '#2563eb' : '#f3f4f6', color: active === 'mdq' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>MDQ</button>
        <button onClick={() => { setActive('isi'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'isi' ? '#2563eb' : '#f3f4f6', color: active === 'isi' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>ISI</button>
        <button onClick={() => { setActive('cssrs'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'cssrs' ? '#dc2626' : '#f3f4f6', color: active === 'cssrs' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>C-SSRS</button>
        <button onClick={() => { setActive('audit'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'audit' ? '#2563eb' : '#f3f4f6', color: active === 'audit' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>AUDIT</button>
        <button onClick={() => { setActive('who5'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'who5' ? '#2563eb' : '#f3f4f6', color: active === 'who5' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>WHO-5</button>
        <button onClick={() => { setActive('dass21'); setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: active === 'dass21' ? '#2563eb' : '#f3f4f6', color: active === 'dass21' ? 'white' : '#111', border: 'none', borderRadius: 8 }}>DASS-21</button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 18, background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 600 }}>{i + 1}. {q}</label>
            <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Render controls depending on test type */}
              {(active === 'mdq' || active === 'cssrs') ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={Boolean(answers[i])} onChange={(e) => handleChange(i, e.target.checked)} />
                  <span style={{ fontSize: 13 }}>{answers[i] ? 'Yes' : 'No'}</span>
                </label>
              ) : (active === 'who5') ? (
                // WHO-5: 0 (At no time) to 5 (All of the time)
                [0,1,2,3,4,5].map((val) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name={`q-${i}`} value={val} checked={Number(answers[i] || 0) === val} onChange={() => handleChange(i, val)} />
                    <span style={{ fontSize: 13 }}>{val}</span>
                  </label>
                ))
              ) : (active === 'isi') ? (
                [0,1,2,3,4].map((val) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name={`q-${i}`} value={val} checked={Number(answers[i] || 0) === val} onChange={() => handleChange(i, val)} />
                    <span style={{ fontSize: 13 }}>{val}</span>
                  </label>
                ))
              ) : (active === 'dass21') ? (
                [0,1,2,3].map((val) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name={`q-${i}`} value={val} checked={Number(answers[i] || 0) === val} onChange={() => handleChange(i, val)} />
                    <span style={{ fontSize: 13 }}>{val}</span>
                  </label>
                ))
              ) : (active === 'audit') ? (
                [0,1,2,3,4].map((val) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name={`q-${i}`} value={val} checked={Number(answers[i] || 0) === val} onChange={() => handleChange(i, val)} />
                    <span style={{ fontSize: 13 }}>{val}</span>
                  </label>
                ))
              ) : (
                // PHQ-9 / GAD-7 default 0-3
                [0,1,2,3].map((val) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name={`q-${i}`} value={val} checked={Number(answers[i] || 0) === val} onChange={() => handleChange(i, val)} />
                    <span style={{ fontSize: 13 }}>{val}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8 }}>Submit</button>
          <button type="button" onClick={() => { setAnswers({}); setResult(null); }} style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 8 }}>Reset</button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ScoreCard title={result.test} score={result.score} label={result.label} />
          <div style={{ background: 'white', padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 700 }}>Details</div>
            <div style={{ marginTop: 8, fontSize: 13 }}>Taken: {new Date(result.taken_at).toLocaleString()}</div>
            <div style={{ marginTop: 8 }}>
              <details>
                <summary style={{ cursor: 'pointer', color: '#2563eb' }}>Answers</summary>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{JSON.stringify(result.answers, null, 2)}</pre>
              </details>
            </div>
            {/* Render special extra info */}
            {result.test === 'WHO-5' && (
              <div style={{ marginTop: 8 }}>WHO-5 percent score: <strong>{result.who5_pct}%</strong></div>
            )}
            {result.test === 'DASS-21' && result.subscale_scaled && (
              <div style={{ marginTop: 8 }}>
                <div><strong>DASS-21 subscale (scaled x2)</strong></div>
                <div>Depression: {result.subscale_scaled.depression}</div>
                <div>Anxiety: {result.subscale_scaled.anxiety}</div>
                <div>Stress: {result.subscale_scaled.stress}</div>
              </div>
            )}
            {result.test === 'C-SSRS' && result.flagged && result.escalation && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: '#fff7f7', border: '1px solid #fecaca' }}>
                <div style={{ fontWeight: 700, color: '#b91c1c' }}>Suicide risk flagged</div>
                <div style={{ marginTop: 6 }}>{result.escalation.message}</div>
                <ul style={{ marginTop: 8 }}>
                  {result.escalation.resources.map((r, idx) => <li key={idx}>{r.label} {r.url ? <a href={r.url}>{r.url}</a> : null}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History preview */}
      <div style={{ marginTop: 22 }}>
        <h3>Recent test history</h3>
        {history.length === 0 ? (
          <div style={{ color: '#666' }}>No past tests recorded yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {history.slice(0, 6).map((h, idx) => (
              <div key={idx} style={{ background: 'white', padding: 10, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{h.test}</div>
                  <div style={{ fontSize: 13, color: '#444' }}>{h.label} — {new Date(h.taken_at).toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{h.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentalTest;

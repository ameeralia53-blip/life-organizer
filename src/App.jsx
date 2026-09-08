import React, { useState, useEffect } from 'react';

const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const emojis = ['🌅', '📆', '🌤️', '☀️', '🌞', '🌈', '🌙'];

function App() {
  const [page, setPage] = useState('home');
  const [weeklyTasks, setWeeklyTasks] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [mindMap, setMindMap] = useState('');
  const [notes, setNotes] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [newHours, setNewHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [savingMessage, setSavingMessage] = useState('');

  // تحميل البيانات من localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weeklyTasks');
      if (saved) setWeeklyTasks(JSON.parse(saved));
      const savedMind = localStorage.getItem('mindMap');
      if (savedMind) setMindMap(savedMind);
      const savedNotes = localStorage.getItem('freeNotes');
      if (savedNotes) setNotes(savedNotes);
      const savedSubjects = localStorage.getItem('studyPlan');
      if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    } catch (e) {
      console.log('Storage error:', e);
    }
  }, []);

  // المنبه
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && isRunning && minutes) {
      setIsRunning(false);
      setShowAlert(true);
      playAlarmSound();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, minutes]);

  const playAlarmSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      osc.start();
      osc.stop(audioContext.currentTime + 1);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const saveWeeklyTasks = () => {
    if (selectedDay) {
      const updated = { ...weeklyTasks, [selectedDay]: taskText };
      setWeeklyTasks(updated);
      localStorage.setItem('weeklyTasks', JSON.stringify(updated));
      setSavingMessage('✓ تم حفظ المهام!');
      setTimeout(() => setSavingMessage(''), 2000);
    }
  };

  const saveMindMap = () => {
    localStorage.setItem('mindMap', mindMap);
    setSavingMessage('✓ تم حفظ الخطة!');
    setTimeout(() => setSavingMessage(''), 2000);
  };

  const saveNotes = () => {
    localStorage.setItem('freeNotes', notes);
    setSavingMessage('✓ تم حفظ الملاحظات!');
    setTimeout(() => setSavingMessage(''), 2000);
  };

  const addSubject = () => {
    if (newSubject.trim() && newHours && subjects.length < 15) {
      const updated = [...subjects, { id: Date.now(), name: newSubject, hours: parseFloat(newHours) }];
      setSubjects(updated);
      localStorage.setItem('studyPlan', JSON.stringify(updated));
      setNewSubject('');
      setNewHours('');
    }
  };

  const deleteSubject = (id) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    localStorage.setItem('studyPlan', JSON.stringify(updated));
  };

  const startAlarm = () => {
    if (minutes && parseInt(minutes) > 0) {
      setTimeLeft(parseInt(minutes) * 60);
      setIsRunning(true);
    }
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold">يومك بيدك</h1>
          </div>
          <p className="text-sm text-purple-100">استثمره بحكمة</p>
        </div>
      </header>

      {/* Home Page */}
      {page === 'home' && (
        <main className="max-w-6xl mx-auto px-4 py-12 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">يومك بيدك</h2>
            <p className="text-xl text-gray-600">استثمره بحكمة - نظم حياتك بأفضل طريقة</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'مهام أيام الأسبوع', desc: 'خطط مهامك لكل يوم', icon: '📅', page: 'weekly' },
              { title: 'الخطة الذهنية', desc: 'اكتب خطتك الشاملة', icon: '🧠', page: 'mindmap' },
              { title: 'تدوين حر وتذكير', desc: 'ملاحظاتك اليومية', icon: '📝', page: 'notes' },
              { title: 'المخطط الدراسي', desc: 'نظم مواضيعك', icon: '📚', page: 'study' },
              { title: 'المنبه', desc: 'تنبيهات دقيقة', icon: '⏰', page: 'alarm' },
              { title: 'المحفوظات الشاملة', desc: 'اعرض بياناتك', icon: '📦', page: 'archive' }
            ].map((item) => (
              <button key={item.page} onClick={() => setPage(item.page)} className="transform hover:scale-105 transition-all duration-300">
                <div className="h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl">
                  <div className={`bg-gradient-to-br from-blue-400 to-blue-600 h-32 flex items-center justify-center text-5xl`}>{item.icon}</div>
                  <div className="p-6 text-right">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                    <div className="flex justify-end text-purple-600 gap-1">
                      <span>اذهب</span>
                      <span>←</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* Weekly Tasks Page */}
      {page === 'weekly' && (
        <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
          <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition">← العودة للرئيسية</button>
          <h1 className="text-3xl font-bold text-white mb-8">مهام أيام الأسبوع</h1>
          
          {!selectedDay ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {days.map((day, index) => (
                <button key={index} onClick={() => { setSelectedDay(day); setTaskText(weeklyTasks[day] || ''); }} className="transform hover:scale-105 transition-all">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl text-right border-t-4 border-purple-500">
                    <div className="text-3xl mb-3">{emojis[index]}</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{day}</h2>
                    <p className="text-sm text-gray-600">{weeklyTasks[day] ? `${weeklyTasks[day].length} حرف` : 'لا توجد مهام'}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">مهام يوم {selectedDay}</h2>
                <button onClick={() => setSelectedDay(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">← رجوع</button>
              </div>
              <textarea value={taskText} onChange={(e) => e.target.value.length <= 10000 && setTaskText(e.target.value)} maxLength={10000} className="w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none text-right" placeholder="اكتب مهامك..."/>
              <div className="text-sm text-gray-500 text-left mt-2 mb-6">{taskText.length} / 10,000 حرف</div>
              <button onClick={saveWeeklyTasks} className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold">💾 حفظ</button>
              {savingMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{savingMessage}</div>}
            </div>
          )}
        </main>
      )}

      {/* Mind Map Page */}
      {page === 'mindmap' && (
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 bg-white text-gray-800 rounded-lg">← العودة</button>
          <h1 className="text-3xl font-bold text-white mb-4">الخطة الذهنية 🧠</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <textarea value={mindMap} onChange={(e) => setMindMap(e.target.value)} className="w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none text-right" placeholder="اكتب خطتك..."/>
            <div className="text-sm text-gray-500 text-left mt-2 mb-6">{mindMap.length} حرف</div>
            <button onClick={saveMindMap} className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold">💾 حفظ</button>
            {savingMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{savingMessage}</div>}
          </div>
        </main>
      )}

      {/* Free Notes Page */}
      {page === 'notes' && (
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 bg-white text-gray-800 rounded-lg">← العودة</button>
          <h1 className="text-3xl font-bold text-white mb-4">ملاحظاتي 📝</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none text-right" placeholder="اكتب ملاحظاتك..."/>
            <div className="text-sm text-gray-500 text-left mt-2 mb-6">{notes.length} حرف</div>
            <button onClick={saveNotes} className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold">💾 حفظ</button>
            {savingMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{savingMessage}</div>}
          </div>
        </main>
      )}

      {/* Study Plan Page */}
      {page === 'study' && (
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 bg-white text-gray-800 rounded-lg">← العودة</button>
          <h1 className="text-3xl font-bold text-white mb-4">المخطط الدراسي 📚</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="اسم الموضوع" className="w-full mb-2 p-2 border rounded text-right"/>
              <input type="number" value={newHours} onChange={(e) => setNewHours(e.target.value)} placeholder="الساعات" step="0.5" className="w-full mb-2 p-2 border rounded text-right"/>
              <button onClick={addSubject} className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">➕ إضافة</button>
            </div>

            {subjects.length > 0 && (
              <>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded mb-4 font-bold flex justify-between">
                  <span>الإجمالي: {totalHours} ساعة</span>
                </div>
                <div className="space-y-2">
                  {subjects.map((s) => (
                    <div key={s.id} className="flex justify-between p-3 bg-gray-100 rounded text-right">
                      <span>{s.name}</span>
                      <div className="flex gap-2 items-center">
                        <span>{s.hours}h</span>
                        <button onClick={() => deleteSubject(s.id)} className="text-red-500">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {/* Alarm Page */}
      {page === 'alarm' && (
        <main className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center">
          <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 bg-white text-gray-800 rounded-lg">← العودة</button>
          <h1 className="text-3xl font-bold text-white mb-12">المنبه ⏰</h1>
          <div className="bg-white rounded-2xl p-8 w-full">
            {!isRunning ? (
              <>
                <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="الدقائق" className="w-full text-3xl p-4 border-4 border-purple-500 rounded-lg mb-6 text-center"/>
                <button onClick={startAlarm} className="w-full px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded">▶️ ابدأ</button>
              </>
            ) : (
              <>
                <div className="text-6xl font-bold text-center mb-6 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">{formatTime(timeLeft)}</div>
                <button onClick={() => { setIsRunning(false); setTimeLeft(0); setMinutes(''); }} className="w-full px-8 py-6 bg-red-500 text-white text-xl font-bold rounded">⏹️ إيقاف</button>
              </>
            )}
          </div>
          {showAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
                <div className="text-6xl mb-4">🔔</div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">انتهى الوقت!</h2>
                <button onClick={() => setShowAlert(false)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">تمام</button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Archive Page */}
      {page === 'archive' && (
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <button onClick={() => setPage('home')} className="mb-6 px-4 py-2 bg-white text-gray-800 rounded-lg">← العودة</button>
          <h1 className="text-3xl font-bold text-white mb-8">المحفوظات 📦</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-bold text-lg text-blue-700 mb-3">📅 المهام</h2>
              {Object.keys(weeklyTasks).length ? Object.entries(weeklyTasks).map(([day, tasks]) => (
                <div key={day} className="p-2 mb-2 bg-white rounded text-right text-sm">
                  <strong>{day}:</strong> {tasks.substring(0, 50)}...
                </div>
              )) : <p className="text-gray-500 text-center">لا توجد</p>}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;

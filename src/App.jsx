import React, { useEffect, useRef, useState } from 'react';

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
  const [message, setMessage] = useState('');
  const messageTimer = useRef(null);

  const notify = (text) => {
    setMessage(text);
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(''), 2500);
  };

  useEffect(() => {
    try {
      setWeeklyTasks(JSON.parse(localStorage.getItem('weeklyTasks') || '{}'));
      setMindMap(localStorage.getItem('mindMap') || '');
      setNotes(localStorage.getItem('freeNotes') || '');
      setSubjects(JSON.parse(localStorage.getItem('studyPlan') || '[]'));
    } catch {
      notify('تعذر تحميل البيانات المحفوظة');
    }
    return () => window.clearTimeout(messageTimer.current);
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;
    if (timeLeft <= 0) {
      setIsRunning(false);
      setShowAlert(true);
      notify('انتهى وقت المنبه');
      playAlarmSound();
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const playAlarmSound = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.frequency.value = 1000;
      gain.gain.setValueAtTime(0.3, context.currentTime);
      oscillator.start();
      oscillator.stop(context.currentTime + 1.2);
    } catch {
      // Audio may be unavailable in some browsers.
    }
  };

  const saveWeeklyTasks = () => {
    if (!selectedDay) return;
    const updated = { ...weeklyTasks, [selectedDay]: taskText };
    setWeeklyTasks(updated);
    localStorage.setItem('weeklyTasks', JSON.stringify(updated));
    notify('تم حفظ مهام اليوم');
  };

  const deleteWeeklyTasks = () => {
    if (!selectedDay) return;
    const updated = { ...weeklyTasks };
    delete updated[selectedDay];
    setWeeklyTasks(updated);
    setTaskText('');
    localStorage.setItem('weeklyTasks', JSON.stringify(updated));
    notify('تم مسح مهام اليوم');
  };

  const saveMindMap = () => {
    localStorage.setItem('mindMap', mindMap);
    notify('تم حفظ الخطة');
  };

  const saveNotes = () => {
    localStorage.setItem('freeNotes', notes);
    notify('تم حفظ الملاحظات');
  };

  const clearNotes = () => {
    setNotes('');
    localStorage.removeItem('freeNotes');
    notify('تم مسح الملاحظات');
  };

  const addSubject = () => {
    const name = newSubject.trim();
    const hours = Number(newHours);
    if (!name) return notify('اكتب اسم الموضوع أولاً');
    if (!Number.isFinite(hours) || hours <= 0) return notify('أدخل عدد ساعات صحيح');
    if (subjects.length >= 15) return notify('الحد الأقصى 15 موضوعاً');
    const updated = [...subjects, { id: Date.now(), name, hours }];
    setSubjects(updated);
    localStorage.setItem('studyPlan', JSON.stringify(updated));
    setNewSubject('');
    setNewHours('');
    notify('تمت إضافة الموضوع');
  };

  const deleteSubject = (id) => {
    const updated = subjects.filter((subject) => subject.id !== id);
    setSubjects(updated);
    localStorage.setItem('studyPlan', JSON.stringify(updated));
    notify('تم حذف الموضوع');
  };

  const startAlarm = () => {
    const value = Number(minutes);
    if (!Number.isFinite(value) || value <= 0) return notify('أدخل عدد دقائق صحيح');
    setTimeLeft(Math.floor(value * 60));
    setIsRunning(true);
    setShowAlert(false);
    notify('بدأ المنبه');
  };

  const stopAlarm = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setMinutes('');
    setShowAlert(false);
    notify('تم إيقاف المنبه');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutesValue = Math.floor((seconds % 3600) / 60);
    const secondsValue = seconds % 60;
    return [hours, minutesValue, secondsValue].map((value) => String(value).padStart(2, '0')).join(':');
  };

  const goHome = () => {
    setPage('home');
    setSelectedDay(null);
  };

  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
  const savedData = {
    weeklyTasks,
    mindMap,
    freeNotes: notes,
    studyPlan: subjects,
  };

  const downloadData = () => {
    const blob = new Blob([JSON.stringify(savedData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'life-organizer-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    notify('تم تصدير البيانات');
  };

  const clearAll = () => {
    if (!window.confirm('هل تريد مسح جميع البيانات؟')) return;
    ['weeklyTasks', 'mindMap', 'freeNotes', 'studyPlan'].forEach((key) => localStorage.removeItem(key));
    setWeeklyTasks({});
    setMindMap('');
    setNotes('');
    setSubjects([]);
    notify('تم مسح جميع البيانات');
  };

  const cards = [
    ['مهام أيام الأسبوع', 'خطط مهامك لكل يوم', '📅', 'weekly'],
    ['الخطة الذهنية', 'اكتب خطتك الشاملة', '🧠', 'mindmap'],
    ['تدوين حر وتذكير', 'ملاحظاتك اليومية', '📝', 'notes'],
    ['المخطط الدراسي', 'نظم مواضيعك', '📚', 'study'],
    ['المنبه', 'تنبيهات دقيقة', '⏰', 'alarm'],
    ['المحفوظات الشاملة', 'اعرض بياناتك', '📦', 'archive'],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-gray-50" dir="rtl">
      {message && <div className="toast-notice" role="status">{message}</div>}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-2 text-white" aria-label="العودة للرئيسية">
            <span className="text-2xl">🏠</span><span className="text-2xl font-bold">يومك بيدك</span>
          </button>
          <p className="text-sm text-purple-100">استثمره بحكمة</p>
        </div>
      </header>

      {page === 'home' && <main className="max-w-6xl mx-auto px-4 py-12 pb-20 rtl-text">
        <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">يومك بيدك</h2><p className="text-xl text-gray-600">استثمره بحكمة - نظم حياتك بأفضل طريقة</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(([title, description, icon, target]) => <button key={target} onClick={() => setPage(target)} className="card-hover text-right">
            <div className="h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-32 flex items-center justify-center text-5xl">{icon}</div>
              <div className="p-6"><h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3><p className="text-gray-600 text-sm">{description}</p><div className="mt-4 text-purple-600 font-semibold">اذهب الآن ←</div></div>
            </div>
          </button>)}
        </div>
      </main>}

      {page === 'weekly' && <main className="max-w-6xl mx-auto px-4 py-8 pb-20 rtl-text">
        <button onClick={goHome} className="mb-6 px-4 py-2 bg-white rounded-lg">← العودة للرئيسية</button><h1 className="text-3xl font-bold text-gradient mb-8">مهام أيام الأسبوع</h1>
        {!selectedDay ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{days.map((day, index) => <button key={day} onClick={() => { setSelectedDay(day); setTaskText(weeklyTasks[day] || ''); }} className="bg-white p-6 rounded-xl shadow-md text-right border-t-4 border-purple-500"><div className="text-3xl mb-3">{emojis[index]}</div><h2 className="text-xl font-bold text-gray-800 mb-2">{day}</h2><p className="text-sm text-gray-600">{weeklyTasks[day] ? `${weeklyTasks[day].length} حرف` : 'لا توجد مهام'}</p></button>)}</div> : <div className="bg-white rounded-2xl shadow-lg p-8"><div className="flex justify-between items-center mb-6 gap-3"><h2 className="text-2xl font-bold text-gray-800">مهام يوم {selectedDay}</h2><button onClick={() => setSelectedDay(null)} className="px-4 py-2 bg-gray-200 rounded-lg">← رجوع</button></div><textarea value={taskText} onChange={(event) => setTaskText(event.target.value)} maxLength={10000} className="rtl-text w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none" placeholder="اكتب مهامك لهذا اليوم..." /><div className="text-sm text-gray-500 text-left mt-2 mb-6">{taskText.length} / 10,000 حرف</div><div className="flex gap-3 flex-wrap"><button onClick={saveWeeklyTasks} className="px-6 py-3 btn-gradient text-white rounded-lg font-semibold">حفظ المهام</button>{weeklyTasks[selectedDay] && <button onClick={deleteWeeklyTasks} className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold">مسح</button>}</div></div>}
      </main>}

      {page === 'mindmap' && <main className="max-w-4xl mx-auto px-4 py-8 pb-20 rtl-text"><button onClick={goHome} className="mb-6 px-4 py-2 bg-white rounded-lg">← العودة</button><h1 className="text-3xl font-bold text-gradient mb-4">الخطة الذهنية</h1><div className="bg-white rounded-2xl shadow-lg p-8"><textarea value={mindMap} onChange={(event) => setMindMap(event.target.value)} className="rtl-text w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none" placeholder="اكتب خطتك الشاملة..." /><div className="text-sm text-gray-500 text-left mt-2 mb-6">{mindMap.length} حرف</div><button onClick={saveMindMap} className="w-full px-6 py-3 btn-gradient text-white rounded-lg font-semibold">حفظ الخطة</button></div></main>}

      {page === 'notes' && <main className="max-w-4xl mx-auto px-4 py-8 pb-20 rtl-text"><button onClick={goHome} className="mb-6 px-4 py-2 bg-white rounded-lg">← العودة</button><h1 className="text-3xl font-bold text-gradient mb-4">ملاحظاتي</h1><div className="bg-white rounded-2xl shadow-lg p-8"><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="rtl-text w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none" placeholder="اكتب ملاحظاتك..." /><div className="text-sm text-gray-500 text-left mt-2 mb-6">{notes.length} حرف</div><div className="flex gap-3 flex-wrap"><button onClick={clearNotes} className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold">مسح الملاحظات</button><button onClick={saveNotes} className="px-6 py-3 btn-gradient text-white rounded-lg font-semibold">حفظ الملاحظات</button></div></div></main>}

      {page === 'study' && <main className="max-w-4xl mx-auto px-4 py-8 pb-20 rtl-text"><button onClick={goHome} className="mb-6 px-4 py-2 bg-white rounded-lg">← العودة</button><h1 className="text-3xl font-bold text-gradient mb-4">المخطط الدراسي</h1><div className="bg-white rounded-2xl shadow-lg p-8"><div className="mb-6 p-4 bg-purple-50 rounded-lg"><input value={newSubject} onChange={(event) => setNewSubject(event.target.value)} placeholder="اسم الموضوع" className="rtl-text w-full mb-2 p-3 border rounded-lg" /><input type="number" value={newHours} onChange={(event) => setNewHours(event.target.value)} placeholder="عدد الساعات" min="0.5" step="0.5" className="rtl-text w-full mb-2 p-3 border rounded-lg" /><button onClick={addSubject} className="w-full px-4 py-3 btn-gradient text-white rounded-lg font-semibold">إضافة موضوع</button></div>{subjects.length > 0 && <><div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded mb-4 font-bold">الإجمالي: {totalHours} ساعة</div><div className="space-y-2">{subjects.map((subject) => <div key={subject.id} className="flex justify-between items-center p-3 bg-gray-100 rounded"><span>{subject.name}</span><span className="flex items-center gap-3"><span>{subject.hours} ساعة</span><button onClick={() => deleteSubject(subject.id)} className="text-red-500" aria-label={`حذف ${subject.name}`}>🗑️</button></span></div>)}</div></>}</div></main>}

      {page === 'alarm' && <main className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center rtl-text"><button onClick={goHome} className="mb-6 px-4 py-2 bg-white rounded-lg">← العودة</button><h1 className="text-3xl font-bold text-gradient mb-12">المنبه</h1><div className="bg-white rounded-2xl p-8 w-full">{!isRunning ? <><input type="number" value={minutes} onChange={(event) => setMinutes(event.target.value)} min="1" placeholder="عدد الدقائق" className="rtl-text w-full text-3xl p-4 border-4 border-purple-500 rounded-lg mb-6" /><button onClick={startAlarm} className="w-full px-8 py-6 btn-gradient text-white text-xl font-bold rounded-lg">ابدأ المنبه</button></> : <><div className="text-6xl font-bold text-center mb-6 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg" dir="ltr">{formatTime(timeLeft)}</div><button onClick={stopAlarm} className="w-full px-8 py-6 bg-red-500 text-white text-xl font-bold rounded-lg">إيقاف المنبه</button></>}</div>{showAlert && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full"><div className="text-6xl mb-4">🔔</div><h2 className="text-3xl font-bold text-red-600 mb-4">انتهى الوقت!</h2><button onClick={() => setShowAlert(false)} className="px-6 py-3 btn-gradient text-white rounded-lg">تم</button></div></div>}</main>}

      {page === 'archive' && <main className="max-w-4xl mx-auto px-4 py-8 pb-20 rtl-text"><button onClick={goHome} className="mb-6 px-4 py-2 bg-white rounded-lg">← العودة</button><h1 className="text-3xl font-bold text-gradient mb-8">المحفوظات</h1><div className="bg-white rounded-2xl shadow-lg p-8"><h2 className="font-bold text-lg text-blue-700 mb-3">مهام الأسبوع</h2>{Object.keys(weeklyTasks).length ? Object.entries(weeklyTasks).map(([day, tasks]) => <div key={day} className="p-3 mb-2 bg-blue-50 rounded"><strong>{day}:</strong> {tasks}</div>) : <p className="text-gray-500">لا توجد مهام مؤرشفة</p>}<div className="flex gap-3 flex-wrap mt-8"><button onClick={downloadData} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">تصدير البيانات</button><button onClick={clearAll} className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold">مسح جميع البيانات</button></div></div></main>}
    </div>
  );
}

export default App;

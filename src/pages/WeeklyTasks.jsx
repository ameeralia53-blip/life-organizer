import React, { useState, useEffect } from 'react'
import { Save, Paperclip, ArrowRight } from 'lucide-react'

const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

function WeeklyTasks() {
  const [selectedDay, setSelectedDay] = useState(null)
  const [tasks, setTasks] = useState({})
  const [currentText, setCurrentText] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('weeklyTasks')
    if (saved) {
      setTasks(JSON.parse(saved))
    }
  }, [])

  const handleDayClick = (day) => {
    setSelectedDay(day)
    setCurrentText(tasks[day] || '')
  }

  const handleSave = () => {
    if (selectedDay) {
      const updated = { ...tasks, [selectedDay]: currentText }
      setTasks(updated)
      localStorage.setItem('weeklyTasks', JSON.stringify(updated))
      alert('تم حفظ المهام بنجاح! ✓')
    }
  }

  const handleClear = () => {
    if (selectedDay && confirm('هل أنت متأكد من رغبتك في حذف مهام هذا اليوم؟')) {
      const updated = { ...tasks }
      delete updated[selectedDay]
      setTasks(updated)
      localStorage.setItem('weeklyTasks', JSON.stringify(updated))
      setCurrentText('')
      alert('تم حذف المهام بنجاح!')
    }
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-8">مهام أيام الأسبوع</h1>

        {!selectedDay ? (
          // Days Selection
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                className="card-hover bg-white p-6 rounded-xl shadow-md border-2 border-transparent hover:border-purple-500 transition-all"
              >
                <div className="text-3xl mb-3">
                  {['🌅', '📆', '🌤️', '☀️', '🌞', '🌈', '🌙'][index]}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{day}</h2>
                <p className="text-sm text-gray-600">
                  {tasks[day] ? `${tasks[day].length} حرف` : 'لا توجد مهام'}
                </p>
                <div className="mt-4 flex items-center justify-end gap-2 text-purple-600">
                  <span className="text-sm">افتح</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Tasks Editor
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">مهام يوم {selectedDay}</h2>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                ← رجوع
              </button>
            </div>

            <div className="mb-4 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                اكتب مهامك (حد أقصى 10,000 حرف)
              </label>
              <textarea
                value={currentText}
                onChange={(e) => {
                  if (e.target.value.length <= 10000) {
                    setCurrentText(e.target.value)
                  }
                }}
                maxLength={10000}
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none font-tajawal"
                placeholder="اكتب مهامك لهذا اليوم..."
              />
              <div className="text-sm text-gray-500 text-left">
                {currentText.length} / 10,000 حرف
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => alert('ميزة المرفقات في التحديث القادم')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                <Paperclip size={20} />
                إضافة ملف
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 btn-gradient text-white rounded-lg hover:shadow-lg font-semibold"
              >
                <Save size={20} />
                حفظ المهام
              </button>
              {tasks[selectedDay] && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default WeeklyTasks
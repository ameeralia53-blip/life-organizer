import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'

function StudyPlan() {
  const [subjects, setSubjects] = useState([])
  const [newSubject, setNewSubject] = useState('')
  const [newHours, setNewHours] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('studyPlan')
    if (saved) {
      setSubjects(JSON.parse(saved))
    }
  }, [])

  const handleAddSubject = () => {
    if (newSubject.trim() && newHours && subjects.length < 15) {
      const updated = [...subjects, { id: Date.now(), name: newSubject, hours: parseFloat(newHours) }]
      setSubjects(updated)
      setNewSubject('')
      setNewHours('')
    }
  }

  const handleDelete = (id) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  const handleSave = () => {
    localStorage.setItem('studyPlan', JSON.stringify(subjects))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0)

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">المخطط الدراسي</h1>
        <p className="text-gray-600 mb-8">أضف مواضيعك الدراسية وخطط لساعات الدراسة</p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Add Subject Form */}
          <div className="mb-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">إضافة موضوع جديد</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم الموضوع
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="مثال: الرياضيات"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-tajawal"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عدد الساعات
                </label>
                <input
                  type="number"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  placeholder="مثال: 2"
                  step="0.5"
                  min="0"
                  max="24"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddSubject}
                disabled={subjects.length >= 15}
                className="flex items-center justify-center gap-2 px-6 py-2 btn-gradient text-white rounded-lg hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <Plus size={20} />
                إضافة
              </button>
            </div>
            {subjects.length >= 15 && (
              <p className="text-red-600 text-sm mt-2">وصلت إلى الحد الأقصى من المواضيع (15)</p>
            )}
          </div>

          {/* Subjects List */}
          {subjects.length > 0 ? (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg mb-4 flex justify-between items-center">
                <span className="text-lg font-bold">إجمالي الساعات</span>
                <span className="text-2xl font-bold">{totalHours} ساعة</span>
              </div>

              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-r-4 border-purple-500 hover:shadow-md transition">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{subject.name}</h3>
                      <p className="text-sm text-gray-600">{subject.hours} ساعة</p>
                    </div>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-semibold">لم تضف أي مواضيع بعد</p>
              <p>ابدأ بإضافة موضوعك الأول!</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 btn-gradient text-white rounded-lg hover:shadow-lg font-semibold ml-auto"
            >
              <Save size={20} />
              حفظ المخطط
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg font-semibold text-center">
              ✓ تم حفظ المخطط بنجاح!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default StudyPlan
import React, { useState, useEffect } from 'react'
import { Save, Trash2 } from 'lucide-react'

function FreeNotes() {
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('freeNotes')
    if (saved) {
      setNotes(saved)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('freeNotes', notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClear = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف جميع الملاحظات؟')) {
      setNotes('')
      localStorage.removeItem('freeNotes')
      alert('تم حذف الملاحظات بنجاح!')
    }
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">تدوين حر وتذكير</h1>
        <p className="text-gray-600 mb-8">اكتب ملاحظاتك اليومية والتذكيرات المهمة</p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            ملاحظاتك وتذكيراتك
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-screen p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none font-tajawal"
            placeholder="اكتب هنا أي شيء تريد تذكره... الملاحظات الشخصية، الأفكار، الخطط..."
          />
          <div className="text-sm text-gray-500 text-left mt-2 mb-6">
            {notes.length} حرف
          </div>

          <div className="flex gap-3 flex-wrap sticky bottom-4">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              <Trash2 size={20} />
              حذف الكل
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 btn-gradient text-white rounded-lg hover:shadow-lg font-semibold ml-auto"
            >
              <Save size={20} />
              حفظ الملاحظات
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg font-semibold text-center">
              ✓ تم حفظ الملاحظات بنجاح!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default FreeNotes
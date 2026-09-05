import React, { useState, useEffect } from 'react'
import { Save, Paperclip } from 'lucide-react'

function MindMap() {
  const [plan, setPlan] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mindMap')
    if (saved) {
      setPlan(saved)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('mindMap', plan)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">الخطة الذهنية</h1>
        <p className="text-gray-600 mb-8">اكتب خطتك الشاملة والمفصلة للنجاح</p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            اكتب خطتك الشاملة
          </label>
          <textarea
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none font-tajawal"
            placeholder="اكتب هنا رؤيتك وأهدافك والخطوات التفصيلية لتحقيقها..."
          />
          <div className="text-sm text-gray-500 text-left mt-2 mb-6">
            {plan.length} حرف
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => alert('ميزة إضافة PDF في التحديث القادم')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              <Paperclip size={20} />
              إرفاق PDF
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 btn-gradient text-white rounded-lg hover:shadow-lg font-semibold"
            >
              <Save size={20} />
              حفظ الخطة
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg font-semibold text-center">
              ✓ تم حفظ الخطة بنجاح!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default MindMap
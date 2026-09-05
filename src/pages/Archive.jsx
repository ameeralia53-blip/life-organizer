import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

function Archive() {
  const [data, setData] = useState({
    weeklyTasks: {},
    mindMap: '',
    freeNotes: '',
    studyPlan: []
  })
  const [expandedSections, setExpandedSections] = useState({
    weekly: true,
    mindmap: false,
    notes: false,
    study: false
  })

  useEffect(() => {
    const weeklyTasks = JSON.parse(localStorage.getItem('weeklyTasks') || '{}')
    const mindMap = localStorage.getItem('mindMap') || ''
    const freeNotes = localStorage.getItem('freeNotes') || ''
    const studyPlan = JSON.parse(localStorage.getItem('studyPlan') || '[]')

    setData({
      weeklyTasks,
      mindMap,
      freeNotes,
      studyPlan
    })
  }, [])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearAll = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      localStorage.clear()
      setData({
        weeklyTasks: {},
        mindMap: '',
        freeNotes: '',
        studyPlan: []
      })
      alert('تم حذف جميع البيانات بنجاح!')
    }
  }

  const downloadData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr))
    element.setAttribute('download', 'life-organizer-backup.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const SectionHeader = ({ title, section, icon, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition mb-4 font-bold text-lg"
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span>{title}</span>
        {count > 0 && <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-bold">{count}</span>}
      </div>
      {expandedSections[section] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </button>
  )

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">المحفوظات الشاملة</h1>
        <p className="text-gray-600 mb-8">اعرض جميع بياناتك المحفوظة</p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Weekly Tasks */}
          <SectionHeader
            title="مهام أيام الأسبوع"
            section="weekly"
            icon="📅"
            count={Object.keys(data.weeklyTasks).length}
          />
          {expandedSections.weekly && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-r-4 border-blue-500">
              {Object.keys(data.weeklyTasks).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(data.weeklyTasks).map(([day, tasks]) => (
                    <div key={day} className="p-4 bg-white rounded-lg border border-blue-200">
                      <h3 className="font-bold text-lg text-blue-700 mb-2">{day}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {tasks.substring(0, 300)}{tasks.length > 300 ? '...' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">({tasks.length} حرف)</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">لا توجد مهام مسجلة</p>
              )}
            </div>
          )}

          {/* Mind Map */}
          <SectionHeader
            title="الخطة الذهنية"
            section="mindmap"
            icon="🧠"
            count={data.mindMap ? 1 : 0}
          />
          {expandedSections.mindmap && (
            <div className="mb-6 p-4 bg-pink-50 rounded-lg border-r-4 border-pink-500">
              {data.mindMap ? (
                <div className="p-4 bg-white rounded-lg border border-pink-200">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {data.mindMap.substring(0, 500)}{data.mindMap.length > 500 ? '...' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">({data.mindMap.length} حرف)</p>
                </div>
              ) : (
                <p className="text-gray-500 text-center">لا توجد خطة مسجلة</p>
              )}
            </div>
          )}

          {/* Free Notes */}
          <SectionHeader
            title="تدوين حر وتذكير"
            section="notes"
            icon="📝"
            count={data.freeNotes ? 1 : 0}
          />
          {expandedSections.notes && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-r-4 border-yellow-500">
              {data.freeNotes ? (
                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {data.freeNotes.substring(0, 500)}{data.freeNotes.length > 500 ? '...' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">({data.freeNotes.length} حرف)</p>
                </div>
              ) : (
                <p className="text-gray-500 text-center">لا توجد ملاحظات مسجلة</p>
              )}
            </div>
          )}

          {/* Study Plan */}
          <SectionHeader
            title="المخطط الدراسي"
            section="study"
            icon="📚"
            count={data.studyPlan.length}
          />
          {expandedSections.study && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-r-4 border-green-500">
              {data.studyPlan.length > 0 ? (
                <div className="space-y-3">
                  {data.studyPlan.map((subject) => (
                    <div key={subject.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                      <span className="font-semibold text-gray-800">{subject.name}</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        {subject.hours} ساعة
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                    <p className="font-bold text-green-700">
                      إجمالي الساعات: {data.studyPlan.reduce((sum, s) => sum + s.hours, 0)} ساعة
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">لا توجد مواضيع مسجلة</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">الإجراءات</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadData}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
              >
                📥 تحميل البيانات
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold ml-auto"
              >
                <Trash2 size={20} />
                حذف جميع البيانات
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Archive
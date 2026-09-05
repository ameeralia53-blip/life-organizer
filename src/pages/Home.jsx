import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Brain, BookOpen, BookMarked, Clock, Archive } from 'lucide-react'

function Home() {
  const features = [
    {
      id: 1,
      title: 'مهام أيام الأسبوع',
      description: 'خطط مهامك لكل يوم من أيام الأسبوع',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
      path: '/weekly-tasks',
      emoji: '📅'
    },
    {
      id: 2,
      title: 'الخطة الذهنية',
      description: 'اكتب خطتك الشاملة والمفصلة',
      icon: Brain,
      color: 'from-pink-400 to-pink-600',
      path: '/mind-map',
      emoji: '🧠'
    },
    {
      id: 3,
      title: 'تدوين حر وتذكير',
      description: 'اكتب ملاحظاتك اليومية والتذكيرات',
      icon: BookOpen,
      color: 'from-yellow-400 to-yellow-600',
      path: '/free-notes',
      emoji: '📝'
    },
    {
      id: 4,
      title: 'المخطط الدراسي',
      description: 'نظم مواضيعك الدراسية ووقتك',
      icon: BookMarked,
      color: 'from-green-400 to-green-600',
      path: '/study-plan',
      emoji: '📚'
    },
    {
      id: 5,
      title: 'المنبه',
      description: 'اضبط منبهاً لتذكرك بالمهام',
      icon: Clock,
      color: 'from-red-400 to-red-600',
      path: '/alarm',
      emoji: '⏰'
    },
    {
      id: 6,
      title: 'المحفوظات الشاملة',
      description: 'اعرض جميع بياناتك المحفوظة',
      icon: Archive,
      color: 'from-purple-400 to-purple-600',
      path: '/archive',
      emoji: '📦'
    }
  ]

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            يومك بيدك
          </h2>
          <p className="text-xl text-gray-600 font-tajawal">
            استثمره بحكمة - نظم حياتك بأفضل طريقة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.id}
                to={feature.path}
                className="card-hover"
              >
                <div className="h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-purple-500">
                  <div className={`bg-gradient-to-br ${feature.color} h-32 flex items-center justify-center text-5xl`}>
                    {feature.emoji}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="text-purple-600" size={24} />
                      <h3 className="text-xl font-bold text-gray-800">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 text-purple-600 font-semibold flex items-center justify-end gap-2">
                      <span>اذهب الآن</span>
                      <span>←</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Home
import React, { useState, useEffect } from 'react'
import { Play, Stop, Volume2, X } from 'lucide-react'

function Alarm() {
  const [minutes, setMinutes] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning && minutes) {
      setIsRunning(false)
      setShowAlert(true)
      // Play sound
      playAlarmSound()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, minutes])

  const playAlarmSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = 1000
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 2)
  }

  const handleStart = () => {
    if (minutes && !isNaN(minutes) && minutes > 0) {
      setTimeLeft(parseInt(minutes) * 60)
      setIsRunning(true)
    } else {
      alert('الرجاء إدخال عدد صحيح من الدقائق')
    }
  }

  const handleStop = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setMinutes('')
    setShowAlert(false)
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen pb-20 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <h1 className="text-3xl font-bold text-gradient mb-12 text-center">المنبه ⏰</h1>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {!isRunning ? (
            <div className="space-y-8">
              <div>
                <label className="block text-center text-lg font-bold text-gray-800 mb-4">
                  أدخل عدد الدقائق
                </label>
                <div className="flex gap-4 items-center justify-center">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="مثال: 5"
                    min="1"
                    max="999"
                    disabled={isRunning}
                    className="text-center text-3xl font-bold px-6 py-4 border-4 border-purple-500 rounded-lg focus:outline-none w-32 disabled:bg-gray-100"
                  />
                  <span className="text-3xl font-bold text-gray-800">دقيقة</span>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={isRunning || !minutes}
                className="w-full flex items-center justify-center gap-3 px-8 py-6 btn-gradient text-white text-xl font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Play size={28} />
                ابدأ المنبه
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">الوقت المتبقي</p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8">
                  <div className="text-7xl font-bold font-mono">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStop}
                className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-red-500 text-white text-xl font-bold rounded-xl hover:bg-red-600 transition-all"
              >
                <Stop size={28} />
                إيقاف المنبه
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl animate-pulse">
            <div className="text-6xl mb-6 animate-bounce">🔔</div>
            <h2 className="text-4xl font-bold text-red-600 mb-4">انتهى الوقت!</h2>
            <p className="text-xl text-gray-700 mb-8">لقد انقضت الدقائق المحددة بنجاح!</p>
            <div className="flex gap-4">
              <button
                onClick={handleStop}
                className="flex-1 px-6 py-4 btn-gradient text-white text-lg font-bold rounded-lg hover:shadow-lg transition-all"
              >
                تم، شكراً
              </button>
              <button
                onClick={() => playAlarmSound()}
                className="px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Alarm
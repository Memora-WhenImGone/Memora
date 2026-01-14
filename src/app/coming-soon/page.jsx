import { Shield, Heart, Lock, Clock} from 'lucide-react';

export default function Page() {
  
  return (
    <div className="min-h-screen bg-linear-to-r from-[#0e7490] via-[#3b82f6] to-[#4f46e5] text-white overflow-hidden relative">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
              <Heart className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

     
        <div className="text-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-purple-400">
            Memora
          </h1>
          <p className="text-2xl md:text-3xl text-white font-light">
            When I am Gone
          </p>
        </div>

    
        <p className="text-xl md:text-2xl text-center text-gray-300 mb-12 max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Your digital legacy, protected and shared with those who matter most
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl w-full animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <Lock className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
            <p className="text-gray-400">Military-grade encryption protects your most important information</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-pink-400/20 hover:border-pink-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <Heart className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted Contacts</h3>
            <p className="text-gray-400">Designate loved ones to receive your messages and documents</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <Clock className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Triggers</h3>
            <p className="text-gray-400">Automatic release during emergencies or according to your timeline</p>
          </div>
        </div>
        <div className="mt-12 animate-fade-in-up animate-pulse-slow" style={{ animationDelay: '1s' }}>
          <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 rounded-full px-6 py-3">
            <p className="text-white font-semibold">Launching Soon 2026</p>
          </div>
        </div>

      </div>
    </div>
  );
}
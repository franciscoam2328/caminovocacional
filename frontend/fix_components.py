import os

def replace_in_file(filepath, old_text, new_text):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old_text, new_text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Footers
footer_old = '© 2026 Futuro Marcelino Trujillo. Inspirado en nuestra herencia.'
footer_new = '© 2026 Colegio San Marcelo. Formando líderes para el mañana. Una herramienta gratuita de orientación vocacional para nuestra comunidad educativa.'

for f in ['src/components/LandingView.jsx', 'src/components/TestForm.jsx', 'src/components/ResultDisplay.jsx']:
    replace_in_file(f, footer_old, footer_new)

# 2. TestForm Header
tf_old = '''      <header className="bg-white border-b border-gray-100 top-0 sticky z-50 h-[84px] flex items-center">
        <div className="flex justify-between items-center px-8 h-20 max-w-[80rem] mx-auto w-full font-manrope antialiased">
          <div className="flex items-center gap-12 w-full">
            <div className="text-[22px] font-extrabold tracking-tight text-[#2b6be6] font-manrope">
              Futuro Marcelino
            </div>
            <nav className="flex flex-1 items-center justify-center gap-12 font-manrope mr-32">
              <button onClick={onGoHome} className="text-[#6b7280] font-medium text-[15px] hover:text-[#2b6be6] transition-colors">Inicio</button>
              <div className="relative py-2">
                <button onClick={onGoTest} className="text-[#2b6be6] font-medium text-[15px]">Test Vocacional</button>
                <div className="absolute -bottom-1 left-0 w-full h-[6px] border-x-[2px] border-b-[2px] border-[#2b6be6] rounded-b-[6px]"></div>
              </div>
            </nav>
          </div>
        </div>
      </header>'''
tf_new = '''      <header className="fixed w-full top-0 z-50 bg-primary shadow-lg h-[80px] flex items-center">
        <div className="flex justify-between items-center px-8 h-20 max-w-[80rem] mx-auto w-full font-manrope antialiased">
          <div className="flex items-center gap-12 w-full">
            <div className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white font-manrope">
              <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
              Futuro Marcelino
            </div>
            <nav className="flex flex-1 items-center justify-center gap-12 font-manrope mr-32">
              <button onClick={onGoHome} className="text-white/80 font-medium text-[15px] hover:text-white transition-colors">Inicio</button>
              <div className="relative py-2">
                <button onClick={onGoTest} className="text-white font-medium text-[15px] pb-2 border-b-2 border-white">Test Vocacional</button>
              </div>
            </nav>
          </div>
        </div>
      </header>'''
replace_in_file('src/components/TestForm.jsx', tf_old, tf_new)

# 3. ResultDisplay Header
rd_old = '''      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 border-b border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,123,255,0.08)] print:hidden">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-3 items-center w-full">
            <div className="text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400 font-headline-md">
              Futuro Marcelino
            </div>
            <div className="hidden md:flex gap-6 items-center justify-center">
              <button onClick={onRestart} className="font-['Manrope'] text-sm font-medium tracking-tight text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-95 duration-200 ease-out px-3 py-2">
                Inicio
              </button>
              <button className="font-['Manrope'] text-sm tracking-tight text-primary font-bold border-b-2 border-primary pb-1 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all active:scale-95 duration-200 ease-out px-3 py-2">
                Test Vocacional
              </button>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </nav>'''
rd_new = '''      <nav className="bg-primary shadow-lg full-width top-0 sticky z-50 print:hidden h-[80px]">
        <div className="flex justify-between items-center w-full px-8 h-full max-w-[1280px] mx-auto">
          <div className="grid grid-cols-3 items-center w-full">
            <div className="flex items-center gap-3 text-xl font-extrabold tracking-tighter text-white font-headline-md">
              <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
              Futuro Marcelino
            </div>
            <div className="hidden md:flex gap-6 items-center justify-center">
              <button onClick={onRestart} className="font-['Manrope'] text-sm font-medium tracking-tight text-white/80 hover:text-white transition-colors duration-200 ease-out px-3 py-2">
                Inicio
              </button>
              <button className="font-['Manrope'] text-sm tracking-tight text-white font-bold border-b-2 border-white pb-1 transition-all duration-200 ease-out px-3 py-2">
                Test Vocacional
              </button>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </nav>'''
replace_in_file('src/components/ResultDisplay.jsx', rd_old, rd_new)

# 4. UserInfoView Header
uv_old = '''      <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md h-[72px] border-b border-surface-variant/30">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-container-max mx-auto">
          <div className="flex justify-between items-center w-full max-w-container-max mx-auto h-full px-6">
            {/* Brand */}
            <div className="flex items-center gap-12 w-full relative">
            <div className="text-[22px] font-extrabold tracking-tight text-primary font-manrope">
              Futuro Marcelino
            </div>
            {/* Centered Navigation */}
            <nav className="flex items-center gap-md absolute left-1/2 -translate-x-1/2">
              <button onClick={onGoHome} className="text-[#6b7280] hover:text-primary font-medium text-[15px] transition-colors">Inicio</button>
              <div className="relative flex flex-col items-center">
                <button onClick={onGoTest} className="text-primary font-medium text-[15px] py-2">Test Vocacional</button>
                <div className="w-full border-b-2 border-primary rounded-full mt-[-2px]"></div>
              </div>
            </nav>
            {/* Spacer for right side alignment */}
            <div className="w-[150px] hidden md:block"></div>
            </div>
          </div>
        </div>
      </header>'''
uv_new = '''      <header className="fixed w-full top-0 z-50 bg-primary shadow-lg h-[80px]">
        <div className="flex justify-between items-center w-full px-8 h-full max-w-container-max mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white font-manrope">
            <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
            Futuro Marcelino
          </div>
          
          {/* Centered Navigation */}
          <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <button onClick={onGoHome} className="text-white/80 hover:text-white font-medium text-[15px] transition-colors">Inicio</button>
            <div className="relative flex flex-col items-center">
              <button onClick={onGoTest} className="text-white font-medium text-[15px] py-2 border-b-2 border-white">Test Vocacional</button>
            </div>
          </nav>
          
          {/* Spacer for right side alignment */}
          <div className="w-[150px] hidden md:block"></div>
        </div>
      </header>'''
replace_in_file('src/components/UserInfoView.jsx', uv_old, uv_new)

# 5. AvatarSelectView Header
av_old = '''      <nav className="fixed top-0 w-full z-50 bg-white font-manrope antialiased border-b border-gray-100">
        <div className="flex justify-between items-center px-8 h-20 max-w-[80rem] mx-auto">
          {/* Brand */}
          <div className="text-xl font-extrabold tracking-tight text-blue-600 font-manrope antialiased">
            Futuro Marcelino
          </div>
          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12">
            <button onClick={onGoHome} className="text-[#6b7280] font-medium text-[15px] hover:text-primary transition-colors">Inicio</button>
            <div className="relative group">
              <button onClick={onGoTest} className="text-primary font-medium text-[15px] pb-2 border-b-2 border-primary">
                Test Vocacional
              </button>
            </div>
          </div>
          {/* Placeholder for spacing to keep links centered */}
          <div className="w-[160px] hidden md:block"></div>
        </div>
      </nav>'''
av_new = '''      <header className="fixed w-full top-0 z-50 bg-primary shadow-lg h-[80px]">
        <div className="flex justify-between items-center px-8 h-full max-w-[80rem] mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white font-manrope">
            <img src="/insignia_san_marcelo.jpg" alt="Insignia San Marcelo" className="h-16 w-auto object-contain drop-shadow-lg" />
            Futuro Marcelino
          </div>
          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12">
            <button onClick={onGoHome} className="text-white/80 font-medium text-[15px] hover:text-white transition-colors">Inicio</button>
            <div className="relative group">
              <button onClick={onGoTest} className="text-white font-medium text-[15px] pb-2 border-b-2 border-white">
                Test Vocacional
              </button>
            </div>
          </div>
          {/* Placeholder for spacing to keep links centered */}
          <div className="w-[160px] hidden md:block"></div>
        </div>
      </header>'''
replace_in_file('src/components/AvatarSelectView.jsx', av_old, av_new)

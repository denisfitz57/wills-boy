import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, MapPin, Users, Calendar, ChevronRight, Menu, X, Search } from 'lucide-react'
import memoirData from './data/memoir_data.json'

function App() {
  const [activeChapterId, setActiveChapterId] = useState(memoirData[0]?.id || 0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Open by default for larger screens
  const [searchTerm, setSearchTerm] = useState('')

  const activeChapter = useMemo(() =>
    memoirData.find(c => c.id === activeChapterId),
    [activeChapterId]
  )

  const filteredChapters = useMemo(() => {
    if (!searchTerm) return memoirData
    const lower = searchTerm.toLowerCase()
    return memoirData.filter(c =>
      c.chapter.toLowerCase().includes(lower) ||
      c.events.toLowerCase().includes(lower) ||
      c.characters.some(char => char.toLowerCase().includes(lower)) ||
      (c.full_text && c.full_text.toLowerCase().includes(lower))
    )
  }, [searchTerm])

  return (
    <div className="flex flex-col h-screen text-gray-100 bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#1a1a1a]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Book className="text-[#d4af37]" size={24} />
          <h1 className="text-xl font-semibold tracking-wide">Will's Boy <span className="text-[#666] font-normal text-sm ml-2">by Wright Morris</span></h1>
        </div>
        {/* Hamburger/Menu Button Removed as requested */}
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay (Backdrop) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed md:relative z-40 h-full bg-[#111] border-r border-[#333] flex flex-col
            transition-all duration-300 ease-in-out transform
            top-0 left-0
            ${/* Mobile Logic: Slide in/out */ ''}
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${/* Desktop Logic: Always translated 0, toggle width */ ''}
            md:translate-x-0
            ${/* Width Control */ ''}
            w-80 
            ${isSidebarOpen ? 'md:w-96' : 'md:w-0 md:border-none md:overflow-hidden'}
          `}
        >
          {/* Mobile "Chapters" Header + Close Button Removed as requested */}

          <div className="p-4 border-b border-[#333]">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d4af37] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg pl-12 pr-4 py-3 text-base w-full focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-gray-600"
              />
            </div>
            {searchTerm && (
              <p className="text-xs text-[#d4af37] mt-2 ml-1">
                Found {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredChapters.map((chapter) => {
              // Helper to find all snippets
              const getSnippets = () => {
                if (!searchTerm || !chapter.full_text) return null
                const lowerText = chapter.full_text.toLowerCase()
                const lowerTerm = searchTerm.toLowerCase()
                if (lowerTerm.length < 2) return null // avoid too many matches for single chars

                const snippets = []
                let startIndex = 0
                let matchIndex = lowerText.indexOf(lowerTerm, startIndex)

                // Find up to 5 matches to avoid clutter
                while (matchIndex !== -1 && snippets.length < 5) {
                  const start = Math.max(0, matchIndex - 30)
                  const end = Math.min(chapter.full_text.length, matchIndex + lowerTerm.length + 30)
                  let text = chapter.full_text.slice(start, end)

                  if (start > 0) text = '...' + text
                  if (end < chapter.full_text.length) text = text + '...'

                  snippets.push(text)
                  startIndex = matchIndex + lowerTerm.length
                  matchIndex = lowerText.indexOf(lowerTerm, startIndex)
                }

                if (snippets.length === 0) return null

                // Highlight the term in each snippet
                return (
                  <div className="mt-3 space-y-2">
                    {snippets.map((snip, idx) => {
                      const parts = snip.split(new RegExp(`(${searchTerm})`, 'gi'))
                      return (
                        <div key={idx} className="text-xs text-gray-400 font-serif italic border-l-2 border-[#333] pl-2 leading-relaxed">
                          {parts.map((part, i) =>
                            part.toLowerCase() === lowerTerm ? <strong key={i} className="text-[#d4af37] bg-[#d4af37]/10 px-0.5 rounded">{part}</strong> : part
                          )}
                        </div>
                      )
                    })}
                    {matchIndex !== -1 && <div className="text-xs text-gray-600 pl-2 italic">...and more</div>}
                  </div>
                )
              }

              const snippets = getSnippets()

              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setActiveChapterId(chapter.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`
                    w-full text-left px-5 py-4 rounded-xl flex items-start gap-4 transition-all duration-200 group
                    ${activeChapterId === chapter.id
                      ? 'bg-[#242424] border border-[#d4af37]/30 shadow-lg translate-x-1'
                      : 'hover:bg-[#1a1a1a] border border-transparent hover:border-[#333] hover:translate-x-1'}
                  `}
                >
                  <div className={`mt-1 min-w-[28px] h-7 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${activeChapterId === chapter.id ? 'bg-[#d4af37] text-black' : 'bg-[#333] text-gray-400 group-hover:bg-[#444]'}`}>
                    {chapter.id + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium transition-colors truncate ${activeChapterId === chapter.id ? 'text-[#d4af37]' : 'text-gray-200 group-hover:text-white'}`}>
                      {chapter.chapter}
                    </h3>

                    {/* Show snippets if found, otherwise events */}
                    {snippets ? snippets : (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1 font-light opacity-80 group-hover:opacity-100 transition-opacity">
                        {chapter.events}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}

            {filteredChapters.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-lg">
                <p>No chapters found matching "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-[#d4af37] text-sm hover:underline">
                  Clear search
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6 md:p-12 lg:p-20 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapterId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto space-y-12 pb-20"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#d4af37] uppercase tracking-widest text-sm font-bold">
                  <span>Chapter {activeChapter?.id + 1}</span>
                  <span className="w-12 h-[1px] bg-[#d4af37]"></span>
                </div>
                <h2 className="text-5xl md:text-6xl font-light text-white leading-tight">{activeChapter?.chapter}</h2>
              </div>

              {/* Meta Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
                  <div className="flex items-center gap-3 text-gray-400 mb-4">
                    <MapPin size={20} />
                    <h4 className="text-base font-semibold uppercase tracking-wider">Locations</h4>
                  </div>
                  <div className="flex flex-wrap gap-4 leading-relaxed mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {activeChapter?.locations.length > 0 ? (
                      activeChapter.locations.map((loc, idx) => (
                        <span
                          key={idx}
                          className="bg-[#242424] text-sm px-4 py-2 rounded-lg text-gray-200 border border-[#444] whitespace-nowrap shadow-sm"
                          style={{ display: 'inline-block', marginRight: '0.5rem', marginBottom: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#242424', border: '1px solid #444', borderRadius: '0.5rem' }}
                        >
                          {loc}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 italic text-sm">No locations listed</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
                  <div className="flex items-center gap-3 text-gray-400 mb-4">
                    <Users size={20} />
                    <h4 className="text-base font-semibold uppercase tracking-wider">Characters</h4>
                  </div>
                  <div className="flex flex-wrap gap-4 leading-relaxed mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {activeChapter?.characters.length > 0 ? (
                      activeChapter.characters.map((char, idx) => (
                        <span
                          key={idx}
                          className="bg-[#242424] text-sm px-4 py-2 rounded-lg text-gray-200 border border-[#444] whitespace-nowrap shadow-sm"
                          style={{ display: 'inline-block', marginRight: '0.5rem', marginBottom: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#242424', border: '1px solid #444', borderRadius: '0.5rem' }}
                        >
                          {char}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 italic text-sm">No characters listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Section */}
              <div className="bg-[#1a1a1a] p-10 rounded-2xl border border-[#333] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d4af37]"></div>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Calendar size={24} className="text-[#d4af37]" />
                  Key Events
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  {activeChapter?.events}
                </p>
              </div>

              {/* Text Excerpt / Full Text */}
              <div className="pt-12 pb-24">
                <h3 className="text-3xl font-light text-[#d4af37] mb-12 font-display border-b border-[#333] pb-6 tracking-widest text-center">
                  Passage
                </h3>

                <div className="max-w-4xl mx-auto px-4 md:px-8">
                  <div
                    className="prose prose-invert prose-xl md:prose-2xl max-w-none text-gray-300 font-serif leading-loose tracking-wide opacity-90"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      textAlign: "justify"
                    }}
                  >
                    {activeChapter?.full_text ? (
                      activeChapter.full_text.split('\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        // Check if it looks like a page number or artifact (short numbers/lines)
                        if (trimmed.length < 5 && /^\d+$/.test(trimmed)) return null;

                        return (
                          <p key={idx} className="mb-8 first-letter:text-6xl first-letter:font-display first-letter:text-[#d4af37] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                            {trimmed}
                          </p>
                        )
                      }).slice(0, 20) // Increased preview size
                    ) : (
                      <p className="italic text-gray-600 text-center text-xl">Text not available.</p>
                    )}

                    {activeChapter?.full_text && (
                      <div className="mt-16 pt-10 border-t border-[#333] flex flex-col items-center gap-4">
                        <div className="w-24 h-[1px] bg-[#d4af37]"></div>
                        <p className="text-base text-gray-500 font-sans tracking-widest uppercase">End of Preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App

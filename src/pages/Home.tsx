import { useState, useEffect } from 'react';
import { worksData, profileData } from '../data';
import { Work, Category } from '../types';
import { Play, ArrowUpRight, Loader2, Film } from 'lucide-react';

const CATEGORIES: ('全部' | Category)[] = ['全部', '故事片', '企业宣传片', 'TVC广告', '地产广告', '电商广告', 'MG动画', 'Ai视频'];

const getEmbedInfo = (url: string) => {
  if (!url) return null;
  // Bilibili
  const bvidMatch = url.match(/(BV[a-zA-Z0-9]+)/);
  if (bvidMatch) {
    return { type: 'bilibili', src: `https://player.bilibili.com/player.html?bvid=${bvidMatch[1]}&page=1&high_quality=1&danmaku=0&autoplay=1` };
  }
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) {
    return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1` };
  }
  // Direct MP4
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return { type: 'direct', src: url };
  }
  return null;
};

export default function Home() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'全部' | Category>('全部');
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    // Load from static data
    setWorks(worksData);
    setLoading(false);
  }, []);

  const filteredWorks = activeCategory === '全部' 
    ? works 
    : works.filter(w => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F27D26] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference px-6 py-8 flex justify-between items-center">
        <div className="text-sm font-bold tracking-[0.2em] uppercase">Director's Cut</div>
        <div className="flex gap-8 text-xs font-semibold tracking-[0.1em] uppercase">
          <a href="#" className="hover:text-[#F27D26] transition-colors">Selected Works</a>
          <a href="#contact" className="hover:text-[#F27D26] transition-colors">Contact</a>
        </div>
      </nav>

      <main className="px-6 md:px-12 pb-24">
        {/* Hero Section - Editorial Style */}
        <div className="pt-40 pb-20 md:pt-56 md:pb-32">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[#F27D26] text-xs font-bold tracking-[0.2em] uppercase mb-6">{profileData.name} / {profileData.title}</p>
            <h1 className="font-['Anton'] text-[15vw] md:text-[12vw] leading-[0.85] tracking-[-0.02em] uppercase m-0 p-0">
              {profileData.heroTitleLine1}<br />
              <span className="text-zinc-600">{profileData.heroTitleLine2}</span>
            </h1>
            <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 md:col-start-9">
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {profileData.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories - Pill Navigation */}
        <div className="max-w-[1400px] mx-auto mb-16 md:mb-24">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPlayingId(null); // Reset playing video when changing category
                }}
                className={`px-6 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Works Grid - Dark Luxury */}
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="py-32 border-t border-zinc-900">
              <p className="text-zinc-600 text-sm tracking-widest uppercase">No works found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
              {filteredWorks.map((work, index) => {
                const embedInfo = getEmbedInfo(work.videoUrl || '');
                const isPlaying = playingId === work.id;
                const CardWrapper = embedInfo ? 'div' : 'a';
                const wrapperProps = embedInfo ? {} : {
                  href: work.videoUrl || '#',
                  target: work.videoUrl ? "_blank" : "_self",
                  rel: "noreferrer"
                };

                return (
                  <CardWrapper 
                    key={work.id} 
                    {...wrapperProps as any}
                    className="group block cursor-pointer"
                    onMouseEnter={() => setHoveredWork(work.id)}
                    onMouseLeave={() => setHoveredWork(null)}
                    onClick={(e) => {
                      if (embedInfo && !isPlaying && work.coverUrl) {
                        e.preventDefault();
                        setPlayingId(work.id);
                      }
                    }}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#111] mb-6 rounded-lg">
                      {(isPlaying && embedInfo) || (!work.coverUrl && embedInfo) ? (
                        embedInfo.type === 'direct' ? (
                          <video src={embedInfo.src} controls autoPlay={isPlaying} className="w-full h-full object-cover" />
                        ) : (
                          <iframe 
                            src={embedInfo.src.replace('&autoplay=1', '')} // 如果直接显示，不要自动播放
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                            loading="lazy"
                          />
                        )
                      ) : (
                        <>
                          {work.coverUrl ? (
                            <img 
                              src={work.coverUrl} 
                              alt={work.title} 
                              className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                              <Film className="w-12 h-12 opacity-20" />
                            </div>
                          )}
                          
                          {/* Hover Overlay */}
                          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 flex items-center justify-center ${hoveredWork === work.id ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm transform transition-transform duration-500 scale-90 group-hover:scale-100">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-[#F27D26] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                          {String(index + 1).padStart(2, '0')} — {work.category}
                        </div>
                        <h3 className="text-xl md:text-2xl font-light tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                          {work.title}
                        </h3>
                        {(work.resolution || work.duration) && (
                          <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400 font-mono">
                            {work.resolution && <span>{work.resolution}</span>}
                            {work.resolution && work.duration && <span className="w-1 h-1 rounded-full bg-zinc-700"></span>}
                            {work.duration && <span>{work.duration}</span>}
                          </div>
                        )}
                        {work.description && (
                          <p className="text-sm text-zinc-500 mt-4 line-clamp-2 font-light max-w-md">
                            {work.description}
                          </p>
                        )}
                      </div>
                      {!isPlaying && (
                        <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all duration-300 shrink-0">
                          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-black transition-colors" />
                        </div>
                      )}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-[1400px] mx-auto mt-32 mb-16 border-t border-zinc-900 pt-16" id="contact">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-light tracking-tight text-white mb-4">合作联系</h2>
            <p className="text-zinc-500 font-light mb-8">有项目合作意向？欢迎与我联系。</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#111] p-6 rounded-2xl border border-zinc-800/50">
                <h3 className="text-[#F27D26] text-xs font-bold tracking-[0.2em] uppercase mb-2">电话联系</h3>
                <p className="text-2xl font-light text-white">{profileData.phone}</p>
                <p className="text-xs text-zinc-600 mt-2">工作日 全天 可接听</p>
              </div>
              <div className="bg-[#111] p-6 rounded-2xl border border-zinc-800/50">
                <h3 className="text-[#F27D26] text-xs font-bold tracking-[0.2em] uppercase mb-2">邮箱联系</h3>
                <p className="text-xl font-light text-white break-all">{profileData.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} {profileData.name} Portfolio
          </p>
          <a href="#" className="text-zinc-600 hover:text-white text-xs tracking-widest uppercase transition-colors">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}

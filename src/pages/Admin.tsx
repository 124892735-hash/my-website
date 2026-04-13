import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Work, Category } from '../types';
import { LogOut, Plus, Trash2, Edit2, X, Image as ImageIcon, Film, Loader2, CheckCircle2, Link as LinkIcon, RefreshCw } from 'lucide-react';

const CATEGORIES: Category[] = ['故事片', '企业宣传片', 'TVC广告', '地产广告', '电商广告', 'MG动画', 'Ai视频'];

export default function Admin({ user }: { user: any }) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editCoverUrlInput, setEditCoverUrlInput] = useState<string>('');
  const [isEditingUploading, setIsEditingUploading] = useState(false);
  const [editError, setEditError] = useState('');
  const [isEditFetchingCover, setIsEditFetchingCover] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('TVC广告');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('');
  const [duration, setDuration] = useState('');
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  // Batch upload state
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchLinks, setBatchLinks] = useState('');
  const [batchCategory, setBatchCategory] = useState<Category>('TVC广告');
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, text: '' });

  // Auto-cover state
  const [suggestedCoverUrl, setSuggestedCoverUrl] = useState<string>('');
  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [useAutoCover, setUseAutoCover] = useState(false);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map created_at to createdAt for frontend compatibility
        const mappedWorks = (data || []).map(item => ({
          ...item,
          createdAt: item.created_at,
          ownerId: item.owner_id,
          coverUrl: item.cover_url,
          videoUrl: item.video_url
        }));
        
        setWorks(mappedWorks as Work[]);
      } catch (err) {
        console.error('Error fetching works:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('admin_works_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'works' }, () => {
        fetchWorks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBilibiliInfo = async (url: string, signal?: AbortSignal): Promise<{ title: string, coverUrl: string }> => {
    const bvidMatch = url.match(/(BV[a-zA-Z0-9]+)/);
    if (!bvidMatch || !bvidMatch[1]) throw new Error('未识别到B站BV号');
    
    const bvid = bvidMatch[1];
    const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
    
    let imageUrl = '';
    let title = '';

    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, { signal });
      const data = await res.json();
      if (data.contents) {
        const bilibiliData = JSON.parse(data.contents);
        if (bilibiliData.data) {
          imageUrl = bilibiliData.data.pic || '';
          title = bilibiliData.data.title || '';
        }
      }
    } catch (e) {
      console.error("First proxy failed", e);
    }

    if (!imageUrl) {
      try {
        const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`, { signal });
        const data = await res.json();
        if (data.data) {
          imageUrl = data.data.pic || '';
          title = data.data.title || '';
        }
      } catch (e) {
        console.error("Second proxy failed", e);
      }
    }

    if (imageUrl) {
      if (imageUrl.startsWith('http://')) imageUrl = imageUrl.replace('http://', 'https://');
      return { title, coverUrl: imageUrl };
    }
    
    throw new Error('网络波动导致获取失败，请重试或手动输入图片链接');
  };

  const handleManualFetchCover = async () => {
    if (!videoUrl) {
      alert('请先填写视频链接');
      return;
    }
    setIsFetchingCover(true);
    try {
      const info = await fetchBilibiliInfo(videoUrl);
      setCoverUrlInput(info.coverUrl);
      if (info.title && !title) {
        setTitle(info.title);
      }
      setUseAutoCover(false);
      setSuggestedCoverUrl('');
    } catch (err: any) {
      alert(err.message || '获取失败，请手动输入封面链接');
    } finally {
      setIsFetchingCover(false);
    }
  };

  const handleFetchEditCover = async () => {
    if (!editingWork?.videoUrl) {
      alert('请先填写视频链接');
      return;
    }
    setIsEditFetchingCover(true);
    try {
      const info = await fetchBilibiliInfo(editingWork.videoUrl);
      setEditCoverUrlInput(info.coverUrl);
    } catch (err: any) {
      alert(err.message || '获取失败，请手动输入封面链接');
    } finally {
      setIsEditFetchingCover(false);
    }
  };

  // Watch videoUrl changes to fetch cover
  useEffect(() => {
    if (!videoUrl || !videoUrl.startsWith('http')) {
      setSuggestedCoverUrl('');
      return;
    }

    const fetchCover = async () => {
      setIsFetchingCover(true);
      setSuggestedCoverUrl('');
      
      // Add a timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      try {
        let imageUrl = '';

        // 1. Check if it's a Bilibili link
        const bvidMatch = videoUrl.match(/(BV[a-zA-Z0-9]+)/);
        if (bvidMatch && bvidMatch[1]) {
          try {
            const info = await fetchBilibiliInfo(videoUrl, controller.signal);
            imageUrl = info.coverUrl;
          } catch (e) {
            console.error("Auto-fetch Bilibili cover failed", e);
          }
        } else {
          // 2. Generic HTML parsing (og:image)
          const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(videoUrl)}`, { signal: controller.signal });
          const data = await res.json();
          if (data.contents) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            const ogImage = doc.querySelector('meta[property="og:image"]');
            const twitterImage = doc.querySelector('meta[name="twitter:image"]');
            const itempropImage = doc.querySelector('meta[itemprop="image"]');

            if (ogImage) imageUrl = ogImage.getAttribute('content') || '';
            else if (twitterImage) imageUrl = twitterImage.getAttribute('content') || '';
            else if (itempropImage) imageUrl = itempropImage.getAttribute('content') || '';
          }
        }

        if (imageUrl) {
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          }
          // Upgrade http to https for Bilibili images
          imageUrl = imageUrl.replace(/^http:\/\//i, 'https://');
          setSuggestedCoverUrl(imageUrl);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.error("Fetch cover timed out");
        } else {
          console.error("Failed to fetch metadata", err);
        }
      } finally {
        clearTimeout(timeoutId);
        setIsFetchingCover(false);
      }
    };

    const timeoutId = setTimeout(fetchCover, 1000);
    return () => clearTimeout(timeoutId);
  }, [videoUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!coverUrlInput && !useAutoCover)) {
      setError('请填写标题并提供封面图链接（或使用自动获取的封面）');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setError('');

    try {
      let finalCoverUrl = coverUrlInput;

      if (useAutoCover && suggestedCoverUrl) {
        finalCoverUrl = suggestedCoverUrl;
      }

      // Save to Firestore
      setUploadProgress(50);
      const workData: any = {
        title: title.substring(0, 100),
        category,
        cover_url: finalCoverUrl,
        owner_id: user.id,
      };
      if (videoUrl) workData.video_url = videoUrl;
      if (description) workData.description = description.substring(0, 2000);
      if (resolution) workData.resolution = resolution.substring(0, 50);
      if (duration) workData.duration = duration.substring(0, 50);

      const { error: insertError } = await supabase.from('works').insert([workData]);
      if (insertError) throw insertError;

      setUploadProgress(100);
      setUploadSuccess(true);

      // Reset form after a short delay
      setTimeout(() => {
        setTitle('');
        setCategory('TVC广告');
        setVideoUrl('');
        setDescription('');
        setResolution('');
        setDuration('');
        setCoverUrlInput('');
        setSuggestedCoverUrl('');
        setUseAutoCover(false);
        setIsAdding(false);
        setUploadSuccess(false);
        setUploading(false);
      }, 1500);

    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || '保存失败，请检查网络连接或稍后重试');
      setUploading(false);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const links = batchLinks.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
    if (links.length === 0) {
      setError('请输入有效的视频链接（每行一个）');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setError('');
    setBatchProgress({ current: 0, total: links.length, text: '准备解析...' });

    let successCount = 0;

    try {
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        setBatchProgress({ current: i, total: links.length, text: `正在解析第 ${i + 1}/${links.length} 个链接...` });

        let itemTitle = `作品 ${Date.now().toString().slice(-4)}`;
        let itemCoverUrl = '';
        let finalCoverUrl = '';

        try {
          // 1. Parse Bilibili
          const bvidMatch = link.match(/(BV[a-zA-Z0-9]+)/);
          if (bvidMatch && bvidMatch[1]) {
            const info = await fetchBilibiliInfo(link);
            if (info.title) itemTitle = info.title;
            if (info.coverUrl) itemCoverUrl = info.coverUrl;
          }
        } catch (apiErr) {
          console.error(`Failed to parse link ${link}`, apiErr);
        }

        setBatchProgress({ current: i, total: links.length, text: `正在上传第 ${i + 1}/${links.length} 个封面...` });

        if (itemCoverUrl) {
          finalCoverUrl = itemCoverUrl;
        }

        setBatchProgress({ current: i, total: links.length, text: `正在保存第 ${i + 1}/${links.length} 个作品...` });

        try {
          const workData: any = {
            title: itemTitle.substring(0, 100),
            category: batchCategory,
            cover_url: finalCoverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            owner_id: user.id,
          };
          if (link) workData.video_url = link;

          const { error: insertError } = await supabase.from('works').insert([workData]);
          if (insertError) throw insertError;
          successCount++;
        } catch (dbErr: any) {
          console.error(`Failed to save work to DB for ${link}`, dbErr);
          setError(`第 ${i + 1} 个作品保存失败: ${dbErr.message}`);
        }
      }

      setBatchProgress({ current: links.length, total: links.length, text: `导入完成！成功 ${successCount} 个` });
      setUploadSuccess(true);

      setTimeout(() => {
        setBatchLinks('');
        setIsAdding(false);
        setUploading(false);
        setUploadSuccess(false);
        setIsBatchMode(false);
      }, 2000);

    } catch (err: any) {
      console.error("Batch upload error:", err);
      setError('批量导入过程中发生错误');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个作品吗？')) {
      try {
        const { error } = await supabase.from('works').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork) return;

    setIsEditingUploading(true);
    setEditError('');

    try {
      const workData: any = {
        title: editingWork.title.substring(0, 100),
        category: editingWork.category,
        cover_url: editCoverUrlInput || editingWork.coverUrl,
      };
      if (editingWork.videoUrl) workData.video_url = editingWork.videoUrl;
      if (editingWork.description) workData.description = editingWork.description.substring(0, 2000);
      if (editingWork.resolution) workData.resolution = editingWork.resolution.substring(0, 50);
      if (editingWork.duration) workData.duration = editingWork.duration.substring(0, 50);

      const { error: updateError } = await supabase
        .from('works')
        .update(workData)
        .eq('id', editingWork.id);
      
      if (updateError) throw updateError;
      
      setEditingWork(null);
      setEditCoverUrlInput('');
      setIsEditingUploading(false);
      
    } catch (err: any) {
      console.error("Edit upload error:", err);
      setEditError('更新失败：' + (err.message || '未知错误'));
      setIsEditingUploading(false);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `works/${editingWork.id}`);
      } catch (e) {
        // Ignore the throw so we don't break the UI state
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">作品集管理后台</h1>
            <p className="text-zinc-400 mt-1">管理您的导演作品，实时同步至前台</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors font-medium text-sm"
            >
              返回前台首页
            </Link>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isAdding ? '取消添加' : '添加新作品'}
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {isAdding && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-12 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-white">添加新作品</h2>
              <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800 w-fit">
                <button
                  type="button"
                  onClick={() => setIsBatchMode(false)}
                  className={`px-4 py-1.5 text-sm rounded-md transition-colors ${!isBatchMode ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  单件添加
                </button>
                <button
                  type="button"
                  onClick={() => setIsBatchMode(true)}
                  className={`px-4 py-1.5 text-sm rounded-md transition-colors ${isBatchMode ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  批量导入
                </button>
              </div>
            </div>

            {isBatchMode ? (
              <form onSubmit={handleBatchSubmit} className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-400 mb-1">批量导入说明</h4>
                  <p className="text-xs text-blue-300/80">
                    请在下方粘贴视频链接（每行一个）。系统会自动解析 Bilibili 链接的标题和封面，并批量创建作品。
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">统一分类 (必填)</label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value as Category)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">视频链接列表 (每行一个)</label>
                  <textarea
                    value={batchLinks}
                    onChange={(e) => setBatchLinks(e.target.value)}
                    rows={8}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all resize-none font-mono text-sm"
                    placeholder="https://www.bilibili.com/video/BV1...&#10;https://www.bilibili.com/video/BV2..."
                  />
                </div>

                <div className="flex flex-col items-end pt-4 border-t border-zinc-800 gap-4">
                  {uploading && !uploadSuccess && (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-xs text-zinc-400 mb-1">
                        <span>{batchProgress.text}</span>
                        <span>{batchProgress.total > 0 ? Math.round((batchProgress.current / batchProgress.total) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  )}
                  
                  {uploadSuccess && (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {batchProgress.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || uploadSuccess || !batchLinks.trim()}
                    className="bg-white text-black px-8 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading && !uploadSuccess ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        正在导入...
                      </>
                    ) : uploadSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        导入完成
                      </>
                    ) : (
                      '开始批量导入 (自动提取封面)'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Image URL */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">封面图链接 (必填)</label>
                  <div className="space-y-4">
                    <input
                      type="url"
                      value={coverUrlInput}
                      onChange={(e) => {
                        setCoverUrlInput(e.target.value);
                        setUseAutoCover(false);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                    
                    <div className="aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      {coverUrlInput || (useAutoCover && suggestedCoverUrl) ? (
                        <img 
                          src={useAutoCover ? suggestedCoverUrl : coverUrlInput} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="text-center text-zinc-600">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <span className="text-sm">封面预览</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">作品名称 (必填)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                      placeholder="例如：2024 某某品牌 TVC"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">作品分类 (必填)</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-zinc-400">视频链接 (选填)</label>
                      <button
                        type="button"
                        onClick={handleManualFetchCover}
                        disabled={isFetchingCover || !videoUrl}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {isFetchingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        一键提取B站封面
                      </button>
                    </div>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                      placeholder="例如：B站、新片场或 Vimeo 链接"
                    />
                    
                    {/* Auto Cover Suggestion */}
                    {isFetchingCover && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        正在尝试获取视频封面...
                      </div>
                    )}
                    {!isFetchingCover && suggestedCoverUrl && !useAutoCover && (
                      <div className="mt-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start gap-4">
                        <img 
                          src={suggestedCoverUrl} 
                          alt="Suggested cover" 
                          className="w-24 h-16 object-cover rounded-md bg-black"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-sm text-zinc-300 mb-2">检测到视频封面，是否直接使用？</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCoverUrlInput('');
                              setUseAutoCover(true);
                            }}
                            className="text-xs bg-white text-black px-3 py-1.5 rounded-md font-medium hover:bg-zinc-200 transition-colors"
                          >
                            使用此封面
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">分辨率 (选填)</label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                    placeholder="例如：4K, 1080p"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">时长 (选填)</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                    placeholder="例如：3:00, 15s"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">作品备注 (选填)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all resize-none"
                  placeholder="可以写一些关于这个作品的介绍、你的职务（导演/剪辑等）..."
                />
              </div>

              {/* Platform suggestions */}
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 mt-6">
                <h4 className="text-sm font-medium text-zinc-300 mb-3">💡 推荐的视频托管平台（可批量上传视频后获取链接）：</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a href="https://www.bilibili.com" target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors">1. Bilibili (B站)</a>
                  <a href="https://www.xinpianchang.com" target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors">2. 新片场</a>
                  <a href="https://vimeo.com" target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors">3. Vimeo</a>
                  <a href="https://v.qq.com" target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors">4. 腾讯视频</a>
                  <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors">5. YouTube</a>
                </div>
              </div>

              <div className="flex flex-col items-end pt-4 border-t border-zinc-800 gap-4">
                {uploading && !uploadSuccess && (
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>正在上传...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
                
                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    上传完成！
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || uploadSuccess}
                  className="bg-white text-black px-8 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading && !uploadSuccess ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      正在保存...
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      已保存
                    </>
                  ) : (
                    '保存作品'
                  )}
                </button>
              </div>
            </form>
            )}
          </div>
        )}

        {/* Works List */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Film className="w-5 h-5 text-zinc-400" />
            已上传作品 ({works.length})
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
            </div>
          ) : works.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 border-dashed">
              <p className="text-zinc-500">还没有上传任何作品，点击上方“添加新作品”开始。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <div key={work.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                  <div className="aspect-video relative overflow-hidden bg-zinc-950">
                    <img 
                      src={work.coverUrl} 
                      alt={work.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium text-white">
                      {work.category}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingWork(work);
                          setEditCoverUrlInput(work.coverUrl);
                        }}
                        className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded-lg backdrop-blur-md"
                        title="编辑作品"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-md"
                        title="删除作品"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white truncate">{work.title}</h3>
                    {work.description && (
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{work.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingWork && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-xl font-semibold text-white">编辑作品</h3>
              <button 
                onClick={() => setEditingWork(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {editError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                  {editError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">作品名称</label>
                <input
                  type="text"
                  value={editingWork.title}
                  onChange={(e) => setEditingWork({...editingWork, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">作品分类</label>
                <select
                  value={editingWork.category}
                  onChange={(e) => setEditingWork({...editingWork, category: e.target.value as Category})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">视频链接</label>
                <input
                  type="url"
                  value={editingWork.videoUrl || ''}
                  onChange={(e) => setEditingWork({...editingWork, videoUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">分辨率</label>
                  <input
                    type="text"
                    value={editingWork.resolution || ''}
                    onChange={(e) => setEditingWork({...editingWork, resolution: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                    placeholder="例如：4K, 1080p"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">时长</label>
                  <input
                    type="text"
                    value={editingWork.duration || ''}
                    onChange={(e) => setEditingWork({...editingWork, duration: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                    placeholder="例如：3:00, 15s"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">封面图链接</label>
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img 
                      src={editCoverUrlInput || editingWork.coverUrl} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={editCoverUrlInput}
                      onChange={(e) => setEditCoverUrlInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                      placeholder="输入新的图片链接"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-500">输入新链接将替换原有封面。如果留空，则保留原封面。</p>
                      <button
                        type="button"
                        onClick={handleFetchEditCover}
                        disabled={isEditFetchingCover || !editingWork.videoUrl}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {isEditFetchingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        一键提取B站封面
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">作品备注</label>
                <textarea
                  value={editingWork.description || ''}
                  onChange={(e) => setEditingWork({...editingWork, description: e.target.value})}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>
              <div className="flex flex-col items-end pt-4 gap-4">
                <div className="flex justify-end gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWork(null);
                      setEditCoverUrlInput('');
                      setEditError('');
                    }}
                    disabled={isEditingUploading}
                    className="px-6 py-2.5 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isEditingUploading}
                    className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isEditingUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      '保存修改'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

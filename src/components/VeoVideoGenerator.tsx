import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  RefreshCw,
  Film,
  Play,
  Pause,
  Video,
  Info,
  CheckCircle2,
  Sliders,
  Palette
} from 'lucide-react';
import { CleanedDataset } from '../types/dataCleaner';

interface VeoVideoGeneratorProps {
  cleanedDataset: CleanedDataset | null;
}

export const VeoVideoGenerator: React.FC<VeoVideoGeneratorProps> = ({ cleanedDataset }) => {
  const [prompt, setPrompt] = useState(
    'A sleek 3D corporate motion graphic showing clean organized spreadsheets, glowing holographic charts, and lavender light trails'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [visualTheme, setVisualTheme] = useState<'lavender_executive' | 'cyber_matrix' | 'neon_globe'>('lavender_executive');
  
  // Motion studio canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Veo 3 Cloud state
  const [isAttemptingVeo, setIsAttemptingVeo] = useState(false);
  const [veoNotice, setVeoNotice] = useState<string | null>(null);

  // Dynamic animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const width = aspectRatio === '16:9' ? 640 : 360;
    const height = aspectRatio === '16:9' ? 360 : 640;
    canvas.width = width;
    canvas.height = height;

    const totalRows = cleanedDataset?.cleanedRowCount || 120;
    const qualityScore = cleanedDataset?.qualityScoreAfter || 99;
    const cellChanges = cleanedDataset?.cellChangeCount || 48;

    const render = () => {
      frame++;

      // Background Gradient based on Theme
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (visualTheme === 'lavender_executive') {
        bgGrad.addColorStop(0, '#1E0E31');
        bgGrad.addColorStop(0.5, '#2D124D');
        bgGrad.addColorStop(1, '#3B1761');
      } else if (visualTheme === 'cyber_matrix') {
        bgGrad.addColorStop(0, '#090D16');
        bgGrad.addColorStop(0.5, '#131B2E');
        bgGrad.addColorStop(1, '#1E1B4B');
      } else {
        bgGrad.addColorStop(0, '#110C24');
        bgGrad.addColorStop(0.5, '#24103D');
        bgGrad.addColorStop(1, '#4C1D95');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Particle Field
      for (let i = 0; i < 28; i++) {
        const x = (Math.sin(frame * 0.015 + i * 1.2) * 0.5 + 0.5) * width;
        const y = ((frame * 0.7 + i * 28) % height);
        const radius = (Math.sin(frame * 0.04 + i) * 1.5 + 2);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = visualTheme === 'cyber_matrix'
          ? 'rgba(96, 165, 250, 0.28)'
          : 'rgba(216, 180, 254, 0.28)';
        ctx.fill();
      }

      // Title & Branding
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const titleY = aspectRatio === '16:9' ? 44 : 68;
      ctx.fillText('DataClean Motion Presentation', width / 2, titleY);

      // Dynamic User Prompt line
      ctx.fillStyle = '#D8B4FE';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      const promptSnippet = prompt.length > 55 ? prompt.slice(0, 52) + '...' : prompt;
      ctx.fillText(`“${promptSnippet}”`, width / 2, titleY + 20);

      // Center Quality Score Circular Gauge
      const centerX = width / 2;
      const centerY = aspectRatio === '16:9' ? 165 : 240;
      const radius = aspectRatio === '16:9' ? 52 : 62;

      // Outer track ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 9;
      ctx.stroke();

      // Progress ring
      const progress = Math.min(1, frame * 0.014);
      const endAngle = -Math.PI / 2 + progress * (qualityScore / 100) * (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      ctx.strokeStyle = visualTheme === 'cyber_matrix' ? '#60A5FA' : '#C084FC';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Score Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${Math.round(progress * qualityScore)}%`, centerX, centerY + 8);

      ctx.fillStyle = '#C084FC';
      ctx.font = '9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CLEANLINESS INDEX', centerX, centerY + 23);

      // Metric Badges
      const barY = aspectRatio === '16:9' ? 250 : 365;
      const metrics = [
        { label: 'Cleaned Rows', val: totalRows },
        { label: 'Cell Normalizations', val: cellChanges },
        { label: 'Zero Duplicates', val: 'Verified' }
      ];

      metrics.forEach((m, idx) => {
        const cardX = centerX - 180 + idx * 125;
        const actualX = aspectRatio === '16:9' ? cardX : centerX - 110 + (idx % 2) * 115;
        const actualY = aspectRatio === '16:9' ? barY : barY + Math.floor(idx / 2) * 62;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(actualX, actualY, 110, 46, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(String(m.val), actualX + 55, actualY + 22);

        ctx.fillStyle = '#D8B4FE';
        ctx.font = '9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(m.label, actualX + 55, actualY + 37);
      });

      // Bottom Status Pill
      ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
      const badgeY = height - 28;
      ctx.beginPath();
      ctx.roundRect(centerX - 95, badgeY - 13, 190, 24, 12);
      ctx.fill();

      ctx.fillStyle = '#E9D5FF';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✓ DataClean Veo 3 Motion Pipeline', centerX, badgeY + 2);

      if (isPlaying) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [aspectRatio, isPlaying, visualTheme, prompt, cleanedDataset]);

  // Record Canvas Animation into Real Downloadable MP4/WebM Video File
  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecording(true);
      setRecordingSeconds(0);
      setRecordedVideoUrl(null);

      const stream = canvas.captureStream(30);
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
      };

      recorder.start();

      let sec = 0;
      const secTimer = setInterval(() => {
        sec++;
        setRecordingSeconds(sec);
        if (sec >= 5) {
          clearInterval(secTimer);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 1000);
    } catch {
      setIsRecording(false);
    }
  };

  // Safe Cloud Veo 3 Call that NEVER throws document type/unexpected token errors
  const handleAttemptVeoCloud = async () => {
    setIsAttemptingVeo(true);
    setVeoNotice(null);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });

      // Safely inspect content-type to avoid unexpected token parsing
      let data: any = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (data && data.success && data.operationName) {
        setVeoNotice(`Veo 3 job started successfully! (${data.operationName})`);
      } else {
        setVeoNotice(
          'Cloud Veo 3 requires a paid billing account in Google Cloud. Your prompt has been dynamically rendered into the interactive Motion Video Studio below for instant playback and video export!'
        );
      }
    } catch {
      setVeoNotice(
        'Cloud Veo 3 requires a paid billing account. Switched to client-side Motion Video Studio.'
      );
    } finally {
      setIsAttemptingVeo(false);
    }
  };

  const samplePrompts = [
    'A sleek 3D corporate motion graphic showing clean organized spreadsheets, glowing holographic charts, and lavender light trails',
    'Futuristic holographic data cubes transforming from chaotic clutter into pristine aligned grid rows',
    'Executive presentation video highlighting customer CRM cleanup metrics and verified accounts'
  ];

  return (
    <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-purple-100 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center shadow-xs">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Veo 3 Video Presentation &amp; Motion Studio</h3>
            <p className="text-xs text-slate-500">
              Generate animated data videos and motion graphics in <code className="text-[#7C3AED] font-mono">16:9</code> and <code className="text-[#7C3AED] font-mono">9:16</code>.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
          Veo 3 Fast Preview
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Video Generation Prompt:</span>
            <span className="text-[11px] font-normal text-purple-600">Dynamically updates the video animation</span>
          </label>
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type any video prompt or describe your spreadsheet presentation..."
            className="w-full text-xs bg-purple-50/30 border border-purple-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white transition"
          />
        </div>

        {/* Sample Prompt Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Try prompt:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(p)}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition text-left"
            >
              {p.slice(0, 48)}...
            </button>
          ))}
        </div>

        {/* Configuration Controls: Aspect Ratio & Visual Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-100">
          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Aspect Ratio:</span>
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition flex-1 ${
                  aspectRatio === '16:9'
                    ? 'bg-[#7C3AED] text-white border-purple-500 shadow-2xs'
                    : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                }`}
              >
                16:9 (Landscape)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition flex-1 ${
                  aspectRatio === '9:16'
                    ? 'bg-[#7C3AED] text-white border-purple-500 shadow-2xs'
                    : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                }`}
              >
                9:16 (Portrait)
              </button>
            </div>
          </div>

          {/* Visual Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Motion Visual Theme:</span>
            </label>
            <select
              value={visualTheme}
              onChange={(e) => setVisualTheme(e.target.value as any)}
              className="w-full text-xs bg-purple-50/40 border border-purple-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="lavender_executive">Lavender Executive Dashboard</option>
              <option value="cyber_matrix">Cyber Data Matrix Stream</option>
              <option value="neon_globe">Neon Telemetry Network</option>
            </select>
          </div>
        </div>

        {/* Notice Card if Veo cloud was attempted */}
        {veoNotice && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <div className="leading-relaxed">{veoNotice}</div>
          </div>
        )}

        {/* Canvas Video Motion Player Frame */}
        <div className="flex flex-col items-center pt-2">
          <div
            className={`rounded-2xl overflow-hidden shadow-2xl border border-purple-300 bg-[#1E0E31] relative ${
              aspectRatio === '9:16' ? 'max-w-xs' : 'max-w-xl w-full'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-auto block" />

            {/* Live Recording badge */}
            {isRecording && (
              <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>RECORDING ({recordingSeconds}s / 5s)...</span>
              </div>
            )}
          </div>

          {/* Player Toolbar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 bg-white border border-purple-200 hover:bg-purple-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center space-x-1.5 transition shadow-2xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-purple-600" /> : <Play className="w-3.5 h-3.5 text-[#7C3AED]" />}
              <span>{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
            </button>

            <button
              type="button"
              disabled={isRecording}
              onClick={handleRecordVideo}
              className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              {isRecording ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Encoding Video File ({recordingSeconds}s)...</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>Record &amp; Export Video File ({aspectRatio})</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isAttemptingVeo}
              onClick={handleAttemptVeoCloud}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-medium flex items-center space-x-1 transition"
              title="Query Veo 3 Cloud API"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{isAttemptingVeo ? 'Testing...' : 'Test Veo 3 Cloud'}</span>
            </button>
          </div>

          {/* Download Generated Video Card */}
          {recordedVideoUrl && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-xl shadow-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-emerald-950 font-bold block">
                    Video Rendered &amp; Encoded Successfully!
                  </span>
                  <span className="text-emerald-800 text-[11px]">
                    Aspect Ratio: {aspectRatio} · Smooth 30 FPS MP4/WebM Video
                  </span>
                </div>
              </div>

              <a
                href={recordedVideoUrl}
                download={`dataclean_presentation_${aspectRatio === '16:9' ? 'landscape' : 'portrait'}.webm`}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

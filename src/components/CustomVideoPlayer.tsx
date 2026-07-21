import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface CustomVideoPlayerProps {
  url: string;
  title: string;
  description?: string;
}

export default function CustomVideoPlayer({ url, title, description }: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted to ensure autoplay works seamlessly
  const [progress, setProgress] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userActive, setUserActive] = useState(false);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      setAspectRatio(video.videoWidth / video.videoHeight);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", handleProgress);
    return () => {
      video.removeEventListener("timeupdate", handleProgress);
    };
  }, []);

  // Listen for fullscreen state changes across different browsers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement || 
                                    !!(document as any).webkitFullscreenElement || 
                                    !!(document as any).mozFullScreenElement || 
                                    !!(document as any).msFullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Show/hide controls in fullscreen based on mouse movement
  useEffect(() => {
    if (!isFullscreen) {
      setUserActive(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setUserActive(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUserActive(false);
      }, 2500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    // Trigger on mount of fullscreen
    handleMouseMove();

    return () => {
      clearTimeout(timeoutId);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isFullscreen]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Autoplay/play failed:", err);
      });
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    const isCurrentlyFullscreen = !!document.fullscreenElement || 
                                  !!(document as any).webkitFullscreenElement || 
                                  !!(document as any).mozFullScreenElement || 
                                  !!(document as any).msFullscreenElement;

    if (!isCurrentlyFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group w-full bg-black overflow-hidden transition-all duration-500 ease-in-out ${
        isFullscreen ? "rounded-none border-none h-screen" : "border border-white/10 rounded-xl"
      }`}
      style={isFullscreen ? { aspectRatio: "auto" } : { aspectRatio: aspectRatio ? `${aspectRatio}` : "16/9" }}
    >
      {/* Video element (preserves correct ratio in all layouts) */}
      <video
        key={url}
        ref={videoRef}
        src={url}
        loop
        muted={isMuted}
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onClick={() => togglePlay()}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Dim/Glow overlay on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 flex flex-col justify-between p-4 md:p-6 z-10 ${
          isFullscreen 
            ? userActive 
              ? "opacity-100 cursor-default" 
              : "opacity-0 cursor-none"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        
        {/* Title */}
        <div className="flex justify-between items-start pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/5">
            <h4 className="font-syne text-xs font-semibold text-white tracking-wider">
              {title}
            </h4>
          </div>
        </div>

        {/* Play/Pause Large overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-14 h-14 bg-primary-container hover:scale-110 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_#ff5f1f] hover:shadow-[0_0_30px_#ff5f1f] transition-all duration-300 cursor-pointer pointer-events-auto"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
        </button>

        {/* Custom Controller Bar */}
        <div className="w-full space-y-3 pointer-events-auto">
          {/* Progress Bar (Clickable with a larger hit area) */}
          <div 
            onClick={handleProgressClick}
            className="relative w-full h-4 flex items-center cursor-pointer group/progress"
          >
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden transition-all duration-200 group-hover/progress:h-2.5">
              <div
                className="h-full bg-primary-container shadow-[0_0_10px_#ff5f1f]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="hover:text-primary transition-colors cursor-pointer"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleRestart}
                className="hover:text-primary transition-colors cursor-pointer"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                title={isMuted ? "Activar Sonido" : "Silenciar"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="text-[10px] font-mono text-white/50">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[10px] font-mono text-primary">Live</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              className="hover:text-primary transition-colors cursor-pointer"
              title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Default Play/Icon Overlay when not playing */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/35 pointer-events-none group-hover:bg-transparent transition-colors duration-300">
          <div className="w-16 h-16 rounded-full border border-white/10 bg-[#1e100b]/80 backdrop-blur-md flex items-center justify-center text-primary group-hover:scale-105 group-hover:text-white transition-all duration-300">
            <Play className="w-6 h-6 ml-0.5 fill-current" />
          </div>
        </div>
      )}

      {/* Brief metadata description drawer always visible on bottom */}
      {description && !isFullscreen && (
        <div className="absolute bottom-2 left-2 z-10 bg-[#180b07]/90 border border-white/5 text-[11px] font-sans text-on-surface-variant/90 px-2.5 py-1 rounded max-w-[85%] truncate pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          {description}
        </div>
      )}
    </div>
  );
}

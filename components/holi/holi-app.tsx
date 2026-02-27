"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Camera,
  Info,
  X,
  MessageCircle,
  Hand,
  Smartphone,
  Download,
  Share2,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { BackgroundParticles } from "./background-particles";
import { FloatingPetals } from "./floating-petals";
import { FallingPapers } from "./falling-papers";
import { GrainOverlay } from "./grain-overlay";
import { useColorSplash } from "./color-splash";
import { AutoGulalBursts } from "./auto-gulal-bursts";
import * as htmlToImage from "html-to-image";

type Phase = "intro" | "input" | "wish";

const WISH_TEMPLATES: string[] = [
  "May this Holi gently color your days with peace and simple joy.\n\nMay each moment ahead feel a little lighter, a little kinder, and full of quiet hope.",
  "May the colors of Holi soften old worries and brighten the path in front of you.\n\nMay you find calm in your heart and courage in every small step you take.",
  "May this festival wrap your life in shades of gratitude and gentle happiness.\n\nMay you feel supported, understood, and quietly celebrated in all that you are.",
  "May Holi sprinkle your days with laughter that feels honest and unforced.\n\nMay you be surrounded by people who bring you warmth, clarity, and peace.",
  "May every color you see today remind you that new beginnings are always possible.\n\nMay your heart find the strength to let go, and the grace to start again.",
  "May this Holi add soft light to the corners of your life that feel dim.\n\nMay your journey ahead be steady, kind, and beautifully your own.",
  "May the joy of Holi sit gently on your shoulders and ease your mind.\n\nMay your days unfold with small surprises, quiet smiles, and deep contentment.",
  "May the colors of Holi bring you closer to the person you aspire to be.\n\nMay you trust your path a little more and doubt yourself a little less each day.",
  "May this Holi remind you of how much light you carry within you.\n\nMay you feel safe to be yourself, and brave enough to share your heart.",
  "May the air around you feel softer and your thoughts feel clearer this Holi.\n\nMay you find beauty in the little things and meaning in the moments in between.",
  "May Holi fill your space with gentle laughter and unspoken understanding.\n\nMay you be blessed with conversations that heal and silences that comfort.",
  "May each shade of Holi paint a new reason to be hopeful in your heart.\n\nMay life meet you with kindness, patience, and quiet, steady growth.",
  "May this Holi help you release what weighs you down and hold on to what lifts you up.\n\nMay you walk forward with lighter steps and a more peaceful mind.",
  "May the festival of colors remind you that even change can be beautiful.\n\nMay the coming days bring you clarity, balance, and a deep sense of belonging.",
  "May Holi color your days with the kind of joy that doesn’t need an audience.\n\nMay you celebrate your small victories and honor your own gentle progress.",
  "May the colors of Holi brighten not just your day, but your year ahead.\n\nMay you find strength in your softness and power in your patience.",
  "May this Holi bring you closer to people who truly see and value you.\n\nMay every shared smile and message carry warmth straight to your heart.",
  "May Holi wash away your stress and leave behind calm, clear thoughts.\n\nMay your dreams feel a little nearer and your fears a little softer.",
  "May the colors of Holi sit on your life like a soft sunrise, slow and beautiful.\n\nMay you feel more grounded, more hopeful, and more at peace with where you are.",
  "May this Holi be a gentle reminder that you deserve rest, joy, and ease.\n\nMay you give yourself permission to breathe, to pause, and to simply be.",
  "May every color that touches your world today carry a blessing for your tomorrow.\n\nMay your journey be guided by quiet confidence and a heart that trusts itself.",
  "May Holi color your memories with moments of genuine warmth and kindness.\n\nMay you look back on this time and remember how deeply you were loved.",
  "May this festival bring softness to your nights and light to your mornings.\n\nMay your days unfold with a rhythm that feels natural and kind to your soul.",
  "May the colors of Holi fill the spaces between your worries with hope.\n\nMay you feel supported by life itself, even when the path is not yet clear.",
  "May Holi paint your world with courage to choose what truly nourishes you.\n\nMay your heart feel lighter as you let go of what no longer feels right.",
  "May this Holi whisper to you that you are exactly where you need to be.\n\nMay you trust your timing, your growth, and the quiet wisdom inside you.",
  "May the festival of colors drape your life in gentle celebration and ease.\n\nMay you find reasons to smile in unexpected places and ordinary days.",
  "May Holi bring a calm kind of happiness that lingers long after the colors fade.\n\nMay your spirit feel rested, renewed, and ready for what’s next.",
  "May the colors of Holi remind you that even small moments can feel magical.\n\nMay you notice the beauty around you today and carry it in your heart.",
  "May this Holi help you forgive yourself for the things you’re still learning.\n\nMay you move forward with kindness toward your own story and journey.",
  "May Holi color your steps with quiet confidence and gentle bravery.\n\nMay you walk into new chapters with faith in who you are becoming.",
  "May the glow of Holi sit softly on your home and your heart.\n\nMay every room you enter feel a little warmer just because you are there.",
  "May this festival bring you peace with your past and excitement for your future.\n\nMay you feel held by the present moment, exactly as it is.",
  "May Holi sprinkle your life with the kind of joy that doesn’t rush.\n\nMay your days slow down just enough for you to truly feel them.",
  "May the colors of Holi find their way into the quiet corners of your heart.\n\nMay they leave behind comfort, healing, and a gentle sense of hope.",
  "May this Holi feel like a soft reset for your mind and your spirit.\n\nMay you start again with clearer thoughts, lighter feelings, and renewed energy.",
  "May Holi add new shades of meaning to the moments you often overlook.\n\nMay you discover little joys in familiar places and everyday routines.",
  "May the festival of colors remind you that your kindness is its own kind of light.\n\nMay you receive the same tenderness that you so easily give to others.",
  "May this Holi bring harmony to your plans and calm to your heart.\n\nMay you find the balance between doing enough and simply being enough.",
  "May the colors in the air mirror the warmth in the hearts around you.\n\nMay every interaction today leave you feeling a little more uplifted.",
  "May Holi gently loosen the knots of stress and overthinking in your mind.\n\nMay clarity, rest, and soft happiness take their place instead.",
  "May this festival paint your year with more laughter, more hugs, and more honest moments.\n\nMay you always feel welcome, wanted, and wonderfully yourself.",
  "May Holi be a reminder that your presence is a gift to those who love you.\n\nMay you see yourself with the same kindness and admiration they do.",
  "May the colors of Holi blend into a calm, steady happiness within you.\n\nMay you carry that stillness even on loud or busy days.",
  "May this Holi arrive like a breath of fresh air after a long day.\n\nMay it leave you feeling lighter, softer, and quietly re-energized.",
  "May Holi decorate your life with moments that feel real and unfiltered.\n\nMay you find comfort in being fully yourself, without any need to pretend.",
  "May the shades of Holi touch your life with little sparks of inspiration.\n\nMay new ideas, gentle dreams, and kind opportunities find their way to you.",
  "May this Holi hold space for both your joy and your healing.\n\nMay you feel safe to feel everything and still trust that brighter days are coming.",
  "May Holi fill your heart with gratitude for how far you’ve already come.\n\nMay you honor your journey, your resilience, and the quiet strength within you.",
  "May the colors of Holi dance softly around your worries and turn them into lessons.\n\nMay you walk away from this season with more peace and more wisdom.",
  "May this Holi surround you with people who add light to your life.\n\nMay their presence, words, and wishes make you feel deeply cherished.",
];

export function HoliApp() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isColorful, setIsColorful] = useState(false);
  const [name, setName] = useState("");
  const [showWish, setShowWish] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [paperBurst, setPaperBurst] = useState(0);
  const [paperShake, setPaperShake] = useState(0);

  // Swipe reveal state
  const [revealPercent, setRevealPercent] = useState(0); // 0 = fully grayscale, 100 = fully colorful
  const [isRevealed, setIsRevealed] = useState(false); // locked in after full swipe
  const touchStartYRef = useRef<number | null>(null);
  const revealAtStartRef = useRef(0);
  const isSwiping = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wishCardRef = useRef<HTMLDivElement>(null);
  const [selectedWish, setSelectedWish] = useState<string | null>(null);
  const { triggerSplash, triggerConfetti } = useColorSplash();

  // Initialize audio
  useEffect(() => {
    const audio = new Audio("/holi.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Shake detection
  useEffect(() => {
    if (!isColorful) return;

    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    const threshold = 25;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if (deltaX + deltaY + deltaZ > threshold) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        triggerSplash(x, y, 60);
        triggerConfetti();
        setPaperShake((s) => s + 1);
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [isColorful, triggerSplash, triggerConfetti]);

  // Typewriter effect for selected wish
  useEffect(() => {
    if (!showWish || !name || !selectedWish) return;

    const fullText = `Dear, ${name}.

${selectedWish}

— Chinmaya`;

    let i = 0;
    setTypedText("");

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [showWish, name, selectedWish]);
  // --- Swipe-up gesture handlers ---
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // --- AUDIO UNLOCK TRICK ---
      // Jaise hi user pehla touch karega, hum audio ko "wake up" kar denge
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            // Bajne ki zaroorat nahi hai abhi, bas unlock karna tha
            audioRef.current?.pause();
          })
          .catch(() => {
            // Agar block ho jaye toh koi baat nahi, agle touch par try karenge
          });
      }

      if (isRevealed) return;
      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
      revealAtStartRef.current = revealPercent;
      isSwiping.current = true;
    },
    [isRevealed, revealPercent],
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isRevealed || touchStartYRef.current === null || !isSwiping.current)
        return;
      const touch = e.touches[0];
      const deltaY = touchStartYRef.current - touch.clientY; // positive = swiping up
      const screenH = window.innerHeight;
      const swipePercent = (deltaY / screenH) * 110; // tuned for smoother, more controlled reveal
      const newPercent = Math.max(
        0,
        Math.min(100, revealAtStartRef.current + swipePercent),
      );
      setRevealPercent(newPercent);
    },
    [isRevealed],
  );

  const handleTouchEnd = useCallback(() => {
    if (isRevealed) return;
    isSwiping.current = false;
    touchStartYRef.current = null;

    // If swiped more than ~35%, auto-complete reveal (mobile-friendly snap)
    if (revealPercent >= 35) {
      completeReveal();
    } else {
      // Snap back to 0 with smooth animation
      animateRevealTo(0);
    }
  }, [isRevealed, revealPercent]);

  // Mouse swipe for desktop
  const mouseStartYRef = useRef<number | null>(null);
  const isMouseDown = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isRevealed) return;
      mouseStartYRef.current = e.clientY;
      revealAtStartRef.current = revealPercent;
      isMouseDown.current = true;
    },
    [isRevealed, revealPercent],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isRevealed || !isMouseDown.current || mouseStartYRef.current === null)
        return;
      const deltaY = mouseStartYRef.current - e.clientY;
      const screenH = window.innerHeight;
      const swipePercent = (deltaY / screenH) * 110;
      const newPercent = Math.max(
        0,
        Math.min(100, revealAtStartRef.current + swipePercent),
      );
      setRevealPercent(newPercent);
    },
    [isRevealed],
  );

  const handleMouseUp = useCallback(() => {
    if (isRevealed || !isMouseDown.current) return;
    isMouseDown.current = false;
    mouseStartYRef.current = null;

    if (revealPercent >= 35) {
      completeReveal();
    } else {
      animateRevealTo(0);
    }
  }, [isRevealed, revealPercent]);

  const animateRevealTo = (target: number) => {
    const start = revealPercent;
    const diff = target - start;
    const duration = 500;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setRevealPercent(start + diff * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const completeReveal = () => {
    // Animate to 100%
    const start = revealPercent;
    const diff = 100 - start;
    const duration = 500;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setRevealPercent(current);

      if (progress >= 1) {
        setRevealPercent(100);
        setIsRevealed(true);
        setIsColorful(true);

        // Trigger celebration effects
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        triggerSplash(cx, cy, 120);
        triggerConfetti();
        setPaperBurst((b) => b + 1);

        // Auto play music
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
          setMusicPlaying(true);
        }
        // Show name input
        setTimeout(() => {
          setPhase("input");
          setNameVisible(true);
        }, 600);
      } else {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };
  const resetToIntro = () => {
    // Smoothly animate back to grayscale
    setIsRevealed(false);
    setIsColorful(false);
    setPhase("intro");
    setShowWish(false);
    setNameVisible(false);
    setSelectedWish(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setMusicPlaying(false);

    animateRevealTo(0);
  };

  // Desktop scroll (wheel) handler: scroll down reveals, scroll up can reset
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const deltaY = e.deltaY;
      if (deltaY === 0) return;

      // If already fully revealed, allow upward scroll to reset
      if (isRevealed) {
        if (deltaY < -10) {
          e.preventDefault();
          resetToIntro();
        }
        return;
      }

      e.preventDefault();

      const direction = deltaY > 0 ? 1 : -1;
      const step = Math.min(8, Math.max(2, Math.abs(deltaY) * 0.15));
      const next = Math.max(0, Math.min(100, revealPercent + direction * step));
      setRevealPercent(next);

      if (next >= 35 && direction > 0) {
        completeReveal();
      } else if (next <= 2 && direction < 0) {
        animateRevealTo(0);
      }
    },
    [isRevealed, revealPercent],
  );

  const handlePlayHoli = () => {
    // Trigger color splash effects
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    triggerSplash(x, y, 120);
    triggerConfetti();
    setPaperBurst((b) => b + 1);

    // Animate the swipe reveal to full
    completeReveal();
  };

  const handleGenerateWish = () => {
    if (!name.trim()) return;
    const randomIndex = Math.floor(Math.random() * WISH_TEMPLATES.length);
    setSelectedWish(WISH_TEMPLATES[randomIndex]);
    setPhase("wish");
    setShowWish(true);
    triggerSplash(window.innerWidth / 2, window.innerHeight / 2, 80);
    triggerConfetti();
  };

  // --- 1. Screenshot Function (Fixed) ---
  const handleScreenshot = async () => {
    if (!wishCardRef.current) return;

    try {
      // html-to-image library ko dynamically import karein (ya top par import karein)
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(wishCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff", // Card ke peeche white background rakhega
      });

      // LocalStorage mein save karein (jaise aapne pehle kiya tha)
      localStorage.setItem("holiScreenshot", dataUrl);

      const link = document.createElement("a");
      link.download = `holi-wish-${name || "holi"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert(
        "Screenshot lene mein dikkaat aayi. Please refresh karke try karein.",
      );
    }
  };

  // --- 2. WhatsApp Share Function (Fixed) ---
  const handleWhatsAppShare = async () => {
    // 1. Validation check
    if (!name.trim() || !selectedWish || !wishCardRef.current) return;

    // Plain text ko yahan define karein taaki fallback mein use ho sake
    const plainText = `Happy Holi ✨\n\nDear, ${name}.\n\n${selectedWish}\n\n— Chinmaya`;

    try {
      const { toBlob } = await import("html-to-image");

      // 2. Image generate karein (Background color zaroori hai white ke liye)
      const blob = await toBlob(wishCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      if (blob && navigator.canShare) {
        const file = new File([blob], `holi-wish.png`, { type: "image/png" });

        // 3. Web Share API (Priority: Only File)
        // Kuch browsers text+file handle nahi karte, isliye sirf file bhej rahe hain
        // WhatsApp mobile par image share karne ke baad caption khud likhne ka option deta hai
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Happy Holi",
          });
          return; // Image share ho gayi!
        }
      }
    } catch (err) {
      console.error("Image sharing failed:", err);
    }

    // 4. Fallback: Agar Mobile Share fail ho jaye (Desktop ya purana phone)
    // Yahan 'plainText' defined hai, isliye underline nahi aayega
    const encoded = encodeURIComponent(plainText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicPlaying(!musicPlaying);
  };

  // The grayscale top layer clips from the top down.
  // revealPercent 0 = grayscale covers 100% of screen
  // revealPercent 100 = grayscale covers 0% (fully colorful)
  const grayscaleClipTop = `${100 - revealPercent}%`;

  return (
    <>
      {/* ===== BOTTOM LAYER: Full Color ===== */}
      <div
        className="fixed inset-0 overflow-hidden select-none"
        style={{
          zIndex: 0,
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Color background video (all screens: holi2.mp4) */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src="/holi2.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </div>

        {/* Color animated layers */}
        <BackgroundParticles isColorful={true} />
        {phase === "wish" && showWish && <AutoGulalBursts />}
        <FloatingPetals isColorful={true} />
        <FallingPapers
          isColorful={true}
          burstSignal={paperBurst}
          shakeSignal={paperShake}
        />
        <GrainOverlay />
      </div>

      {/* ===== TOP LAYER: Grayscale (clips upward on swipe) ===== */}
      {!isRevealed && (
        <div
          className="fixed inset-0 overflow-hidden select-none"
          style={{
            zIndex: 1,
            filter: "grayscale(100%)",
            clipPath: `inset(0 0 ${revealPercent}% 0)`,
            willChange: "clip-path",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          {/* Grayscale background video: holi2.mp4 */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              className="w-full h-full object-cover"
              src="/holi2.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
              }}
            />
          </div>

          {/* Grayscale animated layers */}
          <BackgroundParticles isColorful={false} />
          <FloatingPetals isColorful={false} />
          <GrainOverlay />
        </div>
      )}

      {/* ===== Reveal edge glow line ===== */}
      {!isRevealed && revealPercent > 0 && (
        <div
          className="fixed left-0 right-0 pointer-events-none"
          style={{
            zIndex: 2,
            bottom: `${revealPercent}%`,
            height: "4px",
            background:
              "linear-gradient(90deg, #FF1493, #FFD700, #00CC66, #4169E1, #FF1493)",
            boxShadow:
              "0 0 20px rgba(255, 20, 147, 0.6), 0 0 40px rgba(255, 215, 0, 0.4), 0 0 60px rgba(0, 204, 102, 0.3)",
            transition: isSwiping.current
              ? "none"
              : "bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
      )}

      {/* ===== SWIPE DETECTION OVERLAY ===== */}
      {!isRevealed && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 3 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {/* INTRO PHASE */}
        {phase === "intro" && (
          <div
            className="flex flex-col items-center gap-8 px-6 text-center pointer-events-auto"
            style={{
              animation: "floatSlow 6s ease-in-out infinite",
            }}
          >
            <div className="relative">
              <h1
                className="text-5xl font-bold tracking-tight text-foreground md:text-7xl"
                style={{
                  textShadow:
                    "0 0 40px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                <span className="font-serif text-6xl md:text-8xl">
                  Touch the Colors
                </span>
              </h1>
              <div
                className="mx-auto mt-2 h-0.5 w-32 rounded-full"
                style={{
                  background: isRevealed
                    ? "linear-gradient(90deg, #FF1493, #FFD700, #00CC66, #4169E1)"
                    : "rgba(255,255,255,0.3)",
                  transition: "background 1s ease",
                }}
              />
            </div>

            <p className="text-sm tracking-widest uppercase text-muted-foreground">
              Swipe up to reveal the colors
            </p>

            {/* Swipe Up Indicator */}
            <div
              className="flex flex-col items-center gap-1"
              style={{
                animation: "bounce-up 1.5s ease-in-out infinite",
                opacity: revealPercent > 5 ? 0 : 0.7,
                transition: "opacity 0.3s ease",
              }}
            >
              <ChevronUp className="h-5 w-5 text-foreground" />
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Swipe Up
              </span>
            </div>
          </div>
        )}

        {/* NAME INPUT PHASE */}
        {phase === "input" && (
          <div
            className="mx-4 w-full max-w-sm pointer-events-auto"
            style={{
              opacity: nameVisible ? 1 : 0,
              transform: nameVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <div
              className="flex flex-col items-center gap-2 rounded-2xl p-8"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <h2
                className="font-serif text-3xl font-bold text-black"
                style={{
                  textShadow: "2px 2px 0 rgba(255,255,255,0.4)",
                }}
              >
                Happy Holi!
              </h2>
              <p className="text-sm text-black">
                Enter your name to see your special wish
              </p>

              <div className="w-full">
                <label htmlFor="name-input" className="sr-only">
                  Enter Your Name
                </label>

                <input
                  id="name-input"
                  type="text"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateWish()}
                  className="w-full rounded-xl px-5 py-3.5 text-center text-lg font-medium text-black placeholder:text-black/60 focus:outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    animation: "border-glow 4s linear infinite",
                  }}
                  autoFocus
                  autoComplete="off"
                />
              </div>

              <button
                onClick={handleGenerateWish}
                disabled={!name.trim()}
                className="w-full rounded-xl px-6 py-3.5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
                style={{
                  background: name.trim()
                    ? "linear-gradient(135deg, #FF1493, #FF6B35)"
                    : "rgba(255, 255, 255, 0.3)",
                  boxShadow: name.trim()
                    ? "0 4px 20px rgba(255, 20, 147, 0.4)"
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                Generate Wish
              </button>
            </div>
          </div>
        )}

        {/* WISH PHASE */}
        {phase === "wish" && showWish && (
          <div
            className="mx-4 w-full max-w-sm pointer-events-auto"
            style={{
              animation: "floatSlow 8s ease-in-out infinite",
            }}
          >
            <div
              ref={wishCardRef}
              className="relative flex flex-col items-center gap-2 rounded-3xl p-8 overflow-hidden"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                animation: "floatSlow 8s ease-in-out infinite",
              }}
            >
              {/* 🔹 Light Blurred Background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/images/holi-bSAg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(0.3px) brightness(1.05)",
                  transform: "scale(1.05)",
                }}
              />

              {/* 🔹 Soft White Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                }}
              />

              {/* 🔹 Content Layer */}
              <div className="relative z-10 flex flex-col items-center gap-3 w-full px-4">
                <h2
                  className="font-serif font-bold text-center mt-1 text-[clamp(30px,8vw,72px)] leading-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF1493, #FFD700, #00CC66)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Happy Holi!
                </h2>

                <div className="mt-3 w-full">
                  <p
                    className="whitespace-pre-line text-black text-left break-words"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "clamp(14px, 3.5vw, 18px)",
                      lineHeight: "1.7",
                    }}
                  >
                    {typedText}
                    <span
                      className="ml-1 inline-block w-[2px] bg-black"
                      style={{
                        height: "0.8em",
                        verticalAlign: "middle",
                        animation: typedText.includes("Chinmaya")
                          ? "none"
                          : "blink 1s steps(2, start) infinite",
                        opacity: typedText.includes("Chinmaya") ? 0 : 1,
                      }}
                    />
                  </p>
                </div>

                <div
                  className="mt-4 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)",
                  }}
                />

                <p className="text-xs tracking-wider text-black/60">
                  Happy Holi 2026
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== FLOATING UI BUTTONS (outside main, always on top) ===== */}

      {/* BOTTOM LEFT - WhatsApp Share */}
      {isColorful && showWish && (
        <button
          onClick={handleWhatsAppShare}
          className="fixed bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-full text-foreground shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            zIndex: 9999,
            background: "rgba(37, 211, 102, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
            marginBottom: "env(safe-area-inset-bottom)",
            marginLeft: "env(safe-area-inset-left)",
          }}
          aria-label="Share on WhatsApp"
        >
         <Share2 className="h-6 w-6" />
        </button>
      )}

      {/* BOTTOM RIGHT - Screenshot */}
      {isColorful && showWish && (
        <button
          onClick={handleScreenshot}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full text-foreground shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            zIndex: 9999,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            marginBottom: "env(safe-area-inset-bottom)",
            marginRight: "env(safe-area-inset-right)",
          }}
          aria-label="Take screenshot"
        >
          <Download className="h-6 w-6" />
        </button>
      )}

      {/* TOP RIGHT - Music Toggle */}
      {isColorful && (
        <button
          onClick={toggleMusic}
          className="fixed right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-all duration-300 hover:scale-110"
          style={{
            zIndex: 9999,
            background: musicPlaying
              ? "rgba(255, 20, 147, 0.2)"
              : "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: musicPlaying
              ? "1px solid rgba(255, 20, 147, 0.3)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: musicPlaying
              ? "0 0 16px rgba(255, 20, 147, 0.3), 0 0 32px rgba(255, 20, 147, 0.15)"
              : "none",
            marginRight: "env(safe-area-inset-right)",
            marginTop: "env(safe-area-inset-top)",
            animation: musicPlaying
              ? "pulse-glow 2s ease-in-out infinite"
              : "none",
          }}
          aria-label={musicPlaying ? "Mute music" : "Unmute music"}
        >
          {musicPlaying ? (
            <Volume2 className="h-4.5 w-4.5" />
          ) : (
            <VolumeX className="h-4.5 w-4.5" />
          )}
        </button>
      )}

      {/* TOP CENTER - Up/Down arrow for smooth transition */}
      <div
        className="fixed inset-x-0 top-4 flex justify-center"
        style={{ zIndex: 11, pointerEvents: "none" }}
      >
        <button
          type="button"
          onClick={() => {
            if (isRevealed) {
              resetToIntro();
            } else {
              completeReveal();
            }
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-foreground border border-white/25 backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{ pointerEvents: "auto" }}
          aria-label={
            isRevealed ? "Scroll up to intro" : "Scroll down to colors"
          }
        >
          {isRevealed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* TOP LEFT - Info Button */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="fixed left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all duration-300 hover:scale-110"
        style={{
          zIndex: 9999,
          background: showInstructions
            ? "rgba(255, 255, 255, 0.18)"
            : "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          marginTop: "env(safe-area-inset-top)",
          marginLeft: "env(safe-area-inset-left)",
        }}
        aria-label="Show instructions"
      >
        {showInstructions ? (
          <X className="h-4 w-4" />
        ) : (
          <Info className="h-4 w-4" />
        )}
      </button>

      {/* INSTRUCTION PANEL - slides down from top-left */}
      <div
        className="fixed left-5 top-16"
        style={{
          zIndex: 9999,
          marginTop: "env(safe-area-inset-top)",
          marginLeft: "env(safe-area-inset-left)",
          opacity: showInstructions ? 1 : 0,
          transform: showInstructions ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: showInstructions ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        <div
          className="w-[240px] rounded-2xl p-4"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.4)",
          }}
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Instruction
          </p>

          <div className="flex flex-col gap-2">
            {[
              {
                icon: <ChevronUp className="h-3.5 w-3.5" />,
                color: "rgba(255, 20, 147, 0.15)",
                iconColor: "#FF1493",
                label: "Swipe Up",
                desc: "Reveal Colors",
              },
              {
                icon: <Smartphone className="h-3.5 w-3.5" />,
                color: "rgba(255, 215, 0, 0.15)",
                iconColor: "#FFD700",
                label: "Shake Phone",
                desc: "Color Burst",
              },
              {
                icon: <Download className="h-3.5 w-3.5" />,
                color: "rgba(0, 204, 102, 0.15)",
                iconColor: "#00CC66",
                label: "Screenshot",
                desc: "Save Wish",
              },
              {
                icon: <Share2 className="h-3.5 w-3.5" />,
                color: "rgba(65, 105, 225, 0.15)",
                iconColor: "#4169E1",
                label: "WhatsApp",
                desc: "Share Wish",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                style={{ background: "rgba(255, 255, 255, 0.03)" }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ background: item.color, color: item.iconColor }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium leading-none text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-none text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <Check
                  className="h-3 w-3 shrink-0 text-muted-foreground"
                  style={{ opacity: 0.35 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global footer credit */}
      <div
        className="fixed inset-x-0 bottom-3 flex justify-center pointer-events-none"
        style={{ zIndex: 9 }}
      >
        <p className="text-[11px] tracking-wide text-muted-foreground">
          Created by Chinmaya
        </p>
      </div>
    </>
  );
}

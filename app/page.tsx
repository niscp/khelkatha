"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AgeGroup = "1" | "2-3" | "4-5" | "6-7";
type Language = "hi" | "en" | "hinglish";

const languageLabels: Record<Language, string> = { hi: "हिंदी", en: "English", hinglish: "Hinglish" };

const copy = {
  hi: { tagline: "खेलो • सुनो • सीखो", stars: "आज के सितारे", littleHands: "नन्हे हाथों का खेल बगीचा", orchestra: "जानवरों का संगीत", toddlerTitle: <>छूओ। सुनो।<br /><em>फिर से खेलो!</em></>, olderTitle: <>कीबोर्ड दबाओ।<br /><em>जानवर जगाओ!</em></>, freePlay: "मन से खेलो", soundHunt: "आवाज़ खोजो", family: "परिवार", fullscreen: "पूरी स्क्रीन", exit: "बाहर", smash: "जानवर जगाओ", bubbles: "बुलबुले फोड़ो", ball: "उछलती गेंद", scratch: "रंगोली बनाओ", piano: "जानवर पियानो", catch: "तोता पकड़ो", myFamily: "मेरा परिवार", hello: "जानवर से मिलो", peek: "छुपन-छुपाई", dance: "नाच पार्टी", tapInvite: "छूओ • घुमाओ • बटन दबाओ", again: "फिर से! ↻", who: "कौन?", familyTitle: " का परिवार", toddlerNote: "बड़े बटन • असली जानवरों की आवाज़ • कोई गलत जवाब नहीं", keyboardTip: "लैपटॉप पर A S D F G H दबाएँ • फ़ोन पर जानवर छूएँ", hear: "सुनो", hearNote: "हर जानवर की अलग आवाज़", find: "खोजो", findNote: "आवाज़ से जानवर पहचानो", speak: "बोलो", speakNote: "हिंदी और English नाम", win: "जीतो", winNote: "खुशी का सितारा पाओ", grownups: "माता-पिता के लिए", parentTitle: "यह खेल जैसा लगता है। सीखना भी साथ होता है।", parentBody: "हर स्पर्श से बच्चा कारण और परिणाम, सुनने की याददाश्त, जानवरों की पहचान और दो भाषाओं के शब्द सीखता है।", safe: ["✓ कोई विज्ञापन नहीं", "✓ कोई खाता नहीं", "✓ बड़े सुरक्षित बटन"], ageSetup: "माता-पिता की सेटिंग", ageQuestion: "बच्चा कितने साल का है?", ageNote: "हम उम्र के अनुसार खेल की गति तय करेंगे।" },
  en: { tagline: "Play • Listen • Learn", stars: "Today's stars", littleHands: "Little hands play garden", orchestra: "WonderTaps animal orchestra", toddlerTitle: <>Tap. Listen.<br /><em>Play again!</em></>, olderTitle: <>Press the keyboard.<br /><em>Wake the animals!</em></>, freePlay: "Free play", soundHunt: "Sound hunt", family: "Family", fullscreen: "Fullscreen", exit: "Exit", smash: "Animal Smash", bubbles: "Bubble Pop", ball: "Bouncy Ball", scratch: "Rangoli Scratch", piano: "Animal Piano", catch: "Catch Parrot", myFamily: "My Family", hello: "Animal Hello", peek: "Peekaboo", dance: "Dance Party", tapInvite: "Tap • Swipe • Smash keys", again: "Again! ↻", who: "Who?", familyTitle: "'s Family", toddlerNote: "Big buttons • Real animal sounds • No wrong answers", keyboardTip: "Press A S D F G H on a laptop • Tap any animal on a phone", hear: "Listen", hearNote: "Hear a unique animal voice", find: "Find", findNote: "Match sound to animal", speak: "Speak", speakNote: "Hindi and English names", win: "Win", winNote: "Earn a happy star", grownups: "For grown-ups", parentTitle: "It feels like play. Learning happens too.", parentBody: "Every tap builds cause-and-effect understanding, listening memory, animal recognition and bilingual vocabulary.", safe: ["✓ No ads", "✓ No account", "✓ Big safe taps"], ageSetup: "Grown-up setup", ageQuestion: "How old is your child?", ageNote: "We'll set the right pace and play style." },
  hinglish: { tagline: "Khelo • Suno • Seekho", stars: "Aaj ke stars", littleHands: "Nanhe haathon ka play garden", orchestra: "WonderTaps animal orchestra", toddlerTitle: <>Chhoo. Suno.<br /><em>Phir se khelo!</em></>, olderTitle: <>Keyboard dabao.<br /><em>Animals jagao!</em></>, freePlay: "Free khelo", soundHunt: "Awaaz dhoondo", family: "Family", fullscreen: "Fullscreen", exit: "Exit", smash: "Animal Jagao", bubbles: "Bubble Phodo", ball: "Bouncy Gend", scratch: "Rangoli Banao", piano: "Animal Piano", catch: "Tota Pakdo", myFamily: "Meri Family", hello: "Animal Hello", peek: "Chhupan Chhupai", dance: "Dance Party", tapInvite: "Tap • Swipe • Keys dabao", again: "Phir se! ↻", who: "Kaun?", familyTitle: " ki Family", toddlerNote: "Bade buttons • Asli animal sounds • Koi galat jawab nahi", keyboardTip: "Laptop par A S D F G H dabao • Phone par animal tap karo", hear: "Suno", hearNote: "Har animal ki alag awaaz", find: "Dhoondo", findNote: "Awaaz se animal pehchano", speak: "Bolo", speakNote: "Hindi + English names", win: "Jeeto", winNote: "Happy star pao", grownups: "Parents ke liye", parentTitle: "Yeh play lagta hai. Learning bhi hoti hai.", parentBody: "Har tap cause-and-effect, listening memory, animal recognition aur bilingual vocabulary banata hai.", safe: ["✓ No ads", "✓ No account", "✓ Bade safe taps"], ageSetup: "Parent setup", ageQuestion: "Baccha kitne saal ka hai?", ageNote: "Hum age ke hisaab se pace aur play style set karenge." },
};

const ageOptions: Record<AgeGroup, { label: string; icon: string; note: string }> = {
  "1": { label: "1 year", icon: "🧸", note: "Tap & hear" },
  "2-3": { label: "2–3 years", icon: "🌱", note: "Name & copy" },
  "4-5": { label: "4–5 years", icon: "🌼", note: "Listen & find" },
  "6-7": { label: "6–7 years", icon: "🚀", note: "Remember & solve" },
};

const animals = [
  { key: "A", emoji: "🐴", name: "Ghoda", english: "Horse", hindi: "घोड़ा", sound: "हिन-हिन!", colour: "#ef735e", x: "10%", audio: "horse.ogg" },
  { key: "S", emoji: "🐘", name: "Hathi", english: "Elephant", hindi: "हाथी", sound: "पों-पों!", colour: "#64b7d4", x: "29%", audio: "elephant.ogg" },
  { key: "D", emoji: "🦁", name: "Sher", english: "Lion", hindi: "शेर", sound: "गुर्रर्र!", colour: "#f2ad35", x: "45%", audio: "lion.ogg" },
  { key: "F", emoji: "🐵", name: "Bandar", english: "Monkey", hindi: "बंदर", sound: "ऊँ-आँ!", colour: "#a980cc", x: "60%", audio: "monkey.ogg" },
  { key: "G", emoji: "🐮", name: "Gaay", english: "Cow", hindi: "गाय", sound: "माँऽऽ!", colour: "#f5eee0", x: "76%", audio: "cow.ogg" },
  { key: "H", emoji: "🦜", name: "Tota", english: "Parrot", hindi: "तोता", sound: "चीं-चीं!", colour: "#69b84a", x: "91%", audio: "parrot.ogg" },
];

type ToddlerGame = "show" | "fireflies" | "soundmatch" | "parade" | "smash" | "bubbles" | "ball" | "scratch" | "piano" | "catch" | "family" | "hello" | "peek" | "dance";
type Burst = { id: number; x: number; y: number; animal: number; kind: "animal" | "spark" };
type FamilyMember = { name: string; photo: string };

export default function Home() {
  const [language, setLanguage] = useState<Language>("hinglish");
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [showAge, setShowAge] = useState(false);
  const [activeAnimal, setActiveAnimal] = useState<number | null>(null);
  const [mode, setMode] = useState<"free" | "challenge">("free");
  const [challenge, setChallenge] = useState(2);
  const [stars, setStars] = useState(0);
  const [sessionTaps, setSessionTaps] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [message, setMessage] = useState("कोई key दबाओ • Press any animal key!");
  const [toddlerGame, setToddlerGame] = useState<ToddlerGame>("show");
  const [revealed, setRevealed] = useState<number | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 55 });
  const [scratchMarks, setScratchMarks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [birdPosition, setBirdPosition] = useState({ x: 68, y: 42 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [childName, setChildName] = useState("Gauri");
  const [nickname, setNickname] = useState("");
  const [favouriteColour, setFavouriteColour] = useState("#ef6654");
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [familyReveal, setFamilyReveal] = useState<number | null>(null);
  const [praiseAudio, setPraiseAudio] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showPlaying, setShowPlaying] = useState(false);
  const [caughtFireflies, setCaughtFireflies] = useState<number[]>([]);
  const [soundTarget, setSoundTarget] = useState(1);
  const [paradeStep, setParadeStep] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const burstId = useRef(0);
  const lastTrail = useRef(0);
  const markId = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("wondertaps-language") as Language | null;
    if (savedLanguage && savedLanguage in copy) setLanguage(savedLanguage);
    const saved = (window.localStorage.getItem("wondertaps-age") || window.localStorage.getItem("khelkatha-age")) as AgeGroup | null;
    if (saved && saved in ageOptions) {
      setAge(saved);
      if (saved === "1") {
        setToddlerGame("show");
        setMessage("Gauri & friends are ready!");
      }
    }
    else setShowAge(true);
    try {
      const profile = JSON.parse(window.localStorage.getItem("wondertaps-family") || window.localStorage.getItem("khelkatha-family") || "null");
      if (profile) {
        setChildName(profile.childName || "Gauri"); setNickname(profile.nickname || "");
        setFavouriteColour(profile.favouriteColour || "#ef6654"); setFamily(profile.family || []);
        setPraiseAudio(profile.praiseAudio || "");
      }
    } catch { /* start with an empty private profile */ }
  }, []);

  const words = copy[language];
  const animalName = useCallback((index: number) => language === "hi" ? animals[index].hindi : language === "en" ? animals[index].english : animals[index].name, [language]);

  function chooseLanguage(value: Language) {
    setLanguage(value);
    window.localStorage.setItem("wondertaps-language", value);
    document.documentElement.lang = value === "hinglish" ? "en-IN" : value;
  }

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const playAnimalSound = useCallback((index: number) => {
    if (!soundOn) return;
    try {
      audioRef.current?.pause();
      const audio = new Audio(`./sounds/${animals[index].audio}`);
      audio.volume = .9;
      audioRef.current = audio;
      void audio.play().catch(() => { /* browsers may block sound until the first physical tap */ });
      if (index === 2 || index === 3) window.setTimeout(() => audio.pause(), 2800);
    } catch { /* visual play continues if audio is unavailable */ }
  }, [soundOn]);

  const triggerAnimal = useCallback((index: number) => {
    const animal = animals[index];
    setActiveAnimal(index);
    setPulse((value) => value + 1);
    setSessionTaps((value) => value + 1);
    playAnimalSound(index);

    if (mode === "challenge") {
      if (index === challenge) {
        setStars((value) => value + 1);
        setMessage(`शाबाश! ${animal.hindi} मिल गया! ★`);
        window.setTimeout(() => {
          const next = (challenge + 2) % animals.length;
          setChallenge(next);
          setMessage(`${animals[next].sound} कौन बोलता है? • Who makes this sound?`);
        }, 900);
      } else {
        setMessage(`यह ${animal.hindi} है—फिर कोशिश करो!`);
      }
    } else {
      setMessage(`${animal.emoji} ${animal.hindi} • ${animal.name} says ${animal.sound}`);
    }
  }, [challenge, mode, playAnimalSound]);

  const addBurst = useCallback((x: number, y: number, animal: number, kind: Burst["kind"] = "animal") => {
    const id = ++burstId.current;
    setBursts((current) => [...current.slice(-14), { id, x, y, animal, kind }]);
    window.setTimeout(() => setBursts((current) => current.filter((burst) => burst.id !== id)), kind === "animal" ? 1450 : 700);
  }, []);

  useEffect(() => {
    if (!showPlaying || toddlerGame !== "show") return;
    let index = 0;
    triggerAnimal(index);
    const timer = window.setInterval(() => { index = (index + 1) % animals.length; triggerAnimal(index); }, 2100);
    return () => window.clearInterval(timer);
  }, [showPlaying, toddlerGame, triggerAnimal]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat || showAge) return;
      if (age === "1" && toddlerGame === "smash") {
        event.preventDefault();
        const index = Math.floor(Math.random() * animals.length);
        addBurst(12 + Math.random() * 76, 18 + Math.random() * 65, index);
        triggerAnimal(index);
        return;
      }
      const index = animals.findIndex((animal) => animal.key.toLowerCase() === event.key.toLowerCase());
      if (index >= 0) {
        event.preventDefault();
        triggerAnimal(index);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [addBurst, age, showAge, toddlerGame, triggerAnimal]);

  function chooseAge(value: AgeGroup) {
    setAge(value);
    setShowAge(false);
    setMode(value === "1" ? "free" : "challenge");
    setToddlerGame(value === "1" ? "show" : "smash");
    setMessage(value === "1" ? "Gauri & friends are ready!" : `${animals[challenge].sound} कौन बोलता है?`);
    window.localStorage.setItem("wondertaps-age", value);
  }

  function changeMode(value: "free" | "challenge") {
    setMode(value);
    setMessage(value === "free" ? "कोई key दबाओ • Press any animal key!" : `${animals[challenge].sound} कौन बोलता है? • Who makes this sound?`);
  }

  function chooseToddlerGame(value: ToddlerGame) {
    setToddlerGame(value);
    setActiveAnimal(null);
    setRevealed(null);
    const prompts: Record<ToddlerGame, string> = {
      show: "Gauri का Animal Show!", fireflies: "Gauri, catch the glowing lights!", soundmatch: "Listen. Who is calling Gauri?", parade: "Tap to lead Gauri's parade!", smash: "कहीं भी छूओ!", bubbles: "बुलबुले फोड़ो!", ball: "गेंद को घुमाओ!",
      scratch: "उंगली घुमाओ!", piano: "सुर बजाओ!", catch: "तोता पकड़ो!", family: "कौन छुपा है?",
      hello: "जानवर को छूओ!", peek: "पत्ते के पीछे कौन है?", dance: "किसको नचाएँ?",
    };
    setMessage(prompts[value]);
    if (value === "soundmatch") window.setTimeout(() => playAnimalSound(soundTarget), 250);
  }

  async function startCharacterShow() {
    setToddlerGame("show"); setShowPlaying(true); setMessage(`${nickname || childName || "Gauri"}, your animal friends are here!`);
    try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: "hide" }); } catch { /* show still plays inline */ }
  }

  function playNote(index: number) {
    triggerAnimal(index % animals.length);
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = [262, 294, 330, 349, 392, 440, 494, 523][index];
      gain.gain.setValueAtTime(.16, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .45);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + .46);
      window.setTimeout(() => void context.close(), 550);
    } catch { /* animal audio still plays */ }
  }

  function saveFamily() {
    window.localStorage.setItem("wondertaps-family", JSON.stringify({ childName, nickname, favouriteColour, family, praiseAudio }));
    setShowFamily(false);
    setMessage(`${nickname || childName || "बच्चा"}, खेल शुरू! ★`);
  }

  function addFamilyPhoto(file: File | undefined, index: number) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas"); canvas.width = 360; canvas.height = 360;
        const context = canvas.getContext("2d"); if (!context) return;
        const side = Math.min(image.width, image.height); const sx = (image.width - side) / 2; const sy = (image.height - side) / 2;
        context.drawImage(image, sx, sy, side, side, 0, 0, 360, 360);
        const photo = canvas.toDataURL("image/jpeg", .78);
        setFamily((current) => { const next = [...current]; next[index] = { name: next[index]?.name || `Family ${index + 1}`, photo }; return next.slice(0, 3); });
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function toggleRecording() {
    if (isRecording) { recorderRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream); recordingChunks.current = []; recorderRef.current = recorder;
      recorder.ondataavailable = (event) => recordingChunks.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(recordingChunks.current, { type: recorder.mimeType }); const reader = new FileReader();
        reader.onload = () => setPraiseAudio(String(reader.result)); reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop()); setIsRecording(false);
      };
      recorder.start(); setIsRecording(true); window.setTimeout(() => recorder.state === "recording" && recorder.stop(), 5000);
    } catch { setMessage("Microphone अनुमति दें • Allow microphone"); }
  }

  function playPraise() { if (praiseAudio) void new Audio(praiseAudio).play().catch(() => {}); }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    } catch {
      setMessage("Fullscreen उपलब्ध नहीं • Use Add to Home Screen");
    }
  }

  return (
    <main className={`app-shell age-${age ?? "4-5"} ${isFullscreen ? "is-fullscreen" : ""}`}>
      <header className="play-header">
        <a className="brand" href="#play" aria-label="WonderTaps home">
          <span className="brand-mark">W</span>
          <span>WonderTaps<small>{words.tagline}</small></span>
        </a>
        <div className="header-center" aria-label="Activity progress">
          <span>{words.stars}</span>
          <b>{Array.from({ length: Math.min(stars, 5) }).map((_, i) => <span key={i}>★</span>)}{stars === 0 && "☆ ☆ ☆"}</b>
          <i>{sessionTaps} taps</i>
        </div>
        <div className="header-actions">
          <div className="language-switch" aria-label="Choose language">{(["hi", "en", "hinglish"] as Language[]).map((value) => <button key={value} className={language === value ? "active" : ""} onClick={() => chooseLanguage(value)} lang={value === "hinglish" ? "en-IN" : value}>{languageLabels[value]}</button>)}</div>
          {age === "1" && <button className="family-button" onClick={() => setShowFamily(true)}>👪 {words.family}</button>}
          <button className="sound-button" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "Mute sounds" : "Turn sounds on"} aria-pressed={!soundOn}>{soundOn ? "🔊" : "🔇"}</button>
          <button className="fullscreen-button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>{isFullscreen ? `✕ ${words.exit}` : `⛶ ${words.fullscreen}`}</button>
          <button className="age-pill" onClick={() => setShowAge(true)}>{ageOptions[age ?? "4-5"].icon} {ageOptions[age ?? "4-5"].label}⌄</button>
        </div>
      </header>

      <section className={`sound-lab ${age === "1" ? "toddler-lab" : ""}`} id="play">
        <div className="lab-intro">
          <div>
            <span className="eyebrow">{age === "1" ? words.littleHands : words.orchestra}</span>
            <h1>{age === "1" ? <>{nickname || childName || "Gauri"}, this is<br /><em>your wonder world!</em></> : words.olderTitle}</h1>
          </div>
          {age !== "1" && <div className="mode-switch" aria-label="Choose play mode">
            <button className={mode === "free" ? "active" : ""} onClick={() => changeMode("free")}>🎹 {words.freePlay}</button>
            <button className={mode === "challenge" ? "active" : ""} onClick={() => changeMode("challenge")}>👂 {words.soundHunt}</button>
          </div>}
        </div>

        {age === "1" ? (
          <div className="toddler-world">
            <nav className="toddler-games" aria-label="Games for one year olds">
              <button className={`character-show-tab ${toddlerGame === "show" ? "active" : ""}`} onClick={startCharacterShow}><span>🎬</span><b>Gauri&apos;s Show</b></button>
              <button className={toddlerGame === "fireflies" ? "active" : ""} onClick={() => chooseToddlerGame("fireflies")}><span>🌟</span><b>Glow Garden</b></button>
              <button className={toddlerGame === "soundmatch" ? "active" : ""} onClick={() => chooseToddlerGame("soundmatch")}><span>👂</span><b>Who Called?</b></button>
              <button className={toddlerGame === "parade" ? "active" : ""} onClick={() => chooseToddlerGame("parade")}><span>🥁</span><b>Animal Parade</b></button>
              <button className={toddlerGame === "smash" ? "active" : ""} onClick={() => chooseToddlerGame("smash")}><span>✨</span><b>{words.smash}</b></button>
              <button className={toddlerGame === "bubbles" ? "active" : ""} onClick={() => chooseToddlerGame("bubbles")}><span>🫧</span><b>{words.bubbles}</b></button>
              <button className={toddlerGame === "ball" ? "active" : ""} onClick={() => chooseToddlerGame("ball")}><span>🟠</span><b>{words.ball}</b></button>
              <button className={toddlerGame === "scratch" ? "active" : ""} onClick={() => chooseToddlerGame("scratch")}><span>🎨</span><b>{words.scratch}</b></button>
              <button className={toddlerGame === "piano" ? "active" : ""} onClick={() => chooseToddlerGame("piano")}><span>🎹</span><b>{words.piano}</b></button>
              <button className={toddlerGame === "catch" ? "active" : ""} onClick={() => chooseToddlerGame("catch")}><span>🦜</span><b>{words.catch}</b></button>
              {family.some((member) => member?.photo) && <button className={toddlerGame === "family" ? "active" : ""} onClick={() => chooseToddlerGame("family")}><span>👪</span><b>{words.myFamily}</b></button>}
              <button className={toddlerGame === "hello" ? "active" : ""} onClick={() => chooseToddlerGame("hello")}><span>👋</span><b>{words.hello}</b></button>
              <button className={toddlerGame === "peek" ? "active" : ""} onClick={() => chooseToddlerGame("peek")}><span>🍃</span><b>{words.peek}</b></button>
              <button className={toddlerGame === "dance" ? "active" : ""} onClick={() => chooseToddlerGame("dance")}><span>🎵</span><b>{words.dance}</b></button>
            </nav>

            <div className={`toddler-card game-${toddlerGame}`}>
              <div className="toddler-prompt" role="status">{message}</div>
              {toddlerGame === "show" && <div className="character-cinema">
                <img className="cinema-world" src="./gauri-animal-world.png" alt="Gauri's horse, elephant, lion, monkey, cow and parrot friends in a magical garden" />
                <div className="cinema-title"><small>Now playing</small><b>Gauri &amp; friends</b></div>
                <button className="gauri-host" onClick={() => { setMessage("Hi Gauri! Chalo animals ke saath khelein!"); playPraise(); }} aria-label="Gauri, host of the animal show"><img src="./gauri-character.png" alt="Cartoon Gauri waving and hosting her animal show" /><b>Gauri</b></button>
                <div className="cinema-cast">{animals.map((animal, index) => <button key={animal.key} className={activeAnimal === index ? "star" : ""} onClick={() => triggerAnimal(index)} style={{ "--cast-colour": animal.colour, "--cast-delay": `${index * .12}s` } as React.CSSProperties}><span>{animal.emoji}</span><b>{animalName(index)}</b></button>)}</div>
                <button className="show-control" onClick={() => setShowPlaying((value) => !value)}>{showPlaying ? "⏸ Pause show" : "▶ Play full show"}</button>
              </div>}
              {toddlerGame === "fireflies" && <div className="firefly-garden">
                <img src="./gauri-animal-world.png" alt="Magical garden with Gauri's animal friends" />
                <img className="mini-gauri" src="./gauri-character.png" alt="Gauri catching glowing fireflies" />
                {Array.from({ length: 10 }).map((_, index) => <button key={index} className={caughtFireflies.includes(index) ? "caught" : ""} style={{ "--fly-x": `${8 + ((index * 29) % 84)}%`, "--fly-y": `${12 + ((index * 37) % 64)}%`, "--fly-delay": `${index * -.31}s` } as React.CSSProperties} onClick={() => { if (caughtFireflies.includes(index)) return; setCaughtFireflies((current) => [...current, index]); playNote(index % 8); if (caughtFireflies.length === 9) { setStars((value) => value + 1); setMessage("You lit the whole garden, Gauri! ★"); } }} aria-label={`Catch glowing light ${index + 1}`}><span>✦</span></button>)}
                <div className="glow-score">{caughtFireflies.length}<small>/ 10 lights</small></div>
                {caughtFireflies.length === 10 && <button className="modern-replay" onClick={() => setCaughtFireflies([])}>Play again</button>}
              </div>}
              {toddlerGame === "soundmatch" && <div className="sound-match-world">
                <img src="./gauri-animal-world.png" alt="Gauri's animal friends waiting in the moonlit garden" />
                <div className="sound-question"><button onClick={() => playAnimalSound(soundTarget)} aria-label="Play the mystery animal sound">▶</button><span><small>Who called Gauri?</small>Tap the animal</span></div>
                <div className="match-hotspots">{animals.map((animal, index) => <button key={animal.key} className={activeAnimal === index ? "chosen" : ""} onClick={() => { triggerAnimal(index); if (index === soundTarget) { setStars((value) => value + 1); setMessage(`Yes! ${animalName(index)} called Gauri ★`); window.setTimeout(() => { const next = (soundTarget + 1) % animals.length; setSoundTarget(next); setActiveAnimal(null); setMessage("Listen again. Who is calling?"); playAnimalSound(next); }, 1200); } else setMessage(`That is ${animalName(index)}. Listen again!`); }} aria-label={`Choose ${animal.english}`}><span>{animalName(index)}</span></button>)}</div>
              </div>}
              {toddlerGame === "parade" && <div className="parade-world">
                <img src="./gauri-animal-world.png" alt="Gauri's animal friends ready for their musical parade" />
                <img className="parade-gauri" src="./gauri-character.png" alt="Gauri leading the animal parade" />
                <div className="parade-lane">{animals.map((animal, index) => <button key={animal.key} className={paradeStep % animals.length === index ? "leader" : ""} onClick={() => { playNote(index); setParadeStep(index + 1); setStars((value) => value + (index === paradeStep % animals.length ? 1 : 0)); setMessage(`${animalName(index)} joins Gauri's parade!`); }}><span>{animal.emoji}</span><b>{animalName(index)}</b></button>)}</div>
                <button className="parade-beat" onClick={() => { const next = paradeStep % animals.length; playNote(next); setParadeStep((value) => value + 1); setMessage(`Boom! ${animalName(next)} marches!`); }}>🥁<span>Next beat</span></button>
              </div>}
              {toddlerGame === "smash" && <div
                className="smash-field"
                aria-label="Tap, swipe, click or press any key to make animals appear"
                onPointerDown={(event) => {
                  const box = event.currentTarget.getBoundingClientRect();
                  const index = Math.floor(Math.random() * animals.length);
                  addBurst(((event.clientX - box.left) / box.width) * 100, ((event.clientY - box.top) / box.height) * 100, index);
                  triggerAnimal(index);
                }}
                onPointerMove={(event) => {
                  if (Date.now() - lastTrail.current < 75) return;
                  lastTrail.current = Date.now();
                  const box = event.currentTarget.getBoundingClientRect();
                  addBurst(((event.clientX - box.left) / box.width) * 100, ((event.clientY - box.top) / box.height) * 100, 0, "spark");
                }}
              >
                <div className="meadow-sun">☀️</div><div className="meadow-cloud one">☁️</div><div className="meadow-cloud two">☁️</div>
                <div className="smash-invite"><span>☝️</span><b>{words.tapInvite}</b></div>
                {bursts.map((burst) => burst.kind === "spark" ? <span key={burst.id} className="finger-spark" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>✦</span> : <span key={burst.id} className="smash-burst" style={{ left: `${burst.x}%`, top: `${burst.y}%`, "--burst-colour": animals[burst.animal].colour } as React.CSSProperties}><i>★ ● ✦</i><b>{animals[burst.animal].emoji}</b><small>{animals[burst.animal].hindi}</small></span>)}
                <div className="meadow-ground">🌼　🌱　🌸　🌿　🌻　🌱　🌼</div>
              </div>}
              {toddlerGame === "bubbles" && <div className="bubble-field">
                {Array.from({ length: 9 }).map((_, index) => {
                  const animalIndex = index % animals.length; const popped = poppedBubbles.includes(index);
                  return <button key={index} className={popped ? "popped" : ""} onClick={() => { if (!popped) { setPoppedBubbles((current) => [...current, index]); triggerAnimal(animalIndex); } }} aria-label={`Pop bubble ${index + 1}`}><span>{popped ? animals[animalIndex].emoji : ""}</span></button>;
                })}
                {poppedBubbles.length === 9 && <button className="again-button" onClick={() => setPoppedBubbles([])}>{words.again}</button>}
              </div>}
              {toddlerGame === "ball" && <div className="ball-field" onPointerDown={(event) => {
                const box = event.currentTarget.getBoundingClientRect();
                setBallPosition({ x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 });
              }} onPointerMove={(event) => {
                if (!event.buttons) return; const box = event.currentTarget.getBoundingClientRect();
                setBallPosition({ x: Math.max(8, Math.min(92, ((event.clientX - box.left) / box.width) * 100)), y: Math.max(14, Math.min(82, ((event.clientY - box.top) / box.height) * 100)) });
              }}>
                <span className="ball-animal">🐘</span><span className="ball-animal right">🐴</span>
                <button className="bouncy-ball" style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%` }} onPointerUp={() => triggerAnimal(ballPosition.x > 55 ? 0 : 1)} aria-label="Drag the bouncy ball">गेंद</button>
                <div className="ball-grass">🌱🌼🌱🌼🌱🌼🌱</div>
              </div>}
              {toddlerGame === "scratch" && <div className="scratch-field" onPointerDown={(event) => {
                const box = event.currentTarget.getBoundingClientRect(); setScratchMarks((marks) => [...marks.slice(-35), { id: ++markId.current, x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 }]);
              }} onPointerMove={(event) => {
                if (!event.buttons) return; const box = event.currentTarget.getBoundingClientRect(); setScratchMarks((marks) => [...marks.slice(-35), { id: ++markId.current, x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 }]);
              }}>
                <div className="rangoli-animal">🦁<b>शेर</b></div><div className="rangoli-cover" style={{ opacity: Math.max(.08, 1 - scratchMarks.length / 28) }}><span>✋</span></div>
                {scratchMarks.map((mark) => <i key={mark.id} style={{ left: `${mark.x}%`, top: `${mark.y}%` }}>✦</i>)}
                {scratchMarks.length > 20 && <button className="again-button" onClick={(event) => { event.stopPropagation(); setScratchMarks([]); triggerAnimal(2); }}>फिर रंगो! ↻</button>}
              </div>}
              {toddlerGame === "piano" && <div className="animal-piano">
                <div className="piano-stage" key={pulse}>{activeAnimal === null ? "🎶" : animals[activeAnimal].emoji}</div>
                <div className="piano-keys">{[0,1,2,3,4,5,0,1].map((animalIndex, note) => <button key={note} onClick={() => playNote(note)} style={{ "--key-colour": animals[animalIndex].colour } as React.CSSProperties} aria-label={`Play note ${note + 1}`}><span>{animals[animalIndex].emoji}</span><b>{note + 1}</b></button>)}</div>
              </div>}
              {toddlerGame === "catch" && <div className="catch-field">
                <div className="catch-tree">🌳</div><div className="catch-clouds">☁️　☁️</div>
                <button className="flying-tota" key={`${birdPosition.x}-${birdPosition.y}`} style={{ left: `${birdPosition.x}%`, top: `${birdPosition.y}%` }} onClick={() => { triggerAnimal(5); setStars((value) => value + 1); setBirdPosition({ x: 12 + Math.random() * 76, y: 20 + Math.random() * 58 }); }} aria-label="Catch the flying parrot">🦜<span>★</span></button>
              </div>}
              {toddlerGame === "family" && <div className="family-peek-field" style={{ "--family-colour": favouriteColour } as React.CSSProperties}>
                <h3>{nickname || childName ? `${nickname || childName}${words.familyTitle}` : words.myFamily}</h3>
                <div className="family-peek-grid">{family.filter((member): member is FamilyMember => Boolean(member?.photo)).map((member, index) => <button key={`${member.name}-${index}`} className={familyReveal === index ? "revealed" : ""} onClick={() => { setFamilyReveal(index); playPraise(); }} aria-label={`Find ${member.name}`}><span className="family-curtain">🎁</span><img src={member.photo} alt={member.name} /><b>{member.name}</b></button>)}</div>
              </div>}
              {toddlerGame === "hello" && <div className="toddler-animal-grid">
                {animals.map((animal, index) => <button key={animal.key} className={activeAnimal === index ? "playing" : ""} style={{ "--animal-colour": animal.colour } as React.CSSProperties} onClick={() => triggerAnimal(index)} aria-label={`Hear a real ${animal.english}`}><span>{animal.emoji}</span><b>{animalName(index)}</b></button>)}
              </div>}
              {toddlerGame === "peek" && <div className="peek-grid">
                {[1, 4, 0].map((animalIndex, door) => <button key={animalIndex} className={revealed === door ? "open" : ""} onClick={() => { setRevealed(door); triggerAnimal(animalIndex); }} aria-label={`Open leaf ${door + 1}`}><span className="leaf">🍃</span><span className="peek-animal">{animals[animalIndex].emoji}</span><b>{revealed === door ? animalName(animalIndex) : words.who}</b></button>)}
              </div>}
              {toddlerGame === "dance" && <div className="dance-floor">
                <div className={`dance-star ${activeAnimal !== null ? "dancing" : ""}`} key={pulse}>{activeAnimal === null ? "🎶" : animals[activeAnimal].emoji}</div>
                <div className="dance-choices">{[2, 3, 5].map((index) => <button key={index} style={{ "--animal-colour": animals[index].colour } as React.CSSProperties} onClick={() => triggerAnimal(index)} aria-label={`Make ${animals[index].name} dance`}>{animals[index].emoji}</button>)}</div>
              </div>}
            </div>
            <p className="toddler-note">{words.toddlerNote}</p>
          </div>
        ) : <>

        <div className="stage-wrap">
          <img src="./khelkatha-animal-stage.png" alt="A horse, elephant, lion, monkey, cow and parrot performing together on a colourful village stage" />
          <div className="sun-pulse" aria-hidden="true" />
          {animals.map((animal, index) => (
            <button
              key={animal.key}
              className={`animal-hotspot ${activeAnimal === index ? "playing" : ""}`}
              style={{ left: animal.x, "--animal-colour": animal.colour } as React.CSSProperties}
              onClick={() => triggerAnimal(index)}
              aria-label={`Play ${animal.name}, keyboard key ${animal.key}`}
            >
              <kbd>{animal.key}</kbd>
              {activeAnimal === index && <span key={pulse}>{animal.sound}</span>}
            </button>
          ))}
          <div className={`message-cloud ${activeAnimal !== null ? "celebrate" : ""}`} key={`${message}-${pulse}`} role="status">{message}</div>
          {activeAnimal !== null && <div className="confetti" key={pulse} aria-hidden="true">✦ ● ★ ✦ ●</div>}
        </div>

        <div className="keyboard-row" aria-label="Animal sound keyboard">
          {animals.map((animal, index) => (
            <button key={animal.key} className={activeAnimal === index ? "playing" : ""} onClick={() => triggerAnimal(index)} style={{ "--animal-colour": animal.colour } as React.CSSProperties}>
              <kbd>{animal.key}</kbd><span>{animal.emoji}</span><strong>{animalName(index)}</strong><small>{animal.sound}</small>
            </button>
          ))}
        </div>
        <p className="keyboard-tip">{words.keyboardTip}</p>
        </>}
      </section>

      <section className="how-it-learns">
        <div><span>👂</span><b>{words.hear}</b><small>{words.hearNote}</small></div>
        <div><span>☝️</span><b>{words.find}</b><small>{words.findNote}</small></div>
        <div><span>🗣️</span><b>{words.speak}</b><small>{words.speakNote}</small></div>
        <div><span>★</span><b>{words.win}</b><small>{words.winNote}</small></div>
      </section>

      <section className="parent-note">
        <div><span className="eyebrow">{words.grownups}</span><h2>{words.parentTitle}</h2></div>
        <p>{words.parentBody}</p>
        <div className="safe-stamp">{words.safe.map((line) => <span key={line}>{line}<br /></span>)}</div>
      </section>

      <footer><b>WonderTaps</b><span>Playful learning made for curious little hands.</span><small>Animal recordings: Wikimedia Commons • See source credits in the repository</small></footer>

      {showAge && (
        <div className="age-overlay" role="dialog" aria-modal="true" aria-labelledby="age-title">
          <div className="age-dialog">
            <div className="welcome-orbit" aria-hidden="true"><span>🐴</span><span>🐘</span><b>W</b><span>🦜</span><span>🦁</span></div>
            <span className="eyebrow">{words.ageSetup}</span>
            <h2 id="age-title">{words.ageQuestion}</h2>
            <p>{words.ageNote}</p>
            <div className="setup-language" aria-label="Choose site language">{(["hi", "en", "hinglish"] as Language[]).map((value) => <button key={value} className={language === value ? "active" : ""} onClick={() => chooseLanguage(value)}>{languageLabels[value]}</button>)}</div>
            <div className="age-options">
              {(Object.keys(ageOptions) as AgeGroup[]).map((value) => (
                <button key={value} onClick={() => chooseAge(value)}>
                  <span>{ageOptions[value].icon}</span><b>{ageOptions[value].label}</b><small>{ageOptions[value].note}</small>
                </button>
              ))}
            </div>
            {age && <button className="close-age" onClick={() => setShowAge(false)}>Keep {ageOptions[age].label}</button>}
          </div>
        </div>
      )}
      {showFamily && <div className="family-overlay" role="dialog" aria-modal="true" aria-labelledby="family-title">
        <div className="family-dialog">
          <button className="family-close" onClick={() => setShowFamily(false)} aria-label="Close family setup">✕</button>
          <span className="eyebrow">Private parent setup</span><h2 id="family-title">Make it hers</h2>
          <p>Everything stays in this browser on this device.</p>
          <div className="profile-fields"><label>Daughter&apos;s name<input value={childName} onChange={(event) => setChildName(event.target.value)} placeholder="Name" /></label><label>Nickname<input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Gudiya" /></label><label>Favourite colour<input type="color" value={favouriteColour} onChange={(event) => setFavouriteColour(event.target.value)} /></label></div>
          <h3>Family faces <small>up to 3</small></h3><div className="family-slots">{[0,1,2].map((index) => <div key={index}>{family[index]?.photo ? <img src={family[index].photo} alt="Family preview" /> : <span>📷</span>}<input value={family[index]?.name || ""} onChange={(event) => setFamily((current) => { const next=[...current]; next[index]={ name:event.target.value, photo:next[index]?.photo || "" }; return next; })} placeholder="Mumma / Nani" /><label className="photo-pick">Choose photo<input type="file" accept="image/*" onChange={(event) => addFamilyPhoto(event.target.files?.[0], index)} /></label></div>)}</div>
          <div className="voice-setup"><div><b>Family praise</b><small>Record “Shabash!” or her favourite phrase (5 sec)</small></div><button className={isRecording ? "recording" : ""} onClick={toggleRecording}>{isRecording ? "■ Stop" : "● Record"}</button>{praiseAudio && <button onClick={playPraise}>▶ Play</button>}</div>
          <button className="save-family" onClick={saveFamily}>Save Family Mode</button>
        </div>
      </div>}
    </main>
  );
}

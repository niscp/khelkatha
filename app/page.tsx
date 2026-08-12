"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AgeGroup = "1" | "2-3" | "4-5" | "6-7";

const ageOptions: Record<AgeGroup, { label: string; icon: string; note: string }> = {
  "1": { label: "1 year", icon: "🧸", note: "Tap & hear" },
  "2-3": { label: "2–3 years", icon: "🌱", note: "Name & copy" },
  "4-5": { label: "4–5 years", icon: "🌼", note: "Listen & find" },
  "6-7": { label: "6–7 years", icon: "🚀", note: "Remember & solve" },
};

const animals = [
  { key: "A", emoji: "🐴", name: "Ghoda", hindi: "घोड़ा", sound: "हिन-हिन!", colour: "#ef735e", x: "10%", audio: "horse.ogg" },
  { key: "S", emoji: "🐘", name: "Hathi", hindi: "हाथी", sound: "पों-पों!", colour: "#64b7d4", x: "29%", audio: "elephant.ogg" },
  { key: "D", emoji: "🦁", name: "Sher", hindi: "शेर", sound: "गुर्रर्र!", colour: "#f2ad35", x: "45%", audio: "lion.ogg" },
  { key: "F", emoji: "🐵", name: "Bandar", hindi: "बंदर", sound: "ऊँ-आँ!", colour: "#a980cc", x: "60%", audio: "monkey.ogg" },
  { key: "G", emoji: "🐮", name: "Gaay", hindi: "गाय", sound: "माँऽऽ!", colour: "#f5eee0", x: "76%", audio: "cow.ogg" },
  { key: "H", emoji: "🦜", name: "Tota", hindi: "तोता", sound: "चीं-चीं!", colour: "#69b84a", x: "91%", audio: "parrot.ogg" },
];

type ToddlerGame = "smash" | "bubbles" | "ball" | "scratch" | "piano" | "catch" | "family" | "hello" | "peek" | "dance";
type Burst = { id: number; x: number; y: number; animal: number; kind: "animal" | "spark" };
type FamilyMember = { name: string; photo: string };

export default function Home() {
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [showAge, setShowAge] = useState(false);
  const [activeAnimal, setActiveAnimal] = useState<number | null>(null);
  const [mode, setMode] = useState<"free" | "challenge">("free");
  const [challenge, setChallenge] = useState(2);
  const [stars, setStars] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [message, setMessage] = useState("कोई key दबाओ • Press any animal key!");
  const [toddlerGame, setToddlerGame] = useState<ToddlerGame>("smash");
  const [revealed, setRevealed] = useState<number | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 55 });
  const [scratchMarks, setScratchMarks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [birdPosition, setBirdPosition] = useState({ x: 68, y: 42 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [childName, setChildName] = useState("");
  const [nickname, setNickname] = useState("");
  const [favouriteColour, setFavouriteColour] = useState("#ef6654");
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [familyReveal, setFamilyReveal] = useState<number | null>(null);
  const [praiseAudio, setPraiseAudio] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const burstId = useRef(0);
  const lastTrail = useRef(0);
  const markId = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("khelkatha-age") as AgeGroup | null;
    if (saved && saved in ageOptions) {
      setAge(saved);
      if (saved === "1") {
        setToddlerGame("smash");
        setMessage("कहीं भी छूओ! • Tap anywhere!");
      }
    }
    else setShowAge(true);
    try {
      const profile = JSON.parse(window.localStorage.getItem("khelkatha-family") || "null");
      if (profile) {
        setChildName(profile.childName || ""); setNickname(profile.nickname || "");
        setFavouriteColour(profile.favouriteColour || "#ef6654"); setFamily(profile.family || []);
        setPraiseAudio(profile.praiseAudio || "");
      }
    } catch { /* start with an empty private profile */ }
  }, []);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const playAnimalSound = useCallback((index: number) => {
    try {
      audioRef.current?.pause();
      const audio = new Audio(`./sounds/${animals[index].audio}`);
      audio.volume = .9;
      audioRef.current = audio;
      void audio.play().catch(() => { /* browsers may block sound until the first physical tap */ });
      if (index === 2 || index === 3) window.setTimeout(() => audio.pause(), 2800);
    } catch { /* visual play continues if audio is unavailable */ }
  }, []);

  const triggerAnimal = useCallback((index: number) => {
    const animal = animals[index];
    setActiveAnimal(index);
    setPulse((value) => value + 1);
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
    setToddlerGame("smash");
    setMessage(value === "1" ? "कहीं भी छूओ! • Tap anywhere!" : `${animals[challenge].sound} कौन बोलता है?`);
    window.localStorage.setItem("khelkatha-age", value);
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
      smash: "कहीं भी छूओ!", bubbles: "बुलबुले फोड़ो!", ball: "गेंद को घुमाओ!",
      scratch: "उंगली घुमाओ!", piano: "सुर बजाओ!", catch: "तोता पकड़ो!", family: "कौन छुपा है?",
      hello: "जानवर को छूओ!", peek: "पत्ते के पीछे कौन है?", dance: "किसको नचाएँ?",
    };
    setMessage(prompts[value]);
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
    window.localStorage.setItem("khelkatha-family", JSON.stringify({ childName, nickname, favouriteColour, family, praiseAudio }));
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
        <a className="brand" href="#play" aria-label="KhelKatha home">
          <span className="brand-mark">क</span>
          <span>KhelKatha<small>खेलो • सुनो • सीखो</small></span>
        </a>
        <div className="header-center" aria-label="Activity progress">
          <span>आज के सितारे</span>
          <b>{Array.from({ length: Math.min(stars, 5) }).map((_, i) => <span key={i}>★</span>)}{stars === 0 && "☆ ☆ ☆"}</b>
        </div>
        <div className="header-actions">
          {age === "1" && <button className="family-button" onClick={() => setShowFamily(true)}>👪 Family</button>}
          {age === "1" && <button className="fullscreen-button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>{isFullscreen ? "✕ Exit" : "⛶ Fullscreen"}</button>}
          <button className="age-pill" onClick={() => setShowAge(true)}>{ageOptions[age ?? "4-5"].icon} {ageOptions[age ?? "4-5"].label}⌄</button>
        </div>
      </header>

      <section className={`sound-lab ${age === "1" ? "toddler-lab" : ""}`} id="play">
        <div className="lab-intro">
          <div>
            <span className="eyebrow">{age === "1" ? "Little hands play garden" : "KhelKatha animal orchestra"}</span>
            <h1>{age === "1" ? <>छूओ. सुनो.<br /><em>फिर से खेलो!</em></> : <>Keyboard दबाओ.<br /><em>जानवर जगाओ!</em></>}</h1>
          </div>
          {age !== "1" && <div className="mode-switch" aria-label="Choose play mode">
            <button className={mode === "free" ? "active" : ""} onClick={() => changeMode("free")}>🎹 Free play</button>
            <button className={mode === "challenge" ? "active" : ""} onClick={() => changeMode("challenge")}>👂 Sound hunt</button>
          </div>}
        </div>

        {age === "1" ? (
          <div className="toddler-world">
            <nav className="toddler-games" aria-label="Games for one year olds">
              <button className={toddlerGame === "smash" ? "active" : ""} onClick={() => chooseToddlerGame("smash")}><span>✨</span><b>Animal Smash</b></button>
              <button className={toddlerGame === "bubbles" ? "active" : ""} onClick={() => chooseToddlerGame("bubbles")}><span>🫧</span><b>Bubble Pop</b></button>
              <button className={toddlerGame === "ball" ? "active" : ""} onClick={() => chooseToddlerGame("ball")}><span>🟠</span><b>Bouncy Gend</b></button>
              <button className={toddlerGame === "scratch" ? "active" : ""} onClick={() => chooseToddlerGame("scratch")}><span>🎨</span><b>Rangoli Scratch</b></button>
              <button className={toddlerGame === "piano" ? "active" : ""} onClick={() => chooseToddlerGame("piano")}><span>🎹</span><b>Animal Piano</b></button>
              <button className={toddlerGame === "catch" ? "active" : ""} onClick={() => chooseToddlerGame("catch")}><span>🦜</span><b>Catch Tota</b></button>
              {family.some((member) => member?.photo) && <button className={toddlerGame === "family" ? "active" : ""} onClick={() => chooseToddlerGame("family")}><span>👪</span><b>My Family</b></button>}
              <button className={toddlerGame === "hello" ? "active" : ""} onClick={() => chooseToddlerGame("hello")}><span>👋</span><b>Animal Hello</b></button>
              <button className={toddlerGame === "peek" ? "active" : ""} onClick={() => chooseToddlerGame("peek")}><span>🍃</span><b>Peekaboo</b></button>
              <button className={toddlerGame === "dance" ? "active" : ""} onClick={() => chooseToddlerGame("dance")}><span>🎵</span><b>Dance Party</b></button>
            </nav>

            <div className={`toddler-card game-${toddlerGame}`}>
              <div className="toddler-prompt" role="status">{message}</div>
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
                <div className="smash-invite"><span>☝️</span><b>Tap • Swipe • Smash keys</b></div>
                {bursts.map((burst) => burst.kind === "spark" ? <span key={burst.id} className="finger-spark" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>✦</span> : <span key={burst.id} className="smash-burst" style={{ left: `${burst.x}%`, top: `${burst.y}%`, "--burst-colour": animals[burst.animal].colour } as React.CSSProperties}><i>★ ● ✦</i><b>{animals[burst.animal].emoji}</b><small>{animals[burst.animal].hindi}</small></span>)}
                <div className="meadow-ground">🌼　🌱　🌸　🌿　🌻　🌱　🌼</div>
              </div>}
              {toddlerGame === "bubbles" && <div className="bubble-field">
                {Array.from({ length: 9 }).map((_, index) => {
                  const animalIndex = index % animals.length; const popped = poppedBubbles.includes(index);
                  return <button key={index} className={popped ? "popped" : ""} onClick={() => { if (!popped) { setPoppedBubbles((current) => [...current, index]); triggerAnimal(animalIndex); } }} aria-label={`Pop bubble ${index + 1}`}><span>{popped ? animals[animalIndex].emoji : ""}</span></button>;
                })}
                {poppedBubbles.length === 9 && <button className="again-button" onClick={() => setPoppedBubbles([])}>फिर से! ↻</button>}
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
                <h3>{nickname || childName ? `${nickname || childName} की Family` : "मेरी Family"}</h3>
                <div className="family-peek-grid">{family.filter((member): member is FamilyMember => Boolean(member?.photo)).map((member, index) => <button key={`${member.name}-${index}`} className={familyReveal === index ? "revealed" : ""} onClick={() => { setFamilyReveal(index); playPraise(); }} aria-label={`Find ${member.name}`}><span className="family-curtain">🎁</span><img src={member.photo} alt={member.name} /><b>{member.name}</b></button>)}</div>
              </div>}
              {toddlerGame === "hello" && <div className="toddler-animal-grid">
                {animals.map((animal, index) => <button key={animal.key} className={activeAnimal === index ? "playing" : ""} style={{ "--animal-colour": animal.colour } as React.CSSProperties} onClick={() => triggerAnimal(index)} aria-label={`Hear a real ${animal.name}`}><span>{animal.emoji}</span><b>{animal.hindi}</b></button>)}
              </div>}
              {toddlerGame === "peek" && <div className="peek-grid">
                {[1, 4, 0].map((animalIndex, door) => <button key={animalIndex} className={revealed === door ? "open" : ""} onClick={() => { setRevealed(door); triggerAnimal(animalIndex); }} aria-label={`Open leaf ${door + 1}`}><span className="leaf">🍃</span><span className="peek-animal">{animals[animalIndex].emoji}</span><b>{revealed === door ? animals[animalIndex].hindi : "कौन?"}</b></button>)}
              </div>}
              {toddlerGame === "dance" && <div className="dance-floor">
                <div className={`dance-star ${activeAnimal !== null ? "dancing" : ""}`} key={pulse}>{activeAnimal === null ? "🎶" : animals[activeAnimal].emoji}</div>
                <div className="dance-choices">{[2, 3, 5].map((index) => <button key={index} style={{ "--animal-colour": animals[index].colour } as React.CSSProperties} onClick={() => triggerAnimal(index)} aria-label={`Make ${animals[index].name} dance`}>{animals[index].emoji}</button>)}</div>
              </div>}
            </div>
            <p className="toddler-note">बड़े बटन • असली जानवरों की आवाज़ • कोई गलत जवाब नहीं</p>
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
              <kbd>{animal.key}</kbd><span>{animal.emoji}</span><strong>{animal.hindi}</strong><small>{animal.sound}</small>
            </button>
          ))}
        </div>
        <p className="keyboard-tip">Laptop पर A S D F G H दबाएँ • On phone, tap any animal</p>
        </>}
      </section>

      <section className="how-it-learns">
        <div><span>👂</span><b>सुनो</b><small>Hear a unique voice</small></div>
        <div><span>☝️</span><b>खोजो</b><small>Match sound to animal</small></div>
        <div><span>🗣️</span><b>बोलो</b><small>Hindi + English names</small></div>
        <div><span>★</span><b>जीतो</b><small>Earn a happy star</small></div>
      </section>

      <section className="parent-note">
        <div><span className="eyebrow">For grown-ups</span><h2>It feels like noise.<br />It&apos;s actually learning.</h2></div>
        <p>Every key builds cause-and-effect understanding, listening memory, animal recognition and bilingual vocabulary. Sound Hunt adds a simple recall challenge when your child is ready.</p>
        <div className="safe-stamp">✓ No ads<br />✓ No account<br />✓ Big safe taps</div>
      </section>

      <footer><b>KhelKatha</b><span>Original characters inspired by the joy of Indian childhood.</span><small>Animal recordings: Wikimedia Commons • See source credits in the repository</small></footer>

      {showAge && (
        <div className="age-overlay" role="dialog" aria-modal="true" aria-labelledby="age-title">
          <div className="age-dialog">
            <span className="eyebrow">Grown-up setup</span>
            <h2 id="age-title">बच्चा कितने साल का है?</h2>
            <p>We&apos;ll set the right pace and play style.</p>
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

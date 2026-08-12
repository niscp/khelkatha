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

type ToddlerGame = "hello" | "peek" | "dance";

export default function Home() {
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [showAge, setShowAge] = useState(false);
  const [activeAnimal, setActiveAnimal] = useState<number | null>(null);
  const [mode, setMode] = useState<"free" | "challenge">("free");
  const [challenge, setChallenge] = useState(2);
  const [stars, setStars] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [message, setMessage] = useState("कोई key दबाओ • Press any animal key!");
  const [toddlerGame, setToddlerGame] = useState<ToddlerGame>("hello");
  const [revealed, setRevealed] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("khelkatha-age") as AgeGroup | null;
    if (saved && saved in ageOptions) setAge(saved);
    else setShowAge(true);
  }, []);

  const playAnimalSound = useCallback((index: number) => {
    try {
      audioRef.current?.pause();
      const audio = new Audio(`./sounds/${animals[index].audio}`);
      audio.volume = .9;
      audioRef.current = audio;
      void audio.play();
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

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat || showAge) return;
      const index = animals.findIndex((animal) => animal.key.toLowerCase() === event.key.toLowerCase());
      if (index >= 0) {
        event.preventDefault();
        triggerAnimal(index);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showAge, triggerAnimal]);

  function chooseAge(value: AgeGroup) {
    setAge(value);
    setShowAge(false);
    setMode(value === "1" ? "free" : "challenge");
    setMessage(value === "1" ? "जानवर को छूओ • Tap an animal!" : `${animals[challenge].sound} कौन बोलता है?`);
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
    setMessage(value === "hello" ? "जानवर को छूओ!" : value === "peek" ? "पत्ते के पीछे कौन है?" : "किसको नचाएँ?");
  }

  return (
    <main className={`app-shell age-${age ?? "4-5"}`}>
      <header className="play-header">
        <a className="brand" href="#play" aria-label="KhelKatha home">
          <span className="brand-mark">क</span>
          <span>KhelKatha<small>खेलो • सुनो • सीखो</small></span>
        </a>
        <div className="header-center" aria-label="Activity progress">
          <span>आज के सितारे</span>
          <b>{Array.from({ length: Math.min(stars, 5) }).map((_, i) => <span key={i}>★</span>)}{stars === 0 && "☆ ☆ ☆"}</b>
        </div>
        <button className="age-pill" onClick={() => setShowAge(true)}>{ageOptions[age ?? "4-5"].icon} {ageOptions[age ?? "4-5"].label}⌄</button>
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
              <button className={toddlerGame === "hello" ? "active" : ""} onClick={() => chooseToddlerGame("hello")}><span>👋</span><b>Animal Hello</b></button>
              <button className={toddlerGame === "peek" ? "active" : ""} onClick={() => chooseToddlerGame("peek")}><span>🍃</span><b>Peekaboo</b></button>
              <button className={toddlerGame === "dance" ? "active" : ""} onClick={() => chooseToddlerGame("dance")}><span>🎵</span><b>Dance Party</b></button>
            </nav>

            <div className={`toddler-card game-${toddlerGame}`}>
              <div className="toddler-prompt" role="status">{message}</div>
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
    </main>
  );
}

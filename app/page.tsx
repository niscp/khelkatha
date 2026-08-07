"use client";

import { useEffect, useState } from "react";

type AgeGroup = "1" | "2-3" | "4-5" | "6-7";

const ageProfiles: Record<AgeGroup, {
  label: string;
  icon: string;
  title: string;
  accent: string;
  hero: string;
  intro: string;
  maxCount: number;
  playTitle: string;
  playHelp: string;
  skills: string;
  cardLines: string[];
  cardPrompts: string[];
}> = {
  "1": {
    label: "1 year", icon: "🧸", title: "नन्हे टॉडलर", accent: "Tap & hear",
    hero: "छूओ, सुनो,\nफिर से छूओ!", intro: "Extra-big pictures, happy sounds and one-tap play for little explorers.",
    maxCount: 2, playTitle: "एक हाथी, दो हाथी!", playHelp: "Tap together. Hear the sound. Count one and two.",
    skills: "cause & effect • animal sounds • 1–2 counting",
    cardLines: ["Tap for clip-clop!", "Tap for stomp-stomp!", "Tap for dha-dhin!"],
    cardPrompts: ["घोड़ा! टप-टप!", "हाथी! धम-धम!", "ढोल! धा-धिन!"],
  },
  "2-3": {
    label: "2–3 years", icon: "🌱", title: "नन्हे खोजी", accent: "Listen & tap",
    hero: "छूओ, सुनो,\nऔर मुस्कुराओ!", intro: "Big pictures, tiny words and gentle sounds—perfect for first taps.",
    maxCount: 3, playTitle: "चलो तीन हाथी गिनें!", playHelp: "Tap slowly and say each number together.",
    skills: "sounds • first words • 1–3 counting",
    cardLines: ["Tap the horse to hear its beat", "Count three friendly elephants", "Clap to a slow dholak rhythm"],
    cardPrompts: ["घोड़ा बोले टप-टप!", "चलो तीन हाथी गिनें!", "धीरे-धीरे ताली बजाओ!"],
  },
  "4-5": {
    label: "4–5 years", icon: "🌼", title: "कहानी साथी", accent: "Sing & count",
    hero: "छूओ, सुनो,\nऔर कहानी में आओ!", intro: "Songs, simple choices and playful counting for curious growing minds.",
    maxCount: 5, playTitle: "पाँच हाथियों को गिनें?", playHelp: "Tap the big button and count the elephants out loud.",
    skills: "rhythm • Hindi words • 1–5 counting",
    cardLines: ["Follow the horse's quick rhythm", "Count, stomp and make a splash", "Copy the dholak rhythm"],
    cardPrompts: ["टप-टप! घोड़ा कितनी तेज़ दौड़े?", "धम-धम! पाँच हाथियों को गिनें?", "धा-धिन! मेरे साथ ताली बजाओ।"],
  },
  "6-7": {
    label: "6–7 years", icon: "🚀", title: "चतुर खिलाड़ी", accent: "Read & solve",
    hero: "पढ़ो, सोचो,\nऔर चुनौती जीतो!", intro: "Longer prompts, number challenges and rhythm patterns for confident explorers.",
    maxCount: 10, playTitle: "क्या दस हाथी गिन सकते हो?", playHelp: "Count on, spot the number and reach ten without losing the beat.",
    skills: "reading • patterns • 1–10 counting",
    cardLines: ["Read and build a galloping pattern", "Count to ten and solve the challenge", "Remember a three-beat rhythm"],
    cardPrompts: ["टप-टप-रुको—क्या तुम यह क्रम दोहरा सकते हो?", "दस तक गिनो—अगला हाथी कौन-सा होगा?", "तीन ताल याद रखो: धा-धिन-धा!"],
  },
};

const worlds = [
  {
    id: "ghoda",
    eyebrow: "सुनो • गाओ • दौड़ाओ",
    title: "लकड़ी की काठी",
    subtitle: "Tap the horse and follow the beat",
    icon: "🐴",
    color: "coral",
    prompt: "टप-टप! घोड़ा कितनी तेज़ दौड़े?",
  },
  {
    id: "hathi",
    eyebrow: "गिनो • नाचो • सीखो",
    title: "मोटा हाथी",
    subtitle: "Count, stomp and make a splash",
    icon: "🐘",
    color: "blue",
    prompt: "धम-धम! पाँच हाथियों को गिनें?",
  },
  {
    id: "madari",
    eyebrow: "ताल • ताली • तमाशा",
    title: "कालू मदारी",
    subtitle: "Copy the dholak rhythm",
    icon: "🥁",
    color: "purple",
    prompt: "धा-धिन! मेरे साथ ताली बजाओ।",
  },
];

export default function Home() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("अपनी कहानी चुनो!");
  const [progress, setProgress] = useState([false, false, false]);
  const [rhythmTaps, setRhythmTaps] = useState(0);
  const [colorFeedback, setColorFeedback] = useState("लाल रंग ढूँढो • Find red");
  const [openingActivity, setOpeningActivity] = useState<number | null>(null);
  const profile = ageProfiles[ageGroup ?? "4-5"];

  useEffect(() => {
    const saved = window.localStorage.getItem("nanhi-duniya-age") as AgeGroup | null;
    if (saved && saved in ageProfiles) setAgeGroup(saved);
    else setShowAgePicker(true);
  }, []);

  function chooseAge(group: AgeGroup) {
    setAgeGroup(group);
    setShowAgePicker(false);
    setCount(1);
    setProgress([false, false, false]);
    setRhythmTaps(0);
    setColorFeedback("लाल रंग ढूँढो • Find red");
    setMessage(ageProfiles[group].playTitle);
    window.localStorage.setItem("nanhi-duniya-age", group);
  }

  function playBeat(index: number) {
    setActive(index);
    setMessage(profile.cardPrompts[index]);
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      void context.resume();
      [0, 0.13, 0.28].forEach((delay, beat) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 2 ? "triangle" : "sine";
        oscillator.frequency.value = 260 + index * 90 + beat * 35;
        gain.gain.setValueAtTime(0.08, context.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + delay + 0.12);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(context.currentTime + delay);
        oscillator.stop(context.currentTime + delay + 0.14);
      });
      window.setTimeout(() => void context.close(), 700);
    } catch {
      // Visual play must continue when a browser or device blocks Web Audio.
    }
  }

  function finishActivity(index: number) {
    setProgress((current) => current.map((done, item) => item === index ? true : done));
  }

  function openActivity(index: number) {
    setActive(index);
    setMessage(profile.cardPrompts[index]);
    setOpeningActivity(index);
    window.requestAnimationFrame(() => {
      document.getElementById("play")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.setTimeout(() => setOpeningActivity(null), 900);
    playBeat(index);
  }

  const rhythmGoal = ageGroup === "1" ? 1 : ageGroup === "2-3" ? 2 : ageGroup === "4-5" ? 3 : 4;

  return (
    <main className={ageGroup === "1" ? "toddler-mode" : ""}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Nanhi Duniya home">
          <span className="brand-mark" aria-hidden="true">न</span>
          <span>नन्ही दुनिया<small>Nanhi Duniya</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#stories">कहानियाँ</a>
          <a href="#play">खेलो</a>
          <a href="#grownups">For grown-ups</a>
        </nav>
        <div className="header-actions">
          <button className="age-pill" onClick={() => setShowAgePicker(true)} aria-label={`Change age group, currently ${profile.label}`}>
            <span aria-hidden="true">{profile.icon}</span> {profile.label} <b>⌄</b>
          </button>
          <button className="sound-pill" onClick={() => playBeat(active)} aria-label="Play a cheerful sound">
            <span aria-hidden="true">♪</span> Sound on
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="kicker"><span>★</span> {profile.title} • {profile.accent}</div>
          <h1>{profile.hero.split("\n").map((line, index) => <span key={line}>{index === 1 ? <em>{line}</em> : line}{index === 0 && <br />}</span>)}</h1>
          <p>{profile.intro}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#stories">चलो खेलें <span aria-hidden="true">→</span></a>
            <span className="age-note"><b>{profile.label}</b><br />Made for this stage.</span>
          </div>
        </div>
        <div className="hero-art" role="img" aria-label="A wooden horse, friendly elephant, musician and children dancing in a sunny storybook meadow">
          <img src="/nanhi-duniya-hero.png" alt="" />
          <span className="music-note note-one" aria-hidden="true">♪</span>
          <span className="music-note note-two" aria-hidden="true">♫</span>
        </div>
        <a href="#stories" className="scroll-cue" aria-label="Scroll to stories">↓</a>
      </section>

      <section className="stories" id="stories">
        <div className="section-heading">
          <div><span className="section-kicker">आज क्या खेलें?</span><h2>Pick a story world</h2></div>
          <p>हर कहानी में गाना, खेल और एक छोटी-सी सीख।<br />Every tap brings a happy surprise.</p>
        </div>
        <div className="story-grid">
          {worlds.map((world, index) => (
            <button
              key={world.id}
              className={`story-card ${world.color} ${active === index ? "active" : ""}`}
              onClick={() => openActivity(index)}
              aria-pressed={active === index}
            >
              <span className="card-number">0{index + 1}</span>
              <span className="character" aria-hidden="true">{world.icon}</span>
              <span className="card-copy">
                <small>{world.eyebrow}</small>
                <strong>{world.title}</strong>
                <span>{profile.cardLines[index]}</span>
              </span>
              <span className="round-arrow" aria-hidden="true">→</span>
              {openingActivity === index && <span className="launch-feedback" role="status">खेल खुल रहा है…</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="learning-trail" aria-label="Learning progress">
        <div>
          <span className="section-kicker">आज की सीख • Today&apos;s learning</span>
          <strong>{progress.filter(Boolean).length} of 3 activities complete</strong>
        </div>
        {[
          ["🎨", "रंग", "Colours"],
          ["🔢", "गिनती", "Numbers"],
          ["🎵", "ताल", "Rhythm"],
        ].map((item, index) => (
          <button key={item[1]} className={progress[index] ? "complete" : active === index ? "current" : ""} onClick={() => openActivity(index)}>
            <span>{progress[index] ? "✓" : item[0]}</span><b>{item[1]}</b><small>{progress[index] ? "सीख लिया!" : item[2]}</small>
          </button>
        ))}
      </section>

      <section className={`playground lesson-${active}`} id="play">
        <div className="play-copy">
          <span className="section-kicker">{active === 0 ? "रंगों का खेल • Colour play" : active === 1 ? "गिनती का खेल • Number play" : "ताल का खेल • Rhythm play"}</span>
          <h2>{active === 0 ? colorFeedback : active === 1 ? (message === "अपनी कहानी चुनो!" ? profile.playTitle : message) : `ढोल बजाओ: ${rhythmTaps} / ${rhythmGoal}`}</h2>
          <p>{active === 0 ? (ageGroup === "6-7" ? "Choose the colour that comes first in a rainbow." : "Tap the red circle. Say लाल together.") : active === 1 ? profile.playHelp : `Tap the drum ${rhythmGoal} ${rhythmGoal === 1 ? "time" : "times"} to finish the rhythm.`}</p>
          {active === 1 && <div className="dots" aria-label={`${count} elephants`}>
            {Array.from({ length: count }).map((_, index) => <span key={index}>🐘</span>)}
          </div>}
          {active === 0 && <div className="colour-choices">
            {[["लाल", "#ef5b4c"], ["नीला", "#55acd0"], ["पीला", "#ffd95a"]].map(([name, colour], index) => (
              <button
                key={name}
                style={{ background: colour }}
                aria-label={`${name} colour`}
                onClick={() => {
                  if (index === 0) {
                    setColorFeedback("शाबाश! यह लाल है • Red!");
                    finishActivity(0);
                  } else setColorFeedback(`फिर से कोशिश करो • Try another colour`);
                }}
              ><span>{name}</span></button>
            ))}
          </div>}
        </div>
        {active === 1 && <button
          className="stomp-button"
          onClick={() => {
            const next = count === profile.maxCount ? 1 : count + 1;
            setCount(next);
            setMessage(next === profile.maxCount ? `वाह! पूरे ${profile.maxCount} हाथी!` : `${next} हाथी — धम, धम!`);
            if (next === profile.maxCount) finishActivity(1);
          }}
          aria-label="Add one elephant"
        >
          <span>+1</span>
          हाथी जोड़ो
        </button>}
        {active === 0 && <div className="lesson-mascot" aria-hidden="true">🐴<small>लाल काठी!</small></div>}
        {active === 2 && <button
          className="drum-button"
          onClick={() => {
            playBeat(2);
            const next = rhythmTaps + 1;
            if (next >= rhythmGoal) {
              setRhythmTaps(rhythmGoal);
              finishActivity(2);
            } else setRhythmTaps(next);
          }}
          aria-label="Tap the drum"
        ><span>🥁</span>{rhythmTaps >= rhythmGoal ? "शाबाश!" : "धा!"}</button>}
      </section>

      <section className="grownups" id="grownups">
        <div className="grownup-art" aria-hidden="true"><span>✋</span><span>★</span><span>✋</span></div>
        <div>
          <span className="section-kicker">For parents & teachers</span>
          <h2>Screen time that feels like playtime.</h2>
          <p>Short, calm activities encourage listening, counting, rhythm and Hindi vocabulary—without ads or distracting menus.</p>
        </div>
        <div className="trust-list">
          <span>✓ Original, gentle stories</span>
          <span>✓ Big buttons for tiny fingers</span>
          <span>✓ Current focus: {profile.skills}</span>
        </div>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark">न</span><span>नन्ही दुनिया<small>Made with wonder in India</small></span></div>
        <p>Original stories inspired by the joy of Indian childhood rhymes.</p>
        <span>© 2026 Nanhi Duniya</span>
      </footer>

      {showAgePicker && (
        <div className="age-overlay" role="dialog" aria-modal="true" aria-labelledby="age-title">
          <div className="age-dialog">
            <div className="age-sun" aria-hidden="true">☀</div>
            <span className="section-kicker">For a grown-up</span>
            <h2 id="age-title">बच्चा कितने साल का है?</h2>
            <p>Choose an age group. We’ll adjust words, counting and challenges to match.</p>
            <div className="age-options">
              {(Object.keys(ageProfiles) as AgeGroup[]).map((group) => {
                const option = ageProfiles[group];
                return (
                  <button key={group} onClick={() => chooseAge(group)} className={ageGroup === group ? "selected" : ""}>
                    <span className="age-icon" aria-hidden="true">{option.icon}</span>
                    <strong>{option.label}</strong>
                    <small>{option.title}</small>
                    <span>{option.accent} →</span>
                  </button>
                );
              })}
            </div>
            <small className="privacy-note">🔒 Saved only on this device. Change it anytime from the top menu.</small>
          </div>
        </div>
      )}
    </main>
  );
}

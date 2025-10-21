import { useEffect, useRef, useState, type JSX } from "react";

// ------------------ TYPES ------------------
interface SequenceData {
  pattern: string;
  startOffset: number;
  duration: number;
}

interface Song extends SequenceData {
  name: string;
  path: string;
  audio: HTMLAudioElement;
  isPlaying: boolean;
  isLoop: boolean;
  startTime?: number;
}

// ------------------ CONFIG ------------------
const SAMPLE_PATHS = [
    "samples/clave", 
    "samples/one-to-six", 
    "samples/three-beat",
];

// ------------------ HELPERS ------------------
function humanize(name?: string): string {
  if (!name) return "";
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function loadSequence(path: string): Promise<SequenceData> {
  const res = await fetch(`${path}/sequence.txt`);
  const txt = await res.text();
  const lines = txt.trim().split("\n");
  //const lines = txt.split("\n");

  const [pattern, startLine, durationLine] = lines;
  const [startMin, startMs] = startLine.split(":").map(Number);
  const [durSec, durMs] = durationLine.split(":").map(Number);

  const startOffset = startMin * 1000 + startMs;
  const duration = durSec * 1000 + durMs;

  return { pattern, startOffset, duration };
}

// ------------------ MAIN COMPONENT ------------------
export default function App(): JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | null>(null);

  // ---- Load all songs on mount ----
  useEffect(() => {
    async function loadSongs() {
      const list: Song[] = await Promise.all(
        SAMPLE_PATHS.map(async (path) => {
          const folderName = path.split("/").pop() || "";
          const audio = new Audio(`${path}/audio.m4a`);
          const seq = await loadSequence(path);

          return {
            name: humanize(folderName),
            path,
            audio,
            ...seq,
            isPlaying: false,
            isLoop: true,
          };
        })
      );
      setSongs(list);
    }
    loadSongs();
  }, []);

  // ---- Efficient Progress Updater ----
  const animateProgress = () => {
    const now = performance.now();
    progressRefs.current.forEach((ref, i) => {
      const song = songs[i];
      if (song?.isPlaying && ref) {
        const elapsed = now - (song.startTime ?? 0);
        const progress = (elapsed % song.duration) / song.duration;
        ref.style.left = `${progress * 100}%`;
      }
    });
    animationRef.current = requestAnimationFrame(animateProgress);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateProgress);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [songs]);

  // ---- Play/Stop toggle ----
  const togglePlay = (index: number) => {
    setSongs((prev) =>
      prev.map((song, i) => {
        if (i === index) {
          if (!song.isPlaying) {
            song.audio.currentTime = song.startOffset / 1000;
            song.audio.play();
            song.audio.loop = song.isLoop;
            song.startTime = performance.now();
          } else {
            song.audio.pause();
          }
          return { ...song, isPlaying: !song.isPlaying };
        }
        return song;
      })
    );
  };


  return (
    <div className="app">
      <h1>🥁 Drum Circle Beats</h1>
      {songs.map((song, i) => (
        <div key={i} className="song">
          <div className="song-header">
            <button onClick={() => togglePlay(i)}>
              {song.isPlaying ? "Stop" : "Play"}
            </button>
            <h3>{song.name}</h3>
          </div>

          <div className="sequence-graph">
            {song.pattern.split("").map((ch, idx) => {
              const isBass = ch === "b";
              const isTone = ch === "t"
              if (song.pattern[idx] === "|" ) return;
                if (idx < song.pattern.length-1) {
                    const isBeatChange = song.pattern[idx + 1] === "|"
                    return <div key={idx} className={`beat ${isBeatChange ? "beatChange" : ""} ${isBass ? "bass" : isTone ? "tone" : "rest"} `} >{isBass ? "B" : isTone ? "T" : ""}</div>;
                }
            })}
            <div
              className="progress-line"
              
              ref={(el) => {progressRefs.current[i] = el}}
              style={{ left: "0%" }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { Howl } from "howler";

interface AudioContextType {
  playMusic: (track: string, fadeMs?: number) => void;
  stopMusic: (fadeMs?: number) => void;
  playSfx: (name: string) => void;
  toggleMute: () => void;
  setSceneMusic: (scene: "main" | "museum") => void;
  isMuted: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    return {
      playMusic: () => {},
      stopMusic: () => {},
      playSfx: () => {},
      toggleMute: () => {},
      setSceneMusic: () => {},
      isMuted: false,
    };
  }
  return ctx;
}

interface Props {
  children: React.ReactNode;
}

export function AudioProvider({ children }: Props) {
  const musicRef = useRef<Howl | null>(null);
  const currentTrackRef = useRef<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const playMusic = (track: string) => {
    // Don't restart if same track is already playing
    if (currentTrackRef.current === track && musicRef.current) {
      // Just update volume in case mute state changed
      musicRef.current.volume(isMuted ? 0 : 0.3);
      return;
    }

    // Stop and unload previous music
    if (musicRef.current) {
      musicRef.current.stop();
      musicRef.current.unload();
    }

    const newMusic = new Howl({
      src: [track],
      loop: true,
      volume: isMuted ? 0 : 0.3,
      html5: true,
      autoplay: true,
      onloaderror: (_id, err) => {
        console.error("Audio load error:", track, err);
      },
      onplayerror: (_id, err) => {
        console.error("Audio play error:", track, err);
        newMusic.once("unlock", () => {
          newMusic.play();
        });
      },
    });

    musicRef.current = newMusic;
    currentTrackRef.current = track;
  };

  const setSceneMusic = (scene: "main" | "museum") => {
    const track = scene === "museum" 
      ? "/audio/music/dream.mp3" 
      : "/audio/music/hogwarts.mp3";
    playMusic(track);
  };

  const stopMusic = (fadeMs = 1000) => {
    if (musicRef.current) {
      musicRef.current.fade(musicRef.current.volume(), 0, fadeMs);
      setTimeout(() => {
        musicRef.current?.stop();
        musicRef.current?.unload();
        musicRef.current = null;
      }, fadeMs);
    }
  };

  const playSfx = (name: string) => {
    if (isMuted) return;
    const sfx = new Howl({
      src: [`/audio/sfx/${name}.mp3`],
      volume: 0.5,
    });
    sfx.play();
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (musicRef.current) {
        musicRef.current.volume(next ? 0 : 0.3);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      musicRef.current?.unload();
    };
  }, []);

  return (
    <AudioContext.Provider value={{ playMusic, stopMusic, playSfx, toggleMute, setSceneMusic, isMuted }}>
      {children}
    </AudioContext.Provider>
  );
}

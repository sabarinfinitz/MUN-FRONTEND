"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { MotionBar } from "@/components/MotionBar";
import { SpeechCard } from "@/components/SpeechCard";
import { ChairLine } from "@/components/ChairLine";
import { RoundFloorSeats } from "@/components/RoundFloorSeats";
import { VotingPanel } from "@/components/VotingPanel";
import { mockDelegates, isSpeech, type FloorItem } from "@/lib/mockData";

const MAX_CHARS = 800;

// SpeechRecognition is not in TypeScript's DOM lib; use type assertion at runtime
const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? (window as Window & { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition
    : undefined;

type GlobalFloorProps = {
  userCountryId: string | null;
  floorItems: FloorItem[];
  currentSpeakerId: string | null;
  timerExpired: boolean;
  pendingVote: { label: string } | null;
  onVote?: (vote: "supporting" | "neutral" | "opposing") => void;
  onPointOfOrder?: () => void;
  onYieldTime?: () => void;
  onMotionToAdjourn?: () => void;
  onMotionCaucus?: () => void;
};

export function GlobalFloor({
  userCountryId,
  floorItems,
  currentSpeakerId,
  timerExpired,
  pendingVote,
  onVote,
  onPointOfOrder,
  onYieldTime,
  onMotionToAdjourn,
  onMotionCaucus,
}: GlobalFloorProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSpeechId, setSpeakingSpeechId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<{ stop?: () => void; abort?: () => void } | null>(null);
  const feedContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    synthRef.current = typeof window !== "undefined" ? window.speechSynthesis : null;
    return () => {
      synthRef.current?.cancel();
      recognitionRef.current?.abort?.();
    };
  }, []);

  useLayoutEffect(() => {
    const el = feedContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [floorItems.length]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const speakText = (text: string, speechId?: string) => {
    const t = text.trim();
    if (!t || !synthRef.current) return;
    synthRef.current.cancel();
    setSpeakingSpeechId(speechId ?? null);
    const utterance = new SpeechSynthesisUtterance(t);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSpeechId(null);
    };
    synthRef.current.speak(utterance);
  };

  const speakDraft = () => speakText(draft);
  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    setSpeakingSpeechId(null);
  };

  const toggleListening = () => {
    if (!SpeechRecognitionAPI) {
      showToast("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop?.();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }
    type RecognitionResult = { isFinal: boolean; 0: { transcript: string }; length: number };
    type RecognitionEvent = { resultIndex: number; results: RecognitionResult[] };
    type RecognitionInstance = {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: (event: RecognitionEvent) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    };
    const recognition = new SpeechRecognitionAPI() as unknown as RecognitionInstance;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: RecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setDraft((prev) => {
          const next = prev + finalTranscript;
          return next.length > MAX_CHARS ? next.slice(0, MAX_CHARS) : next;
        });
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition as { stop?: () => void; abort?: () => void };
    recognition.start();
    setIsListening(true);
  };

  const speeches = floorItems.filter(isSpeech);
  const lastSpeechFromCurrent = currentSpeakerId
    ? [...speeches].reverse().find((s) => s.delegateId === currentSpeakerId)
    : undefined;
  const activeSpeechId = lastSpeechFromCurrent ? lastSpeechFromCurrent.id : null;
  const charCount = draft.length;
  const atLimit = charCount >= MAX_CHARS;

  const getCountryLabel = (delegateId: string) => {
    const name = mockDelegates.find((d) => d.id === delegateId)?.name ?? delegateId;
    return delegateId === userCountryId
      ? `Delegate of ${name} (You)`
      : `Delegate of ${name}`;
  };

  return (
    <section className="center flex flex-col" aria-label="Global floor speeches">
      <h2 className="panel-title">Global Floor</h2>

      <RoundFloorSeats
        userCountryId={userCountryId}
        currentSpeakerId={currentSpeakerId}
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Dialogue
        </span>
        <span className="text-[10px] text-slate-600">Newest at bottom</span>
      </div>
      <div
        ref={feedContainerRef}
        className="feed mt-2 flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-behavior-auto"
        style={{ maxHeight: "50vh" }}
      >
        {floorItems.map((item) =>
          isSpeech(item) ? (
            <SpeechCard
              key={item.id}
              delegateId={item.delegateId}
              country={getCountryLabel(item.delegateId)}
              flagLabel={item.flagLabel}
              openingLine={item.openingLine}
              timestamp={item.timestamp}
              isActive={item.id === activeSpeechId}
              onSpeak={(text) => speakText(text, item.id)}
              isSpeaking={speakingSpeechId === item.id}
            />
          ) : (
            <ChairLine key={item.id} text={item.text} timestamp={item.timestamp} />
          )
        )}
      </div>

      {pendingVote && onVote && (
        <div className="mt-3">
          <VotingPanel
            visible={true}
            motionLabel={pendingVote.label}
            onVote={onVote}
          />
        </div>
      )}

      <MotionBar
        disabled={timerExpired}
        onMotionCaucus={onMotionCaucus}
        onPointOfOrder={onPointOfOrder}
        onYieldTime={onYieldTime}
        onAdjourn={onMotionToAdjourn}
      />

      <div className="input-card" aria-disabled={timerExpired}>
        <div className="input-header">
          <span className="input-label">Draft your speech</span>
          <span className="input-meta">
            {timerExpired
              ? "Time elapsed — input disabled"
              : "Chair will gavel at 60 seconds"}
          </span>
        </div>
        <textarea
          className="speech-input"
          placeholder="Honorable Chair, distinguished delegates..."
          rows={4}
          disabled={timerExpired}
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
          maxLength={MAX_CHARS}
          aria-label="Draft your speech"
        />
        <div className="input-footer flex flex-wrap items-center justify-between gap-2">
          <span className="char-count text-slate-400" aria-live="polite">
            {charCount} / {MAX_CHARS} characters
            {atLimit && " (limit reached)"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              disabled={timerExpired || atLimit}
              className={`btn ${isListening ? "btn-secondary" : "btn-ghost"} disabled:cursor-not-allowed disabled:opacity-60`}
              title={isListening ? "Stop dictating" : "Dictate (speech-to-text)"}
              aria-label={isListening ? "Stop listening" : "Start dictation"}
            >
              {isListening ? "Stop mic" : "Mic"}
            </button>
            <button
              type="button"
              onClick={isSpeaking ? stopSpeaking : speakDraft}
              disabled={timerExpired || (!draft.trim() && !isSpeaking)}
              className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
              title={isSpeaking ? "Stop speaking" : "Read your draft aloud (text-to-speech)"}
              aria-label={isSpeaking ? "Stop speaking" : "Speak your draft aloud"}
            >
              {isSpeaking ? "Stop speaking" : "Speak aloud"}
            </button>
            <button
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={timerExpired}
              type="button"
              title="Submit your speech to the floor"
            >
              Yield the Floor
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </section>
  );
}

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { HeaderDais } from "@/components/HeaderDais";
import { CaucusSidebar, type Country } from "@/components/CaucusSidebar";
import { GlobalFloor } from "@/components/GlobalFloor";
import { ResolutionSidebar } from "@/components/ResolutionSidebar";
import { CountrySelectScreen } from "@/components/CountrySelectScreen";
import { VotingPanel, type VoteOption } from "@/components/VotingPanel";
import {
  mockDelegates,
  PRESET_TOPICS,
  getSpeechesForTopic,
  getResolutionForTopic,
  type FloorItem,
  type ChairMessage,
} from "@/lib/mockData";

const mockCountries: Country[] = [
  { name: "Germany", mood: "supporting" },
  { name: "France", mood: "supporting" },
  { name: "Brazil", mood: "neutral" },
  { name: "India", mood: "supporting" },
  { name: "China", mood: "opposing" },
  { name: "South Africa", mood: "neutral" },
  { name: "United States", mood: "neutral" },
];

function pickRandomTopic() {
  return PRESET_TOPICS[Math.floor(Math.random() * PRESET_TOPICS.length)];
}

function chairMsg(text: string): ChairMessage {
  return { type: "chair", id: `chair-${Date.now()}`, text, timestamp: "Just now" };
}

export function Dashboard() {
  const [userCountryId, setUserCountryId] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>(pickRandomTopic);
  const [customTopicDraft, setCustomTopicDraft] = useState("");
  const [recognizedDelegateId, setRecognizedDelegateId] = useState<string | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [floorItems, setFloorItems] = useState<FloorItem[]>(() => getSpeechesForTopic(topic, null));
  const [pendingVote, setPendingVote] = useState<{ label: string } | null>(null);

  const resolution = useMemo(() => getResolutionForTopic(topic), [topic]);

  useEffect(() => {
    setFloorItems(getSpeechesForTopic(topic, userCountryId));
  }, [topic, userCountryId]);

  const handleRecognizeDelegate = (delegateId: string) => {
    const delegate = mockDelegates.find((d) => d.id === delegateId);
    const name = delegate?.name ?? delegateId;
    setFloorItems((prev) => [
      ...prev,
      chairMsg(`The AI Chair recognizes the Delegate of ${name}.`),
    ]);
    setRecognizedDelegateId(delegateId);
    setTimerExpired(false);
  };

  const handleTimerExpire = () => {
    setTimerExpired(true);
    setRecognizedDelegateId(null);
  };

  const handlePointOfOrder = useCallback(() => {
    setFloorItems((prev) => [...prev, chairMsg("Point of order raised. The AI Chair will rule.")]);
    setTimeout(() => {
      setFloorItems((prev) => [
        ...prev,
        chairMsg("The AI Chair rules: point of order is well taken. The delegate may continue."),
      ]);
    }, 1500);
  }, []);

  const handleYieldTime = useCallback(() => {
    const delegate = mockDelegates.find((d) => d.id === recognizedDelegateId);
    const name = delegate?.name ?? "the delegate";
    setFloorItems((prev) => [
      ...prev,
      chairMsg(`The Delegate of ${name} yields the remainder of their time to the AI Chair.`),
    ]);
    setRecognizedDelegateId(null);
    setTimerExpired(true);
  }, [recognizedDelegateId]);

  const handleMotionToAdjourn = useCallback(() => {
    setFloorItems((prev) => [
      ...prev,
      chairMsg("Motion to adjourn has been moved. The committee will vote."),
    ]);
    setPendingVote({ label: "Motion to adjourn" });
  }, []);

  const handleMotionCaucus = useCallback(() => {
    setFloorItems((prev) => [
      ...prev,
      chairMsg("A moderated caucus has been moved. All those in favor?"),
    ]);
    setPendingVote({ label: "Moderated caucus" });
  }, []);

  const handleVote = useCallback(
    (vote: VoteOption) => {
      const delegate = mockDelegates.find((d) => d.id === userCountryId);
      const name = delegate?.name ?? "the delegate";
      const voteLabel =
        vote === "supporting" ? "For" : vote === "neutral" ? "Abstain" : "Against";
      setFloorItems((prev) => [
        ...prev,
        chairMsg(`The Delegate of ${name} votes ${voteLabel}.`),
      ]);
      const motionLabel = pendingVote?.label ?? "Motion";
      setPendingVote(null);
      setTimeout(() => {
        setFloorItems((prev) => [
          ...prev,
          chairMsg(
            "Vote results: For 4, Abstain 2, Against 1. The motion carries."
          ),
        ]);
        if (motionLabel === "Motion to adjourn") {
          setTimeout(() => {
            setFloorItems((prev) => [
              ...prev,
              chairMsg("Session adjourned."),
            ]);
          }, 800);
        } else {
          setTimeout(() => {
            setFloorItems((prev) => [
              ...prev,
              chairMsg("The committee will proceed to a moderated caucus."),
            ]);
          }, 800);
        }
      }, 500);
    },
    [userCountryId, pendingVote?.label]
  );

  const handleRandomTopic = () => setTopic(pickRandomTopic());
  const handleProceedWithCustomTopic = () => {
    const t = customTopicDraft.trim();
    if (t) {
      setTopic(t);
      setCustomTopicDraft("");
    }
  };

  if (userCountryId === null) {
    return (
      <CountrySelectScreen
        onSelect={(delegateId) => {
          setUserCountryId(delegateId);
          setRecognizedDelegateId(delegateId);
        }}
      />
    );
  }

  return (
    <div className="mun-app">
      <HeaderDais
        committeeName="UN General Assembly – Health Committee"
        topic={topic}
        currentMotion={`Moderated caucus on ${topic}`}
        delegates={mockDelegates}
        recognizedDelegateId={recognizedDelegateId}
        onRecognizeDelegate={handleRecognizeDelegate}
        onTimerExpire={handleTimerExpire}
        onRandomTopic={handleRandomTopic}
        customTopicDraft={customTopicDraft}
        onCustomTopicDraftChange={setCustomTopicDraft}
        onProceedWithCustomTopic={handleProceedWithCustomTopic}
      />

      <main className="layout">
        <CaucusSidebar countries={mockCountries} />
        <GlobalFloor
          userCountryId={userCountryId}
          floorItems={floorItems}
          currentSpeakerId={recognizedDelegateId}
          timerExpired={timerExpired}
          pendingVote={pendingVote}
          onVote={handleVote}
          onPointOfOrder={handlePointOfOrder}
          onYieldTime={handleYieldTime}
          onMotionToAdjourn={handleMotionToAdjourn}
          onMotionCaucus={handleMotionCaucus}
        />
        <ResolutionSidebar
          workingPaperTitle="Working Paper 1.1"
          preambulatory={resolution.preambulatory}
          operative={resolution.operative}
        />
      </main>
    </div>
  );
}

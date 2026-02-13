# MUN-AI: Project Implementation Plan & Documentation

## 1. Project Overview
An interactive **Model United Nations (MUN) Simulator** designed for the **Gemini 3 Hackathon**. The system allows a human user to participate as a country delegate in a high-fidelity simulation alongside 14+ AI-driven delegates and an AI Chair.

### Core Objectives:
*   Simulate formal MUN Rules of Procedure (RoP).
*   Provide high-reasoning diplomatic behavior using Gemini 3.
*   Offer a real-time, reactive UI for the simulation.

---

## 2. Technical Stack
*   **Backend:** FastAPI (Python)
*   **Orchestration:** LangGraph (State Machine control)
*   **High-Speed Cache:** **Upstash Redis** (Context caching and live session metadata)
*   **Primary Database:** **PostgreSQL** (Managed persistence for LangGraph checkpoints and history)
*   **AI Engine:** Gemini 3 Pro/Flash (High-reasoning, Function Calling)
*   **Voice Pipeline:** Gemini 2.5 Live (Low-latency emotional audio)
*   **Real-time Interaction:** Ably & LiveKit
*   **Frontend:** Next.js (TypeScript)

---

## 3. Gemini 3 Feature Implementation
We are leveraging specific Gemini 3 capabilities to solve the complexity of multi-agent simulation:

| Feature | Application in MUN-AI |
| --- | --- |
| **Thought Signatures** | Every AI Delegate generates an internal "Diplomatic Strategy" before their formal speech. This is stored in their private state but not broadcast to the whole room. |
| **Function Calling** | Used primarily by the **Chair** to update the room state (e.g., `set_motion`, `start_timer`, `yield_floor`). |
| **Context Caching** | The **Committee Study Guide** and **Rules of Procedure** are cached to reduce latency and token costs across the hundreds of speaker turns. |

---

## 4. System Architecture

### A. LangGraph Orchestration
The simulation is a stateful graph where nodes represent specific roles:
*   **Chair Node:** The supervisor. Decides the next speaker or phase based on transcript history.
*   **Delegate Node:** A polymorphic node that assumes the identity of a specific country (USA, China, etc.) using its stored "Object" profile.
*   **User Node:** A "breakpoint" that waits for human input (speech/vote) before resuming AI turns.

### B. Real-time Sync via Ably
To avoid constant polling from the Next.js frontend, we use Ably as a two-way bridge:
1.  **Backend -> Frontend:** Published events like `motion_started`, `speech_stream`, or `vote_cast`.
2.  **Frontend -> Backend:** User actions like `raise_placard` or `submit_speech` are sent to the API, which then updates the LangGraph state.

---

## 5. Domain Logic (The MUN Bible)
The system enforces the following phases:
1.  **Roll Call:** Determines "Present" vs "Present and Voting".
2.  **GSL (General Speakers List):** The baseline state; a continuous queue of speakers.
3.  **Moderated Caucus:** High-intensity debate on sub-topics with strict timers.
4.  **Unmoderated Caucus:** Free-form negotiation (Simulated via private message clusters).
5.  **Voting Bloc:** Strict procedure for passing/failing resolutions.

---

## 6. Implementation Roadmap
- [x] Project Concept & Domain Logic Mapping
- [x] Tech Stack Definition (LangGraph + Ably + Gemini 3)
- [ ] Backend: Initialize LangGraph with Chair/Delegate nodes
- [ ] Real-time: Set up **LiveKit Server** for WebRTC audio streaming
- [ ] AI: Setup **Gemini 2.5 Live** as the audio synthesis worker
- [ ] Backend: Integrate Gemini 3 Function Calling for the Chair
- [ ] Real-time: Wire Ably into FastAPI tool execution
- [ ] Frontend: Design `MotionBar` and `Timer` that react to Ably events
- [ ] AI: Implement "Thought Signature" persistence in agent profiles
- [ ] Optimization: Set up Context Caching for large Study Guides

---

## 7. State Management Structure (The "Objects")
Every delegate is treated as a persistent object in the `AgentState`:
```python
{
    "country": "India",
    "policy": "Nuclear non-proliferation but maintain energy sovereignty.",
    "allies": ["Russia", "Brazil"],
    "internal_strategy": [], # History of thought signatures
    "is_user": False
}
```

---

## 8. Functional Definitions (AI Chair Tools)
The Chair (Gemini 3) will have access to this comprehensive toolset to manage every aspect of the simulation.

### Procedural Tools
| Function | Parameters | Purpose |
| --- | --- | --- |
| `set_motion` | `topic: str, total_min: int, indiv_sec: int` | Switches debate to a Moderated Caucus. Sets the global timer. |
| `update_gsl` | `ordered_countries: List[str]` | Add/Remove/Reorder delegates in the General Speakers List. |
| `yield_floor` | `country_name: str, duration_sec: int` | Gives the "microphone" to a specific delegate. Triggers audio stream. |
| `suspend_session` | `duration_min: int` | Triggers an Unmoderated Caucus (negotiation phase). |
| `extend_session` | `minutes: int` | Extends the current caucus time if requested. |
| `close_debate` | `none` | Moves the committee from debate to voting procedure. |

### Voting Tools
| Function | Parameters | Purpose |
| --- | --- | --- |
| `open_voting` | `motion_id: str, type: "PROCEDURAL" | "SUBSTANTIVE"` | Locks the room for voting. |
| `tally_vote` | `country: str, vote: "YES" | "NO" | "ABSTAIN"` | Records a vote. Can be called in a loop for Roll Call. |
| `announce_result` | `passed: bool, counts: Dict[str, int]` | Finalizes the vote and returns to the previous state. |

### Document Tools
| Function | Parameters | Purpose |
| --- | --- | --- |
| `create_resolution` | `sponsors: List[str], signatories: List[str]` | Initializes a new draft document. |
| `add_clause` | `doc_id: str, type: "PRE" | "OP", text: str` | Appends a clause to the working paper. |
| `amend_clause` | `clause_id: str, new_text: str` | Modifies an existing clause (requires voting if unfriendly). |

---

## 9. Real-time Messaging Catalog (Ably)
Ably events bridge the gap between AI backend logic and Frontend UI reactivity.

### Channel: `room:{room_id}:public`
Events broadcast to all participants.

*   **`EVENT_PHASE_CHANGE`**: Data: `{ "new_phase": "VOTING" }`. Updates the layout.
*   **`EVENT_TIMER_START`**: Data: `{ "seconds": 60, "label": "India speaking" }`.
*   **`EVENT_NEW_SPEECH_CHUNK`**: Data: `{ "country": "USA", "text": "...", "is_final": false }`. Allows for "typing" animation.
*   **`EVENT_PLACARD_HIT`**: Data: `{ "country": "Russia" }`. Visual cue when a delegate wants to speak.
*   **`EVENT_DOC_UPDATE`**: Data: `{ "delta": "..." }`. Syncs the Draft Resolution text.

### Channel: `user:{country}:private`
Events sent only to the human user's country.

*   **`EVENT_STRATEGY_HINT`**: Data: `{ "thought": "The Chair is leaning towards the EU bloc. Speak now to shift focus." }`. Surfaces Gemini's "Thought Signature" as a hint.

---

## 10. Data Schemas

### AgentState (The "Room State" Object)
When `/room/state` is called, this full object is returned to hydrate the UI.

```typescript
{
  room_id: string;
  phase: "ROLL_CALL" | "GSL" | "MOD" | "UNMOD" | "VOTING";
  
  // Speaker & Timer Info
  current_speaker: string | null; // Country name
  timer: {
    total_remaining: number; // For the whole caucus
    speaker_remaining: number; // For the individual speech
    is_paused: boolean;
  };

  // Lists
  gsl_queue: string[]; // Countries waiting to speak
  attendees: {
    country: string;
    status: "PRESENT" | "PRESENT_AND_VOTING" | "ABSENT";
    mood: "NEUTRAL" | "ANGRY" | "HAPPY" | "DETERMINED"; // Added for UI indicators
    is_user: boolean;
  }[];

  // Documents
  resolutions: {
    id: string;
    title: string;
    clauses: { type: "PRE"|"OP", text: string }[];
    sponsors: string[];
  }[];

  // Live Activity
  active_motion: {
    topic: string;
    total_time: number;
    speaker_time: number;
  } | null;
  
  placards_raised: string[]; // List of countries signaling
}
```

### Motion Object
```typescript
{
  id: string;
  proposer: string;
  topic: string;
  total_time: number;
  speaker_time: number;
  votes_for: number;
  status: "PENDING" | "ACTIVE" | "PASSED" | "FAILED";
}
```

---

## 11. End-to-End Implementation Workflow

This section describes the "Round Trip" of a single speaker turn in the MUN-AI simulator.

### Step 1: Turn Assignment (LangGraph)
*   The **Chair Node** evaluates the `gsl_queue` and `transcript`.
*   The Chair decides it is Japan's turn to speak using **Function Calling** (`yield_floor`).
*   LangGraph updates the `current_speaker` state to "Japan".

### Step 2: High-Level Reasoning (The Brain - Gemini 3 Flash)
*   The **Delegate Node** is invoked with Japan's profile.
*   **Thought Signature Generation:** Japan's agent first generates an internal strategy: *"I need to support the US proposal but emphasize my own climate initiatives to lead the Asian bloc."*
*   **Diplomatic Output:** Japan generates a formal speech text containing **Emotion Tags**: `"[Determined] Honourable Chair, fellow delegates, Japan rises to address the urgent need for..."`.

### Step 3: Audio Synthesis (The Voice - Gemini 2.5 Live)
*   The system detects the `[Determined]` tag.
*   It sends the text and the emotion context to the **Gemini 2.5 Live API**.
*   Gemini 2.5 Live generates a low-latency WebRTC audio stream.
*   The audio is piped into the **LiveKit Room** under the "Japan_Speaker" identity.

### Step 4: Real-time UI Synchronization (Ably)
*   Simultaneously with Step 3, the backend publishes an Ably event: `EVENT_TIMER_START`.
*   The **Next.js Frontend** receives the event, starts the 45-second countdown timer, and highlights Japan's seat on the floor map.
*   The speech text (minus emotion tags) is streamed to the `SpeechCard` component for accessibility.

### Step 5: State Persistence & Loop
*   Once the audio finishes (LiveKit event), the `transcript` is updated with Japan's formal text.
*   Control returns to the **Chair Node**.
*   The Chair calls the next delegate or transitions to a different phase (e.g., Voting).

### Step 6: Human Intervention
*   If the user wishes to speak, they hit **"Raise Placard"** (Ably message to Backend).
*   The API adds the User's country to the `gsl_queue` in the LangGraph state.
*   When it's the User's turn, the Graph reaches a **Breakpoint**, pausing execution and waiting for the User's audio/text input before continuing the simulation.

---

## 12. Technical Architecture & File Structure

### A. Backend (`MUN-Sim/`)
*   `main.py`: FastAPI entry point and endpoint definitions.
*   `graph_agent.py`: LangGraph implementation (Nodes, Edges, State).
*   `models.py`: Pydantic models for API requests/responses.
*   `state.py`: TypedDict definitions for AgentState and Delegate profiles.
*   `tools.py`: Python functions for Gemini 3 Function Calling (e.g., `set_motion`).
*   `voice_worker.py`: Integration with Gemini 2.5 Live and LiveKit for audio streaming.
*   `ably_client.py`: Wrapper for Ably publishing.
*   `prompts/`: Directory containing System Prompts for Chair and Delegates.

### B. Frontend (`MUNbot-frontend/`)
*   `src/app/`: Next.js App Router pages (Dashboard, Room selection).
*   `src/components/`:
    *   `LiveKitAudio.tsx`: Handles WebRTC connection and audio playback.
    *   `Sidebar/`: GSL Queue and Resolution drafts.
    *   `Floor/`: Interactive room map with delegate seating.
    *   `Controls/`: Placard raising, Point/Motion submission.
*   `src/lib/ably.ts`: Ably client initialization and hook for event subscription.
*   `src/hooks/useTimer.ts`: Local countdown logic synchronized by Ably events.

---

## 13. API Endpoints

### Room Management (`/room`)
| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/room/create` | **Arguments:** `user_country`, `room_name`, `device_id`. <br> **Action:** Initializes LangGraph, generates `room_id`, and immediately starts the session (Roll Call phase). |
| `POST` | `/room/delete` | **Arguments:** `room_id`. <br> **Action:** Cleans up the LangGraph state and Ably channels. |
| `GET`  | `/room/state` | **Arguments:** `room_id`. <br> **Returns:** Complete `AgentState` object (see Schema). Used for full UI refresh. |
| `GET`  | `/room/analysis`| **Arguments:** `room_id`. <br> **Returns:** AI-generated summary of the session so far (Bloc positions, likely outcome). |

### User Actions (`/user`)
| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/user/chat` | **Arguments:** `type: "AUDIO"|"TEXT"`, `content: str`. <br> **Action:** Submits a formal speech or Point to the Chair. Processing depends on turn (GSL vs Interruption). |
| `POST` | `/user/vote` | **Arguments:** `vote: "YES"|"NO"|"ABSTAIN"`. <br> **Action:** Casts vote during an active `open_voting` phase. |
| `POST` | `/user/raise_card`| **Arguments:** `none`. <br> **Action:** Signals desire to speak. Adds User to the `gsl_queue` request list. |
| `POST` | `/user/yield` | **Arguments:** `yield_to: "CHAIR" | "Q&A" | "DELEGATE"`. <br> **Action:** Ends the user's current speech early and passes the floor. |

---

## 15. Environment & Security (.env)
Required keys for production-ready deployment:
*   `GEMINI_API_KEY`: For Gemini 3 and Gemini 2.5 Live.
*   `ABLY_API_KEY`: For real-time state synchronization.
*   `UPSTASH_REDIS_REST_URL`: For context caching to reduce latency/cost.
*   `UPSTASH_REDIS_REST_TOKEN`: For secure serverless Redis access.
*   `DATABASE_URL`: Postgres (Supabase/Upstash) for persistent checkpoints.
*   `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`: For WebRTC audio.

---

## 16. Technical Success Metrics
*   **Latency:** Floor yield to audio start < 500ms (achieved via Gemini 2.5 Live + Ably).
*   **Role Adherence:** AI delegates must not use "I/Me" and must adhere to 100% of their national policy metadata.
*   **Synchronicity:** Timer on Frontend must be within +/- 200ms across all connected clients.

---

## 17. Technology Implementation Guide

### A. LangGraph: The "Central Nervous System"
*   **Purpose:** LLMs are stateless; they don't know who has already spoken or what phase the room is in. LangGraph provides the **Deterministic Logic** wrapper.
*   **What it does:**
    *   **State Persistence:** Maintains the `AgentState` (GSL queue, resolution text, phase).
    *   **Cycles:** MUN is a circular loop (Chair -> Delegate -> Chair). LangGraph allows us to define these cycles and conditional transitions (e.g., if a motion passes, go to `MOD_CAUCUS` node; if it fails, return to `GSL`).
    *   **Human-in-the-Loop:** Acts as a traffic controller, pausing the AI graph when it's the User node's turn and resuming only after the API `/submit_action` is called.

### B. Gemini 3 Flash: The "Brain"
*   **Purpose:** Handles logic, reasoning, and tool use.
*   **Implementation:**
    *   **Function Calling:** The Chair uses this to translate natural language ("I propose a 10 min caucus") into a structured state update (`set_motion(total_min=10)`).
    *   **Thought Signatures:** Used to simulate "Diplomatic Strategy." Before generating the speech, the model generates a `thought` block (hidden from other agents) to plan its stance based on the Delegate Profile.
    *   **Context Caching:** We cache the massive 50+ page **Committee Study Guide**. Every speaker turn uses this cache, reducing 90% of token costs and significantly speeding up reasoning.

### C. Gemini 2.5 Live + LiveKit: The "Voice"
*   **Purpose:** Instant, emotional audio output.
*   **Workflow:**
    *   Wait for Gemini 3 text -> Extract `<emotion>` tags -> Send to Gemini 2.5 Live.
    *   **Why LiveKit?** Standard TTS requires the full audio to be generated before playing. LiveKit allows us to **stream WebRTC chunks**. The moment Gemini 2.5 starts synthesizing, the browser starts playing. This brings "Time to First Byte" audio down to <300ms.

### D. Ably: The "Nervous System Extension"
*   **Purpose:** Real-time UI synchronization without polling.
*   **What it does:**
    *   Updates the **Global Timer** across all users' screens simultaneously.
    *   Pops up the **Speech Card** the exact millisecond an AI starts talking.
    *   Updates the **GSL Queue** sidebar live as the Chair reorders it.

---
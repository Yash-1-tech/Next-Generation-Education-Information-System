import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import type { CSSProperties } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import logo from "./assets/logo.png";
import bg from "./assets/bg.png";

/* =====================
   TYPES
===================== */
type Subject =
  | "Maths"
  | "Science"
  | "English"
  | "History"
  | "Geography";

type TeachingBlueprint = {
  lessonFlow: string[];
  misconceptions: string[];
  remedialScript: string[];
  vernacularExample: string;
  zeroCostAids: string[];
  image?: string;
  source: "gemini" | "mock";
};

/* =====================
   ASSETS (ONE PLACE)
===================== */
const ASSETS = {
  subjectImages: {
    Maths:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Linear_Function_Graph.svg/500px-Linear_Function_Graph.svg.png",
    Science:
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Binary_system_orbit_q%3D3_e%3D0.gif",
      //https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Free_body1.3.svg/500px-Free_body1.3.svg.png
      //https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Bouncing_ball_strobe_edit.jpg/500px-Bouncing_ball_strobe_edit.jpg
      //https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Skylab_and_Earth_Limb_-_GPN-2000-001055.jpg/500px-Skylab_and_Earth_Limb_-_GPN-2000-001055.jpg
    English:
      "https://imgs.search.brave.com/8jlqI5GbW-bq-O1FtmRU9y8bh1SvmWW40l5OP0CSpaA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/d2lsbGlhbXNoYWtl/c3BlYXJlLm5ldC9h/c3NldHMvaW1nL3No/YWtlc3BlYXJlLmpw/Zw",
    History:
      "https://imgs.search.brave.com/7jZCO1zRZDF--luWUMXXT30AvFxFjKGqjCQJzlqhflM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzgyL2E3/L2Q0LzgyYTdkNDg5/MmIwMWNhZWIwNTdj/OWFlMjRlZGYwODky/LmpwZw",
    Geography:
      "https://imgs.search.brave.com/_6AvCinGY2w_eq1sOUGFH41S7cSWOiyipTrTs0Au0qc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/d2VhdGhlci5nb3Yv/aW1hZ2VzL2NsaW1h/dGVzZXJ2aWNlcy9t/aXNjL2NWU3cucG5n"
  }
};

/* =====================
   SUBJECT TOPICS
===================== */
const TOPICS: Record<Subject, string[]> = {
  Maths: ["Linear Equations", "Fractions"],
  Science: ["Laws of Motion", "Chemical Reactions"],
  English: ["Reading Comprehension"],
  History: ["Indian Independence"],
  Geography: ["Climate"]
};

/* =====================
   MOCK BLUEPRINT (AI FALLBACK)
===================== */
function getMockBlueprint(subject: Subject): TeachingBlueprint {
  return {
    lessonFlow: [
      "Hook: Relate concept to daily life",
      "Core: Explain step-by-step using visuals",
      "Activity: Student-led problem solving"
    ],
    misconceptions: [
      "Students confuse variables with constants",
      "Students apply formulas mechanically"
    ],
    remedialScript: [
      "Pause the lesson",
      "Re-explain using physical objects",
      "Ask students to verbalize reasoning"
    ],
    vernacularExample:
      "Explain using local language analogies (e.g., weighing vegetables in the market)",
    zeroCostAids: [
      "Bottle caps for counting",
      "Stones or sticks for grouping",
      "Chalk drawings on the floor"
    ],
    image: ASSETS.subjectImages[subject],
    source: "mock"
  };
}

/* =====================
   STYLES
===================== */
const page = {
  minHeight: "100vh",
  backgroundImage: `linear-gradient(rgba(248,250,252,0.05), rgba(248,250,252,0.05)), url('${bg}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "24px",
  fontFamily: "Inter, system-ui, sans-serif"
};

const layout: CSSProperties = {
  display: "flex",
  gap: "24px",
  flexDirection: window.innerWidth < 768 ? "column" : "row"
};



const sidebar = {
  width: "240px",
  background: "rgba(255,255,255,0.75)",
  borderRadius: "20px",
  padding: "20px",
  backdropFilter: "blur(12px)"
};

const navLink = {
  display: "block",
  padding: "10px 14px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#0f172a",
  marginBottom: "8px",
  fontWeight: 500
};

const navActive = {
  background: "#1e3a8a",
  color: "white"
};

const main = { flex: 1 };

const header = {
  background: "rgba(255,255,255,0.65)",
  padding: "28px",
  borderRadius: "20px",
  backdropFilter: "blur(14px)",
  marginBottom: "24px"
};

const card = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: "20px",
  padding: "24px",
  marginTop: "20px"
};

const btn = {
  padding: "10px 16px",
  borderRadius: "999px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginRight: "8px",
  marginBottom: "8px"
};

/* =====================
   APP
===================== */
export default function App() {
  const [user, setUser] = useState<any>(null);

  async function login() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  }

  return (
    <Router>
      <div style={page}>
        <div style ={layout}>
          {/* SIDEBAR */}
          <div style={sidebar}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={logo} alt="NEIS Logo" style={{ width: "36px" }} />
              <strong>NEIS</strong>
            </div>

            <NavLink to="/" style={navLink}>
              Dashboard
            </NavLink>
            <NavLink to="/about" style={navLink}>
              About
            </NavLink>
            <NavLink to="/features" style={navLink}>
              Key Features
            </NavLink>

            {!user && (
              <button style={btn} onClick={login}>
                Sign in with Google
              </button>
            )}
          </div>

          {/* MAIN */}
          <div style={main}>
            <div style={header}>
              <h1 style={{ margin: 0 }}>
                Next-Generation Education Information System
              </h1>
              <p>AI-powered teacher augmentation platform</p>
            </div>

            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

/* =====================
   PAGES
===================== */
function Dashboard({ user }: { user: any }) {
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<TeachingBlueprint | null>(null);

  async function generate() {
    if (!subject) return;

    try {
      throw new Error("force mock for demo");
    } catch {
      setBlueprint(getMockBlueprint(subject));
    }
  }

  async function save() {
    if (!user || !blueprint) return;

    await addDoc(collection(db, "blueprints"), {
      user: user.email,
      subject,
      topic,
      blueprint,
      createdAt: new Date()
    });

    alert("Saved to Firebase");
  }

  return (
    <>
    
        <p style={{ maxWidth: "700px", color: "#334155" }}>
        NEIS assists teachers by generating structured, classroom-ready lesson
        blueprints using AI. The system anticipates student misconceptions,
        suggests zero-cost teaching aids, and adapts explanations to local
        languages—ensuring effective learning even in resource-constrained settings.
        </p>


      <h3>Select Subject</h3>
      {(Object.keys(TOPICS) as Subject[]).map(s => (
        <button key={s} style={btn} onClick={() => {
          setSubject(s);
          setTopic(null);
          setBlueprint(null);
        }}>
          {s}
        </button>
      ))}

      {subject && (
        <>
          <h3>Select Topic</h3>
          {TOPICS[subject].map(t => (
            <button key={t} style={btn} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </>
      )}

      {topic && (
        <button style={btn} onClick={generate}>
          Generate Teaching Blueprint
        </button>
      )}

      {blueprint && (
        <div style={card}>
          <h3>AI Teaching Blueprint</h3>

          <img src={blueprint.image} style={{ maxWidth: "100%" }} />

          <h4>40-Min Lesson Flow</h4>
          <ul>{blueprint.lessonFlow.map((l, i) => <li key={i}>{l}</li>)}</ul>

          <h4>Anticipated Misconceptions</h4>
          <ul>{blueprint.misconceptions.map((m, i) => <li key={i}>{m}</li>)}</ul>

          <h4>Instant Remedial Script</h4>
          <ul>{blueprint.remedialScript.map((r, i) => <li key={i}>{r}</li>)}</ul>

          <h4>Vernacular Bridge</h4>
          <p>{blueprint.vernacularExample}</p>

          <h4>Zero-Cost Teaching Aids</h4>
          <ul>{blueprint.zeroCostAids.map((z, i) => <li key={i}>{z}</li>)}</ul>

          {user && <button style={btn} onClick={save}>Save</button>}
        </div>
      )}
    </>
  );
}

function About() {
  return (
    <div style={card}>
      <p>
        The Next-Generation Education Information System (NEIS) is designed to
        augment teacher capability in classrooms where subject specialization,
        infrastructure, or instructional resources may be limited.
      </p>

      <p>
        NEIS leverages Google Gemini to generate pedagogically sound, 40-minute
        lesson blueprints that follow proven instructional structures—engagement
        hooks, core explanation, guided activities, and assessment cues.
      </p>

      <p>
        Unlike generic AI tools, NEIS is purpose-built for education systems.
        It anticipates student misconceptions before they arise, provides
        real-time remedial scripts for teachers, and recommends zero-cost
        teaching aids using everyday materials.
      </p>

      <p>
        The platform is backed by Firebase Authentication and Firestore,
        enabling secure teacher identity, lesson persistence, and future
        collaboration across schools and regions.
      </p>
    </div>
  );
}

function Features() {
  return (
    <div style={card}>
      <h3>Key Features</h3>

      <h4>AI Teaching Blueprints</h4>
      <p>
        Gemini-powered, classroom-ready lesson flows that guide teachers through
        a full 40-minute period—covering engagement hooks, concept explanation,
        student activities, and formative assessment.
      </p>

      <h4>Anticipatory Misconception Mapping</h4>
      <p>
        NEIS predicts common student logic gaps before the lesson begins and
        equips teachers with instant remedial scripts to address confusion
        without breaking lesson flow.
      </p>

      <h4>Multilingual Vernacular Bridge</h4>
      <p>
        Complex textbook concepts are translated into locally relevant
        explanations using regional languages and culturally familiar analogies,
        improving comprehension and inclusivity.
      </p>

      <h4>Zero-Cost Teaching Aids</h4>
      <p>
        NEIS suggests hands-on classroom activities using materials commonly
        available in underserved areas—such as bottle caps, stones, chalk, or
        paper—removing dependency on expensive infrastructure.
      </p>

      <h4>Google-Powered Infrastructure</h4>
      <p>
        Built on Firebase Authentication and Firestore for secure access and
        persistent lesson storage, with optional integration into Google Forms,
        Sheets, and Meet for assessments, planning, and live instruction.
      </p>
    </div>
  );
}

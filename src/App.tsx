import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import logo from "./assets/logo.png";

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
  background:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  subjectImages: {
    Maths:
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Linear_function_graph.svg",
    Science:
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Newton%27s_laws_of_motion.svg",
    English:
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Reading_icon.svg",
    History:
      "https://upload.wikimedia.org/wikipedia/commons/5/55/History_icon.svg",
    Geography:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Globe_icon.svg"
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
  backgroundImage: `linear-gradient(rgba(248,250,252,0.05), rgba(248,250,252,0.05)), url('${ASSETS.background}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "24px",
  fontFamily: "Inter, system-ui, sans-serif"
};

const layout = {
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
        NEIS empowers teachers—especially non-specialists—by providing
        AI-generated lesson blueprints, anticipatory remediation, and
        low-cost teaching strategies using Google technologies.
      </p>
    </div>
  );
}

function Features() {
  return (
    <div style={card}>
      <ul>
        <li>Gemini-powered AI Teaching Blueprints</li>
        <li>Anticipatory Misconception Mapping</li>
        <li>Multilingual Vernacular Bridge</li>
        <li>Zero-Cost Teaching Aids</li>
        <li>Firebase-backed persistence</li>
      </ul>
    </div>
  );
}

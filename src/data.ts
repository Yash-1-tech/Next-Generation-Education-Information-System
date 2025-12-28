export type Subject = "Maths" | "Science";

export type TeachingBlueprint = {
  concept: string;
  howToTeach: string[];
  commonMistakes: string[];
};

export const NEIS_DATA: Record<Subject, Record<string, TeachingBlueprint>> = {
  Maths: {
    "Linear Equations": {
      concept: "Maintaining equality by performing the same operation on both sides.",
      howToTeach: [
        "Start with a balance-scale analogy",
        "Solve one-step equations on the board",
        "Gradually move to multi-step equations"
      ],
      commonMistakes: [
        "Changing sign incorrectly",
        "Applying operation to only one side",
        "Arithmetic errors"
      ]
    },
    Fractions: {
      concept: "Understanding parts of a whole and equivalence.",
      howToTeach: [
        "Use visual fraction models",
        "Relate fractions to real-life sharing",
        "Practice simplification visually"
      ],
      commonMistakes: [
        "Adding denominators",
        "Incorrect simplification",
        "Confusing numerator and denominator"
      ]
    }
  },
  Science: {
    "Laws of Motion": {
      concept: "Relationship between force, mass, and acceleration.",
      howToTeach: [
        "Demonstrate motion with everyday examples",
        "Explain each law separately",
        "Use diagrams and free-body concepts"
      ],
      commonMistakes: [
        "Confusing mass and weight",
        "Ignoring friction",
        "Memorizing without understanding"
      ]
    },
    "Chemical Reactions": {
      concept: "Transformation of substances through chemical change.",
      howToTeach: [
        "Show observable reactions",
        "Explain reactants vs products",
        "Link to conservation of mass"
      ],
      commonMistakes: [
        "Mixing physical and chemical changes",
        "Incorrect balancing",
        "Ignoring reaction conditions"
      ]
    }
  }
};

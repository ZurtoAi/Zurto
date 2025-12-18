/**
 * Sample Questionnaires for Testing
 * These are example questionnaires that demonstrate the adaptive questioning system
 */

import { Question, Questionnaire } from "../services/api";

// Sample question definitions
export const sampleQuestions: Record<string, Question> = {
  projectType: {
    id: "q-project-type",
    title: "What type of project are you building?",
    description: "Select the primary type of project",
    type: "radio",
    required: true,
    options: [
      { id: "opt-web", label: "Web Application", value: "web" },
      { id: "opt-mobile", label: "Mobile App", value: "mobile" },
      { id: "opt-desktop", label: "Desktop Application", value: "desktop" },
      { id: "opt-api", label: "API/Backend Service", value: "api" },
      { id: "opt-other", label: "Other", value: "other" },
    ],
    branches: {
      web: "q-frontend-framework",
      mobile: "q-mobile-platform",
      api: "q-api-language",
    },
  },

  frontendFramework: {
    id: "q-frontend-framework",
    title: "Which frontend framework?",
    description: "Select your preferred frontend framework for web development",
    type: "select",
    required: true,
    options: [
      { id: "opt-react", label: "React", value: "react" },
      { id: "opt-vue", label: "Vue", value: "vue" },
      { id: "opt-angular", label: "Angular", value: "angular" },
      { id: "opt-svelte", label: "Svelte", value: "svelte" },
      { id: "opt-nextjs", label: "Next.js", value: "nextjs" },
    ],
  },

  mobilePlatform: {
    id: "q-mobile-platform",
    title: "Which mobile platforms?",
    description: "Select the platforms you want to target",
    type: "checkbox",
    required: true,
    options: [
      { id: "opt-ios", label: "iOS", value: "ios" },
      { id: "opt-android", label: "Android", value: "android" },
      { id: "opt-both", label: "Both (Cross-platform)", value: "both" },
    ],
  },

  apiLanguage: {
    id: "q-api-language",
    title: "Which backend language?",
    description: "Select your preferred backend programming language",
    type: "radio",
    required: true,
    options: [
      { id: "opt-node", label: "Node.js / JavaScript", value: "node" },
      { id: "opt-python", label: "Python", value: "python" },
      { id: "opt-go", label: "Go", value: "go" },
      { id: "opt-rust", label: "Rust", value: "rust" },
      { id: "opt-java", label: "Java", value: "java" },
    ],
  },

  database: {
    id: "q-database",
    title: "Which database?",
    description: "Select your preferred database",
    type: "select",
    required: true,
    options: [
      { id: "opt-postgres", label: "PostgreSQL", value: "postgres" },
      { id: "opt-mongodb", label: "MongoDB", value: "mongodb" },
      { id: "opt-mysql", label: "MySQL", value: "mysql" },
      {
        id: "opt-firebase",
        label: "Firebase / Firestore",
        value: "firebase",
      },
      { id: "opt-dynamodb", label: "DynamoDB", value: "dynamodb" },
    ],
  },

  authentication: {
    id: "q-authentication",
    title: "Do you need authentication?",
    description: "Will your application require user authentication?",
    type: "boolean",
    required: true,
  },

  projectDescription: {
    id: "q-project-description",
    title: "Describe your project",
    description: "Please provide a brief description of what your project does",
    type: "textarea",
    required: true,
    placeholder: "Tell us about your project...",
    validation: {
      minLength: 10,
      maxLength: 500,
    },
  },

  teamSize: {
    id: "q-team-size",
    title: "How many developers?",
    description: "How many developers will be working on this project?",
    type: "number",
    required: true,
    validation: {
      min: 1,
      max: 100,
    },
    placeholder: "Enter number of developers",
  },

  budget: {
    id: "q-budget",
    title: "What's your budget range?",
    description: "Select your estimated project budget",
    type: "select",
    required: true,
    options: [
      { id: "opt-low", label: "< $10,000", value: "0-10k" },
      { id: "opt-mid", label: "$10,000 - $50,000", value: "10k-50k" },
      { id: "opt-high", label: "$50,000 - $100,000", value: "50k-100k" },
      { id: "opt-enterprise", label: "> $100,000", value: "100k+" },
    ],
  },

  timeline: {
    id: "q-timeline",
    title: "Expected launch date?",
    description: "When do you plan to launch?",
    type: "date",
    required: true,
  },
};

// Sample complete questionnaire
export const adaptiveProjectQuestionnaire: Questionnaire = {
  id: "q-adaptive-project",
  name: "Adaptive Project Setup",
  description:
    "Intelligent questionnaire that adapts based on your project type",
  questions: [
    sampleQuestions.projectType,
    sampleQuestions.frontendFramework,
    sampleQuestions.mobilePlatform,
    sampleQuestions.apiLanguage,
    sampleQuestions.database,
    sampleQuestions.authentication,
    sampleQuestions.projectDescription,
    sampleQuestions.teamSize,
    sampleQuestions.budget,
    sampleQuestions.timeline,
  ],
  triggerEvent: "project:created",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Simple onboarding questionnaire
export const onboardingQuestionnaire: Questionnaire = {
  id: "q-onboarding",
  name: "Project Onboarding",
  description: "Quick onboarding questionnaire",
  questions: [
    sampleQuestions.projectDescription,
    sampleQuestions.teamSize,
    sampleQuestions.authentication,
  ],
  triggerEvent: "manual",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default {
  sampleQuestions,
  adaptiveProjectQuestionnaire,
  onboardingQuestionnaire,
};

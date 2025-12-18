import React, { useState, useCallback } from "react";
import { DraggablePanel } from "./DraggablePanel";
import { aiAPI } from "../services/api";
import "../styles/AIQuestionnaire.css";

// Maximum number of follow-up question rounds allowed
const MAX_FOLLOWUP_ROUNDS = 3;

interface AIQuestionnaireProps {
  projectId: string;
  projectName: string;
  initialDescription?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result: AIQuestionnaireResult) => void;
}

interface GeneratedQuestion {
  id: string;
  text: string;
  type: "text" | "select" | "multiselect" | "boolean" | "number";
  options?: Array<string | { value: string; label: string }>;
  required?: boolean;
  category?: string;
  hint?: string;
  placeholder?: string;
}

interface ProjectPlan {
  summary: string;
  features: string[];
  architecture: string;
  techStack: string[];
  estimatedComplexity: "low" | "medium" | "high";
}

interface AIQuestionnaireResult {
  answers: Record<string, unknown>;
  projectPlan?: ProjectPlan;
  analysis?: {
    understanding: string;
    confidence: number;
    gaps?: string[];
  };
  questionsAndAnswers?: Array<{
    question: string;
    category: string;
    answer: unknown;
  }>;
}

type GenerationStatus =
  | "idle"
  | "generating"
  | "ready"
  | "answering"
  | "analyzing"
  | "follow-up"
  | "complete"
  | "error";

export const AIQuestionnaire: React.FC<AIQuestionnaireProps> = ({
  projectId,
  projectName,
  initialDescription,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [projectDescription, setProjectDescription] = useState(
    initialDescription || ""
  );
  const [projectType, setProjectType] = useState("web-app");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [allQuestions, setAllQuestions] = useState<GeneratedQuestion[]>([]); // Track all questions asked
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [analysisInfo, setAnalysisInfo] = useState<{
    understanding: string;
    confidence: number;
    gaps: string[];
  } | null>(null);
  const [round, setRound] = useState(1); // Track questioning rounds

  const projectTypes = [
    { value: "web-app", label: "🌐 Web Application", icon: "🌐" },
    { value: "api", label: "⚙️ API / Backend", icon: "⚙️" },
    { value: "mobile", label: "📱 Mobile App", icon: "📱" },
    { value: "desktop", label: "💻 Desktop App", icon: "💻" },
    { value: "cli", label: "⌨️ CLI Tool", icon: "⌨️" },
    { value: "library", label: "📦 Library / Package", icon: "📦" },
    { value: "fullstack", label: "🚀 Full Stack", icon: "🚀" },
    { value: "microservices", label: "🔗 Microservices", icon: "🔗" },
  ];

  // Generate questions using AI
  const generateQuestions = useCallback(async () => {
    if (!projectDescription.trim()) {
      setError("Please provide a project description");
      return;
    }

    setStatus("generating");
    setError("");

    try {
      // Call backend API to generate AI-powered questions
      const response = await aiAPI.post("/chat", {
        projectDescription,
        projectName,
        projectType,
        action: "generate-questions",
      });

      console.log("AI Questionnaire response:", response);

      // Extract questions from response - axios wraps in .data, then backend wraps in { success, data }
      const responseData = response.data || response;
      const innerData = responseData.data || responseData;
      const generatedQuestions =
        innerData.questions || responseData.questions || [];

      console.log("Generated questions:", generatedQuestions);

      if (generatedQuestions.length === 0) {
        console.error("No questions generated. Response:", response);
        throw new Error(
          innerData.error ||
            responseData.error ||
            responseData.message ||
            "Failed to generate questions. Ensure Copilot Bridge is connected."
        );
      }

      // Convert backend question format to component format
      const formattedQuestions: GeneratedQuestion[] = generatedQuestions.map(
        (q: any) => ({
          id: q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
          text: q.question || q.text,
          type: q.type || "text",
          options: q.options,
          required: q.required !== false,
          category: q.category,
          hint: q.hint,
          placeholder: q.placeholder,
        })
      );

      setQuestions(formattedQuestions);
      setAllQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setStatus("ready");
    } catch (err: any) {
      console.error("AI question generation failed:", err);
      setError(
        err.error ||
          err.message ||
          "Failed to generate questions. Please ensure Copilot Bridge is connected in VS Code."
      );
      setStatus("error");
    }
  }, [projectDescription, projectType, projectName]);

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Move to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Analyze answers with AI - Check if more questions needed
  const analyzeAnswers = useCallback(async () => {
    setStatus("analyzing");
    setError("");

    try {
      // Call backend to analyze answers and check if more questions needed
      const response = await aiAPI.post("/chat", {
        projectDescription,
        projectName,
        projectType,
        questions: allQuestions.map((q) => ({
          id: q.id,
          question: q.text,
          category: q.category,
          type: q.type,
        })),
        answers,
        round, // Pass current round number to backend
        action: "analyze-answers",
      });

      console.log("Analysis response:", response);

      // Axios wraps in .data, then our API wraps in { success, data }
      const responseData = response.data || response;
      const result = responseData.data || responseData;

      // Update analysis info
      if (result.analysis) {
        setAnalysisInfo({
          understanding: result.analysis.understanding,
          confidence: result.analysis.confidence,
          gaps: result.analysis.gaps || [],
        });
      }

      // Check if AI needs to ask more questions (but respect max rounds limit)
      const canAskMoreQuestions = round < MAX_FOLLOWUP_ROUNDS;

      if (
        canAskMoreQuestions &&
        result.needsMoreQuestions &&
        result.followUpQuestions?.length > 0
      ) {
        const nextRound = round + 1;
        console.log(
          `AI needs more info. Follow-up round ${nextRound}/${MAX_FOLLOWUP_ROUNDS}. Questions:`,
          result.followUpQuestions
        );

        // Format follow-up questions with guaranteed unique IDs
        const followUpFormatted: GeneratedQuestion[] =
          result.followUpQuestions.map((q: any, index: number) => ({
            id:
              q.id || `fq_r${nextRound}_${String(index + 1).padStart(2, "0")}`,
            text: q.question || q.text,
            type: q.type || "text",
            options: q.options,
            required: q.required !== false,
            category: q.category,
            hint: q.hint,
            placeholder: q.placeholder,
          }));

        // Add to all questions and set as current questions
        setAllQuestions((prev) => [...prev, ...followUpFormatted]);
        setQuestions(followUpFormatted);
        setCurrentQuestionIndex(0);
        setRound(nextRound);
        setStatus("follow-up");
      } else if (result.readyToProceed && result.projectPlan) {
        // AI has enough info - show project plan
        console.log("AI ready to proceed. Project plan:", result.projectPlan);
        setProjectPlan(result.projectPlan);
        setStatus("complete");

        if (onComplete) {
          // Build questionsAndAnswers array for planning generation
          const questionsAndAnswers = allQuestions.map((q) => ({
            question: q.text,
            category: q.category || "general",
            answer: answers[q.id] ?? "Not answered",
          }));

          onComplete({
            answers,
            projectPlan: result.projectPlan,
            analysis: result.analysis,
            questionsAndAnswers,
          });
        }
      } else {
        // Fallback - proceed anyway (max rounds reached or AI is satisfied)
        if (!canAskMoreQuestions && result.needsMoreQuestions) {
          console.log(
            `Max follow-up rounds (${MAX_FOLLOWUP_ROUNDS}) reached. Proceeding with available info.`
          );
        } else {
          console.log("Analysis complete, proceeding with available info");
        }
        setProjectPlan(result.projectPlan || null);
        setStatus("complete");

        if (onComplete) {
          // Build questionsAndAnswers array for planning generation
          const questionsAndAnswers = allQuestions.map((q) => ({
            question: q.text,
            category: q.category || "general",
            answer: answers[q.id] ?? "Not answered",
          }));

          onComplete({
            answers,
            projectPlan: result.projectPlan,
            analysis: result.analysis,
            questionsAndAnswers,
          });
        }
      }
    } catch (err: any) {
      console.error("Answer analysis failed:", err);
      setError(
        err.error ||
          err.message ||
          "Failed to analyze answers. Please try again."
      );
      setStatus("error");
    }
  }, [
    answers,
    allQuestions,
    projectName,
    projectType,
    projectDescription,
    round,
    onComplete,
  ]);

  // Start answering
  const startQuestionnaire = () => {
    setStatus("answering");
    setCurrentQuestionIndex(0);
  };

  // Submit answers
  const handleSubmit = () => {
    analyzeAnswers();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  if (!isOpen) return null;

  return (
    <DraggablePanel
      id="ai-questionnaire"
      title="🤖 AI Project Questionnaire"
      isOpen={isOpen}
      onClose={onClose}
      defaultPosition={{ x: window.innerWidth / 2 - 280, y: 100 }}
      minWidth={560}
      minHeight={400}
    >
      <div className="ai-questionnaire">
        {/* Initial Setup Phase */}
        {status === "idle" && (
          <div className="aiq-setup">
            <div className="aiq-intro">
              <div className="aiq-intro-icon">🧠</div>
              <h3>AI-Powered Project Planning</h3>
              <p>
                Describe your project and I'll generate smart questions to
                understand your requirements and suggest the best architecture.
              </p>
            </div>

            <div className="aiq-form">
              <div className="form-group">
                <label>Project Type</label>
                <div className="project-type-grid">
                  {projectTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`type-btn ${projectType === type.value ? "active" : ""}`}
                      onClick={() => setProjectType(type.value)}
                    >
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-label">
                        {type.label.split(" ").slice(1).join(" ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Project Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe what you're building, its main features, and goals..."
                  rows={4}
                  className="aiq-textarea"
                />
              </div>

              {error && <div className="aiq-error">{error}</div>}

              <button
                className="aiq-generate-btn"
                onClick={generateQuestions}
                disabled={!projectDescription.trim()}
              >
                <span>✨</span> Generate Questions
              </button>
            </div>
          </div>
        )}

        {/* Generating Phase */}
        {status === "generating" && (
          <div className="aiq-loading">
            <div className="aiq-spinner"></div>
            <p>AI is analyzing your project...</p>
            <span className="aiq-loading-detail">
              Generating smart questions tailored to your needs
            </span>
          </div>
        )}

        {/* Questions Ready Phase */}
        {status === "ready" && (
          <div className="aiq-ready">
            <div className="aiq-ready-icon">✅</div>
            <h3>Questions Ready!</h3>
            <p>
              {questions.length} questions generated based on your project
              description.
            </p>
            <button className="aiq-start-btn" onClick={startQuestionnaire}>
              Start Questionnaire →
            </button>
          </div>
        )}

        {/* Answering Phase */}
        {status === "answering" && currentQuestion && (
          <div className="aiq-answering">
            {/* Progress Bar */}
            <div className="aiq-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Category Badge */}
            {currentQuestion.category && (
              <div className="aiq-category">{currentQuestion.category}</div>
            )}

            {/* Question */}
            <div className="aiq-question">
              <h3>{currentQuestion.text}</h3>
              {currentQuestion.required && (
                <span className="required-badge">Required</span>
              )}
            </div>

            {/* Answer Input */}
            <div className="aiq-answer">
              {currentQuestion.type === "text" && (
                <input
                  type="text"
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  placeholder={
                    currentQuestion.placeholder || "Type your answer..."
                  }
                  className="aiq-input"
                  autoFocus
                />
              )}

              {currentQuestion.type === "select" && currentQuestion.options && (
                <div className="aiq-options">
                  {currentQuestion.options.map(
                    (
                      option: string | { value: string; label: string },
                      idx: number
                    ) => {
                      // Handle both string options and object options
                      const optionValue =
                        typeof option === "string" ? option : option.value;
                      const optionLabel =
                        typeof option === "string" ? option : option.label;
                      return (
                        <button
                          key={idx}
                          className={`aiq-option ${answers[currentQuestion.id] === optionValue ? "selected" : ""}`}
                          onClick={() =>
                            handleAnswerChange(currentQuestion.id, optionValue)
                          }
                        >
                          {optionLabel}
                        </button>
                      );
                    }
                  )}
                </div>
              )}

              {currentQuestion.type === "multiselect" &&
                currentQuestion.options && (
                  <div className="aiq-options multiselect">
                    {currentQuestion.options.map(
                      (
                        option: string | { value: string; label: string },
                        idx: number
                      ) => {
                        const optionValue =
                          typeof option === "string" ? option : option.value;
                        const optionLabel =
                          typeof option === "string" ? option : option.label;
                        const currentValues =
                          (answers[currentQuestion.id] as string[]) || [];
                        const isSelected = currentValues.includes(optionValue);
                        return (
                          <button
                            key={idx}
                            className={`aiq-option ${isSelected ? "selected" : ""}`}
                            onClick={() => {
                              const newValues = isSelected
                                ? currentValues.filter((v) => v !== optionValue)
                                : [...currentValues, optionValue];
                              handleAnswerChange(currentQuestion.id, newValues);
                            }}
                          >
                            {isSelected ? "✓ " : ""}
                            {optionLabel}
                          </button>
                        );
                      }
                    )}
                  </div>
                )}

              {currentQuestion.type === "boolean" && (
                <div className="aiq-boolean">
                  <button
                    className={`aiq-bool-btn ${answers[currentQuestion.id] === true ? "selected yes" : ""}`}
                    onClick={() => handleAnswerChange(currentQuestion.id, true)}
                  >
                    ✓ Yes
                  </button>
                  <button
                    className={`aiq-bool-btn ${answers[currentQuestion.id] === false ? "selected no" : ""}`}
                    onClick={() =>
                      handleAnswerChange(currentQuestion.id, false)
                    }
                  >
                    ✗ No
                  </button>
                </div>
              )}

              {currentQuestion.type === "number" && (
                <input
                  type="number"
                  value={(answers[currentQuestion.id] as number) || ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      currentQuestion.id,
                      parseInt(e.target.value)
                    )
                  }
                  placeholder={
                    currentQuestion.placeholder || "Enter a number..."
                  }
                  className="aiq-input"
                />
              )}

              {/* Hint */}
              {currentQuestion.hint && (
                <div className="aiq-hint">💡 {currentQuestion.hint}</div>
              )}
            </div>

            {/* Navigation */}
            <div className="aiq-nav">
              <button
                className="aiq-nav-btn"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button className="aiq-nav-btn primary" onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button className="aiq-nav-btn submit" onClick={handleSubmit}>
                  ✨ Analyze Answers
                </button>
              )}
            </div>
          </div>
        )}

        {/* Follow-up Questions Phase */}
        {status === "follow-up" && (
          <div className="aiq-followup">
            <div className="aiq-followup-header">
              <span className="followup-icon">🔍</span>
              <h3>Follow-up Questions (Round {round})</h3>
              <p>Based on your answers, I need a bit more information:</p>
            </div>

            {analysisInfo && (
              <div className="aiq-understanding">
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${analysisInfo.confidence}%` }}
                  ></div>
                  <span className="confidence-text">
                    Understanding: {analysisInfo.confidence}%
                  </span>
                </div>
                {analysisInfo.gaps.length > 0 && (
                  <div className="gaps-list">
                    <strong>Need clarity on:</strong>
                    <ul>
                      {analysisInfo.gaps.slice(0, 3).map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button className="aiq-start-btn" onClick={startQuestionnaire}>
              Answer Follow-up Questions →
            </button>
          </div>
        )}

        {/* Analyzing Phase */}
        {status === "analyzing" && (
          <div className="aiq-loading">
            <div className="aiq-spinner"></div>
            <p>AI is analyzing your answers...</p>
            <span className="aiq-loading-detail">
              Checking if more information is needed...
            </span>
          </div>
        )}

        {/* Complete Phase - with Project Plan */}
        {status === "complete" && (
          <div className="aiq-complete">
            <div className="aiq-complete-header">
              <span className="complete-icon">🎉</span>
              <h3>Project Plan Ready!</h3>
              {analysisInfo && (
                <div className="final-confidence">
                  AI Confidence: {analysisInfo.confidence}%
                </div>
              )}
            </div>

            {/* Project Summary */}
            {projectPlan && (
              <>
                {/* Complexity Badge */}
                <div
                  className={`complexity-badge ${projectPlan.estimatedComplexity}`}
                >
                  Estimated Complexity:{" "}
                  {projectPlan.estimatedComplexity.toUpperCase()}
                </div>

                {/* Summary */}
                <div className="aiq-section">
                  <h4>📝 Project Summary</h4>
                  <p className="project-summary">{projectPlan.summary}</p>
                </div>

                {/* Features */}
                {projectPlan.features && projectPlan.features.length > 0 && (
                  <div className="aiq-section">
                    <h4>✨ Key Features</h4>
                    <ul className="features-list">
                      {projectPlan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Architecture */}
                {projectPlan.architecture && (
                  <div className="aiq-section">
                    <h4>🏗️ Architecture</h4>
                    <p className="architecture-desc">
                      {projectPlan.architecture}
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                {projectPlan.techStack && projectPlan.techStack.length > 0 && (
                  <div className="aiq-section">
                    <h4>📦 Recommended Tech Stack</h4>
                    <div className="tech-stack">
                      {projectPlan.techStack.map((tech, i) => (
                        <span key={i} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Understanding Info (if no project plan) */}
            {!projectPlan && analysisInfo && (
              <div className="aiq-section">
                <h4>📋 Analysis</h4>
                <p>{analysisInfo.understanding}</p>
              </div>
            )}

            {/* Questions Answered Summary */}
            <div className="aiq-section questions-summary">
              <h4>📋 Questions Answered: {Object.keys(answers).length}</h4>
              <p className="rounds-info">
                Completed in {round} round{round > 1 ? "s" : ""}
              </p>
            </div>

            <button className="aiq-done-btn" onClick={onClose}>
              🚀 Create Project
            </button>
          </div>
        )}

        {/* Error Phase */}
        {status === "error" && (
          <div className="aiq-error-state">
            <span className="error-icon">❌</span>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button
                className="aiq-retry-btn"
                onClick={() => setStatus("idle")}
              >
                Start Over
              </button>
              {questions.length > 0 && (
                <button
                  className="aiq-retry-btn secondary"
                  onClick={() => setStatus("answering")}
                >
                  Continue Answering
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default AIQuestionnaire;

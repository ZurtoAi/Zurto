import React, { useState } from "react";
import { DraggablePanel } from "./DraggablePanel";
import { Question, QuestionOption } from "../services/api";
import "../styles/Questionnaire.css";

export interface QuestionnaireProps {
  questionnaireId: string;
  projectId: string;
  questions: Question[];
  isOpen: boolean;
  onComplete: (answers: Record<string, unknown>) => void;
  onClose: () => void;
  questionnaires?: Array<{
    id: string;
    name: string;
    data: any;
  }>;
  selectedQuestionnaireId?: string;
  onQuestionnaireChange?: (id: string) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionnaireId,
  projectId,
  questions,
  isOpen,
  onComplete,
  onClose,
  questionnaires = [],
  selectedQuestionnaireId = "",
  onQuestionnaireChange,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const validateAnswer = (
    question: Question,
    value: unknown
  ): string | null => {
    if (
      question.required &&
      (value === "" || value === null || value === undefined)
    ) {
      return "This field is required";
    }

    if (typeof value === "string" && question.validation) {
      const { minLength, maxLength, pattern } = question.validation;

      if (minLength && value.length < minLength) {
        return `Minimum length is ${minLength}`;
      }
      if (maxLength && value.length > maxLength) {
        return `Maximum length is ${maxLength}`;
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return "Invalid format";
      }
    }

    if (typeof value === "number" && question.validation) {
      const { min, max } = question.validation;

      if (min !== undefined && value < min) {
        return `Minimum value is ${min}`;
      }
      if (max !== undefined && value > max) {
        return `Maximum value is ${max}`;
      }
    }

    return null;
  };

  const handleAnswerChange = (value: unknown) => {
    const error = validateAnswer(currentQuestion, value);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: error,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentQuestion.id];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const error = validateAnswer(currentQuestion, answers[currentQuestion.id]);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: error,
      }));
      return;
    }

    // Check for branching
    if (
      currentQuestion.branches &&
      typeof answers[currentQuestion.id] === "string"
    ) {
      const nextQuestionId =
        currentQuestion.branches[answers[currentQuestion.id] as string];
      if (nextQuestionId) {
        const nextIndex = questions.findIndex((q) => q.id === nextQuestionId);
        if (nextIndex >= 0) {
          setCurrentQuestionIndex(nextIndex);
          return;
        }
      }
    }

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate current question
    const error = validateAnswer(currentQuestion, answers[currentQuestion.id]);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: error,
      }));
      return;
    }

    setLoading(true);
    try {
      onComplete(answers);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = () => {
    const { type, placeholder, options } = currentQuestion;

    switch (type) {
      case "text":
      case "email":
      case "url":
        return (
          <input
            type={type}
            placeholder={placeholder}
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="questionnaire-input"
            disabled={loading}
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={placeholder}
            value={(answers[currentQuestion.id] as number) || ""}
            onChange={(e) =>
              handleAnswerChange(e.target.value ? Number(e.target.value) : "")
            }
            className="questionnaire-input"
            disabled={loading}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="questionnaire-input"
            disabled={loading}
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={placeholder}
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="questionnaire-textarea"
            disabled={loading}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            value={(answers[currentQuestion.id] as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="questionnaire-select"
            disabled={loading}
          >
            <option value="">Select an option...</option>
            {options?.map((opt: QuestionOption) => (
              <option key={opt.id} value={opt.value as string}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="questionnaire-radio-group">
            {options?.map((opt: QuestionOption) => (
              <label key={opt.id} className="questionnaire-radio">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={opt.value as string}
                  checked={answers[currentQuestion.id] === opt.value}
                  onChange={() => handleAnswerChange(opt.value)}
                  disabled={loading}
                />
                <span>{opt.label}</span>
                {opt.description && <small>{opt.description}</small>}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="questionnaire-checkbox-group">
            {options?.map((opt: QuestionOption) => (
              <label key={opt.id} className="questionnaire-checkbox">
                <input
                  type="checkbox"
                  value={opt.value as string}
                  checked={
                    Array.isArray(answers[currentQuestion.id])
                      ? (answers[currentQuestion.id] as unknown[]).includes(
                          opt.value
                        )
                      : false
                  }
                  onChange={(e) => {
                    const current =
                      (answers[currentQuestion.id] as unknown[]) || [];
                    if (e.target.checked) {
                      handleAnswerChange([...current, opt.value]);
                    } else {
                      handleAnswerChange(
                        current.filter((v) => v !== opt.value)
                      );
                    }
                  }}
                  disabled={loading}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "boolean":
        return (
          <div className="questionnaire-boolean-group">
            <button
              className={`questionnaire-boolean-btn ${
                answers[currentQuestion.id] === true ? "active" : ""
              }`}
              onClick={() => handleAnswerChange(true)}
              disabled={loading}
            >
              Yes
            </button>
            <button
              className={`questionnaire-boolean-btn ${
                answers[currentQuestion.id] === false ? "active" : ""
              }`}
              onClick={() => handleAnswerChange(false)}
              disabled={loading}
            >
              No
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const questionnaireIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );

  if (!isOpen || questions.length === 0) return null;

  return (
    <DraggablePanel
      id="questionnaire"
      title={`Questionnaire (${currentQuestionIndex + 1}/${questions.length})`}
      icon={questionnaireIcon}
      isOpen={isOpen}
      onClose={onClose}
      defaultPosition={{ x: window.innerWidth - 820, y: 80 }}
      defaultSize={{ width: 400, height: 480 }}
      statusIndicator={{
        status: loading ? "loading" : "idle",
        label: loading ? "Submitting..." : `${Math.round(progress)}% complete`,
      }}
      showMinimize={true}
    >
      <div className="questionnaire-content">
        <div className="questionnaire-progress">
          <div
            className="questionnaire-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Questionnaire Selector Dropdown */}
        {questionnaires && questionnaires.length > 1 && (
          <div
            style={{
              marginBottom: "12px",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "4px",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Questionnaire:
            </label>
            <select
              value={selectedQuestionnaireId}
              onChange={(e) => onQuestionnaireChange?.(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {questionnaires.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="questionnaire-question">
          <h3 className="questionnaire-title">{currentQuestion.title}</h3>
          {currentQuestion.description && (
            <p className="questionnaire-description">
              {currentQuestion.description}
            </p>
          )}

          <div className="questionnaire-input-wrapper">{renderQuestion()}</div>

          {errors[currentQuestion.id] && (
            <div className="questionnaire-error">
              {errors[currentQuestion.id]}
            </div>
          )}
        </div>

        <div className="questionnaire-footer">
          <button
            className="questionnaire-btn questionnaire-btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className="questionnaire-btn questionnaire-btn-primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ) : (
            <button
              className="questionnaire-btn questionnaire-btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Complete"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </DraggablePanel>
  );
};

export default Questionnaire;

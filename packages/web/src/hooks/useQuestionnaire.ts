import { useState, useCallback } from "react";
import { questionnairesAPI } from "../services/api";
import { Questionnaire, Question, QuestionnaireAnswer } from "../services/api";

export interface UseQuestionnaireState {
  questionnaire: Questionnaire | null;
  answers: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  isCompleted: boolean;
}

export interface UseQuestionnaireActions {
  fetchQuestionnaire: (id: string) => Promise<void>;
  submitAnswer: (
    questionId: string,
    answer: unknown,
    projectId: string
  ) => Promise<void>;
  submitQuestionnaire: (projectId: string) => Promise<void>;
  resetQuestionnaire: () => void;
}

export const useQuestionnaire = (
  initialQuestionnaireId?: string
): UseQuestionnaireState & UseQuestionnaireActions => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null
  );
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const fetchQuestionnaire = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await questionnairesAPI.get(id);
      setQuestionnaire(response.data as Questionnaire);
      setAnswers({});
      setIsCompleted(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load questionnaire";
      setError(message);
      console.error("Questionnaire fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (questionId: string, answer: unknown, projectId: string) => {
      if (!questionnaire) {
        setError("No questionnaire loaded");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await questionnairesAPI.submitAnswer(questionnaire.id, {
          projectId,
          questionId,
          answer,
        });

        setAnswers((prev) => ({
          ...prev,
          [questionId]: answer,
        }));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to submit answer";
        setError(message);
        console.error("Answer submission error:", err);
      } finally {
        setLoading(false);
      }
    },
    [questionnaire]
  );

  const submitQuestionnaire = useCallback(
    async (projectId: string) => {
      if (!questionnaire) {
        setError("No questionnaire loaded");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Submit all remaining answers
        for (const [questionId, answer] of Object.entries(answers)) {
          await questionnairesAPI.submitAnswer(questionnaire.id, {
            projectId,
            questionId,
            answer,
          });
        }

        setIsCompleted(true);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to submit questionnaire";
        setError(message);
        console.error("Questionnaire submission error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [questionnaire, answers]
  );

  const resetQuestionnaire = useCallback(() => {
    setQuestionnaire(null);
    setAnswers({});
    setError(null);
    setIsCompleted(false);
  }, []);

  // Auto-fetch on mount if initialQuestionnaireId provided
  if (initialQuestionnaireId && !questionnaire) {
    fetchQuestionnaire(initialQuestionnaireId).catch(console.error);
  }

  return {
    // State
    questionnaire,
    answers,
    loading,
    error,
    isCompleted,
    // Actions
    fetchQuestionnaire,
    submitAnswer,
    submitQuestionnaire,
    resetQuestionnaire,
  };
};

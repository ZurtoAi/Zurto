import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDatabase, addToStore, getFromStore } from "../core/database.js";
import { logger } from "../utils/logger.js";
import {
  Questionnaire,
  Question,
  QuestionnaireAnswer,
  ApiResponse,
  CreateQuestionnaireInput,
} from "../types/index.js";

const router = Router();

// GET /api/questionnaires - List all questionnaires
router.get("/", (req: Request, res: Response<ApiResponse<Questionnaire[]>>) => {
  try {
    const questionnaires = getFromStore("questionnaires") as Questionnaire[];

    res.json({
      success: true,
      data: questionnaires,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          page: 1,
          limit: questionnaires.length,
          total: questionnaires.length,
        },
      },
    });
  } catch (error) {
    logger.error("Failed to list questionnaires:", error);
    res.status(500).json({
      success: false,
      error: "Failed to list questionnaires",
      data: undefined,
    });
  }
});

// POST /api/questionnaires - Create new questionnaire
router.post(
  "/",
  (req: Request<{}, {}, CreateQuestionnaireInput>, res: Response) => {
    try {
      const { name, description, questions, triggerEvent } = req.body;

      if (!name || !questions || questions.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Name and at least one question required",
          data: undefined,
        });
      }

      const questionnaire: Questionnaire = {
        id: uuidv4(),
        name,
        description: description || "",
        questions,
        triggerEvent: triggerEvent || "project:created",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addToStore("questionnaires", questionnaire);

      logger.info(`Created questionnaire: ${questionnaire.id}`);
      res.status(201).json({
        success: true,
        data: questionnaire,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Failed to list questionnaires:", error);
      res.status(500).json({
        success: false,
        error: "Failed to list questionnaires",
        data: [] as Questionnaire[],
      });
    }
  }
);

// GET /api/questionnaires/:id - Get questionnaire by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const questionnaires = getFromStore("questionnaires") as Questionnaire[];
    const questionnaire = questionnaires.find((q) => q.id === id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        error: "Questionnaire not found",
        data: null,
      });
    }

    res.json({
      success: true,
      data: questionnaire,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Failed to get questionnaire:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get questionnaire",
      data: null,
    });
  }
});

// POST /api/questionnaires/:id/answers - Submit questionnaire answer
router.post("/:id/answers", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      projectId,
      questionId,
      answer,
      metadata,
    }: {
      projectId: string;
      questionId: string;
      answer: string | number | boolean | string[];
      metadata?: Record<string, unknown>;
    } = req.body;

    if (!projectId || !questionId || answer === undefined) {
      return res.status(400).json({
        success: false,
        error: "projectId, questionId, and answer are required",
        data: null,
      });
    }

    const questionnaires = getFromStore("questionnaires") as Questionnaire[];
    const questionnaire = questionnaires.find((q) => q.id === id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        error: "Questionnaire not found",
        data: null,
      });
    }

    // Validate question exists
    const question = questionnaire.questions.find((q) => q.id === questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
        data: null,
      });
    }

    const answerRecord: QuestionnaireAnswer = {
      id: uuidv4(),
      questionnaireId: id,
      projectId,
      questionId,
      answer,
      metadata: metadata || {},
      answeredAt: new Date().toISOString(),
    };

    addToStore("answers", answerRecord);

    logger.info(
      `Recorded answer for project ${projectId}, question ${questionId}`
    );
    res.status(201).json({
      success: true,
      data: answerRecord,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Failed to record answer:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record answer",
      data: null,
    });
  }
});

// GET /api/questionnaires/:id/answers/:projectId - Get answers for project
router.get("/:id/answers/:projectId", (req: Request, res: Response) => {
  try {
    const { id, projectId } = req.params;

    const questionnaires = getFromStore("questionnaires") as Questionnaire[];
    const questionnaire = questionnaires.find((q) => q.id === id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        error: "Questionnaire not found",
        data: null,
      });
    }

    const answers = (getFromStore("answers") as QuestionnaireAnswer[]).filter(
      (a) => a.questionnaireId === id && a.projectId === projectId
    );

    res.json({
      success: true,
      data: answers,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          total: answers.length,
        },
      },
    });
  } catch (error) {
    logger.error("Failed to get answers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get answers",
      data: null,
    });
  }
});

export default router;

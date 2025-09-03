import { Request, Response } from "express";
import EpicModel from "../model/EpicModel";
import EpicInterface from "../types/EpicInterface";

export default class EpicController {
  constructor(private readonly epicModel: EpicModel) {}

  readonly getEpics = async (_req: Request, res: Response): Promise<void> => {
    try {
      const epics = await this.epicModel.getAllEpics();
      res.status(200).json(epics);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener épicas", error });
    }
  };

  readonly getEpicById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const epicId = parseInt(id, 10);
      const epic = await this.epicModel.getEpicById(epicId);
      if (!epic) {
        res.status(404).json({ message: "Épica no encontrada" });
        return;
      }
      res.status(200).json(epic);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener épica por ID", error });
    }
  };

  readonly createEpic = async (req: Request, res: Response): Promise<void> => {
    try {
      const epic: EpicInterface = req.body;
      if (!epic || !epic.name) {
        res.status(400).json({ message: "Faltan datos de la épica" });
        return;
      }
      await this.epicModel.createEpic(epic);
      res.status(201).json({ message: "Épica creada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear épica", error });
    }
  };

  readonly updateEpic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const epicId = parseInt(id, 10);
      const updatedEpic: EpicInterface = req.body;
      if (isNaN(epicId)) {
        res.status(400).json({ message: "ID de épica inválido" });
        return;
      }
      if (!updatedEpic || Object.keys(updatedEpic).length === 0) {
        res.status(400).json({ message: "Datos para la actualización de la épica inválidos" });
        return;
      }
      const updated = await this.epicModel.updateEpicById(epicId, updatedEpic);
      if (!updated) {
        res.status(404).json({ message: `Épica no encontrada con id ${epicId}` });
        return;
      }
      res.status(200).json({ message: `Épica con id ${epicId} actualizada correctamente` });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar épica", error });
    }
  };

  readonly deleteEpic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const epicId = parseInt(id, 10);
      if (isNaN(epicId)) {
        res.status(400).json({ message: "ID de épica inválido" });
        return;
      }
      const deleted = await this.epicModel.toggleEpicStatusById(epicId);
      if (!deleted) {
        res.status(404).json({ message: `Épica no encontrada con id ${epicId}` });
        return;
      }
      res.status(200).json({ message: `Épica con id ${epicId} eliminada correctamente` });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar épica", error });
    }
  };
}

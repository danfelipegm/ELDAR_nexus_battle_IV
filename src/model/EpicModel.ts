import { MongoClient } from "mongodb";
import EpicInterface from "../types/EpicInterface";
import e from "express";

export default class EpicModel {
  private uri = "mongodb://localhost:27017";
  private dbName = "Inventario";
  private collectionName = "epics";
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.uri);
  }

  readonly getAllEpics = async (): Promise<EpicInterface[]> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);
      const epics = await collection.find({}).toArray();
      return epics;
    } catch (error) {
      console.error("Error al obtener épicas:", error);
      return [];
    } finally {
      await this.client.close();
    }
  };

  readonly getEpicById = async (id: number): Promise<EpicInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);
      const epic = await collection.findOne({ id: Number(id) });
      return epic;
    } catch (error) {
      console.error("Error al obtener épica por ID:", error);
      return null;
    } finally {
      await this.client.close();
    }
  };

  readonly createEpic = async (epic: EpicInterface): Promise<void> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);
      const lastEpic = await collection.find().sort({ id: -1 }).limit(1).toArray();
      const newId = (lastEpic.at(0)?.id ?? 0) + 1;
      await collection.insertOne({ ...epic, id: newId });
      console.log("Épica creada con éxito");
    } catch (error) {
      console.error("Error al crear épica:", error);
    } finally {
      await this.client.close();
    }
  };

  readonly updateEpicById = async (id: number, updatedEpic: EpicInterface): Promise<EpicInterface | null> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);
      const updateResult = await collection.updateOne({ id: Number(id) }, { $set: updatedEpic });
      if (updateResult.matchedCount === 0) {
        console.log(`No se encontró ninguna épica con id ${id}`);
        return null;
      }
      console.log(`Épica con id ${id} actualizada con éxito`);
      const updatedDoc = await collection.findOne({ id });
      return updatedDoc;
    } catch (error) {
      console.error("Error al actualizar épica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };

  readonly toggleEpicStatusById = async (id: number): Promise<boolean> => {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection<EpicInterface>(this.collectionName);
      const epic = await collection.findOne({ id });
      if (!epic) {
        console.log("Épica no encontrada");
        return false;
      }
      const newStatus = !epic.status;
      const result = await collection.updateOne({ id }, { $set: { status: newStatus } });
      if (result.modifiedCount && result.modifiedCount > 0) {
        console.log(`Épica con id ${id} cambiado a status = ${newStatus}`);
        return true;
      } else {
        console.log(`No se pudo actualizar la épica con id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el status de la épica:", error);
      throw error;
    } finally {
      await this.client.close();
    }
  };
}

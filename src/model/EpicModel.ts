import * as fs from "fs";
import * as path from "path";
import EpicInterface from "../types/EpicInterface";

export default class EpicModel {
  private dbPath = path.join(__dirname, "epics.json");

  private readEpics(): EpicInterface[] {
    try {
      const data = fs.readFileSync(this.dbPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error leyendo epics.json:", error);
      return [];
    }
  }

  private writeEpics(epics: EpicInterface[]): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(epics, null, 2), "utf-8");
    } catch (error) {
      console.error("Error escribiendo epics.json:", error);
    }
  }

  readonly getAllEpics = async (): Promise<EpicInterface[]> => {
    return this.readEpics();
  };

  readonly getEpicById = async (id: number): Promise<EpicInterface | null> => {
    const epics = this.readEpics();
    return epics.find(e => e.id === Number(id)) || null;
  };

  readonly createEpic = async (epic: EpicInterface): Promise<void> => {
  const epics = this.readEpics();
  const ids = epics.map(e => typeof e.id === "number" ? e.id : 0);
  const newId = (ids.length > 0 ? Math.max(...ids) : 0) + 1;
  epics.push({ ...epic, id: newId });
  this.writeEpics(epics);
  console.log("Épica creada con éxito");
  };

  readonly updateEpicById = async (id: number, updatedEpic: EpicInterface): Promise<EpicInterface | null> => {
    const epics = this.readEpics();
    const idx = epics.findIndex(e => e.id === Number(id));
    if (idx === -1) {
      console.log(`No se encontró ninguna épica con id ${id}`);
      return null;
    }
    epics[idx] = { ...epics[idx], ...updatedEpic };
    this.writeEpics(epics);
    console.log(`Épica con id ${id} actualizada con éxito`);
    return epics[idx];
  };

  readonly toggleEpicStatusById = async (id: number): Promise<boolean> => {
    const epics = this.readEpics();
    const idx = epics.findIndex(e => e.id === Number(id));
    if (idx === -1) {
      console.log("Épica no encontrada");
      return false;
    }
    epics[idx].status = !epics[idx].status;
    this.writeEpics(epics);
    console.log(`Épica con id ${id} cambiado a status = ${epics[idx].status}`);
    return true;
  };
}

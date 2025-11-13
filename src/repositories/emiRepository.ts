import { AppDataSource } from "../config/data-source";
import { EMIPlan } from "../entity/EMIPlan";

export const emiRepository = AppDataSource.getRepository(EMIPlan);

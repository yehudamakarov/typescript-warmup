import { ChumashModel } from "../models/Chumash";
import { ChitasScraper } from "./ChitasScraper";

const scraper = new ChitasScraper(ChumashModel);

scraper.processChumash();

import { ChumashModel } from "../models/Chumash";
import { RashiModel } from "../models/Rashi";
import { ChitasScraper } from "./ChitasScraper";

const scraper = new ChitasScraper(ChumashModel, RashiModel);

scraper.processChumash();

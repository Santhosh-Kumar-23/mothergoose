import { createContext } from "react";

const SurveyContext = createContext({});

const SurveyContextProvider = SurveyContext.Provider;

export { SurveyContext, SurveyContextProvider };

import { createContext } from 'react';

const ThemeContext = createContext();

export default ThemeContext;
export const ThemeConsumer = ThemeContext.Consumer;
export const ThemeProvider = ThemeContext.Provider;

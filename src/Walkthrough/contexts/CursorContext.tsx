import React, { createContext, ReactNode, useState } from "react";

type Cursor = {
  position: { x: number; y: number; initialX?: number; initialY?: number };
};

type CursorContextType = {
  cursors: Map<string, Cursor>; // cursorName(key: string here) makes it easier to access/add element without duplication conflict!
  addCursors: (cursorName: string, cursor: Cursor) => void;
};

export const CursorContext = createContext<CursorContextType | undefined>(
  undefined
);

interface props {
  children: ReactNode;
}

export const CursorProvider: React.FC<props> = ({ children }) => {
  const [cursors, setCursors] = useState(new Map());

  const addCursors = (cursorName: string, cursor: Cursor) => {
    setCursors((prev) => prev.set(cursorName, cursor));
  };

  return (
    <CursorContext.Provider value={{ cursors, addCursors }}>
      {children}
    </CursorContext.Provider>
  );
};

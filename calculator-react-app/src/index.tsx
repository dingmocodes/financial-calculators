import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import CalcApp from './CalcApp';


// Find the element where the app will be rendered.
const main: HTMLElement | null = document.getElementById('main');
if (main === null)
  throw new Error("HTML is missing 'main' element")

// Render the app in that element.
const root: Root = createRoot(main);
root.render(<CalcApp/>);

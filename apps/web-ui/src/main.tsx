import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import { StudioPage } from "./StudioPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <StudioPage />
  </StrictMode>
);

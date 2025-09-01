// NOTE: Using 'msw' root import because project has msw v1.x installed.
// The 'msw/browser' subpath exists only in msw v2+. Upgrade msw if you prefer that style.
import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

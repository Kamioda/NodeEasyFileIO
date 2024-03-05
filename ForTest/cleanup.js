import { rmSync } from "node:fs";

rmSync('./dist', { recursive: true });

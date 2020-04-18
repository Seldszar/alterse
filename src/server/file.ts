import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import mime from "mime";
import path, { ParsedPath } from "path";
import slash from "slash";

import { formatKey } from "./helpers";

export interface ResolvedFile {
  filePath: string;
  relativePath: string;
  normalizedPath: string;
  parsed: ParsedPath;
  key: string;
}

export function resolveFile(basePath: string, filePath: string): ResolvedFile {
  const relativePath = path.relative(basePath, filePath);
  const normalizedPath = slash(relativePath);
  const parsed = path.parse(normalizedPath);
  const key = formatKey(parsed);

  return {
    filePath,
    relativePath,
    normalizedPath,
    parsed,
    key,
  };
}

export function parseFile(resolvedFile: ResolvedFile): any {
  const { filePath, normalizedPath } = resolvedFile;

  switch (mime.getType(filePath)) {
    case "application/json": {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    case "text/markdown": {
      const result = matter(fs.readFileSync(filePath, "utf8"));

      return {
        ...result.data,
        content: result.content,
      };
    }

    case "text/plain": {
      return fs.readFileSync(filePath, "utf8");
    }

    case "text/yaml": {
      return yaml.load(fs.readFileSync(filePath, "utf8"));
    }

    default: {
      return `/content/${normalizedPath}`;
    }
  }
}

export interface CompilationArtifact {
  schemaVersion: 1;
  sourceFiles: Record<string, string>;
  solcVersion: string;
  optimizer: {
    enabled: boolean;
    runs: number;
  };
  remappings?: string[];
  ast?: any;
  bytecode?: Record<string, string>;
  chainId?: number;
  projectRoot?: string;
  sourcesChecksum: string;
}

export interface CompilationResult {
  success: boolean;
  artifact?: CompilationArtifact;
  errors: string[];
  warnings: string[];
}

export async function compileProject(
  projectRoot: string,
  solcVersion?: string,
  optimizerRuns?: number
): Promise<CompilationResult> {
  const { execFileSync } = require("child_process");
  const fs = require("fs");
  const path = require("path");

  try {
    // Get solc version
    const versionOutput = execFileSync("forge", ["--version"], { cwd: projectRoot, encoding: "utf8" });
    const detectedVersion = solcVersion || versionOutput.match(/solc\s+([\d.]+)/)?.[1] || "unknown";

    // Run forge build to get artifacts
    const buildOutput = execFileSync("forge", ["build", "--force"], { 
      cwd: projectRoot, 
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024
    });

    // Read compiled artifacts
    const outDir = path.join(projectRoot, "out");
    const sourceFiles: Record<string, string> = {};
    const bytecode: Record<string, string> = {};
    
    if (fs.existsSync(outDir)) {
      const walk = (dir: string): string[] => {
        let files: string[] = [];
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files.push(...walk(fullPath));
          } else if (entry.name.endsWith(".json")) {
            files.push(fullPath);
          }
        }
        return files;
      };

      for (const file of walk(outDir)) {
        try {
          const artifact = JSON.parse(fs.readFileSync(file, "utf8"));
          if (artifact.abi && artifact.bytecode) {
            const contractName = path.basename(file, ".json");
            bytecode[contractName] = artifact.bytecode.object || artifact.bytecode;
          }
        } catch { }
      }
    }

    // Read source files
    const srcDir = path.join(projectRoot, "src");
    if (fs.existsSync(srcDir)) {
      const walkSrc = (dir: string): string[] => {
        let files: string[] = [];
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files.push(...walkSrc(fullPath));
          } else if (entry.name.endsWith(".sol")) {
            files.push(fullPath);
          }
        }
        return files;
      };

      for (const file of walkSrc(srcDir)) {
        const relPath = path.relative(projectRoot, file);
        sourceFiles[relPath] = fs.readFileSync(file, "utf8");
      }
    }

    // Compute checksum
    const crypto = require("crypto");
    const sourcesContent = Object.entries(sourceFiles)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
      .join("");
    const sourcesChecksum = "sha256:" + crypto.createHash("sha256").update(sourcesContent).digest("hex");

    const artifact: CompilationArtifact = {
      schemaVersion: 1,
      sourceFiles,
      solcVersion: detectedVersion,
      optimizer: {
        enabled: true,
        runs: optimizerRuns || 200
      },
      bytecode,
      sourcesChecksum
    };

    return { success: true, artifact, errors: [], warnings: [] };

  } catch (e: any) {
    return {
      success: false,
      errors: [e.message],
      warnings: []
    };
  }
}

export function validateArtifact(artifact: CompilationArtifact): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!artifact.schemaVersion) errors.push("Missing schemaVersion");
  if (artifact.schemaVersion !== 1) errors.push("Unsupported schemaVersion");
  if (!artifact.sourceFiles || Object.keys(artifact.sourceFiles).length === 0) {
    errors.push("No source files");
  }
  if (!artifact.solcVersion) errors.push("Missing solcVersion");
  if (!artifact.optimizer) errors.push("Missing optimizer config");
  if (!artifact.sourcesChecksum) errors.push("Missing sourcesChecksum");
  
  return { valid: errors.length === 0, errors };
}


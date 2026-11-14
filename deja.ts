// 只提供手动 /deja 搜索，不注册任何自动召回或工具结果注入钩子。
import { execFileSync } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);

function resolveDeja(): string {
  const exe = process.platform === "win32" ? "deja.exe" : "deja";
  const platform = process.platform === "win32" ? "windows" : process.platform;
  const arch = process.arch === "x64" ? "amd64" : process.arch;
  const candidates = [
    process.env.DEJA_BIN || "",
    exe,
    join(homedir(), ".local", "bin", exe),
  ];
  try {
    candidates.push(require.resolve(`@vshulcz/deja-vu-${platform}-${arch}/bin/${exe}`));
  } catch {}
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.includes("/") || candidate.includes("\\")) {
      try {
        accessSync(candidate, constants.X_OK);
      } catch {
        continue;
      }
    }
    return candidate;
  }
  return exe;
}

export default function (pi: any) {
  pi.registerCommand("deja", {
    description: "手动搜索过去的编程会话（无自动召回）",
    handler: async (args: string, ctx: any) => {
      const query = (args || "").trim();
      if (!query) {
        ctx.ui.notify("用法：/deja <要查找的文件、命令、报错或历史操作>", "info");
        return;
      }
      try {
        const output = execFileSync(resolveDeja(), ["search", "--no-embed", "--", query], {
          windowsHide: true,
          encoding: "utf8",
          timeout: 120000,
          maxBuffer: 4 * 1024 * 1024,
          stdio: ["ignore", "pipe", "pipe"],
        }).trim();
        ctx.ui.notify(output || `历史中没有匹配：${query}`, "info");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ctx.ui.notify(`deja 搜索失败：${message}`, "error");
      }
    },
  });
}

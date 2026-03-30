export function downloadAgentsFile(text: string): void {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "AGENTS.md";
  link.click();
  URL.revokeObjectURL(url);
}

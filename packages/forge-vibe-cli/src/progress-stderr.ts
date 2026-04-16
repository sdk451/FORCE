/** Progress on stderr so stdout stays clean for JSON (check) and write action lines. */

const THRESHOLD = 25;

export function shouldReportProgress(total: number): boolean {
  return total > THRESHOLD;
}

export function makeStderrProgress(label: string, total: number): (current: number, path: string) => void {
  if (total <= THRESHOLD) {
    return () => {};
  }
  return (current: number, path: string) => {
    const line = `vibeforge: ${label} ${current}/${total} ${path}`;
    if (process.stderr.isTTY) {
      const w = process.stderr.columns ?? 100;
      const trimmed = line.length > w - 2 ? `${line.slice(0, w - 5)}...` : line;
      process.stderr.write(`\r${trimmed.padEnd(w - 1)}`);
      if (current === total) process.stderr.write("\n");
    } else {
      const step = Math.max(1, Math.floor(total / 10));
      if (current === 1 || current === total || current % step === 0) {
        process.stderr.write(`${line}\n`);
      }
    }
  };
}

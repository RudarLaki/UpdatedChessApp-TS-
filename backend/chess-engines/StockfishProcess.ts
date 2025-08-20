import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { EventEmitter } from "events";

type UciOpts = {
  enginePath: string;
  threads?: number;
  hash?: number;
  skillLevel?: number; // 0..20
};

export class StockfishProcess extends EventEmitter {
  private process: ChildProcessWithoutNullStreams;
  public ready = false;
  private buffer = "";

  constructor(private opts: UciOpts) {
    super();
    this.process = spawn(opts.enginePath, [], { stdio: "pipe" });

    this.process.stdout.on("data", (d) => this.handleData(d.toString()));
    this.process.stderr.on("data", (d) => this.emit("log", d.toString()));
    this.process.on("exit", (code) => this.emit("exit", code));

    this.send("uci");
  }

  private handleData(data: string) {
    this.buffer += data;
    let idx;
    while ((idx = this.buffer.indexOf("\n")) >= 0) {
      const line = this.buffer.slice(0, idx).trim();
      this.buffer = this.buffer.slice(idx + 1);

      if (!line) continue;

      if (line === "uciok") {
        if (this.opts.threads)
          this.send(`setoption name Threads value ${this.opts.threads}`);
        if (this.opts.hash)
          this.send(`setoption name Hash value ${this.opts.hash}`);
        if (this.opts.skillLevel !== undefined)
          this.send(`setoption name Skill Level value ${this.opts.skillLevel}`);
        this.send("isready");
      } else if (line === "readyok") {
        this.ready = true;
        this.emit("ready");
      } else if (line.startsWith("bestmove")) {
        const [_, move] = line.split(/\s+/);
        this.emit("bestmove", move);
      }
    }
  }

  send(cmd: string) {
    this.process.stdin.write(cmd + "\n");
  }

  async ensureReady() {
    if (this.ready) return;
    await new Promise<void>((res) => this.once("ready", () => res()));
  }

  async setPosition(params: { fen?: string; moves?: string[] }) {
    await this.ensureReady();

    // start new game
    this.send("ucinewgame");

    // tell engine to use new position
    if (params.fen) this.send(`position fen ${params.fen}`);
    else
      this.send(
        `position startpos${
          params.moves?.length ? " moves " + params.moves.join(" ") : ""
        }`
      );

    // make sure engine is ready for calculation
    await new Promise<void>((res) => {
      const onReady = () => {
        this.off("ready", onReady);
        res();
      };
      this.on("ready", onReady);
      this.send("isready"); // this triggers readyok
    });
  }

  go(opts: { movetime?: number } = { movetime: 1000 }) {
    return new Promise<string>((resolve) => {
      const onBest = (move: string) => {
        this.off("bestmove", onBest);
        resolve(move);
      };
      this.on("bestmove", onBest);
      this.send(`go movetime ${opts.movetime}`);
    });
  }

  quit() {
    this.send("quit");
    this.process.kill();
  }
}

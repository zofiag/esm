import childProcess from "child_process";
import esbuild from "esbuild";

esbuild
  .build({
    mainFields: ["module", "main"],
    entryPoints: ["index.js"],
    bundle: true,
    external: ["./node_modules/*"],
    outdir: "dist",
    platform: "node",
    format: "esm",
    sourcemap: "external",
    color: true,
    logLevel: "debug",
    target: ["node16.14"],
  })
  .then(() => {
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork("dist/index.js");

    // listen for errors as they may prevent the exit event from firing
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      console.log("Error - error", err);
    });

    // execute the callback once the process has finished running
    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      console.log("Error - exit", err);
    });

    console.log("⚡ Done");
  })
  .catch((err) => {
    console.log("Global err", err);
    process.exit(1);
  });

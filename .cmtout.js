const fs = require("fs").promises;

async function toggleComments(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");

    const lines = data.split("\n");
    for (let i = 1; i < lines.length; i++) {
      if (lines[i - 1].includes("//TOGGLE-COMMENT")) {
        if (!lines[i].startsWith("//")) {
          lines[i] = `//${lines[i]}`;
        } else {
          lines[i] = lines[i].slice(2);
        }
      }
    }

    const modifiedContent = lines.join("\n");
    await fs.writeFile(filePath, modifiedContent, "utf8");

    console.log("Comments toggled successfully!");
  } catch (err) {
    console.error(`Error processing file: ${err}`);
  }
}

async function run() {
  for (let i = 2; i < process.argv.length; i++) {
    console.log(`File : ${process.argv[i]}`);
    await toggleComments(process.argv[i]);
  }
}

run();

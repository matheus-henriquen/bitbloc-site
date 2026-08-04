const fs = require("fs");
const path = require("path");

const destDir = path.join(__dirname, "assets");
const sources = [
  String.raw`C:\Users\mathe\.cursor\projects\c-Users-mathe-OneDrive-Documentos-bitbloc-bitbloc-store\assets\c__Users_mathe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-641ed6a9-cad2-4c19-a453-e1efb4298ab4.png`,
  String.raw`C:\Users\mathe\.cursor\projects\c-Users-mathe-OneDrive-Documentos-bitbloc-bitbloc-store\assets\mascote-bitbloc.png`,
];

fs.mkdirSync(destDir, { recursive: true });

const src = sources.find((file) => fs.existsSync(file));
if (!src) {
  console.error("Nenhuma imagem fonte encontrada.");
  process.exit(1);
}

const mascote = path.join(destDir, "mascote-bitbloc.png");
const mark = path.join(destDir, "logo-mark.png");
fs.copyFileSync(src, mascote);
fs.copyFileSync(src, mark);
console.log("OK", src);
console.log("mascote", fs.statSync(mascote).size);
console.log("mark", fs.statSync(mark).size);

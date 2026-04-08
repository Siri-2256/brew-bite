import fs from "fs";
import path from "path";
import QRCode from "qrcode";

const BASE_URL = "https://YOUR-NETLIFY-URL.netlify.app";
const outputDir = path.resolve("./qrcodes");

const options = {
  width: 800,
  color: {
    dark: "#2D241E",
    light: "#FAF7F2",
  },
};

async function generateQrFile(filename, url) {
  const filePath = path.join(outputDir, filename);
  await QRCode.toFile(filePath, url, options);
  console.log(`Generated ${filePath}`);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  for (let i = 1; i <= 20; i += 1) {
    const url = `${BASE_URL}/?table=${i}`;
    await generateQrFile(`Table_${i}_QR.png`, url);
  }

  const takeawayUrl = `${BASE_URL}/?mode=takeaway`;
  await generateQrFile("Storefront_Takeaway_QR.png", takeawayUrl);
}

main().catch((error) => {
  console.error("QR generation failed:", error);
  process.exit(1);
});

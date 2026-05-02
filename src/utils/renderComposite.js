// BAGIAN RENDER FOTO + FRAME KE PNG

const PRINT_DPI = 300;
const MM_TO_PX = PRINT_DPI / 25.4;

function mmToPx(mm) {
  return Math.round(mm * MM_TO_PX);
}

export async function renderComposite({ layout, photos, templatePreview, forPrint = false }) {
  const spec = forPrint ? layout.print : layout.display;

  const canvasW = mmToPx(spec.paper.w);
  const canvasH = mmToPx(spec.paper.h);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");

  // ----- 1. Frame overlay ------
  if (templatePreview) {
    const frame = await loadImage(templatePreview);
    ctx.drawImage(frame, 0, 0, canvasW, canvasH);
  }

  // ----- 2. Gambar Foto ke Slot ------
  const slots = getSlots(spec, true);

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (!photos[i]) continue;
    const img = await loadImage(photos[i]);

    if (img.width < img.height) {
      await drawRotated(ctx, img, s);
    } else {
      const { sx, sy, sw, sh } = coverCrop(img.width, img.height, s.w, s.h);
      ctx.drawImage(img, sx, sy, sw, sh, s.x, s.y, s.w, s.h);
    }
  }

  // ----- 2.5 Sharpen canvas (hanya untuk print) ------
if (forPrint) {
  const sharpened = sharpenCanvas(canvas, ctx);
  // Gambar hasil sharpen kembali ke canvas asli
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(sharpened, 0, 0);
}

  // ----- 3. Rotate canvas kalau portrait (untuk print) ------
let finalCanvas = canvas;

const isStripLayout = layout.id && ["3strip", "4strip"].includes(layout.id);

// Strip portrait jangan dirotate — kirim apa adanya ke printer
// Layout landscape lain (1full, 2full, 4grid, 3roll) tetap dirotate
if (forPrint && canvas.width < canvas.height && !isStripLayout) {
  const rotated = document.createElement("canvas");
  rotated.width = canvas.height;
  rotated.height = canvas.width;
  const rCtx = rotated.getContext("2d");
  rCtx.translate(rotated.width / 2, rotated.height / 2);
  rCtx.rotate(-Math.PI / 2);
  rCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  finalCanvas = rotated;
}

const result = finalCanvas.toDataURL("image/png");
console.log("renderComposite result length:", result?.length);
console.log("renderComposite result prefix:", result?.substring(0, 50));
return result;
return finalCanvas.toDataURL("image/png");
}

// ----- Rotasi foto portrait 90 derajat jadi landscape ------
async function drawRotated(ctx, img, s) {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = img.height;
  tmpCanvas.height = img.width;
  const tmpCtx = tmpCanvas.getContext("2d");

  tmpCtx.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
  tmpCtx.rotate(Math.PI / 2);
  tmpCtx.drawImage(img, -img.width / 2, -img.height / 2);

  const { sx, sy, sw, sh } = coverCrop(tmpCanvas.width, tmpCanvas.height, s.w, s.h);
  ctx.drawImage(tmpCanvas, sx, sy, sw, sh, s.x, s.y, s.w, s.h);
}

// ----- Posisi Slot dalam Pixel ------
function getSlots(spec, isPrint = false) {
  const toUnit = isPrint ? mmToPx : (v) => Math.round(v);

  if (spec.slots) {
    return spec.slots.map((s) => ({
      x: toUnit(s.x),
      y: toUnit(s.y),
      w: toUnit(s.w),
      h: toUnit(s.h),
    }));
  }

  const { cols, rows, photo, margin, gap } = spec;
  const slotW   = toUnit(photo.w);
  const slotH   = toUnit(photo.h);
  const gapX    = toUnit(gap.x);
  const gapY    = toUnit(gap.y);
  const marginL = toUnit(margin.left);
  const marginT = toUnit(margin.top);

  const slots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slots.push({
        x: marginL + c * (slotW + gapX),
        y: marginT + r * (slotH + gapY),
        w: slotW,
        h: slotH,
      });
    }
  }
  return slots;
}

// ----- Cover Crop ------
function coverCrop(imgW, imgH, targetW, targetH) {
  const imgRatio = imgW / imgH;
  const targetRatio = targetW / targetH;
  let sw, sh, sx, sy;
  if (imgRatio > targetRatio) {
    sh = imgH;
    sw = imgH * targetRatio;
    sx = (imgW - sw) / 2;
    sy = 0;
  } else {
    sw = imgW;
    sh = imgW / targetRatio;
    sx = 0;
    sy = (imgH - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

// ----- Load Image dari URL/base64 ------
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error("loadImage FAILED:", src?.substring(0, 50));
      reject(err);
    };
    img.src = src;
  });
}

// ----- Sharpen menggunakan convolution kernel ------
function sharpenCanvas(sourceCanvas, srcCtx) { // ← terima ctx dari luar
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  const dst = document.createElement("canvas");
  dst.width = w;
  dst.height = h;
  const dstCtx = dst.getContext("2d", { willReadFrequently: true });

  // Pakai srcCtx yang sudah ada, bukan buat baru
  const srcData = srcCtx.getImageData(0, 0, w, h);
  const dstData = dstCtx.createImageData(w, h);

  const src = srcData.data;
  const out = dstData.data;

  const kernel = [
     0, -1,  0,
    -1,  5, -1,
     0, -1,  0,
  ];
  const kernelSize = 3;
  const half = Math.floor(kernelSize / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const px = Math.min(w - 1, Math.max(0, x + kx - half));
          const py = Math.min(h - 1, Math.max(0, y + ky - half));
          const idx = (py * w + px) * 4;
          const weight = kernel[ky * kernelSize + kx];
          r += src[idx]     * weight;
          g += src[idx + 1] * weight;
          b += src[idx + 2] * weight;
        }
      }

      const i = (y * w + x) * 4;
      out[i]     = Math.min(255, Math.max(0, r));
      out[i + 1] = Math.min(255, Math.max(0, g));
      out[i + 2] = Math.min(255, Math.max(0, b));
      out[i + 3] = src[i + 3];
    }
  }

  dstCtx.putImageData(dstData, 0, 0);
  return dst;
}
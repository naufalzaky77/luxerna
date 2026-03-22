// BAGIAN RENDER FOTO + FRAME KE PNG

const DPI = 300;
const MM_TO_PX = DPI / 25.4;

function mmToPx(mm) {
  return Math.round(mm * MM_TO_PX);
}

export async function renderComposite({ layout, photos, templatePreview }) {
  const { print } = layout;
  const { paper } = print;

  const canvasW = mmToPx(paper.w);
  const canvasH = mmToPx(paper.h);

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
  const slots = getSlots(print, canvasW, canvasH);

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (!photos[i]) continue;
    const img = await loadImage(photos[i]);

    // ✅ rotate kalau foto portrait (dari webcam)
    if (img.width < img.height) {
      await drawRotated(ctx, img, s);
    } else {
      const { sx, sy, sw, sh } = coverCrop(img.width, img.height, s.w, s.h);
      ctx.drawImage(img, sx, sy, sw, sh, s.x, s.y, s.w, s.h);
    }
  }

  // ----- 3. Export PNG base64 ------
  return canvas.toDataURL("image/png");
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
function getSlots(print, canvasW, canvasH) {
  if (print.slots) {
    return print.slots.map((s) => ({
      x: mmToPx(s.x),
      y: mmToPx(s.y),
      w: mmToPx(s.w),
      h: mmToPx(s.h),
    }));
  }

  const { cols, rows, photo, margin, gap } = print;
  const slotW = mmToPx(photo.w);
  const slotH = mmToPx(photo.h);
  const gapX = mmToPx(gap.x);
  const gapY = mmToPx(gap.y);
  const marginL = mmToPx(margin.left);
  const marginT = mmToPx(margin.top);

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
// ─── Design Tokens ────────────────────────────────────────────────────────────
// Semua token desain terpusat di sini.
// Ubah nilai di sini → berlaku ke seluruh aplikasi.


// ─── Typography ───────────────────────────────────────────────────────────────
export const font = {
  family: "'Roboto', sans-serif",
};

export const size = {
  h0: "3.1rem",
  h1: "1.9rem",
  h2: "1.2rem",
  h3: "0.7rem",
  h4: "0.5rem",
};

export const weight = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};
//────────────────────────────────────────────────────────────────────────────────



// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  primary: "#1a1a1a",
  secondary: "#418bfa",
  white: "#ffffff",
  black: "#000000",
  green:"#00cc07",
  yellow: "#ffd500",
  red: "#ed2f2f",
  background: "#eaeaea",
  ash: "#a3a3a3",
  };
//────────────────────────────────────────────────────────────────────────────────





// ─── CSS Variables String ─────────────────────────────────────────────────────
// Inject ke <style> tag — dipakai oleh komponen yang masih pakai var(--xxx)
// Kalau mau ganti tema, cukup ubah nilai di atas, buildCssVars() otomatis ikut

export function buildCssVars() {
  return `
    :root {
      /* Font */
      --f: ${font.family};


      /* Font size */
      --fs-h0: ${size.h0};
      --fs-h1: ${size.h1};
      --fs-h2: ${size.h2};
      --fs-h3: ${size.h3};
      --fs-h4: ${size.h4};


      /* Font weight */
      --fw-thin: ${weight.thin};
      --fw-extraLight: ${weight.extraLight};
      --fw-light: ${weight.light};
      --fw-regular: ${weight.regular};
      --fw-medium: ${weight.medium};
      --fw-semiBold: ${weight.semiBold};
      --fw-bold: ${weight.bold};
      --fw-extraBold: ${weight.extraBold};
      --fw-black: ${weight.black};


      /* Color */
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --white: ${colors.white};
      --black: ${colors.black};
      --green: ${colors.green};
      --yellow: ${colors.yellow};
      --red: ${colors.red};
      --bg: ${colors.background};
      --ash: ${colors.ash};
          }
  `;
}
export const G = /*css*/`




/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */
/* ─── FONT ─────────────────────── FONT ────────────────────────────────────── FONT ────────────────────────────────── FONT ──────────────────────────────────────── FONT ────────────── */

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-Thin.ttf') format('truetype');
    font-weight: 100;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-ExtraLight.ttf') format('truetype');
    font-weight: 200;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-Light.ttf') format('truetype');
    font-weight: 300;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-Regular.ttf') format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-Medium.ttf') format('truetype');
    font-weight: 500;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-SemiBold.ttf') format('truetype');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-Bold.ttf') format('truetype');
    font-weight: 700;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-ExtraBold.ttf') format('truetype');
    font-weight: 800;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto-Black.ttf') format('truetype');
    font-weight: 900;
  }

/* ─── FONT ─────────────────────── FONT ────────────────────────────────────── FONT ────────────────────────────────── FONT ──────────────────────────────────────── FONT ────────────── */
/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */




/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */
/* ─── RESET ────────────────────── RESET ───────────────────────────────────── RESET ───────────────────────────────── RESET ─────────────────────────────────────── RESET ───────────── */

  *{box-sizing:border-box;margin:0;padding:0;}

/* ─── RESET ────────────────────── RESET ───────────────────────────────────── RESET ───────────────────────────────── RESET ─────────────────────────────────────── RESET ───────────── */
/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */




/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */
/* ─── ANIMATION ────────────────── ANIMATION ───────────────────────────────── ANIMATION ───────────────────────────── ANIMATION ─────────────────────────────────── ANIMATION ───────── */

  @keyframes spinLogo {
    from{transform: rotate(0deg);}
    to{transform: rotate(180deg);}
  }
  @keyframes spinLogoReverse {
    from{transform: rotate(180deg);}
    to{transform: rotate(0deg);}
  }
  @keyframes infSpin {
    from{transform: rotate(0deg);} 
    to{transform: rotate(360deg);}
  }

/* ─── ANIMATION ────────────────── ANIMATION ───────────────────────────────── ANIMATION ───────────────────────────── ANIMATION ─────────────────────────────────── ANIMATION ───────── */
/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */

  
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes flash{0%,100%{opacity:0}35%{opacity:1}}
  @keyframes shimmer{0%,100%{opacity:.3}50%{opacity:.9}}
  @keyframes tickPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes progressFill{from{width:0}to{width:100%}}
  @keyframes scanLine{0%{top:10%;opacity:1}50%{top:85%;opacity:1}100%{top:10%;opacity:1}}



/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */
/* ─── CLASS ─────────────────────── CLASS ────────────────────────────────────── CLASS ────────────────────────────────── CLASS ──────────────────────────────────────── CLASS ───────── */


/* ─── Filter Warna ─────────────────────────────────────────────── */
  .ic-blue {
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);
  }
  .ic-grey {
    filter: brightness(0) opacity(0.4);
  }
  .ic-white {
    filter: brightness(0) invert(1);
  }
/* ──────────────────────────────────────────────────────────────── */


/* ─── Tombol ───────────────────────────────────────────────────── */
  .start-btn1 {
    position: relative;
    overflow: hidden;
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 6px var(--secondary);
    color: var(--secondary);
    cursor: pointer;
    font-family: var(--f);
    font-size: var(--fs-h2);
    font-weight: var(--fw-black);
    letter-spacing: .25rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .start-btn1::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--secondary);
    transition: left .35s ease;
    z-index: 0;
  }
  .start-btn1:hover::before {
    left: 0;
  }
  .start-btn1:hover {
    color: var(--white);
  }
  .start-btn1 span, .start-btn1 img {
    position: relative;
    z-index: 2;
  }
  .start-btn1 img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
    animation: spinLogoReverse .6s ease forwards;
  }
  .start-btn1:hover img {
    filter: brightness(0) invert(1); 
    animation: spinLogo .6s ease forwards;
  }

  .admin-btn {
    transition: all .2s;
  }
  .admin-btn:hover {
    box-shadow: 0 0 15px rgba(65,139,250,.5), 0 0 30px rgba(65,139,250,.3), 0 0 60px rgba(65,139,250,.15);
  }

  .layout-btn {
    background:var(--white);
    border:4px solid var(--white);
    border-radius:1rem;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:1rem;
    padding:.5rem .5rem;
    transition:all .22s;
    width:100%;
  }
  .layout-btn:hover {
    border-color:rgba(65, 139, 250, 0.5);
    background:rgba(65,139,250,.05);
  }
  .layout-btn.active {
    border-color:var(--secondary);
    background:var(--white);
  }

  .ghost-btn {
    background:transparent;
    border:.15rem solid var(--red);
    border-radius:50%;
    cursor:pointer;
    transition:all .22s;
    padding:.3rem;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .ghost-btn:hover {
    background:var(--red);
    border-color:var(--red);
  }
  .ghost-btn .rmv-img {
    filter: brightness(0) saturate(100%) invert(27%) sepia(85%) saturate(2000%) hue-rotate(343deg) brightness(95%) contrast(95%);
    animation: spinLogoReverse .6s ease forwards;
  }
  .ghost-btn:hover .rmv-img {
    filter: brightness(0) invert(1);
    animation: spinLogo .6s ease forwards;
  }
/* ──────────────────────────────────────────────────────────────── */


/* ─── Zona ─────────────────────────────────────────────────────── */
  .upload-zone {
    border:.5rem dashed rgba(0, 0, 0, 0.1);
    border-radius:1rem;
    padding:1.5rem 1.5rem;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:1rem;
    cursor:pointer;
    transition:all .22s;
    background:var(--white);
  }
  .upload-zone:hover {
    border-color:var(--secondary);
    background:rgba(65,139,250,.05);
  }
  .upload-zone.has-file {
    border:.3rem solid var(--secondary);
    background:var(--white);
  }
  .upload-zone .up-img {
    filter: brightness(0) opacity(0.1);
  }
  .upload-zone:hover .up-img {
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);
  }
  .upload-zone .up-text {
    color: rgba(0,0,0,0.1);
  }
  .upload-zone:hover .up-text {
    color: var(--secondary);
  }
/* ──────────────────────────────────────────────────────────────── */


/* ─── Teks ─────────────────────────────────────────────────────── */
  .cam-scan {
    color: var(--primary);
    transition: color .2s;
  }
  .cam-scan:hover {
    color: var(--secondary);
  }
  .cam-scan img {
    transition: filter .2s;
  }
  .cam-scan:hover img {
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);
  }
/* ──────────────────────────────────────────────────────────────── */


/* ─── CLASS ─────────────────────── CLASS ────────────────────────────────────── CLASS ────────────────────────────────── CLASS ──────────────────────────────────────── CLASS ───────── */
/* ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */



  


  


  .fu{animation:fadeUp .55s ease forwards;}
  .s1{animation-delay:.08s;opacity:0}.s2{animation-delay:.18s;opacity:0}
  .s3{animation-delay:.3s;opacity:0}.s4{animation-delay:.44s;opacity:0}
  .s5{animation-delay:.58s;opacity:0}.s6{animation-delay:.72s;opacity:0}

  

  .primary-btn{background:var(--secondary);border:none;cursor:pointer;color:var(--white);
    font-family:var(--f);font-weight:600;letter-spacing:2px;text-transform:uppercase;
    transition:all .3s;position:relative;overflow:hidden;border-radius:8px;}
  .primary-btn:hover{background:#5a9dff;transform:translateY(-2px);box-shadow:0 10px 36px rgba(65,139,250,.4);}
  .primary-btn:active{transform:translateY(0);}

  .card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;transition:all .22s;}
  .active-card{border-color:var(--secondary)!important;background:rgba(65,139,250,.07)!important;
    box-shadow:0 0 20px rgba(65,139,250,.12)!important;}

  input,textarea{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:9px;
    color:var(--white);font-family:var(--f);font-size:13px;padding:11px 14px;width:100%;outline:none;
    transition:border-color .2s;}
  input:focus,textarea:focus{border-color:var(--secondary);background:rgba(65,139,250,.06);}
  input::placeholder,textarea::placeholder{color:rgba(255,255,255,.3);}
  .scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(65,139,250,.3) transparent;}

  .divider{border:none;border-top:1px solid rgba(65,139,250,1);margin:0;}

  

  
`;
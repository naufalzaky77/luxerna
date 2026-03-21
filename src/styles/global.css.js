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


  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(65,139,250,.4); }
    100% { box-shadow: 0 0 0 40px rgba(65,139,250,0); }
  }


  @keyframes zoomIn {
    0% { transform: scale(1) }
    100% { transform: scale(1.5) }
  }


  @keyframes zoomOut {
    0% { transform: scale(1.5) }
    100% { transform: scale(1) }
  }


  @keyframes slideLeft {
    from{transform: translateX(-100%);}
    to{transform: translateX(0);}
  }


  @keyframes slideLeftFar {
    from{transform: translateX(0);}
    to{transform: translateX(200%);}
  }


  @keyframes slideRightFar {
    from{transform: translateX(100%);}
    to{transform: translateX(0);}
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


  .ic-green {
    filter: brightness(0) saturate(100%) invert(52%) sepia(97%) saturate(500%) hue-rotate(87deg) brightness(95%) contrast(101%);
  }


  .ic-yellow {
    filter: brightness(0) saturate(100%) invert(83%) sepia(61%) saturate(500%) hue-rotate(5deg) brightness(103%) contrast(97%);
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
  }
  .start-btn1:hover img {
    filter: brightness(0) invert(1); 
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
  }
  .ghost-btn:hover .rmv-img {
    filter: brightness(0) invert(1);
  }


  .back-btn {
    background: transparent;
    border:.1rem solid var(--secondary);
    border-radius: .5rem;
    color: var(--secondary);
    font-family: var(--f);
    font-size: var(--fs-h3);
    font-weight: var(--fw-semiBold);
    letter-spacing: .15rem;
    transition: all .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
  }
  .back-btn:hover {
    background: var(--secondary);
    color: var(--white) !important;
    box-shadow: 0 0 15px rgba(65,139,250,.5), 0 0 30px rgba(65,139,250,.3), 0 0 60px rgba(65,139,250,.15);
  }
  .back-btn img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
  }
  .back-btn:hover img {
    filter: brightness(0) invert(1); 
  }


  .snap-btn {
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
    letter-spacing: .15rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .9rem;
  }
  .snap-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--secondary);
    transition: left .35s ease;
    z-index: 0;
  }
  .snap-btn:hover::before {
    left: 0;
  }
  .snap-btn:hover {
    color: var(--white);
  }
  .snap-btn span, .snap-btn img {
    position: relative;
    z-index: 2;
  }
  .snap-btn img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
  }
  .snap-btn:hover img {
    filter: brightness(0) invert(1); 
  }


  .snap-btnG {
    position: relative;
    overflow: hidden;
    background: rgba(0,0,0,.4);
    border: none;
    color: rgba(255,255,255,.4);
    cursor: not-allowed;
    font-family: var(--f);
    font-size: var(--fs-h2);
    font-weight: var(--fw-black);
    letter-spacing: .15rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .snap-btnG img {
    position: relative;
    z-index: 2;
    filter: brightness(0) invert(1) opacity(0.4);  
    transition: filter .35s;
  }


  .pros-btn {
    background: transparent;
    border:.1rem solid var(--secondary);
    border-radius: .5rem;
    color: var(--secondary);
    font-family: var(--f);
    font-size: var(--fs-h2);
    font-weight: var(--fw-semiBold);
    letter-spacing: .15rem;
    transition: all .15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pros-btn:hover {
    background: var(--secondary);
    color: var(--white) !important;
    box-shadow: 0 0 15px rgba(65,139,250,.5), 0 0 30px rgba(65,139,250,.3), 0 0 60px rgba(65,139,250,.15);
  }


  .procs-btn {
    position: relative;
    overflow: hidden;
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 3px var(--secondary);
    color: var(--secondary);
    cursor: pointer;
    font-family: var(--f);
    font-size: var(--fs-h2);
    font-weight: var(--fw-black);
    letter-spacing: .15rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .3rem;
  }
  .procs-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--secondary);
    transition: left .35s ease;
    z-index: 0;
  }
  .procs-btn:hover::before {
    left: 0;
  }
  .procs-btn:hover {
    color: var(--white);
  }
  .procs-btn span, .procs-btn img {
    position: relative;
    z-index: 2;
  }
  .procs-btn img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
  }
  .procs-btn:hover img {
    filter: brightness(0) invert(1); 
  }


  .prt-btn {
    position: relative;
    overflow: hidden;
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 3px var(--secondary);
    color: var(--secondary);
    cursor: pointer;
    font-family: var(--f);
    font-size: var(--fs-h2);
    font-weight: var(--fw-black);
    letter-spacing: .15rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .3rem;
    border-radius: .5rem;
    padding: .7rem 1rem;
  }
  .prt-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--secondary);
    transition: left .35s ease;
    z-index: 0;
  }
  .prt-btn:hover::before {
    left: 0;
  }
  .prt-btn:hover {
    color: var(--white);
  }
  .prt-btn span, .prt-btn img {
    position: relative;
    z-index: 2;
  }
  .prt-btn img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
  }
  .prt-btn:hover img {
    filter: brightness(0) invert(1); 
  }
  .prt-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
 

  .del-btn {
    background:transparent;
    border:none;
    cursor:pointer;
    transition:all .22s;
    padding:.1rem;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .del-btn:hover {
    background:transparent;
  }
  .del-btn .rmv-img {
    filter: brightness(0) saturate(100%) invert(27%) sepia(85%) saturate(2000%) hue-rotate(343deg) brightness(95%) contrast(95%);
  }
  .del-btn:hover .rmv-img {
    filter: brightness(0) saturate(100%) invert(27%) sepia(85%) saturate(2000%) hue-rotate(343deg) brightness(95%) contrast(95%);
  }


  .qr-btn {
    width:100%;
    border:.3rem dashed rgba(0, 0, 0, 0.1);
    border-radius:1rem;
    padding:1.5rem 1.5rem;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:1rem;
    cursor:pointer;
    transition:all .22s;
    background:transparent;
  }
  .qr-btn:hover {
    border-color:var(--secondary);
    background:rgba(65,139,250,.05);
  }
  .qr-btn .qr-img {
    filter: brightness(0) opacity(0.1);
  }
  .qr-btn:hover .qr-img {
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);
  }
  .qr-btn .qr-text {
    color: rgba(0,0,0,0.1);
  }
  .qr-btn:hover .qr-text {
    color: var(--secondary);
  }
  

  .send-btn {
    position: relative;
    overflow: hidden;
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 3px var(--secondary);
    color: var(--secondary);
    cursor: pointer;
    font-family: var(--f);
    font-size: var(--fs-h2);
    font-weight: var(--fw-black);
    letter-spacing: .15rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .7rem;
    border-radius: .5rem;
    padding: .7rem 1rem;
    min-width: 10rem;
  }
  .send-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--secondary);
    transition: left .35s ease;
    z-index: 0;
  }
  .send-btn:hover::before {
    left: 0;
  }
  .send-btn:hover {
    color: var(--white);
  }
  .send-btn:hover span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  .send-btn span, .send-btn img {
    position: relative;
    z-index: 2;
  }
  .send-btn img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
  }
  .send-btn:hover img {
    filter: brightness(0) invert(1); 
  }
  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }


  .qrwc-btn {
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
    letter-spacing: .15rem;
    transition: color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .9rem;
  }
  .qrwc-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--secondary);
    transition: left .35s ease;
    z-index: 0;
  }
  .qrwc-btn:hover::before {
    left: 0;
  }
  .qrwc-btn:hover {
    color: var(--white);
  }
  .qrwc-btn span, .qrwc-btn img {
    position: relative;
    z-index: 2;
  }
  .qrwc-btn img {
    position: relative;
    z-index: 2;
    filter: brightness(0) saturate(100%) invert(39%) sepia(69%) saturate(1234%) hue-rotate(199deg) brightness(101%) contrast(97%);  
    transition: filter .35s;
  }
  .qrwc-btn:hover img {
    filter: brightness(0) invert(1); 
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


  .pulse-ring {
    animation: pulseRing .8s ease-out infinite;
  }

/* ──────────────────────────────────────────────────────────────── */


/* ─── Fungsi ───────────────────────────────────────────────────── */

.done-yes {
    width: 100%;
    background: rgba(0,204,7,.05);
    border: .15rem solid var(--green);
    border-radius: .5rem;
    display: flex;
    align-items: center;
    padding: .5rem 1rem;
    gap: 1rem;
    animation: slideLeft .5s ease forwards;
  }


.scroll {
  overflow-y:auto;
  scrollbar-width:thin;
  scrollbar-color:var(--secondary) transparent;
}


.done-wait {
    width: 100%;
    background: rgba(255,213,0,.05);
    border: .15rem solid var(--yellow);
    border-radius: .5rem;
    display: flex;
    align-items: center;
    padding: .5rem 1rem;
    gap: 1rem;
    animation: slideLeft .5s ease forwards;
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


/* ─── Input Area ───────────────────────────────────────────────── */

input::placeholder,textarea::placeholder {
  color:rgba(0, 0, 0, 0.2);
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
  
  

  .divider{border:none;border-top:1px solid rgba(65,139,250,1);margin:0;}

  

  
`;
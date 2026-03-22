// DATA LAYOUT & UKURAN KERTAS

export const LAYOUTS = [

  //--- 1 FOTO FULL LANDSCAPE ---//
  {
  id: "1full",
  label: "1 Foto",
  sublabel: null,
  shots: 1,
  orientation: "landscape",
  icon: (active) => (
      <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="64" height="42" viewBox="0 0 64 42">
          <rect x="2" y="2" width="60" height="38" rx="3"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
        </svg>
      </div>
    ),
  print: {
    paper: { w: 152, h: 102 },
    photo: { w: 142, h: 92 },
    margin: { top: 5, bottom: 5, left: 5, right: 5 },
    cols: 1,
    rows: 1,
    gap: { x: 0, y: 0 },
  }
},

//--- 2 FOTO FULL PORTRAIT ---//
{
  id: "2full",
  label: "2 Foto",
  sublabel: null,
  shots: 2,
  orientation: "portrait",
  icon: (active) => (
      <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="48" height="74" viewBox="0 0 38 54">
          <rect x="2" y="2" width="34" height="23" rx="3"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
          <rect x="2" y="32" width="34" height="23" rx="3"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
        </svg>
      </div> 
    ),
  print: {
    paper: { w: 102, h: 152 },
    photo: { w: 92, h: 59.606 },
    margin: { top: 13.894, bottom: 13.894, left: 5, right: 5 },
    cols: 1,
    rows: 2,
    gap: { x: 0, y: 5 },
  }
},

//--- 3 FOTO STRIP PORTRAIT ---//
{
  id: "3strip",
  label: "3 Foto",
  sublabel: "(Strip)",
  shots: 3,
  orientation: "portrait",
  icon: (active) => (
      <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="38" height="78" viewBox="0 0 38 96">
          {[0,1,2].map(i => (
            <rect key={i} x="2" y={2 + i * 30} width="34" height="24" rx="3"
              fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
              strokeWidth="1.5"/>
          ))}
        </svg>
      </div>
    ),
  print: {
    paper: { w: 51, h: 152 },
    photo: { w: 41, h: 26.563 },
    margin: { top: 31.155, bottom: 31.155, left: 5, right: 5 },
    cols: 1,
    rows: 3,
    gap: { x: 0, y: 5 },
  }
},

//--- 3 FOTO STRIP LANDSCAPE ---//
{
  id: "3roll",
  label: "3 Foto",
  sublabel: "(L-Strip)",
  shots: 3,
  orientation: "landscape",
  icon: (active) => (
  <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="78" height="24" viewBox="0 0 96 22">
      {[0, 1, 2].map(i => (
        <rect key={i} x={2 + i * 32} y="2" width="28" height="18" rx="3"
          fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
          strokeWidth="1.5"/>
      ))}
    </svg>
  </div>
),
  print: {
    paper: { w: 152, h: 51 },
    photo: { w: 41, h: 26.563 },
    margin: { top: 12.218, bottom: 12.219, left: 7, right: 7 },
    cols: 3,
    rows: 1,
    gap: { x: 7.5, y: 0 },
  }
},

//--- 4 FOTO STRIP PORTRAIT ---//
{
  id: "4strip",
  label: "4 Foto",
  sublabel: "(Strip)",
  shots: 4,
  orientation: "portrait",
  icon: (active) => (     
    <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="32" height="78" viewBox="0 0 32 108">
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x="2" y={2 + i * 26} width="28" height="22" rx="3"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
        ))}
      </svg>
    </div>
  ),
  print: {
    paper: { w: 51, h: 152 },
    photo: { w: 41, h: 26.563 },
    margin: { top: 15.373, bottom: 15.374, left: 5, right: 5 },
    cols: 1,
    rows: 4,
    gap: { x: 0, y: 5 },
  }
},

//--- 4 FOTO GRID LANDSCAPE ---//
{
  id: "4grid",
  label: "4 Foto",
  sublabel: "(Grid)",
  shots: 4,
  orientation: "landscape",
  icon: (active) => (      
    <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="78" height="56" viewBox="0 0 96 64">
        <rect x="2" y="2" width="58" height="38" rx="3"
          fill={active ? "rgba(65,139,250,.5)" : "rgba(0,0,0,0.2)"}
          strokeWidth="1.5"/>
        {[0, 1, 2].map(i => (
          <rect key={i} x={2 + i * 30} y="44" width="26" height="18" rx="3"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0,0,0,0.2)"}
            strokeWidth="1.5"/>
        ))}
      </svg>
    </div>
  ),
  print: {
    paper: { w: 152, h: 102 },
    margin: { top: 5, bottom: 5, left: 5, right: 5 },
    gap: { x: 9.5, y: 5 },
    slots: [
      //1 foto besar//
      { x: 5, y: 5, w: 93.285, h: 60.438 },
      //3 foto kecil//
      { x: 5, y: 5 + 60.438 + 5, w: 41, h: 26.563 },
      { x: 5 + 41 + 9.5, y: 5 + 60.438 + 5, w: 41, h: 26.563 },
      { x: 5 + (41 + 9.5) * 2, y: 5 + 60.438 + 5, w: 41, h: 26.563 },
    ]
  }
},
];








  
  
  



export const GUEST_DB = [      
  { id: "G001", name: "Budi Santoso",    wa: "628111111111" },
  { id: "G002", name: "Buti Rahayu",     wa: "628122222222" },
  { id: "G003", name: "Budi Pratama",    wa: "628133333333" },
  { id: "G004", name: "Dewi Kusuma",     wa: "628144444444" },
  { id: "G005", name: "Reza Firmansyah", wa: "628155555555" },
];
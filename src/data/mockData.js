// orientation: "landscape" | "portrait"
export const LAYOUTS = [
  {
    id: "1foto",
    label: "1 Foto",
    sublabel: "",
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
  },
  {
    id: "2strip",
    label: "2 Foto",
    sublabel: "(Strip)",
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
  },
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
  },
  {
    id: "grid",
    label: "4 Foto",
    sublabel: "",
    shots: 4,
    orientation: "landscape",
    icon: (active) => (
      <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="52" height="40" viewBox="0 0 52 40">
          {/* 1 besar — kiri atas */}
          <rect x="2" y="2" width="22" height="20" rx="2"
           fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
           strokeWidth="1.5"/>
          {/* 2 kecil — bawah kiri */}
         <rect x="2" y="26" width="22" height="12" rx="2"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
          {/* 3 kecil — atas kanan */}
          <rect x="28" y="2" width="22" height="17" rx="2"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
          {/* 4 kecil — bawah kanan */}
         <rect x="28" y="23" width="22" height="15" rx="2"
            fill={active ? "rgba(65,139,250,.5)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"/>
       </svg>
      </div>
    ),
  },
];

export const MOCK = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=450&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=450&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=450&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=450&fit=crop&crop=face",
];

export const GUEST_DB = [      
  { id: "G001", name: "Budi Santoso",    wa: "628111111111" },
  { id: "G002", name: "Siti Rahayu",     wa: "628122222222" },
  { id: "G003", name: "Andi Pratama",    wa: "628133333333" },
  { id: "G004", name: "Dewi Kusuma",     wa: "628144444444" },
  { id: "G005", name: "Reza Firmansyah", wa: "628155555555" },
];
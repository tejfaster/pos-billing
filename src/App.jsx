import React, { useState, useMemo, useRef, useEffect } from "react";

const INK = "#1C1B19";
const PAPER = "#F7F6F2";
const RED = "#B23A2E";
const RULE = "#DAD7CE";
const MINT = "#E4EFE7";

const CATEGORIES = [
  "All",
  "Cement",
  "Steel & Rebar",
  "Bricks & Blocks",
  "Sand & Aggregate",
  "Plumbing",
  "Electrical",
  "Paint",
  "Tools",
  "Fasteners",
];

const PRODUCTS = [
  { id: 1, name: "OPC 53 Grade Cement", code: "CEM-053", cat: "Cement", unit: "bag (50kg)" },
  { id: 2, name: "PPC Cement", code: "CEM-PPC", cat: "Cement", unit: "bag (50kg)" },
  { id: 3, name: "White Cement", code: "CEM-WHT", cat: "Cement", unit: "kg" },
  { id: 4, name: "TMT Bar 8mm Fe500", code: "STL-008", cat: "Steel & Rebar", unit: "kg" },
  { id: 5, name: "TMT Bar 10mm Fe500", code: "STL-010", cat: "Steel & Rebar", unit: "kg" },
  { id: 6, name: "TMT Bar 12mm Fe500", code: "STL-012", cat: "Steel & Rebar", unit: "kg" },
  { id: 7, name: "Binding Wire", code: "STL-BW1", cat: "Steel & Rebar", unit: "kg" },
  { id: 8, name: "Red Clay Brick", code: "BRK-RED", cat: "Bricks & Blocks", unit: "piece" },
  { id: 9, name: "Fly Ash Brick", code: "BRK-FLY", cat: "Bricks & Blocks", unit: "piece" },
  { id: 10, name: "AAC Block 600x200x100", code: "BLK-AAC", cat: "Bricks & Blocks", unit: "piece" },
  { id: 11, name: "Concrete Hollow Block", code: "BLK-CHB", cat: "Bricks & Blocks", unit: "piece" },
  { id: 12, name: "River Sand", code: "AGG-RSD", cat: "Sand & Aggregate", unit: "cft" },
  { id: 13, name: "M-Sand", code: "AGG-MSD", cat: "Sand & Aggregate", unit: "cft" },
  { id: 14, name: "20mm Aggregate", code: "AGG-020", cat: "Sand & Aggregate", unit: "cft" },
  { id: 15, name: "PVC Pipe 1 inch", code: "PLM-PVC1", cat: "Plumbing", unit: "6m length" },
  { id: 16, name: "PVC Pipe 2 inch", code: "PLM-PVC2", cat: "Plumbing", unit: "6m length" },
  { id: 17, name: "CPVC Elbow 1 inch", code: "PLM-ELB1", cat: "Plumbing", unit: "piece" },
  { id: 18, name: "Brass Gate Valve 1 inch", code: "PLM-GV1", cat: "Plumbing", unit: "piece" },
  { id: 19, name: "Teflon Tape", code: "PLM-TFT", cat: "Plumbing", unit: "roll" },
  { id: 20, name: "Copper Wire 1.5 sqmm", code: "ELC-CW15", cat: "Electrical", unit: "90m coil" },
  { id: 21, name: "Copper Wire 2.5 sqmm", code: "ELC-CW25", cat: "Electrical", unit: "90m coil" },
  { id: 22, name: "MCB 16A Single Pole", code: "ELC-MCB16", cat: "Electrical", unit: "piece" },
  { id: 23, name: "Modular Switch", code: "ELC-SW1", cat: "Electrical", unit: "piece" },
  { id: 24, name: "PVC Conduit Pipe 20mm", code: "ELC-CND20", cat: "Electrical", unit: "3m length" },
  { id: 25, name: "Exterior Emulsion Paint", code: "PNT-EXT", cat: "Paint", unit: "litre" },
  { id: 26, name: "Interior Emulsion Paint", code: "PNT-INT", cat: "Paint", unit: "litre" },
  { id: 27, name: "Primer", code: "PNT-PRM", cat: "Paint", unit: "litre" },
  { id: 28, name: "Enamel Paint", code: "PNT-ENM", cat: "Paint", unit: "litre" },
  { id: 29, name: "Claw Hammer", code: "TL-HMR1", cat: "Tools", unit: "piece" },
  { id: 30, name: "Steel Measuring Tape 5m", code: "TL-TAPE5", cat: "Tools", unit: "piece" },
  { id: 31, name: "Spirit Level 24 inch", code: "TL-LVL24", cat: "Tools", unit: "piece" },
  { id: 32, name: "Angle Grinder 4 inch", code: "TL-GRD4", cat: "Tools", unit: "piece" },
  { id: 33, name: "Trowel", code: "TL-TRW1", cat: "Tools", unit: "piece" },
  { id: 34, name: "Wheelbarrow", code: "TL-WHB1", cat: "Tools", unit: "piece" },
  { id: 35, name: "M8 Anchor Bolt", code: "FST-AB8", cat: "Fasteners", unit: "piece" },
  { id: 36, name: "Concrete Nails 3 inch", code: "FST-CN3", cat: "Fasteners", unit: "kg" },
  { id: 37, name: "Wood Screws 2 inch", code: "FST-WS2", cat: "Fasteners", unit: "box (100)" },
  { id: 38, name: "Hinges 4 inch", code: "FST-HG4", cat: "Fasteners", unit: "pair" },
];

function ProductSearch({ category, onAdd }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat = category === "All" || p.cat === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      );
    }).slice(0, 40);
  }, [query, category]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, category, open]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const commit = (product) => {
    if (!product) return;
    onAdd(product);
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search item name or code (e.g. TMT, PVC, cement)"
        style={{ border: `1px solid ${RULE}`, background: "#FFFFFF" }}
        className="w-full px-4 py-3 text-base outline-none focus:ring-2"
        role="combobox"
        aria-expanded={open}
        aria-controls="product-listbox"
      />

      {open && (
        <div
          id="product-listbox"
          ref={listRef}
          role="listbox"
          style={{
            border: `1px solid ${RULE}`,
            background: "#FFFFFF",
            boxShadow: "0 8px 20px rgba(28,27,25,0.10)",
          }}
          className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center" style={{ color: "#6B6862" }}>
              No items match "{query}"
            </div>
          ) : (
            results.map((p, idx) => (
              <div
                key={p.id}
                data-idx={idx}
                role="option"
                aria-selected={idx === activeIndex}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => commit(p)}
                style={{
                  background: idx === activeIndex ? MINT : "transparent",
                  borderBottom: `1px solid ${RULE}`,
                }}
                className="px-4 py-3 cursor-pointer"
              >
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A867D" }}>
                  <span style={{ fontFamily: "'Courier New', monospace" }}>
                    {p.code}
                  </span>
                  {"  \u00b7  "}
                  {p.cat}
                  {"  \u00b7  "}
                  {p.unit}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function HardwareItemList() {
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        fontFamily: "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
      }}
      className="w-full"
    >
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: #fff; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ON-SCREEN APP */}
      <div className="no-print max-w-xl mx-auto px-5 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Sharma Hardware &amp; Building Materials
          </h1>
          <span className="text-sm" style={{ color: "#6B6862" }}>
            {today}
          </span>
        </div>

        <ProductSearch category={category} onAdd={addItem} />

        <div className="flex gap-1 mt-4 mb-5 overflow-x-auto">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  background: active ? INK : "transparent",
                  color: active ? PAPER : INK,
                  border: `1px solid ${active ? INK : RULE}`,
                }}
                className="px-3 py-1.5 text-sm whitespace-nowrap transition-colors shrink-0"
              >
                {c}
              </button>
            );
          })}
        </div>

        <div style={{ border: `1px solid ${RULE}`, background: "#FFFFFF" }}>
          <div
            style={{ borderBottom: `1px solid ${RULE}` }}
            className="flex items-center justify-between px-4 py-3"
          >
            <h2 className="text-sm font-semibold">Item List</h2>
            <span
              style={{ fontFamily: "'Courier New', monospace" }}
              className="text-xs"
            >
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-14 text-center text-sm" style={{ color: "#6B6862" }}>
              Search above and pick an item to add it to the list.
            </div>
          ) : (
            <div>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  style={{ borderBottom: `1px solid ${RULE}` }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span
                    style={{ color: "#8A867D", fontFamily: "'Courier New', monospace" }}
                    className="text-xs w-5 shrink-0"
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-snug truncate">
                      {item.name}
                    </div>
                    <div className="text-xs" style={{ color: "#8A867D" }}>
                      {item.code} &middot; {item.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      style={{ border: `1px solid ${RULE}` }}
                      className="w-7 h-7 text-sm leading-none"
                    >
                      \u2212
                    </button>
                    <span
                      style={{ fontFamily: "'Courier New', monospace" }}
                      className="text-sm w-5 text-center"
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      style={{ border: `1px solid ${RULE}` }}
                      className="w-7 h-7 text-sm leading-none"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ color: RED }}
                    className="text-xs shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handlePrint}
          disabled={items.length === 0}
          style={{
            background: items.length === 0 ? MINT : INK,
            color: items.length === 0 ? "#6B6862" : PAPER,
          }}
          className="w-full py-3 mt-4 text-base font-semibold tracking-wide transition-colors"
        >
          Print List
        </button>
      </div>

      {/* PRINT-ONLY VIEW */}
      <div className="print-only" style={{ color: "#000", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
            Sharma Hardware &amp; Building Materials
          </h1>
          <span style={{ fontSize: "12px" }}>{today}</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>S.No</th>
              <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Item</th>
              <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "center" }}>Qty</th>
              <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "left" }}>Unit</th>
              <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "center" }}>Rate</th>
              <th style={{ border: "1px solid #000", padding: "6px 8px", textAlign: "center" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #000", padding: "10px 8px" }}>{idx + 1}</td>
                <td style={{ border: "1px solid #000", padding: "10px 8px" }}>{item.name}</td>
                <td style={{ border: "1px solid #000", padding: "10px 8px", textAlign: "center" }}>
                  {item.qty}
                </td>
                <td style={{ border: "1px solid #000", padding: "10px 8px" }}>{item.unit}</td>
                <td style={{ border: "1px solid #000", padding: "10px 8px" }}></td>
                <td style={{ border: "1px solid #000", padding: "10px 8px" }}></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "24px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #000", paddingTop: "8px" }}>
            <span>Total Amount</span>
            <span style={{ borderBottom: "1px solid #000", width: "140px", display: "inline-block" }}>&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Radio, Zap, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DEMO_RFID_CARDS } from '../../utils/constants';

export function RfidSimulatorPanel({ onScan, loading = false }) {
  const [customUid, setCustomUid] = useState('A3:7F:21:9C');

  const handleCustomScan = (e) => {
    e.preventDefault();
    if (customUid.trim()) {
      onScan(customUid.trim());
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Simulate RFID Scan (ESP32 Tester)
            </h4>
            <p className="text-[11px] text-slate-400">
              Gunakan endpoint <code>POST /api/rfid/scan</code> tanpa alat fisik
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 font-mono font-semibold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
          SIMULATOR READY
        </span>
      </div>

      {/* Quick Click Demo Cards */}
      <div className="mb-4">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          Pilih Kartu Uji Coba Cepat:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DEMO_RFID_CARDS.map((card) => (
            <button
              key={card.uid}
              type="button"
              disabled={loading}
              onClick={() => onScan(card.uid)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group disabled:opacity-50"
            >
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 truncate">
                  {card.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  UID: <span className="text-cyan-400 font-bold">{card.uid}</span> • {card.dept}
                </p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-blue-600/20 text-blue-300 font-bold group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shrink-0">
                TAP
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual UID Input */}
      <form onSubmit={handleCustomScan} className="pt-3 border-t border-slate-800">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Atau Masukkan Custom UID RFID:
        </label>
        <div className="flex gap-2">
          <Input
            value={customUid}
            onChange={(e) => setCustomUid(e.target.value)}
            placeholder="Contoh: A3:7F:21:9C"
            icon={Radio}
            className="font-mono uppercase text-xs"
          />
          <Button
            type="submit"
            variant="cyan"
            size="md"
            loading={loading}
            className="shrink-0"
          >
            Scan Card
          </Button>
        </div>
      </form>
    </div>
  );
}

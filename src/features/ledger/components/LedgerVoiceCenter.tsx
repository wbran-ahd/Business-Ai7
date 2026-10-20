import { type ReactNode } from "react";
import { Mic, MicOff } from "lucide-react";
import { PwaStatus } from "@/components/sauti/PwaStatus";
import { BackupReminderBanner, BudgetAlertBanner } from "@/components/sauti/Alerts";
import { QuickEntry } from "@/components/sauti/QuickEntry";
import { HorizonArc } from "./HorizonArc";
import { MetricBoxes } from "./MetricBoxes";
import { t } from "@/lib/i18n";
import { formatNumber, type DigitStyle, type EntryType } from "@/lib/khata";

interface LedgerVoiceCenterProps {
  pwa: any;
  backupDue: { due: boolean; days: number };
  onBackup: () => void;
  onSnoozeBackup: () => void;
  budgetDismissed: boolean;
  budgetAlerts: any[];
  onDismissBudgetAlerts: () => void;
  totals: {
    carryForward: number;
    directIncome: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  digitStyle?: DigitStyle;
  isCurrentMonth: boolean;
  onOpenModal: (type: any) => void;
  transcript: ReactNode;
  onUndo: () => void;
  prefs: any;
  onQuickCommit: (input: {
    type: EntryType;
    amount: number;
    detail: string;
    category?: string;
    account?: any;
  }) => boolean;
  voiceListening: boolean;
  onToggleVoice: () => void;
}

export function LedgerVoiceCenter({
  pwa: _pwa,
  backupDue: _backupDue,
  onBackup: _onBackup,
  onSnoozeBackup: _onSnoozeBackup,
  budgetDismissed: _budgetDismissed,
  budgetAlerts: _budgetAlerts,
  onDismissBudgetAlerts: _onDismissBudgetAlerts,
  totals,
  digitStyle,
  onOpenModal,
  transcript,
  prefs,
  onQuickCommit,
  voiceListening,
  onToggleVoice,
}: LedgerVoiceCenterProps) {
  return (
    <div className="space-y-4">
      {/* Metric Boxes */}
      <MetricBoxes totals={totals} digitStyle={digitStyle} onOpenHistory={onOpenModal} />

      {/* Voice Center / Horizon Arc & Quick Entry */}
      <div className="relative bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <HorizonArc listening={voiceListening} />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Interactive Mic Button */}
          <div className="flex flex-col items-center justify-center my-1">
            <button
              type="button"
              onClick={onToggleVoice}
              className={`relative flex size-16 items-center justify-center rounded-full border transition-all shadow-xl cursor-pointer ${
                voiceListening
                  ? "border-sky-400 bg-sky-500/40 text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.5)] animate-pulse"
                  : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:border-white/40"
              }`}
              title={voiceListening ? "مائیک بند کریں" : "مائیک آن کریں (بولیں)"}
            >
              {voiceListening ? (
                <Mic className="size-7 text-sky-200 animate-bounce" />
              ) : (
                <MicOff className="size-6 text-white/70" />
              )}
            </button>
            <span className="mt-2 text-xs font-bold text-sky-300">
              {voiceListening ? "سن رہا ہے... (بند کرنے کے لیے دبائیں)" : "مائیک آن کرنے کے لیے کلک کریں"}
            </span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-sm font-bold text-white">
              {voiceListening ? t("micListening") : t("micIdle")}
            </div>
            <div className="text-xs text-white/50">{t("micExample")}</div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center text-xs text-sky-200 animate-pulse">
              "{transcript}"
            </div>
          )}

          {/* Quick Entry Bar */}
          <QuickEntry
            prefs={prefs}
            onCommit={onQuickCommit}
          />
        </div>
      </div>
    </div>
  );
}

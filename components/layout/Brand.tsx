import { Droplets } from "lucide-react";

export default function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><Droplets size={22} strokeWidth={2.2} /></div>
      <div>
        <strong>UROVA</strong>
        <span>Urology & Reproductive Health</span>
      </div>
    </div>
  );
}

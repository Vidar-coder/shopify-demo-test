import {
  FlaskConical,
  Heart,
  Leaf,
  MessageCircle,
  PawPrint,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/config/types";

const map: Record<IconName, React.ComponentType<LucideProps>> = {
  truck: Truck,
  shield: ShieldCheck,
  leaf: Leaf,
  flask: FlaskConical,
  heart: Heart,
  chat: MessageCircle,
  refund: RotateCcw,
  paw: PawPrint,
  star: Star,
  spark: Sparkles,
};

/** Renders a config-named icon so site configs never import icon libraries. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp aria-hidden strokeWidth={2} {...props} />;
}


import { useToast as useToastUI } from "@/components/ui/use-toast";
import type { Toast } from "@/components/ui/use-toast";

export const useToast = useToastUI;

type ToastProps = Omit<Toast, "id">;

export function toast(props: ToastProps) {
  const { toast } = useToastUI();
  return toast(props);
}

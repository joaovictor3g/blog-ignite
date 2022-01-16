import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: Date, pattern?: string) {
  return format(date, pattern ?? 'PP', {
    locale: ptBR,
  });
}

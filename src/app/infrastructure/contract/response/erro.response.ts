import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export class ErroResponse {
  status: number;
  statusText: string;
  message: string;
  error: any;
  url?: string;
  timestamp: Date;

  constructor(dados: ErroResponse) {
    this.status = dados.status;
    this.statusText = dados.statusText;
    this.message = dados.message;
    this.error = dados.error;
    this.url = dados.url;
    this.timestamp = dados.timestamp;
  }

  static converter(httpError: HttpErrorResponse, messageService?: MessageService): ErroResponse {
    let errorMessage = (httpError as any).body.message;

    if (messageService) {
      messageService.add({
        severity: 'error',
        summary: `Erro ${httpError.status}`,
        detail: errorMessage,
        life: 5000,
      });
    }

    // Criar e retornar o ErroResponse
    return new ErroResponse({
      status: httpError.status,
      statusText: httpError.statusText,
      message: errorMessage,
      error: httpError.error,
      url: httpError.url || undefined,
      timestamp: new Date(),
    });
  }
}

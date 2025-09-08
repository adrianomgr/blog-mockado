import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
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

  static converterComToasty(httpError: HttpErrorResponse): ErroResponse {
    const messageService = inject(MessageService);

    // Determinar a mensagem de erro
    let errorMessage = 'Erro inesperado';
    if (httpError.error?.message) {
      errorMessage = httpError.error.message;
    } else if (typeof httpError.error === 'string') {
      errorMessage = httpError.error;
    } else if (httpError.message) {
      errorMessage = httpError.message;
    }

    // Determinar a severidade baseada no status
    let severity: 'error' | 'warn' | 'info' = 'error';
    if (httpError.status >= 400 && httpError.status < 500) {
      severity = 'warn'; // Erros de cliente
    }
    // Erros de servidor (>= 500) já são 'error' por padrão

    // Exibir toast automaticamente
    messageService.add({
      severity: severity,
      summary: `Erro ${httpError.status}`,
      detail: errorMessage,
      life: 5000,
    });

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

  static converter(httpError: HttpErrorResponse): ErroResponse {
    let errorMessage = 'Erro inesperado';
    if (httpError.error?.message) {
      errorMessage = httpError.error.message;
    } else if (typeof httpError.error === 'string') {
      errorMessage = httpError.error;
    } else if (httpError.message) {
      errorMessage = httpError.message;
    }

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

export class Blog {
	id: string;
	idUsuario: number;
	conteudo: string;
	imagemBase64: string;
	dataPublicacao: Date;

	constructor(dados: Blog) {
		this.id = dados.id;
		this.conteudo = dados.conteudo;
		this.imagemBase64 = dados.imagemBase64;
		this.dataPublicacao = dados.dataPublicacao;
		this.idUsuario = dados.idUsuario;
	}
}
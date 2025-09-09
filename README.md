# BlogMockado 📰

Um blog desenvolvido com Angular 20, implementando as melhores práticas de desenvolvimento frontend e arquitetura escalável.

## 🚀 Tecnologias Utilizadas

- **Angular 20** - Versão mais nova do framework
- **PrimeNG** - Biblioteca de componentes UI rica e acessível
- **RxJS** - Programação reativa para gerenciamento de estado
- **TypeScript** - Tipagem estática para maior robustez
- **SCSS** - Estilização avançada com variáveis CSS
- **Jest** - Framework de testes unitários

## 🏗️ Arquitetura e Padrões Implementados

### ✅ Arquitetura Intuitiva

- **Estrutura modular** organizada por domínio (domain, infrastructure, presentation)
- **Separação clara de responsabilidades** com camadas bem definidas
- **Componentes standalone** para melhor encapsulamento e reutilização

### ✅ Reatividade Avançada

- **Signals do Angular** para gerenciamento de estado reativo
- **RxJS** para operações assíncronas e streams de dados
- **Resources** para gerenciamento automático de requisições HTTP
- **Computed signals** para cálculos derivados e otimização de performance

### ✅ Abstração com Facade Pattern

- **DashboardFacadeService** - Centraliza lógica de negócio do dashboard
- **LoginFacadeService** - Gerencia autenticação e estados de login
- **PostFacadeService** - Coordena operações de posts
- **UserFacadeService** - Administra dados e operações de usuários

### ✅ Sistema de Autenticação e Autorização

- **Guards CanActivate** - Proteção de rotas baseada em autenticação
- **Guards CanDeactivate** - Prevenção de perda de dados em formulários
- **Interceptor de Token** - Injeção automática de tokens JWT nas requisições
- **Gerenciamento de permissões** baseado em roles (Admin, Editor, Autor)

### ✅ Backend Simulado Persistente

- **Fake Backend Service** com armazenamento no estado usando BehaviorSubject
- **Persistência de dados** entre sessões do navegador
- **API REST simulada** com endpoints completos
- **Handlers especializados** para usuários, posts e notificações

### ✅ Otimizações de Performance

- **Pipes customizados** (`userInitials`, `timeAgo`) evitando funções no template
- **TrackBy functions** em loops para otimização do change detection
- **Lazy loading** de módulos para carregamento sob demanda
- **OnPush change detection** strategy

### ✅ Compartilhamento e Reutilização

- **Componentes genéricos** (`dashboard-stat-card`) para diferentes contextos
- **Biblioteca de componentes** compartilhados
- **Mixins SCSS** para estilos reutilizáveis
- **Constantes centralizadas** para configuração

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── abstraction/           # Camada de abstração (Facade Services)
│   ├── domain/               # Regras de negócio e modelos
│   │   ├── enum/            # Enums da aplicação
│   │   └── model/           # Interfaces e tipos
│   ├── infrastructure/       # Camada de infraestrutura
│   │   ├── api/            # Serviços de API
│   │   ├── contract/        # Contratos de requisição/resposta
│   │   ├── fake-backend/    # Backend simulado
│   │   └── guard/          # Guards de rota
│   └── presentation/        # Camada de apresentação
│       ├── components/      # Componentes reutilizáveis
│       ├── directive/       # Diretivas customizadas
│       ├── page/           # Páginas da aplicação
│       └── pipe/           # Pipes customizados
```

## 🧪 Testes

### Configuração de Testes

- **Jest** como framework de testes
- **Testes unitários** para serviços e componentes
- **Mocks** para dependências externas
- **Testes de integração** para fluxos completos

### Executando Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes e2e (quando implementado)
npm run e2e
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/adrianomgr/blog-mockado.git

# Entrar no diretório
cd blog-mockado

# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start

# A aplicação estará disponível em http://localhost:4200
```

### Build de Produção

```bash
# Build otimizado para produção
npm run build

# Os arquivos serão gerados em dist/blog-mockado
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação

- Login/logout com persistência
- Criação de usuários
- Controle de sessão

### ✅ Gerenciamento de Posts

- CRUD completo de posts
- Sistema de tags
- Rascunhos e publicação
- Estatísticas de visualização

### ✅ Gerenciamento de Usuários

- Perfis de usuário (Admin, Editor, Autor)
- Controle de permissões
- Estatísticas de usuários

### ✅ Dashboard Administrativo

- Métricas
- Gestão de postagens
- Gestão de usuários
- Notificações do sistema

## 🔄 Melhorias Futuras

### 📋 Pendências

- [ ] **Criação de diretivas customizadas** para comportamentos reutilizáveis
- [ ] **Cobertura completa de testes** com Jest (atualmente parcial)
- [ ] **Internacionalização (i18n)** para múltiplos idiomas

## 👨‍💻 Autor

**Adriano Gomes** - [GitHub](https://github.com/adrianomgr)

---

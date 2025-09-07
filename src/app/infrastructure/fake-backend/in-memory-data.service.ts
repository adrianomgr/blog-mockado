import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { UserCreate } from '../../domain/model/user-create';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // Dados fake para usuários
    const users: UserCreate[] = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        role: 'admin',
        name: 'Administrador do Sistema',
      },
      {
        id: 2,
        username: 'editor',
        password: 'editor123',
        email: 'editor@example.com',
        role: 'editor',
        name: 'Editor de Conteúdo',
      },
      {
        id: 3,
        username: 'user',
        password: 'user123',
        email: 'user@example.com',
        role: 'subscriber',
        name: 'Usuário Padrão',
      },
    ];

    // Dados fake para posts
    const posts = [
      {
        id: 1,
        title: 'Introdução ao Angular 18',
        content:
          'Angular 18 trouxe muitas novidades incríveis para o desenvolvimento web. Neste post, vamos explorar as principais funcionalidades e como elas podem melhorar seus projetos.',
        status: 'published',
        authorId: 1,
        author: 'Administrador do Sistema',
        createdAt: '2024-01-15T10:00:00Z',
        tags: ['angular', 'frontend', 'typescript'],
      },
      {
        id: 2,
        title: 'TypeScript para Iniciantes',
        content:
          'TypeScript é uma linguagem que adiciona tipagem estática ao JavaScript. Vamos aprender os conceitos básicos e como começar a usar TypeScript em seus projetos.',
        status: 'published',
        authorId: 2,
        author: 'Editor de Conteúdo',
        createdAt: '2024-01-10T14:30:00Z',
        tags: ['typescript', 'javascript', 'programming'],
      },
      {
        id: 3,
        title: 'PrimeNG: Componentes Poderosos',
        content:
          'PrimeNG oferece uma ampla gama de componentes UI para Angular. Vamos ver como usar os principais componentes em seus projetos.',
        status: 'draft',
        authorId: 2,
        author: 'Editor de Conteúdo',
        createdAt: '2024-01-08T16:45:00Z',
        tags: ['primeng', 'angular', 'ui', 'components'],
      },
      {
        id: 4,
        title: 'Gerenciamento de Estado com NgRx',
        content:
          'NgRx é uma biblioteca para gerenciamento de estado em aplicações Angular. Aprenda os conceitos fundamentais e como implementar.',
        status: 'published',
        authorId: 1,
        author: 'Administrador do Sistema',
        createdAt: '2024-01-05T11:20:00Z',
        tags: ['ngrx', 'angular', 'state-management', 'rxjs'],
      },
    ];

    console.log('🚀 InMemory Database initialized with users:', users);
    console.log('📚 InMemory Database initialized with posts:', posts);
    return { users, posts };
  }

  // Permitir GET /users e GET /posts
  get(reqInfo: RequestInfo) {
    const db = this.createDb();

    if (reqInfo.collectionName === 'users') {
      return this.handleGetUsers(reqInfo, db);
    }

    if (reqInfo.collectionName === 'posts') {
      return this.handleGetPosts(reqInfo, db);
    }

    return undefined as any;
  }

  private handleGetUsers(reqInfo: RequestInfo, db: any) {
    const users = db.users.map((u: any) => ({
      id: u.id,
      username: u.username,
      password: u.password, // Para debug na tela de login
      email: u.email,
      role: u.role,
      name: u.name,
    }));
    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      headers: reqInfo.headers,
      body: users,
    }));
  }

  private handleGetPosts(reqInfo: RequestInfo, db: any) {
    // Verificar se é uma busca por ID específico
    if (reqInfo.id) {
      return this.handleGetPostById(reqInfo, db);
    }

    // Aplicar filtros e retornar posts
    const filteredPosts = this.applyPostFilters(reqInfo, db.posts);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      headers: reqInfo.headers,
      body: filteredPosts,
    }));
  }

  private handleGetPostById(reqInfo: RequestInfo, db: any) {
    const post = db.posts.find((p: any) => p.id === +reqInfo.id);
    if (post) {
      console.log('📖 Get post by ID:', reqInfo.id);
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        headers: reqInfo.headers,
        body: post,
      }));
    } else {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        headers: reqInfo.headers,
        body: { message: 'Post não encontrado' },
      }));
    }
  }

  private applyPostFilters(reqInfo: RequestInfo, posts: any[]) {
    let filteredPosts = [...posts];

    // Filtro por status
    if (reqInfo.query.has('status')) {
      const statusValues = reqInfo.query.get('status');
      if (statusValues && statusValues.length > 0) {
        const status = statusValues[0];
        filteredPosts = filteredPosts.filter((p) => p.status === status);
        console.log(`📚 Get posts by status: ${status}, found: ${filteredPosts.length}`);
      }
    }

    // Filtro por autor
    if (reqInfo.query.has('authorId')) {
      const authorIdValues = reqInfo.query.get('authorId');
      if (authorIdValues && authorIdValues.length > 0) {
        const authorId = +authorIdValues[0];
        filteredPosts = filteredPosts.filter((p) => p.authorId === authorId);
        console.log(`📚 Get posts by authorId: ${authorId}, found: ${filteredPosts.length}`);
      }
    }

    // Filtro por tag
    if (reqInfo.query.has('tag')) {
      const tagValues = reqInfo.query.get('tag');
      if (tagValues && tagValues.length > 0) {
        const tag = tagValues[0];
        filteredPosts = filteredPosts.filter((p) => p.tags.includes(tag));
        console.log(`📚 Get posts by tag: ${tag}, found: ${filteredPosts.length}`);
      }
    }

    // Log para busca sem filtros
    const hasFilters =
      reqInfo.query.has('status') || reqInfo.query.has('authorId') || reqInfo.query.has('tag');
    if (!hasFilters) {
      console.log('📚 Get all posts:', filteredPosts.length);
    }

    return filteredPosts;
  }

  // Simulação dos endpoints de login, signup, posts e users
  post(reqInfo: RequestInfo): Observable<any> {
    if (reqInfo.collectionName === 'login') {
      return this.handleLogin(reqInfo);
    } else if (reqInfo.collectionName === 'signup') {
      return this.handleSignUp(reqInfo);
    } else if (reqInfo.collectionName === 'posts') {
      return this.handleCreatePost(reqInfo);
    } else if (reqInfo.collectionName === 'users') {
      return this.handleCreateUser(reqInfo);
    }
    return undefined as any;
  }

  private handleLogin(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('🔐 Login attempt:', { username: body.username });

    // Buscar usuário nos dados fake
    const users = this.createDb().users;
    const user = users.find((u) => u.username === body.username && u.password === body.password);

    if (user) {
      // Simular JWT token (normalmente seria gerado no backend)
      const token = this.generateFakeJWT(user);

      const response = {
        success: true,
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      };

      console.log('✅ Login successful for user:', user.username);

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        headers: headers,
        body: response,
      }));
    } else {
      console.log('❌ Login failed for user:', body.username);
      return reqInfo.utils.createResponse$(() => ({
        status: 401,
        headers: headers,
        body: { success: false, message: 'Credenciais inválidas' },
      }));
    }
  }

  private handleSignUp(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('📝 Sign-up attempt:', { username: body.username, email: body.email });

    // Buscar usuários existentes
    const db = this.createDb();
    const users = db.users;

    // Verificar se username ou email já existem
    const existingUser = users.find((u) => u.username === body.username || u.email === body.email);

    if (existingUser) {
      const message =
        existingUser.username === body.username
          ? 'Nome de usuário já existe'
          : 'E-mail já está em uso';

      console.log('❌ Sign-up failed:', message);

      return reqInfo.utils.createResponse$(() => ({
        status: 400,
        headers: headers,
        body: { success: false, message: message },
      }));
    }

    // Criar novo usuário
    const newUser = {
      id: users.length + 1,
      username: body.username,
      password: body.password,
      email: body.email,
      role: body.role || 'subscriber',
      name: body.name,
    };

    // Adicionar ao array de usuários (simulação de persistência)
    users.push(newUser);

    const response = {
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
    };

    console.log('✅ Sign-up successful for user:', newUser.username);

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      headers: headers,
      body: response,
    }));
  }

  // PUT para atualizar posts e users
  put(reqInfo: RequestInfo): Observable<any> {
    if (reqInfo.collectionName === 'posts') {
      return this.handleUpdatePost(reqInfo);
    } else if (reqInfo.collectionName === 'users') {
      return this.handleUpdateUser(reqInfo);
    }
    return undefined as any;
  }

  // DELETE para deletar posts e users
  delete(reqInfo: RequestInfo): Observable<any> {
    if (reqInfo.collectionName === 'posts') {
      return this.handleDeletePost(reqInfo);
    } else if (reqInfo.collectionName === 'users') {
      return this.handleDeleteUser(reqInfo);
    }
    return undefined as any;
  }

  private handleCreatePost(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('📝 Create post attempt:', { title: body.title });

    const db = this.createDb();
    const posts = db.posts;

    // Criar novo post
    const newPost = {
      id: posts.length + 1,
      title: body.title,
      content: body.content,
      status: body.status || 'draft',
      authorId: body.authorId,
      author: body.author,
      createdAt: new Date().toISOString(),
      tags: body.tags || [],
    };

    // Adicionar ao array de posts
    posts.push(newPost);

    console.log('✅ Post created successfully:', newPost.title);

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      headers: headers,
      body: newPost,
    }));
  }

  private handleUpdatePost(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);
    const postId = +reqInfo.id;

    console.log('📝 Update post attempt:', { id: postId, title: body.title });

    const db = this.createDb();
    const posts = db.posts;
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        headers: headers,
        body: { message: 'Post não encontrado' },
      }));
    }

    // Atualizar post mantendo campos obrigatórios
    const updatedPost = {
      ...posts[postIndex],
      title: body.title || posts[postIndex].title,
      content: body.content || posts[postIndex].content,
      status: body.status || posts[postIndex].status,
      authorId: body.authorId || posts[postIndex].authorId,
      author: body.author || posts[postIndex].author,
      tags: body.tags || posts[postIndex].tags,
    };

    posts[postIndex] = updatedPost;

    console.log('✅ Post updated successfully:', updatedPost.title);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      headers: headers,
      body: updatedPost,
    }));
  }

  private handleDeletePost(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const postId = +reqInfo.id;

    console.log('🗑️ Delete post attempt:', { id: postId });

    const db = this.createDb();
    const posts = db.posts;
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        headers: headers,
        body: { message: 'Post não encontrado' },
      }));
    }

    const deletedPost = posts[postIndex];
    posts.splice(postIndex, 1);

    console.log('✅ Post deleted successfully:', deletedPost.title);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      headers: headers,
      body: { message: 'Post deletado com sucesso' },
    }));
  }

  private generateFakeJWT(user: any): string {
    // Este é apenas um exemplo para demonstração
    // Em um cenário real, o JWT seria gerado no backend com chave secreta
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
      })
    );
    const signature = btoa('fake-signature'); // Em produção seria uma assinatura real

    return `${header}.${payload}.${signature}`;
  }

  private handleCreateUser(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('👤 Create user attempt:', { email: body.email });

    const db = this.createDb();
    const users = db.users;

    // Verificar se email já existe
    const existingUser = users.find((u) => u.email === body.email);
    if (existingUser) {
      return reqInfo.utils.createResponse$(() => ({
        status: 400,
        body: { error: 'Email já está em uso' },
      }));
    }

    // Gerar novo ID
    const maxId = Math.max(...users.map((u) => u.id));

    const newUser = {
      id: maxId + 1,
      name: body.name,
      email: body.email,
      username: body.username || body.email.split('@')[0],
      password: body.password || 'password123',
      role: body.role || 'author',
      avatar: body.avatar || '',
      bio: body.bio || '',
      socialLinks: body.socialLinks || {},
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // Adicionar usuário
    users.push(newUser);

    console.log('✅ User created successfully:', newUser.email);

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      body: newUser,
    }));
  }

  private handleUpdateUser(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);
    const userId = +reqInfo.id!;

    console.log('👤 Update user attempt:', { userId, email: body.email });

    const db = this.createDb();
    const users = db.users;

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Usuário não encontrado' },
      }));
    }

    // Verificar se email já existe em outro usuário
    if (body.email) {
      const existingUser = users.find((u) => u.email === body.email && u.id !== userId);
      if (existingUser) {
        return reqInfo.utils.createResponse$(() => ({
          status: 400,
          body: { error: 'Email já está em uso' },
        }));
      }
    }

    // Atualizar usuário
    const updatedUser = {
      ...users[userIndex],
      ...body,
      id: userId, // Manter o ID original
    };

    users[userIndex] = updatedUser;

    console.log('✅ User updated successfully:', updatedUser.email);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: updatedUser,
    }));
  }

  private handleDeleteUser(reqInfo: RequestInfo): Observable<any> {
    const userId = +reqInfo.id!;

    console.log('👤 Delete user attempt:', { userId });

    const db = this.createDb();
    const users = db.users;

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Usuário não encontrado' },
      }));
    }

    // Remover usuário
    const deletedUser = users.splice(userIndex, 1)[0];

    console.log('✅ User deleted successfully:', deletedUser.email);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { message: 'Usuário removido com sucesso', user: deletedUser },
    }));
  }
}

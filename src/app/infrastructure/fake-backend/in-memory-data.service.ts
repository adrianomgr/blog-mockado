import { Injectable } from '@angular/core';
import { UserCreate } from '@app/domain/model/user-create';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { NotificationStore } from '../store/notification.store';
import { PostStore } from '../store/post.store';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  constructor(
    private readonly userStore: UserStore,
    private readonly postStore: PostStore,
    private readonly notificationStore: NotificationStore
  ) {
    // Inicializar o UserStore com dados iniciais
    this.initializeDefaultUsers();
  }

  // Inicializar usuários padrão
  private initializeDefaultUsers(): void {
    const defaultUsers: UserCreate[] = [
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

    // Só inicializar se não houver usuários
    if (this.userStore.getUserCount() === 0) {
      this.userStore.initializeUsers(defaultUsers);
    }
  }

  createDb() {
    // Usar os dados dos stores
    const users = this.userStore.currentUsers;
    const posts = this.postStore.currentPosts;
    const notifications = this.notificationStore.currentNotifications;

    console.log('🚀 InMemory Database initialized with users:', users);
    console.log('📚 InMemory Database initialized with posts:', posts);
    console.log('🔔 InMemory Database initialized with notifications:', notifications);
    return { users, posts, notifications };
  }

  // Permitir GET /users, GET /posts e GET /notifications
  get(reqInfo: RequestInfo) {
    const db = this.createDb();

    if (reqInfo.collectionName === 'users') {
      return this.handleGetUsers(reqInfo, db);
    }

    if (reqInfo.collectionName === 'posts') {
      return this.handleGetPosts(reqInfo, db);
    }

    if (reqInfo.collectionName === 'notifications') {
      return this.handleGetNotifications(reqInfo, db);
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

    // Usar posts do PostStore em vez do db
    const filteredPosts = this.applyPostFilters(reqInfo, this.postStore.currentPosts);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      headers: reqInfo.headers,
      body: filteredPosts,
    }));
  }

  private handleGetPostById(reqInfo: RequestInfo, db: any) {
    // Usar posts do PostStore em vez do db
    const post = this.postStore.currentPosts.find((p: any) => p.id === +reqInfo.id);
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

  private handleGetNotifications(reqInfo: RequestInfo, db: any) {
    // Verificar se é uma busca por ID específico
    if (reqInfo.id) {
      const notification = this.notificationStore.currentNotifications.find(
        (n: any) => n.id === +reqInfo.id
      );
      if (notification) {
        console.log('🔔 Get notification by ID:', reqInfo.id);
        return reqInfo.utils.createResponse$(() => ({
          status: 200,
          headers: reqInfo.headers,
          body: notification,
        }));
      } else {
        return reqInfo.utils.createResponse$(() => ({
          status: 404,
          headers: reqInfo.headers,
          body: { message: 'Notificação não encontrada' },
        }));
      }
    }

    // Filtros especiais para notificações
    let filteredNotifications = [...this.notificationStore.currentNotifications];

    // Filtro por não lidas
    if (reqInfo.url.includes('/unread')) {
      filteredNotifications = filteredNotifications.filter((n) => !n.read);
      console.log('🔔 Get unread notifications:', filteredNotifications.length);
    }

    // Filtro por contagem de não lidas
    if (reqInfo.url.includes('/unread-count')) {
      const count = filteredNotifications.filter((n) => !n.read).length;
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        headers: reqInfo.headers,
        body: { count },
      }));
    }

    // Retornar notificações filtradas
    console.log('🔔 Get notifications:', filteredNotifications.length);
    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      headers: reqInfo.headers,
      body: filteredNotifications,
    }));
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

  // Simulação dos endpoints de login, signup, posts, users e notifications
  post(reqInfo: RequestInfo): Observable<any> {
    if (reqInfo.collectionName === 'login') {
      return this.handleLogin(reqInfo);
    } else if (reqInfo.collectionName === 'signup') {
      return this.handleSignUp(reqInfo);
    } else if (reqInfo.collectionName === 'posts') {
      return this.handleCreatePost(reqInfo);
    } else if (reqInfo.collectionName === 'users') {
      return this.handleCreateUser(reqInfo);
    } else if (reqInfo.collectionName === 'notifications') {
      return this.handleCreateNotification(reqInfo);
    }
    return undefined as any;
  }

  private handleLogin(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('🔐 Login attempt:', { username: body.username });

    // Buscar usuário nos dados do UserStore
    const user = this.userStore.currentUsers.find(
      (u: UserCreate) => u.username === body.username && u.password === body.password
    );

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

    // Verificar se username ou email já existem
    const existingUser = this.userStore.currentUsers.find(
      (u: UserCreate) => u.username === body.username || u.email === body.email
    );

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
    const newUser: UserCreate = {
      id: this.userStore.getNextId(),
      username: body.username,
      password: body.password,
      email: body.email,
      role: body.role || 'subscriber',
      name: body.name,
    };

    // Adicionar ao UserStore
    this.userStore.addUser(newUser);

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

    // Usar PostStore para criar o post
    const newPost = this.postStore.addPost({
      title: body.title,
      content: body.content,
      status: body.status || 'draft',
      authorId: body.authorId,
      author: body.author,
      tags: body.tags || [],
    });

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

    // Usar PostStore para atualizar o post
    const updatedPost = this.postStore.updatePost(postId, {
      title: body.title,
      content: body.content,
      status: body.status,
      authorId: body.authorId,
      author: body.author,
      tags: body.tags,
    });

    if (!updatedPost) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        headers: headers,
        body: { message: 'Post não encontrado' },
      }));
    }

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

    // Usar PostStore para deletar o post
    const deleted = this.postStore.removePost(postId);

    if (!deleted) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        headers: headers,
        body: { message: 'Post não encontrado' },
      }));
    }

    console.log('✅ Post deleted successfully');

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

    // Verificar se email já existe
    const existingUser = this.userStore.getUserByEmail(body.email);
    if (existingUser) {
      return reqInfo.utils.createResponse$(() => ({
        status: 400,
        body: { error: 'Email já está em uso' },
      }));
    }

    const newUser: UserCreate = {
      id: this.userStore.getNextId(),
      name: body.name,
      email: body.email,
      username: body.username || body.email.split('@')[0],
      password: body.password || 'password123',
      role: body.role || 'author',
    };

    // Adicionar usuário ao UserStore
    this.userStore.addUser(newUser);

    console.log('✅ User created successfully:', newUser.email);

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      body: newUser,
    }));
  }

  private handleCreateNotification(reqInfo: RequestInfo): Observable<any> {
    const { headers } = reqInfo;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('🔔 Create notification attempt:', { type: body.type, title: body.title });

    // Usar NotificationStore para criar a notificação
    const newNotification = this.notificationStore.addNotification({
      type: body.type,
      title: body.title,
      message: body.message,
    });

    console.log('✅ Notification created successfully:', newNotification.title);

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      headers: headers,
      body: newNotification,
    }));
  }

  private handleUpdateUser(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);
    const userId = +reqInfo.id!;

    console.log('👤 Update user attempt:', { userId, email: body.email });

    const existingUser = this.userStore.getUserById(userId);
    if (!existingUser) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Usuário não encontrado' },
      }));
    }

    // Verificar se email já existe em outro usuário
    if (body.email && this.userStore.emailExists(body.email, userId)) {
      return reqInfo.utils.createResponse$(() => ({
        status: 400,
        body: { error: 'Email já está em uso' },
      }));
    }

    // Atualizar usuário
    const updatedUser: UserCreate = {
      ...existingUser,
      ...body,
      id: userId, // Manter o ID original
    };

    this.userStore.updateUser(updatedUser);

    console.log('✅ User updated successfully:', updatedUser.email);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: updatedUser,
    }));
  }

  private handleDeleteUser(reqInfo: RequestInfo): Observable<any> {
    const userId = +reqInfo.id!;

    console.log('👤 Delete user attempt:', { userId });

    const userToDelete = this.userStore.getUserById(userId);
    if (!userToDelete) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Usuário não encontrado' },
      }));
    }

    // Remover usuário
    this.userStore.removeUser(userId);

    console.log('✅ User deleted successfully:', userToDelete.email);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { message: 'Usuário removido com sucesso', user: userToDelete },
    }));
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { NotificationHandlerStore } from './store-handler/notification-handler-store';
import { PostHandlerStore } from './store-handler/post-handler-store';
import { UserHandlerStore } from './store-handler/user-handler-store';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  constructor(
    private readonly userStore: UserHandlerStore,
    private readonly postStore: PostHandlerStore,
    private readonly notificationStore: NotificationHandlerStore
  ) {}

  createDb() {
    const users = this.userStore.currentUsers;
    const posts = this.postStore.currentPosts;
    const notifications = this.notificationStore.currentNotifications;

    return { users, posts, notifications };
  }

  get(reqInfo: RequestInfo): Observable<any> {
    switch (reqInfo.collectionName) {
      case 'users':
        return this.handleGetUsers(reqInfo);
      case 'posts':
        return this.handleGetPosts(reqInfo);
      case 'notifications':
        return this.handleGetNotifications(reqInfo);
      default:
        return undefined as any;
    }
  }

  post(reqInfo: RequestInfo): Observable<any> {
    switch (reqInfo.collectionName) {
      case 'login':
        return this.handleLogin(reqInfo);
      case 'users':
        return this.handleCreateUser(reqInfo);
      case 'posts':
        return this.handleCreatePost(reqInfo);
      case 'notifications':
        return this.handleCreateNotification(reqInfo);
      default:
        return undefined as any;
    }
  }

  put(reqInfo: RequestInfo): Observable<any> {
    switch (reqInfo.collectionName) {
      case 'users':
        return this.handleUpdateUser(reqInfo);
      case 'posts':
        return this.handleUpdatePost(reqInfo);
      default:
        return undefined as any;
    }
  }

  delete(reqInfo: RequestInfo): Observable<any> {
    switch (reqInfo.collectionName) {
      case 'users':
        return this.handleDeleteUser(reqInfo);
      case 'posts':
        return this.handleDeletePost(reqInfo);
      default:
        return undefined as any;
    }
  }

  private handleGetUsers(reqInfo: RequestInfo): Observable<any> {
    const users = this.userStore.currentUsers;

    if (reqInfo.id) {
      const user = this.userStore.getUserById(+reqInfo.id);
      return this.createResponse(
        reqInfo,
        user ? 200 : 404,
        user || { error: 'Usuário não encontrado' }
      );
    }

    return this.createResponse(reqInfo, 200, users);
  }

  private handleCreateUser(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    try {
      // Gerar ID único baseado no maior ID existente
      const currentUsers = this.userStore.currentUsers;
      const maxId = currentUsers.length > 0 ? Math.max(...currentUsers.map((u) => u.id)) : 0;

      // Criar usuário com ID e data de criação
      const newUser = {
        ...body,
        id: maxId + 1,
        createdAt: new Date().toISOString(),
      };

      this.userStore.addUser(newUser);
      return this.createResponse(reqInfo, 201, newUser);
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      return this.createResponse(reqInfo, 400, { error: httpError.message });
    }
  }

  private handleUpdateUser(reqInfo: RequestInfo): Observable<any> {
    const userId = +reqInfo.id!;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('🔄 [Update User] ID:', userId);
    console.log('🔄 [Update User] Body received:', body);

    try {
      // Buscar o usuário existente para preservar dados não editáveis
      const existingUser = this.userStore.getUserById(userId);
      if (!existingUser) {
        return this.createResponse(reqInfo, 404, { error: 'Usuário não encontrado' });
      }

      console.log('👤 [Update User] Existing user:', existingUser);

      // Mesclar dados existentes com as atualizações, preservando createdAt
      const updatedUser = {
        ...existingUser,
        ...body,
        id: userId,
        createdAt: existingUser.createdAt, // Preserva a data de criação
        // Se não foi enviada uma nova senha, preserva a existente
        password: body.password || existingUser.password,
      };

      console.log('✅ [Update User] Updated user:', updatedUser);

      this.userStore.updateUser(updatedUser);
      return this.createResponse(reqInfo, 200, {
        success: true,
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error: unknown) {
      console.error('❌ [Update User] Error:', error);
      const httpError = error as HttpErrorResponse;
      return this.createResponse(reqInfo, 400, { error: httpError.message });
    }
  }

  private handleDeleteUser(reqInfo: RequestInfo): Observable<any> {
    const userId = +reqInfo.id!;

    try {
      // Verificar se o usuário existe antes de tentar remover
      const user = this.userStore.getUserById(userId);
      if (!user) {
        return this.createResponse(reqInfo, 404, { error: 'Usuário não encontrado' });
      }

      this.userStore.removeUser(userId);
      return this.createResponse(reqInfo, 200, null);
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      return this.createResponse(reqInfo, 500, { error: httpError.message });
    }
  }

  private handleGetPosts(reqInfo: RequestInfo): Observable<any> {
    const posts = this.postStore.currentPosts;

    if (reqInfo.id) {
      const post = posts.find((p) => p.id === +reqInfo.id);
      return this.createResponse(
        reqInfo,
        post ? 200 : 404,
        post || { error: 'Post não encontrado' }
      );
    }

    let filteredPosts = [...posts];

    if (reqInfo.query.has('status')) {
      const status = reqInfo.query.get('status')?.[0];
      if (status) {
        filteredPosts = filteredPosts.filter((p) => p.status === status);
      }
    }

    return this.createResponse(reqInfo, 200, filteredPosts);
  }

  private handleCreatePost(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    const newPost = this.postStore.addPost(body);
    return this.createResponse(reqInfo, 201, newPost);
  }

  private handleUpdatePost(reqInfo: RequestInfo): Observable<any> {
    const postId = +reqInfo.id!;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    const updatedPost = this.postStore.updatePost(postId, body);
    if (updatedPost) {
      return this.createResponse(reqInfo, 200, updatedPost);
    } else {
      return this.createResponse(reqInfo, 404, { error: 'Post não encontrado' });
    }
  }

  private handleDeletePost(reqInfo: RequestInfo): Observable<any> {
    const postId = +reqInfo.id!;

    const deleted = this.postStore.removePost(postId);
    if (deleted) {
      return this.createResponse(reqInfo, 200, {
        success: true,
        message: 'Post deletado com sucesso',
      });
    } else {
      return this.createResponse(reqInfo, 404, { error: 'Post não encontrado' });
    }
  }

  // === HANDLERS DE NOTIFICATIONS ===
  private handleGetNotifications(reqInfo: RequestInfo): Observable<any> {
    const notifications = this.notificationStore.currentNotifications;

    // GET por ID específico
    if (reqInfo.id) {
      const notification = notifications.find((n: any) => n.id === +reqInfo.id);
      return this.createResponse(
        reqInfo,
        notification ? 200 : 404,
        notification || { error: 'Notificação não encontrada' }
      );
    }

    return this.createResponse(reqInfo, 200, notifications);
  }

  private handleCreateNotification(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    const newNotification = this.notificationStore.addNotification(body);
    return this.createResponse(reqInfo, 201, newNotification);
  }

  // === LOGIN HANDLER ===
  private handleLogin(reqInfo: RequestInfo): Observable<any> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req);
    const { username, password } = body;

    const user = this.userStore.currentUsers.find(
      (u) => (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
      // Simular JWT token (seria gerado no backend)
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

      return this.createResponse(reqInfo, 200, response);
    } else {
      return this.createResponse(reqInfo, 401, {
        success: false,
        message: 'Credenciais inválidas2',
      });
    }
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
    const signature = btoa('fake-signature');

    return `${header}.${payload}.${signature}`;
  }

  // === HELPER METHOD ===
  private createResponse(reqInfo: RequestInfo, status: number, body: any): Observable<any> {
    return reqInfo.utils.createResponse$(() => ({
      status,
      headers: reqInfo.headers,
      body,
    }));
  }
}

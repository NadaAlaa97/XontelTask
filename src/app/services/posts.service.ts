import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostsParams {
  page: number;
  limit: number;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPosts(params: PostsParams): Observable<Post[]> {
    let url = this.apiUrl;
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;

    if (params.userId) {
      url += `?userId=${params.userId}`;
    }

    return this.http.get<Post[]>(url).pipe(
      map(posts => {
        return posts.slice(start, end);
      })
    );
  }

  getTotalPosts(): Observable<number> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.length)
    );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 
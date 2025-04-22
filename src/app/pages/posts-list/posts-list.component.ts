import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post, PostsService } from '../../services/posts.service';
import { BreadcrumbComponent, BreadcrumbItemComponent } from '@coreui/angular';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    BreadcrumbComponent, 
    BreadcrumbItemComponent
  ]
})
export class PostsListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  
  posts: Post[] = [];
  currentPage = 1;
  postsPerPage = 10;
  totalPosts = 0;
  userIdFilter: string = '';
  
  
  isAdding = false;
  isEditing = false;
  postForm: FormGroup;
  selectedPost: Post | null = null;
  
  Math = Math;
  
  constructor(
    private postsService: PostsService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      userId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    const params = {
      page: this.currentPage,
      limit: this.postsPerPage,
      userId: this.userIdFilter || undefined
    };

    this.postsService.getPosts(params).subscribe({
      next: (posts) => {
        
        this.posts = posts;
        this.postsService.getTotalPosts().subscribe(total => {
          this.totalPosts = total;
        });
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPosts();
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadPosts();
  }

  resetFilter(): void {
    this.userIdFilter = '';
    this.currentPage = 1;
    this.loadPosts();
  }

  addPost(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedPost = null;
    this.postForm.reset();
  }

  editPost(post: Post): void {
    this.isAdding = false;
    this.isEditing = true;
    this.selectedPost = post;
    this.postForm.patchValue({
      title: post.title,
      body: post.body,
      userId: post.userId
    });

  }

  resetForm(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedPost = null;
    this.postForm.reset();
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    const postData = this.postForm.value;
    
    if (this.isEditing && this.selectedPost) {
      // this.postsService.updatePost({ ...postData, id: this.selectedPost.id })
      //   .subscribe({
      //     next: () => {
      //       this.resetForm();
      //       this.loadPosts();
      //     },
      //     error: (error) => console.error('Error updating post:', error)
      //   });
      this.posts = this.posts.map(p => p.id === this.selectedPost!.id ? { ...p, ...postData } : p);
      this.resetForm();
    } else {
      // this.postsService.createPost(postData)
      //   .subscribe({
      //     next: () => {
      //       this.resetForm();
      //       this.loadPosts();
      //     },
      //     error: (error) => console.error('Error creating post:', error)
      //   });
      this.posts.push({ ...postData, id: this.posts.length + 1 });
      this.resetForm();
    }
  }

  confirmDelete(post: Post): void {
    const modalRef = this.modalService.open(this.deleteModal);
    modalRef.result.then(
      (result) => {
        // if (result) {
        //   this.postsService.deletePost(post.id!)
        //     .subscribe({
        //       next: () => this.loadPosts(),
        //       error: (error) => console.error('Error deleting post:', error)
        //     });
        // }
        this.posts = this.posts.filter(p => p.id !== post.id);
      }
    );
  }
}

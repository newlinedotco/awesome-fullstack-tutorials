import { Component, OnInit } from '@angular/core';

import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  loading = false;
  // Pagination Fields
  allPosts: Post[] = [];
  posts: Post[] = []; // Current Page
  total = 0;
  selectedPage = 1;
  start = 0;
  limit = 10;
  end = this.limit;
  error: String;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.loading = true;
    this.postService.getPosts()
      .subscribe(posts => {
        this.total = posts.length;
        this.allPosts = posts;
        this.posts = this.allPosts.slice(this.start, this.end);
        this.loading = false;
      },
      (error) => {
        this.error = error
        this.loading = false;
      }
    );
  }

  // Handle Pagination Clicks
  public pageChange(page): void {
    this.start = (this.selectedPage - 1) * this.limit;
    this.end = this.start + this.limit;
    this.posts = this.allPosts.slice(this.start, this.end);
  }
}

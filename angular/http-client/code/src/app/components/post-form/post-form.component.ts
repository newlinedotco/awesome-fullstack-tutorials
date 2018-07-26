import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  @Input() post: Post;
  loading: boolean;
  submitText: String = "Save";
  error: String;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost() {
    this.loading = true;
    const id = +this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log(`edit existing post ${id}`);
      this.postService.getPost(id)
        .subscribe(post => {
          this.post = post;
          this.submitText = "Update";
          this.loading = false;
        });
    } else {
      console.log('create new post');
      this.post = new Post();
      this.submitText = "Create";
      this.loading = false;
    }
  }

  onSubmit() {
    this.loading = true;
    if (this.post.id) { // Update Existing Post
      this.postService.updatePost(this.post)
        .subscribe(
          () => this.goBack(),
          error => this.handleError(error)
        );
    } else { // Create New Post
      this.postService.addPost(this.post)
        .subscribe(
          () => this.gotoPosts(),
          error => this.handleError(error)
        );
    }
  }

  onDelete() {
    this.loading = true;
    if (this.post.id) {
      this.postService.deletePost(this.post)
        .subscribe(
          () => this.goBack(),
          error => this.handleError(error)
        );
    }
  }

  gotoPosts() {
    this.router.navigate(['/posts']);
  }

  goBack() {
    this.location.back();
  }

  handleError(error) {
    this.error = error;
    this.loading = false;
  }

}

import { Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private analytics: Analytics,
  ) { }

  trackSignUp():void {
    logEvent(this.analytics, 'sign_up');
  }

  trackLogin():void {
    logEvent(this.analytics, 'login');
  }
  
  trackPageView(pageName: string):void {
    logEvent(this.analytics, 'screen_view', {
      firebase_screen: pageName,
      firebase_screen_class: pageName,
    });
  }

  trackBlogPostView(postId: string, postTitle: string):void {
    logEvent(this.analytics, 'blog_post_view', {
      post_id: postId,
      post_title: postTitle,
    });
  }

  trackComment(postId: string, userId: string):void {
    logEvent(this.analytics, 'post_comment', {
      post_id: postId,
      user_id: userId,
    });
  }
  
  trackButtonClick (buttonName:string):void {
    logEvent(this.analytics, 'button_click', { buttonName })
  }

}

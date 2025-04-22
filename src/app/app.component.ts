import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentLang: string;
  showLoader = false;
  isLoginPage = false;
  isNotFoundPage = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService
  ) {
    this.currentLang = this.languageService.getCurrentLang();
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
      this.isNotFoundPage = event.url === '/404';
    });
  }

  logout() {
    this.showLoader = true;
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        this.showLoader = false;
      });
    }, 1000);
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}

import { ProductDetailComponent } from './componennts/product-detail/product-detail.component';
import { StompService } from './service/stomp.service';
import { ProductService } from './service/product.service';
import { UserComponent } from './componennts/user/user.component';
import { AdminComponent } from './componennts/admin/admin.component';
import { WelcomeComponent } from './componennts/welcome/welcome.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },

];

@NgModule({
  declarations: [
    AppComponent, WelcomeComponent, AdminComponent, UserComponent, ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [ProductService, StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }

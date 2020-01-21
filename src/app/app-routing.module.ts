import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {HomePageComponent} from './home-page/home-page.component';
import {PostPageComponent} from './post-page/post-page.component';


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/', pathMatch:'full' }, //redirect to the empty page, to make Angular understand when we go to the '' page.
        //If the path is empty then we upload MainLayoutComponent, / - is the path to HomePageComponent, 'full' means that the path should be completly the same
      {path: '', component: HomePageComponent },
      {path: 'post/:id', component: PostPageComponent}
    ]
  }
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutingPaths } from './routing-paths';
import { SearchComponent } from './search/search/search.component';
import { ManageComponent } from './manage/manage/manage.component';

@NgModule({
  imports: [RouterModule.forRoot(AppRoutingModule.routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  public static routes: Routes =
    [
      { path: '', redirectTo: RoutingPaths.searchPath, pathMatch: 'full' },
      { path: RoutingPaths.searchPath, component: SearchComponent },
      { path: RoutingPaths.managePath, component: ManageComponent }
    ];
}
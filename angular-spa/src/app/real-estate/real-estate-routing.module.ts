import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealEstatesComponent } from './components/real-estates/real-estates.component';
import { ViewRealEstateComponent } from './components/real-estate/view-real-estate.component';
import { AuthGuard } from '../auth/auth.guard';
import { CreateRealEstateComponent } from './components/real-estate/create-real-estate.component';

const routes: Routes = [
  { path: 'search', component: RealEstatesComponent },
  {
    path: 'real-estates/create',
    component: CreateRealEstateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'real-estates/edit/:id',
    component: ViewRealEstateComponent,
    canActivate: [AuthGuard]
  },
  { path: 'real-estates/:id', component: ViewRealEstateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class RealEstateRoutingModule {}

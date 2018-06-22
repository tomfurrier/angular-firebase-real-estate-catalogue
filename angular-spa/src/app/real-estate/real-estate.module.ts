import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealEstatesComponent } from './components/real-estates/real-estates.component';
import { NewRealEstateComponent } from './components/new-real-estate/new-real-estate.component';
import { EditRealEstateComponent } from './components/edit-real-estate/edit-real-estate.component';
import { ViewRealEstateComponent } from './components/view-real-estate/view-real-estate.component';
import { RealEstateRoutingModule } from './real-estate-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderModule } from 'angular-image-slider';
import { EffectsModule } from '@ngrx/effects';
import { RealEstateEffects } from './effects/real-estate.effect';
import { CollectionEffects } from './effects/collection.effects';
import { RealEstateExistsGuard } from './guards/real-estate-exists.guard';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { RealEstateDetailComponent } from './components/view-real-estate/real-estate-detail.component';
import { SelectedRealEstatePageComponent } from './components/view-real-estate/selected-real-estate-page.component';

@NgModule({
  imports: [
    CommonModule,
    RealEstateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SliderModule,
    AngularFireModule,
    AngularFireStorageModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('realEstates', reducers),
    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([RealEstateEffects, CollectionEffects])
  ],
  declarations: [
    RealEstatesComponent,
    NewRealEstateComponent,
    EditRealEstateComponent,
    ViewRealEstateComponent,
    RealEstateDetailComponent,
    SelectedRealEstatePageComponent
  ],
  providers: [RealEstateExistsGuard]
})
export class RealEstateModule {}

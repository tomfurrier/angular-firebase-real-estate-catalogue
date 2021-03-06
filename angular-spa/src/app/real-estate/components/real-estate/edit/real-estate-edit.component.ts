import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import * as fromRealEstates from '../../../reducers';
import { Store } from '@ngrx/store';
import { storage } from 'firebase';
import { Subject, Observable, from } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { RealEstate } from '../../../../shared/api-client';
import * as CollectionActions from '../../../actions/collection.actions';
import { ConfirmDeleteDialogComponent } from '../detail/confirm-delete.component';
import { MatDialog } from '@angular/material';

interface MediaUrl {
  type: string;
  url: string;
}

@Component({
  selector: 'app-real-estate-edit',
  templateUrl: './real-estate-edit.component.html',
  styleUrls: ['./real-estate-edit.component.css']
})
export class RealEstateEditComponent implements OnInit {
  @Input() realEstate: RealEstate;
  @Input() editExistingRealEstate: boolean;

  realEstateTypes = RealEstate.RealEstateTypeEnum;
  newRealEstateFirstForm: FormGroup;
  newRealEstateSecondForm: FormGroup;
  newRealEstateThirdForm: FormGroup;
  newRealEstateFourthForm: FormGroup;

  task: storage.UploadTask;
  uploadProgress: Subject<number>;
  downloadURL: string;

  imageUploadsInProgressNum = 0;

  mediaUrls: MediaUrl[] = [];
  // TODO observable + mediaurlsarray
  constructor(
    private store: Store<fromRealEstates.State>,
    private afStorage: AngularFireStorage,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.editExistingRealEstate) {
      this.setFormValues();
      this.mediaUrls = Array.from(this.realEstate.mediaUrls);
    }
  }

  createForm(): void {
    this.newRealEstateFirstForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      realEstateType: new FormControl('', [Validators.required]),
      intent: new FormControl(''), // it's required but cant use validator
      price: new FormControl('', [Validators.required])
    });

    this.newRealEstateSecondForm = new FormGroup({
      zipCode: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      district: new FormControl(''),
      street: new FormControl(''),
      addressNum: new FormControl('')
    });

    this.newRealEstateThirdForm = new FormGroup({
      floorArea: new FormControl('', [Validators.required]),
      lotSize: new FormControl(''),
      roomCount: new FormControl('', [Validators.required]),
      newlyBuilt: new FormControl(''),
      constructionYear: new FormControl(''),
      seoKeywords: new FormControl('')
    });

    this.newRealEstateFourthForm = new FormGroup({});
  }

  setFormValues(): void {
    this.newRealEstateFirstForm.setValue({
      title: this.realEstate.title,
      description: this.realEstate.description,
      realEstateType: this.realEstate.realEstateType,
      intent: this.realEstate.intent,
      price: this.realEstate.price
    });

    this.newRealEstateSecondForm.setValue({
      zipCode: this.realEstate.zipCode,
      city: this.realEstate.city,
      district: this.realEstate.district ? this.realEstate.district : null,
      street: this.realEstate.street,
      addressNum: this.realEstate.addressNum
    });

    this.newRealEstateThirdForm.setValue({
      floorArea: this.realEstate.floorArea,
      lotSize: this.realEstate.lotSize ? this.realEstate.lotSize : null,
      roomCount: this.realEstate.roomCount,
      newlyBuilt: this.realEstate.newlyBuilt,
      constructionYear: this.realEstate.constructionYear,
      seoKeywords: this.realEstate.seoKeywords
    });
  }

  save(): void {
    this.realEstate = {
      ...this.realEstate,
      title: this.newRealEstateFirstForm.get('title').value,

      description: this.newRealEstateFirstForm.get('description').value,
      realEstateType: this.newRealEstateFirstForm.get('realEstateType').value,
      intent: this.newRealEstateFirstForm.get('intent').value,
      price: this.newRealEstateFirstForm.get('price').value,
      zipCode: this.newRealEstateSecondForm.get('zipCode').value,
      city: this.newRealEstateSecondForm.get('city').value,
      district: this.newRealEstateSecondForm.get('district').value,
      street: this.newRealEstateSecondForm.get('street').value,
      addressNum: this.newRealEstateSecondForm.get('addressNum').value,
      floorArea: this.newRealEstateThirdForm.get('floorArea').value,
      lotSize: this.newRealEstateThirdForm.get('lotSize').value,
      roomCount: this.newRealEstateThirdForm.get('roomCount').value,
      newlyBuilt: this.newRealEstateThirdForm.get('newlyBuilt').value,
      constructionYear: this.newRealEstateThirdForm.get('constructionYear')
        .value,
      seoKeywords: this.newRealEstateThirdForm.get('seoKeywords').value,
      isDeleted: false,
      mediaUrls: this.mediaUrls
    } as RealEstate;

    if (this.editExistingRealEstate) {
      this.store.dispatch(
        new CollectionActions.UpdateRealEstate(this.realEstate)
      );
    } else {
      this.store.dispatch(new CollectionActions.AddRealEstate(this.realEstate));
    }
  }

  uploadPreviewImage(event) {
    const filesToUpload: File[] = event.target.files;
    this.uploadFilesToFirestore(filesToUpload).then(downloadURLs => {
      this.realEstate.previewMediaUrl = { type: 'image', url: downloadURLs[0] };
    });
  }

  upload(event) {
    const filesToUpload: File[] = event.target.files;
    this.uploadFilesToFirestore(filesToUpload).then(downloadURLs => {
      this.mediaUrls = this.mediaUrls.concat(
        downloadURLs.map(u => {
          return { type: 'image', url: u };
        })
      );
      this.ref.detectChanges();
    });
  }

  async uploadFilesToFirestore(filesToUpload: File[]): Promise<string[]> {
    const fileUrls: string[] = [];
    this.imageUploadsInProgressNum += filesToUpload.length;

    for (const file of filesToUpload) {
      const randomId = Math.random()
        .toString(36)
        .substring(2);
      const ref = this.afStorage.ref(randomId);
      const uploadedFile = await ref
        .put(file)
        .catch(err => console.log(`upload error: ${err}`));
      const downloadURL = await uploadedFile.ref
        .getDownloadURL()
        .catch(err => console.log(`getDownloadURL error: ${err}`));
      fileUrls.push(downloadURL);
      this.imageUploadsInProgressNum--;
    }
    return fileUrls;
  }

  get imageUploadInProgress() {
    return this.imageUploadsInProgressNum > 0;
  }

  get hasUploadedImage() {
    return (
      this.mediaUrls.length > 0 && this.realEstate.previewMediaUrl !== null
    );
  }

  get allFormsAreValid() {
    return (
      this.newRealEstateFirstForm.valid &&
      this.newRealEstateSecondForm.valid &&
      this.newRealEstateThirdForm.valid
    );
  }

  delete(index: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        dialogTitle: 'Kép törlése.',
        dialogContent: 'Biztos törli a képet?'
      },
      height: '170px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.mediaUrls = this.mediaUrls.filter((m, i) => index !== i);
        this.ref.detectChanges();
      }
    });
  }

  up(index: number) {
    if (index <= 0) {
      return;
    }

    const prevElement = this.mediaUrls[index - 1];
    const currentElement = this.mediaUrls[index];
    this.mediaUrls.splice(index - 1, 2, currentElement, prevElement);
    this.ref.detectChanges();
  }

  down(index: number) {
    if (index >= this.mediaUrls.length - 1) {
      return;
    }

    const currentElement = this.mediaUrls[index];
    const nextElement = this.mediaUrls[index + 1];

    this.mediaUrls.splice(index, 2, nextElement, currentElement);
    this.ref.detectChanges();
  }
}

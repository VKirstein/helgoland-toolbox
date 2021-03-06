import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IDataset, NotifierService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'n52-favorite-toggler',
  templateUrl: './favorite-toggler.component.html'
})
export class FavoriteTogglerComponent implements OnChanges {

  @Input()
  public dataset: IDataset;
  public isFavorite: boolean;

  constructor(
    private favSrvc: FavoriteService,
    private notifier: NotifierService,
    private translate: TranslateService
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataset && this.dataset) {
      this.isFavorite = this.favSrvc.hasFavorite(this.dataset);
    }
  }

  public toggle() {
    if (this.isFavorite) {
      this.isFavorite = false;
      this.favSrvc.removeFavorite(this.dataset.internalId);
      this.translate.get('favorite.notifier.remove-favorite').subscribe((translation) => {
        this.notifier.notify(translation + ': ' + this.dataset.label);
      });
    } else {
      this.isFavorite = true;
      this.favSrvc.addFavorite(this.dataset);
      this.translate.get('favorite.notifier.add-favorite').subscribe((translation) => {
        this.notifier.notify(translation + ': ' + this.dataset.label);
      });
    }
  }
}

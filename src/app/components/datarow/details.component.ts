import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {DataRowService} from '../../api/data-row.service';
import {DataRow} from '../../models/data-row';
import {ActivatedRoute, Router} from '@angular/router';
import {BbCodeService} from "../../services/bb-code.service";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  static PASSWORD_VISIBILITY_TIME = 5000;
  static RECOVERY_INFO_VISIBILITY_TIME = 15000;
  updateVisibilityInterval;
  dataRow: DataRow;
  visiblePassword = null;
  visibleRecoveryInfo = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataRowService: DataRowService,
    private bbCodeService: BbCodeService
  ) {
  }

  ngOnInit() {
    this.updateVisibilityInterval = setInterval(() => {
      this.updateVisibility();
    }, 500);

    const dataRowId = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.dataRowService.get(dataRowId).subscribe(data => {
      this.dataRow = data;
    });
  }

  ngOnDestroy() {
    clearInterval(this.updateVisibilityInterval);
  }

  bbCodeParsed(value: string) {
    return this.bbCodeService.bbcodeToHtml(value);
  }

  updateVisibility() {
    if (this.visiblePassword && this.visiblePassword.startTime &&
      this.visiblePassword.startTime + DetailsComponent.PASSWORD_VISIBILITY_TIME < +new Date()) {
      delete this.visiblePassword;
    }
    if (this.visibleRecoveryInfo && this.visibleRecoveryInfo.startTime &&
      this.visibleRecoveryInfo.startTime + DetailsComponent.RECOVERY_INFO_VISIBILITY_TIME < +new Date()) {
      delete this.visibleRecoveryInfo;
    }
  }

  isPasswordVisible() {
    return this.visiblePassword;
  }

  getPassword() {
    return this.visiblePassword.password;
  }

  async showPassword() {
    if (this.isPasswordVisible()) {
      this.visiblePassword.startTime = +new Date();
    } else {
      this.visiblePassword = {startTime: null, password: 'Loading...'};
      this.dataRowService.getPassword(this.dataRow).subscribe(async (data) => {
        console.log('data', data);
        const decrypted = await data;
        console.log('decrypted', decrypted);
        this.visiblePassword.password = decrypted;
        this.visiblePassword.startTime = +new Date();
      });
    }
  }

  isRecoveryInfoVisible() {
    return this.visibleRecoveryInfo;
  }

  getRecoveryInfo() {
    return this.visibleRecoveryInfo.recoveryInfo;
  }

  showRecoveryInfo() {
    if (this.isRecoveryInfoVisible()) {
      this.visibleRecoveryInfo.startTime = +new Date();
    } else {
      this.visibleRecoveryInfo = {startTime: null, recoveryInfo: 'Loading...'};
      this.dataRowService.getRecoveryInfo(this.dataRow).subscribe(async (data) => {
        console.log('data', data);
        const decrypted = await data;
        console.log('decrypted', decrypted);
        this.visibleRecoveryInfo.recoveryInfo = decrypted;
        this.visibleRecoveryInfo.startTime = +new Date();
      });
    }
  }
}

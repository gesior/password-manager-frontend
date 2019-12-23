import {Component, Injectable, OnInit} from '@angular/core';
import {DataRowService} from '../../api/data-row.service';
import {DataRow} from '../../models/data-row';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  dataRow: DataRow;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataRowService: DataRowService
  ) {
  }

  ngOnInit() {
    const dataRowId = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.dataRowService.get(dataRowId).subscribe(data => {
      this.dataRow = data;
    });
  }

  onSubmit() {
    this.dataRowService.update(this.dataRow).subscribe((data) => {
      console.log('updated', data);
      this.router.navigate(['/password/details', this.dataRow.id]);
    });
  }
}

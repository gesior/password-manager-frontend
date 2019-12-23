import {Component, Injectable, OnInit} from '@angular/core';
import {DataRowService} from '../../api/data-row.service';
import {DataRow} from '../../models/data-row';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  dataRow: DataRow;

  constructor(private router: Router, private dataRowService: DataRowService) {
  }

  ngOnInit() {
    this.dataRow = new DataRow();
  }

  onSubmit() {
    this.dataRowService.create(this.dataRow).subscribe((data) => {
      this.router.navigate(['/password/details', data.id]);
    });
  }
}

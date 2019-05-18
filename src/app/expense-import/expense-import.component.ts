import { Component, OnInit } from '@angular/core';
import { Papa, PapaParseConfig } from 'ngx-papaparse';

@Component({
  selector: 'app-expense-import',
  templateUrl: './expense-import.component.html',
  styleUrls: ['./expense-import.component.less']
})
export class ExpenseImportComponent implements OnInit {

  constructor(private papa: Papa) { }

  ngOnInit() {
  }

  fileChangeListener($event): void {
    const files = $event.srcElement.files[0];
    console.log(files);

    let options = <PapaParseConfig>{
      complete: (results, file) => {
        console.log('Parsed: ', results, file);
        console.log(results);
      },
      header: true};
    this.papa.parse(files, options);
  }

}

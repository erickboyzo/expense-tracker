import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Papa } from 'ngx-papaparse';


@Component({
  selector: 'app-file-import-mapper',
  imports: [
    MatCardModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './file-import-mapper.component.html',
  styleUrl: './file-import-mapper.component.scss',
})
export class FileImportMapperComponent implements OnInit{
  @Input() file!: File;

  csvData: any[] = [];
  csvHeaders: string[] = [];
  isLoading = false;
  parseError: string | null = null;

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;

  private papa: Papa = inject(Papa);


  ngOnInit(): void {
    const options = {
      header: true, // First row contains headers
      skipEmptyLines: true,
      complete: (results: any) => {
        this.csvHeaders = results.meta.fields || [];
        this.csvData = results.data;
        console.log('Headers:', this.csvHeaders);
        console.log('Data:', this.csvData);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.parseError = error.message;
        console.error('Error parsing CSV:', error);
      }
    };

    // Read the file content
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csvText = e.target.result;
      this.papa.parse(csvText, options);
    };
    reader.onerror = (e) => {
      this.isLoading = false;
      this.parseError = 'Error reading file';
      console.error('FileReader error:', e);
    };
    reader.readAsText(this.file as any);
  }
  }

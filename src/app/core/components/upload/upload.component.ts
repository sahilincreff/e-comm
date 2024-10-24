import { Component } from '@angular/core';
import * as Papa from 'papaparse'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  csvData: any[] = []; 
  constructor(){
    
  }

  handleFileChange(event: any){
    const file=event.target.files[0];
    if(file){
        Papa.parse(file, {
          complete: (results:any)=>{
            this.csvData=results.data;
            console.log(this.csvData);
          },
          header: true,
          skipEmptyLines: true,
        });
    }
  }

  getHeaders() {
    return this.csvData.length > 0 ? Object.keys(this.csvData[0]) : [];
  }
}

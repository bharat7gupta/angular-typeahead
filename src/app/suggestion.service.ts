import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";

import 'rxjs/add/operator/map';

@Injectable()
export class SuggestionService {

  constructor(private http: Http) { }

  getSuggestion(searchTerm: string) {
    return this.http.post("http://localhost:9200/my_kala2/products/_search", {
      "query": {
        "match": {
          "description.edgengram": searchTerm
        }
      }
    }).map((response: any) => response.json().hits.hits.map(item => item._source.description));
  }
}

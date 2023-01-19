import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { Pais, Paises } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private baseUrl: string = 'https://restcountries.com/v2/';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string): Observable<Paises[]> {
    return this.http.get<Paises[]>(`${this.baseUrl}region/${region}?fields=alpha3Code,name`);
  }

  getPaisPorCodigo( codigo: string): Observable<Pais | null> {

    if( !codigo ){ return of(null); }

    return this.http.get<Pais>(`${this.baseUrl}alpha/${codigo}`);

  }

  getPaisPorCodigoSmall( codigo: string): Observable<Paises> {

    return this.http.get<Pais>(`${this.baseUrl}alpha/${codigo}?fields=alpha3Code,name`);

  }

  getPaisesPorCodigo( borders: string[]): Observable<Paises[]>{

    if( !borders ) {
      return of([]);
    }

    const peticiones: Observable<Paises>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall( codigo );
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { Pais, Paises } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup;

  regiones: string[] = [];
  paises: Paises[] = [];
  fronteras: Paises[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder, private paisesService: PaisesServiceService) {
    this.miFormulario = this.fb.group({
      region: ['', Validators.required],
      pais: ['', Validators.required],
      frontera: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la región
    // this.miFormulario.get('region')?.valueChanges
    //         .subscribe( region => {
    //           this.paisesService.getPaisesPorRegion(region).subscribe( paises => {
    //             console.log(paises);
    //             this.paises = paises;
    //           })
    //         })

    this.miFormulario.get('region')?.valueChanges
          .pipe(
            tap( ( _ ) => {
              this.miFormulario.get('pais')?.reset('');
              this.cargando = true;
            }),
            switchMap( region => this.paisesService.getPaisesPorRegion(region))
          ).subscribe( paises => {
            this.paises = paises;
            this.cargando = false;
          });


    this.miFormulario.get('pais')?.valueChanges
          .pipe(
            tap( ( _ ) => {
              this.fronteras = [];
              this.miFormulario.get('frontera')?.reset('');
              this.cargando = true;
            }),
            switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
            switchMap( pais => this.paisesService.getPaisesPorCodigo( pais?.borders! )),
          ).subscribe( paises => {
            this.fronteras = paises;
            console.log(paises);
            this.cargando = false;
          });

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}

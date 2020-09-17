import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { PagoCourierComponent } from '../pago-courier/pago-courier.component';
import { formulario } from './formularioTarjeta';

class Emisor {
  value: String;
}

@Component({
  selector: 'app-pago-producto',
  templateUrl: './pago-producto.component.html',
  styleUrls: ['./pago-producto.component.scss']
})

export class PagoProductoComponent implements OnInit {

  emisores: Emisor[] = [];

  pago: FormGroup;
  courier: String;
  orden: String;
  direccion: String;
  codigo: String;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    let temp_emisores = new Array<Emisor>();


    this.pago = this.fb.group({
      tarjeta: ['', Validators.required],
      fecha_vencM: ['', Validators.required],
      fecha_vencY: ['', Validators.required],
      num_seguridad: ['', Validators.required],
      nombre: ['', Validators.required]

    });

    this.auth.getAllEmisores().subscribe((res) => {
      res.formularios.rows.forEach((element) => {
        this.emisores = [{ value: element.compañia }];
        temp_emisores.push(this.emisores[0]);

      });
      this.emisores = temp_emisores;

    });
  }

  irA(ruta: string) {
    this.router.navigateByUrl(ruta);
  }

  onSubmit(ruta: string) {

    let pago:formulario = new formulario();
    pago.tarjeta = this.pago.value.tarjeta;

    //este ifelse es para cercioroarnos de mandar los meses tip YYYY0M cuando M < 10
    if(this.pago.value.fecha_vencM < 10){
      pago.fecha_venc = "0" + this.pago.value.fecha_vencM;
      pago.fecha_venc = this.pago.value.fecha_vencY + pago.fecha_venc;
    }
    else{
      //esto manda YYYYMM cuando M > 10
      pago.fecha_venc = this.pago.value.fecha_vencY + pago.fecha_venc;
    }
    
    pago.num_seguridad = this.pago.value.num_seguridad;
    pago.nombre = this.pago.value.nombre;

    //autorizacion de pago
    


  }


}


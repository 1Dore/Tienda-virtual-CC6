import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { PagoCourierComponent } from '../pago-courier/pago-courier.component';
import { formulario } from './formularioTarjeta';
import { formCourrier } from './formularioCourrier';

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
      nombre: ['', Validators.required],
      emisor: ['', Validators.required]
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
    pago.ip = " "

    //autorizacion de pago
    pago.monto =Number (localStorage.getItem('total'));
    pago.emisor = this.pago.value.emisor
    console.log(pago);
    this.auth.getEmisorIP(pago).subscribe(data => {

      pago.ip = data.formularios.rows[0].c_ip;
      console.log(pago);
      this.despuesConsultaIP(pago);

    });

  }


  despuesConsultaIP(pago:formulario){
    let datos_tarjeta:formulario = pago;
    console.log(datos_tarjeta);
    this.auth.solicitarAutorizacion(datos_tarjeta).subscribe(data => {

      if(data.autorizacion.numero > 0){
        alert("Pago aceptado")
        this.enviarPedido()
      }
      else{
        alert("Pago rechazado, porfavor utilize otro metodo de pago");
      }

    });
    
  }

  enviarPedido(){
    let info_Pedido:formCourrier = new formCourrier();
    let temp = JSON.parse(localStorage.getItem('datos_Courrier'));
    info_Pedido.nombre = this.pago.value.nombre;
    info_Pedido.codigo_postal = temp.postal;
    info_Pedido.direccion = temp.direccion;
  }

}


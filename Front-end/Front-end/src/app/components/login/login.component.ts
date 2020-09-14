import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuPrincipalComponent } from '../menu-principal/menu-principal.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: FormGroup

  constructor(public dialogRef: MatDialogRef<MenuPrincipalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private fb: FormBuilder,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      correo: ['', Validators.required],
      contraseña: ['', Validators.required]
    })
  }


  irA(ruta: string) {
    this.router.navigateByUrl(ruta);
    this.dialogRef.close();
  }

  onSubmit() {
    let login = this.login.value;

    //---------------------------------------encriptacion-------------------------------
    var passwordBytes = CryptoJS.enc.Utf16LE.parse(login.contraseña);
    var sha1Hash = CryptoJS.SHA1(passwordBytes);
    var sha1HashToBase64 = sha1Hash.toString(CryptoJS.enc.Base64);
    login.contraseña = CryptoJS.enc.Utf16.parse(sha1HashToBase64);
    login.contraseña = CryptoJS.SHA1(login.contraseña).toString();
    //---------------------------------------encriptacion---------------------------------

    this.auth.login(login).subscribe((formulario) => {

      /*if(formulario.message == "Correo y contraseña correctos"){
        this.router.navigateByUrl(ruta);
      }
      else{
        alert("Correo o contraseña incorrectos");
      }
    });*/
      if (login.status === 1) {
        alert("Exitoso");
        this.auth.guardarSenal();
        this.auth.isLogin()
        localStorage.setItem('loggedUser', login.email);
        window.location.href = '/menu-principal';
        this.router.navigateByUrl('/menu-principal');
      }
      else {
        alert("Fallido");
        localStorage.setItem('loggedUser', "LOGIN");

      }

      this.login.reset();
    }

    )
  };
}


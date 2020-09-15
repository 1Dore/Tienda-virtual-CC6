import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
//import { runInThisContext } from 'vm';

class ContenidoCarrito {
  pr_id: Number;
  pr_cantidad: Number;
}
const httpHeader = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
}

const dominio = environment.dominio;

@Injectable({
  providedIn: 'root'

})
export class AuthService {


  categoria: String;
  private items = new Array<ContenidoCarrito>();
  private categoriaDeLaLsita_productos = new Subject<String>();
  enviarcategoria = this.categoriaDeLaLsita_productos.asObservable();


  constructor(private http: HttpClient, private router: Router) { }

  login(loginData): Observable<any> {

    let url = dominio + "LoginUsuarios";
    return this.http.post(url, loginData, httpHeader);
  }
  //ADMIN LOGIN
  loginAdmin(loginAdminData): Observable<any> {

    let url = dominio + "LoginAdmin";
    return this.http.post(url, loginAdminData, httpHeader);
  }
  register(regData): Observable<any> {

    let url = dominio + "newUsuario";
    return this.http.post(url, regData, httpHeader);

  }


  // Codigo para enviar el categoria de producto de Menu Principal a Lista de Producto
  enviarCategoria(categoria: String) {

    this.categoria = categoria;
    localStorage.setItem('Categoria', "" + categoria);
    this.categoriaDeLaLsita_productos.next(categoria);

  }

  categoriaService(dato): Observable<any> {
    let url = dominio + "getProductsBy";
    return this.http.post(url, dato, httpHeader);
  }

  getCategoria() {
    return localStorage.getItem('Categoria');
  }

  isLogin() {
    let islog = localStorage.getItem("isLogin") === "valido";
    return islog;
  }
  isAdminLogin() {
    let adminislog = localStorage.getItem("isAdminLogin") === "valido";
    return adminislog;
  }
  guardarSenal() {
    localStorage.setItem("isLogin", "valido");
  }
  guardarSenalAdmin() {
    localStorage.setItem("isAdminLogin", "valido");
  }
  logout() {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("isAdminLogin");
    this.router.navigateByUrl("/menu-principal");
  }

  agregarCarrito(item: Number) {
    let temp: ContenidoCarrito = new ContenidoCarrito();
    this.traerListaCarrito();
    let existente = this.items.find((producto) => item == producto.pr_id);

    if (!existente) {
      temp.pr_id = item;
      temp.pr_cantidad = 1;
      this.items.push(temp);

    }
    else {
      this.items.forEach(element => {
        if (element.pr_id == item) {
          let index = this.items.indexOf(element);
          this.items[index].pr_cantidad = Number(this.items[index].pr_cantidad) + 1;
        }
      });
    }
    this.guardarListaCarrito();
  }

  sacardeCarrito(item: Number) {
    let temp: ContenidoCarrito = new ContenidoCarrito();
    this.traerListaCarrito();
    let existente = this.items.find((producto) => item == producto.pr_id);

    if (existente) {
      this.items.forEach(element => {
        if (element.pr_id == item) {
          let index = this.items.indexOf(element);
          this.items[index].pr_cantidad = Number(this.items[index].pr_cantidad) - 1;
          if (this.items[index].pr_cantidad == 0) {
            this.items.splice(index, 1);
          }
        }
      });
    }
  }

  eliminardeCarrito(item: Number) {
    this.items.forEach(element => {
      if (element.pr_id == item) {
        this.items.splice(this.items.indexOf(element), 1);
      }
    });
  }


  getCarrito() {
    return this.items;
  }


  eliminarListaCarrito() {
    for (let i = 0; i < Number(localStorage.getItem('carritoLength')); i++) {
      localStorage.removeItem('item' + i);
    }
    localStorage.removeItem('carritoLength');
  }

  guardarListaCarrito() {
    let i = 0;
    this.items.forEach(element => {

      localStorage.setItem('item' + i, JSON.stringify(element));
      i++;
    });
    localStorage.setItem('carritoLength', this.items.length + "");
  }

  traerListaCarrito() {
    let listaTemp = new Array<ContenidoCarrito>();
    for (let i = 0; i < Number(localStorage.getItem('carritoLength')); i++) {
      let temp: ContenidoCarrito = new ContenidoCarrito();
      temp = JSON.parse(localStorage.getItem('item' + i));
      listaTemp.push(temp);
    }
    this.items = listaTemp;
  }
}

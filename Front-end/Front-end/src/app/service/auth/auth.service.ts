import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { formulario } from '../../components/pago-producto/formularioTarjeta';
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

  addCourrier(data): Observable<any> {
    let url = dominio + "newCourrier";
    return this.http.post(url, data, httpHeader);
  }

  addEmisor(data): Observable<any> {
    let url = dominio + "newEmisor";
    return this.http.post(url, data, httpHeader);
  }

  getEmisor(data): Observable<any> {
    let url = dominio + "gerEmisor";
    return this.http.post(url, data, httpHeader);
  }

  solicitarAutorizacion(ip, data: formulario): Observable<any> {
    let url = ip + `autorizacion?tarjeta=${data.tarjeta}&nombre=${data.nombre}&fecha_venc=${data.fecha_venc}
                  &num_seguridad=${data.num_seguridad}&monto=${data.monto}&tienda=DIA&formato=JSON`;
    return this.http.get(url);
  }

  getCourrier(data): Observable<any> {
    let url = dominio + "getCourrier";
    return this.http.post(url, data, httpHeader);
  }

  askCourrierCosto(ip, data): Observable<any> {
    let url = ip;
    return this.http.post(url, data, httpHeader);
  }

  askCourrierStatus(ip, data): Observable<any> {
    let url = ip;
    return this.http.post(url, data, httpHeader);
  }
  //CODIGO PARA TOMAR LOS COURIER DE LA BASE DE DATOS

  getAllCourriers() {

    let url = dominio + "getAllCourriers";
    return this.http.get(url, httpHeader);
  }




  // Codigo para enviar el categoria de producto de Menu Principal a Lista de Producto
  enviarCategoria(categoria: String) {

    this.categoria = categoria;
    localStorage.setItem('Categoria', "" + categoria);
    this.categoriaDeLaLsita_productos.next(categoria);

  }

  getCategoria() {
    this.categoria = localStorage.getItem('Categoria');
    return this.categoria;
  }

  categoriaService(dato): Observable<any> {
    let url = dominio + "getProductsBy";
    return this.http.post(url, dato, httpHeader);
  }

  getProductosById(dato): Observable<any> {
    let url = dominio + "getProductoById";
    return this.http.post(url, dato, httpHeader);
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

  //Funciones pertinentes al Carrito

  modificarCantidadCarrito(item: Number, tipo: boolean) {
    let temp: ContenidoCarrito = new ContenidoCarrito();
    this.traerListaCarrito();
    let existente = undefined != this.items.find((producto) => item == producto.pr_id);

    if (tipo) {
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
    } else {
      if (existente) {
        this.items.forEach(element => {
          if (element.pr_id == item) {
            let index = this.items.indexOf(element);
            temp.pr_id = item;
            temp.pr_cantidad = Number(this.items[index].pr_cantidad) - 1;
            this.items[index] = temp;
            if (Number(this.items[index].pr_cantidad) < 1) {
              this.eliminardeCarrito(item);
            }
          }
        });
      }
    }
    this.guardarListaCarrito();
  }


  eliminardeCarrito(item: Number) {
    for (let i = 0; i < Number(localStorage.getItem('carritoLength')); i++) {
      let temp: ContenidoCarrito = new ContenidoCarrito();
      temp = JSON.parse(localStorage.getItem('item' + i));
      if (temp.pr_id == item) {
        this.items.splice(this.items.indexOf(temp), 1);
        localStorage.removeItem('item' + i);
      }
    }
  }


  getCarrito() {
    this.traerListaCarrito();
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


  // Codigo para las direcciones segun usuario
  getDireccionesByUser(dato): Observable<any> {
    let url = dominio + "getDireccionesByUser";
    return this.http.post(url, dato, httpHeader);
  }

  agregarDireccion(dato): Observable<any> {
    let url = dominio + "newDireccionForUser";
    console.log(dato);
    return this.http.post(url, dato, httpHeader);
  }

  editarDireccion(dato): Observable<any> {
    let url = dominio + "editDireccion";
    return this.http.post(url, dato, httpHeader);
  }

  editarCodigoPostal(dato): Observable<any> {
    let url = dominio + "editCodigoPostal";
    return this.http.post(url, dato, httpHeader);
  }

  eliminarDireccion(dato): Observable<any> {
    let url = dominio + "eliminarDireccionByUser";
    return this.http.post(url, dato, httpHeader);
  }

  // Codigo para las Tarjetas segun usuario
  getTarjetaByUser(dato): Observable<any> {
    let url = dominio + "getTarjetasByUser";
    return this.http.post(url, dato, httpHeader);
  }

  agregarTarjeta(dato): Observable<any> {
    let url = dominio + "newTarjetaForUser";
    return this.http.post(url, dato, httpHeader);
  }

  eliminarTarjeta(dato): Observable<any> {
    let url = dominio + "eliminarTarjetaByUser";
    return this.http.post(url, dato, httpHeader);
  }


}

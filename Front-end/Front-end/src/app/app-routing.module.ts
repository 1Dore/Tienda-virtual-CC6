import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPrincipalComponent } from './components/menu-principal/menu-principal.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ListadoProductosComponent } from './components/listado-productos/listado-productos.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { EmisoresComponent } from './components/emisores/emisores.component';
import { CourierComponent } from './components/courier/courier.component';
import { DireccionUsuarioComponent } from './components/direccion-usuario/direccion-usuario.component';
import { TarjetaUsuarioComponent } from './components/tarjeta-usuario/tarjeta-usuario.component';
import { AgregarProductosComponent } from './components/agregar-productos/agregar-productos.component';
import { ExistenciasComponent } from './components/existencias/existencias.component';
import { PagoProductoComponent } from './components/pago-producto/pago-producto.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';

const routes: Routes = [
  { path: '', component: MenuPrincipalComponent },
  { path: 'menu-principal', component: MenuPrincipalComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listado-productos', component: ListadoProductosComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'lista_de_productos', component: ListadoProductosComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user-page', component: UserPageComponent },
  { path: 'emisores', component: EmisoresComponent },
  { path: 'courier', component: CourierComponent },
  { path: 'direccion-usuario', component: DireccionUsuarioComponent },
  { path: 'tarjeta-usuario', component: TarjetaUsuarioComponent },
  { path: 'agregar-productos', component: AgregarProductosComponent },
  { path: 'existencias', component: ExistenciasComponent },
  { path: 'pago-producto', component: PagoProductoComponent },
  { path: 'pedidos', component: PedidosComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

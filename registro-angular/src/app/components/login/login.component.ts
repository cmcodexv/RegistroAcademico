import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import{User} from '../../models/user';
import{UserService} from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;
  constructor(
        private _userService: UserService,
        private _router: Router, //Sacar parametros de la url
        private _route: ActivatedRoute
  	) { 
     this.page_title = 'Identificate';
     this.user=new User(1,'','','','','','');
  }

  ngOnInit() {
      //Se ejecuta siempre y cierra sesion solo cuando le llega el parametro sure por la url
      this.logout();
  }
  
  onSubmit(form)
  {
      this._userService.signup(this.user).subscribe(
           response =>{
              //Token
              if(response.status != 'error')
              {
                  this.status = 'success';
                  this.token = response;

                  //Objeto usuario identificado
                  this._userService.signup(this.user, true).subscribe(
		           response =>{
		              //Token
		                  this.identity = response;
		                  console.log(this.token);
		                  console.log(this.identity);

                          //PERSISTIR DATOS USUARIO IDENTIFICADO
		                  localStorage.setItem('token', this.token);
		                  localStorage.setItem('identity', JSON.stringify(this.identity));

                      //Redireccion a la pagina inicio
                      this._router.navigate(['inicio']);
		           },
		           error =>
		           {
		           	  this.status = 'error';
		           	  console.log(<any>error);
		           }
		      	);
              }
              else{
           	     this.status = 'error';
              }
           },
           error =>
           {
           	  this.status = 'error';
           	  console.log(<any>error);
           }
      	);
  }

   logout(){
       this._route.params.subscribe(params =>
       {
           let logout = +params['sure'];//Signo + convierte en un entero
           
           if(logout == 1)
           {
               localStorage.removeItem('identity');
               localStorage.removeItem('token');
                this._userService.isAdmin = false;
               this.identity = null;
               this.token = null;

               //Redireccion a la pagina inicio
               this._router.navigate(['inicio']);
           }
       });
   }
}

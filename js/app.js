//variables

const gastoListado = document.querySelector('#gastos ul');
const formulario = document.querySelector('#agregar-gasto');


//eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGasto);
}




//clases

class Presupuesto{

    constructor(presupuesto,restante){
        this.presupuesto = Number( presupuesto );
        this.restante = Number( presupuesto );
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        
        const gastado = this.gastos.reduce ( (total,gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
        // console.log(this.restante);

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
        // console.log(this.gastos);
    }

}

class UI{
    insertarPresupuesto(pres){
        const {presupuesto,restante} = pres;
        document.querySelector('#total').textContent = presupuesto;
        
    }

    imprimirAlerta(mensaje,tipo){

        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center','alert');

        if( tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 1500);

    }

    mostrarGastos(gasto){

        this.limpiarGastos();

        gasto.forEach(gasto => {

            const {cantidad, nombre, id } = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            // console.log(nuevoGasto);

            nuevoGasto.innerHTML = `${nombre} <span class="badge-primary badge-pill"> ${cantidad} </span> `;

            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);

        });

    }

    limpiarGastos(){

        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    
    }


    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){

        const {presupuesto , restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if( (presupuesto / 4) > restante ){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if( ( presupuesto / 2) > restante ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else{         //rembolso
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es 0 o menor
        if(restante <= 0 ){
            ui.imprimirAlerta('Se ha agotado el presupuesto','error');

            formulario.querySelector('button[type="submit"]').disabled = true ;

        }


    }

}

//instanciar

const ui = new UI();


let presupuesto;  //la instancio de forma global

//funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cúal es tu presupuesto?');
    console.log( Number(presupuestoUsuario) );  
                                                                //si devuelve NAN
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
    // console.log(presupuesto);

}


function agregarGasto(e){
    e.preventDefault();

    console.log('procesando...');

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    
    if(nombre === '' || cantidad === '' ){
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if( isNaN(cantidad) || cantidad <= 0 ){
        ui.imprimirAlerta('Ingresa un valor valido','error');
        return;
    }

    //generar un objeto de tipo gasto

    const gasto = { nombre , cantidad, id: Date.now()};
    
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Agregando gasto...');

    const {gastos , restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    formulario.reset();

}


function eliminarGasto(id){

    presupuesto.eliminarGasto(id);
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

}
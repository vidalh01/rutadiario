<script setup lang="ts">

import { onMounted, ref } from "vue";
import { LCS } from "../src/class/lib_localstoraje";
import { TM } from "../src/class/lib_time";
import { TXT } from "./class/lib_read_save_txt";

let indexSave = ref<number>(-1);

let cantidadPasajeros = ref<number>(0);
let cantidadGastos = ref<number>(0);
let dineroBruto = ref<number>(0);
let dineroNeto = ref<number>(0);

let nuevoPasajero = ref<string>("");
let nuevoGasto = ref<string>("");

let dia = ref<string>("");
let mes = ref<string>("");
let mensajeAlerta = ref<string>("");

let bl_edit_pasajeros = ref<boolean>(false);
let bl_edit_gastos = ref<boolean>(false);
let bl_agregar = ref<boolean>(false);
let bl_guardar = ref<boolean>(false);
let alt_eliminar = ref<boolean>(false);
let alt_agregar = ref<boolean>(false);
let alt_guardar = ref<boolean>(false);

interface interDatos {
  count: string;
  hour: string;
}

let arrPasajeros = ref<interDatos[]>([]);
let arrGastos = ref<interDatos[]>([]);
let arrDias = ref<any[]>([]);


function readFile(ev: Event) {
  TXT.cargar(ev).then((res) => {
    arrDias.value = JSON.parse(res)
    LCS.setData("localDias", arrDias.value)
    ftAmacenContadores()
  }).catch((error) => {
    console.error(error);
  });
}

// interructor modo editor
function ftModeEditPasajeros() {
  bl_edit_pasajeros.value = !bl_edit_pasajeros.value
  console.log(bl_edit_pasajeros.value)
}

function ftModeEditGastos() {
  bl_edit_gastos.value = !bl_edit_gastos.value
}

// al iniciar la aplicación, se obtienen los datos guardados en el localstorage
onMounted(() => {
  try {
    ftAmacenContadores()
  } catch (error) {
    console.error("Error al obtener datos del localStorage:", error);
    arrPasajeros.value = [];
  }
});

// ft contadore
function ftAmacenContadores() {
  arrPasajeros.value = LCS.getData("localPasajeros");
  cantidadPasajeros.value = contador("localPasajeros", arrPasajeros.value, 0);

  arrGastos.value = LCS.getData("localGastos");
  cantidadGastos.value = contador("localGastos", arrGastos.value, 1600);

  arrDias.value = LCS.getData("localDias");

  dineroBruto.value = cantidadPasajeros.value * 35;
  dineroNeto.value = dineroBruto.value - cantidadGastos.value;

};

// funcion reset
function ftResetDia() {
  cantidadPasajeros.value = 0;
  cantidadGastos.value = 1600;
  dineroBruto.value = 0;
  dineroNeto.value = 0;

  arrPasajeros.value = [];
  arrGastos.value = [];

  LCS.setData("localDias", arrDias.value);
  LCS.setData("localPasajeros", arrPasajeros.value);
  LCS.setData("localGastos", arrGastos.value);

  ftAmacenContadores()
};

// contador
function contador(key: string, arr: any[], acumulador: number) {
  arr = LCS.getData(key);

  arr.forEach((item) => {
    acumulador += parseInt(item.count);
  });

  return acumulador;
};

// hora formateada
function horaFormateada(): string {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return formattedTime;
};

// fecha formateada
function fechaFormateada(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
  const year = now.getFullYear();

  return `${day}/${month}/${year}`;
}

// nueva fecha
function nuevaFecha(): string {
  const now = new Date();
  const year = now.getFullYear();
  return `${dia.value}/${mes.value}/${year}`;
};


// la base de los objetos
function objDatos(cantidad: string): interDatos {
  let datos = ref<interDatos>({
    count: cantidad,
    hour: horaFormateada(),
  });

  return datos.value;
};

// guardar nueva fecha
function guardarNuevaFecha() {
  arrDias.value[indexSave.value].fecha = nuevaFecha();
  LCS.setData("localDias", arrDias.value);

  dia.value = "";
};


// guardar index
function ftGuardandoIndex(index: number) {
  indexSave.value = index;

  let mesStr = new Date().getMonth() + 1;
  mes.value = mesStr.toString();

};

// guardar dia
function ftGuardarDia() {

  if (cantidadPasajeros.value == 0 || dineroBruto.value == 0) return

  arrDias.value.unshift({
    pasajeros: cantidadPasajeros.value,
    gastos: cantidadGastos.value,
    dinero: dineroNeto.value,
    fecha: fechaFormateada()
  });

  showAlertGuardar()

  ftResetDia();

};

// agregar movimientos
function ftAgregarMovimiento() {
  if (nuevoPasajero.value !== "") {
    console.log("add pasajeros")
    agregarPasajeros()
  }

  if (nuevoGasto.value !== "") {
    console.log("add gastos")
    agregarGastos()
  }

  showAlertAgregar()

};

// agregar pasajeros
function agregarPasajeros() {
  cantidadPasajeros.value += parseInt(nuevoPasajero.value);

  dineroBruto.value = cantidadPasajeros.value * 35;
  dineroNeto.value = dineroBruto.value - cantidadGastos.value;

  arrPasajeros.value.unshift(objDatos(nuevoPasajero.value));

  LCS.setData("localPasajeros", arrPasajeros.value);

  nuevoPasajero.value = "";
};


// agregar gastos
function agregarGastos() {
  cantidadGastos.value += parseInt(nuevoGasto.value);

  dineroNeto.value = dineroBruto.value - cantidadGastos.value;

  arrGastos.value.unshift(objDatos(nuevoGasto.value));

  LCS.setData("localGastos", arrGastos.value);

  nuevoGasto.value = "";
};

// alerta agregar
function showAlertAgregar() {

  alt_agregar.value = true
  bl_agregar.value = true

  setTimeout(() => {
    alt_agregar.value = false
    bl_agregar.value = false
  }, 3000);

};

// alerta agregar
function showAlertGuardar() {

  alt_guardar.value = true
  bl_guardar.value = true

  setTimeout(() => {
    alt_guardar.value = false
    bl_guardar.value = false
  }, 3000);

};

// reset alerta eliminar
function showAlertaEliminarPasajeros() {
  alt_eliminar.value = true
  bl_edit_pasajeros.value = true
  setTimeout(() => {
    alt_eliminar.value = false
    bl_edit_pasajeros.value = false
  }, 3000);
};

// reset alerta eliminar
function showAlertaEliminarGastos() {
  alt_eliminar.value = true
  bl_edit_pasajeros.value = true
  setTimeout(() => {
    alt_eliminar.value = false
    bl_edit_pasajeros.value = false
  }, 3000);
};

// borrar pasajeros
function ftDelPasajeros(index: number) {

  showAlertaEliminarPasajeros()

  LCS.remData(arrPasajeros.value, "localPasajeros", index);

  ftAmacenContadores()

};

//  borrar gastos
function ftDelGastos(index: number) {

  showAlertaEliminarGastos()

  LCS.remData(arrGastos.value, "localGastos", index);

  ftAmacenContadores()
};

// descargar locarstorage a txt
function descargarTXT() {
  TXT.descargar(arrDias.value)
};

</script>

<template>
  <div v-if="alt_eliminar" style="z-index: 1; "
    class="d-flex justify-content-center align-items-center position-fixed bottom-0 start-50 translate-middle-x">
    <div class="alert alert-danger" role="alert">
      Se eliminó un elemento
    </div>
  </div>

  <div v-if="alt_agregar" style="z-index: 1;"
    class="d-flex justify-content-center align-items-center position-fixed bottom-0 start-50 translate-middle-x">
    <div class="alert alert-primary" role="alert">
      Se agrego un elemento
    </div>
  </div>

  <div v-if="alt_guardar" style="z-index: 1;"
    class="d-flex justify-content-center align-items-center position-fixed bottom-0 start-50 translate-middle-x">
    <div class="alert alert-info" role="alert">
      Se ha guardado el dia
    </div>
  </div>

  <nav class="navbar navbar-expand-md navbar-dark bg-primary position-fixed w-100 top-0 start-0" style="z-index: 1;">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Ruta Diario</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop"
        aria-controls="staticBackdrop" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav ms-auto">
          <li class="nav-item text-light" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop"
            aria-controls="staticBackdrop">
            Menu
          </li>
        </ul>

      </div>
    </div>
  </nav>

  <div class="container text-center">
    <!-- Título -->
    <h1 class="my-4">Ruta Diario</h1>

    <div class="offcanvas offcanvas-start" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop"
      aria-labelledby="staticBackdropLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="staticBackdropLabel">Menu > Ruta Diario</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div>
          <ul class="list-group">
            <li class="list-group-item my-3">
              <!-- botones de menu -->
              botones de menu
              <div class="my-4">
                <button class="btn btn-primary w-100 my-3" data-bs-dismiss="offcanvas" @click="ftGuardarDia">Guardar
                  Dia</button>
                <button class="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#modalResetDia"
                  data-bs-dismiss="offcanvas" @click="ftResetDia">Reset Dia</button>
              </div>
            </li>


            <li class="list-group-item my-3">
              <!-- botones caraga y descarga -->
              Botones Carga y Descarga
              <div class="my-4">
                <button class="btn btn-dark w-100" data-bs-dismiss="offcanvas" @click="descargarTXT">Descargar
                  DB</button>
              </div>

              <div>
                <label class="my-4" for="">Buscar y Cargar DB</label>
                <input data-bs-dismiss="offcanvas" type="file" @change="readFile" accept=".txt" />
              </div>
            </li>

            <li class="list-group-item my-3 text-start">
              <p>
                <strong>Detalle: colores con gasto pre-establecidos</strong>
              </p>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-circle bg-danger rounded-circle mx-2" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                </svg>
                Control, ruta y gas
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-circle bg-warning rounded-circle mx-2" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                </svg>
                Brenda
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-circle bg-success rounded-circle mx-2" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                </svg>
                Ganancias
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- card registar datos -->
    <div class="card mb-3">

      <div class="card-header">
        Registrar Datos
      </div>

      <div class="card-body">
        <h5 class="card-title">Cantidades</h5>
        <div class="card-text">

          <!-- Input y botón para agregar pasajeros -->
          <div class="my-3 d-flex justify-content-between align-items-center">
            <label class="me-3" for="">Pasajeros</label>
            <input pattern="[0-9]*" inputmode="numeric" v-model="nuevoPasajero" class="form-control d-inline-block w-50"
              placeholder="Agregar pasajeros">
          </div>

          <!-- Input y botón para agregar gastos -->
          <div class="my-3 d-flex justify-content-between align-items-center">
            <label class="me-3" for="">Gastos</label>
            <input pattern="[0-9]*" inputmode="numeric" v-model="nuevoGasto" class="form-control d-inline-block w-50"
              placeholder="Agregar gastos">
          </div>

          <button :disabled="bl_agregar" class="btn btn-outline-primary ms-2 w-100"
            @click="ftAgregarMovimiento">Agregar</button>
        </div>
      </div>
    </div>

    <!-- Card con la información -->
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <label for="">Detalles Del Dia <span class="text-danger">{{ TM.fechaFormateada() }}</span></label>
        <div v-if="dineroBruto < 1100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-circle bg-danger rounded-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          </svg>
        </div>
        <div v-if="dineroBruto > 1101 && dineroBruto < 1600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-circle bg-warning rounded-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          </svg>
        </div>
        <div v-if="dineroBruto > 1601">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-circle bg-success rounded-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          </svg>
        </div>
      </div>
      <div class="card-body">
        <h5 class="card-title"></h5>
        <p class="card-text">
          <strong>Cantidad de Pasajeros:</strong> {{ cantidadPasajeros }} <br>
          <strong>Cantidad de Gastos:</strong><span class="text-danger"> ${{ cantidadGastos }}</span> <br>
          <strong>Dinero Bruto:</strong> ${{ dineroBruto }} <br>
          <strong>Dinero Neto:</strong> <span
            :class="{ 'text-danger': dineroNeto < 0, 'text-success': dineroNeto > 0 }">${{ dineroNeto }}</span>
        </p>
      </div>
    </div>

    <!-- Tabla de pasajeros -->
    <div v-if="arrPasajeros.length" class="card my-3">

      <div class="card-header">
        Tabla de pasajeros
      </div>
      <div class="card-body">
        <h5 class="card-title">Pasajeros</h5>
        <div class="card-text">
          <table class="table table-bordered table-striped my-3">

            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Hora</th>
                <th scope="col">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input @click="ftModeEditPasajeros()" class="form-check-input form-check-input-lg" type="checkbox"
                      role="switch" id="flexSwitchCheckDefault">
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in arrPasajeros" :key="index">
                <td>{{ arrPasajeros.length - index }}</td>
                <td>{{ item.count }}</td>
                <td>{{ item.hour }}</td>
                <td><button :disabled="!bl_edit_pasajeros" class="btn btn-danger" @click="ftDelPasajeros(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-trash3" viewBox="0 0 16 16">
                      <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Vacio Pasajeros</p>
    </div>


    <!-- Tabla de gastos -->
    <div v-if="arrGastos.length" class="card my-3">
      <div class="card-header">
        Tabla de Gastos
      </div>
      <div class="card-body">
        <h5 class="card-title">Gastos</h5>
        <div class="card-text">
          <table class="table table-bordered table-striped my-3">

            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Hora</th>
                <th scope="col">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input @click="ftModeEditGastos()" class="form-check-input form-check-input-lg" type="checkbox"
                      role="switch" id="flexSwitchCheckDefault">
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in arrGastos" :key="index">
                <td>{{ arrGastos.length - index }}</td>
                <td>{{ item.count }}</td>
                <td>{{ item.hour }}</td>
                <td><button :disabled="!bl_edit_gastos" class="btn btn-danger" @click="ftDelGastos(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-trash3" viewBox="0 0 16 16">
                      <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Vacio Gastos</p>
    </div>

    <!-- Tabla de dias -->
    <div v-if="arrDias.length" class="card my-3">
      <div class="card-header">
        Tabla de Dias
      </div>
      <div class="card-body">
        <h5 class="card-title">Dias</h5>
        <div class="card-text">
          <table class="table table-bordered table-striped my-3">

            <thead>
              <tr>
                <th scope="col">fecha</th>
                <th scope="col">c/p</th>
                <th scope="col">t/g</th>
                <th scope="col">t/d</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in arrDias" :key="index">
                <td @click="ftGuardandoIndex(index)" data-bs-toggle="modal" data-bs-target="#modalEditandoDia">
                  {{ item.fecha.slice(0, 5) }}
                </td>
                <td>{{ item.pasajeros }}</td>
                <td>{{ item.gastos > 999 ? (item.gastos / 1000).toFixed(1) + 'k' : item.gastos }}</td>
                <td>{{ item.dinero > 999 ? (item.dinero / 1000).toFixed(1) + 'k' : item.dinero }}</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>

    <!-- Modal resetdia-->
    <div class="modal fade" id="modalResetDia" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Reseteando...</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger text-center" role="alert">
              El dia a sido reseteado
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
label {
  font-weight: bold;
  min-width: 80px;
}
</style>
<script setup lang="ts">

import { onMounted, ref, type Ref } from "vue";
import { LCS } from "../src/class/lib_localstoraje";
import { TM } from "../src/class/lib_time";
import { TXT } from "./class/lib_read_save_txt";

let cantidadPasajeros = ref<number>(0);
let cantidadGastos = ref<number>(0);
let dineroBruto = ref<number>(0);
let dineroNeto = ref<number>(0);

let nuevoPasajero = ref<string>("");
let nuevoGasto = ref<string>("");

let colorAlert = ref("");

let dia = ref<string>("");
let mes = ref<string>("");

let mensajeAlerta = ref<string>("");

let bl_edit_pasajeros = ref<boolean>(false);
let bl_edit_gastos = ref<boolean>(false);
let alt_eliminar = ref<boolean>(false);
let alt_agregar = ref<boolean>(false);
let alt_guardar = ref<boolean>(false);
let alt_reset = ref<boolean>(false);
let alt_descargar = ref<boolean>(false);

interface interDatos {
  count: string;
  hour: string;
}

let arrPasajeros = ref<interDatos[]>([]);
let arrGastos = ref<interDatos[]>([]);
let arrDias = ref<any[]>([]);

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

// ft contadores
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
  colorAlert.value = "alert alert-warning text-center"
  showAlert(alt_reset, "Las tablas han sido reseteadas")

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

// guardar dia
function ftGuardarDia() {

  if (cantidadPasajeros.value == 0 || dineroBruto.value == 0) return

  arrDias.value.unshift({
    pasajeros: cantidadPasajeros.value,
    gastos: cantidadGastos.value,
    dinero: dineroNeto.value,
    fecha: fechaFormateada()
  });

  ftResetDia();
  colorAlert.value = "alert alert-success text-center"
  showAlert(alt_guardar, "Se ha guarado el dia");

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

  colorAlert.value = "alert alert-primary text-center"
  showAlert(alt_agregar, "Se ha agregado un elemento");

  bl_edit_pasajeros.value = false
  bl_edit_gastos.value = false

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

function showAlert(alertVar: Ref<boolean>, mensaje: string) {

  mensajeAlerta.value = mensaje

  alertVar.value = true;

  setTimeout(() => {
    alertVar.value = false;
    mensajeAlerta.value = ""
  }, 3000);
}

// borrar pasajeros
function ftDelPasajeros(index: number) {
  ftEliminarElemento(arrPasajeros, "localPasajeros", index)
};

// borrar gastos
function ftDelGastos(index: number) {
  ftEliminarElemento(arrGastos, "localGastos", index)
};

// borrar Elemento
function ftEliminarElemento(arr: Ref<any[]>, keylocal: string, index: number) {

  colorAlert.value = "alert alert-danger text-center"
  showAlert(alt_eliminar, "Se ha eliminado un elemento");

  LCS.remDataItem(arr.value, keylocal, index);

  ftAmacenContadores()
};

// descargar locarstorage a txt
function descargarTXT() {
  TXT.descargar(arrDias.value)
  colorAlert.value = "alert alert-success text-center"
  showAlert(alt_descargar, "La db, descargada")
};

// leer archivos de texto
function readFile(ev: Event) {
  TXT.cargar(ev).then((res) => {
    arrDias.value = JSON.parse(res)
    LCS.setData("localDias", arrDias.value)
    ftAmacenContadores()
  }).catch((error) => {
    console.error(error);
  });
}

</script>

<template>
  <div v-if="mensajeAlerta !== ''" style="z-index: 1;"
    class="d-flex justify-content-center align-items-center position-fixed bottom-0 start-50 translate-middle-x my-5">
    <div :class="colorAlert" role="alert">
      {{ mensajeAlerta }}
    </div>
  </div>

  <nav class="navbar navbar-expand-md navbar-dark bg-dark position-fixed w-100 top-0 start-0" style="z-index: 1;">
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

  <div class="container text-center my-5">
    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="staticBackdrop"
      aria-labelledby="staticBackdropLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="staticBackdropLabel">Menu > Ruta Diario</h5>
        <button type="button" class="btn-close text-bg-danger" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div>
          <ul class="list-group">
            <li class="list-group-item my-3">
              <!-- botones de menu -->
              botones de menu
              <div class="my-4">
                <button :disabled="alt_guardar" class="btn btn-light border border-2 border-primary w-100 my-3"
                  data-bs-dismiss="offcanvas" @click="ftGuardarDia">Guardar
                  Dia</button>
                <button :disabled="alt_reset" class="btn btn-light border border-2 border-primary w-100"
                  data-bs-dismiss="offcanvas" @click="ftResetDia">Reset Dia</button>
              </div>
            </li>

            <li class="list-group-item my-3">
              <!-- botones caraga y descarga -->
              Botones Carga y Descarga
              <div class="my-4">
                <button :disabled="alt_descargar" class="btn btn-light border border-2 border-primary w-100"
                  data-bs-dismiss="offcanvas" @click="descargarTXT">Descargar
                  DB</button>
              </div>

              <div class="mb-3">
                <label class="my-4 form-control" for="">Buscar y Cargar DB</label>
                <input type="file" data-bs-dismiss="offcanvas" class="form-control" @change="readFile" accept=".txt"
                  aria-label="file example" required>
              </div>
            </li>

            <li class="list-group-item my-3 text-start">
              <p>
                <strong>Detalle: colores con gasto pre-establecidos</strong>
              </p>
              <div>
                <svg width="16" height="16" fill="currentColor" class="bi bi-circle bg-danger rounded-circle mx-2"
                  viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                </svg>
                Control, ruta y gas: {{ 200 + 300 + 600 }}
              </div>
              <div>
                <svg width="16" height="16" fill="currentColor" class="bi bi-circle bg-warning rounded-circle mx-2"
                  viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                </svg>
                Brenda: 400
              </div>
              <div>
                <svg width="16" height="16" fill="currentColor" class="bi bi-circle bg-success rounded-circle mx-2"
                  viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                </svg>
                Ganancias: Infinitas
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- card registar datos -->
    <div class="card mb-3">
      <div class="card-header text-bg-dark">
        Registrar Datos
      </div>

      <div class="card-body">
        <h5 class="card-title">Cantidades</h5>
        <div class="card-text">

          <!-- Input y botón para agregar pasajeros -->
          <div class="my-3 d-flex justify-content-between align-items-center">
            <label class="me-3" for="">Pasajeros</label>
            <input pattern="[0-9]*" inputmode="numeric" v-model="nuevoPasajero" class="form-control d-inline-block w-50"
              placeholder="Pasajeros">
          </div>

          <!-- Input y botón para agregar gastos -->
          <div class="my-3 d-flex justify-content-between align-items-center">
            <label class="me-3" for="">Gastos</label>
            <input pattern="[0-9]*" inputmode="numeric" v-model="nuevoGasto" class="form-control d-inline-block w-50"
              placeholder="Gastos">
          </div>

          <button :disabled="alt_agregar" class="btn btn-success ms-2 w-100" @click="ftAgregarMovimiento">
            <svg width="25" height="25" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!-- Card con la información -->
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-around align-items-center text-bg-dark">
        <label for="">Detalles Del Dia<span class="text-bg-dark mx-3">{{ TM.fechaFormateada() }}</span></label>
        <div v-if="dineroBruto < 1100">
          <svg width="16" height="16" fill="currentColor" class="bi bi-circle bg-danger rounded-circle"
            viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          </svg>
        </div>
        <div v-if="dineroBruto > 1101 && dineroBruto < 1600">
          <svg width="16" height="16" fill="currentColor" class="bi bi-circle bg-warning rounded-circle"
            viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          </svg>
        </div>
        <div v-if="dineroBruto > 1601">
          <svg width="16" height="16" fill="currentColor" class="bi bi-circle bg-success rounded-circle"
            viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          </svg>
        </div>
      </div>
      <div class="card-body">
        <h5 class="card-title"></h5>
        <div class="card-text row">
          <div class="col-6">
            <strong>Pasajeros:</strong>
            <p>{{ cantidadPasajeros }} <br></p>
          </div>
          <div class="col-6">
            <strong>Gastos:</strong>
            <p class="text-danger"> ${{ cantidadGastos > 999 ? (cantidadGastos /
              1000).toFixed(1) + 'k' : cantidadGastos }}</p>
          </div>
          <div class="col-6">
            <strong>D/Bruto:</strong>
            <p v-if="dineroBruto >= 0">${{ (dineroBruto / 1000).toFixed(1) + 'k' }}</p>
          </div>
          <div class="col-6">
            <strong>D/Neto:</strong>
            <p v-if="dineroNeto > 0" class="text-success">${{ (dineroNeto / 1000).toFixed(1) + 'k' }}</p>
            <p v-if="dineroNeto < 0" class="text-danger">${{ (dineroNeto / 1000).toFixed(1) + 'k' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de pasajeros -->
    <div class="card my-3">

      <div class="card-header text-bg-dark">
        Tabla de pasajeros
      </div>
      <div class="card-body">
        <h5 class="card-title">Pasajeros</h5>
        <div class="card-text">
          <table v-if="arrPasajeros.length" class="table table-bordered table-striped my-3">

            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Hora</th>
                <th scope="col">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input @click="ftModeEditPasajeros()" v-model="bl_edit_pasajeros"
                      class="form-check-input form-check-input-lg" type="checkbox" role="switch"
                      id="flexSwitchCheckDefault">
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
                    <svg width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                      <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>

          </table>

          <div v-else>
            <p>Vacio</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de gastos -->
    <div class="card my-3">
      <div class="card-header text-bg-danger">
        Tabla de Gastos
      </div>
      <div class="card-body">
        <h5 class="card-title">Gastos</h5>
        <div class="card-text">
          <table v-if="arrGastos.length" class="table table-bordered table-striped my-3">

            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Hora</th>
                <th scope="col">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input @click="ftModeEditGastos()" v-model="bl_edit_gastos"
                      class="form-check-input form-check-input-lg" type="checkbox" role="switch"
                      id="flexSwitchCheckDefault">
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
                    <svg width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                      <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>

          </table>

          <div v-else>
            <p>Vacio</p>
          </div>
        </div>
      </div>
    </div>


    <!-- Tabla de dias -->
    <div v-if="arrDias.length" class="card my-3">
      <div class="card-header text-bg-dark">
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
                <th scope="col">t/g-</th>
                <th scope="col">t/d+</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in arrDias.slice(0, 30)" :key="index">
                <td>
                  {{ item.fecha.slice(0, 5) }}
                </td>
                <td>{{ item.pasajeros }}</td>
                <td>{{ (item.gastos / 1000).toFixed(1) + 'k'
                  }}</td>
                <td :class="item.dinero < 0 ? 'text-danger' : 'text-success'">{{ (item.dinero / 1000).toFixed(1) + 'k'
                  }}</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
  </div>

  <footer class="bg-dark text-light text-center py-3 mt-4">
    <div class="container">
      <p class="mb-1">Creado por Vidal Herrera &copy; <span id="year"></span></p>
      <nav>
        <p>Contactame<a href="https://wa.me/18293681379" class="text-light mx-2" target="_blank">WhatsApp</a></p>
      </nav>
    </div>
  </footer>

</template>

<style scoped>
label {
  font-weight: bold;
  min-width: 80px;
}
</style>
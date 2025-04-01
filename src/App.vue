<script setup lang="ts">

import { onMounted, ref, type Ref } from "vue";
import { LCS } from "../src/class/lib_localstoraje";
import { TM } from "../src/class/lib_time";
import { TXT } from "./class/lib_read_save_txt";

let cantidadPasajeros = ref<number>(0);
let cantidadGastos = ref<number>(0);
let dineroBruto = ref<number>(0);
let dineroNeto = ref<number>(0);
let standarGastos = ref<number>(0);
let newdia = ref<number>(1);
let newmes = ref<number>(1);

let nuevoPasajero = ref<string>("");
let nuevoGasto = ref<string>("");
let mensajeAlerta = ref<string>("");

let bl_edit_pasajeros = ref<boolean>(false);
let bl_edit_gastos = ref<boolean>(false);
let alt_active = ref<boolean>(false);

let arrPasajeros = ref<interDatos[]>([]);
let arrGastos = ref<interDatos[]>([]);
let arrDias = ref<any[]>([]);

let dataObjetoItemDia: any = null;

interface interDatos {
  count: string;
  hour: string;
}

// interructor modo editor
function ftModeEditPasajeros() {
  bl_edit_pasajeros.value = !bl_edit_pasajeros.value
}

// modo editor des/activo
function ftModeEditGastos() {
  bl_edit_gastos.value = !bl_edit_gastos.value;
}

// al iniciar la aplicación, se obtienen los datos guardados en el localstorage
onMounted(() => {
  ftAmacenContadores();
});

// ft contadores
function ftAmacenContadores() {
  arrPasajeros.value = LCS.getData("localPasajeros");
  cantidadPasajeros.value = contador("localPasajeros", arrPasajeros.value, 0);
  arrGastos.value = LCS.getData("localGastos");
  if (TM.diasSemana() == "Sabado") {
    standarGastos.value = 800
    cantidadGastos.value = contador("localGastos", arrGastos.value, 800);
  } else if (TM.diasSemana() == "Domingo") {
    standarGastos.value = 620
    cantidadGastos.value = contador("localGastos", arrGastos.value, 620);
  } else {
    standarGastos.value = 1600
    cantidadGastos.value = contador("localGastos", arrGastos.value, 1600);
  }
  arrDias.value = LCS.getData("localDias");
  dineroBruto.value = cantidadPasajeros.value * 35;
  dineroNeto.value = dineroBruto.value - cantidadGastos.value;
};

// funcion reset
function ftResetDia() {

  showAlert(alt_active, "Las tablas han sido reseteadas");
  arrPasajeros.value = [];
  arrGastos.value = [];
  LCS.setData(arrDias.value, "localDias");
  LCS.setData(arrPasajeros.value, "localPasajeros");
  LCS.setData(arrGastos.value, "localGastos");
  ftAmacenContadores();
};

// contador
function contador(key: string, arr: any[], acumulador: number) {
  arr = LCS.getData(key);
  arr.forEach((item) => {
    acumulador += parseInt(item.count);
  });
  return acumulador;
};

// la base de los objetos
function objDatos(cantidad: string): interDatos {
  let datos = ref<interDatos>({
    count: cantidad,
    hour: TM.horaFormateada()
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
    fecha: TM.fechaFormateada()
  });
  ftResetDia();
  showAlert(alt_active, "Se ha guarado el dia");
};

// agregar movimientos
function ftAgregarMovimiento() {
  if (nuevoPasajero.value !== "") agregarPasajeros();
  if (nuevoGasto.value !== "") agregarGastos();
  bl_edit_pasajeros.value = false;
  bl_edit_gastos.value = false;

};

// agregar pasajeros
function agregarPasajeros() {
  showAlert(alt_active, "Se han agregado pasajeros");
  cantidadPasajeros.value += parseInt(nuevoPasajero.value);
  dineroBruto.value = cantidadPasajeros.value * 35;
  dineroNeto.value = dineroBruto.value - cantidadGastos.value;
  LCS.addDataItem(arrPasajeros.value, "localPasajeros", objDatos(nuevoPasajero.value), true)
  nuevoPasajero.value = "";
};

// agregar gastos
function agregarGastos() {
  showAlert(alt_active, "Se ha agregado un gasto");
  cantidadGastos.value += parseInt(nuevoGasto.value);
  dineroNeto.value = dineroBruto.value - cantidadGastos.value;
  LCS.addDataItem(arrGastos.value, "localGastos", objDatos(nuevoGasto.value), true)
  nuevoGasto.value = "";
};

// mostrar alerta
function showAlert(alertVar: Ref<boolean>, mensaje: string) {
  mensajeAlerta.value = mensaje;
  alertVar.value = true;

  setTimeout(() => {
    alertVar.value = false;
    mensajeAlerta.value = "";
  }, 1500);
}

// borrar pasajeros
function ftDelPasajeros(index: number) {
  ftEliminarElemento(arrPasajeros, "localPasajeros", index);
};

// borrar gastos
function ftDelGastos(index: number) {
  ftEliminarElemento(arrGastos, "localGastos", index);
};

// borrar Elemento
function ftEliminarElemento(arr: Ref<any[]>, keylocal: string, index: number) {
  showAlert(alt_active, "Se ha eliminado un elemento");
  LCS.remDataItem(arr.value, keylocal, index);
  ftAmacenContadores();
};

// descargar locarstorage a txt
function descargarTXT() {
  TXT.descargar(arrDias.value);
  showAlert(alt_active, "La db, descargada");
};

// leer archivos de texto
function readFile(ev: Event) {
  TXT.cargar(ev).then((res) => {
    arrDias.value = JSON.parse(res)
    LCS.setData(arrDias.value, "localDias");
    ftAmacenContadores();
  }).catch((error) => console.error(error));
}

// editar fecha
function ftEditarFecha(index: number, item: any) {
  let fecha = new Date();
  newdia.value = fecha.getDate();
  newmes.value = fecha.getMonth() + 1;
  dataObjetoItemDia = item;
};

//  Guardar Fecha Editada
function ftGuardarFechaEditada() {
  const formatNumero = (num: number) => (num < 10 ? "0" + num : num);
  let dia = formatNumero(newdia.value);
  let mes = formatNumero(newmes.value);
  dataObjetoItemDia.fecha = `${dia}/${mes}`
  LCS.setData(arrDias.value, "localDias");
};

</script>
<template>
  <div v-if="mensajeAlerta !== ''" style="z-index: 1;"
    class="d-flex justify-content-center align-items-center position-fixed bottom-0 start-50 translate-middle-x my-5">
    <div class="alert alert-warning text-center" role="alert">
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

  <div class="container-flud text-center my-5">
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
                <button :disabled="alt_active" class="btn btn-light border border-2 border-primary w-100 my-3"
                  data-bs-dismiss="offcanvas" @click="ftGuardarDia">Guardar
                  Dia</button>
                <button :disabled="alt_active" class="btn btn-light border border-2 border-primary w-100"
                  data-bs-dismiss="offcanvas" @click="ftResetDia">Reset Dia</button>
              </div>
            </li>

            <li class="list-group-item my-3">
              <!-- botones caraga y descarga -->
              Botones Carga y Descarga
              <div class="my-4">
                <button :disabled="alt_active" class="btn btn-light border border-2 border-primary w-100"
                  data-bs-dismiss="offcanvas" @click="descargarTXT">Descargar
                  DB</button>
              </div>

              <div class="mb-3">
                <label class="my-4 form-control" for="">Buscar y Cargar DB</label>
                <input type="file" data-bs-dismiss="offcanvas" class="form-control" @change="readFile" accept=".txt"
                  aria-label="file example" required>
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

          <button :disabled="alt_active" class="btn btn-success ms-2 w-100" @click="ftAgregarMovimiento">
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
        <div>
          <svg width="16" height="16" fill="currentColor"
            :class="dineroBruto <= standarGastos ? 'bi bi-circle bg-danger rounded-circle' : 'bi bi-circle bg-success rounded-circle'"
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
            <p class="text-danger"> ${{ (cantidadGastos / 1000).toFixed(1) + 'k' }}</p>
          </div>
          <div class="col-6">
            <strong>D/Bruto:</strong>
            <p>${{ (dineroBruto / 1000).toFixed(1) + 'k' }}</p>
          </div>
          <div class="col-6">
            <strong>D/Neto:</strong>
            <p :class="dineroNeto > 0 ? 'text-success' : ' text-danger'">${{ (dineroNeto / 1000).toFixed(1) + 'k' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            Tabla Pasajeros
          </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <table v-if="arrPasajeros.length" class="table table-bordered table-striped">
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
                  <td><button :disabled="!bl_edit_pasajeros || alt_active" class="btn btn-danger"
                      @click="ftDelPasajeros(index)">
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
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            Tabla Gastos
          </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body"> <!-- Tabla de pasajeros -->
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
                  <td><button :disabled="!bl_edit_gastos || alt_active" class="btn btn-danger"
                      @click="ftDelGastos(index)">
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
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            Dias Guardados
          </button>
        </h2>
        <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
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
                      <tr v-for="(item, index) in arrDias" :key="index">
                        <td @click="ftEditarFecha(index, item)" data-bs-toggle="modal" data-bs-target="#ModalEditarDia">
                          {{ item.fecha.slice(0, 5) }}
                        </td>
                        <td>{{ item.pasajeros }}</td>
                        <td>{{ (item.gastos / 1000).toFixed(1) + 'k'
                        }}</td>
                        <td :class="item.dinero < 0 ? 'text-danger' : 'text-success'">{{ (item.dinero / 1000).toFixed(1)
                          + 'k'
                        }}</td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Modal -->
  <div class="modal fade" id="ModalEditarDia" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Editar Fecha</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center text-center">
          <div class="mb-3">
            <label class="form-label">Dia</label>
            <input v-model="newdia" type="number" min="1" max="31" class="form-control text-center" placeholder="Dia">
          </div>
          <div class="mb-3">
            <label class="form-label">Mes</label>
            <input v-model="newmes" type="number" min="1" max="12" class="form-control text-center" placeholder="Mes">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="ftGuardarFechaEditada" data-bs-dismiss="modal">Save
            changes</button>
        </div>
      </div>
    </div>
  </div>

  <footer class="text-bg-dark text-center py-3 mt-4">
    <div class="container">
      <p class="mb-1">Created by Vidal Herrera &copy;</p>
      <nav>
        <p>Contactame<a href="https://wa.me/18293681379" class="mx-2" target="_blank">WhatsApp</a></p>
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
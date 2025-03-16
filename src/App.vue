<script setup lang="ts">

import { onMounted, ref } from "vue";
import { LCS } from "../src/class/lib_localstoraje";

let indexSave = ref<number>(-1);

let cantidadPasajeros = ref<number>(0);
let cantidadGastos = ref<number>(0);
let dineroBruto = ref<number>(0);
let dineroNeto = ref<number>(0);

let nuevoPasajero = ref<string>("");
let nuevoGasto = ref<string>("");

let dia = ref<string>("");
let mes = ref<string>("");

interface interDatos {
  count: string;
  hour: string;
}

let arrDatosPasajeros = ref<interDatos[]>([]);
let arrDatosGastos = ref<interDatos[]>([]);
let arrDatosDias = ref<any[]>([]);

// al iniciar la aplicación, se obtienen los datos guardados en el localstorage
onMounted(() => {
  try {
    arrDatosPasajeros.value = LCS.getData("localPasajeros");
    cantidadPasajeros.value = contador("localPasajeros", arrDatosPasajeros.value);

    arrDatosGastos.value = LCS.getData("localGastos");
    cantidadGastos.value = contador("localGastos", arrDatosGastos.value);

    arrDatosDias.value = LCS.getData("localDias");


    dineroBruto.value = cantidadPasajeros.value * 35;
    dineroNeto.value = dineroBruto.value - cantidadGastos.value;

  } catch (error) {
    console.error("Error al obtener datos del localStorage:", error);
    arrDatosPasajeros.value = [];
  }
});

// contador
function contador(key: string, arr: any[]) {
  arr = LCS.getData(key);
  let r = 0

  arr.forEach((item) => {
    r += parseInt(item.count);
  });

  return r;
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
  arrDatosDias.value[indexSave.value].fecha = nuevaFecha();
  LCS.setData("localDias", arrDatosDias.value);

  dia.value = "";
};

function ftGuardandoIndex(index: number) {
  indexSave.value = index;

  let mesStr = new Date().getMonth() + 1;
  mes.value = mesStr.toString();

};

function ftResetDia() {
  cantidadPasajeros.value = 0;
  cantidadGastos.value = 0;
  dineroBruto.value = 0;
  dineroNeto.value = 0;

  arrDatosPasajeros.value = [];
  arrDatosGastos.value = [];
};


// guardar dia
function ftGuardarDia() {
  arrDatosDias.value.unshift({
    pasajeros: cantidadPasajeros.value,
    gastos: cantidadGastos.value,
    dinero: dineroNeto.value,
    fecha: fechaFormateada()
  });

  LCS.setData("localDias", arrDatosDias.value);

  ftResetDia();

};

function agregarPasajeros() {
  cantidadPasajeros.value += parseInt(nuevoPasajero.value);

  dineroBruto.value = cantidadPasajeros.value * 35;
  dineroNeto.value = dineroBruto.value - cantidadGastos.value;

  arrDatosPasajeros.value.unshift(objDatos(nuevoPasajero.value));

  LCS.setData("localPasajeros", arrDatosPasajeros.value);

  nuevoPasajero.value = "";
};

function agregarGastos() {
  cantidadGastos.value += parseInt(nuevoGasto.value);

  dineroNeto.value = dineroBruto.value - cantidadGastos.value;

  arrDatosGastos.value.unshift(objDatos(nuevoGasto.value));

  LCS.setData("localGastos", arrDatosGastos.value);

  nuevoGasto.value = "";
};

function ftDelPasajeros(index: number) {
  LCS.remData(arrDatosPasajeros.value, "localPasajeros", index);
};

function ftDelGastos(index: number) {
  LCS.remData(arrDatosGastos.value, "localGastos", index);
};

</script>

<template>

  <div class="container">
    <!-- Título -->
    <h1 class="my-4">Ruta Diario</h1>

    <!-- Card con la información -->
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <label for="">Como va tu dia</label>
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
          <strong>Cantidad de Pasajeros:</strong> ${{ cantidadPasajeros }} <br>
          <strong>Cantidad de Gastos:</strong> ${{ cantidadGastos }} <br>
          <strong>Dinero Bruto:</strong> ${{ dineroBruto }} <br>
          <strong>Dinero Neto:</strong> ${{ dineroNeto }}
        </p>
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
            <input v-model="nuevoPasajero" class="form-control d-inline-block w-50" placeholder="Agregar pasajeros">
            <button class="btn btn-primary ms-2" @click="agregarPasajeros">Agregar</button>
          </div>

          <!-- Input y botón para agregar gastos -->
          <div class="my-3 d-flex justify-content-between align-items-center">
            <label class="me-3" for="">Gastos</label>
            <input v-model="nuevoGasto" class="form-control d-inline-block w-50" placeholder="Agregar gastos">
            <button class="btn btn-primary ms-2" @click="agregarGastos">Agregar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="accordion accordion-flush text-center" id="accordionFlushExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed text-primary" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            Menu
          </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <button class="btn btn-primary w-100 my-2" data-bs-toggle="modal" data-bs-target="#modalGuardandoDia"
              @click="ftGuardarDia">Guardar Dia</button>
            <button class="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#modalResetDia"
              @click="ftResetDia">Reset Dia</button>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            Tabla Pasajeros
          </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <div v-if="arrDatosPasajeros.length" class="card">
              <div class="card-header">
                Tabla de pasajeros
              </div>
              <div class="card-body">
                <h5 class="card-title">pasajeros</h5>
                <div class="card-text">
                  <!-- Tabla de pasajeros -->
                  <table class="table table-bordered table-striped my-3">

                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Del</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(item, index) in arrDatosPasajeros" :key="index">
                        <td>{{ arrDatosPasajeros.length - index }}</td>
                        <td>{{ item.count }}</td>
                        <td>{{ item.hour }}</td>
                        <td><button class="btn btn-danger" @click="ftDelPasajeros(index)">X</button>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-center">Vacio</p>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            Tabla de Gastos
          </button>
        </h2>
        <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <div v-if="arrDatosGastos.length" class="card mb-3">
              <div class="card-header">
                Tabla de Gastos
              </div>
              <div class="card-body">
                <h5 class="card-title">Gastos</h5>
                <div class="card-text">
                  <!-- Tabla de gastos -->
                  <table class="table table-bordered table-striped my-3">

                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Del</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(item, index) in arrDatosGastos" :key="index">
                        <td>{{ arrDatosGastos.length - index }}</td>
                        <td>{{ item.count }}</td>
                        <td>{{ item.hour }}</td>
                        <td><button class="btn btn-danger" @click="ftDelGastos(index)">X</button>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-n4"
            aria-expanded="false" aria-controls="flush-n4">
            Tabla Dias
          </button>
        </h2>
        <div id="flush-n4" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <div v-if="arrDatosDias.length" class="card mb-3">
              <div class="card-header">
                Tabla de Dias
              </div>
              <div class="card-body">
                <h5 class="card-title">Dias</h5>
                <div class="card-text">
                  <!-- Tabla de gastos -->
                  <table class="table table-bordered table-striped my-3">

                    <thead>
                      <tr>
                        <th scope="col">fecha</th>
                        <th scope="col">Pasajeros</th>
                        <th scope="col">Gastos</th>
                        <th scope="col">Dinero</th>

                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(item, index) in arrDatosDias" :key="index">
                        <td @click="ftGuardandoIndex(index)" data-bs-toggle="modal" data-bs-target="#modalEditandoDia">
                          {{
                            item.fecha }}</td>
                        <td>{{ item.pasajeros }}</td>
                        <td>{{ item.gastos }}</td>
                        <td>{{ item.dinero }}</td>
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

    <!-- Modal Dia guardado-->
    <div class="modal fade" id="modalGuardandoDia" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Guardando... Dia</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info text-center" role="alert">
              El dia a sido guardado
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal resetdia-->
  <div class="modal fade" id="modalResetDia" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Guardando... Dia</h1>
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

  <!-- Modal Editando Dia -->
  <div class="modal fade" id="modalEditandoDia" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Guardando...</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

          <h5 v-if="arrDatosDias[indexSave]">Dia a editar <span class="text-danger">{{ arrDatosDias[indexSave].fecha
          }}</span></h5>

          <div class="d-flex justify-content-center align-items-center">
            <label class="form-label w-25 me-2">dia
              <input v-model="dia" type="text" class="form-control" placeholder="dia">
            </label>

            <label class="form-label w-25 me-2">mes
              <input v-model="mes" type="text" class="form-control" placeholder="mes">
            </label>
          </div>

        </div>
        <div class="modal-footer ">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" @click="guardarNuevaFecha" data-bs-dismiss="modal"
            class="btn btn-primary">Guardar</button>
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
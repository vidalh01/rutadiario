<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from "vue";

const usuario = ref("");
const password = ref("");
const mensaje = ref("");

function login() {
    if (usuario.value === "admin" && password.value === "admin") {
        mensaje.value = "Bienvenido";
    } else {
        mensaje.value = "Usuario o contraseña incorrectos";
    }
};

</script>

<template>
    <div class="container mt-5">
        <div class="card p-4 shadow">
            <h2 class="text-center">Login</h2>

            <div class="mb-3">
                <label class="form-label">Usuario</label>
                <input v-model="usuario" type="text" class="form-control" placeholder="Ingrese usuario">
            </div>

            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input v-model="password" type="password" class="form-control" placeholder="Ingrese contraseña">
            </div>

            <div class="d-grid">
                <button class="btn btn-primary" @click="login">Iniciar sesión</button>
            </div>

            <p v-if="mensaje" class="mt-3 text-danger">{{ mensaje }}</p>
        </div>
    </div>
</template>

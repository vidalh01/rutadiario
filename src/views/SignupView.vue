<template>
    <div class="container mt-5">
        <div class="card p-4 shadow">
            <h2 class="text-center">Crear Cuenta</h2>

            <div class="mb-3">
                <label class="form-label">Usuario</label>
                <input v-model="usuario" type="text" class="form-control" placeholder="Ingrese usuario">
            </div>

            <div class="mb-3">
                <label class="form-label">Correo Electrónico</label>
                <input v-model="correo" type="email" class="form-control" placeholder="Ingrese correo">
            </div>

            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input v-model="password" type="password" class="form-control" placeholder="Ingrese contraseña">
            </div>

            <div class="mb-3">
                <label class="form-label">Confirmar Contraseña</label>
                <input v-model="confirmarPassword" type="password" class="form-control"
                    placeholder="Confirme su contraseña">
            </div>

            <div class="d-grid">
                <button class="btn btn-success" @click="signup">Registrar</button>
            </div>

            <p v-if="mensaje" class="mt-3" :class="mensajeClass">{{ mensaje }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const usuario = ref('');
const correo = ref('');
const password = ref('');
const confirmarPassword = ref('');
const mensaje = ref('');
const mensajeClass = ref('');

function signup() {
    if (!usuario.value || !correo.value || !password.value || !confirmarPassword.value) {
        mensaje.value = 'Por favor complete todos los campos';
        mensajeClass.value = 'text-danger';
        return;
    }

    if (password.value !== confirmarPassword.value) {
        mensaje.value = 'Las contraseñas no coinciden';
        mensajeClass.value = 'text-danger';
        return;
    }

    mensaje.value = 'Cuenta creada exitosamente';
    mensajeClass.value = 'text-success';
};
</script>

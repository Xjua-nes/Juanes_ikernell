    package com.example.lab.Models;

    import jakarta.persistence.*;
    import java.time.LocalDateTime;

    @Entity
    @Table(name = "trabajadores")
    public class Trabajador {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idTrabajador;

        private String nombre;
        private String apellido;
        private String identificacion;
        private String email;
        private String profesion;
        private String direccion;
        private String especialidad;
        private String contrasena; // Esta contraseña debe ser hasheada
        private Boolean activo;

        @Column(name = "fecha_registro")
        private LocalDateTime fechaRegistro;

        // Nuevos campos para el restablecimiento de contraseña - ¡Estos se persistirán en la DB!
        @Column(name = "reset_token")
        private String resetToken;

        @Column(name = "reset_token_expiry_date")
        private LocalDateTime resetTokenExpiryDate;

        @ManyToOne
        @JoinColumn(name = "id_rol", nullable = false)
        private Rol rol;

        public Trabajador() {
            this.fechaRegistro = LocalDateTime.now();
            this.activo = true;
        }

        // --- GETTERS Y SETTERS ---
        public Long getIdTrabajador() {
            return idTrabajador;
        }

        public void setIdTrabajador(Long idTrabajador) {
            this.idTrabajador = idTrabajador;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getApellido() {
            return apellido;
        }

        public void setApellido(String apellido) {
            this.apellido = apellido;
        }

        public String getIdentificacion() {
            return identificacion;
        }

        public void setIdentificacion(String identificacion) {
            this.identificacion = identificacion;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getProfesion() {
            return profesion;
        }

        public void setProfesion(String profesion) {
            this.profesion = profesion;
        }

        public String getDireccion() {
            return direccion;
        }

        public void setDireccion(String direccion) {
            this.direccion = direccion;
        }

        public String getEspecialidad() {
            return especialidad;
        }

        public void setEspecialidad(String especialidad) {
            this.especialidad = especialidad;
        }

        public String getContrasena() {
            return contrasena;
        }

        public void setContrasena(String contrasena) {
            this.contrasena = contrasena;
        }

        public Boolean getActivo() {
            return activo;
        }

        public void setActivo(Boolean activo) {
            this.activo = activo;
        }

        public LocalDateTime getFechaRegistro() {
            return fechaRegistro;
        }

        public void setFechaRegistro(LocalDateTime fechaRegistro) {
            this.fechaRegistro = fechaRegistro;
        }

        public Rol getRol() {
            return rol;
        }

        public void setRol(Rol rol) {
            this.rol = rol;
        }

        // Getters y Setters para los nuevos campos de restablecimiento
        public String getResetToken() {
            return resetToken;
        }

        public void setResetToken(String resetToken) {
            this.resetToken = resetToken;
        }

        public LocalDateTime getResetTokenExpiryDate() {
            return resetTokenExpiryDate;
        }

        public void setResetTokenExpiryDate(LocalDateTime resetTokenExpiryDate) {
            this.resetTokenExpiryDate = resetTokenExpiryDate;
        }
    }

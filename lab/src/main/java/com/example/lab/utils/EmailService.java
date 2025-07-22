package com.example.lab.utils;

import com.example.lab.Models.Trabajador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper; // Importa MimeMessageHelper
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException; // Importa MessagingException
import jakarta.mail.internet.MimeMessage; // Importa MimeMessage
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envía un correo electrónico de bienvenida a un trabajador recién registrado,
     * incluyendo la contraseña en texto plano y un enlace de restablecimiento temporal (persistente).
     * El contenido del correo será en formato HTML con estilos inline para compatibilidad.
     *
     * ¡¡ADVERTENCIA DE SEGURIDAD CRÍTICA!!
     * Enviar contraseñas en texto plano por correo electrónico es una práctica MUY INSEGURA.
     * Si el correo es interceptado o la cuenta de correo del usuario se ve comprometida,
     * la contraseña quedará expuesta.
     *
     * Este método se ejecuta de forma asíncrona para no bloquear el hilo principal de la aplicación.
     *
     * @param trabajador El objeto Trabajador (contiene email, nombre, apellido, rol, y el token/fecha de expiración persistente).
     * @param plainPassword La contraseña en texto plano que se mostrará en el correo.
     */
    @Async
    public void sendRegistrationEmail(Trabajador trabajador, String plainPassword) {
        // Crea un nuevo MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            // Usa MimeMessageHelper para facilitar la creación del correo HTML
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8"); // 'true' para multipart (si incluyes adjuntos o imágenes embebidas)

            helper.setTo(trabajador.getEmail());
            helper.setSubject("¡Bienvenido a la plataforma, " + trabajador.getNombre() + "!");

            // Formatear la fecha de expiración para el correo
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String expiryFormatted = trabajador.getResetTokenExpiryDate().format(formatter);

            // Construye el enlace de restablecimiento de contraseña usando el token persistente
            String resetLink = frontendUrl + "/password?token=" + trabajador.getResetToken();

            // --- Contenido HTML del correo con estilos inline mejorados ---
            String htmlContent = String.format("""
                <div style="font-family: 'Inter', sans-serif; background-color: #f8f9fa; padding: 20px; border-radius: 10px; max-width: 600px; margin: 20px auto; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15); border: 1px solid #dee2e6;">
                    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e9ecef; margin-bottom: 20px;">
                        <h1 style="color: #343a40; margin: 0; font-size: 32px; font-weight: 600;">¡Bienvenido a nuestra plataforma!</h1>
                    </div>
                    <div style="padding: 0 20px;">
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            Hola <strong style="color: #007bff;">%s %s</strong>,
                        </p>
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            Tu cuenta ha sido registrada exitosamente con el siguiente email: 
                            <strong style="color: #007bff;">%s</strong>
                        </p>
                        <p style="color: #dc3545; font-size: 16px; font-weight: bold; line-height: 1.6; padding: 10px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
                            ¡¡ADVERTENCIA DE SEGURIDAD!! Por favor, cambia esta contraseña lo antes posible.
                        </p>
                        <p style="color: #343a40; font-size: 18px; font-weight: bold; line-height: 1.6;">
                            Tu contraseña para iniciar sesión es: <span style="color: #007bff;">%s</span>
                        </p>
                        %s
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            Puedes iniciar sesión utilizando tu email y la contraseña proporcionada.
                        </p>
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            También puedes restablecer tu contraseña en cualquier momento haciendo clic en el siguiente botón:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" style="background-color: #007bff; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="color: #6c757d; font-size: 14px; line-height: 1.5;">
                            Este enlace es válido hasta: <strong style="color: #343a40;">%s</strong> (expira en 24 horas).
                        </p>
                        <p style="color: #6c757d; font-size: 14px; line-height: 1.5;">
                            Si no solicitaste esto, por favor ignora este correo.
                        </p>
                    </div>
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef; margin-top: 20px; color: #6c757d; font-size: 14px;">
                        <p>¡Gracias por unirte a nuestro equipo!</p>
                        <p>Atentamente,<br/>El Equipo de [Nombre de tu Empresa/Plataforma]</p>
                    </div>
                </div>
                """,
                    trabajador.getNombre(), trabajador.getApellido(),
                    trabajador.getEmail(),
                    plainPassword, // Contraseña en texto plano
                    (trabajador.getRol() != null && trabajador.getRol().getNombre() != null) ?
                            String.format("<p style=\"color: #495057; font-size: 16px; line-height: 1.6;\">Rol asignado: <strong style=\"color: #007bff;\">%s</strong></p>", trabajador.getRol().getNombre()) :
                            "<p style=\"color: #495057; font-size: 16px; line-height: 1.6;\">Rol asignado: No especificado</p>",
                    resetLink,
                    expiryFormatted
            );

            helper.setText(htmlContent, true); // 'true' indica que el contenido es HTML

            mailSender.send(mimeMessage);
            System.out.println("Correo de registro HTML (con contraseña y enlace) enviado a: " + trabajador.getEmail());
        } catch (MessagingException | MailException e) {
            System.err.println("Error al enviar el correo de registro HTML a " + trabajador.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }


    @Async
    public void sendPasswordResetLink(Trabajador trabajador) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(trabajador.getEmail());
            helper.setSubject("Restablece tu contraseña para la plataforma");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String expiryFormatted = trabajador.getResetTokenExpiryDate().format(formatter);

            String resetLink = frontendUrl + "/password?token=" + trabajador.getResetToken();

            // --- Contenido HTML del correo de restablecimiento con estilos inline mejorados ---
            String htmlContent = String.format("""
                <div style="font-family: 'Inter', sans-serif; background-color: #f8f9fa; padding: 20px; border-radius: 10px; max-width: 600px; margin: 20px auto; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15); border: 1px solid #dee2e6;">
                    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e9ecef; margin-bottom: 20px;">
                        <h1 style="color: #343a40; margin: 0; font-size: 32px; font-weight: 600;">Solicitud de Restablecimiento de Contraseña</h1>
                    </div>
                    <div style="padding: 0 20px;">
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            Hola <strong style="color: #007bff;">%s %s</strong>,
                        </p>
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                        </p>
                        <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                            Para restablecer tu contraseña, por favor haz clic en el siguiente botón:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" style="background-color: #007bff; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="color: #6c757d; font-size: 14px; line-height: 1.5;">
                            Este enlace es válido hasta: <strong style="color: #343a40;">%s</strong> (expira en 24 horas).
                        </p>
                        <p style="color: #6c757d; font-size: 14px; line-height: 1.5;">
                            Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo.
                        </p>
                    </div>
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef; margin-top: 20px; color: #6c757d; font-size: 14px;">
                        <p>Atentamente,<br/>El Equipo de Ikernell</p>
                    </div>
                </div>
                """,
                    trabajador.getNombre(), trabajador.getApellido(),
                    resetLink,
                    expiryFormatted
            );

            helper.setText(htmlContent, true); // 'true' indica que el contenido es HTML

            mailSender.send(mimeMessage);
            System.out.println("Correo de restablecimiento de contraseña HTML enviado a: " + trabajador.getEmail());
        } catch (MessagingException | MailException e) {
            System.err.println("Error al enviar el correo de restablecimiento de contraseña HTML a " + trabajador.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}

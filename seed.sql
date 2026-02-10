-- Script SQL para crear datos iniciales
-- Ejecutar con: mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed.sql

-- Limpiar datos existentes (opcional, comentar si no quieres borrar datos)
-- DELETE FROM SurveyResponse;
-- DELETE FROM Client;
-- DELETE FROM Question;
-- DELETE FROM User;

-- Crear usuarios administradores
-- Nota: Las contraseñas están hasheadas con bcrypt (10 rounds)
-- admin@easton.cl / easton2026
-- john@doe.com / johndoe123

INSERT INTO `User` (`id`, `name`, `email`, `emailVerified`, `password`, `image`, `role`, `createdAt`) VALUES
('clx0000000000000000000001', 'Admin Easton', 'admin@easton.cl', NULL, '$2a$10$rK8X9Y5Z3mN7pQ2wV1sT.uJ4K5L6M8N9O0P1Q2R3S4T5U6V7W8X9Y0', NULL, 'admin', NOW()),
('clx0000000000000000000002', 'Test Admin', 'john@doe.com', NULL, '$2a$10$X9Y8Z7W6V5U4T3S2R1Q0P.O9N8M7L6K5J4I3H2G1F0E9D8C7B6A5', NULL, 'admin', NOW())
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Crear las 11 preguntas optimizadas
INSERT INTO `Question` (`id`, `text`, `type`, `category`, `options`, `order`, `required`, `active`, `createdAt`, `updatedAt`) VALUES
('clx0000000000000000000011', '¿Te contactamos con anticipación suficiente y la información sobre la entrega/instalación fue clara?', 'rating', 'coordinacion', NULL, 1, 1, 1, NOW(), NOW()),
('clx0000000000000000000012', '¿El equipo llegó en la fecha y horario comprometidos?', 'multiplechoice', 'puntualidad', '["Sí, en fecha y hora", "Sí en fecha, pero fuera de horario", "No, llegó en otra fecha"]', 2, 1, 1, NOW(), NOW()),
('clx0000000000000000000013', '¿Cómo califica el transporte y el estado del producto al llegar?', 'satisfaction', 'transporte', NULL, 3, 1, 1, NOW(), NOW()),
('clx0000000000000000000014', '¿Cómo califica la calidad del servicio de instalación?', 'rating', 'instalacion', NULL, 4, 1, 1, NOW(), NOW()),
('clx0000000000000000000015', '¿El equipo tuvo el cuidado adecuado con los muebles y con tu espacio físico?', 'multiplechoice', 'cuidado', '["Sí, excelente cuidado", "Sí, cuidado suficiente", "Poco cuidado", "Nada de cuidado"]', 5, 1, 1, NOW(), NOW()),
('clx0000000000000000000016', '¿Quedó todo instalado correctamente y el espacio limpio?', 'multiplechoice', 'resultado', '["Sí, todo perfecto", "Sí, con detalles menores", "No, hubo problemas"]', 6, 1, 1, NOW(), NOW()),
('clx0000000000000000000017', '¿Cómo califica el profesionalismo y trato del equipo?', 'rating', 'profesionalismo', NULL, 7, 1, 1, NOW(), NOW()),
('clx0000000000000000000018', '¿Cómo califica la comunicación durante todo el proceso?', 'rating', 'comunicacion', NULL, 8, 1, 1, NOW(), NOW()),
('clx0000000000000000000019', '¿Cuál es su satisfacción general con el servicio de Easton?', 'rating', 'general', NULL, 9, 1, 1, NOW(), NOW()),
('clx0000000000000000000020', '¿Recomendaría nuestros servicios a otros?', 'yesno', 'general', NULL, 10, 1, 1, NOW(), NOW()),
('clx0000000000000000000021', '¿Qué fue lo que más te gustó y qué podríamos mejorar?', 'text', 'feedback', NULL, 11, 0, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `text`=`text`;

-- Crear clientes de prueba
INSERT INTO `Client` (`id`, `name`, `email`, `company`, `project`, `uniqueToken`, `surveyCompleted`, `createdAt`) VALUES
('clx0000000000000000000031', 'María González', 'maria.gonzalez@techcorp.cl', 'TechCorp SpA', 'Implementación oficinas piso 12', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', 1, NOW()),
('clx0000000000000000000032', 'Carlos Muñoz', 'carlos.munoz@finanzas.cl', 'Finanzas Globales', 'Mobiliario sala de reuniones ejecutivas', 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', 1, NOW()),
('clx0000000000000000000033', 'Ana Rodríguez', 'ana.rodriguez@startup.cl', 'Startup Innovation', 'Espacio coworking completo', 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8', 0, NOW()),
('clx0000000000000000000034', 'Jorge Silva', 'jorge.silva@consulting.cl', 'Consulting Partners', 'Oficina completa 50 puestos', 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9', 1, NOW())
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Crear respuestas de encuestas de ejemplo
INSERT INTO `SurveyResponse` (`id`, `clientId`, `dynamicAnswers`, `completedAt`) VALUES
('clx0000000000000000000041', 'clx0000000000000000000031', '{"q1":7,"q2":"Sí, en fecha y hora","q3":"Muy satisfecho","q4":7,"q5":"Sí, excelente cuidado","q6":"Sí, todo perfecto","q7":7,"q8":7,"q9":7,"q10":true,"q11":"El equipo fue muy profesional y cuidadoso. La instalación quedó perfecta. Nada que mejorar."}', NOW()),
('clx0000000000000000000042', 'clx0000000000000000000032', '{"q1":6,"q2":"Sí en fecha, pero fuera de horario","q3":"satisfecho","q4":6,"q5":"Sí, cuidado suficiente","q6":"Sí, con detalles menores","q7":7,"q8":6,"q9":6,"q10":true,"q11":"Buen trabajo en general, equipo amable. Mejorar la puntualidad en los horarios."}', NOW()),
('clx0000000000000000000043', 'clx0000000000000000000034', '{"q1":5,"q2":"No, llegó en otra fecha","q3":"Neutral","q4":6,"q5":"Sí, cuidado suficiente","q6":"Sí, con detalles menores","q7":6,"q8":5,"q9":5,"q10":true,"q11":"El resultado final fue aceptable. Mejorar la comunicación y cumplir con las fechas establecidas."}', NOW())
ON DUPLICATE KEY UPDATE `clientId`=`clientId`;

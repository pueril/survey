-- Script SQL completo para crear datos iniciales con UTF-8 correcto
-- Ejecutar con: mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data-completo.sql

-- Configurar charset UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Crear usuarios administradores
-- Las contraseñas están hasheadas con bcrypt (10 rounds)
INSERT INTO `User` (`id`, `name`, `email`, `emailVerified`, `password`, `image`, `role`, `createdAt`) VALUES
('clx0000000000000000000001', 'Admin Easton', 'admin@easton.cl', NULL, '$2a$10$f0TDSfWvGNXDAYcKl4xBAOp5NCSd3jGU3zA4.6W5eVe2SN1WZg1Pi', NULL, 'admin', NOW()),
('clx0000000000000000000002', 'Test Admin', 'john@doe.com', NULL, '$2a$10$4pRqwdN0RcoPqXil5xaIuepR1DI3vI1yxfjkHJWi59BN81oszxd5e', NULL, 'admin', NOW())
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

SELECT 'Datos iniciales creados exitosamente' AS resultado;

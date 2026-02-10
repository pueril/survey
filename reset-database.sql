-- Script para limpiar/resetear la base de datos
-- Ejecutar con: mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < reset-database.sql

-- Desactivar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar todos los datos de las tablas (en orden para respetar foreign keys)
DELETE FROM SurveyResponse;
DELETE FROM Client;
DELETE FROM Question;
DELETE FROM Account;
DELETE FROM Session;
DELETE FROM User;
DELETE FROM VerificationToken;

-- Reactivar verificación de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Opcional: Resetear auto-increment si hay tablas con ID numérico
-- (En este caso todas usan cuid(), así que no es necesario)

SELECT 'Base de datos limpiada exitosamente' AS resultado;

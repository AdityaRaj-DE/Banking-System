-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: banking_system
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `account_type` enum('savings','current') NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('active','blocked','closed') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  KEY `idx_account_customer` (`customer_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `accounts_chk_1` CHECK ((`balance` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,1,'savings',19179.00,'active','2026-04-28 02:10:09'),(2,1,'savings',800.00,'active','2026-04-28 16:15:43'),(3,2,'savings',8900.00,'active','2026-04-28 16:27:25'),(4,2,'savings',123222.00,'active','2026-04-28 16:36:57'),(5,1,'savings',4.00,'active','2026-04-28 16:53:59'),(6,1,'savings',0.00,'active','2026-04-28 19:14:34'),(7,3,'savings',9687.45,'active','2026-04-29 03:42:45'),(8,3,'current',26617.85,'active','2026-04-29 03:42:45'),(9,4,'savings',52318.47,'active','2026-04-29 03:42:45'),(10,5,'savings',33979.32,'active','2026-04-29 03:42:45'),(11,6,'savings',59145.30,'active','2026-04-29 03:42:45'),(12,7,'savings',35486.81,'active','2026-04-29 03:42:45'),(13,7,'current',13187.81,'active','2026-04-29 03:42:45'),(14,8,'savings',23562.62,'active','2026-04-29 03:42:45'),(15,8,'current',55548.59,'active','2026-04-29 03:42:45'),(16,9,'savings',23110.11,'active','2026-04-29 03:42:45'),(17,9,'current',43040.86,'active','2026-04-29 03:42:45'),(18,10,'savings',21025.29,'active','2026-04-29 03:42:45'),(19,11,'savings',57537.62,'active','2026-04-29 03:42:45'),(20,11,'current',1536.52,'active','2026-04-29 03:42:45'),(21,12,'savings',8719.38,'active','2026-04-29 03:42:45'),(22,13,'savings',14728.90,'active','2026-04-29 03:42:45'),(23,13,'current',10327.12,'active','2026-04-29 03:42:45'),(24,14,'savings',7218.86,'active','2026-04-29 03:42:45'),(25,15,'savings',9352.28,'active','2026-04-29 03:42:45'),(26,16,'savings',23906.38,'active','2026-04-29 03:42:45'),(27,16,'current',37097.61,'active','2026-04-29 03:42:45'),(28,17,'savings',20970.62,'active','2026-04-29 03:42:45'),(29,17,'current',12705.18,'active','2026-04-29 03:42:46'),(30,18,'savings',8989.50,'active','2026-04-29 03:42:46'),(31,18,'current',8022.58,'active','2026-04-29 03:42:46'),(32,19,'savings',37029.74,'active','2026-04-29 03:42:46'),(33,20,'savings',43711.20,'active','2026-04-29 03:42:46'),(34,21,'savings',28808.94,'active','2026-04-29 03:42:46'),(35,22,'savings',13929.48,'active','2026-04-29 03:42:46'),(36,23,'savings',12181.46,'active','2026-04-29 03:45:43'),(37,24,'savings',12879.88,'active','2026-04-29 03:45:43'),(38,25,'savings',18784.31,'active','2026-04-29 03:45:43'),(39,25,'current',11520.66,'active','2026-04-29 03:45:43'),(40,26,'savings',49866.51,'active','2026-04-29 03:45:43'),(41,27,'savings',29835.79,'active','2026-04-29 03:45:43'),(42,28,'savings',19483.78,'active','2026-04-29 03:45:43'),(43,29,'savings',26910.98,'active','2026-04-29 03:45:43'),(44,30,'savings',55659.97,'active','2026-04-29 03:45:43'),(45,31,'savings',21347.92,'active','2026-04-29 03:45:43'),(46,31,'current',72659.08,'active','2026-04-29 03:45:43'),(47,32,'savings',43103.60,'active','2026-04-29 03:45:43'),(48,33,'savings',4685.34,'active','2026-04-29 03:45:43'),(49,33,'current',8373.93,'active','2026-04-29 03:45:43'),(50,34,'savings',37157.54,'active','2026-04-29 03:45:43'),(51,34,'current',6569.19,'active','2026-04-29 03:45:43'),(52,35,'savings',35966.04,'active','2026-04-29 03:45:44'),(53,36,'savings',20003.18,'active','2026-04-29 03:45:44'),(54,37,'savings',48117.80,'active','2026-04-29 03:45:44'),(55,37,'current',63203.42,'active','2026-04-29 03:45:44'),(56,38,'savings',26430.66,'active','2026-04-29 03:45:44'),(57,38,'current',14000.99,'active','2026-04-29 03:45:44'),(58,39,'savings',27515.81,'active','2026-04-29 03:45:44'),(59,40,'savings',6924.94,'active','2026-04-29 03:45:44'),(60,41,'savings',17833.44,'active','2026-04-29 03:45:44'),(61,41,'current',19040.23,'active','2026-04-29 03:45:44'),(62,42,'savings',16546.28,'active','2026-04-29 03:45:44');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_account_insert` AFTER INSERT ON `accounts` FOR EACH ROW BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'accounts', NEW.customer_id);
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `action` varchar(50) DEFAULT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `performed_by` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=276 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'INSERT','transactions',NULL,'2026-04-28 02:47:30'),(2,'INSERT','transactions',1,'2026-04-28 16:08:06'),(3,'INSERT','transactions',NULL,'2026-04-28 16:16:10'),(4,'INSERT','transactions',NULL,'2026-04-28 16:16:32'),(5,'INSERT','transactions',NULL,'2026-04-28 16:23:18'),(6,'INSERT','transactions',NULL,'2026-04-28 16:23:35'),(7,'INSERT','transactions',NULL,'2026-04-28 16:27:41'),(8,'INSERT','transactions',NULL,'2026-04-28 16:30:57'),(9,'INSERT','transactions',NULL,'2026-04-28 16:32:23'),(10,'INSERT','transactions',NULL,'2026-04-28 16:36:50'),(11,'INSERT','transactions',NULL,'2026-04-28 16:37:05'),(12,'INSERT','transactions',3,'2026-04-28 16:37:21'),(13,'INSERT','transactions',3,'2026-04-28 16:40:00'),(14,'INSERT','accounts',1,'2026-04-28 16:53:59'),(15,'INSERT','transactions',NULL,'2026-04-28 18:05:39'),(16,'INSERT','transactions',1,'2026-04-28 18:05:39'),(17,'INSERT','transactions',1,'2026-04-28 18:05:39'),(18,'INSERT','transactions',1,'2026-04-28 18:07:01'),(19,'INSERT','transactions',NULL,'2026-04-28 18:07:24'),(20,'INSERT','transactions',1,'2026-04-28 18:07:40'),(21,'INSERT','accounts',1,'2026-04-28 19:14:34'),(22,'INSERT','transactions',NULL,'2026-04-28 19:14:58'),(23,'INSERT','customers',3,'2026-04-29 03:42:45'),(24,'INSERT','customers',4,'2026-04-29 03:42:45'),(25,'INSERT','customers',5,'2026-04-29 03:42:45'),(26,'INSERT','customers',6,'2026-04-29 03:42:45'),(27,'INSERT','customers',7,'2026-04-29 03:42:45'),(28,'INSERT','customers',8,'2026-04-29 03:42:45'),(29,'INSERT','customers',9,'2026-04-29 03:42:45'),(30,'INSERT','customers',10,'2026-04-29 03:42:45'),(31,'INSERT','customers',11,'2026-04-29 03:42:45'),(32,'INSERT','customers',12,'2026-04-29 03:42:45'),(33,'INSERT','customers',13,'2026-04-29 03:42:45'),(34,'INSERT','customers',14,'2026-04-29 03:42:45'),(35,'INSERT','customers',15,'2026-04-29 03:42:45'),(36,'INSERT','customers',16,'2026-04-29 03:42:45'),(37,'INSERT','customers',17,'2026-04-29 03:42:45'),(38,'INSERT','customers',18,'2026-04-29 03:42:45'),(39,'INSERT','customers',19,'2026-04-29 03:42:45'),(40,'INSERT','customers',20,'2026-04-29 03:42:45'),(41,'INSERT','customers',21,'2026-04-29 03:42:45'),(42,'INSERT','customers',22,'2026-04-29 03:42:45'),(43,'INSERT','accounts',3,'2026-04-29 03:42:45'),(44,'INSERT','accounts',3,'2026-04-29 03:42:45'),(45,'INSERT','accounts',4,'2026-04-29 03:42:45'),(46,'INSERT','accounts',5,'2026-04-29 03:42:45'),(47,'INSERT','accounts',6,'2026-04-29 03:42:45'),(48,'INSERT','accounts',7,'2026-04-29 03:42:45'),(49,'INSERT','accounts',7,'2026-04-29 03:42:45'),(50,'INSERT','accounts',8,'2026-04-29 03:42:45'),(51,'INSERT','accounts',8,'2026-04-29 03:42:45'),(52,'INSERT','accounts',9,'2026-04-29 03:42:45'),(53,'INSERT','accounts',9,'2026-04-29 03:42:45'),(54,'INSERT','accounts',10,'2026-04-29 03:42:45'),(55,'INSERT','accounts',11,'2026-04-29 03:42:45'),(56,'INSERT','accounts',11,'2026-04-29 03:42:45'),(57,'INSERT','accounts',12,'2026-04-29 03:42:45'),(58,'INSERT','accounts',13,'2026-04-29 03:42:45'),(59,'INSERT','accounts',13,'2026-04-29 03:42:45'),(60,'INSERT','accounts',14,'2026-04-29 03:42:45'),(61,'INSERT','accounts',15,'2026-04-29 03:42:45'),(62,'INSERT','accounts',16,'2026-04-29 03:42:45'),(63,'INSERT','accounts',16,'2026-04-29 03:42:45'),(64,'INSERT','accounts',17,'2026-04-29 03:42:45'),(65,'INSERT','accounts',17,'2026-04-29 03:42:46'),(66,'INSERT','accounts',18,'2026-04-29 03:42:46'),(67,'INSERT','accounts',18,'2026-04-29 03:42:46'),(68,'INSERT','accounts',19,'2026-04-29 03:42:46'),(69,'INSERT','accounts',20,'2026-04-29 03:42:46'),(70,'INSERT','accounts',21,'2026-04-29 03:42:46'),(71,'INSERT','accounts',22,'2026-04-29 03:42:46'),(72,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(73,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(74,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(75,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(76,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(77,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(78,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(79,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(80,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(81,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(82,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(83,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(84,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(85,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(86,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(87,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(88,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(89,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(90,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(91,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(92,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(93,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(94,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(95,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(96,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(97,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(98,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(99,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(100,'INSERT','transactions',NULL,'2026-04-29 03:42:46'),(101,'INSERT','transactions',35,'2026-04-29 03:42:46'),(102,'INSERT','transactions',34,'2026-04-29 03:42:46'),(103,'INSERT','transactions',18,'2026-04-29 03:42:46'),(104,'INSERT','transactions',35,'2026-04-29 03:42:46'),(105,'INSERT','transactions',22,'2026-04-29 03:42:46'),(106,'INSERT','transactions',25,'2026-04-29 03:42:46'),(107,'INSERT','transactions',17,'2026-04-29 03:42:46'),(108,'INSERT','transactions',18,'2026-04-29 03:42:46'),(109,'INSERT','transactions',21,'2026-04-29 03:42:46'),(110,'INSERT','transactions',32,'2026-04-29 03:42:46'),(111,'INSERT','transactions',31,'2026-04-29 03:42:46'),(112,'INSERT','transactions',22,'2026-04-29 03:42:46'),(113,'INSERT','transactions',19,'2026-04-29 03:42:46'),(114,'INSERT','transactions',13,'2026-04-29 03:42:46'),(115,'INSERT','transactions',35,'2026-04-29 03:42:46'),(116,'INSERT','transactions',20,'2026-04-29 03:42:46'),(117,'INSERT','transactions',18,'2026-04-29 03:42:46'),(118,'INSERT','transactions',8,'2026-04-29 03:42:46'),(119,'INSERT','transactions',10,'2026-04-29 03:42:46'),(120,'INSERT','transactions',22,'2026-04-29 03:42:46'),(121,'INSERT','transactions',9,'2026-04-29 03:42:46'),(122,'INSERT','transactions',24,'2026-04-29 03:42:46'),(123,'INSERT','transactions',21,'2026-04-29 03:42:46'),(124,'INSERT','transactions',31,'2026-04-29 03:42:46'),(125,'INSERT','transactions',35,'2026-04-29 03:42:46'),(126,'INSERT','transactions',13,'2026-04-29 03:42:46'),(127,'INSERT','transactions',24,'2026-04-29 03:42:46'),(128,'INSERT','transactions',13,'2026-04-29 03:42:46'),(129,'INSERT','transactions',23,'2026-04-29 03:42:46'),(130,'INSERT','transactions',24,'2026-04-29 03:42:46'),(131,'INSERT','transactions',21,'2026-04-29 03:42:46'),(132,'INSERT','transactions',13,'2026-04-29 03:42:46'),(133,'INSERT','transactions',33,'2026-04-29 03:42:46'),(134,'INSERT','transactions',26,'2026-04-29 03:42:46'),(135,'INSERT','transactions',11,'2026-04-29 03:42:46'),(136,'INSERT','transactions',33,'2026-04-29 03:42:46'),(137,'INSERT','transactions',7,'2026-04-29 03:42:46'),(138,'INSERT','transactions',18,'2026-04-29 03:42:46'),(139,'INSERT','transactions',22,'2026-04-29 03:42:46'),(140,'INSERT','transactions',30,'2026-04-29 03:42:46'),(141,'INSERT','transactions',32,'2026-04-29 03:42:46'),(142,'INSERT','transactions',23,'2026-04-29 03:42:46'),(143,'INSERT','transactions',14,'2026-04-29 03:42:46'),(144,'INSERT','transactions',12,'2026-04-29 03:42:46'),(145,'INSERT','transactions',7,'2026-04-29 03:42:46'),(146,'INSERT','transactions',16,'2026-04-29 03:42:46'),(147,'INSERT','transactions',7,'2026-04-29 03:42:46'),(148,'INSERT','transactions',24,'2026-04-29 03:42:46'),(149,'INSERT','transactions',12,'2026-04-29 03:42:46'),(150,'INSERT','transactions',20,'2026-04-29 03:42:46'),(151,'INSERT','customers',23,'2026-04-29 03:45:43'),(152,'INSERT','customers',24,'2026-04-29 03:45:43'),(153,'INSERT','customers',25,'2026-04-29 03:45:43'),(154,'INSERT','customers',26,'2026-04-29 03:45:43'),(155,'INSERT','customers',27,'2026-04-29 03:45:43'),(156,'INSERT','customers',28,'2026-04-29 03:45:43'),(157,'INSERT','customers',29,'2026-04-29 03:45:43'),(158,'INSERT','customers',30,'2026-04-29 03:45:43'),(159,'INSERT','customers',31,'2026-04-29 03:45:43'),(160,'INSERT','customers',32,'2026-04-29 03:45:43'),(161,'INSERT','customers',33,'2026-04-29 03:45:43'),(162,'INSERT','customers',34,'2026-04-29 03:45:43'),(163,'INSERT','customers',35,'2026-04-29 03:45:43'),(164,'INSERT','customers',36,'2026-04-29 03:45:43'),(165,'INSERT','customers',37,'2026-04-29 03:45:43'),(166,'INSERT','customers',38,'2026-04-29 03:45:43'),(167,'INSERT','customers',39,'2026-04-29 03:45:43'),(168,'INSERT','customers',40,'2026-04-29 03:45:43'),(169,'INSERT','customers',41,'2026-04-29 03:45:43'),(170,'INSERT','customers',42,'2026-04-29 03:45:43'),(171,'INSERT','accounts',23,'2026-04-29 03:45:43'),(172,'INSERT','accounts',24,'2026-04-29 03:45:43'),(173,'INSERT','accounts',25,'2026-04-29 03:45:43'),(174,'INSERT','accounts',25,'2026-04-29 03:45:43'),(175,'INSERT','accounts',26,'2026-04-29 03:45:43'),(176,'INSERT','accounts',27,'2026-04-29 03:45:43'),(177,'INSERT','accounts',28,'2026-04-29 03:45:43'),(178,'INSERT','accounts',29,'2026-04-29 03:45:43'),(179,'INSERT','accounts',30,'2026-04-29 03:45:43'),(180,'INSERT','accounts',31,'2026-04-29 03:45:43'),(181,'INSERT','accounts',31,'2026-04-29 03:45:43'),(182,'INSERT','accounts',32,'2026-04-29 03:45:43'),(183,'INSERT','accounts',33,'2026-04-29 03:45:43'),(184,'INSERT','accounts',33,'2026-04-29 03:45:43'),(185,'INSERT','accounts',34,'2026-04-29 03:45:43'),(186,'INSERT','accounts',34,'2026-04-29 03:45:43'),(187,'INSERT','accounts',35,'2026-04-29 03:45:44'),(188,'INSERT','accounts',36,'2026-04-29 03:45:44'),(189,'INSERT','accounts',37,'2026-04-29 03:45:44'),(190,'INSERT','accounts',37,'2026-04-29 03:45:44'),(191,'INSERT','accounts',38,'2026-04-29 03:45:44'),(192,'INSERT','accounts',38,'2026-04-29 03:45:44'),(193,'INSERT','accounts',39,'2026-04-29 03:45:44'),(194,'INSERT','accounts',40,'2026-04-29 03:45:44'),(195,'INSERT','accounts',41,'2026-04-29 03:45:44'),(196,'INSERT','accounts',41,'2026-04-29 03:45:44'),(197,'INSERT','accounts',42,'2026-04-29 03:45:44'),(198,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(199,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(200,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(201,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(202,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(203,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(204,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(205,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(206,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(207,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(208,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(209,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(210,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(211,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(212,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(213,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(214,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(215,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(216,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(217,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(218,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(219,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(220,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(221,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(222,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(223,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(224,'INSERT','transactions',NULL,'2026-04-29 03:45:44'),(225,'INSERT','transactions',44,'2026-04-29 03:45:44'),(226,'INSERT','transactions',56,'2026-04-29 03:45:44'),(227,'INSERT','transactions',47,'2026-04-29 03:45:44'),(228,'INSERT','transactions',54,'2026-04-29 03:45:44'),(229,'INSERT','transactions',54,'2026-04-29 03:45:44'),(230,'INSERT','transactions',43,'2026-04-29 03:45:44'),(231,'INSERT','transactions',41,'2026-04-29 03:45:44'),(232,'INSERT','transactions',49,'2026-04-29 03:45:44'),(233,'INSERT','transactions',42,'2026-04-29 03:45:44'),(234,'INSERT','transactions',43,'2026-04-29 03:45:44'),(235,'INSERT','transactions',61,'2026-04-29 03:45:44'),(236,'INSERT','transactions',53,'2026-04-29 03:45:44'),(237,'INSERT','transactions',53,'2026-04-29 03:45:44'),(238,'INSERT','transactions',46,'2026-04-29 03:45:44'),(239,'INSERT','transactions',50,'2026-04-29 03:45:44'),(240,'INSERT','transactions',57,'2026-04-29 03:45:44'),(241,'INSERT','transactions',59,'2026-04-29 03:45:44'),(242,'INSERT','transactions',42,'2026-04-29 03:45:44'),(243,'INSERT','transactions',51,'2026-04-29 03:45:44'),(244,'INSERT','transactions',57,'2026-04-29 03:45:44'),(245,'INSERT','transactions',59,'2026-04-29 03:45:44'),(246,'INSERT','transactions',41,'2026-04-29 03:45:44'),(247,'INSERT','transactions',48,'2026-04-29 03:45:44'),(248,'INSERT','transactions',51,'2026-04-29 03:45:44'),(249,'INSERT','transactions',51,'2026-04-29 03:45:44'),(250,'INSERT','transactions',47,'2026-04-29 03:45:44'),(251,'INSERT','transactions',37,'2026-04-29 03:45:44'),(252,'INSERT','transactions',52,'2026-04-29 03:45:44'),(253,'INSERT','transactions',39,'2026-04-29 03:45:44'),(254,'INSERT','transactions',50,'2026-04-29 03:45:44'),(255,'INSERT','transactions',61,'2026-04-29 03:45:44'),(256,'INSERT','transactions',50,'2026-04-29 03:45:44'),(257,'INSERT','transactions',49,'2026-04-29 03:45:44'),(258,'INSERT','transactions',61,'2026-04-29 03:45:44'),(259,'INSERT','transactions',38,'2026-04-29 03:45:44'),(260,'INSERT','transactions',42,'2026-04-29 03:45:44'),(261,'INSERT','transactions',39,'2026-04-29 03:45:44'),(262,'INSERT','transactions',57,'2026-04-29 03:45:44'),(263,'INSERT','transactions',57,'2026-04-29 03:45:44'),(264,'INSERT','transactions',48,'2026-04-29 03:45:44'),(265,'INSERT','transactions',52,'2026-04-29 03:45:44'),(266,'INSERT','transactions',36,'2026-04-29 03:45:44'),(267,'INSERT','transactions',52,'2026-04-29 03:45:44'),(268,'INSERT','transactions',62,'2026-04-29 03:45:45'),(269,'INSERT','transactions',58,'2026-04-29 03:45:45'),(270,'INSERT','transactions',57,'2026-04-29 03:45:45'),(271,'INSERT','transactions',62,'2026-04-29 03:45:45'),(272,'INSERT','transactions',36,'2026-04-29 03:45:45'),(273,'INSERT','transactions',39,'2026-04-29 03:45:45'),(274,'INSERT','transactions',45,'2026-04-29 03:45:45'),(275,'INSERT','transactions',1,'2026-04-29 04:19:40');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `idx_customer_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Aditya','adityarajk2002@gmail.com','$2b$10$PEZq6Um04Ke5/2Pr/sw5/.R30pqNSD06scMIMsTwPW0KRLZbLwPUO','','','2026-04-28 02:09:56'),(2,'Ruby','ruby@gmail.com','$2b$10$VAvJeCSRG1fJMMjdck8TS.zftNBXfeAEj.uDhdunFiImEHM078Hy.','1234567890','','2026-04-28 16:26:49'),(3,'Heather Schoen','ray.schaden-doyle57@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','6525444210','9154 Swift Avenue, Hillsboro','2026-04-29 03:42:45'),(4,'Gus Hermiston','maya75@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','1777084045','19089 Post Road, Lake Lydia','2026-04-29 03:42:45'),(5,'Mrs. Isidro Yundt','alex.nolan@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','9491720694','5554 Heller Cape, Lake Juanitamouth','2026-04-29 03:42:45'),(6,'Tremaine Kuvalis','lola.stokes@yahoo.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','1151645895','467 Justina Coves, Mount Prospect','2026-04-29 03:42:45'),(7,'Mr. Adelle Maggio','jennings_ziemann81@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','3613577788','63542 Ethan Avenue, Watersville','2026-04-29 03:42:45'),(8,'Blanca Windler','kristy.bartell83@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','1670992476','70633 Vandervort Mall, Port Vivianne','2026-04-29 03:42:45'),(9,'Mr. Noel Dietrich-Walsh','wallace96@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','8751474501','74856 VonRueden Circle, Herman-Larsonton','2026-04-29 03:42:45'),(10,'Blanca Yost I','preston10@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','9431618456','47311 Schmidt Knolls, Keithville','2026-04-29 03:42:45'),(11,'Dr. Willis Dickens','chester27@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','9407998634','800 Dark Lane, West Annaview','2026-04-29 03:42:45'),(12,'Frank Hilpert MD','grady82@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','1140050553','24838 Yost Fork, Nashville-Davidson','2026-04-29 03:42:45'),(13,'Santiago Deckow','baby.hermiston60@yahoo.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','4773399712','14817 Thiel Cove, Youngstown','2026-04-29 03:42:45'),(14,'Jennings Gerlach IV','olive32@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','2274096029','1657 Heaney Lock, Asahaven','2026-04-29 03:42:45'),(15,'Mr. Orie Hoeger','gregg80@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','6579202705','83005 Christiansen Cliff, Leuschke-Kuhicstead','2026-04-29 03:42:45'),(16,'Zachary Terry MD','jeanette55@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','4108032657','62953 Johnathan Dam, Abshirebury','2026-04-29 03:42:45'),(17,'Dustin Hartmann','einar.ohara@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','6782200921','965 Roman Road, North Johannacester','2026-04-29 03:42:45'),(18,'Norman Hoeger','trever_rodriguez@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','7874805885','1360 Cory Oval, Beatricemouth','2026-04-29 03:42:45'),(19,'Stephen Doyle II','ernest_turcotte54@hotmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','6470014279','879 Pedro Fords, Deborahshire','2026-04-29 03:42:45'),(20,'Lester Feil','howell_pouros@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','4669632019','1908 Washington Avenue, Lake Coyhaven','2026-04-29 03:42:45'),(21,'Durward Schowalter','reyna_franey@yahoo.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','2980061772','7670 S Center Street, Kirkboro','2026-04-29 03:42:45'),(22,'Delores Hamill','tonya_spinka-ernser81@gmail.com','$2b$10$nlIghfMoqv8D68Zp7uDtbu0ncqqX9wY7IGEvmjI0sLdpinS9WRx4W','9170890064','953 Sage Ways, Reingerport','2026-04-29 03:42:45'),(23,'Alejandra Barrows','rachael69@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','5404962881','9068 Novella Greens, Cliffordview','2026-04-29 03:45:43'),(24,'Marsha Kub','brennan.littel40@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','1795305245','5783 Third Avenue, Cecileworth','2026-04-29 03:45:43'),(25,'Virgil Stoltenberg','hal84@hotmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','9400831984','9856 Kristi Causeway, East Melisachester','2026-04-29 03:45:43'),(26,'Olivia Murray','cristian7@yahoo.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','7304302299','11354 N Church Street, Emiliochester','2026-04-29 03:45:43'),(27,'Willy Ondricka','lew.lowe-olson25@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','1505620271','2618 Cow Lane, Chrisside','2026-04-29 03:45:43'),(28,'Miss Jacqueline Bartoletti','abraham_kris74@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','3504101738','695 Leonora Points, Marcellacester','2026-04-29 03:45:43'),(29,'Abe Pfeffer','tyrone66@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','7731488987','3962 E 1st Street, South Lamar','2026-04-29 03:45:43'),(30,'Dallas Paucek','monica37@yahoo.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','9314360298','87704 Guido Lock, West Aryannafield','2026-04-29 03:45:43'),(31,'Nathanial Stracke','tamara_marquardt-thiel60@yahoo.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','5444047655','4181 Old Military Road, Martinehaven','2026-04-29 03:45:43'),(32,'Jacynthe Bogisich-Mueller','shelley_mclaughlin@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','0373157508','2957 Grant Street, Schulistfield','2026-04-29 03:45:43'),(33,'Sherman Strosin-Tromp','rosamond.schuppe@hotmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','2085371531','70701 Smith Pass, Jacobsonstad','2026-04-29 03:45:43'),(34,'Mrs. Cecilia Williamson','hector.murray@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','7918683062','38843 Raymond Fort, Monterey Park','2026-04-29 03:45:43'),(35,'Ms. Michele Adams-Nikolaus','rex.fahey86@hotmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','5266830179','560 Walker Manor, Vincenzoworth','2026-04-29 03:45:43'),(36,'Issac Johnson','alphonso_gerlach@yahoo.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','9964233000','68439 Cheryl Well, Port Randallboro','2026-04-29 03:45:43'),(37,'Peggie Gislason','leticia.wilkinson@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','2398273616','852 Lincoln Highway, North Clyde','2026-04-29 03:45:43'),(38,'Hulda Ward','omar33@yahoo.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','4666562456','361 Vicarage Road, Conroe','2026-04-29 03:45:43'),(39,'Adriana Toy','lillian99@gmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','9561546392','5513 Fadel Heights, Amyburgh','2026-04-29 03:45:43'),(40,'Mr. Bryce Cole DDS','sherri_wyman21@yahoo.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','2569550782','3221 Krajcik Motorway, New Marlon','2026-04-29 03:45:43'),(41,'Bernadette Nolan','caleigh_weber-price@hotmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','8024188685','31244 Flossie Way, Lindgrenport','2026-04-29 03:45:43'),(42,'Stella Frami','murphy_douglas@hotmail.com','$2b$10$7CoJ5aodjAETAl0y5JDenOdGniu4RbMDayA3Beyp8weFuGs2dgfbG','2950927941','763 Durgan Ramp, South Justyntown','2026-04-29 03:45:43');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_customer_insert` AFTER INSERT ON `customers` FOR EACH ROW BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'customers', NEW.customer_id);
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_customer_update` AFTER UPDATE ON `customers` FOR EACH ROW BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('UPDATE', 'customers', NEW.customer_id);
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `from_account` int DEFAULT NULL,
  `to_account` int DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `transaction_type` enum('deposit','withdraw','transfer') NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `to_account` (`to_account`),
  KEY `idx_transaction_accounts` (`from_account`,`to_account`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`from_account`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`to_account`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,NULL,1,10000.00,'deposit','completed','2026-04-28 02:47:30'),(2,1,NULL,10.00,'withdraw','completed','2026-04-28 16:08:06'),(3,NULL,2,10000.00,'deposit','completed','2026-04-28 16:16:10'),(4,NULL,2,10000.00,'deposit','completed','2026-04-28 16:16:32'),(5,NULL,2,10000.00,'deposit','completed','2026-04-28 16:23:18'),(6,NULL,1,10000.00,'deposit','completed','2026-04-28 16:23:35'),(7,NULL,3,100000000.00,'deposit','completed','2026-04-28 16:27:41'),(8,NULL,3,100000000.00,'deposit','completed','2026-04-28 16:30:57'),(9,NULL,3,100.00,'deposit','completed','2026-04-28 16:32:23'),(10,NULL,3,10000.00,'deposit','completed','2026-04-28 16:36:50'),(11,NULL,4,122222.00,'deposit','completed','2026-04-28 16:37:05'),(12,3,4,1000.00,'transfer','completed','2026-04-28 16:37:21'),(13,3,2,100.00,'transfer','completed','2026-04-28 16:40:00'),(14,NULL,1,500.00,'deposit','completed','2026-04-28 18:05:39'),(15,1,NULL,200.00,'withdraw','completed','2026-04-28 18:05:39'),(16,1,2,100.00,'transfer','completed','2026-04-28 18:05:39'),(17,1,NULL,1000.00,'withdraw','completed','2026-04-28 18:07:01'),(18,NULL,5,3.00,'deposit','completed','2026-04-28 18:07:24'),(19,1,5,1.00,'transfer','completed','2026-04-28 18:07:40'),(20,NULL,2,600.00,'deposit','completed','2026-04-28 19:14:58'),(21,NULL,7,28595.23,'deposit','completed','2026-04-29 03:42:46'),(22,NULL,8,13510.88,'deposit','completed','2026-04-29 03:42:46'),(23,NULL,9,36272.98,'deposit','completed','2026-04-29 03:42:46'),(24,NULL,10,33862.96,'deposit','completed','2026-04-29 03:42:46'),(25,NULL,11,45015.09,'deposit','completed','2026-04-29 03:42:46'),(26,NULL,12,42769.58,'deposit','completed','2026-04-29 03:42:46'),(27,NULL,13,36115.10,'deposit','completed','2026-04-29 03:42:46'),(28,NULL,14,36913.41,'deposit','completed','2026-04-29 03:42:46'),(29,NULL,15,29561.29,'deposit','completed','2026-04-29 03:42:46'),(30,NULL,16,26487.33,'deposit','completed','2026-04-29 03:42:46'),(31,NULL,17,24483.58,'deposit','completed','2026-04-29 03:42:46'),(32,NULL,18,14849.38,'deposit','completed','2026-04-29 03:42:46'),(33,NULL,19,40876.09,'deposit','completed','2026-04-29 03:42:46'),(34,NULL,20,3130.95,'deposit','completed','2026-04-29 03:42:46'),(35,NULL,21,3782.34,'deposit','completed','2026-04-29 03:42:46'),(36,NULL,22,38433.49,'deposit','completed','2026-04-29 03:42:46'),(37,NULL,23,19927.95,'deposit','completed','2026-04-29 03:42:46'),(38,NULL,24,17611.80,'deposit','completed','2026-04-29 03:42:46'),(39,NULL,25,4631.08,'deposit','completed','2026-04-29 03:42:46'),(40,NULL,26,47745.75,'deposit','completed','2026-04-29 03:42:46'),(41,NULL,27,17113.67,'deposit','completed','2026-04-29 03:42:46'),(42,NULL,28,16536.02,'deposit','completed','2026-04-29 03:42:46'),(43,NULL,29,12032.90,'deposit','completed','2026-04-29 03:42:46'),(44,NULL,30,10777.05,'deposit','completed','2026-04-29 03:42:46'),(45,NULL,31,21007.33,'deposit','completed','2026-04-29 03:42:46'),(46,NULL,32,30991.35,'deposit','completed','2026-04-29 03:42:46'),(47,NULL,33,31130.31,'deposit','completed','2026-04-29 03:42:46'),(48,NULL,34,39475.30,'deposit','completed','2026-04-29 03:42:46'),(49,NULL,35,17652.20,'deposit','completed','2026-04-29 03:42:46'),(50,35,23,3540.12,'transfer','completed','2026-04-29 03:42:46'),(51,34,9,14229.52,'transfer','completed','2026-04-29 03:42:46'),(52,18,9,2376.66,'transfer','completed','2026-04-29 03:42:46'),(53,35,30,1731.04,'transfer','completed','2026-04-29 03:42:46'),(54,22,19,5561.54,'transfer','completed','2026-04-29 03:42:46'),(55,25,16,1649.64,'transfer','completed','2026-04-29 03:42:46'),(56,17,29,672.28,'transfer','completed','2026-04-29 03:42:46'),(57,18,9,1238.25,'transfer','completed','2026-04-29 03:42:46'),(58,21,33,1382.14,'transfer','completed','2026-04-29 03:42:46'),(59,32,9,3353.20,'transfer','completed','2026-04-29 03:42:46'),(60,31,22,8945.20,'transfer','completed','2026-04-29 03:42:46'),(61,22,32,18739.08,'transfer','completed','2026-04-29 03:42:46'),(62,19,25,5253.39,'transfer','completed','2026-04-29 03:42:46'),(63,13,17,4205.37,'transfer','completed','2026-04-29 03:42:46'),(64,35,19,4364.18,'transfer','completed','2026-04-29 03:42:46'),(65,20,23,919.28,'transfer','completed','2026-04-29 03:42:46'),(66,18,33,4339.71,'transfer','completed','2026-04-29 03:42:46'),(67,8,34,257.91,'transfer','completed','2026-04-29 03:42:46'),(68,10,27,9144.27,'transfer','completed','2026-04-29 03:42:46'),(69,22,14,10040.05,'transfer','completed','2026-04-29 03:42:46'),(70,9,15,25596.86,'transfer','completed','2026-04-29 03:42:46'),(71,24,17,1631.04,'transfer','completed','2026-04-29 03:42:46'),(72,21,15,390.44,'transfer','completed','2026-04-29 03:42:46'),(73,31,22,5608.05,'transfer','completed','2026-04-29 03:42:46'),(74,35,25,1117.45,'transfer','completed','2026-04-29 03:42:46'),(75,13,17,4847.70,'transfer','completed','2026-04-29 03:42:46'),(76,24,28,2401.98,'transfer','completed','2026-04-29 03:42:46'),(77,13,32,2641.71,'transfer','completed','2026-04-29 03:42:46'),(78,23,35,6230.48,'transfer','completed','2026-04-29 03:42:46'),(79,24,7,4327.30,'transfer','completed','2026-04-29 03:42:46'),(80,21,31,893.35,'transfer','completed','2026-04-29 03:42:46'),(81,13,7,11232.51,'transfer','completed','2026-04-29 03:42:46'),(82,33,21,7602.97,'transfer','completed','2026-04-29 03:42:46'),(83,26,33,23839.37,'transfer','completed','2026-04-29 03:42:46'),(84,11,10,9260.63,'transfer','completed','2026-04-29 03:42:46'),(85,33,8,13354.88,'transfer','completed','2026-04-29 03:42:46'),(86,7,9,20444.72,'transfer','completed','2026-04-29 03:42:46'),(87,18,35,799.59,'transfer','completed','2026-04-29 03:42:46'),(88,22,27,3917.17,'transfer','completed','2026-04-29 03:42:46'),(89,30,17,3518.59,'transfer','completed','2026-04-29 03:42:46'),(90,32,19,11989.20,'transfer','completed','2026-04-29 03:42:46'),(91,23,7,7829.75,'transfer','completed','2026-04-29 03:42:46'),(92,14,11,23390.84,'transfer','completed','2026-04-29 03:42:46'),(93,12,34,3305.25,'transfer','completed','2026-04-29 03:42:46'),(94,7,18,14930.12,'transfer','completed','2026-04-29 03:42:46'),(95,16,17,5026.86,'transfer','completed','2026-04-29 03:42:46'),(96,7,27,6922.50,'transfer','completed','2026-04-29 03:42:46'),(97,24,28,2032.62,'transfer','completed','2026-04-29 03:42:46'),(98,12,33,3977.52,'transfer','completed','2026-04-29 03:42:46'),(99,20,31,675.15,'transfer','completed','2026-04-29 03:42:46'),(100,NULL,36,34940.73,'deposit','completed','2026-04-29 03:45:44'),(101,NULL,37,21017.52,'deposit','completed','2026-04-29 03:45:44'),(102,NULL,38,19647.89,'deposit','completed','2026-04-29 03:45:44'),(103,NULL,39,18733.68,'deposit','completed','2026-04-29 03:45:44'),(104,NULL,40,41452.17,'deposit','completed','2026-04-29 03:45:44'),(105,NULL,41,39323.10,'deposit','completed','2026-04-29 03:45:44'),(106,NULL,42,36472.96,'deposit','completed','2026-04-29 03:45:44'),(107,NULL,43,42328.43,'deposit','completed','2026-04-29 03:45:44'),(108,NULL,44,41174.71,'deposit','completed','2026-04-29 03:45:44'),(109,NULL,45,27191.73,'deposit','completed','2026-04-29 03:45:44'),(110,NULL,46,26591.88,'deposit','completed','2026-04-29 03:45:44'),(111,NULL,47,5306.93,'deposit','completed','2026-04-29 03:45:44'),(112,NULL,48,13730.87,'deposit','completed','2026-04-29 03:45:44'),(113,NULL,49,2226.62,'deposit','completed','2026-04-29 03:45:44'),(114,NULL,50,38092.47,'deposit','completed','2026-04-29 03:45:44'),(115,NULL,51,4070.57,'deposit','completed','2026-04-29 03:45:44'),(116,NULL,52,42327.13,'deposit','completed','2026-04-29 03:45:44'),(117,NULL,53,13619.17,'deposit','completed','2026-04-29 03:45:44'),(118,NULL,54,38517.18,'deposit','completed','2026-04-29 03:45:44'),(119,NULL,55,23816.64,'deposit','completed','2026-04-29 03:45:44'),(120,NULL,56,21317.93,'deposit','completed','2026-04-29 03:45:44'),(121,NULL,57,41124.42,'deposit','completed','2026-04-29 03:45:44'),(122,NULL,58,31538.61,'deposit','completed','2026-04-29 03:45:44'),(123,NULL,59,21951.69,'deposit','completed','2026-04-29 03:45:44'),(124,NULL,60,12217.26,'deposit','completed','2026-04-29 03:45:44'),(125,NULL,61,43981.75,'deposit','completed','2026-04-29 03:45:44'),(126,NULL,62,23888.69,'deposit','completed','2026-04-29 03:45:44'),(127,44,50,15842.69,'transfer','completed','2026-04-29 03:45:44'),(128,56,57,8155.07,'transfer','completed','2026-04-29 03:45:44'),(129,47,53,688.89,'transfer','completed','2026-04-29 03:45:44'),(130,54,47,19135.00,'transfer','completed','2026-04-29 03:45:44'),(131,54,47,7959.64,'transfer','completed','2026-04-29 03:45:44'),(132,43,55,8857.47,'transfer','completed','2026-04-29 03:45:44'),(133,41,40,7550.76,'transfer','completed','2026-04-29 03:45:44'),(134,49,52,1017.11,'transfer','completed','2026-04-29 03:45:44'),(135,42,52,12532.12,'transfer','completed','2026-04-29 03:45:44'),(136,43,54,10803.25,'transfer','completed','2026-04-29 03:45:44'),(137,61,56,13267.80,'transfer','completed','2026-04-29 03:45:44'),(138,53,49,4478.45,'transfer','completed','2026-04-29 03:45:44'),(139,53,37,1040.75,'transfer','completed','2026-04-29 03:45:44'),(140,46,55,1252.18,'transfer','completed','2026-04-29 03:45:44'),(141,50,55,9175.12,'transfer','completed','2026-04-29 03:45:44'),(142,57,46,12083.17,'transfer','completed','2026-04-29 03:45:44'),(143,59,47,10648.14,'transfer','completed','2026-04-29 03:45:44'),(144,42,46,6399.14,'transfer','completed','2026-04-29 03:45:44'),(145,51,46,1316.69,'transfer','completed','2026-04-29 03:45:44'),(146,57,42,15048.49,'transfer','completed','2026-04-29 03:45:44'),(147,59,60,4378.61,'transfer','completed','2026-04-29 03:45:44'),(148,41,47,1936.55,'transfer','completed','2026-04-29 03:45:44'),(149,48,55,4626.57,'transfer','completed','2026-04-29 03:45:44'),(150,51,60,1237.57,'transfer','completed','2026-04-29 03:45:44'),(151,51,44,597.64,'transfer','completed','2026-04-29 03:45:44'),(152,47,54,12785.60,'transfer','completed','2026-04-29 03:45:44'),(153,37,52,9178.39,'transfer','completed','2026-04-29 03:45:44'),(154,52,46,7962.75,'transfer','completed','2026-04-29 03:45:44'),(155,39,53,7263.68,'transfer','completed','2026-04-29 03:45:44'),(156,50,43,4243.27,'transfer','completed','2026-04-29 03:45:44'),(157,61,44,11140.43,'transfer','completed','2026-04-29 03:45:44'),(158,50,44,4879.81,'transfer','completed','2026-04-29 03:45:44'),(159,49,53,1732.99,'transfer','completed','2026-04-29 03:45:44'),(160,61,62,2075.53,'transfer','completed','2026-04-29 03:45:44'),(161,38,40,863.58,'transfer','completed','2026-04-29 03:45:44'),(162,42,54,13106.41,'transfer','completed','2026-04-29 03:45:44'),(163,39,44,4956.13,'transfer','completed','2026-04-29 03:45:44'),(164,57,44,2910.13,'transfer','completed','2026-04-29 03:45:44'),(165,57,62,3694.47,'transfer','completed','2026-04-29 03:45:44'),(166,48,49,4418.96,'transfer','completed','2026-04-29 03:45:44'),(167,52,55,15475.44,'transfer','completed','2026-04-29 03:45:44'),(168,36,46,15534.83,'transfer','completed','2026-04-29 03:45:44'),(169,52,51,5650.52,'transfer','completed','2026-04-29 03:45:44'),(170,62,50,1520.58,'transfer','completed','2026-04-29 03:45:45'),(171,58,46,4022.80,'transfer','completed','2026-04-29 03:45:45'),(172,57,61,1542.24,'transfer','completed','2026-04-29 03:45:45'),(173,62,47,11591.83,'transfer','completed','2026-04-29 03:45:45'),(174,36,39,7224.44,'transfer','completed','2026-04-29 03:45:45'),(175,39,53,2217.65,'transfer','completed','2026-04-29 03:45:45'),(176,45,44,5843.81,'transfer','completed','2026-04-29 03:45:45'),(177,1,8,10.00,'transfer','completed','2026-04-29 04:19:40');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_transaction_insert` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
    INSERT INTO audit_logs(action, table_name, performed_by)
    VALUES ('INSERT', 'transactions', NEW.from_account);
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29  9:56:43

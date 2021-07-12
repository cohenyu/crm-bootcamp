CREATE DATABASE crm_db;
USE crm_db;

CREATE TABLE `leads` (
  `lead_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) DEFAULT NULL,
  `user_mail` varchar(100) DEFAULT NULL,
  `user_phone` int(10) DEFAULT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`lead_id`)
);

CREATE TABLE `accounts` (
  `account_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `business_name` varchar(100) DEFAULT NULL,
  `first_user_mail` varchar(100) DEFAULT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`)
);

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_password` varchar(100) DEFAULT NULL,
  `user_mail` varchar(100) DEFAULT NULL,
  `user_phone` varchar(10) DEFAULT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `contacts_unique` (`user_mail`,`user_phone`)
);

CREATE TABLE clients (
client_id bigint(20) AUTO_INCREMENT PRIMARY KEY,
client_account bigint(20),
client_name VARCHAR(100) NOT NULL,
client_mail VARCHAR(100) NOT NULL UNIQUE,
client_phone VARCHAR(10) NOT NULL UNIQUE,
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE projects (
project_id bigint(20) AUTO_INCREMENT PRIMARY KEY,
account_id bigint(20) NOT NULL,
client_id bigint(20) NOT NULL,
item_type VARCHAR(100) NOT NULL,
description TEXT,
deadline DATE,
project_status VARCHAR(100) NOT NULL,
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `emailSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`scheduledTime` varchar(5) NOT NULL DEFAULT '08:00',
	`timezone` varchar(50) NOT NULL DEFAULT 'UTC',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSentAt` timestamp,
	CONSTRAINT `emailSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailSubscriptions_email_unique` UNIQUE(`email`)
);

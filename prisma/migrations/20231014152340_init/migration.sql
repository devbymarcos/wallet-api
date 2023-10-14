-- CreateTable
CREATE TABLE `app_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `mobile` VARCHAR(255) NULL,
    `street` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `wallet_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `invoice_of` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `price` FLOAT NOT NULL,
    `due_at` DATE NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `pay` VARCHAR(255) NOT NULL DEFAULT 'unpaid',
    `repeat_when` VARCHAR(255) NULL,
    `period` VARCHAR(255) NULL DEFAULT 'month',
    `group_quota` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `app_invoice`(`invoice_of`),
    INDEX `category_id_fk`(`category_id`),
    INDEX `wallet_id_fk`(`wallet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `mobile` VARCHAR(255) NULL,
    `street` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `option_wallet` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL DEFAULT '',
    `last_name` VARCHAR(255) NOT NULL DEFAULT '',
    `email` VARCHAR(255) NOT NULL DEFAULT '',
    `password` VARCHAR(255) NOT NULL DEFAULT '',
    `token_forget` VARCHAR(255) NULL,
    `photo` VARCHAR(255) NOT NULL DEFAULT 'default',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `full_text`(`first_name`, `last_name`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `app_invoice` ADD CONSTRAINT `category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `app_categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `app_invoice` ADD CONSTRAINT `invoice_of` FOREIGN KEY (`invoice_of`) REFERENCES `app_invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `app_invoice` ADD CONSTRAINT `wallet_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `app_wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

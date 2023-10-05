-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 05, 2023 at 09:32 AM
-- Server version: 5.7.43
-- PHP Version: 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `techmaxl_web_001`
--

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE `inventory`;
DROP TABLE `inventory_features`;
DROP TABLE `inventory_images`;
DROP TABLE `sub_categories`;
DROP TABLE `sub_categories_brands`;
DROP TABLE `sub_categories_features`;

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `part_number` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `heading` varchar(255) NOT NULL,
  `short_description` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `discount` float NOT NULL,
  `quantity_discount_amount` float NOT NULL,
  `quantity_discount` float NOT NULL,
  `quantity_free_issue_amount` float NOT NULL,
  `quantity_free_issue` float NOT NULL,
  `order_total_discount_amount` float NOT NULL,
  `order_total_discount` float NOT NULL,
  `free_shipping` varchar(255) NOT NULL,
  `featured` varchar(255) NOT NULL,
  `shipping_charges_local` float NOT NULL,
  `shipping_charges_international` float NOT NULL,
  `inhand` float NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `category_id`, `sub_category_id`, `brand_id`, `model_id`, `seller_id`, `barcode`, `part_number`, `code`, `heading`, `short_description`, `description`, `price`, `discount`, `quantity_discount_amount`, `quantity_discount`, `quantity_free_issue_amount`, `quantity_free_issue`, `order_total_discount_amount`, `order_total_discount`, `free_shipping`, `featured`, `shipping_charges_local`, `shipping_charges_international`, `inhand`, `image_url`, `status`, `createdAt`, `updatedAt`, `categoryId`, `subCategoryId`, `brandId`, `modelId`, `onlineUserId`) VALUES
(1, 1, 1, 30, 20, 4, '', 'aaaaaa', '', 'SAMSUNG GALAXY A04E (32GB / 3GB)', 'SAMSUNG GALAXY A04E (32GB / 3GB)', 'Processor\nCPU Speed	2.3GHz,1.8GHz\nCPU Type	Octa-Core\nDisplay\nResolution (Main Display)	720 x 1600 (HD+)\nTechnology (Main Display)	PLS LCD\nColor Depth (Main Display)	16M', 35890, 5, 0, 0, 0, 0, 0, 0, 'yes', 'yes', 0, 0, 0, 'uploads/images/inventory/inventory-image-1696477216702.jpeg', 'active', '2023-10-05 03:11:42', '2023-10-05 03:40:16');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_features`
--

CREATE TABLE `inventory_features` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `sub_feature_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory_features`
--

INSERT INTO `inventory_features` (`id`, `inventory_id`, `feature_id`, `sub_feature_id`, `createdAt`, `updatedAt`, `inventoryId`, `featureId`, `subFeatureId`) VALUES
(1, 1, 4, 10, '2023-10-05 03:57:13', '2023-10-05 03:57:13');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_images`
--

CREATE TABLE `inventory_images` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `show_on_filters` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `code`, `category_id`, `description`, `show_on_filters`, `image_url`, `status`, `createdAt`, `updatedAt`, `categoryId`, `sub_category_id`, `subCategoriesFeatureId`, `subCategoriesBrandId`) VALUES
(1, '', 1, 'Phones', 'yes', 'none', 'active', '2023-10-03 00:48:25', '2023-10-03 03:01:56'),
(2, '', 1, 'Tabs', 'yes', 'none', 'active', '2023-10-03 01:50:33', '2023-10-03 01:50:33'),
(3, '', 1, 'Laptops', 'yes', 'none', 'active', '2023-10-03 01:50:47', '2023-10-03 01:50:47'),
(4, '', 1, 'Desktops', 'yes', 'none', 'active', '2023-10-03 01:51:03', '2023-10-03 01:51:03'),
(5, '', 2, 'Televisions', 'yes', 'none', 'active', '2023-10-03 02:16:10', '2023-10-03 02:16:10'),
(6, '', 2, 'HiFi Systems', 'yes', 'none', 'active', '2023-10-03 02:16:36', '2023-10-03 02:16:36'),
(7, '', 2, 'Surround Sound Systems', 'yes', 'none', 'active', '2023-10-03 02:17:18', '2023-10-03 02:17:45'),
(8, '', 2, 'Projectors', 'yes', 'none', 'active', '2023-10-03 02:18:11', '2023-10-03 02:18:11'),
(9, '', 2, 'Air Conditioners', 'yes', 'none', 'active', '2023-10-03 02:19:02', '2023-10-03 02:19:02'),
(10, '', 2, 'Washing Machienes', 'yes', 'none', 'active', '2023-10-03 02:19:21', '2023-10-03 02:19:21'),
(11, '', 3, 'Headphones', 'yes', 'none', 'active', '2023-10-03 02:19:46', '2023-10-03 02:19:50'),
(12, '', 3, 'Music Players', 'yes', 'none', 'active', '2023-10-03 02:42:29', '2023-10-03 02:42:29'),
(13, '', 3, 'Wireless Headphones', 'yes', 'none', 'active', '2023-10-03 02:42:58', '2023-10-03 02:43:01'),
(14, '', 3, 'Bluetooth Devices', 'yes', 'none', 'active', '2023-10-03 02:43:27', '2023-10-03 02:43:31'),
(15, '', 3, 'Bluetooth Speakers', 'yes', 'none', 'active', '2023-10-03 02:43:45', '2023-10-03 02:43:45'),
(16, '', 4, 'Security Cameras', 'yes', 'none', 'active', '2023-10-03 02:43:56', '2023-10-03 02:44:04'),
(17, '', 4, 'DVR Devices', 'yes', 'none', 'active', '2023-10-03 02:44:23', '2023-10-03 02:44:23'),
(18, '', 4, 'Accessories', 'yes', 'none', 'active', '2023-10-03 02:44:40', '2023-10-03 02:44:40'),
(19, '', 5, 'Remote Control Cars', 'yes', 'none', 'active', '2023-10-03 02:45:15', '2023-10-03 02:45:15'),
(20, '', 5, 'Drones', 'yes', 'none', 'active', '2023-10-03 02:45:27', '2023-10-03 02:45:27'),
(21, '', 5, 'Blocks', 'yes', 'none', 'active', '2023-10-03 02:45:55', '2023-10-03 02:45:55'),
(22, '', 5, 'Model Trains', 'yes', 'none', 'active', '2023-10-03 02:46:34', '2023-10-03 02:46:34'),
(23, '', 6, 'Power Supply', 'yes', 'none', 'active', '2023-10-03 02:47:14', '2023-10-03 02:47:14'),
(24, '', 6, 'Extension cords', 'yes', 'none', 'active', '2023-10-03 02:47:35', '2023-10-03 02:47:35'),
(25, '', 6, 'Power Cables', 'yes', 'none', 'active', '2023-10-03 02:49:23', '2023-10-03 02:49:23'),
(26, '', 6, 'Data Cables', 'yes', 'none', 'active', '2023-10-03 02:49:36', '2023-10-03 02:49:36'),
(27, '', 7, 'Transistors & Intergrated Circuits', 'yes', 'none', 'active', '2023-10-03 02:50:12', '2023-10-03 02:51:16'),
(28, '', 7, 'Condensers & Resisters', 'yes', 'none', 'active', '2023-10-03 02:51:44', '2023-10-03 02:51:44'),
(29, '', 7, 'Transformers & RF Parts', 'yes', 'none', 'active', '2023-10-03 02:52:28', '2023-10-03 02:52:28'),
(30, '', 7, 'Accessories', 'no', 'none', 'active', '2023-10-03 02:52:46', '2023-10-03 02:52:46'),
(31, '', 8, 'Replacement Boards', 'yes', 'none', 'active', '2023-10-03 02:53:14', '2023-10-03 02:53:22'),
(32, '', 8, 'Displays', 'yes', 'none', 'active', '2023-10-03 02:53:43', '2023-10-03 02:53:43'),
(33, '', 8, 'Batteries', 'yes', 'none', 'active', '2023-10-03 02:54:08', '2023-10-03 02:54:08'),
(34, '', 9, 'Measuring Devices', 'yes', 'none', 'active', '2023-10-03 02:54:38', '2023-10-03 02:54:38'),
(35, '', 9, 'Soldering Devices', 'yes', 'none', 'active', '2023-10-03 02:54:59', '2023-10-03 02:56:03'),
(36, '', 9, 'Holding Fixtures', 'yes', 'none', 'active', '2023-10-03 02:56:24', '2023-10-03 02:56:24'),
(37, '', 9, 'Other Tools', 'yes', 'none', 'active', '2023-10-03 02:56:40', '2023-10-03 02:56:40');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories_brands`
--

CREATE TABLE `sub_categories_brands` (
  `id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sub_categories_brands`
--

INSERT INTO `sub_categories_brands` (`id`, `sub_category_id`, `brand_id`, `createdAt`, `updatedAt`, `subCategoryId`, `brandId`) VALUES
(1, 1, 29, '2023-10-03 03:24:35', '2023-10-03 03:24:35'),
(2, 1, 30, '2023-10-03 03:24:48', '2023-10-03 03:24:48'),
(3, 1, 32, '2023-10-03 03:24:55', '2023-10-03 03:24:55'),
(4, 1, 35, '2023-10-03 03:27:46', '2023-10-03 03:27:46'),
(5, 1, 36, '2023-10-03 03:27:53', '2023-10-03 03:27:53'),
(6, 1, 37, '2023-10-03 03:27:59', '2023-10-03 03:27:59'),
(7, 2, 29, '2023-10-03 03:32:33', '2023-10-03 03:32:33'),
(8, 2, 30, '2023-10-03 03:32:45', '2023-10-03 03:32:45'),
(9, 2, 36, '2023-10-03 03:32:52', '2023-10-03 03:32:52'),
(10, 2, 38, '2023-10-03 03:32:57', '2023-10-03 03:32:57'),
(11, 2, 42, '2023-10-03 03:33:03', '2023-10-03 03:33:03'),
(12, 2, 44, '2023-10-03 03:33:14', '2023-10-03 03:33:14'),
(13, 3, 29, '2023-10-03 03:34:13', '2023-10-03 03:34:13'),
(14, 3, 31, '2023-10-03 03:34:16', '2023-10-03 03:34:16'),
(15, 3, 33, '2023-10-03 03:34:21', '2023-10-03 03:34:21'),
(16, 3, 38, '2023-10-03 03:34:26', '2023-10-03 03:34:26'),
(17, 3, 42, '2023-10-03 03:34:32', '2023-10-03 03:34:32'),
(18, 3, 51, '2023-10-03 03:34:38', '2023-10-03 03:34:38'),
(19, 4, 29, '2023-10-03 03:35:51', '2023-10-03 03:35:51'),
(20, 4, 30, '2023-10-03 03:35:54', '2023-10-03 03:35:54'),
(21, 4, 31, '2023-10-03 03:35:57', '2023-10-03 03:35:57'),
(22, 4, 51, '2023-10-03 03:36:11', '2023-10-03 03:36:11'),
(23, 5, 30, '2023-10-03 03:36:46', '2023-10-03 03:36:46'),
(24, 5, 31, '2023-10-03 03:36:55', '2023-10-03 03:36:55'),
(25, 5, 33, '2023-10-03 03:37:00', '2023-10-03 03:37:00'),
(26, 5, 34, '2023-10-03 03:37:03', '2023-10-03 03:37:03'),
(27, 5, 39, '2023-10-03 03:37:08', '2023-10-03 03:37:08'),
(28, 5, 41, '2023-10-03 03:37:16', '2023-10-03 03:37:16'),
(29, 6, 30, '2023-10-03 03:38:01', '2023-10-03 03:38:01'),
(30, 6, 31, '2023-10-03 03:38:04', '2023-10-03 03:38:04'),
(31, 6, 33, '2023-10-03 03:38:07', '2023-10-03 03:38:07'),
(32, 6, 34, '2023-10-03 03:38:10', '2023-10-03 03:38:10'),
(33, 6, 39, '2023-10-03 03:38:15', '2023-10-03 03:38:15'),
(34, 6, 40, '2023-10-03 03:38:18', '2023-10-03 03:38:18'),
(35, 6, 42, '2023-10-03 03:38:25', '2023-10-03 03:38:25'),
(36, 6, 43, '2023-10-03 03:38:29', '2023-10-03 03:38:29'),
(37, 6, 47, '2023-10-03 03:38:36', '2023-10-03 03:38:36'),
(38, 6, 48, '2023-10-03 03:38:41', '2023-10-03 03:38:41'),
(39, 6, 50, '2023-10-03 03:38:47', '2023-10-03 03:38:47'),
(40, 6, 52, '2023-10-03 03:38:51', '2023-10-03 03:38:51'),
(41, 7, 30, '2023-10-03 03:39:11', '2023-10-03 03:39:11'),
(42, 7, 31, '2023-10-03 03:39:15', '2023-10-03 03:39:15'),
(43, 7, 34, '2023-10-03 03:39:18', '2023-10-03 03:39:18'),
(44, 7, 40, '2023-10-03 03:39:23', '2023-10-03 03:39:23'),
(45, 7, 42, '2023-10-03 03:39:32', '2023-10-03 03:39:32'),
(46, 7, 43, '2023-10-03 03:39:39', '2023-10-03 03:39:39'),
(47, 7, 45, '2023-10-03 03:39:45', '2023-10-03 03:39:45'),
(48, 7, 46, '2023-10-03 03:39:50', '2023-10-03 03:39:50'),
(49, 7, 47, '2023-10-03 03:39:55', '2023-10-03 03:39:55'),
(50, 7, 48, '2023-10-03 03:40:03', '2023-10-03 03:40:03'),
(51, 7, 50, '2023-10-03 03:40:11', '2023-10-03 03:40:11'),
(52, 7, 52, '2023-10-03 03:40:18', '2023-10-03 03:40:18'),
(53, 8, 30, '2023-10-03 03:40:40', '2023-10-03 03:40:40'),
(54, 8, 33, '2023-10-03 03:40:43', '2023-10-03 03:40:43'),
(55, 8, 34, '2023-10-03 03:40:46', '2023-10-03 03:40:46'),
(56, 8, 42, '2023-10-03 03:40:52', '2023-10-03 03:40:52'),
(57, 8, 51, '2023-10-03 03:40:58', '2023-10-03 03:40:58'),
(58, 9, 30, '2023-10-03 03:41:17', '2023-10-03 03:41:17'),
(59, 9, 31, '2023-10-03 03:41:22', '2023-10-03 03:41:22'),
(60, 9, 33, '2023-10-03 03:41:26', '2023-10-03 03:41:26'),
(61, 9, 34, '2023-10-03 03:41:29', '2023-10-03 03:41:29'),
(62, 9, 42, '2023-10-03 03:41:36', '2023-10-03 03:41:36'),
(63, 10, 30, '2023-10-03 03:42:08', '2023-10-03 03:42:08'),
(64, 10, 31, '2023-10-03 03:42:11', '2023-10-03 03:42:11'),
(65, 10, 34, '2023-10-03 03:42:17', '2023-10-03 03:42:17'),
(66, 10, 42, '2023-10-03 03:42:23', '2023-10-03 03:42:23'),
(67, 11, 30, '2023-10-03 03:42:58', '2023-10-03 03:42:58'),
(68, 11, 29, '2023-10-03 03:43:03', '2023-10-03 03:43:03'),
(69, 11, 33, '2023-10-03 03:43:08', '2023-10-03 03:43:08'),
(70, 11, 40, '2023-10-03 03:43:14', '2023-10-03 03:43:14'),
(71, 11, 45, '2023-10-03 03:43:23', '2023-10-03 03:43:23'),
(72, 11, 50, '2023-10-03 03:43:30', '2023-10-03 03:43:30'),
(73, 11, 46, '2023-10-03 03:43:37', '2023-10-03 03:43:37'),
(74, 12, 29, '2023-10-03 03:43:58', '2023-10-03 03:43:58'),
(75, 12, 30, '2023-10-03 03:44:00', '2023-10-03 03:44:00'),
(76, 12, 33, '2023-10-03 03:44:04', '2023-10-03 03:44:04'),
(77, 12, 34, '2023-10-03 03:44:07', '2023-10-03 03:44:07'),
(78, 12, 39, '2023-10-03 03:44:12', '2023-10-03 03:44:12'),
(79, 12, 40, '2023-10-03 03:44:16', '2023-10-03 03:44:16'),
(80, 12, 45, '2023-10-03 03:44:23', '2023-10-03 03:44:23'),
(81, 12, 50, '2023-10-03 03:44:35', '2023-10-03 03:44:35'),
(82, 13, 29, '2023-10-03 03:44:59', '2023-10-03 03:44:59'),
(83, 13, 30, '2023-10-03 03:45:01', '2023-10-03 03:45:01'),
(84, 13, 45, '2023-10-03 03:45:09', '2023-10-03 03:45:09'),
(85, 14, 29, '2023-10-03 03:45:33', '2023-10-03 03:45:33'),
(86, 14, 30, '2023-10-03 03:45:36', '2023-10-03 03:45:36'),
(87, 14, 33, '2023-10-03 03:45:40', '2023-10-03 03:45:40'),
(88, 14, 34, '2023-10-03 03:45:43', '2023-10-03 03:45:43'),
(89, 15, 31, '2023-10-03 03:46:13', '2023-10-03 03:46:13'),
(90, 15, 30, '2023-10-03 03:46:16', '2023-10-03 03:46:16'),
(91, 15, 33, '2023-10-03 03:46:20', '2023-10-03 03:46:20'),
(92, 15, 34, '2023-10-03 03:46:23', '2023-10-03 03:46:23'),
(93, 15, 40, '2023-10-03 03:46:29', '2023-10-03 03:46:29'),
(94, 15, 43, '2023-10-03 03:46:33', '2023-10-03 03:46:33'),
(95, 15, 45, '2023-10-03 03:46:39', '2023-10-03 03:46:39'),
(96, 15, 46, '2023-10-03 03:46:43', '2023-10-03 03:46:43'),
(97, 15, 47, '2023-10-03 03:46:49', '2023-10-03 03:46:49');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories_features`
--

CREATE TABLE `sub_categories_features` (
  `id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sub_categories_features`
--

INSERT INTO `sub_categories_features` (`id`, `sub_category_id`, `feature_id`, `createdAt`, `updatedAt`, `subCategoryId`, `featureId`) VALUES
(1, 1, 4, '2023-10-03 03:01:19', '2023-10-03 03:01:19'),
(3, 1, 5, '2023-10-03 03:01:54', '2023-10-03 03:01:54'),
(4, 2, 4, '2023-10-03 03:30:21', '2023-10-03 03:30:21'),
(5, 2, 5, '2023-10-03 03:32:25', '2023-10-03 03:32:25'),
(6, 3, 4, '2023-10-03 03:34:00', '2023-10-03 03:34:00'),
(7, 3, 5, '2023-10-03 03:34:04', '2023-10-03 03:34:04'),
(8, 4, 4, '2023-10-03 03:35:40', '2023-10-03 03:35:40'),
(9, 4, 5, '2023-10-03 03:35:43', '2023-10-03 03:35:43'),
(10, 5, 4, '2023-10-03 03:36:39', '2023-10-03 03:36:39'),
(11, 5, 5, '2023-10-03 03:36:41', '2023-10-03 03:36:41'),
(12, 6, 4, '2023-10-03 03:37:48', '2023-10-03 03:37:48'),
(13, 6, 5, '2023-10-03 03:37:51', '2023-10-03 03:37:51'),
(14, 7, 4, '2023-10-03 03:39:02', '2023-10-03 03:39:02'),
(15, 7, 5, '2023-10-03 03:39:05', '2023-10-03 03:39:05'),
(16, 8, 4, '2023-10-03 03:40:32', '2023-10-03 03:40:32'),
(17, 8, 5, '2023-10-03 03:40:35', '2023-10-03 03:40:35'),
(18, 9, 4, '2023-10-03 03:41:09', '2023-10-03 03:41:09'),
(19, 9, 4, '2023-10-03 03:41:09', '2023-10-03 03:41:09'),
(20, 9, 5, '2023-10-03 03:41:12', '2023-10-03 03:41:12'),
(21, 10, 4, '2023-10-03 03:41:57', '2023-10-03 03:41:57'),
(22, 10, 5, '2023-10-03 03:42:01', '2023-10-03 03:42:01'),
(23, 11, 4, '2023-10-03 03:42:47', '2023-10-03 03:42:47'),
(24, 11, 5, '2023-10-03 03:42:50', '2023-10-03 03:42:50'),
(25, 12, 4, '2023-10-03 03:43:50', '2023-10-03 03:43:50'),
(26, 12, 5, '2023-10-03 03:43:53', '2023-10-03 03:43:53'),
(27, 13, 4, '2023-10-03 03:44:50', '2023-10-03 03:44:50'),
(28, 13, 5, '2023-10-03 03:44:53', '2023-10-03 03:44:53'),
(29, 14, 4, '2023-10-03 03:45:22', '2023-10-03 03:45:22'),
(30, 14, 5, '2023-10-03 03:45:25', '2023-10-03 03:45:25'),
(31, 15, 4, '2023-10-03 03:46:01', '2023-10-03 03:46:01'),
(32, 15, 5, '2023-10-03 03:46:04', '2023-10-03 03:46:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `sub_category_id` (`sub_category_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `model_id` (`model_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `inventory_features`
--
ALTER TABLE `inventory_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_id` (`inventory_id`),
  ADD KEY `feature_id` (`feature_id`),
  ADD KEY `sub_feature_id` (`sub_feature_id`);

--
-- Indexes for table `inventory_images`
--
ALTER TABLE `inventory_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `sub_categories_brands`
--
ALTER TABLE `sub_categories_brands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_category_id` (`sub_category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `sub_categories_features`
--
ALTER TABLE `sub_categories_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_category_id` (`sub_category_id`),
  ADD KEY `feature_id` (`feature_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inventory_features`
--
ALTER TABLE `inventory_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inventory_images`
--
ALTER TABLE `inventory_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `sub_categories_brands`
--
ALTER TABLE `sub_categories_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `sub_categories_features`
--
ALTER TABLE `sub_categories_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_46` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_47` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_48` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_49` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_50` FOREIGN KEY (`seller_id`) REFERENCES `online_users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `inventory_features`
--
ALTER TABLE `inventory_features`
  ADD CONSTRAINT `inventory_features_ibfk_28` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_features_ibfk_29` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_features_ibfk_30` FOREIGN KEY (`sub_feature_id`) REFERENCES `sub_features` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `inventory_images`
--
ALTER TABLE `inventory_images`
  ADD CONSTRAINT `inventory_images_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_ibfk_19` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `sub_categories_brands`
--
ALTER TABLE `sub_categories_brands`
  ADD CONSTRAINT `sub_categories_brands_ibfk_19` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sub_categories_brands_ibfk_20` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `sub_categories_features`
--
ALTER TABLE `sub_categories_features`
  ADD CONSTRAINT `sub_categories_features_ibfk_19` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sub_categories_features_ibfk_20` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

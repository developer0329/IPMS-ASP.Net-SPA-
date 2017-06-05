-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2016 at 04:41 PM
-- Server version: 5.7.9
-- PHP Version: 5.6.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ipms`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic_name` varchar(255) NOT NULL,
  `official_tel` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_person1` varchar(255) NOT NULL,
  `contact_tel1` varchar(20) NOT NULL,
  `contact_person2` varchar(255) NOT NULL,
  `contact_tel2` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `clinic_name`, `official_tel`, `address`, `contact_person1`, `contact_tel1`, `contact_person2`, `contact_tel2`, `email`) VALUES
(1, 'Customer1', '0123-456', 'Address', 'contact person11', '16731-36331', 'contact person2', '1646-436446', 'test@aivalabs.com'),
(2, 'user2', '7298439', 'sdfsdfs', 'sdfsdf', '46546', 'sfsdf', '454654', 'sdf@sdfsd'),
(3, 'user1', '12345', 'add ress', 'person', '123346', 'ghjjkj', '4565', 'test@aivalabs.com');

-- --------------------------------------------------------

--
-- Table structure for table `payment_plan`
--

DROP TABLE IF EXISTS `payment_plan`;
CREATE TABLE IF NOT EXISTS `payment_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(255) NOT NULL,
  `contract_date` date NOT NULL,
  `customer_id` int(11) NOT NULL,
  `device_model` varchar(255) NOT NULL,
  `serial_no` varchar(255) NOT NULL,
  `invoice_amount` int(11) NOT NULL,
  `down_payment` int(11) NOT NULL,
  `schedule` int(11) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `installment_no` int(11) NOT NULL,
  `installment_amount` int(11) NOT NULL,
  `first_installment_due_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_plan`
--

INSERT INTO `payment_plan` (`id`, `invoice_no`, `contract_date`, `customer_id`, `device_model`, `serial_no`, `invoice_amount`, `down_payment`, `schedule`, `notes`, `installment_no`, `installment_amount`, `first_installment_due_date`) VALUES
(1, 'QWD-546464', '2016-12-01', 1, 'Device Model1123', 'sn_46731313', 4587, 500, 1, 'Notes write', 11, 0, '2016-12-16'),
(2, 'sdfs2', '2016-12-07', 2, 'sdfsdf', 'sdfsdfsdf', 56465, 1564, 2, 'sdfsdfsdf', 5, 0, '2016-12-07'),
(3, 'INVOICE123456', '2016-12-12', 1, 'DM-123434', 'SN-132', 5000, 500, 1, 'Notes', 6, 800, '2016-12-12'),
(4, 'Invoice-999', '2016-08-02', 3, 'DV_ser1231', 'CN_123', 5900, 600, 1, 'notes', 8, 700, '2016-08-12');

-- --------------------------------------------------------

--
-- Table structure for table `pay_status`
--

DROP TABLE IF EXISTS `pay_status`;
CREATE TABLE IF NOT EXISTS `pay_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payment_plan_id` int(11) NOT NULL,
  `serial` int(11) NOT NULL,
  `due_amount` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `paid_amount` int(11) DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pay_status`
--

INSERT INTO `pay_status` (`id`, `payment_plan_id`, `serial`, `due_amount`, `due_date`, `paid_amount`, `paid_date`) VALUES
(1, 1, 1, 371, '2016-11-16', 400, '2016-12-02'),
(2, 1, 2, 371, '2017-01-16', 200, '2016-12-02'),
(3, 1, 3, 371, '2016-02-16', NULL, NULL),
(4, 1, 4, 371, '2017-03-16', NULL, NULL),
(5, 1, 5, 371, '2017-04-16', NULL, NULL),
(6, 1, 6, 371, '2017-05-16', NULL, NULL),
(7, 1, 7, 371, '2017-06-16', NULL, NULL),
(8, 1, 8, 371, '2017-07-16', NULL, NULL),
(9, 1, 9, 371, '2017-08-16', NULL, NULL),
(10, 1, 10, 371, '2017-09-16', NULL, NULL),
(11, 1, 11, 377, '2017-10-16', NULL, NULL),
(12, 2, 1, 10980, '2016-12-07', NULL, NULL),
(13, 2, 2, 10980, '2017-03-07', NULL, NULL),
(14, 2, 3, 10980, '2017-06-07', NULL, NULL),
(15, 2, 4, 10980, '2017-09-07', NULL, NULL),
(16, 2, 5, 10981, '2017-12-07', NULL, NULL),
(17, 3, 1, 800, '2016-12-12', NULL, NULL),
(18, 3, 2, 800, '2017-01-12', NULL, NULL),
(19, 3, 3, 800, '2017-02-12', NULL, NULL),
(20, 3, 4, 800, '2017-03-12', NULL, NULL),
(21, 3, 5, 800, '2017-04-12', NULL, NULL),
(22, 3, 6, 500, '2017-05-12', NULL, NULL),
(23, 4, 1, 700, '2016-08-12', NULL, NULL),
(24, 4, 2, 700, '2016-09-12', NULL, NULL),
(25, 4, 3, 700, '2016-10-12', NULL, NULL),
(26, 4, 4, 700, '2016-11-12', NULL, NULL),
(27, 4, 5, 700, '2016-12-12', NULL, NULL),
(28, 4, 6, 700, '2017-01-12', NULL, NULL),
(29, 4, 7, 700, '2017-02-12', NULL, NULL),
(30, 4, 8, 400, '2017-03-12', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `type`) VALUES
(1, 'Monthly'),
(2, 'Every 3 months'),
(3, 'Every 6 months'),
(4, 'Annually');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
CREATE TABLE IF NOT EXISTS `test` (
  `sd` date NOT NULL,
  `s` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
